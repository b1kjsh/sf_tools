// ==UserScript==
// @name       SF_cases
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    0.05
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @description  Days Since Updated and the Case Status column is required for this script.
// @include     https://na19.salesforce.com/500*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @require     https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/Resources/fuzzy/list.fuzzysearch.min.js
// @resource    jh_CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/mycss.css
// @resource    jh_CSS_layout https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/css/layout.css
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_cases.user.js
// @copyright  2014+, Josh Howard
// ==/UserScript==

$(document).ready(function() {
	$('body').append('<input type="text" class="jh-unibar"></input>');
	var fuzzyOptions = {
		searchClass: "jh-unibar",
		location: 0,
		distance: 100,
		threshold: 0.4,
		multiSearch: true
	};
	var options = {
	  valueNames: [ 'name', 'category' ],
	  plugins: [
	    ListFuzzySearch()
	  ]
	};

	var listObj = new List('list-id', options);

	// Search manually 
	listObj.fuzzySearch.search('my search');

	// Search manually on specific columns
	listObj.fuzzySearch.search('my search', { name: true });

});