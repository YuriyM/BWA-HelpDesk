Ti.include('../includes/network_webservice_client.js');
Ti.include('../includes/dashboard_data.js');
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
var navSignOut = Ti.UI.createButton({title:'Config'});
/*var navSignOut = Ti.UI.createButton({
		backgroundImage:'../images/config.png',
		height:35,
		width: 35
	});*/
//var navSignOut = [	{image:'../images/config.png', width:45, height:30 } ];
//var nav_bar = Titanium.UI.createButtonBar({ style:Titanium.UI.iPhone.SystemButtonStyle.BAR, labels: navSignOut });
navSignOut.addEventListener('click', function(e)
{   
    win.navGroup.close(win);
});
win.setRightNavButton(navSignOut);
win.leftNavButton = Ti.UI.createView({ width: 10 });

function loadDashboard()
{	
	function fillTicketsTableView(data)
    {
    	Ti.API.info(data);    	
    	var info = eval('(' + data + ')');
        var unassigned_queues = info.unassigned_queues;        
        var tableData = [];
        
        
        // Account Row
        tableData.push(createDashboardRow(false, null, 'Accounts', 'Accounts', null, 0, null));
		
		// Locations Row
		tableData.push(createDashboardRow(false, null, 'Locations', 'Locations', null, 0, null));
		
		// Tickets Row
		tableData.push(createDashboardRow(true, null, 'Tickets', 'Tickets', '../tickets/ticket_list.js', 0, null));
		
		// Test Tickets Row
		tableData.push(createDashboardRow(true, null, 'Local Tickets', 'Local Tickets', '../tickets/ticket_test_list.js', 0, null)); 
		
		// Projects Row
        tableData.push(createDashboardRow(false, null, 'Projects', 'Projects', null, 0, null));
		
		//
		// Ticket Summary
		//		
		// New Messages
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'New Messages', 'New Messages', null, info.new_messages_count, 'Ticket Summary'));
		
		// Open Tickets 
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'Open Tickets', 'Open Tickets', null, info.open_count, null));
		
		// Open as End User 
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'Open as End User', 'Open as End User', null, info.as_user_count, null));
		
		// On Hold 
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'On Hold', 'On Hold', null, info.on_hold_count, null));
		
		// Waiting On Parts 
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'Waiting On Parts', 'Waiting On Parts', null, info.on_parts_count, null));
		
		// Follow-Up Dates 
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'Follow-Up Dates', 'Follow-Up Dates', null, info.follow_up_count, null));
		
		// Unconfirmed 
		tableData.push(createDashboardRow(false, '../images/single_bucket.png', 'Unconfirmed', 'Unconfirmed', null, info.unconfirmed_user_tkts_count, null));
		
		//
		// Queues
		//
		for (var i = 0; i < unassigned_queues.length; i++)
		{
			var header = null;
			if (i === 0)
				header = 'Queues';
			tableData.push(createDashboardRow(false, '../images/single_bucket.png', unassigned_queues[i].queue, unassigned_queues[i].queue, null, unassigned_queues[i].count, header));		
		}
		//-----------------
        
        tvDashboard.setData(tableData);
        Ti.App.fireEvent('hide_global_indicator');
        tvDashboard.show();
    }
    
    tvDashboard.hide();
    Ti.App.fireEvent('show_global_indicator',{message: 'Loading...'});
    mbl_dataExchange("GET", 'Tickets.svc/summary/',
    	function () {
    		//Ti.App.fireEvent('hide_global_indicator');
    		Ti.API.info('Dashboard HTTP Status = ' + this.status);
    		Ti.API.info('Dashboard HTTP Response = ' + this.responseText);
    		if (this.status === 200)
        		fillTicketsTableView(this.responseText);
			else
				alert('Get Dashboard failed. Error code: ' + this.status);},
    	function (e) {  },
    	function (e) {
    		//fillTicketsTableView();
    		Ti.App.fireEvent('hide_global_indicator');
    		alert('Dashboard Connect Error. Details: ' + JSON.stringify(e));
    	});
}

loadDashboard();