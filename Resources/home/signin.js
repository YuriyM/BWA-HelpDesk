/*
 * 'mblUserEmail' - Ti.App.Properties string name for user email
 * 'mblUserPwd' - Ti.App.Properties string name for user password
 */
Ti.include('../includes/network_webservice_client.js');
var win = Titanium.UI.currentWindow;

//
// Window controls initialization
//
var data = [];

var rowLogin = Ti.UI.createTableViewRow({
	height:55,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var lblLogin = Titanium.UI.createLabel({
    text:'Email',
    height:'auto',
    width:70,
    left: 10,    
    font:{fontWeight:'bold'}
});

var savedEmail = Ti.App.Properties.getString('mblUserEmail', '');
var textLogin = Titanium.UI.createTextField({
	color:'#336699',
	left:85,
	width:200,
	hintText:'Required',
	value: savedEmail
});
rowLogin.add(lblLogin);
rowLogin.add(textLogin);
data[0] = rowLogin;

var rowPassword = Ti.UI.createTableViewRow({
	height:55,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var lblPassword = Titanium.UI.createLabel({
    text:'Password',
    height:'auto',
    width:70,
    left: 10,    
    font:{fontWeight:'bold'}
});

var textPassword = Titanium.UI.createTextField({
	color:'#336699',
	left:85,
	width:200,
	hintText:'Required',
	passwordMask:true
});
rowPassword.add(lblPassword);
rowPassword.add(textPassword);
data[1] = rowPassword;

var tvLogin = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

// add created table view to window
tvLogin.hide();
win.add(tvLogin);

var data = [];
var rowLogout = Ti.UI.createTableViewRow({
	height:50,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	header: 'Logged in as'
});

var savedUser = Ti.App.Properties.getString('mblUserEmail', '');
var txtLogin = Titanium.UI.createLabel({
	color:'#336699',
    text:savedUser,
    color:'#336699',
	width:'auto',
	font:{fontSize: 20, fontWeight:'bold'}
});
rowLogout.add(txtLogin);
data[0] = rowLogout;

var rowOrg = Ti.UI.createTableViewRow({
	height:50,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	header: 'Organization'
});

var txtOrg = Titanium.UI.createLabel({
	color:'#336699',
    text:'bigWebApps Support',
    color:'#336699',
	width:'auto',
	font:{fontSize: 20, fontWeight:'bold'}
});
rowOrg.add(txtOrg);
data[1] = rowOrg;

var tvLogoutEmail = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

var tvLogout = Titanium.UI.createView({
	width: '100%',
	height: '100%'
});

var bLogout = Titanium.UI.createButton({
	title:'Log Out',
	height:45,
	width: 300,
	top:215,
	color: '#111111',
	font:{fontSize: 18, fontWeight:'bold'},
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

bLogout.addEventListener('click', function(e)
{	
	Ti.App.Properties.setString('mblUserPwd', null);
	loginInit();
});

tvLogout.add(tvLogoutEmail);
tvLogout.add(bLogout);
tvLogout.hide();
win.add(tvLogout);
// === complete controls initialization ===

function openDashboard(timeout)
{
	var win = Ti.UI.createWindow( {
			    	title : 'Dashboard',				
				    url: 'home.js',
				    _parent: Titanium.UI.currentWindow,
				    navGroup : Titanium.UI.currentWindow.navGroup,
				    rootWindow : Titanium.UI.currentWindow.rootWindow
				});
			    setTimeout(function (){Titanium.UI.currentWindow.navGroup.open(win, {animated:true}); }, timeout );
}
//
// Nav bar controls initialization
//
var bNavLogin= Titanium.UI.createButton({ title: 'Log In' });
bNavLogin.addEventListener('click', function(e)
{
	var email = textLogin.value;
	if (email.length === 0)
	{
		alert('Please, enter login');
		return;
	}
	
	var pwd = textPassword.value;
	if (pwd.length === 0)
	{
		alert('Please, enter password');
		return;
	}
	
	Ti.App.Properties.setString('mblUserEmail', email);
    Ti.App.Properties.setString('mblUserPwd', pwd);
    textPassword.value = '';
	checkCredentials(email, pwd);
});

var bNavDashboard = Titanium.UI.createButton({ title: 'Dashboard' });
bNavDashboard.addEventListener('click', function(e)
{
	openDashboard(10);
});

var navSettings = Ti.UI.createButton({title:'Settings'});
navSettings.addEventListener('click', function(e)
{
	var win = Ti.UI.createWindow( {
	       		title : 'Settings',				
		        url: 'settings.js',
		        _parent: Titanium.UI.currentWindow,
		        navGroup : Titanium.UI.currentWindow.navGroup,
		        rootWindow : Titanium.UI.currentWindow.rootWindow
		    });		     
		 	Titanium.UI.currentWindow.navGroup.open(win, {animated:true});
});
win.leftNavButton = navSettings;
// === complete Nav bar controls initialization ===

function checkCredentials(email, pwd)
{
	Ti.App.fireEvent('show_global_indicator',{message: 'Signing In'});
    mbl_dataExchange("GET", "Tickets.svc?pg=1&ps=2",
    	function () {
    		Ti.App.fireEvent('hide_global_indicator');
        	Ti.API.info('Login HTTP Status = ' + this.status);
    		Ti.API.info('Login HTTP Response = ' + this.responseText);
    		if (this.status === 200)
    		{	
	        	tvLogin.hide();
				tvLogout.show();	
				win.setRightNavButton(bNavDashboard);
	        	openDashboard(800);	
			}
			else
			{
				loginInit();
				alert('Login failed. Error code: ' + this.status);				
			}
    	},
    	function (e) {  },
    	function (e) { Ti.App.fireEvent('hide_global_indicator'); loginInit();alert('Login Connect Error. Details: ' + JSON.stringify(e)); },
    	null,
    	email,
    	pwd);
}

function loginInit()
{	
	tvLogout.hide();
	tvLogin.show();
    win.setRightNavButton(bNavLogin);
}

var email = Ti.App.Properties.getString('mblUserEmail', null);
var pwd = Ti.App.Properties.getString('mblUserPwd', null);
if ((email === null) || (typeof email === "undefined") || (pwd === null) || (typeof pwd === "undefined"))
	loginInit();
else
	checkCredentials(email, pwd);