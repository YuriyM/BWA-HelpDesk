Ti.include('../controls/control_table_pulldown.js');
var win = Titanium.UI.currentWindow;

//
// Create main Table View
//
var tvDashboard = Titanium.UI.createTableView({ style:Titanium.UI.iPhone.TableViewStyle.GROUPED });

tvDashboard.addEventListener('click', function(e)
{	
	if (e.rowData.subWindowURL) // just to exlude imcomplete windows
	{
		var win = Ti.UI.createWindow( {
	       	title : e.rowData.subWindowTitle,				
		    url: e.rowData.subWindowURL,
		    _parent: Titanium.UI.currentWindow,
		    navGroup : Titanium.UI.currentWindow.navGroup,
		    rootWindow : Titanium.UI.currentWindow.rootWindow
		});		     
		Titanium.UI.currentWindow.navGroup.open(win, {animated:true});		
	}
});

// Pull down section init
mbl_addTablePullDownHeader(tvDashboard, function () { tvDashboard.setData([]); }, loadDashboard );

win.add(tvDashboard);

//
// Nav Bar Init
//
var navSignOut = Ti.UI.createButton({title:'Sign Out'});
navSignOut.addEventListener('click', function(e)
{
    Ti.App.Properties.setString('mblUserPwd', '');
    win.navGroup.close(win);
});
win.setRightNavButton(navSignOut);
win.leftNavButton = Ti.UI.createView({ width: 10 });;

//
// Fill Main Dashboard TableView
//
var data = [
	//General section
	{title:'Accounts', hasChild:true, subWindow:'../tickets/ticket_list.js' },
	{title:'Locations', hasChild:true, subWindow:'../tickets/ticket_list.js'},
	{title:'Tickets', hasChild:true, subWindow:'../tickets/ticket_list.js'},
	{title:'Projects', hasChild:true, subWindow:'../tickets/ticket_list.js'},
	// Active link
	{title:'Tickets', hasChild:true, subWindow:'../tickets/ticket_list.js', subWindowURL:'../tickets/ticket_list.js', header: 'Test Tickets', leftImage: '../images/single_bucket.png'},
	// Tickets section
	{title:'New Messages', hasChild:true, subWindow:'../tickets/ticket_list.js', header: 'Ticket Summary', leftImage: '../images/single_bucket.png'},
	{title:'Open Tickets', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'Open as End User', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'On Hold', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'Waiting On Parts', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'Follow-Up Dates', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'Unconfirmed', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	// Queues
	{title:'Future Consideration', hasChild:true, subWindow:'../tickets/ticket.js', header: 'Queues', leftImage: '../images/single_bucket.png'},
	{title:'MC3 Upgrade', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'Pre-Development', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'},
	{title:'Website fixes', hasChild:true, subWindow:'../tickets/ticket_list.js', leftImage: '../images/single_bucket.png'}
];

function loadDashboard()
{
	var tableData = [];
	for(var i=0,ilen=data.length; i<ilen; i++)
	{
		var thisObj = data[i];
		
		var row = Ti.UI.createTableViewRow({
		    //className: 'home_row',
		    hasChild: thisObj.hasChild
		  });
		
		var nameLeftPad = 10;
		if (thisObj.leftImage)
		{
			nameLeftPad = 40;
			row.leftImage = thisObj.leftImage;
		}
		
		var rowName = Titanium.UI.createLabel({
			text:thisObj.title,
			font:{fontSize:20,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',		
			left:nameLeftPad,
			height:22
		});
		if (!thisObj.subWindowURL)
			rowName.color = '#999999';
		row.add(rowName);
			
		var k = i;
		if (k > 10)
			k = k - 11;
		
		var statusView = Titanium.UI.createLabel({			
			backgroundColor: '#999999',
			borderRadius:6,	
			borderWidth:0,
			borderColor:'#999999',
			width:30,
			height: 22,
			textAlign:'center',
			right:6
		});
		
		var rowStatus = Titanium.UI.createLabel({
			text: k + 1,			
			color:'#ffffff',
			width:'auto',
			height: 'auto',
			font:{fontWeight:'bold'},
		});
		statusView.add(rowStatus);
		if (i > 4 && i !== 9)
			row.add(statusView);
			
		if (thisObj.header)
			row.header = thisObj.header;
			
		row.subWindow = thisObj.subWindow;
		row.subWindowURL = thisObj.subWindowURL;
		row.subWindowTitle = thisObj.title;
		
		tableData.push(row);
	}
	tvDashboard.setData(tableData);
}

loadDashboard();