Ti.include('../includes/network_webservice_client.js');
Ti.include('../includes/ticket_tableview.js');
Ti.include('../controls/control_table_pulldown.js');
var win = Titanium.UI.currentWindow;

//
// TICKETS GLOBAL VARIABLES SECTION
//
var PageNum = 1;
var PageCount = 10;
var AllTicketCount = 10;
var tickets_id = [];

//
// TICKETS MAIN WINDOW INITIALIZATION
//
var tvTickets = Titanium.UI.createTableView({ id: 'tvTickets' });

// Init pull down section
mbl_addTablePullDownHeader(tvTickets, function () { tvTickets.setData([]); }, loadTickets);

function openExistingTicket(tid, completeMessage) {
    var win = Titanium.UI.createWindow({
		url: "ticket_view.js",
		title: 'Details',
		tid: tid,
		tickets: tickets_id,
		showCompleteMessage: completeMessage,
	    _parent: Titanium.UI.currentWindow,
	    navGroup : Titanium.UI.currentWindow.navGroup,
	    rootWindow : Titanium.UI.currentWindow.rootWindow
	});
	Titanium.UI.currentWindow.navGroup.open(win);
}
tvTickets.addEventListener('click', function(e)
{
	if (e.rowData.tid)
		openExistingTicket(e.rowData.tid, null);
	else if (e.rowData.loadMore)
		setTimeout( function () {loadTickets(true); }, 300);
});

win.add(tvTickets);

//
// TOOLBAR INITIALIZATION
//
function addNewTicket() {
    var win = Titanium.UI.createWindow({
		url: "ticket_createquick.js",
		title: "Add Ticket",
		backButtonTitle: "Back",
		_parent: Titanium.UI.currentWindow,
		navGroup : Titanium.UI.currentWindow.navGroup,
		rootWindow : Titanium.UI.currentWindow.rootWindow		
	});
	Titanium.UI.currentWindow.navGroup.open(win, {animate:true});
}

var flexSpace = Titanium.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE });
  
var refresh = Titanium.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.REFRESH });
refresh.addEventListener('click', function()
{
	tvTickets.setData([]);//tvTickets.data = [];
    loadTickets();
});

var previous = Titanium.UI.createButton({ systemButton:107/*Titanium.UI.iPhone.SystemButton.REWIND*/ });
previous.addEventListener('click', function () {
    tvTickets.setData([]);
    PageNum--;
    loadTickets();
});

var next = Titanium.UI.createButton({ systemButton:108/*Titanium.UI.iPhone.SystemButton.FAST_FORWARD*/ });
next.addEventListener('click', function () {
    tvTickets.setData([]);
    PageNum++;
    loadTickets();
});

var add = Titanium.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.COMPOSE });
add.addEventListener('click', addNewTicket);

var lblUpdate = Titanium.UI.createLabel({	
	text: 'Page ' + PageNum,
	color: '#ffffff',
	font: {fontSize: 14, fontWeight:'bold'}
});

var infLoadTickets = Titanium.UI.createProgressBar({
	width:80,
	min:0,
	max:10,
	value:0,
	color:'#fff',
	//message:'Downloading 0 of 10',
	font:{fontSize:14, fontWeight:'bold'},
	style:Titanium.UI.iPhone.ProgressBarStyle.BAR
});

function updateTicketsToolbar(showProgressBar)
{
	infLoadTickets.value = 0;
	if (showProgressBar) //win.toolbar
	{		
		infLoadTickets.show();
		win.setToolbar([refresh,flexSpace,previous,flexSpace,infLoadTickets,flexSpace,next,flexSpace,add], {animated:true});
	}
	else
	{		
		win.setToolbar([refresh,flexSpace,previous,flexSpace,lblUpdate,flexSpace,next,flexSpace,add], {animated:true});
		infLoadTickets.hide();
	}
}
//updateTicketsToolbar(false);

//
// NAVBAR INITIALIZATION
//
var bNavAdd = Titanium.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.COMPOSE/*ADD*/ });
bNavAdd.addEventListener('click', addNewTicket);
win.setRightNavButton(bNavAdd);
win.backButtonTitle = 'Home';

//
// CALLBACK EVENTS
//
win.addEventListener('event_ticket_created',function(e)
{	
	Ti.API.info('List: TktCreated Event Handler. Id = ' + e.createdId);
	tickets_id = [e.createdId];
	Ti.API.info('List: TktCreated Event Handler. tickets_id = ' + tickets_id);
	openExistingTicket(e.createdId, 'Ticket Successfully Created');
});

win.addEventListener('event_refresh_ticket_list',function(e)
{
	loadTickets();
});

//
// DEFINE MAIN FUNCTION
//
function loadTickets()
{
	loadTickets(false);
}

function loadTickets(IsLoadMoreMode) {
	function fillTicketsTableView(data)
    {
    	Ti.API.info(data);
    	var info = eval('(' + data + ')');
        var tickets = info.Tickets;
        //var ticketsNumber = info.TicketsNumber;
        if (IsLoadMoreMode)
        {
        	var newtickets_id = [];
        	var rowData = createTicketTableView(tickets, newtickets_id);
        	for (var i = 0; i < rowData.length; i++)
        	{
        		tickets_id[AllTicketCount - PageCount + i] = newtickets_id[i];
        		tvTickets.insertRowAfter(AllTicketCount - PageCount - 1 + i, rowData[i], { animate: true });
        	}
        	tvTickets.updateRow(AllTicketCount, createLoadMoreLabelRow(), {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.TOP});
        }
        else
        {
        	var rowData = createTicketTableView(tickets, tickets_id);
        	rowData[tickets.length] = createLoadMoreLabelRow();
        	tvTickets.setData(rowData);    
        	Ti.App.fireEvent('hide_global_indicator');
        	tvTickets.show();
        }
    }
    
    var strRequest = "Tickets.svc?Status=1";
    
    if (IsLoadMoreMode)
    {
    	strRequest += "&pg=" + (PageNum + 1) + "&ps=" + PageCount;
    	tvTickets.updateRow(AllTicketCount, createLoadingMoreRow(), {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.TOP});
    }
    else
    {
    	tvTickets.hide();
    	Ti.App.fireEvent('show_global_indicator',{message: 'Loading...'});
    	strRequest += "&pg=1&ps=" + AllTicketCount;
    }
    
    var respText = '{"PageNumber":1,"PageSize":10,"Tickets":[{"account_id":"15","account_location_id":"218233","account_location_name":"District Office","account_name":"Fillmore Unified Schools","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"Jim Mora","created_time_str":"06/27 18:19","created_userid":"10461","creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"113","folder_name":"Helpdesk / Emails/Notifications - Event-based","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":false,"is_new_user_message":false,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"91431","level":1,"level_name":"         1 - Client Fulfillment Rep","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":373,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":"","status":1,"status_name":"Open","subject":"Auto email alert when ticket reaches certain age","submission_category_id":null,"submission_category_name":null,"tech_email":"apeterson@xpres.net","tech_first_name":"Al","tech_last_name":"Peterson","tech_name":"Al Peterson","tech_userid":"25037","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"jmora@fillmore.k12.ca.us","user_first_name":"Jim","user_last_name":"Mora","user_name":"Jim Mora","user_userid":"10461","workpad":null},{"account_id":"47","account_location_id":"218250","account_location_name":"District Office","account_name":"Gilmer County Schools","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"John Painter","created_time_str":"09/12 07:51","created_userid":"43","creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"112","folder_name":"Helpdesk / Appearance/Navigation","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":true,"is_new_user_message":false,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"140976","level":1,"level_name":"         1 - Client Fulfillment Rep","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":511,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":"","status":1,"status_name":"Open","subject":"Location-specific messages on tickets","submission_category_id":null,"submission_category_name":null,"tech_email":"jason.moore@bigwebapps.com","tech_first_name":"Jason","tech_last_name":"Moore","tech_name":"Jason Moore","tech_userid":"27","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"jpainter@gilmerschools.com","user_first_name":"John","user_last_name":"Painter","user_name":"John Painter","user_userid":"43","workpad":null},'
    	+ '{"account_id":"15","account_location_id":"218233","account_location_name":"District Office","account_name":"Fillmore Unified Schools","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"Joshua Sanders","created_time_str":"09/16 14:11","created_userid":"2334","creation_category_id":"6","creation_category_name":"Upgrade | Mod","estimated_hours":null,"folder_id":"270","folder_name":"Helpdesk / Sub-tickets","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":false,"is_new_user_message":false,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"152420","level":1,"level_name":"         1 - Client Fulfillment Rep","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":524,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":"","status":1,"status_name":"Open","subject":"ability to communicate with multiple people off of ticket","submission_category_id":null,"submission_category_name":null,"tech_email":"jason.moore@bigwebapps.com","tech_first_name":"Jason","tech_last_name":"Moore","tech_name":"Jason Moore","tech_userid":"27","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"jsanders@fillmore.k12.ca.us","user_first_name":"Joshua","user_last_name":"Sanders","user_name":"Joshua Sanders","user_userid":"2334","workpad":null},{"account_id":"30","account_location_id":"218244","account_location_name":"District Office","account_name":"Chapel Hill-Carrboro City Schools","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"Lara Farrar","created_time_str":"11/12 22:19","created_userid":"77","creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"722","folder_name":"Helpdesk / Multiple Ticket Creation/Closure","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":true,"is_new_user_message":false,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"203805","level":1,"level_name":"         1 - Client Fulfillment Rep","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":648,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":"","status":1,"status_name":"Open","subject":"Ticket closure suggestions... ","submission_category_id":null,"submission_category_name":null,"tech_email":"jason.moore@bigwebapps.com","tech_first_name":"Jason","tech_last_name":"Moore","tech_name":"Jason Moore","tech_userid":"27","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"lfarrar@chccs.k12.nc.us","user_first_name":"Lara","user_last_name":"Farrar","user_name":"Lara Farrar","user_userid":"77","workpad":null},' 
    	+ '{"account_id":"704","account_location_id":null,"account_location_name":null,"account_name":"Micajah ITS","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"Jon Vickers","created_time_str":"11/21 12:27","created_userid":"26","creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"324","folder_name":"Helpdesk / Checklists","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":false,"is_new_user_message":true,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"209633","level":3,"level_name":"         3 - Pre-Development","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":694,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":null,"status":1,"status_name":"Open","subject":"New Feature Checklists","submission_category_id":null,"submission_category_name":null,"tech_email":"summeyt@surry.k12.nc.us","tech_first_name":"Ted","tech_last_name":"Summey","tech_name":"Ted Summey","tech_userid":"44593","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"jon.vickers@micajah.com","user_first_name":"Jon","user_last_name":"Vickers","user_name":"Jon Vickers","user_userid":"26","workpad":null},{"account_id":"20","account_location_id":null,"account_location_name":null,"account_name":"bigWebApps","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"","created_time_str":"02/05 16:19","created_userid":null,"creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"727","folder_name":"Helpdesk / Time and Dates","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":true,"is_new_user_message":true,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"246645","level":3,"level_name":"         3 - Pre-Development","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":1176,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":null,"status":1,"status_name":"Open","subject":"Time Zones that do not adhere to Daylight savings","submission_category_id":null,"submission_category_name":null,"tech_email":"Aug  9 2006 10:09AMPre-Development","tech_first_name":"Pre-Development","tech_last_name":"Queue","tech_name":"Pre-Development Queue","tech_userid":"84683","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"patrick.clements@bigwebapps.com","user_first_name":"Patrick","user_last_name":"Clements","user_name":"Patrick Clements","user_userid":"38006","workpad":null},'
    	+ '{"account_id":"92","account_location_id":"218278","account_location_name":"District Office","account_name":"Farmington Public Schools ","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"Nathan Simon","created_time_str":"02/11 12:27","created_userid":"26115","creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"69","folder_name":"Helpdesk / Knowledgebase","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":true,"is_new_user_message":false,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"249949","level":1,"level_name":"         1 - Client Fulfillment Rep","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":1205,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":null,"status":1,"status_name":"Open","subject":"Q/A Kb changes","submission_category_id":null,"submission_category_name":null,"tech_email":"jason.moore@bigwebapps.com","tech_first_name":"Jason","tech_last_name":"Moore","tech_name":"Jason Moore","tech_userid":"27","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"nsimon@farmington.k12.mn.us","user_first_name":"Nathan","user_last_name":"Simon","user_name":"Nathan Simon","user_userid":"26115","workpad":null},{"account_id":"20","account_location_id":null,"account_location_name":null,"account_name":"bigWebApps","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"","created_time_str":"08/06 10:35","created_userid":null,"creation_category_id":"6","creation_category_name":"Upgrade | Mod","estimated_hours":null,"folder_id":"323","folder_name":"Helpdesk / Alt Techs/Users","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_conf/med":null,"is_new_tech_message":false,"is_new_user_message":true,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"334202","level":3,"level_name":"         3 - Pre-Development","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":1483,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":"","request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":null,"status":1,"status_name":"Open","subject":"CC: a tech on a ticket creation (Alt. Tech)","submission_category_id":null,"submission_category_name":null,"tech_email":"Aug  9 2006 10:09AMPre-Development","tech_first_name":"Pre-Development","tech_last_name":"Queue","tech_name":"Pre-Development Queue","tech_userid":"84683","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"patrick.clements@bigwebapps.com","user_first_name":"Patrick","user_last_name":"Clements","user_name":"Patrick Clements","user_userid":"38006","workpad":null},'
    	+ '{"account_id":"15","account_location_id":"218233","account_location_name":"District Office","account_name":"Fillmore Unified Schools","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"Jim Mora","created_time_str":"08/27 16:26","created_userid":"10461","creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"323","folder_name":"Helpdesk / Alt Techs/Users","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":true,"is_new_user_message":false,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"360471","level":1,"level_name":"         1 - Client Fulfillment Rep","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":1566,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":null,"request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":null,"status":1,"status_name":"Open","subject":"Alternate technician communication","submission_category_id":null,"submission_category_name":null,"tech_email":"jason.moore@bigwebapps.com","tech_first_name":"Jason","tech_last_name":"Moore","tech_name":"Jason Moore","tech_userid":"27","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"jmora@fillmore.k12.ca.us","user_first_name":"Jim","user_last_name":"Mora","user_name":"Jim Mora","user_userid":"10461","workpad":null},{"account_id":"20","account_location_id":null,"account_location_name":null,"account_name":"bigWebApps","amount_labor":0.0000,"amount_misc":0.0000,"amount_parts":0.0000,"amount_travel":0.0000,"asset_id":null,"asset_identifier":null,"class_id":"29","class_name":"HelpDesk","closed_name":"","closed_note":null,"closed_time":null,"closed_userid":null,"confirmed_name":"","confirmed_note":null,"confirmed_time":null,"confirmed_userid":null,"created_name":"","created_time_str":"09/05 10:47","created_userid":null,"creation_category_id":null,"creation_category_name":null,"estimated_hours":null,"folder_id":"798","folder_name":"Helpdesk / Designing the Obvious","follow_up_note":null,"follow_up_time":null,"id_method":null,"is_confirmed":null,"is_new_tech_message":false,"is_new_user_message":true,"is_preventive":false,"is_resolved":null,"is_via_email_parser":false,"key":"370943","level":3,"level_name":"         3 - Pre-Development","location_id":null,"location_name":null,"next_step":null,"next_step_time":null,"note":null,"number":1585,"priority_id":"1550","priority_level":5,"priority_name":"         5 - Feature Upgrade","project_id":null,"project_name":null,"remaining_hours":null,"request_completion_note":"","request_completion_time":null,"resolution_category_id":null,"resolution_category_name":null,"room":null,"status":1,"status_name":"Open","subject":"Routing Management upgrade","submission_category_id":null,"submission_category_name":null,"tech_email":"Aug  9 2006 10:09AMPre-Development","tech_first_name":"Pre-Development","tech_last_name":"Queue","tech_name":"Pre-Development Queue","tech_userid":"84683","total_hours":null,"updated_name":null,"updated_userid":null,"user_email":"patrick.clements@bigwebapps.com","user_first_name":"Patrick","user_last_name":"Clements","user_name":"Patrick Clements","user_userid":"38006","workpad":null}],"TicketsNumber":437}';

    if (IsLoadMoreMode)
	{
	   	PageNum++;
	   	AllTicketCount += PageCount;
	}
    fillTicketsTableView(respText);
}

loadTickets();