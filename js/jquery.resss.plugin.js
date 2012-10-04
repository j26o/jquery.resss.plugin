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
	var settings = {
      interval:		'3000',
      easing: 		'easeOutBack',
      valign: 		'middle',
      controls: 	false,
      controlsCont: null,
      totalPg:  	null,
      allimg: 		null
    };
    var _this;
	var methods = {
		init : function( options ) {
			return this.each(function(){
			 
			 _this = $(this);
			 var $this = $(this),
			     data = $this.data('resss');
				
				// initial settings
				settings.allimg = _this.find('img');
				settings.totalPg = settings.allimg.length;

				methods.positionImages();
			    methods.addListeners();
			     
			 if (!data) {
			   $(this).data('resss', {
			       target : $this
			   });
			 }
			});
		},
		addListeners : function(){
			// add swipe listeners
			_this.swipe({swipe:function(event, direction, distance, duration, fingerCount) {methods.swipe(event, direction, distance, duration, fingerCount)} });

			$(window).bind({ 'resize.resss': function(e){methods.reposition();} });
		},
		swipe : function(event, direction, distance, duration, fingerCount){
			console.log(direction);
		},
		positionImages : function(){
			switch (settings.valign) {
				case 'top':
					console.log('top');
					break;
				case 'middle':
					settings.allimg.each(function(i){
						var t = ($(this).height() - _this.height()) / 2;
						$(this).css({top:-t});
					});
					break;
				case 'bottom':
					console.log('bottom');
					break;
				default:
					console.log('default');
			} 
		},
		destroy : function( ) {

			return this.each(function(){

				var $this = $(this),
				    data = $this.data('resss');

				$(window).unbind('.resss');
				data.resss.remove();
				$this.removeData('resss');
			});

		},
		reposition : function( ) {
			methods.positionImages();
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