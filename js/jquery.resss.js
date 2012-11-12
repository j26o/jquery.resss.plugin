/*
 * Responsive Slideshow - jQuery plugin
 *
 * Copyright (c) 2010-2012 Roland Baldovino
 *
 * Project home:
 *   https://github.com/junebaldovino/jquery.resss.plugin
 *
 * Version:  0.1
 *
 */

(function($){
	var _this,settings;
	var methods = {
		init : function( options ) {
			return this.each(function(){
				settings = $.extend( {
			      interval:		3000,
			      animspeed: 	1000,
			      easing: 		'easeOutBack',
			      valign: 		'middle',
			      controls: 	false,
			      cc: 			null,
			      autoplay: 	false,
			      controlsCont: null,
			      total:  		null,
			      allimgs: 		null,
			      idletime: 	null,
			      idlemode: 	false,
			      details:      false,
			      curPg: 		0,
			      imgLoadCount: 0,
			      waitLoad: 	true
			    }, options);
			 
				 _this = $(this);
				 var $this = $(this),
				     data = $this.data('resss');
					
					// initial settings
					settings.allimgs = _this.find('li');
					settings.total = settings.allimgs.length;

					if(settings.controls) methods.initControls();

					methods.preloadImages();
					if(!settings.waitLoad){
						methods.resetImages();
					    methods.addListeners();
					    methods.initTimers();
					}
				     
				if (!data) {
					$(this).data('resss', {
						target : $this
				  	});
				}
			});
		},
		initControls : function(){
			cc = $('<div class="controls" />');
			_this.append(cc);
			for (var i = 0; i < settings.total; i++ ){
				var d = i==0 ? $('<div class="active" />') : $('<div />');
				cc.append(d);
			}
		},
		resetCtrls : function(){
			cc.find('div').each(function(i){
				var li = $(this);
				i == settings.curPg ? li.addClass('active') : li.removeClass('active');
			});
		},
		addListeners : function(){
			// add swipe listeners
			_this.swipe({swipe:function(event, direction, distance, duration, fingerCount) {methods.swipe(event, direction, distance, duration, fingerCount)} });

			// add window resize listeners
			$(window).bind({ 'resize.resss': function(e){methods.onresize();} });

			// add controls listener
			if(settings.controls){
				cc.find('div').each(function(i){
					$(this).bind({
						'click' : function(e){
							if(!$(this).hasClass('active')){
								methods.gotoSlide(i);
								methods.resetCtrls();
							}
						}
					});
				});
			}
		},
		preloadImages : function(){
			imgLoadDone = 0;
			imgCounter = 0;
			
			imgsLoaded = false;

			var c = settings.total;
			
			while(c--){
				$.ajax({
					url: settings.allimgs.find('img').eq(c).attr('src'),
					type: 'HEAD',
					success: function(data) {
						++settings.imgLoadCount;
						if(settings.waitLoad){
							if(settings.imgLoadCount==settings.total){
								methods.finLoad();
							}
						}
						/* else{
						 	methods.showLoadedImg(this['url']);
						} */
					}
				});
			}
			methods.gotoSlide(settings.curPg);
		},
		showLoadedImg : function(url){
			settings.allimgs.find('img').each(function(){if($(this).attr('src')==url)$(this).css({display:'block'});});
		},
		finLoad : function(){
			if(settings.waitLoad){
				methods.resetImages();
			    methods.addListeners();
			    methods.initTimers();
			}
		},
		initTimers : function(){
			if(settings.autoplay) {
				methods.ssplay();
			}else{
				$.idleTimer(settings.interval);

				$(document).bind("idle.idleTimer", function(){
					settings.idlemode = true;
					settings.idletime = setInterval(function(){methods.onIdle()},settings.interval);
				});
				$(document).bind("active.idleTimer", function(){
					settings.idlemode = false;
					clearInterval(settings.idletime);
				});
			}
		},
		ssplay : function(){
			if(settings.idletime != null) clearInterval(settings.idletime);
			settings.idletime = setInterval(function(){methods.ssplay()},settings.interval);
			methods.slideNext();
		},
		onIdle : function() {
			methods.slideNext();
		},
		onresize : function() {	
			if($('.backstretch').length > 1){
				$('.backstretch').eq(0).remove();
			}	
			if(settings.autoplay) methods.ssplay();
		},
		swipe : function(event, direction, distance, duration, fingerCount){
			if(direction=='left') methods.slideNext();
			if(direction=='right') methods.slidePrev();
		},
		slideNext : function(){
			++settings.curPg;
			if(settings.curPg > settings.total-1) settings.curPg = 0;
			
			var src = $(settings.allimgs[settings.curPg]).find('img').attr('src');
			if($('.backstretch').length > 1){
				$('.backstretch').eq(0).animate({opacity:0}, settings.animspeed, settings.easing, function(){$(this).remove();});
			}
			_this.backstretch(src, {fade: settings.animspeed });

			if(settings.details) {
				$(settings.allimgs[settings.curPg]).find('.details').css({display:'block', opacity:0}).animate({opacity:1}, settings.animspeed, settings.easing);
			}

			methods.resetCtrls();
			if(settings.details) methods.resetDetails();
		},
		slidePrev : function(){
			--settings.curPg;
			if(settings.curPg < 0) settings.curPg = settings.total-1;
			var src = $(settings.allimgs[settings.curPg]).find('img').attr('src');
			if($('.backstretch').length > 1){
				$('.backstretch').eq(0).animate({opacity:0}, settings.animspeed, settings.easing, function(){$(this).remove();});
			}
			_this.backstretch(src, {fade: settings.animspeed});
			if(settings.details) {
				$(settings.allimgs[settings.curPg]).find('.details').css({display:'block', opacity:0}).animate({opacity:1}, settings.animspeed, settings.easing);
			}
			
			methods.resetCtrls();
			if(settings.details) methods.resetDetails();
		},
		gotoSlide : function(i){
			settings.curPg = i;
			var src = $(settings.allimgs[settings.curPg]).find('img').attr('src');
			if($('.backstretch').length > 1){
				$('.backstretch').eq(0).animate({opacity:0}, settings.animspeed, settings.easing, function(){$(this).remove();});
			}

			if(settings.details) {
				$(settings.allimgs[settings.curPg]).find('.details').css({display:'block', opacity:0}).animate({opacity:1}, settings.animspeed, settings.easing);
			}

			_this.backstretch(src, {fade: settings.animspeed});
			if(settings.details) methods.resetDetails();
		},

		resetDetails : function(){
			$(settings.allimgs).each(function(i){
				if(i != settings.curPg) $(settings.allimgs[i]).find('.details').css({opacity:0,display:'none'});
			});
		},

		resetImages : function(){
			$(settings.allimgs).each(function(i){
				$(settings.allimgs[i]).find('img').css({opacity:0,display:'none'});
			});

			if(settings.details) methods.resetDetails();
		},
		destroy : function( ) {

			return this.each(function(){

				var $this = $(this),
				    data = $this.data('resss');

				$(window).unbind({ 'resize.resss': function(e){methods.onresize()}});

				$(window).unbind('.resss');
				data.resss.remove();
				$this.removeData('resss');
			});
		}
	};

	$.fn.resss = function(method) {
		if ( methods[method] ) {
		  	return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
		  	return methods.init.apply(this, arguments);
		} else {
		  	$.error('Method ' +  method + ' does not exist on jQuery.resss');
		}
	};

})( jQuery );