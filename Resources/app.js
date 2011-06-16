Ti.include('controls/global_custom_message.js');
Ti.include('controls/global_load_indicator.js');

var appBase = Ti.UI.createWindow({ backgroundColor:'#ffffff'/*, backgroundImage: 'Default.png'*/ });
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
    setTimeout(function() { splash.close(); /*navGroup.close(splash);*/ }, 1000);
});

Ti.App.addEventListener('resumed', function(e) {
	//Ti.API.info('Resume event fired: ' + Ti.App.getArguments());
	//splash.open();
    setTimeout(function() { splash.close(); /*navGroup.close(splash);*/ }, 1000);
});

appBase.open();