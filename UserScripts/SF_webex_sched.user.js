// ==UserScript==
// @name       SF_webex_scheduling
// @namespace  https://github.com/b1kjsh/sf_tools
// @version    0.24
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest 
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @include     https://na19.salesforce.com/00U*
// @description  Days Since Updated and the Case Status column is required for this script.
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL   https://github.com/b1kjsh/sf_tools/raw/master/UserScripts/SF_webex_sched.user.js
// @resource CSS https://raw.githubusercontent.com/b1kjsh/sf_tools/master/UserScripts/Resources/font-awesome/css/font-awesome.css
// @copyright  2012+, You
// ==/UserScript==

$(document).ready(function() {
    // var fontawesome = GM_getResourceText('CSS');
    // GM_addStyle(fontawesome);
    
    // Reference URL https://landesk.webex.com/LANDesk/m.php?AT=SM&YE=2014&MO=6&DA=1&HO=08&MI=50&MN=ANOTHERTEST
    var baseURL, year, month, day, hour, minute, meetName, casenum, time, arg, DEBUG;
    var mEmail, mPhone, mProduct, mPassword, mUser, pw, u, loginURL;
    var y, m, d, h, mi, mn, fn, ln, em, wid;
    
    DEBUG = false;
    baseURL = 'https://landesk.webex.com/landesk/m.php';
    loginURL = 'https://landesk.webex.com/landesk/p.php';
    arg = 'AT=';
    year = '&YE=';
    month = '&MO=';
    day = '&DA=';
    hour = '&HO=';
    minute = '&MI=';
    meetName = '&MN=';
    firstName = '&FN=';
    lastName = '&LN=';
    pw = '&PW=';
    u = '&WID=';
    mEmail = GM_getValue('email');
    mUser = GM_getValue('username');
    PASS = GM_getValue('password');
    mPhone = GM_getValue('phone');
    mProduct = GM_getValue('product');
    backURL = '$BU=panel.html';
    casenum = $('#evt3').val();
    
    function buildURL(flag) {
      var finalURL;
      console.log('buildURL()','initiated');
      switch(flag)
      { 
        case 'LI':
        finalURL = arg + flag + u + mUser + pw + PASS;
        console.log('buildURL()', finalURL);
                // if (DEBUG)
                // $('#evt6').val(loginURL+finalURL);
                break;
                
                case 'SM':
                var date = $('input#StartDateTime').val();
                d = date.replace(/\/([0-9]+)$/, '').replace(/.*\//, '');
                var n = date.length - 1;
                m = date.replace(/\/([0-9]+)\/([0-9]+)$/, '');
                y = date.replace(/^([0-9]+)\/([0-9]+)\//, '');
                var time = $('input#StartDateTime_time').val();
                h = time.replace(/(AM|PM|am|pm)/, '').replace(/:([0-9]+)/, '').replace(/\W/, '');
                mi = time.replace(/(AM|PM|am|pm)/, '').replace(/^([0-9]+):/, '').replace(/\W/, '');
                mn = $('#evt5').val().replace(/\s/g, '%20');
                var test = time.replace(/\w\w$/, '');
                console.log("Check Hour", test);
                if (test == 'PM') {
                  console.log("Check Hour","found PM");
                  h = parseInt(h) + 12;
                  console.log(h);
                }
                finalURL = arg + flag + year + y + month + m + day + d + hour + h + minute + mi + meetName + mn;
                console.log('buildURL()', finalURL);
                // if (DEBUG)
                // $('#evt6').val(baseURL+finalURL);
                break;
                
                default:
                date = $('input#StartDateTime').val();
                d = date.replace(/\/([0-9]+)$/, '').replace(/.*\//, '');
                n = date.length - 1;
                m = date.replace(/\/([0-9]+)\/([0-9]+)$/, '');
                y = date.replace(/^([0-9]+)\/([0-9]+)\//, '');
                time = $('input#StartDateTime_time').val();
                h = time.replace(/(AM|PM|am|pm)/, '').replace(/:([0-9]+)/, '').replace(/\W/, '');
                mi = time.replace(/(AM|PM|am|pm)/, '').replace(/^([0-9]+):/, '').replace(/\W/, '');
                mn = $('#evt5').val().replace(/\s/g, '%20');
                test = time.replace(/\w\w$/, '');
                console.log("Check Hour", test);
                if (test == 'PM') {
                  console.log("Check Hour","found PM");
                  h = parseInt(h) + 12;
                  console.log(h);
                }
                finalURL = arg + flag + year + y + month + m + day + d + hour + h + minute + mi + meetName + mn;
                console.log('buildURL()', finalURL);
                break;
              }

        // &FN=First Name&LN=Last Name &EM=E-mail&WID=Login&PW=Password 
        
        return finalURL;
      }
      $('table.detailList').first().before('<div id="mContainerDay">' + btnSetDay('Monday') + btnSetDay('Tuesday') + btnSetDay('Wednesday') + btnSetDay('Thursday') + btnSetDay('Friday') + '</div>');
      // $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">');
      // $('head').append('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">');
      // $('head').append('<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap-theme.min.css" rel="stylesheet">');
      // $('head').append('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>');

      $('.btn[name=save]').first().before('<input class="btn" type="button" id="create"/>');
      $('.pbTitle').css('width','18%');
      $('input#create').val('Schedule WebEx');
      $('input#create').css('margin-right', '5px');
      $('input#create').click(function () {
        var kk = $('#evt6').val() || "default";    
        if (kk != "default" && kk.length > 500){

          foundMK = String(kk).match(/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/);
          SCHEDULE(baseURL, buildURL('EM&MK='+ foundMK));
          console.log('rescheduling', foundMK);
        }else {
          SCHEDULE(baseURL,buildURL('SM'));
        }
      });
      $('#mContainerDay').append('<div id="bContainer">'+btnSetTime('9:00 AM')+btnSetTime('10:00 AM')+btnSetTime('11:00 AM')+btnSetTime('2:00 PM')+btnSetTime('3:00 PM')+btnSetTime('4:00 PM')+'</div>');
    // $('div.linkElements').append('<div id="menu" style="display: none;"><ul><li>Username</li><li>Password</li><li>Menu item</li><li>Menu item</li></ul></div><a id="usersettings" class="menu">User Settings</a>');
    // $("div.linkElements").append('<a id="settings"><i class="fa fa-bars"></i>User Settings</a><div id="settingsWrapper" class="input-group" style="display: none;"><span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span><input class="form-control" type="text" placeholder="Email address"><div class="userSettingsListItem">Username:</div><input id="username" value="'+ GM_getValue('username') + '"></input>    <div class="userSettingsListItem">Password:</div>    <input id="password" value="'+ GM_getValue('password') + '"></input>    <div class="userSettingsListItem">Phone:</div>    <input id="phone" value="'+ GM_getValue('phone') + '"></input>        <div class="userSettingsListItem">Email:</div>    <input id="email" value="'+ GM_getValue('email') + '"></input>    <div class="userSettingsListItem">Product:</div>    <input id="product" value="'+ GM_getValue('product') + '"></input><br> <input class="btn" type=button  value="save" id="usersettingsSave" /> <input id="usersettingsClose" type=button class="btn" value="close" /></div>');
    // $("div.linkElements").append('<div class="menuButtonButton"><span class="menuBettonLabel" id="userNavLabel">settings</span><div class="userNav-buttonArrow mbrButtonArrow" id="userNav-arrow"></div></div>');
    // $("div.linkElements").append('<div class="myUserSettings"><a id="settings" class="navLinks">Hello</a></div>');
    

    var uname = GM_getValue('username');
  var upass = GM_getValue('password');
  var umail = GM_getValue('email');
  var uphon = GM_getValue('phone');
  var uprod = GM_getValue('product');

  var q = [GM_getValue('username'),GM_getValue('password'),GM_getValue('email'),GM_getValue('phone'),GM_getValue('product')];
  if (uname == null)
    q[0] = "username";
  if (upass == null)
    q[1] = "password";
  if (umail == null)
    q[2] = "email";
  if (uphon == null)
    q[3] = "phone";
  if (uprod == null)
    q[4] = "product";

  var settingPageHtml = '<div class="input-group margin-sm">' +
  '<span class="input-group-addon">Username     ' +
  '<input id="username" class="form-control" type="text" value="'+q[0]+'"></span>' +
  '</div>' +
  '<div class="input-group margin-sm">' +
  '<span class="input-group-addon">Password     ' +
  '<input id="password" class="form-control" type="password" value="'+q[1]+'"></span>' +
  '</div>' +
  '<div class="input-group margin-sm">' +
  '<span class="input-group-addon">Email     ' +
  '<input id="email" class="form-control" type="text" value="'+q[2]+'"></span>' +
  '</div>' +
  '<div class="input-group margin-sm">' +
  '<span class="input-group-addon">Phone     ' +
  '<input id="phone" class="form-control" type="text" value="'+q[3]+'"></span>' +
  '</div>' +
  '<div class="input-group margin-sm">' +
  '<span class="input-group-addon">Product     ' +
  '<input id="product" class="form-control" type="text" value="'+q[4]+'"></span>' +
  '</div>' +
  '<button type="button" id="usersettingsSave" class="btn-sm btn-primary center">Save</button>' +
  '<button type="button" id="usersettingsClose" class="btn-sm btn-default center">Close</button>' +
  '</div>';
  $("div.linkElements").append('<a id="asdf">Settings</a>');
  $("#asdf").after('<div id="settingsWrapper" class="myUserSettings panel" style="display:none;"> '+ settingPageHtml +' </div>');
  $('.myUserSettings').css('position','absolute');
  $('.myUserSettings').css('z-index','100');
  $('.myUserSettings').css('width','auto');
  $('.myUserSettings').css('backgroundColor','#80CDE4');
  $('.margin-sm').css('margin','5px');
  $('.btn').addClass('btn-xs btn-info');
  // $('.btn').removeClass('btn');
  $('#usersettingsSave').click(function(){
    GM_setValue('email', $('#email').val());
    GM_setValue('phone', $('#phone').val());
    GM_setValue('username',$('#username').val());
    GM_setValue('password',$('#password').val());
    GM_setValue('product',$('#product').val());
  // $('#usersettingsSave').toggleClass('btn-primary', false);
  // $('#usersettingsSave').toggleClass('active');
  $("#settingsWrapper").hide();
  });
  $('#usersettingsClose').click(function(){$("#settingsWrapper").hide();});
  $("#asdf").click(function () {
    console.log("OnClick Detected: Settings");
    $("#settingsWrapper").css(["position","relative"]);
    $("#settingsWrapper").show();

  });


      function btnSetTime(value) {
        return '<input class="scheduler" type="button" name="sched' + value + '" id="sched" value="' + value + '"/>';
        // return '<input class="btn" type="button" onclick="ActivityFunction.updateEndTime(\'StartDateTime\',\'StartDateTime_time\', \'EndDateTime\', \'EndDateTime_time\');ActivityFunction.checkDuration(\'IsRecurrence\',\'evt15\',\'StartDateTime\',\'StartDateTime_time\',\'EndDateTime\',\'EndDateTime_time\');" name="sched' + value + '" id="sched" value="' + value + '" />';
      }
      function schedAction(v){    
        console.log('scheduling');
        var casenum = $('#evt3').val();
        var custname = $('#evt2').val();
        //  $('#evt6').val(buildURL('1','1','1','1','1','1'));
        $('#evt10').val('Meeting');
        $('#evt5').val('Case '+casenum+' - '+ custname + '');
        $('#StartDateTime_time').val(''+v+'');
        ActivityFunction.updateEndTime('StartDateTime','StartDateTime_time', 'EndDateTime', 'EndDateTime_time');
        ActivityFunction.checkDuration('IsRecurrence','evt15','StartDateTime','StartDateTime_time','EndDateTime','EndDateTime_time');
      }

      $('.scheduler').click(function() {
        console.log('click',$(this).val());
        schedAction($(this).val());
      });


      function btnSetDay (value) {
        return '<input class="btn.scheduler" style="display: none;" type="button" name="mDay" id="mDay' + value + '" value="'+ value +'" />';
      }

      function SCHEDULE (url, data) {
        GM_xmlhttpRequest({
          method: "POST",
          url: url,
          data: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          onload: function(response) {
            console.log(response);
            console.log(response.finalUrl);
            var date, time, meetingkey, mPassword;
            date = $('input#StartDateTime').val();
            time = $('input#StartDateTime_time').val();
            meetingkey = response.finalUrl.match(/([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])/g);
            mPassword = 'no password';
            var message  = 'Hello, \n\n'+'Thank you for contacting LANDesk Support, this is an invite for a WebEx session on Case Number: ' + casenum + '. Please join the meeting scheduled on ' + date + ' at ' + time + ' MST using the following WebEx information:\n' + '\nMeeting Number: '+ meetingkey + '\nMeeting Password: ' + mPassword + '\n\n1. Go to https://landesk.webex.com/ and enter your meeting number.' + '\n2. If requested, enter your name and email address.' + '\n3. If a password is required, enter the meeting password: ' + mPassword + '\n4. Click "Join".' + '\n5. Follow the instructions that appear on your screen.' + '\n\nIf you\'re having issues joining our meeting you can contact me at:\n'; message = message.replace(/landesk/ig,mProduct) + mEmail + '\n' + mPhone;    
            $('#evt6').val(message);
          }

        });

}

function POSTLOGIN (url, data) {
  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    onload: function(response) {
      console.log(response);
      console.log(response.finalUrl);
    }

  });

}

$('#mDayTuesday').click(function() {SCHEDULE(baseURL,buildURL('SM'));});

$('#editPage').submit(function(){
        // if (mn.length > 0){
          SCHEDULE(baseURL,buildURL('SM'));
        // alert('message');
      });

    // rescheudling logic
    // $('input#create').click(function () {
    //     var kk = $('#evt6').val() || "default";    
    //     if (kk != "default" && kk.length > 500){

    //         foundMK = String(kk).match(/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/);
    //         self.port.emit('message', buildURL('EM&MK='+ foundMK));
    //         console.log('rescheduling', foundMK);
    //     }else {
    //         self.port.emit('message', buildURL('SM'));
    //     }
    // });



// POSTLOGIN(loginURL,buildURL('LI'));




});


// http://landesk.webex.com/landesk/p.php?AT=SU&PID=PID&FN=First Name&LN=Last Name &EM=E-mail&WID=Login&PW=Password 