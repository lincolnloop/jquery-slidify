/*
 * Slidify - jQuery Plugin
 * graphical range selector for jQuery
 *
 * Copyright (c) 2009 Lincoln Loop, LLC
 *
 * Version: 0.7 (11/30/2009)
 * Requires: jQuery v1.3+ and jQuery UI v1.7+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {
    $.fn.slidify = function(settings) {
        if (!this.length) {
            return;
        }

        settings = jQuery.extend({
            min: 0,
            max: 3000000,
            stepping: 10000,
            unit: '$',
            units: '',
            valueSplit: ' to ',
            helpText: '(Drag sliders to select range)'
        }, settings);

        //setup elements and hide inputs
        if (settings.helpText) {
            $(this).before('<span class="slidify-help">' + settings.helpText + '</span>');
        }
        $(this).append('<div class="ui-slider-handle slidify-low"></div><div class="ui-slider-handle slidify-hi"></div>')
                .children('label, input').hide();

        var sliderValues = $('<span class="slidify-values"></span>').insertAfter($(this));
        var lowText = $('<span class="slidify-low"></span>').appendTo(sliderValues);
        sliderValues.append(' ' + settings.valueSplit + ' ');
        var hiText = $('<span class="slidify-hi"></span>').appendTo(sliderValues);



        //setup common variables
        var c = $(this).children('input');
        var lowInput = $(c[0]);
        var hiInput = $(c[1]);

        //setup sliders
        $(this).slider({
            min:   settings.min,
            max:   settings.max,
            step:  settings.stepping,
            range: true,
            slide: function(e, ui) {
                //update values on slide,
                //clear values on max and min to allow for over/under searches
                var uiValue;
                if ($(ui.handle).hasClass('slidify-low')) {
                    uiValue = ui.value <= settings.min ? '' : ui.value;
                    lowInput.val(uiValue);
                    lowText.text(humanize(ui.value, settings));
                }
                else if ($(ui.handle).hasClass('slidify-hi')) {
                    uiValue = ui.value >= settings.max ? '' : ui.value;
                    hiInput.val(uiValue);
                    hiText.text(humanize(ui.value, settings));
                }
            }
        });

        //move sliders to match input values
        var hiVal = hiInput.val() || settings.max;
        $(this).slider('values', 1, hiVal);
        hiText.text(humanize(hiVal, settings));

        var lowVal = lowInput.val() || settings.min;
        $(this).slider('values', 0, lowVal);
        lowText.text(humanize(lowVal, settings));
    };

    //private helper functions
    function shortNum(num){
        if (num<1000) {
            return num;
        } else if (num<1000000) {
            return Math.round(num/1000) + 'k';
        } else {
            return Math.round((num/1000000)*100)/100 + 'M';
        }
    }

    function longNum(num) {
        num += '';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
        }
        return splitLeft + splitRight;
    }

    function humanize(num, settings) {
        var text = '';
        if (num >= settings.max) {
            num = settings.max;
            text = 'Over ';
        }
        if (num <= settings.min && num > 0) {
            num = settings.min;
            text = 'Under ';
        }
        if (settings.unit == '$' || settings.unit == '€') {
            text += settings.unit + shortNum(num);
        } else if (num == 1) {
            text += longNum(num) + ' ' + settings.unit;
        } else {
            text += longNum(num) + ' ' + settings.units;
        }
        return text;
    }

})(jQuery);