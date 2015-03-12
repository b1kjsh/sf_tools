// ==UserScript==
// @name       SF_color_coding
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    1.04
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @resource    jh_CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/mycss.css
// @resource    jh_CSS_layout https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/layout.css
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_color_coding.user.js
// @copyright  2014+, Josh Howard
// ==/UserScript==
var debug = false;
console.log("---"+GM_info.script.name+" loaded in window version "+GM_info.script.version+"---");

// TODO: add logo somewhere https://c.na19.content.force.com/servlet/servlet.FileDownload?file=01513000002lPva

// TODO: move the search bar
    // Done!

$(document).ready(function () {
    // $('.x-grid3-col-ACTION_COLUMN').

    var mArray = [];
    var jh_CSS = GM_getResourceText("jh_CSS");
    var jh_CSS_layout = GM_getResourceText("jh_CSS_layout");
    GM_addStyle (jh_CSS);
    GM_addStyle (jh_CSS_layout);    

    function getCases() {
        var selector = $(".x-grid3-td-CASES_CASE_NUMBER");
        // selector.css('background','#000000');
        if (debug) {console.log(selector.length);}
        selector.each(function() {
            // if (debug) {console.log('test');}
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
        console.log('colorAged()','---Checking Case Age---');
        if(/Open Cases/.test($('select.title option:selected').html())){
            if ($('.x-grid3-col-00N30000004r0gj').length){
            // console.log('x-grid3-col-00N30000004r0gj', $('.x-grid3-col-00N30000004r0gj').length);
            $('.x-grid3-col-00N30000004r0gj').each(function() {
                            // console.log($(this).html());
                            if (parseFloat($(this).html()) == parseFloat(1) && $(this).parent("td").parent("tr").find('.x-grid3-col-CASES_STATUS:contains("Waiting")').length > 0){
                                $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-low');
                            }
                            if (parseFloat($(this).html()) > parseFloat (1.00) ){
                                $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-med');
                            }
                            if (parseFloat($(this).html()) > parseFloat(2.00) ) {
                                $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-high');
                            }
                            if (parseFloat($(this).html()) > parseFloat(3.00) ) {
                                $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-urgent');
                            }            
                        });    
} else {
    alert('Missing "Time Since Last Updated" column from case view');
}
// console.log('select.title does not contain "Open Cases"');
}
checkPRT();
}

function checkPRT() {
    console.log('checkPRT()','---Checking Case PRT---');
    // if($('select.title').match(/Open Cases/)){
        if(/Open Cases/.test($('select.title option:selected').html())){
            if ($('.x-grid3-col-00N30000004r0gN').length){
                $('.x-grid3-col-00N30000004r0gN').each(function() {

                    var parent = $(this).parent("td").parent("tr").find('td');
                    var mdate = new Date();
                    var cdate = new Date($(this).html());
                    if (debug) {console.log(cdate.toDateString());}
                    var diffDate = cdate - mdate;
                    var hourDiff = Math.floor(diffDate / 1000 / 60 / 60);
                    if (debug) {console.log(diffDate, hourDiff);}
                    if ( hourDiff <= 24 && hourDiff > 12 ){
                        if (debug) {console.log(diffDate, hourDiff);}

                    }
                    if ( hourDiff <= 12 && hourDiff > 8 ){
                        // if (debug) {console.log(diffDate, hourDiff);}
                        if (debug) {console.log(hourDiff,"Yellow Case: " + casess);}
                        parent.find('div').css('font', 'italic 12px/18px Arial, Helvetica, sans-serif');
                        // $(this).parent("td").parent("tr").parent("tbody").css('background', '#EBC299');
                    }
                    if ( hourDiff <= 8 && hourDiff > 6 ){
                        // if (debug) {console.log(diffDate, hourDiff);}
                        if (debug) {console.log(hourDiff,"Orange Case: " + casess);}
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            parent.find('div').css('font', 'bold 12px/18px Arial, Helvetica, sans-serif');
                            $(this).parent("td").parent("tr").parent("tbody").css('background', '#FF9933');
                        });

                    }
                    if ( hourDiff <= 6 && hourDiff > 3 ){
                        // if (debug) {console.log(diffDate, hourDiff);}
                    }
                    if ( hourDiff <= 3 ){
                        var casess = $(this).parent("td").parent("tr").find('.x-grid3-col-CASES_CASE_NUMBER').find('a').html();
                        if (debug) {console.log(hourDiff,"Red Case: " + casess);}
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            parent.find('div').css('font', 'italic bold 12px/18px Arial, Helvetica, sans-serif');
                            $(this).parent("td").parent("tr").parent("tbody").css('background', '#FF3300');
                        });
                    }
                });
            } else {
                alert('Missing "PRT Target" column from case view');

            }

    console.log('select.title does not contain "Open Cases"', $('.x-grid3-col-00N1300000BQsmE').html());


} else {
        if ($('.x-grid3-col-00N1300000BQsmE').length){
                $('.x-grid3-col-00N1300000BQsmE').each(function() {

                    var parent = $(this).parent("td").parent("tr").find('td');
                    var mdate = new Date();
                    var cdate = new Date($(this).html());
                    if (debug) {console.log(cdate.toDateString());}
                    var diffDate = cdate - mdate;
                    var hourDiff = Math.floor(diffDate / 1000 / 60 / 60);
                    if (debug) {console.log(diffDate, hourDiff);}
                    if ( hourDiff <= 24 && hourDiff > 12 ){
                        if (debug) {console.log(diffDate, hourDiff);}

                    }
                    if ( hourDiff <= 12 && hourDiff > 8 ){
                        // if (debug) {console.log(diffDate, hourDiff);}
                        if (debug) {console.log(hourDiff,"Yellow Case: " + casess);}
                        // parent.find('div').css('font', 'italic 12px/18px Arial, Helvetica, sans-serif');
                        // $(this).parent("td").parent("tr").parent("tbody").css('background', '#EBC299');
                        $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-low');
                    }
                    if ( hourDiff <= 8 && hourDiff > 6 ){
                        // if (debug) {console.log(diffDate, hourDiff);}
                        if (debug) {console.log(hourDiff,"Orange Case: " + casess);}
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            // parent.find('div').css('font', 'bold 12px/18px Arial, Helvetica, sans-serif');
                            // $(this).parent("td").parent("tr").parent("tbody").css('background', '#FF9933');
                            $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-med');
                        });

                    }
                    if ( hourDiff <= 6 && hourDiff > 3 ){
                        // if (debug) {console.log(diffDate, hourDiff);}
                    }
                    if ( hourDiff <= 3 ){
                        var casess = $(this).parent("td").parent("tr").find('.x-grid3-col-CASES_CASE_NUMBER').find('a').html();
                        if (debug) {console.log(hourDiff,"Red Case: " + casess);}
                        parent.find('.x-grid3-col-CASES_CASE_NUMBER').each(function() {
                            // parent.find('div').css('font', 'italic bold 12px/18px Arial, Helvetica, sans-serif');
                            // $(this).parent("td").parent("tr").parent("tbody").css('background', '#FF3300');
                            $(this).parent("td").parent("tr").parent("tbody").toggleClass('jh-prt-urgent');
                        });
                    }
                });
            } 
}

}


function color() {
    console.log('color()','---Checking Case Status---');
    var replace_pipe = $('.x-grid3-col-ACTION_COLUMN').html().replace(/\|/, '');
    $('.x-grid3-col-ACTION_COLUMN').html(replace_pipe);
    if(/Open Cases/.test($('select.title option:selected').html())){
        $(".x-grid3-row-table").find(("div:contains('Open: Not Reviewed')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-tse-nr');
        $(".x-grid3-row-table").find(("div:contains('Open: Under Review')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-tse-ur');
        $(".x-grid3-row-table").find(("div:contains('Open: Escalated to PSE')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-tse-esc-pse');
        $(".x-grid3-row-table").find(("div:contains('Open: Escalated to Eng')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-tse-esc-eng');
        $(".x-grid3-row-table").find(("div:contains('Open: Waiting on Customer')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-tse-waiting-cust');
        $(".x-grid3-row-table").find(("div:contains('Open: Patch Delivered')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-tse-patch-delivered');
            // $('.x-grid3-col-00N30000004r0fO').css('visibility','hidden');

        } else {
            // console.log('select.title does not contain "Open Cases"');
            // x-grid3-col-00N30000004r0fn
            // $(".x-grid3-row-table").find(("div:contains('Escalated')")).parent("td").parent("tr").parent("tbody").css('background', '#9beeff');
            // $(".x-grid3-row-table").find(("div:contains('Escalated to Engineering')")).parent("td").parent("tr").parent("tbody").css('background', '#f1ff9b');
            $(".x-grid3-row-table").find(("div:contains('Escalated')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-pse-escalated');
            $(".x-grid3-row-table").find(("div:contains('Escalated to Engineering')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-pse-esc-eng');
            $(".x-grid3-row-table").find(("div:contains('Waiting on Case Owner')")).parent("td").parent("tr").parent("tbody").toggleClass('jh-pse-waiting');
                // $(".x-grid3-row-table").find(("div:contains('Escalated to')")).parent("td").parent("tr").parent("tbody").css('background', '#f1ff9b');
                // $(".x-grid3-row-table").find(("div:contains('Waiting on Customer')")).parent("td").parent("tr").parent("tbody").css('background', '#9bffc8');
                // $(".x-grid3-row-table").find(("div:contains('Patch Delivered')")).parent("td").parent("tr").parent("tbody").css('background', '#CC6600');
            }


        }

        $('.linkBar').toggleClass('jh-hidden');
        $('.chatterFollowUnfollowAction').addClass('jh-hidden');
        $('.x-grid3-hd-row').addClass('jh-background');
        $('.linkBar').addClass('jh-background');
        $('.bottomNav').addClass('jh-background');
        $('#ext-gen10').addClass('jh-background');
        $('.zen-active').toggleClass('jh-active');
        $('.rolodex').insertAfter('div.filterLinks').toggleClass('jh-hidden');
        $('#tabBar').append('<li id="mysearch"></li>');
        $('#phSearchForm').appendTo('#mysearch');
        $('#phSearchForm').addClass('jh-search');
        // $('#phSearchInput').attr({autocomplete: 'true'});
        // $('#searchButtonContainer').toggleClass('jh-hidden');
        // $('*','#phSearchContainer').css('background', '0 !important');
        setTimeout(function() {
            if (window.location.href.indexOf("https://na19.salesforce.com/500") > -1 ) {
                if ($('.x-grid3-row-table').length){
                    color();
                    colorAged();}
                } else {
                    setTimeout();
                }
            }, 500);

    // $(window).resize(function() {
    //     if ($('.x-grid3-row-table').length){
    //         setTimeout(function() {
    //             color();
    //             colorAged();
    //         }, 1000);        
    //     }
    // });

$(window).resize(function() {
    setTimeout(function() {
        if (window.location.href.indexOf("https://na19.salesforce.com/500") > -1 ) {
            if ($('.x-grid3-row-table').length){
                color();
                colorAged();}
            } else {
                setTimeout();
            }
        }, 500);});

if (debug) {console.log(mArray.toString(),n);}

var open = window.XMLHttpRequest.prototype.open,
send = window.XMLHttpRequest.prototype.send,
onReadyStateChange;

function openReplacement(method, url, async, user, password) {
    var syncMode = async !== false ? 'async' : 'sync';
    console.warn('Preparing ' + syncMode + ' HTTP request : ' + method + ' ' + url);
    if ($('.jh-refresh').length < 1) {
        $('.refreshListButton').toggleClass('jh-hidden');
        $('.refreshListButton').clone().attr('id',id += 1).addClass('jh-refresh').insertAfter('div.filterLinks');
    };
        

    if (/ListServlet/.test(url)){
        if (debug) {console.log('openReplacement()','Case Refresh Detected! Attempting to color found objects!');}
        setTimeout(function () {
        $('#00B13000009tzTL_refresh').hide();
         color();
         colorAged();
         getCases();
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
    if (this._onreadystatechange) {
        return this._onreadystatechange.apply(this, arguments);        
    }
}

window.XMLHttpRequest.prototype.open = openReplacement;
window.XMLHttpRequest.prototype.send = sendReplacement;

});