// ==UserScript==
// @name       SF_cases_layout
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    1.05
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/Resources/fuzzy/list.fuzzysearch.min.js
// @resource    jh_CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/mycss.css
// @resource    jh_CSS_layout https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/layout_unibar.css
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_cases_layout.user.js
// @copyright  2014+, Josh Howard
// ==/UserScript==
$(document).ready(function() {
	var jh_CSS = GM_getResourceText('jh_CSS')
	var jh_CSS_layout = GM_getResourceText('jh_CSS_layout');
	GM_addStyle(jh_CSS);
	GM_addStyle(jh_CSS_layout);
	$('#phHeader').addClass('jh-hidden');
	$('div.presence_chat_widget').addClass('jh-hidden');
	$('.sidebarCell').addClass('jh-hidden');
	$('.linkBar').addClass('jh-hidden');
	$('.chatterFollowUnfollowAction').addClass('jh-hidden');
	$('.x-grid3-hd-row').addClass('jh-background');
	// $('.linkBar').addClass('jh-background');
	$('.bottomNav').addClass('jh-background');
	$('#ext-gen10').addClass('jh-background');
	$('.zen-active').toggleClass('jh-active');
	$('.rolodex').insertAfter('div.filterLinks').toggleClass('jh-hidden');
	$('#tabBar').append('<li id="mysearch"></li>');
	$('#phSearchForm').appendTo('#mysearch');
	$('#phSearchForm').addClass('jh-search');
});