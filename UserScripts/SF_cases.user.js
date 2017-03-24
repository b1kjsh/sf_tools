// ==UserScript==
// @name       SF_cases
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    0.85
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500*
// @include     https://c.na19.visual.force.com/apex/PSECaseComment*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/Resources/fuzzy/list.fuzzysearch.min.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/Resources/fuzzy/jquery.autogrow-textarea.js
// @resource    jh_CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/mycss.css
// @resource    jh_CSS_layout https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/layout_unibar.css
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_cases.user.js
// @updateURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_cases.user.js
// @copyright  2014+, Josh Howard
// ==/UserScript==

$(document).ready(function() {
    $.fn.cases = function() {
        var settings = $.extend({
            init: function() {
                console.log('cases.init', window.location.pathname);
                var jh_CSS = GM_getResourceText("jh_CSS");
                var jh_CSS_layout = GM_getResourceText("jh_CSS_layout");
                GM_addStyle(jh_CSS);
                GM_addStyle(jh_CSS_layout);
                if (window.location.pathname == '/apex/PSECaseComment'){
                    settings.uni_text = GM_getValue("comment","").text;
                    if (settings.uni_text.length > 0){
                        settings.submit_comment();
                        GM_deleteValue("comment");
                    }
                } else {
                    settings.sf_email_url();
                    settings.tfs_link();
                    settings.setup_load_window();
                    settings.setup_listeners();
                }

            },
            setup_listeners: function() {
                console.log('cases.setup_listeners');
                $(document).bind('keydown', 'alt+u', function() {
                    console.log("detected alt+u");
                    if ($('#jh-uniwrapper').is(":visible")) {
                        $('#jh-uniwrapper').hide();
                    } else {
                        if ($('#jh-uniwrapper').length) {
                            $('#jh-uniwrapper').remove();
                        }
                        settings.setup_unibar($('#jh-uniwrapper').is(":visible"));
                        $('#jh-uniwrapper').show();
                        $('#jh-unibar').focus();
                    }
                    $('body').on('keydown', (function(e) {
                        if (e.keyCode == 27) {
                            settings.setup_unibar($('#jh-uniwrapper').is(":visible"));
                        }
                    }));
                });
                $('body').on('keydown', function(e) {
                    if (e.altKey && e.keyCode == 83) {
                        e.preventDefault();
                        settings.uni_text = $('.jh-textarea').val();
                        settings.setup_unibar(true);
                        console.log("detected alt+s");
                        console.log(settings.uni_text);
                        settings.comment_page();
                    }
                });
            },
            setup_load_window: function() {
                console.log('cases.setup_load_window');
                $('body').append('<div id="myEditBox" />');
                $('body').append('<div id="myEditBox2" />');
            },
            setup_unibar: function(state) {
                console.log('cases.setup_unibar', state);
                if (state) {
                    $('#jh-unibar').val('');
                    $('#jh-uniwrapper').hide();
                } else {
                    $('#sidebarCell').prepend('<div id="jh-uniwrapper"><input type="text" class="jh-unibar" id="jh-unibar"></input><ul class="list jh-unilist"></ul></div>');
                    $('#jh-uniwrapper').draggable();
                    $.each(settings.case_status, function(i, item) {
                        var t = i + 1;
                        $('#jh-uniwrapper').find('.list').append('<li tabindex="' + t + '"><div class="jh-unilinkw"><a class="name jh-unilink jh-case_status" name="' + item[0].valueOf().replace(/\s/g, '_').toLowerCase() + '">' + item[0].valueOf() + '</a><div><p class="jh-pdesc">' + item[1].valueOf() + '</p></div></div></li>');
                    });
                    $.each(settings.case_updates, function(i, item) {
                        var t = i + 2;
                        $('#jh-uniwrapper').find('.list').append('<li tabindex="' + t + '"><div class="jh-unilinkw"><a class="name jh-unilink jh-case_updates-args" name="' + item[0].valueOf().replace(/\s/g, '_').toLowerCase() + '">' + item[0].valueOf() + '</a><div><p class="jh-pdesc L">' + item[1].valueOf() + '</p><p class="jh-pdesc R">' + item[2].valueOf() + '</p></div></div></li>');
                    });
                    $("a.jh-case_status").click(function() {
                        getEditPage($(this).text(), "PSEstatus");
                    });
                    $('.jh-unilinkw').parent('li').keypress(function(e) {
                        console.log("here");
                        if (e.which == 13) {
                            getEditPage($(this).find('a').text(), "PSEstatus");
                        }
                    });
                    $('#jh-unibar').keypress(function(e) {
                        console.log("here");
                        if (e.which == 13) {
                            console.log($(this).val());
                            settings.analize_text($(this).val());
                        }
                    });
                    $('div.jh-unilinkw').focusin(function() { $(this).toggleClass('jh-hover'); });
                    $('div.jh-unilinkw').focusout(function() { $(this).toggleClass('jh-hover'); });
                    var options = { valueNames: ['name'], plugins: [ListFuzzySearch()], searchClass: 'jh-unibar', location: 0, distance: 100, threshold: 0.4, multiSearch: true };
                    var listObj = new List('jh-uniwrapper', options);
                    $('#jh-unibar').on('keydown', function(e) {
                        console.log(e.keyCode.toString() + " " + e.which.toString());
                        if ((e.keyCode || e.which) == 9) {
                            $('.jh-unilinkw').parent('li').first().focus();
                            if ($('.jh-textarea').length)
                                $('.jh-textarea').focus();
                            $('.jh-unilinkw').parent('li').last().on('keydown', function(e) {
                                if ((e.keyCode || e.which) == 9) {
                                    $('#jh-unibar').focus();
                                    e.preventDefault();
                                }
                            });
                            e.preventDefault();
                        }
                    });
                }
            },
            setup_editor: function() {
                if ($('#jh-unitextw').length) {
                    $('#jh-unitextw').remove();
                }
                $('#jh-uniwrapper').append('<div id="jh-unitextw"><textarea class="jh-textarea" maxlength="4000" /></div>');
                var options = { maxHeight: 600 };
                $('.jh-textarea').autogrow(options);
                $('#jh-unitextw').append('<div id="jh-counter"></div>');
                $('.jh-textarea').on('keydown', function() {
                    $('#jh-counter').text($(this).val().length + '/4000');
                });

            },
            canned_messages: function() {
                var string = '';
                switch (value) {
                    case "internal":
                        string = "***INTERNAL COMMENT***";
                        break;
                    case "pse":
                        string = "***PSE COMMENT***";
                        break;
                    case "PSE":
                        string = "***COMMENT TO PSE***";
                        break;
                    case "tse":
                        string = "***TSE COMMENT***";
                        break;
                    case "TSE":
                        string = "***COMMENT TO TSE***";
                        break;
                    case "a0":
                        string = "Just checking in. I wanted to check on the status of this case. Do you need any more assistance? Let me know how I may assist you. \n\n";
                        break;
                    case "a1":
                        string = "Is there any news regarding this case? I would like to know how you would like to proceed with this case. Would you prefer I keep checking in, just wait to hear back from you, or close this case out and we can open it again if there are problems. I want to make sure you are supported, but don't want to continually bother you either.\n\nLet me know how to proceed.\n\n";
                        break;
                    case "a2":
                        string = "As I have not heard anything back regarding my previous emails, and I can't keep cases open indefinitely, I will go ahead and archive this case. This case can be reopened at your convenience. If you have new information regarding this case or have any questions, please reference this case number and do one of the following to reopen this case: Reply to this email, open a new ticket at support.landesk.com, or give us a call at 1.800.581.4553.\n\nHave a great day!\n\n";
                        break;
                    default:
                        string = '';
                        break;
                }
                return string;
            },
            uni_text: undefined,
            uni_cli: undefined,
            analize_text: function(value) {
                console.log(value);
                settings.uni_cli = value.split(" ");
                switch (settings.uni_cli[0]) {
                    case "tfs":
                        getEditPage(settings.uni_cli[1], settings.uni_cli[0]);
                        break;
                    case "update":
                        $('.jh-unilinkw').parent('li').hide();
                        settings.setup_editor();
                        // settings.comment_page();
                        $('.jh-textarea').focus();
                        break;
                    default:
                        if ($('.list').find('li').length < 2 && $.inArray(case_status, value)) {
                            console.log("found it");
                            $('.list').find('li').find('div').find('a').click();
                        } else {
                            console.log("didn't find anything");
                        }
                        break;
                }
            },
            submit_comment: function() {
                console.log('getting case comment edit page');
                var comment = GM_getValue("comment","");
                if (comment.type == 'pse') {
                    $('select').val("Waiting on Case Owner");
                    $('textarea').val(settings.uni_text);
                } else {
                    $('#CommentBody').val(settings.uni_text);
                }
                if (settings.uni_text.length < 1 && comment.type === 'tse') {
                    $('#IsPublished').prop('checked', 'true');
                }
                $(".btn[value='Save']").click();
            },
            case_status: [
                ["Waiting on Case Owner", "Set Case to 'Waiting on Case Owner'", ""],
                ["Escalated to Engineering", "Set Case to 'Escalated to Engineering'", ""]
            ],
            case_updates: [
                ["tfs", "Set TFS ID on Case", "tfs 123456"],
                ["update", "Create Case Comments/Update Case", "update *Optional=[internal|PSE|pse|TSE|tse]"]
            ],
            signature: "\n\n---\nJosh Howard\nLANDESK\nProduct Support Engineer",
            comment_page: function() {
                GM_setValue("comment",{text: settings.uni_text, type: settings.uni_cli[1]});
                window.location.href = settings.comment_url();
            },
            comment_url: function() {
                var geturl = $('input[name="edit"]').attr('onclick'),
                    url = geturl.toString().replace(/(^navigateToUrl\(')([0-9a-zA-Z\/]{2,}\?retURL=%[0-9a-zA-Z\/]{2,})(','([A-Z]*)','([A-Za-z]*)'\);)/, "$2");
                if (settings.uni_cli[1].toLowerCase() === 'tse') {
                    geturl = $('input[name="edit"]').attr('onclick');
                    url = geturl.toString().replace(/(^navigateToUrl\(')([0-9a-zA-Z\/]{2,}\?retURL=%[0-9a-zA-Z\/]{2,})(','([A-Z]*)','([A-Za-z]*)'\);)/, "$2");
                }
                if (settings.uni_cli[1].toLowerCase() === 'pse') {
                    geturl = $('input[name="pse_comment"]').attr('onclick');
                    url = geturl.toString().replace(/^navigateToUrl\('(.*)','.*/, "$1");
                }
                if (settings.uni_cli[1].toLowerCase() === 'internal') {
                    geturl = $('input[name="edit"]').attr('onclick');
                    url = geturl.toString().replace(/(^navigateToUrl\(')([0-9a-zA-Z\/]{2,}\?retURL=%[0-9a-zA-Z\/]{2,})(','([A-Z]*)','([A-Za-z]*)'\);)/, "$2");
                }
                return url;
            },
            sf_email_url: function() {
                console.log('cases.sf_email_url');
                if ($('#cas2_ileinner') !== undefined) {
                    $('[id$="ButtonRow"]').append(function() {
                        var ref = "[ ref:_00D30mplz._50013z" + window.location.href.replace("https://na19.salesforce.com/", "").substring(11, 15) + " ]",
                            email = $.trim($('#cas10_ileinner').find('a').text()),
                            case_number = $.trim($('#cas2_ileinner').text().replace('[View Hierarchy]', '')),
                            case_subject = $.trim($('#cas14_ileinner').text()),
                            subject = 'Case: ' + case_number + ' - ' + case_subject + ' ' + ref;
                        return $('<input></input>').addClass('btn').css('margin-left', '4px')
                            .attr({
                                'title': 'Send Email',
                                'name': "send_email",
                                'type': 'button',
                                'value': 'Send Email',
                                'onclick': "window.location='mailto:" + email + "?subject=" + subject + "'&cc=landesk.support@landesk.com"
                            });
                    });
                }
            },
            tfs_id: $("#00N30000004r0fX_ileinner").text(),
            tfs_link: function(tfs_id) {
                tfs_id = settings.tfs_id;
                console.log('cases.tfs_link');
                if (tfs_id.match(/[0-9]{6}/)) {
                    console.log('cases.tfs_link', 'Found TFS Item');
                    $("#00N30000004r0fX_ileinner").wrapInner('<a href="https://landesk.visualstudio.com/Master/_workitems#_a=edit&id=' + tfs_id + '"></a>');
                }
            }
        });
        settings.init();
    };

    $('body').cases();

});
