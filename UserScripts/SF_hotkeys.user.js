// ==UserScript==
// @name       SF_hotkeys
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    0.04
// @description  HotKeys for SalesForce
// @include     https://na19.salesforce.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require     https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/hotkeys/jquery.hotkeys.js
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_hotkeys.user.js
// @copyright  2015+, Josh Howard
// ==/UserScript==

$(document).ready(function() {
    $(document).bind('keydown', 'ctrl+shift+s', function(){
       $('#phSearchInput').focus();
    });
    $(document).bind('keydown', 'ctrl+q', function(){
       $('#ext-gen21').trigger("click");
    });
    

});