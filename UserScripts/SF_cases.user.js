// ==UserScript==
// @name       SF_cases
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    0.16
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @require     http://listjs.com/no-cdn/list.js
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
	var signature = "\n\n---\nJosh Howard\nLANDESK\nProduct Support Engineer";
    var case_status = [
        ["Waiting on Case Owner", "Set Case to 'Waiting on Case Owner'", ""],
        ["Escalated to Engineering", "Set Case to 'Escalated to Engineering'", ""]
    ];
    var case_updates = [
        ["tfs", "Set TFS ID on Case", "tfs 123456"],
        ["update", "Create Case Comments/Update Case", "update *Optional=[internal|PSE|pse|TSE|tse]"]
    ];
    var jh_CSS = GM_getResourceText("jh_CSS");
    var jh_CSS_layout = GM_getResourceText("jh_CSS_layout");
    GM_addStyle(jh_CSS);
    GM_addStyle(jh_CSS_layout);

    var tfs = $("#00N30000004r0fX_ileinner").text();
    if (tfs.match(/[0-9]{6}/))
        $("#00N30000004r0fX_ileinner").wrapInner('<a href="http://tfs.landesk.com:8080/tfs/LDEngineering/Master/_workitems#_a=edit&id=' + tfs + '"></a>');

    function init() {
        $('body').append('<div id="myEditBox" />');
        $('body').append('<div id="myEditBox2" />');
        $('#sidebarCell').prepend('<div id="jh-uniwrapper"><input type="text" class="jh-unibar" id="jh-unibar"></input><ul class="list jh-unilist"></ul></div>');
        $('#jh-uniwrapper').draggable();
        $.each(case_status, function(i, item) {
            var t = i + 1
            $('#jh-uniwrapper').find('.list').append('<li tabindex="' + t + '"><div class="jh-unilinkw"><a class="name jh-unilink jh-case_status" name="' + item[0].valueOf().replace(/\s/g, '_').toLowerCase() + '">' + item[0].valueOf() + '</a><div><p class="jh-pdesc">' + item[1].valueOf() + '</p></div></div></li>');
        });

        $.each(case_updates, function(i, item) {
            var t = i + 2
            $('#jh-uniwrapper').find('.list').append('<li tabindex="' + t + '"><div class="jh-unilinkw"><a class="name jh-unilink jh-case_updates-args" name="' + item[0].valueOf().replace(/\s/g, '_').toLowerCase() + '">' + item[0].valueOf() + '</a><div><p class="jh-pdesc L">' + item[1].valueOf() + '</p><p class="jh-pdesc R">' + item[2].valueOf() + '</p></div></div></li>');
        });

        $("a.jh-case_status").click(function() {
            getEditPage($(this).text(), "PSEstatus");
        });



        // $("a.jh-case_updates-args").click(function(){
        // 	getEditPage($('#jh-unibar').val());
        // });

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
                analizeText($(this).val());
            }
        });

        var options = {
            valueNames: ['name'],
            plugins: [ListFuzzySearch()],
            searchClass: 'jh-unibar',
            location: 0,
            distance: 100,
            threshold: 0.4,
            multiSearch: true
        };
        $('div.jh-unilinkw').focusin(function() { $(this).toggleClass('jh-hover'); });
        $('div.jh-unilinkw').focusout(function() { $(this).toggleClass('jh-hover'); });
        var listObj = new List('jh-uniwrapper', options);

        $('#jh-unibar').on('keydown', function(e) {
            console.log(e.keyCode.toString() + " " + e.which.toString());
            //	$('.jh-unilinkw').first().addClass('jh-hover');			    
            //    $('.list').find('li').each(function(index, el) {
            //    	if (index > 0)
            //    		$(this).removeClass('jh-hover');
            //    });
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

    function analizeText(value) {
        console.log(value);
        var array = value.split(" ");
        switch (array[0]) {
            case "tfs":
                getEditPage(array[1], array[0]);
                break;
            case "update":
                $('.jh-unilinkw').parent('li').hide();
                getCaseCommentPage(array[1]);
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
    }

    function submitdata() {
        console.debug('entered submitdata()');
        // TODO: Add REST API Support to add comments
        // http://stackoverflow.com/questions/20155531/converting-curl-cmd-to-jquery-ajax
        // http://www.salesforce.com/us/developer/docs/api_rest/api_rest.pdf
        $.ajax({
            url: "http://www.example.com/api",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
            },
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            data: '{"foo":"bar"}',
            success: function(data) {
                alert(JSON.stringify(data));
            },
            error: function() {
                console.error("submitdata()", "Cannot get data");
            }
        });
    }


    function hideunibar() {
        $('#jh-unibar').val('');
        $('#jh-uniwrapper').hide();
    }

    function getEditPage(value, type) {
        var geturl = $('input[name="edit"]').attr('onclick');
        var url = geturl.toString().replace(/(^navigateToUrl\(')([0-9a-zA-Z\/]{2,}\?retURL=%[0-9a-zA-Z\/]{2,})(','([A-Z]*)','([A-Za-z]*)'\);)/, "$2");
        console.log(url);
        $('#myEditBox').load(url, function() {
            var action = $('#editPage').attr('action');
            console.log("loaded Edit Page");
            if (value.match(/[0-9]{2,}/) && type == "tfs") {
                $('#00N30000004r0fX').val(value);

            }
            if (type == "PSEstatus") {
                console.log("found escalation status");
                $('#00N30000004r0fn').val(value);
            }
            if (type == "CASEstatus") {
                console.log("found case status");
                $('#cas7').val(value);
            }
            // $("#editPage").submit(function(event) {
            // 	$('#myEditBox2').load(action,function() {
            // 		/* Act on the event */
            // 	});
            // 	return false;
            // });
            $(this).find("form").find(".btn[name='save']").click();
        });
        hideunibar();
    }

    function getCaseCommentPage(value) {
        var geturl = $('input[name="newComment"]').attr('onclick');
        var url = geturl.toString().replace(/(^navigateToUrl\(')([0-9a-zA-Z\/]{2,}\?parent_id=[0-9a-zA-Z]{2,}&retURL=%[a-zA-Z0-9]{2,})',null,'[a-zA-Z]{2,}'\);$/, "$2");
        console.log(url);

        // <textarea cols="80" id="CommentBody" maxlength="4000" name="CommentBody" onchange="handleTextAreaElementChangeWithByteCheck('CommentBody', 4000, 4000, 'remaining', 'over limit');" onclick="handleTextAreaElementChangeWithByteCheck('CommentBody', 4000, 4000, 'remaining', 'over limit');" onkeydown="handleTextAreaElementChangeWithByteCheck('CommentBody', 4000, 4000, 'remaining', 'over limit');" onkeyup="handleTextAreaElementChangeWithByteCheck('CommentBody', 4000, 4000, 'remaining', 'over limit');" onmousedown="handleTextAreaElementChangeWithByteCheck('CommentBody', 4000, 4000, 'remaining', 'over limit');" rows="8" tabindex="2" type="text" wrap="soft" style="background-image: none; background-position: 0% 0%; background-repeat: repeat;"></textarea>
        if ($('#jh-unitextw').length)
            $('#jh-unitextw').remove();

        $('#jh-uniwrapper').append('<div id="jh-unitextw"><textarea class="jh-textarea" maxlength="4000" /></div>');
        var options = { maxHeight: 600 };
        $('.jh-textarea').autogrow(options);
        $('#jh-unitextw').append('<div id="jh-counter"></div>');
        $('.jh-textarea').on('keydown', function() {
            $('#jh-counter').text($(this).val().length + '/4000');
        });

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
                string = "Is there any news regarding this case? \
I would like to know how you would like to proceed with this case. Would you prefer I keep checking in, just wait to hear back from you, or close this case out and we can open it again if there are problems. \
I want to make sure you are supported, but don't want to continually bother you either.\n\nLet me know how to proceed.\n\n";
				break;
			case "a2":
				string = "As I have not heard anything back regarding my previous emails, and I can't keep cases open indefinitely, I will go ahead and archive this case. \
This case can be reopened at your convenience. \
If you have new information regarding this case or have any questions, please reference this case number and do one of the following to reopen this case: Reply to this email, open a new ticket at support.landesk.com, \
or call 1.800.581.4553.\n\nHave a great day!\n\n";
				 break;
            default:
                string = '';
                break;
        }

        $('.jh-textarea').val(string);

        $('body').on('keydown', function(e) {
            if (e.altKey && e.keyCode == 83) {
                e.preventDefault();
                var jh_text = $('.jh-textarea').val();
                hideunibar();
                console.log("detected alt+s");
                console.log(jh_text);
                $('#myEditBox').load(url, function() {
                    console.log('getting case comment edit page');
                    $('#CommentBody').val(jh_text);
                    if (string.length < 1) {
                        $('#IsPublished').prop('checked', 'true');
                    }

                    $(this).find("form").find(".btn[name='save']").click();
                });
            }
        });

    }



    $(document).bind('keydown', 'alt+u', function() {
        console.log("detected alt+u");
        if ($('#jh-uniwrapper').is(":visible")) {
            $('#jh-uniwrapper').hide();
        } else {
            if ($('#jh-uniwrapper').length) {
                $('#jh-uniwrapper').remove();
            }
            init();
            $('#jh-uniwrapper').show();
            $('#jh-unibar').focus();
        }
        $('body').on('keydown', (function(e) {
            if (e.keyCode == 27) {
                // $('#jh-unibar').focus();
                hideunibar();
            }
        }));
    });

});
