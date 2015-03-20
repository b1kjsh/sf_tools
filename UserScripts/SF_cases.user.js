// ==UserScript==
// @name       SF_cases
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    0.05
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @require     http://listjs.com/no-cdn/list.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/Resources/fuzzy/list.fuzzysearch.min.js
// @resource    jh_CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/mycss.css
// @resource    jh_CSS_layout https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/layout_unibar.css
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_cases.user.js
// @copyright  2014+, Josh Howard
// ==/UserScript==

$(document).ready(function() {
	$('body').append('<div id="myEditBox" />');
	var jh_CSS = GM_getResourceText("jh_CSS");
    var jh_CSS_layout = GM_getResourceText("jh_CSS_layout");
    GM_addStyle (jh_CSS);
    GM_addStyle (jh_CSS_layout);    
	function getEditPage(value) {
		var geturl = $('input[name="edit"]').attr('onclick');
		var url = geturl.toString().replace(/(^navigateToUrl\(')([0-9a-zA-Z\/]{2,}\?retURL=%[0-9a-zA-Z\/]{2,})(','([A-Z]*)','([A-Za-z]*)'\);)/,"$2")
		console.log(url);
		$('#myEditBox').load(url , function() {
			console.log("loaded Edit Page");
			if ($('#00N30000004r0fn').length){
				console.log("found escalation status");
				$('#00N30000004r0fn').val(value);
			}
			if ($('#cas7').length){
				console.log("found case status");
			}
			$(this).find("form").find(".btn[name='save']").click();
		});
	}

	$('#sidebarCell').prepend('<div id="jh-uniwrapper"><input type="text" class="jh-unibar"></input><ul class="list jh-unilist"></ul></div>');
	var items = ["Waiting on Case Owner","Escalated to Engineering"];

	$.each(items, function(i, item) {
		var t = i+1
	      $('#jh-uniwrapper').find('.list').append('<li><div class="jh-unilinkw"><a tabindex="'+t+'" class="name jh-unilink" name="' + item.valueOf().replace(/\s/g,'_').toLowerCase() + '">' + item.valueOf() + '</a><p class="jh-pdesc">This is an example of a long description for the action</p></div></li>');
	      // $('#topButtonRow').append('<input value=" '+item.valueOf()+' " title="'+item.valueOf()+'" class="btn" type="button">');
	});  // close each()
	
	// $("a[name='escalated_to_engineering']").click(function(){
	// 	escalated();
	// });

	// $("a[name='waiting_on_case_owner']").click(function(){
	$("a.jh-unilink").click(function(){
		// $('div#00N30000004r0fn_ileinner').dblclick();
		getEditPage($(this).text());
		// sfdcPage.save();
	});

	$('.name').keypress(function (e) {
	  	console.log("here");
	  	// escalated();
	  if (e.which == 13) {

	    $('.name').click();
	}});

	var options = {
	  valueNames: [ 'name' ],
	  plugins: [ListFuzzySearch()],
	  searchClass: 'jh-unibar',
		location: 0,
		distance: 100,
		threshold: 0.4,
		multiSearch: true
	};
	$('div.jh-unilinkw').focusin(function(){$(this).toggleClass('jh-hover')});
	$('div.jh-unilinkw').focusout(function(){$(this).toggleClass('jh-hover')});
	// $('div.jh-unilinkw').focusin(function() {alert("message")});
	// $('.jh-unibar').focusout(function({

	// 	$('div.jh-unilinkw').focus()
	// });
	var listObj = new List('jh-uniwrapper', options);

	$('.jh-unibar').focusout(function() {
		$('.list').find('li').find('a').focus();
	});


	// // Search manually 
	// listObj.fuzzySearch.search('my search');

	// // Search manually on specific columns
	// listObj.fuzzySearch.search('my search', { name: true });

});