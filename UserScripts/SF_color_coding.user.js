// ==UserScript==
// @name       SF_color_coding
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    2.0
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/Resources/fuzzy/list.fuzzysearch.min.js
// @resource    jh_CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/mycss.css
// @resource    jh_CSS_layout https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/layout_unibar.css
// @updateURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_color_coding.user.js
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_color_coding.user.js
// @copyright  2014+, Josh Howard
// ==/UserScript==
var debug = false;
console.log("---" + GM_info.script.name + " loaded in window version " + GM_info.script.version + "---");

// TODO: add logo somewhere https://c.na19.content.force.com/servlet/servlet.FileDownload?file=01513000002lPva

// TODO: move the search bar
// Done!

$(document).ready(function() {
    // $('.x-grid3-col-ACTION_COLUMN').
    var SETTINGS = [];
    var items = ["Status", "PRT", "Age", "Customer", "Averages", "Blind"];
    var itemsDesc = ["Color by Case Status", "Color by PRT", "Color by Case Age", "Highlight Waiting", "Strict Mode Disabled", "Color Blind Mode"]
    var mArray = [];
    var jh_CSS = GM_getResourceText("jh_CSS");
    var jh_CSS_layout = GM_getResourceText("jh_CSS_layout");
    GM_addStyle(".jh-border{border-color:#555559;background-color:#555559;background-image:null}.jh-hover{background-color:#c6ecff!important}.jh-pse-escalated.cb0{background-color:#543005!important;color:#fff}.jh-pse-escalated{background-color:#d7ccc8;border-color:#d7ccc8}.jh-pse-waiting.cb0{background-color:#8c510a!important;color:#fff}.jh-pse-waiting{background-color:#e2e6e7;border-color:#e2e6e7}.jh-pse-esc-eng.cb0{background-color:#bf812d!important;border-color:#fff}.jh-pse-esc-eng{background-color:#f1ff9b;border-color:#f1ff9b}.jh-tse-nr.cb0{background-color:#56b4ff!important}.jh-tse-nr{background-color:#d7ccc8;border-color:#d7ccc8}.jh-tse-ur.cb0{background-color:#009e73!important}.jh-tse-ur{background-color:#9beeff;border-color:#9beeff}.jh-tse-esc-pse.cb0{background-color:#0072b2!important}.jh-tse-esc-pse{background-color:#f1ff9b;border-color:#f1ff9b}.jh-tse-esc-eng.cb0{background-color:#0072b2!important}.jh-tse-esc-eng{background-color:#f1ff9b;border-color:#f1ff9b}.jh-tse-waiting-cust.cb0{background-color:#f0e442!important}.jh-tse-waiting-cust{background-color:#e2e6e7;border-color:#e2e6e7}.jh-prt-high.cb0 a,.jh-prt-high.cb0 div,.jh-prt-high.cb0 span,.jh-tse-patch-delivered.cb0{background-color:#e69f00!important;color:#fff}.jh-tse-patch-delivered{background-color:#C60;border-color:#C60}.jh-prt-low.cb0{background-color:#f0e442!important}.jh-prt-low{background-color:#EBC299;border-color:#EBC299}.jh-prt-med.cb0{background-color:#e69f00!important}.jh-prt-med{background-color:#FC6;border-color:#FC6;font:'italic 12px/18px Arial, Helvetica, sans-serif'}.jh-prt-high.cb0,.jh-prt-high.cb0 a,.jh-prt-high.cb0 div,.jh-prt-high.cb0 span{background-color:#cc79a7!important;color:#fff;font-weight:600}.jh-prt-high{background-color:#F93;border-color:#F93;font:'bold 12px/18px Arial, Helvetica, sans-serif'}.jh-prt-urgent.cb0,.jh-prt-urgent.cb0 a,.jh-prt-urgent.cb0 div,.jh-prt-urgent.cb0 span{background-color:#d55e00!important;font:'italic bold 12px/18px Arial, Helvetica, sans-serif';color:#000;font-weight:700;font-style:italic}.jh-prt-urgent,.jh-prt-urgent a,.jh-prt-urgent div,.jh-prt-urgent span{background-color:red;border-color:red;font:'italic bold 12px/18px Arial, Helvetica, sans-serif';color:#fff;font-weight:700;font-style:italic}.jh-hidden{display:none}");
    // GM_addStyle (jh_CSS_layout); 

    function initSettings() {
        var settingsValues = [];
        SETTINGS = [];
        $.each(items, function(index, val) {
            settingsValues[val] = GM_getValue(val);
            SETTINGS[val] = GM_getValue(val);
            // console.log(settingsValues);
            if (settingsValues[val] === undefined) {
                GM_setValue(val, true);
            }
            if (settingsValues[val] === undefined && val == 'Blind')
                GM_setValue(val, false);
        });

        console.log(SETTINGS);


    }

    function applyColorBlindness() {
        console.log('colorblind', $("[class^='jh-tse'],[class^='jh-prt']"));
        $("[class^='jh-tse'],[class^='jh-prt']").each(function(index, el) {
            $(this).addClass('cb0');
        });
    }

    function genColorSettings(object) {
        object.append(function() {
            var a = $(this);
            var colors = new Array();
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-tse-nr').text('Not Reviewed'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-tse-ur').text('Under Review'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-tse-waiting-cust').text('Waiting On Customer'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-tse-patch-delivered').text('Patch Delivered'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-tse-esc-pse').text('Escalated to PSE'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-tse-esc-eng').text('Escalated to ENG'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-prt-low').text('Low PRT Priority'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-prt-med').text('Medium PRT Priority'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-prt-high').text('High PRT Priority'));
            colors.push($('<label></label>').css({
                display: 'block',
                'text-align': 'center',
                'white-space': 'nowrap',
                margin: '5px',
                padding: '5px'
            }).addClass('jh-prt-urgent').text('Urgent PRT Priority'));

            $.each(colors, function(index, val) {
                a.append(val);
            });
            if (SETTINGS['Blind'])
                applyColorBlindness();
        });
    }

    function genSettings(object) {
        object.append(function() {
            var a = $(this);
            $.each(items, function(index, val) {
                a.append($('<li></li>').css({
                        'list-style': 'none',
                        'padding-top': '10px',
                        'padding-left': '10px',
                        'padding-right': '10px',
                        'padding-bottom': '2px'
                    })
                    .append($('<label></label>')
                        .css({ 'font-size': 'small', 'font-weight': '600' })
                        .append($('<input></input>').attr({
                                'type': 'checkbox',
                                'checked': function() {
                                    return SETTINGS[val];
                                }
                            })
                            .css('margin-right', '10px')
                            .addClass('jh_settings_' + val)
                            .change(function(event) {
                                var test = $('.jh_settings_' + val).is(':checked');
                                console.log(test);
                                if (test === undefined) {
                                    GM_setValue(val, false);
                                } else {
                                    GM_setValue(val, test);
                                }


                                $('.jh-refresh').click();
                            }))
                        .append(itemsDesc[index])
                    ))
            });
            a.append(function() {
                $(this).append($('<div></div>')
                    .css({
                        display: 'inline-block',
                        '*display': 'inline',
                        width: '100%'
                    })
                    .append(function() {
                        var a = $(this);
                        genColorSettings(a);
                    })
                );

            });
        })
        if (SETTINGS['Blind']){
            applyColorBlindness();
        } else {
            // TODO: Remove Color Blindness
        }
    }

    function init(argument) {
        if ($('.jh_settings_button').length < 1){
                $('.topNavTab').append($('<a></a>')
                    .css('color', 'black')
                    .append($('<img src="/img/icon/custom51_100/gears16.png"></img>').addClass('jh_settings_button')
                        .click(function(event) {
                            if ($('.jh_settings').length <= 0) {
                                $('.jh_settings_button').after($('<div></div>').addClass('jh_settings')
                                    .css({
                                        'z-index': '10',
                                        'position': 'absolute',
                                        'background': 'white',
                                        'width': '210px',
                                        'border': '2px solid #EAEAEA'
                                    }));
                                genSettings($('.jh_settings'));
                            } else {
                                if ($('.jh_settings').is(':visible')) {
                                    $('.jh_settings').hide();
                                } else {
        
                                    $('.jh_settings').show();
                                }
                            }
                        })));
            }
    }


    function getCases() {
        var selector = $(".x-grid3-td-CASES_CASE_NUMBER");
        // selector.css('background','#000000');
        console.debug(selector.length);
        selector.each(function() {
            // console.debug('test');
            var k = $(this).find('div').find('a').attr('href');
            mArray.push(k);
            // console.log('k is',k);
            for (var i = mArray.length - 1; i >= 0; i--) {
                // console.log('mArray',mArray[i]);
                // $('body').append('<div id="m">'+mArray[i]+'</div>');
            }
        });
    }

    function colorAged() {
        console.info('colorAged()', '---Checking Case Age---');
        if (/Open Cases/.test($('select.title option:selected').html())) {
            if ($('.x-grid3-col-00N30000004r0gj').length) {
                // console.log('x-grid3-col-00N30000004r0gj', $('.x-grid3-col-00N30000004r0gj').length);
                var ages = new Array();
                // var urgent = 4.00;
                var high = 3.00;
                var med = 2.00;
                var low = 1.00;
                if (SETTINGS['Averages']) {
                    $('.x-grid3-col-00N30000004r0gj').each(function(index, val) {
                        ages.push(parseFloat($(this).html()));
                    });
                    var max = Math.max.apply(null, ages);
                    var sum = 0;
                    $.each(ages, function(index, val) {
                        sum += val;
                    });
                    var avg = sum / max;
                    high = (max - avg) / 2;
                    med = (max - high) / 2;
                    low = avg;
                }
                console.log('ages', ages);
                console.log('avg', avg);
                $('.x-grid3-col-00N30000004r0gj').each(function() {
                    // console.log($(this).html());
                    if (parseFloat($(this).html()) == parseFloat(1) && $(this).parent("td").parent("tr").find('.x-grid3-col-CASES_STATUS:contains("Waiting")').length > 0) {
                        $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-low');
                    }
                    if (parseFloat($(this).html()) > parseFloat(low)) {
                        $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-med');
                    }
                    if (parseFloat($(this).html()) > parseFloat(med)) {
                        $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-high');
                    }
                    if (parseFloat($(this).html()) > parseFloat(high)) {
                        $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-urgent');
                    }
                });
            } else {
                alert('Missing "Time Since Last Updated" column from case view');
            }
            // console.log('select.title does not contain "Open Cases"');
        }

    }

    function checkPRT() {
        console.info('checkPRT()', '---Checking Case PRT---');
        // if($('select.title').match(/Open Cases/)){
        var urgent = 3,
            high = 6,
            med = 8,
            low = 12,
            base = 24;

        if (SETTINGS['Averages']) {
            base = $('.x-grid3-col-00N30000004r0gN').length * parseFloat(5);
            low = parseInt(base / 2);
            med = parseInt(low / 2);
            high = parseInt(med / 2);
            urgent = parseInt(high / 2);
        }

        console.log(base, low, med, high, urgent);
        if (/Open Cases/.test($('select.title option:selected').html())) {
            if ($('.x-grid3-col-00N30000004r0gN').length) {
                $('.x-grid3-col-00N30000004r0gN').each(function() {

                    var parent = $(this).parent("td").parent("tr").find('td');
                    var mdate = new Date();
                    var cdate = new Date($(this).html());
                    // console.debug(cdate.toDateString());
                    var diffDate = cdate - mdate;
                    var hourDiff = Math.floor(diffDate / 1000 / 60 / 60);

                    // console.debug(diffDate, hourDiff);
                    if (hourDiff <= base && hourDiff > low) {
                        // console.debug(diffDate, hourDiff);

                    }
                    if (hourDiff <= low && hourDiff > med) {
                        // console.debug(diffDate, hourDiff);
                        // console.debug(hourDiff,"Yellow Case: " + casess);
                        parent.find('div').css('font', 'italic 12px/18px Arial, Helvetica, sans-serif');
                        $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-low');
                    }
                    if (hourDiff <= med && hourDiff > high) {
                        // console.debug(diffDate, hourDiff);
                        // console.debug(hourDiff,"Orange Case: " + casess);
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            parent.find('div').css('font', 'bold 12px/18px Arial, Helvetica, sans-serif');
                            $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-med');
                        });

                    }
                    if (hourDiff <= high && hourDiff > urgent) {
                        // console.debug(diffDate, hourDiff);
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            parent.find('div').css('font', 'bold 12px/18px Arial, Helvetica, sans-serif');
                            $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-high');
                        });
                    }
                    if (hourDiff <= urgent) {
                        // var casess = $(this).parent("td").parent("tr").find('.x-grid3-col-CASES_CASE_NUMBER').find('a').html();
                        // // console.debug(hourDiff,"Red Case: " + casess);
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            parent.find('div').css('font', 'italic bold 12px/18px Arial, Helvetica, sans-serif');
                            $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-urgent');
                        });
                    }
                });
            } else {
                alert('Missing "PRT Target" column from case view');

            }

            console.info('select.title does not contain "Open Cases"', $('.x-grid3-col-00N1300000BQsmE').html());
        } else {
            if ($('.x-grid3-col-00N1300000BQsmE').length) {
                $('.x-grid3-col-00N1300000BQsmE').each(function() {

                    var parent = $(this).parent("td").parent("tr").find('td');
                    var mdate = new Date();
                    var cdate = new Date($(this).html());
                    // console.debug(cdate.toDateString());
                    var diffDate = cdate - mdate;
                    var hourDiff = Math.floor(diffDate / 1000 / 60 / 60);
                    console.debug(diffDate, hourDiff);
                    if ($(this).parent("td").parent("tr").parent("tbody").find("div:contains('Waiting on Case Owner')").length) {
                        hourDiff = Math.floor(hourDiff + 72);
                    }
                    if (hourDiff <= 24 && hourDiff > 12) {
                        console.debug(diffDate, hourDiff);

                    }

                    var test = 0;
                    if (isNaN(hourDiff)) {
                        $(this).parent("td").parent("tr").parent("tbody").parent("table").parent("div").attr('data-ptr', 0);
                    } else {
                        $(this).parent("td").parent("tr").parent("tbody").parent("table").parent("div").attr('data-ptr', hourDiff);
                    }

                    if (hourDiff <= 12 && hourDiff > 8) {
                        // console.debug(diffDate, hourDiff);
                        // console.debug(hourDiff,"Yellow Case: " + casess);
                        // parent.find('div').css('font', 'italic 12px/18px Arial, Helvetica, sans-serif');
                        // $(this).parent("td").parent("tr").parent("tbody").css('background', '#EBC299');
                        $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-low');
                    }
                    if (hourDiff <= 8 && hourDiff > 6) {
                        // console.debug(diffDate, hourDiff);
                        // console.debug(hourDiff,"Orange Case: " + casess);
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            // parent.find('div').css('font', 'bold 12px/18px Arial, Helvetica, sans-serif');
                            // $(this).parent("td").parent("tr").parent("tbody").css('background', '#FF9933');
                            $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-high');
                        });

                    }
                    if (hourDiff <= 6 && hourDiff > 3) {
                        // console.debug(diffDate, hourDiff);
                    }
                    if (hourDiff <= 3) {
                        var casess = $(this).parent("td").parent("tr").find('.x-grid3-col-CASES_CASE_NUMBER').find('a').html();
                        // console.debug(hourDiff,"Red Case: " + casess);
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            // parent.find('div').css('font', 'italic bold 12px/18px Arial, Helvetica, sans-serif');
                            // $(this).parent("td").parent("tr").parent("tbody").css('background', '#FF3300');
                            if ($(this).parent("td").parent("tr").parent("tbody").find("div:contains('Waiting on Case Owner')").length) {
                                $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-low');
                            } else {
                                $(this).parent("td").parent("tr").parent("tbody").addClass('jh-prt-urgent');
                            }
                        });
                    }

                });
            }
        }
    }

    function colorWaiting() {
        $.each($('.x-grid3-td-00N30000004r0gj'), function(index, val) {
            console.log('here');
            if (parseFloat($(this).find('div').html()) > parseFloat(1.50) && $(this).parent("tr").find('.x-grid3-col-CASES_STATUS:contains("Waiting")').length > 0) {
                $(this).parent("tr").parent("tbody").addClass('jh-prt-low');
            }
        });
    }


    function color() {
        console.info('color()', '---Checking Case Status---');
        var replace_pipe = $('.x-grid3-col-ACTION_COLUMN').html().replace(/\|/, '');
        $('.x-grid3-col-ACTION_COLUMN').html(replace_pipe);
        if (/Open Cases/.test($('select.title option:selected').html())) {
            $(".x-grid3-row-table").find(("div:contains('Open: Not Reviewed')")).parent("td").parent("tr").parent("tbody").addClass('jh-tse-nr');
            $(".x-grid3-row-table").find(("div:contains('Open: Under Review')")).parent("td").parent("tr").parent("tbody").addClass('jh-tse-ur');
            $(".x-grid3-row-table").find(("div:contains('Open: Escalated to PSE')")).parent("td").parent("tr").parent("tbody").addClass('jh-tse-esc-pse');
            $(".x-grid3-row-table").find(("div:contains('Open: Escalated to Eng')")).parent("td").parent("tr").parent("tbody").addClass('jh-tse-esc-eng');
            $(".x-grid3-row-table").find(("div:contains('Open: Waiting on Customer')")).parent("td").parent("tr").parent("tbody").addClass('jh-tse-waiting-cust');
            $(".x-grid3-row-table").find(("div:contains('Open: Patch Delivered')")).parent("td").parent("tr").parent("tbody").addClass('jh-tse-patch-delivered');
            // $('.x-grid3-col-00N30000004r0fO').css('visibility','hidden');

        } else {
            // console.info('select.title does not contain "Open Cases"');
            // x-grid3-col-00N30000004r0fn
            // $(".x-grid3-row-table").find(("div:contains('Escalated')")).parent("td").parent("tr").parent("tbody").css('background', '#9beeff');
            // $(".x-grid3-row-table").find(("div:contains('Escalated to Engineering')")).parent("td").parent("tr").parent("tbody").css('background', '#f1ff9b');
            $(".x-grid3-row-table").find(("div:contains('Escalated')")).parent("td").parent("tr").parent("tbody").addClass('jh-pse-escalated');
            $(".x-grid3-row-table").find(("div:contains('Escalated to Engineering')")).parent("td").parent("tr").parent("tbody").addClass('jh-pse-esc-eng');
            $(".x-grid3-row-table").find(("div:contains('Waiting on Case Owner')")).parent("td").parent("tr").parent("tbody").addClass('jh-pse-waiting');
            // $(".x-grid3-row-table").find(("div:contains('Escalated to')")).parent("td").parent("tr").parent("tbody").css('background', '#f1ff9b');
            // $(".x-grid3-row-table").find(("div:contains('Waiting on Customer')")).parent("td").parent("tr").parent("tbody").css('background', '#9bffc8');
            // $(".x-grid3-row-table").find(("div:contains('Patch Delivered')")).parent("td").parent("tr").parent("tbody").css('background', '#CC6600');
        }


    }

    setTimeout(function() {
        if (window.location.href.indexOf("https://na19.salesforce.com/500") > -1) {
            if ($('.x-grid3-row-table').length) {
                init();
                initSettings();
                if (SETTINGS['Status'])
                    color();
                if (SETTINGS['Age'])
                    colorAged();
                if (SETTINGS['PRT'])
                    checkPRT();
                if (SETTINGS['Customer'])
                    colorWaiting();
                if (SETTINGS['Blind'])
                    applyColorBlindness();

                makeSortable();
            }
        } else {
            setTimeout();
        }
    }, 500);

    $(window).resize(function() {
        setTimeout(function() {
            if (window.location.href.indexOf("https://na19.salesforce.com/500") > -1) {
                if ($('.x-grid3-row-table').length) {
                    initSettings();
                    if (SETTINGS['Status'])
                        color();
                    if (SETTINGS['Age'])
                        colorAged();
                    if (SETTINGS['PRT'])
                        checkPRT();
                    if (SETTINGS['Customer'])
                        colorWaiting();
                    if (SETTINGS['Blind'])
                        applyColorBlindness();
                    makeSortable();
                }
            } else {
                setTimeout();
            }
        }, 200);
    });

    // console.debug(mArray.toString(),n);

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send,
        onReadyStateChange;

    function openReplacement(method, url, async, user, password) {
        var syncMode = async !== false ? 'async' : 'sync';
        console.warn('Preparing ' + syncMode + ' HTTP request : ' + method + ' ' + url);
        if ($('.jh-refresh').length < 1) {
            $('.refreshListButton').toggleClass('jh-hidden');
            $('.refreshListButton').clone().attr('id', id += 1).addClass('jh-refresh').insertAfter('div.filterLinks');
        };
        // setTimeout(function () {
        // if (debug) {console.debug('openReplacement()','Attempting to color objects!');}
        // $('#00B13000009tzTL_refresh').hide();
        //  color();
        //  colorAged();
        //  getCases();
        // }, 500);
        if (method == "GET" || method == "POST") {
            if (debug) { console.debug('openReplacement()', 'Case Refresh Detected! Attempting to color found objects!'); }
            setTimeout(function() {
                $('#00B13000009tzTL_refresh').hide();
                initSettings();
                if (SETTINGS['Status'])
                    color();
                if (SETTINGS['Age'])
                    colorAged();
                if (SETTINGS['PRT'])
                    checkPRT();
                if (SETTINGS['Customer'])
                    colorWaiting();
                if (SETTINGS['Blind'])
                    applyColorBlindness();
                getCases();
                makeSortable();
            }, 500);
        }


        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        console.warn('Sending HTTP request data : ', data);

        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;

        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        console.warn('HTTP request ready state changed : ' + this.readyState);
        if (this.readyState == 4) {
            if (debug) { console.debug('openReplacement()', 'Case Refresh Detected! Attempting to color found objects!'); }
            setTimeout(function() {
                $('#00B13000009tzTL_refresh').hide();
                initSettings();
                if (SETTINGS['Status'])
                    color();
                if (SETTINGS['Age'])
                    colorAged();
                if (SETTINGS['PRT'])
                    checkPRT();
                if (SETTINGS['Customer'])
                    colorWaiting();
                if (SETTINGS['Blind'])
                    applyColorBlindness();
                getCases();
                makeSortable();
            }, 500);
        }
        if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    function makeSortable() {
        $('.x-grid3-body').sort(function(a, b) {
            return $(a).find('.x-grid3-row').data('ptr') - $(b).find('.x-grid3-row').data('ptr');
        }).each(function(_, container) {
            $(container).parent().append(container);
            console.log('sorting');
        })
    }

});
