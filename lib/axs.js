//2023-10-14
// AXIS NET JS framework
function axs(global_name){
	this.global_name=global_name;
	window[this.global_name]=this;
	//var THIS=this;
	this.keycodes={esc:27,left:37,up:38,right:39,down:40,tab:9,enter:13,space:32};
	this.db={};
	this.tmp='';
	//<Methods>
	this.conf=function(conf){
		var def={SITE_ROOT:'',PATH_CMS:'',PATH_EXT:false,logURL:false};
		for (var k in def) this[k]=(typeof(conf[k])!=='undefined') ? conf[k]:def[k];
		},//</conf()>
	this.ajax=function(){
		var a=this.fn_args(arguments,{url:null,target:function(){},cfg:{}});
		var tmp={post:null,async:true,extractContent:null};
		for (var k in tmp) a[k]=(typeof(a.cfg[k])!=='undefined') ? a.cfg[k]:tmp[k];
		if ((typeof(a.url)==='string')&&(a.url.indexOf(' ')>0)) {
			a.extractContent=a.url.substr(a.url.indexOf(' ')+1)//Order is important!
			a.url=a.url.substr(0,a.url.indexOf(' '));
			}
		var ajax=new XMLHttpRequest();
		//<Set up target />
		if (!a.target) a.target=function(){};
		if (typeof(a.target)==='string') {
			var tmp=a.target;
			a.target=document.querySelector(a.target);
			if (!a.target) return this.log('ajax','Target not found ("'+tmp+')');
			}
		ajax.axs=a;
		if (typeof(a.target)!=='function') {
			axs.class_rem(a.target,'ajax-ready');
			ajax.axs.throbber=this.ui.throbber(a.target);
			}
		//<Perform request />
		ajax.open((a.post)?'POST':'GET',this.url(a.url,{"axs_random":Math.random()}),a.async);
		if(a.post){
			ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			//ajax.setRequestHeader("Content-length", a.post.length);
			}
		ajax.onreadystatechange=function(){
			if (this.readyState!=4) return;
			if (typeof(this.axs.target)==='function') return this.axs.target(this.status,this);
			if (this.status==200) {
				axs.class_rem(this.axs.target,'throbber');
				axs.class_add(this.axs.target,'ajax-ready');
				var content=axs.ajax_body(this.responseText,this.axs);
				this.axs.target.innerHTML=content;
				var scripts=this.axs.target.querySelectorAll('script');
				for(var i=0; i<scripts.length; i++) if (scripts[i].innerHTML) eval(scripts[i].innerHTML);
				}
			else this.axs.throbber.msg('Request failed:'+this.status+' ('+this.statusText+')');
			}
		ajax.send(a.post);
		if (ajax.responseText) return ajax.responseText;
		}//</ajax()>
	this.ajax_body=function(html){
		var a=this.fn_args(arguments,{html:'',cfg:{}});
		if (a.cfg.extractContent){
			parser=new DOMParser();
			var dom=parser.parseFromString(html,"text/html");
			dom=dom.querySelectorAll(a.cfg.extractContent);
			html='';
			for(var i=0; i<dom.length; i++) html+=dom[i].outerHTML;
			return html;
			}
		var body=/<body.*?>([\s\S]*)<\/body>/.exec(html);
		if (body) html=body[1];
		return html;
		}//</ajax_body()>
	this.class_add=function(el,c){
		if(el.nodeType) el=[el];
		if(typeof(c)==='string') c=[c];
		for(var i=0; i<el.length; i++) for(var ii=0; ii<c.length; ii++) el[i].classList.add(c[ii]);
		}//</class_add()>
	this.class_has=function(el,c){//<Return the number of matched classnames />
		if(typeof(c)==='string') c=[c];
		for(var i=0, f=0; i<c.length; i++) if (el.classList.contains(c[i])) f++;
		return f;
		}//</class_has()>
	this.class_rem=function(el,c){
		if(el.nodeType) el=[el];
		if(typeof(c)==='string') c=[c];
		for(var i=0; i<el.length; i++) for(var ii=0; ii<c.length; ii++) el[i].classList.remove(c[ii]);
		}//</class_rem()>
	this.class_tgl=function(el,c){
		if(el.nodeType) el=[el];
		if(typeof(c)==='string') c=[c];
		for(var i=0; i<el.length; i++) for(var ii=0; ii<c.length; ii++) el[i].classList.toggle(c[ii]);
		}//</class_tgl()>
	this.cookie_del=function(name,path,domain){
		if (this.cookie_get(name)) this.cookie_set(name,"",-1,path,domain);
		}//</cookie_del()>
	this.cookie_get=function(name){
		name=name.replace(/\[/g,'\\[');
		name=name.replace(/\]/g,'\\]');
		var regexp=new RegExp("(?:^"+name+"|;\\s*"+name+")=(.*?)(?:;|$)","g");
		var result=regexp.exec(document.cookie);
		return (result===null) ? null:decodeURIComponent(result[1]);
		}//</cookie_get()>
	this.cookie_set=function(name,value){
		var a=this.fn_args(arguments,{name:'',value:'',expires:0,path:false,domain:false});
		var cookie=a.name+"="+escape(a.value)+";";
		if (a.expires){//<If it's a date />
			if(a.expires instanceof Date) {	if (isNaN(a.expires.getTime())) a.expires=new Date();	}//<If it isn't a valid date />
			else a.expires=new Date(new Date().getTime()+parseInt(a.expires)*1000*60*60*24);
			cookie+="expires="+a.expires.toGMTString()+";";
			}
		if (a.path) cookie+="path="+a.path+";";
		if (a.domain) cookie+="domain="+a.domain+";";
		document.cookie=cookie;
		}//</cookie_set()>
	this.elementCreate=function(type='',attr={},content=null){
		var el=document.createElement(type);
		for(k in attr){	el.setAttribute(k,attr[k]);	}
		if(content!==null) el.innerHTML=content;
		return el;
		};//</elementCreate()>
	this.elementParent=function(node,s){//<Find the parent node that matches the selector />
		for(var p=node; !p.matches('body'); p=p.parentNode){
			if(p.matches(s)) return p;
			if(!p) break;
			}
		};//</elementParent()>
	this.fn_args=function(args,names){//var a=axs.fn_args(arguments,{});
		var a={};
		var i=0;
		for (k in names) {
			a[k]=(typeof(args[i])!=='undefined') ? args[i]:names[k];
			i++;
			}
		return a;
		}//</fn_args()>
	this.get=function(k,obj,deflt){//var a=axs.fn_args(arguments,{});
		return ((obj)&&(typeof(obj)==='object')&&(typeof(obj[k])!=='undefined')) ? obj[k]:deflt;
		}//</fn_args()>
	this.htmlEsc=function(text){
		return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
		}//</htmlSpecialChars()>
	this.log=function(msgtype,msg){
		console.log(msgtype+':',msg);
		if (this.logURL) this.ajax(this.logURL, null, {post:'type='+escape(msgtype)+'&msg='+escape(msg)+'&url='+escape(window.location.href)});
		}
	this.mediaState=function(){//<Set media state provided by currently active CSS mediaquery />
		var el=document.getElementById('axs_media');
		if (!el) {
			var b=document.querySelector('body');
			if (!b) return {};
			el=this.elementCreate('div',{id:'axs_media',style:'position:absolute;left:-999em;top:-999em;visibility:hidden;'});
			b.insertBefore(el,b.childNodes[0]);
			}
		this.media={
			type:window.getComputedStyle(el,'::before').getPropertyValue('content').replace(/"/g,''),
			q:parseInt(window.getComputedStyle(el,'::before').getPropertyValue('z-index'),10)
			}
		var el=document.querySelector('html');
		el.className=el.className.replace(/\bmedia-[a-z]+-.*\b/g,'');
		for (k in this.media) this.class_add(el,'media-'+k+'-'+this.media[k]);
		return this.media;
		}//</mediaState()>
	this.url=function(url=false,set={},base=false){
		url=new URL(url,(base)?base:document.location.href);
		for (k in set){	url.searchParams.set(k,set[k]);	}
		return url;
		}//</url()>
	this.url_get=function(key=false,url=false){
		var url=new URLSearchParams((url)?url:document.location.search);
		if (key) return url.get(key);
		return url.getAll();
		return url[a.key];
		}//</url_get()>
	/*this.window_open=function(e){ //Create the new window
    	e.preventDefault();
		this.window_open_ref=window.open(this.href, '_blank');// Change "_blank" to something like "newWindow" to load all links in the same new window
	    this.window_open_ref.focus();
    	}*///</window_open()>
	this.window_popup=function(e){
		e.preventDefault();
		this.windowPopup_ref=window.open(this.href, 'axs_popup', 'scrollbars=1,location=0,resizable=1,toolbar=0,status=1,width=750,height=500,top=50,left=40');
	    this.windowPopup_ref.focus();
		}//</windowPopup()>
	this.window_resize=function(){
		var tmp=this.fn_args(arguments,{cfg:{}});
		var resize=true;
		if ((!window.toolbar.visible)||(!window.menubar.visible)) resize=false;
		if ((window.name=='axs_popup')||(tmp.cfg.force)) resize=true;
		if (!resize) return;
		var a={'pos':[40,40,40,40],'iw':0,'ih':0,'ow':0,'oh':0};
		for(k in tmp.cfg) a[k]=tmp.cfg[k];
		//Set window position
		if (a.pos.length===1) a.pos=[a.pos[0],a.pos[0]];
		if (a.pos.length===2) a.pos=[a.pos[0],a.pos[1],a.pos[0],a.pos[1]];
		window.moveTo(a.pos[0],a.pos[1]);
		//Set window outer size
		ow_max=screen.width-a.pos[1]-a.pos[3];
		oh_max=screen.height-a.pos[0]-a.pos[2];
		if (a.ow<2) a.ow=ow_max;
		if (a.oh<2) a.oh=oh_max;
		if ((a.iw)||(a.ih)) {//If window inner size
			var tools_w=window.outerWidth-document.documentElement.clientWidth;
			var tools_h=window.outerHeight-document.documentElement.clientHeight;
			if (a.iw>1) a.ow=a.iw+tools_w;
			if (a.ih>1) a.oh=a.ih+tools_h;
			}
		if (a.ow<200) a.ow=200;
		if (a.oh<50) a.oh=50;
		if (a.ow>ow_max) a.ow=ow_max;
		if (a.oh>oh_max) a.oh=oh_max;
		window.resizeTo(a.ow,a.oh);
		}//</windowResize()>
	this.window_scroll=function(e){
		var a=this.getAttribute('href');
		(a==='#') ? window.scroll({top:0,left:0,behavior:'smooth'}):document.querySelector(a).scrollIntoView({	behavior: 'smooth'	});
		history.pushState(null, null, a);
		e.preventDefault();
		}//</windowScroll()>
	this.window_size=function(){
		return {	'w':window.innerWidth,	'h':window.innerHeight	}
		}//</axs.window_size()>
	this.window_visible=function(){
		if (typeof document.hidden!=="undefined") return !document.hidden;
		return true;
		}//</window_visible()>
	//</Methods>
	if (this.logURL) window.addEventListener('error',function(e){
		var stack=e.error.stack;
		var message=e.error.toString();
		if(stack) message+='\n'+stack;
		this.log('error',message);
		});
	this.conf({});
	this.class_add(document.querySelector('html'),'js');
	window.addEventListener('resize',this.mediaState);
	document.addEventListener('DOMContentLoaded',function(e){//<Add function to links with target />
		this.mediaState();
		document.querySelectorAll('*[target="popup"]').forEach((el)=>{	el.addEventListener('click',axs.window_popup,false);	});
		this.ui.overlay.init();
		this.ui.dialog();
		}.bind(this));
	this.ui={
		p:this,
		cssAdd:function(css,classSel){
			var className=classSel.replaceAll('.',' ');
			if(typeof(css)==='string'){
				if(document.querySelector('html>head link.'+classSel)) return;
				document.querySelector('html>head').appendChild(axs.elementCreate('link',{'class':className,type:'text/css', href:css,rel:'stylesheet'}));
				}
			else {
				if(document.querySelector('html>head style.'+classSel)) return;
				var code='';
				for (var k in css) code+='	'+k+' '+css[k]+'\n';
				document.querySelector('html>head').appendChild(axs.elementCreate('style',{'class':className},'\n'+code));
				}
			},//</cssAdd()>
		dialog:function(){
			document.querySelectorAll('*[data-axs-dialog]').forEach((open)=>{
				var node=document.querySelector(open.getAttribute('data-axs-dialog'));
				var dialog=this.p.elementCreate('dialog',{'class':'axs'},'<button class="overlay-close" type="button"><abbr class="axs ui rem" title="close" lang="en">x</abbr></button>');
				open.addEventListener('click',(e)=>{	e.preventDefault();	dialog.showModal();	});
				dialog.querySelector('.overlay-close').addEventListener('click',(e)=>{	e.preventDefault();	dialog.close();	});
				node.querySelectorAll('*').forEach((child)=>{	dialog.append(child);	});
				node.replaceWith(dialog);
				});
			},//</dialog()>
		/*	Create overlay layer and load content. Will be attached to links with target="overlay*", can also be used in other contexts. 
			Supported attributes on links: 
			"target":['overlay', 'overlay.iframe', 'overlay.image']: Element type of overlay. 
			"data-overlay-class"[className]: Add class names to container
			"data-overlay-content"[DOM selector]: Use an element from current page as overlay content. 
			"data-overlay-ajax-selector"[DOM selector]: Extract specific element(s) from the target page if loading content from external URL
		*/
		overlay:{
			src:null,
			container:null,
			contentNode:null,
			focus:false,
			placeholder:false,
			afterCreate:{},
			cfg:{node:null,container:false,className:'',content:''},
			labels:{close:'<abbr class="axs ui rem" title="close" lang="en">x</abbr>',prev:'<abbr title="prev" lang="en">&lt;</abbr>',next:'<abbr title="next" lang="en">&gt;</abbr>'},
			list:[],
			listCurrent:null,
			listSet:null,
			listNode:null,
			init:function(){
				document.querySelectorAll('*[target^="overlay"]').forEach((el)=>{	el.addEventListener('click',this.open.bind(this));	},this);
				window.addEventListener('resize',this.setSize);
				},//</attach()>
			create:function(a){
				for(k in this.cfg) if (!a[k]) a[k]=this.cfg[k];
				this.focus=document.activeElement;
				if (a.node) a.node.blur();
				var content=false;
				switch(a.container){
					case 'iframe':
						a.className+=' content-iframe';
						var contentEl='<iframe class="overlay-content" tabindex="-1" src="'+a.node.getAttribute('href')+'"></iframe>';
						break;
					case 'image':
						a.className+=' content-image';
						var contentEl='<div class="overlay-content" tabindex="-1"><img src="'+a.node.getAttribute('href')+'" alt="'+a.node.getAttribute('href')+'" /></div>';
						break;
					default:
						var contentEl='<div class="overlay-content" tabindex="-1"></div>';
						content=(a.contentNode)?'node':'ajax';
					}
				this.container=axs.elementCreate('div',{'id':'axs_overlay','class':'axs overlay axs_overlay'},'<div><a class="overlay-close" href="#">'+this.labels.close+'</a>'+contentEl+'<div class="overlay-list"></div></div>');
				var el=document.querySelector('#axs_overlay');
				if (el) el.replaceWith(this.container);
				else document.querySelector('body').prepend(this.container);
				if (a.className) this.container.className+=' '+a.className;
				this.contentNode=this.container.querySelector('.overlay-content');
				if (content==='node') this.setContent(document.querySelectorAll(a.contentNode));
				else this.load(url);
				if (axs.class_has(a.node,['axs','img'])===2) this.listCreate(this);
				this.contentNode.focus();
				this.setCloseBtn();
				document.addEventListener('keydown',this.closeKey.bind(this));
				for(k in this.afterCreate) this.afterCreate[k]();
				},//</create()>
			open:function(e){
				e.preventDefault();
				this.create(this.openElAttr(e.currentTarget));
				},//</open()>
			openElAttr:function(el){
				var contentType=el.getAttribute('target').split('.');
				var a={
					node:el,
					container:(contentType[1])?contentType[1]:'html',
					className:el.getAttribute('data-overlay-class'),
					contentNode:el.getAttribute('data-overlay-content'),
					contentURL:(el.href)?el.href:''
					};
				if((!a.contentNode)&&(el.getAttribute('href').charAt(0)==='#')) a.contentNode=el.getAttribute('href');
				//console
				if(el.getAttribute('data-overlay-ajax-selector')) a.contentURL+=' '+el.getAttribute('data-overlay-ajax-selector');
				return a;
				},//</openElAttr()>
			load:function(url){//<Load external content />
				this.src=url;
				axs.class_rem(this.contentNode,['ajax-ready','unload']);
				var el=this.contentNode.querySelector('figure');
				var transition=(el)?getComputedStyle(el).getPropertyValue('transition-duration'):'';
				if (transition) {
					axs.class_add(this.contentNode,'unload');
					transition=parseFloat(transition)*((transition.indexOf('ms')>-1) ? 1:1000);
					window.setTimeout(function(){	axs.ajax(this.src,axs.overlay.contentNode);	}.bind(this),transition+5);
					}
				else axs.ajax(url,this.contentNode);
				},//</load()>
			listCreate:function(node){
				this.list=axs.elementParent(node,'section, main').querySelectorAll('a.axs.img');
				if (this.list.length<=1) return;
				for(var i=0; i<this.list.length; i++) if(this.list[i]===node) this.listCurrent=i+1; 
				this.listNode=document.querySelector('#axs_overlay .overlay-list');
				this.listNode.innerHTML='<a class="scroll prev" href="#axs_overlay">'+this.labels.prev+'</a><span><span class="current">'+(this.listCurrent)+'</span>/<span class="total">'+this.list.length+'</span></span><a class="scroll next" href="#axs_overlay">'+this.labels.next+'</a></span>';
				this.listNode.querySelector('a.prev').onclick=function(e){	e.preventDefault();	this.listScroll('-');	}.bind(this);
				this.listNode.querySelector('a.next').onclick=function(e){	e.preventDefault();	this.listScroll('+');	}.bind(this);
				this.container.addEventListener('swiped-right',function(e){	this.listScroll('-');	}.bind(this));
				this.container.addEventListener('swiped-left',function(e){	this.listScroll('+');	}.bind(this));
				},//</listCreate()>
			listScroll:function(set){
				axs.class_rem(this.contentNode,['prev','next']);
				axs.class_add(this.contentNode,(set==='-')?'prev':'next');
				set=(set==='-') ? this.listCurrent-1:this.listCurrent+1;
				if (set<1) set=this.list.length;
				if (set>this.list.length) set=1;
				this.listCurrent=this.listNode.querySelector('.current').innerHTML=set;
				this.load(this.list[set-1].href);
				},//</listCreate()>
			setCloseBtn:function(){
				this.container.querySelectorAll('a.overlay-close').forEach((el)=>{
					el.onclick=function(e){	e.preventDefault();	this.close();	}.bind(this);
					},this);
				},//</setCloseBtn()>
			setContent:function(el){
				var node=this.container.querySelector('.overlay-content');
				node.innerHTML='';
				if(typeof(el)==='string') node.innerHTML=el;
				else {
					this.placeholder=axs.elementCreate('span',{id:'axs_overlay_placeholder'});
					el[0].before(this.placeholder);
					el.forEach((elem)=>{	node.appendChild(elem);	});
					}
				this.setCloseBtn();
				},//</setContent()>
			setSize:function(){
				var el=document.querySelector('#axs_overlay.content-img .overlay-content img');
				if (!el) return;
				var worig=naturalHeight, o=getComputedStyle(this.container), i=getComputedStyle(this.contentNode);
				var w=this.container.clientWidth-parseInt(o.paddingLeft)-parseInt(o.paddingRight)-parseInt(i.paddingLeft)-parseInt(i.paddingRight);
				var h=this.container.clientHeight-parseInt(o.paddingTop)-parseInt(o.paddingBottom)-parseInt(i.paddingTop)-parseInt(i.paddingBottom);
				if(w>worig) w=worig;
				if(h>horig) h=horig;
				var ratio_orig=worig/horig;
				if (w/h>ratio_orig) w=h*ratio_orig;
				else h=w/ratio_orig;
				el.parentNode.parentNode.style.width=(w+parseInt(i.paddingLeft)+parseInt(i.paddingRight))+'px';
				el.style.width=w+'px';
				el.style.height=h+'px';
				axs.class_rem(this.contentNode,'unload');
				},//setSize()>
			close:function(){//<Remove the overlay element node />
				if(this.placeholder){
					this.container.querySelectorAll('.overlay-content>*').forEach((el)=>{	this.placeholder.before(el);	},this);
					this.placeholder.remove();
					}
				(this.container.id==='axs_overlay')?this.container.remove():axs.class_rem(this.container,'axs_overlay');
				this.container=null;
				this.list=[];
				this.focus.focus();
				document.removeEventListener('keydown',this.closeKey);
				},//</close()>
			closeKey:function(e){	if(e.keyCode===axs.keycodes.esc) this.close();	}//</closeKey()>
			},//</class::overlay>
		throbber:function(node){
			var elems=['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
			if (elems.indexOf(node.tagName.toLowerCase())!==-1) node=node.parentNode;
			this.p.class_add(node,'throbber');
			var throbber=this.p.elementCreate('span',{"class":'axs throbber'},'<span><span lang="en">Loading&hellip;</span></span>');
			node.prepend(throbber);
			o={
				axs:this.p,
				node:throbber,
				msg:function(msg){
					this.node.innerHTML='';
					this.node.appendChild(axs.elementCreate('span',{"class":'msg'},msg+' <input type="button" value="x" title="close" />'));
					this.node.querySelector('input').onclick=this.remove;
					},//</msg()>
				sizeSet:function(){
					this.node.style.marginLeft='-'+window.getComputedStyle(this.node.parentNode, null).getPropertyValue('padding-left');
					this.node.style.marginTop='-'+window.getComputedStyle(this.node.parentNode, null).getPropertyValue('padding-top');
					var s={w:this.node.parentNode.clientWidth,h:this.node.parentNode.clientHeight};
					if (s.w) this.node.style.width=s.w+'px';
					if (s.h>this.node.firstChild.offsetHeight){
						this.node.style.height=s.h+'px';
						var top=(s.h<s.w)?s.h:s.w;
						this.node.firstChild.style.marginTop=(top/2-this.node.firstChild.offsetHeight/2)+'px';
						}
					},//</sizeSet()>
				remove:function(){
					this.axs.class_rem(this.node.parentNode,'throbber');
					this.sizeObserver.unobserve(this.node.parentNode);
					this.node.remove();
					}//</remove()>
				};
			o.sizeObserver=new ResizeObserver(o.sizeSet.bind(o));
			o.sizeObserver.observe(node);
			return o;
			}//</throbber()>
		};//</this.ui>
	}//</class::axs>
axs('axs');
/*!
 * swiped-events.js - v1.1.4
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/swiped-events
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!function(t,e){"use strict";"function"!=typeof t.CustomEvent&&(t.CustomEvent=function(t,n){n=n||{bubbles:!1,cancelable:!1,detail:void 0};var a=e.createEvent("CustomEvent");return a.initCustomEvent(t,n.bubbles,n.cancelable,n.detail),a},t.CustomEvent.prototype=t.Event.prototype),e.addEventListener("touchstart",function(t){if("true"===t.target.getAttribute("data-swipe-ignore"))return;s=t.target,r=Date.now(),n=t.touches[0].clientX,a=t.touches[0].clientY,u=0,i=0},!1),e.addEventListener("touchmove",function(t){if(!n||!a)return;var e=t.touches[0].clientX,r=t.touches[0].clientY;u=n-e,i=a-r},!1),e.addEventListener("touchend",function(t){if(s!==t.target)return;var e=parseInt(l(s,"data-swipe-threshold","20"),10),o=parseInt(l(s,"data-swipe-timeout","500"),10),c=Date.now()-r,d="",p=t.changedTouches||t.touches||[];Math.abs(u)>Math.abs(i)?Math.abs(u)>e&&c<o&&(d=u>0?"swiped-left":"swiped-right"):Math.abs(i)>e&&c<o&&(d=i>0?"swiped-up":"swiped-down");if(""!==d){var b={dir:d.replace(/swiped-/,""),xStart:parseInt(n,10),xEnd:parseInt((p[0]||{}).clientX||-1,10),yStart:parseInt(a,10),yEnd:parseInt((p[0]||{}).clientY||-1,10)};s.dispatchEvent(new CustomEvent("swiped",{bubbles:!0,cancelable:!0,detail:b})),s.dispatchEvent(new CustomEvent(d,{bubbles:!0,cancelable:!0,detail:b}))}n=null,a=null,r=null},!1);var n=null,a=null,u=null,i=null,r=null,s=null;function l(t,n,a){for(;t&&t!==e.documentElement;){var u=t.getAttribute(n);if(u)return u;t=t.parentNode}return a}}(window,document);
//2009-01-23