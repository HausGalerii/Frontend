//2019-08-22
axs.menuPage={
	opts:{  root:null, rootMargin:'0px',  threshold:[0, 1.0]	},
	init:function(s){
		if (!this.observer) this.observer=new IntersectionObserver(this.onview,this.opts);
		var el=document.querySelectorAll(s);
		for(var i=0, l=el.length; i<l; i++) if (!axs.class_has(el[i],'view-observing')) {
			axs.class_add(el[i],'view-observing');
			this.observer.observe(el[i]);
			if (el[i].id) {
				var a=document.querySelectorAll('nav a[href^="#'+el[i].id+'"]');
				for(var ii=0, ll=a.length; ii<ll; ii++) a[ii].addEventListener('click',function(){	axs.menu.currentSet(this);	});
				}
			}
		},
	onview:function(entries){
		entries.forEach(entry=>{
			if(!entry.intersectionRatio>0) axs.class_rem(entry.target,'view-on');
			else axs.class_add(entry.target,['view','view-on']);
			});
		}
	};
//2019-08-22