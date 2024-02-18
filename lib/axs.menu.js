//2022-07-29
/* Script for UI elements: 
	* navigation menus
	* element toggle switch
Requires files "axs.css" and "axs.js" included first. 

Include the script in the <head>: 
<link href="axs.css" type="text/css" rel="stylesheet" media="screen" />
<script src="axs.js"></script>
<script src="axs.menu.js"></script>

Menu HTML structure supported by this script: 
<nav id="menu1">
	<h2 class="title"><a class="toggle-switch"><span class="icon"></span> Menu</a></h2>
	<ul>
{$menu1}
	</ul>
	<script>axs.menu.attach("menu1",{'dropdown':true,'dropout':true,'toggle':true,'fixed':true});</script>
</nav>
Language selector dropdown example: 
<nav id="langs" class="langs">
	<h2><a class="current toggle-switch" href="#langs"><span lang="en">Language:</span>{$lang.current}</a></h2>
	<ul>{$lang.list}</ul>
	<script>axs.menu.attach("langs",{"toggle":true});</script>
</nav>

Function arguments for attach(): 
	0: ID of the menu element. 
	1: Config options: 
		dropdown: enable dropdown menu functionality;
		toggle: enable menu toggle switch (mostly used for mobil layout but not only);
		Any config keys that evaluate to TRUE will be added as classnames. Unlisted classnames can also be added this way. 
*/
axs.menu={
	cfg:{},
	defaults:{'dropdown':false,'dropout':false,'drophover':false,'toggle':false,'open':false,'closed':false,'mobile_fixed':false,'ajax':false},
	init:function(){
		var menus=document.querySelectorAll('nav.menu');
		for (var i=0, len=menus.length; i<len; ++i) this.attach(menus[i]);
		},//</init()>
	attach:function(node){//<Attach functions to menus />
		var a=axs.fn_args(arguments,{'node':null,'cfg':{}});
		if (typeof(node)==='string') node=document.getElementById(node);
		if (typeof(this.cfg[node.id])==="undefined") this.cfg[node.id]={};
		for (k in this.defaults) {
			if (typeof(a.cfg[k])!=="undefined") this.cfg[node.id][k]=a.cfg[k];
			if (typeof(this.cfg[node.id][k])==="undefined") this.cfg[node.id][k]=this.defaults[k];
			}
		for (k in this.cfg[node.id]) if (this.cfg[node.id][k]) axs.class_add(node,k);
		if (axs.class_has(node,['toggle','mobile_toggle','screen_toggle'])) this.toggle(node);
		if (axs.class_has(node,'dropdown')) this.dropdown(node);
		if (axs.class_has(node,'ajax')) this.ajaxNav(node.querySelectorAll('li>a'),this.cfg[node.id].ajax);
		},//</attach()>
	ajaxNav:function(links){
		var a=axs.fn_args(arguments,{'node':null,'target':true});
		if ((!a.target)||(a.target===true)) a.target='#content';
		for (var i=0; i<links.length; i++) {
			links[i].setAttribute('data-target',a.target);
			links[i].addEventListener('click',function(e){
				if (axs.menu.hasSubmenu(this)) return;
				e.preventDefault();
				axs.ajax(this.href+' '+this.getAttribute('data-target'), this.getAttribute('data-target'));
				axs.menu.currentSet(this);
				});
			}
		},//</ajaxNav()>
	currentSet:function(node){
		axs.class_rem(axs.elementParent(node,'nav').querySelectorAll('.submenu.open, .current'),['open','current']);
		var li=axs.elementParent(node,'li');
		axs.class_add((li)?li:node,'current');
		while(node=axs.elementParent(node,'.submenu')) axs.class_add(node,'open');
		},//</currentSet()>
	toggle:function(menu){//<Close menu />
		axs.class_add(menu,'js');
		if (axs.class_has(menu,'mobile_fixed')) axs.class_add(document.querySelector('body'),'mobile_menu-fixed');
		if ((axs.class_has(menu,'toggle'))&&(axs.cookie_get('axs[menu]['+menu.id+'][closed]')==='1')) {
			axs.class_rem(menu,'open');
			axs.class_add(menu,'closed');
			}
		var sw=menu.querySelectorAll('.toggle-switch');
		for (var i=0, len=sw.length; i<len; ++i){
			sw[i].addEventListener('click',function(e){
				e.preventDefault();
				var menu=this.closest('nav, .toggle, .mobile_toggle, .screen_toggle');
				if(!menu) return axs.log('axs.menu.toggle','No parent like "nav" or ".toggle" found');
				axs.class_tgl(menu,['open','closed']);
				axs.cookie_set('axs[menu]['+menu.id+'][closed]',(axs.class_has(menu,'closed'))?'1':'0');
				});
			}
		},//</toggle()>
	dropdown:function(menu){//<Function to build dropdown menus />
		axs.class_add(menu,'js');
		if (!axs.class_has(menu,'dropout')) axs.class_add(menu.querySelectorAll("li.submenu.open, li.submenu.current"),'js_open');
		var el=menu.querySelectorAll("li>a");
		for (var i=0; i<el.length; i++) {
			el[i].addEventListener('click',function(e){
				var submenu=this.parentNode.querySelector('ul');
				if (!submenu) return true;
				var li=this.parentNode;
				var action=(axs.class_has(li,'js_open')) ? 'close':'open';
				axs.menu.dropdownClose(li.parentNode.childNodes);
				if (action==='open') {	axs.class_rem(li,'js_close');	axs.class_add(li,'js_open');	}
				if (submenu) e.preventDefault();//return false;
				});
			if (axs.class_has(menu,'drophover')) el[i].addEventListener('mouseout',function(e){
				var li=this.parentNode;
				if (axs.class_has(li,'js_open')) return;
				else axs.class_add(li,'js_open');
				axs.menu.dropdownClose(li.parentNode.childNodes);
				});
			}
		var el=menu.querySelectorAll("a");
		for (var i=0; i<el.length; i++) el[i].addEventListener('focus',function(e){
			if (!axs.class_has(this.parentNode,'js_open')) axs.menu.dropdownClose(this.parentNode.parentNode.childNodes);
			return false;
			});
		el[i-1].addEventListener('blur',function(){
			var li=this.parentNode;
			while (li.parentNode.tagName.toLowerCase()==='ul'||li.parentNode.tagName.toLowerCase()==='li') li=li.parentNode;
			axs.menu.dropdownClose(li.childNodes);
			});
		},//</dropdown()>
	dropdownClose:function(li){//<Close dropdown menu branches />
		for(var i=0; i<li.length; i++) if ((li[i].tagName)&&(li[i].tagName.toLowerCase()==='li')) {
			if (!axs.class_has(li[i],'js_open')) continue;
			var that=li[i];
			axs.class_add(li[i],'js_close');
			axs.class_rem(li[i],'js_open');
			var ul=li[i].querySelector('ul');
			if (ul) {
				if (window.getComputedStyle(ul).getPropertyValue('animation-name')!='none') li[i].addEventListener("animationend",function(){
					axs.class_rem(that,'js_close');
					});
				else axs.class_rem(li[i],'js_close');
				}
			}
		},//</dropdownClose()>
	hasSubmenu:function(a){
		var submenu=a.parentNode.querySelector('ul');
		if ((submenu)||(axs.class_has(a.parentNode,'submenu'))) return true;
		},//</hasSubmenu()>
	/*<To top inpage navigation button>*/
	inpageTopNavNodes:[],
	inpageTopNavInit:function(node){
		this.inpageTopNavNodes[this.inpageTopNavNodes.length]={show:false,node:node};
		axs.class_add(node,['js']);
		var fn=function(){
			var h=window.innerHeight;
			var pos=window.scrollY||document.documentElement.scrollTop;
			var show=((pos<(h/4))/*||(document.body.offsetHeight-pos<=h)*/) ? false:true;
			for(var i=0; i<axs.menu.inpageTopNavNodes.length; i++) {
				if((show)&&(!axs.menu.inpageTopNavNodes[i].show)) {
					axs.class_add(axs.menu.inpageTopNavNodes[i].node,'show');
					axs.class_rem(axs.menu.inpageTopNavNodes[i].node,'hide');
					}
				if((!show)&&(axs.menu.inpageTopNavNodes[i].show)) {
					axs.class_add(axs.menu.inpageTopNavNodes[i].node,'hide');
					axs.class_rem(axs.menu.inpageTopNavNodes[i].node,'show');
					}
				axs.menu.inpageTopNavNodes[i].show=show;
				}
			};
		fn();
		window.addEventListener('scroll',fn);
		},//</inpageTopNav()>
	/*</To top inpage navigation button>*/
	
	/*<Fixed elements on page>
	Supports the following HTML structure:
	<header id="id" class="sticky-position top">
		Lorem ipsum...
	</header>
	<script>axs.menu.fixed("id");</script>
	Available classes are: sticky-position fixed-position top bottom
	*/
	/*fixedEl:{},
	fixedSizeCheck:false,
	fixed:function(id){
		var a=axs.fn_args(arguments,{id:'',cfg:{type:'fixed',pos:'top'}});
		node=document.getElementById(id);
		axs.class_add(node,[a.cfg.type+'-position',a.cfg.pos,'js']);
		//var type=(axs.class_has(node,'sticky-position')) ? 'sticky':'fixed';
		//var pos=(axs.class_has(node,'bottom')) ? 'bottom':'top';
		var placeholder=document.getElementById(id+'_placeholder');
		if (!placeholder) {
			placeholder=document.createElement('div');
			placeholder.id=id+'_placeholder';
			placeholder.className='fixed_placeholder '+a.cfg.type;
			if (a.cfg.type==='sticky') node.parentNode.insertBefore(placeholder,node);
			else {
				if (a.cfg.pos==='top') document.querySelector('body').insertBefore(placeholder,document.querySelector('body').firstChild);
				else window.addEventListener('load',function(){
					document.querySelector('body').appendChild(placeholder);
					axs.menu.fixedSizeSet();
					});
				}
			}
		this.fixedEl[id]={node:node,type:a.cfg.type,pos:a.cfg.pos,placeholder:placeholder};
		this.fixedSizeSet();
		if (!this.fixedSizeCheck) {
			window.addEventListener('resize',this.fixedSizeSet);
			window.addEventListener('resize',this.fixedScroll);
			window.addEventListener('scroll',this.fixedScroll);
			this.fixedSizeCheck=window.setTimeout(function repeat(){
				axs.menu.fixedSizeSet();
				window.setTimeout(repeat,3000);
				},3000);
			}
		},//</fixed()>
	fixedScroll:function(){
		var scrollPos=window.scrollY||document.documentElement.scrollTop;
		for(var id in axs.menu.fixedEl){
			var el=axs.menu.fixedEl[id];
			if(el.pos==='top'){
				if(scrollPos>=el.placeholder.offsetTop) {	axs.class_add(el.node,'isStuck');	axs.class_add(el.placeholder,'isStuck');	}
				else{	axs.class_rem(el.node,'isStuck');	axs.class_rem(el.placeholder,'isStuck');	}
				}
			if(el.pos==='bottom'){
				if(scrollPos>=el.placeholder.offsetTop+parseInt(el.placeholder.style.height)) {	axs.class_add(el.node,'isStuck');	axs.class_add(el.placeholder,'isStuck');	}
				else{	axs.class_rem(el.node,'isStuck');	axs.class_rem(el.placeholder,'isStuck');	}
				}
			}
		},//</fixedScroll()>
	fixedSizeSet:function(){
		for(var id in axs.menu.fixedEl){
			var el=axs.menu.fixedEl[id];
			if (parseInt(el.placeholder.style.height)!=el.node.offsetHeight) el.placeholder.style.height=el.node.offsetHeight+'px';
			}
		},//</fixedSizeSet()>
	/*</Fixed elements on page>*/
	
	/*<Tabs functionality>
	Supports the following HTML structure:
	<div class="tabs">
		<ul class="nav"><li class="current"><a href="#tab1">lorem</a></li><li><a href="#tab2">ipsum</a></li></ul>
		<div id="tab1" class="tab current">Lorem ipsum...</div>
		<div id="tab2" class="tab">Dolor sit amet...</div>
	</div>
	<script>axs.menu.tabs("div.tabs");</script>*/
	/*tabs:function(node){
		if (typeof(node)==='string') node=document.querySelector(node);
		if (!node) return axs.log('axs.menu.tabs','Node not found!');
		axs.class_add(node,'js');
		var el=node.querySelectorAll('.tab');//<Prevent window hash scroll />
		for (var i=0, len=el.length; i<len; ++i) el[i].setAttribute('id',el[i].id+'-js');
		
		var el=node.querySelectorAll('.nav>*>a');//<Set click events />
		for (var i=0, len=el.length; i<len; ++i) el[i].addEventListener('click',function(e){
			e.preventDefault();
			axs.menu.tabsCurrentSet(this.getAttribute('href'));
			});
		//<Set current tab if hash present in URL />
		if ((window.location.hash)&&(node.querySelector('.nav>li a[href="'+window.location.hash+'"]'))) this.tabsCurrentSet(window.location.hash);
		//<Set first tab as current if current still not set />
		if (!node.querySelector('.nav>*.current')) this.tabsCurrentSet(node.querySelector('.nav>*>a').getAttribute('href'));
		},//<tabs()>
	tabsCurrentSet:function(id){
		var p=document.querySelector(id+'-js').parentNode;
		while (!axs.class_has(p,'tabs')) p=p.parentNode;
		axs.class_rem(p.querySelectorAll('.nav>li, .tab'),'current');
		axs.class_add(p.querySelector('.nav>li a[href="'+id+'"]').parentNode,'current');
		axs.class_add(p.querySelector(id+'-js'),'current');
		}//</tabsCurrentSet()>*/
	}//</class::axs.menu>
axs.menu.init();
//2010-01-07