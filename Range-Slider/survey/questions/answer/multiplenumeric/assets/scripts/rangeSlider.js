
/***** 
    JavaScript for the Range Slider question theme
    Copyright (C) 2021 - Tony Partner (http://partnersurveys.com)
    Licensed MIT, GPL
    Version - 1.0
    Create date - 13/01/2021
*****/



//@name			| rangeSlider
//@author		| Tony Partner - http:partnersurveys.com
//@updated_at	| 13/01/2021 08:00:00
//@description	| Insert a range slider

(function( $ ){

	$.fn.rangeSlider = function(options) {

		var opts = $.extend( {
			//sliderMin: 0,
			//sliderMax: 100,
			//sliderStep: 1,
			//sliderLow: opts.sliderMin + ((opts.sliderMax-opts.sliderMin)/3),
			//sliderHigh: opts.sliderMin + (((opts.sliderMax-opts.sliderMin)/3)*2),
			//sliderRecord: '{{ question_template_attribute.range_slider_record }}',
			sliderPrefix: '',
			sliderSuffix: '',
			sliderColorL: '',
			sliderColorM: '',
			sliderColorH: '',
		}, options);
		
		// Defaults
		opts.sliderMin = ($.trim(opts.sliderMin) == '' || !$.isNumeric($.trim(opts.sliderMin))) ? 0 : Number(opts.sliderMin);
		opts.sliderMax = ($.trim(opts.sliderMax) == '' || !$.isNumeric($.trim(opts.sliderMax))) ? 100 : Number(opts.sliderMax);
		opts.sliderStep = ($.trim(opts.sliderStep) == '' || !$.isNumeric($.trim(opts.sliderStep))) ? 1 : Number(opts.sliderStep);

		return this.each(function() {
			var thisQuestion = $(this);
			$(thisQuestion).addClass('range-slider-question unanswered');
				
			//Initial slider values
			var lowValue = opts.sliderLow;
			if(lowValue == '' || !$.isNumeric(lowValue)) {
				lowValue = opts.sliderMin + ((opts.sliderMax-opts.sliderMin)/3);
			}
			var highValue = opts.sliderHigh;
			if(highValue == '' || !$.isNumeric(highValue)) {
				highValue = opts.sliderMin + (((opts.sliderMax-opts.sliderMin)/3)*2);
			}
			
			var emptyInputs = $(':text.form-control', thisQuestion).filter(function() {
				return $.trim($(this).val()) == '';
			});
			
			if(emptyInputs.length == 0) {
				lowValue = $(':text.form-control:eq(0)', thisQuestion).val();
				highValue = $(':text.form-control:eq(1)', thisQuestion).val();
				$(thisQuestion).removeClass('unanswered');
			}
			if(opts.sliderRecord == '1' && emptyInputs.length == 2) {
				$(':text.form-control:eq(0)', thisQuestion).val(lowValue).trigger('keyup');
				$(':text.form-control:eq(1)', thisQuestion).val(highValue).trigger('keyup');
				$(thisQuestion).removeClass('unanswered');
			}
			
			// Initate the range slider
			$('[data-id="range'+opts.id+'"]', thisQuestion).slider({
				min: opts.sliderMin,
				max: opts.sliderMax,
				step: opts.sliderStep,
				range: true,
				value: [Number(lowValue),Number(highValue)]
			})
			// Listener on the slider
			.on('change', function(e) {
				var lowVal = e.value.newValue[0];
				var highVal = e.value.newValue[1];
				
				// Load the answer inputs
				$(':text.form-control:eq(0)', thisQuestion).val(lowVal).trigger('keyup');
				$(':text.form-control:eq(1)', thisQuestion).val(highVal).trigger('keyup');
				$(thisQuestion).removeClass('unanswered');
				
				handleTooltips();
			});
			
			// Insert custom tooltips
			$('.slider-handle', thisQuestion).each(function(i) {
				var positionClass = (i == 0) ? 'low' : 'high';
				$(this).addClass(positionClass).append('<div class="inserted-tooltip hidden"></div>');
			});
			handleTooltips();
			
			// Max/min display
			if($.trim(opts.sliderShowMinMax) == '1') {
				
				mmPrefix = (opts.sliderMinMaxPrefix == '') ? '' : '<span class="mm-prefix">'+opts.sliderMinMaxPrefix.split(" ").join("&nbsp;")+'</span>';
				mmSuffix = (opts.sliderMinMaxSuffix == '') ? '' : '<span class="mm-suffix">'+opts.sliderMinMaxSuffix.split(" ").join("&nbsp;")+'</span>';
				
				$('.inserted-range-slider-wrapper', thisQuestion).addClass('with-minmax').append('<div class="minmax-wrapper min">'+mmPrefix+'<span class="min-value">'+opts.sliderMin+'</span>'+mmSuffix+'</div><div class="minmax-wrapper max">'+mmPrefix+'<span class="min-value">'+opts.sliderMax+'</span>'+mmSuffix+'</div>');
			}
			
			// Custom colors
			if($.trim(opts.sliderColorL) != '') {
				$('.slider-track-low', thisQuestion).css('background-color', opts.sliderColorL );
			}
			if($.trim(opts.sliderColorM) != '') {
				$('.slider-selection', thisQuestion).css('background-color', opts.sliderColorM );
			}
			if($.trim(opts.sliderColorH) != '') {
				$('.slider-track-high', thisQuestion).css('background-color', opts.sliderColorH );
			}
			if($.trim(opts.sliderHandleColorL) != '') {
				$('.slider-handle:eq(0)', thisQuestion).css('background-color', opts.sliderHandleColorL );
			}
			if($.trim(opts.sliderHandleColorH) != '') {
				$('.slider-handle:eq(1)', thisQuestion).css('background-color', opts.sliderHandleColorH );
			}
			
			$('.inserted-range-slider-wrapper', thisQuestion).fadeIn(300);
		
			// A function to handle the custom tooltips
			function handleTooltips() {
				var lowPercent = getLeftPercent($('.slider-handle:eq(0)', thisQuestion));
				var highPercent = getLeftPercent($('.slider-handle:eq(1)', thisQuestion));
				$('.slider-handle', thisQuestion).removeClass('near');
				if((highPercent-lowPercent) < 5) {
					$('.slider-handle', thisQuestion).addClass('near');
				}
				
				var prefix = '';
				if(opts.sliderPrefix != '') {
					prefix = '<span class="tip-prefix">'+opts.sliderPrefix.split(" ").join("&nbsp;")+'</span>';
				}
				var suffix = '';
				if(opts.sliderSuffix != '') {
					suffix = '<span class="tip-suffix">'+opts.sliderSuffix.split(" ").join("&nbsp;")+'</span>';
				}
				$(':text.form-control', thisQuestion).each(function(i) {
					if($(this).val() != '') {
						$('.inserted-tooltip:eq('+i+')', thisQuestion).html(prefix+'<span class="tip-value">'+$(this).val()+'</span>'+suffix).removeClass('hidden');
					}
				});
			}
			function getLeftPercent(el) {
				var position = el.position();
				var leftPercent = position.left/el.closest('.slider-horizontal').width() * 100;
				return(leftPercent);
			}
			
		});
	};
})( jQuery );

