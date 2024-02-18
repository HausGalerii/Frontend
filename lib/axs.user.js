//2021-02-03
axs.user={
	nr:0,
	serverResponse:"",
	init:function(interval){
		this.interval=interval;
		document.write('<span id="axs_user_refresh" class="js_hide" lang="en">keepalive:</span>');
		this.display=document.getElementById("axs_user_refresh");
		window.setInterval("axs.user.refresh();", this.interval*1000);
		},//</init()>
	refresh:function(){
		this.nr++;
		var url=new String(window.location).replace(/#.*$/,'');
		axs.ajax(axs.url(url,{'axs%5Blogin%5D%5Bkeepalive%5D':this.nr}),function(status,content){
			content=content.responseText.substring(0,99).replace("<", "&lt;");
			document.getElementById('axs_user_refresh').innerHTML=(content) ? content:'keepalive try: '+axs.user.nr+'(*'+axs.user.interval+'s)';
			});
		},//</refresh()>
	window_size_send:function(){
		var a=axs.fn_args(arguments,{'id':'','attr':false});
		var win=axs.window_size();
		win={
			'axs[window_size]':win.w+'x'+win.h,	'axs[screen_size]':screen.width+'x'+screen.height, 'axs[pixel_ratio]':(window.devicePixelRatio)?window.devicePixelRatio:'?'
			};
		var el=document.getElementById(a.id);
		if (a.attr) el.setAttribute(a.attr,axs.url(el.getAttribute(a.attr),win));
		else for(k in win){
			var input=document.createElement('input');
			input.type='hidden';
			input.name=k;
			input.value=win[k];
			el.appendChild(input);
			}
		}//</axs.user.window_size_send()>
	}//</class::axs.user>
//2013-02-20