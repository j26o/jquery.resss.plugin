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
			      totalPg:  	null,
			      allimgs: 		null,
			      idletime: 	null,
			      idlemode: 	false,
			      curPg: 		0
			    }, options);
			 
				 _this = $(this);
				 var $this = $(this),
				     data = $this.data('resss');
					
					// initial settings
					settings.allimgs = _this.find('li');
					settings.totalPg = settings.allimgs.length;

					if(settings.controls) methods.initControls();

					methods.positionImages();
					methods.resetImages();
				    methods.addListeners();
				    methods.initTimers();
				     
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
			for (var i = 0; i < settings.totalPg; i++ ){
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
			$(window).bind({ 'resize.resss': function(e){methods.reposition();} });

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
		reposition : function( ) {
			methods.positionImages();
			if(settings.autoplay) methods.ssplay();
		},
		swipe : function(event, direction, distance, duration, fingerCount){
			if(direction=='left') methods.slideNext();
			if(direction=='right') methods.slidePrev();
		},
		positionImages : function(){
			switch (settings.valign) {
				case 'top':
					console.log('top');
					break;
				case 'middle':
					settings.allimgs.each(function(i){
						var l = $(this);
						l.css({display:'block'});
						var t = (l.find('img').height() - _this.height()) / 2;
						$(this).find('img').css({top:-t});
						methods.resetImages();
					});
					break;
				case 'bottom':
					console.log('bottom');
					break;
				default:
					console.log('default');
			} 
		},
		slideNext : function(){
			var pl = $(settings.allimgs[settings.curPg]);
			++settings.curPg;
			if(settings.curPg > settings.totalPg-1) settings.curPg = 0;

			var l = $(settings.allimgs[settings.curPg]);
			l.css({display:'block',opacity:0}).stop(true).animate({opacity:1},settings.animspeed,settings.easing);
			pl.stop(true).animate({opacity:0},settings.animspeed,settings.easing,function(){pl.css({display:'none',opacity:0})});

			methods.resetCtrls();
		},
		slidePrev : function(){
			var pl = $(settings.allimgs[settings.curPg]);
			--settings.curPg;
			if(settings.curPg < 0) settings.curPg = settings.totalPg-1;

			var l = $(settings.allimgs[settings.curPg]);
			l.css({display:'block',opacity:0}).stop(true).animate({opacity:1},settings.animspeed,settings.easing);
			pl.stop(true).animate({opacity:0},settings.animspeed,settings.easing,function(){pl.css({display:'none',opacity:0})});

			methods.resetCtrls();
		},
		gotoSlide : function(i){
			console.log(i);
			var pl = $(settings.allimgs[settings.curPg]);
			var l = $(settings.allimgs[i]);

			settings.curPg = i;

			l.css({display:'block',opacity:0}).stop(true).animate({opacity:1},settings.animspeed,settings.easing);
			pl.stop(true).animate({opacity:0},settings.animspeed,settings.easing,function(){pl.css({display:'none',opacity:0})});
		},

		resetImages : function(){
			$(settings.allimgs).each(function(i){
				if(i != settings.curPg)$(settings.allimgs[i]).css({opacity:0,display:'none'});
				else $(settings.allimgs[i]).css({opacity:1,display:'block'});
			});
		},
		destroy : function( ) {

			return this.each(function(){

				var $this = $(this),
				    data = $this.data('resss');

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