/**
* bigWebApps HelpDesk Mobile Client
* Copyright (c) 2011 by bigWebApps, Inc. All Rights Reserved.
**/

// Architecture follows Tweetanium app

// 'bwa' (tt) general namespace - short from bigWebApps,
// 'bwa.ui'
// '$$' - pseudo for 'bwa.ui.styles', hold pre-defined styles
// 'bwa.app'

// support two waysold and new

var runRightWay = false;

if (runRightWay)
{
	
Ti.include('/helpdesk/helpdesk.js');

bwa.app.mainWindow = bwa.ui.createApplicationWindow();
bwa.app.mainWindow.open();

}
else
{
	
Ti.include('controls/global_custom_message.js');
Ti.include('controls/global_load_indicator.js');

if (Ti.Platform.osname !== 'android')
{ // iOS
	var appBase = Ti.UI.createWindow({ backgroundColor:'#ffffff' });
	var navGroup = Ti.UI.iPhone.createNavigationGroup({	 });	
	var winHome = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
	    id: 'winHome',
	    url: 'home/signin.js',
	    title: 'HelpDesk',
	    _parent: appBase,
	    navGroup : navGroup,
	    rootWindow : appBase
	});
	navGroup.window = winHome;
	appBase.add(navGroup);
	
	var splash = Titanium.UI.createWindow({
	    top: 0,
	    left: 0,
	    width: 320,
	    height: 460,
	    //modal: true,
	    backgroundImage: 'Default.png'
	});
	splash.addEventListener('click', function(e) {
		splash.close();
	});
	
	Ti.App.addEventListener('pause', function(e) {
		//Ti.API.info('pause event fired: ' + Ti.App.getArguments());
		//navGroup.open(splash);
		splash.open();
	});
	
	Ti.App.addEventListener('resume', function(e) {
		//Ti.API.info('Resume event fired: ' + Ti.App.getArguments());
		//splash.open();
	    setTimeout(function() { splash.close();  }, 1000);
	});
	
	Ti.App.addEventListener('resumed', function(e) {
		//Ti.API.info('Resume event fired: ' + Ti.App.getArguments());
		//splash.open();
	    setTimeout(function() { splash.close(); }, 1000);
	});
	
	appBase.open();
}
else
{
	var winHome = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
	    id: 'winHome',
	    url: 'tickets/ticket_list.js',
	    title: 'HelpDesk',
	    tabBarHidden: true
	});
	winHome.open();
}//<property name="ti.android.fastdev" type="bool">true</property>

}