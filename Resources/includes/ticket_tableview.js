function createTicketTableView(tickets, tickets_id)
{
	var rowData = []; 
	for (var i = 0; i < tickets.length; i++) {
			var number = tickets[i].number;
            var subject = tickets[i].subject;
            var user = tickets[i].user_name;
            var tech = tickets[i].tech_name;
            var account = tickets[i].account_name;
            var tclass = tickets[i].class_name;
            var priority = tickets[i].priority_level;
            var project = tickets[i].project;
            var status = tickets[i].status_name;
            var level = tickets[i].level;
            var ticket_time = tickets[i].created_time_str;
            
            var label_color = '#888888';
            var text_color = '#444444';
            
            var label_size = 12;
            var text_size = 16;
            
            var left_indent = 27;
            var top_indent = 4;
            var label_bottom_shift = 2;
                                    
            var row = Titanium.UI.createTableViewRow({ height: 'auto', hasChild: true });

            var post_view = Titanium.UI.createView({
                height: 'auto',
                layout: 'vertical',
                top: 6,
                bottom: 8,
                right: 6,
                left: 10       
            });
            
            // num+subject row
            var row1view = Titanium.UI.createView({
                height: 'auto',
                width: 'auto',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                layout: 'horizontal'
            });
            
            var tktdiez_lbl = Titanium.UI.createLabel({
                text: '#',                
                top: 3,
                left: 0,
                width: 'auto',                
                height: 'auto',
                font:{fontSize:17}
            });
            
            var tktnum_lbl = Titanium.UI.createLabel({
                text: number,                
                top: 0,
                left: 0,
                width: 'auto',                
                height: 'auto',
                font:{fontSize:22, fontWeight:'bold'}             
            });
            
            var subject_label_height = 18; // if auto than it's not trimmed
            var ticket_lbl = Titanium.UI.createLabel({
                text: subject,
                top: 5,
                left: 4,
                //width: 220, // depends on screen width, wonder how it looks on retina display
                height: subject_label_height+2,
                font:{fontSize:subject_label_height}
            });
            
            ticket_lbl.width = 285 - 4 - tktdiez_lbl.getWidth() - tktnum_lbl.getWidth();
            
            row1view.add(tktdiez_lbl);
            row1view.add(tktnum_lbl);
            row1view.add(ticket_lbl);
            
            post_view.add(row1view);
            
            // User + Account row - 256
            var tktuser_lbl = Titanium.UI.createLabel({
                text: user,                
                top: 0,
                left: 0,
                width: 'auto',                
                height: 'auto',
                color:text_color,
                font:{fontSize:text_size, fontWeight:'normal'}             
            });
            var user_width = tktuser_lbl.getWidth();
            
            var account_text = '';
            if (account == null)
            	account_text = 'No Account Assigned';
            else
            	account_text = account;
            var account_lbl = Titanium.UI.createLabel({
	        	text: account_text,                
	            top: 0,
	            right: 0,
	            width: 'auto',               
	            height: 'auto',
	            color:text_color,
	            font:{fontSize:text_size-2, fontWeight:'normal'}             
	        });	        
	        var account_width = account_lbl.getWidth();
	        Ti.API.info('user_width = ' + user_width + '  account_width = ' + account_width);
	        var useAlternativeLayout = ((user_width + account_width) > 245);
	        var accWidth = 256 - 10 - user_width;
            // ----
            var account_row = Titanium.UI.createView({            	
                height: 'auto',
                top: top_indent,                
                left: left_indent,
                right: 0
            });
            
            var user_view = Titanium.UI.createView({            	
                height: 'auto',
                width: 'auto',                
                top: 0,                
                left: 0,
                zIndex: 100,
                backgroundColor: 'white'
            });            
            
            var account_view = Titanium.UI.createView({            	
                height: 'auto',
                width: 'auto',
                top: 2,
                //right: 0,
                zIndex: 50
            });
            if (useAlternativeLayout)
            {
            	account_row.layout = 'horizontal';
            	account_lbl.top = 1;
            	account_lbl.width = accWidth;
            	account_lbl.height = text_size;
            	account_view.left = 10;
            }
           	else
           		account_view.right = 0;
           		
           	user_view.add(tktuser_lbl);
            account_view.add(account_lbl);
            
            account_row.add(user_view);
            account_row.add(account_view);
            
            post_view.add(account_row);
            // End of User + Account row
            
            // status + date row            
            var statusdate_row = Titanium.UI.createView({            	
                height: 'auto',
                top: top_indent,                
                left: left_indent,
                right: 0
            });
            
            var status_view = Titanium.UI.createView({
                height: 'auto',
                width: 'auto',                
                top: 0,                
                left: 0,
                zIndex: 100,
                backgroundColor: 'white'
            });
            
            var status_lbl = Titanium.UI.createLabel({
                text: status,                
                top: 0,
                left: 0,
                width: 'auto',                
                height: 'auto',
                color:'#3f6c19',
                font:{fontSize:text_size+1, fontWeight:'normal'}
            });      
            status_view.add(status_lbl);
            
            var time_view = Titanium.UI.createView({
                height: 'auto',
                width: 'auto',
                top: 0,
                right: 0,
                zIndex: 50
            });
            
            var time_lbl = Titanium.UI.createLabel({
                text: ticket_time,                
                top: 0,
                right: 0,
                width: 'auto',                
                height: 'auto',
                color:'#2d76d9',
                font:{fontSize:text_size+1, fontWeight:'normal'} 
            });
            time_view.add(time_lbl);
            
            statusdate_row.add(status_view);
            statusdate_row.add(time_view);
            
            post_view.add(statusdate_row);
            // End of status + date row
            
            // tech + priority row
            var tech_row = Titanium.UI.createView({            	
                height: 'auto',
                top: top_indent,                
                left: left_indent,
                right: 0
            });
            
            var tech_view = Titanium.UI.createView({            	
                height: 'auto',
                width: 'auto', // we can know width exactly
                //layout: 'horizontal',
                top: 1,                
                left: 0
            });            
            
            // not used for now
            /*var techheader_lbl = Titanium.UI.createLabel({
                text: 'Tech',
                top: label_bottom_shift,
                left: 3,
                width: 'auto',
                height: label_size,
                color:label_color,
				font:{fontSize:label_size, fontWeight:'normal' }
            });*/
           
            var tech_lbl = Titanium.UI.createLabel({
                text: tech,// + 'cxkxcmxl xdvsjdnzkjd kzsdvjkjdn vzjkndskjs dvnkjzsnkjv dndkjvn kjdsn',                
                top: 0,
                left: 0,
                width: 'auto',
                height: 'auto',
                color:text_color,
                font:{fontSize:text_size-2, fontWeight:'normal' }
            });
            tech_view.add(tech_lbl);
            //tech_view.add(techheader_lbl);
            tech_row.add(tech_view);
            
            var level_view = Titanium.UI.createView({            	
                height: 'auto',
                width: 55,
                top: 0,                
                right: 0
            });
                        
            var level_lbl = Titanium.UI.createLabel({
                text: level,                
                top: 0,
                right: 0,
                width: 'auto',                
                height: 'auto',
                color:text_color,
                font:{fontSize:text_size-1, fontWeight:'normal'}
            });
            
            var levelheader_lbl = Titanium.UI.createLabel({
                text: 'Level',
                top: label_bottom_shift,
                right: 14,
                width: 'auto',                
                height: 'auto',
                color:label_color,
                font:{fontSize:label_size, fontWeight:'normal'}
            });         
            level_view.add(level_lbl);
            level_view.add(levelheader_lbl);
            tech_row.add(level_view);
            
            post_view.add(tech_row);
            // End of tech + priority row
            
            // class row
            var class_row = Titanium.UI.createView({            	
                height: 'auto',
                top: top_indent,                
                left: left_indent,
                right: 0
            });
            
            var class_view = Titanium.UI.createView({            	
                height: 'auto',
                width: 'auto',
                //layout: 'horizontal',
                top: 1,
                left: 0
            });            
            
            /*var classheader_lbl = Titanium.UI.createLabel({
                text: 'Class',
                top: 0,
                left: 3,
                width: 'auto',
                height: label_size,
                color:label_color,
				font:{fontSize:label_size, fontWeight:'normal'}
            });*/
           
            var class_lbl = Titanium.UI.createLabel({
                text: tclass,                
                top: 0,
                left: 0,
                width: 'auto',
                height: 'auto',
                color:text_color,
                font:{fontSize:text_size-2, fontWeight:'normal'}
            });
            class_view.add(class_lbl);
            //class_view.add(classheader_lbl);
            class_row.add(class_view);
            
            var priority_view = Titanium.UI.createView({            	
                height: 'auto',
                width: 55,
                top: 0,                
                right: 0
            });
                        
            var priority_lbl = Titanium.UI.createLabel({
                text: priority,                
                top: 0,
                right: 0,
                width: 'auto',                
                height: 'auto',
                color:text_color,
                font:{fontSize:text_size-1, fontWeight:'normal'}
            });
            
            var priorityheader_lbl = Titanium.UI.createLabel({
                text: 'Priority',
                top: label_bottom_shift,
                right: 14,
                width: 'auto',                
                height: 'auto',
                color:label_color,
                font:{fontSize:label_size, fontWeight:'normal'}       
            });
            
            priority_view.add(priority_lbl);
            priority_view.add(priorityheader_lbl);
            class_row.add(priority_view);
            post_view.add(class_row);
            // End of class row
            
            var imvAttach = Titanium.UI.createImageView({
				image: '../images/paperclip.png',
				width:16,
				height:16,
				top:40,
				left:10
			});
			
			var imvReply = Titanium.UI.createImageView({
				image: '../images/reply.png',
				width:15,
				height:19,
				top:60,
				left:10
			});
			
			row.add(post_view);
			row.add(imvAttach);
			row.add(imvReply);
            //row.className = "itemTicket";
			row.tid = tickets[i].key;
			tickets_id[i] = tickets[i].key;
			row.number = number;
            rowData[i] = row;
        }
    
     return rowData;
}

function createLoadMoreLabelRow()
{
	var row = Titanium.UI.createTableViewRow({ height: 'auto', hasChild: false });
     
	var lblLoadMore = Titanium.UI.createLabel({
		text: 'Load More Tickets...',
		left:0,
		right:0,
		height:16,
		width: 'auto',
		top: 17,
		bottom: 20,
		color: '#63648B',
		font:{ fontSize:16, fontWeight:'bold' }   
	});
	row.add(lblLoadMore);
	row.className = "loadMore";
	row.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY;
	row.loadMore = true;
	
	return row;
}

function createLoadingMoreRow()
{
    var rowLoading = Titanium.UI.createTableViewRow({ height: 'auto', hasChild: false });
    	
    actInd = Titanium.UI.createActivityIndicator({ style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK, width: 20, height: 20	});	
	
	message = Titanium.UI.createLabel({
		text:'Loading...',
		color:'#111111',
		width:'auto',
		height:'auto',
		left: 8,
		font:{fontSize:16,fontWeight:'normal'}
	});
		
	var loading_view = Titanium.UI.createView({            	
       	height: 16,
        width: 'auto',
		top: 17,
		bottom: 20,
        left: 0,                
        right: 0,
        layout: 'horizontal'
   	});
		
	loading_view.add(actInd);
	loading_view.add(message);
	rowLoading.add(loading_view);
		
	actInd.show();
		
    rowLoading.className = "loadingMoreTickets";
    rowLoading.touchEnabled = false;
    rowLoading.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	return rowLoading;
}

function createHTMLTicketView()
{
	return '<html><body><table cellpadding=4 cellspacing=0><tbody><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Ticket #</td><td style="border-bottom:solid 1px #555555;text-align:left"><b><a href="http://login.bigwebapps.com/?TicketId=4410191&amp;login=yuriy.mykytyuk@micajah.com&amp;DeptId=7&amp;DeptName=bigWebApps+Support" target="_blank">11620</a> </b></td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Subject</td><td style="border-bottom:solid 1px #555555;text-align:left">Mobile UI Adjustmetns </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Department</td><td style="border-bottom:solid 1px #555555;text-align:left">bigWebApps Support </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Account/Location</td><td style="border-bottom:solid 1px #555555;text-align:left">bigWebApps Support (Internal) / Atlanta </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Technician</td><td style="border-bottom:solid 1px #555555;text-align:left">Yuriy Mykytyuk </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">User</td><td style="border-bottom:solid 1px #555555;text-align:left">Jon Vickers<br><a href="mailto:jon.vickers@micajah.com">jon.vickers@micajah.com</a></td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Level</td><td style="border-bottom:solid 1px #555555;text-align:left">3 - Active Plate </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Priority</td><td style="border-bottom:solid 1px #555555;text-align:left">4 - Upgrade/New Feature </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Expect Response By</td><td style="border-bottom:solid 1px #555555;text-align:left">5/5/2011 17:34 </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Class</td><td style="border-bottom:solid 1px #555555;text-align:left">HelpDesk </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Project</td><td style="border-bottom:solid 1px #555555;text-align:left">HelpDesk </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Logged Time</td><td style="border-bottom:solid 1px #555555;text-align:left">0 hours </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Remaining Time</td><td style="border-bottom:solid 1px #555555;text-align:left">0 hours </td></tr><tr><td style="background-color:#aaaaaa;text-align:right;font-size:10pt;color:White;border-bottom:solid 1px #555555">Total Time</td><td style="border-bottom:solid 1px #555555;text-align:left">No budget </td></tr></tbody></table>' +
	  	   '<br><table border=0 cellpadding=3 cellspacing=0><tbody><tr bgcolor="#3d3d8d"><td colspan=2 align=center><font color="#ffffff" size=2><b>Initial Post</b></font></td></tr><tr bgcolor="#cccccc"><td>Vickers, Jon</td><td align=right>5/5/2011 15:34</td></tr><tr><td colspan=2>https://bigwebapps.basecamphq.com/projects /6951513/posts/45369530/comments<br><br>Hey Yuriy, here is official ticket to make worklist UI adjustments.  Pat and I are giving conflicting opinions.  Take these suggestions and do what you think is best solution.<br><br>We can refine the UI additional later as one main project to clean all screens once we get the data working properly.<br><br>Following files were  uploaded: Ticket list style adjust.png, Ticket list style adjust2.png.</td></tr></tbody></table></html></body>';
}
function createTicketView(ticket)
{
    var number = ticket.ticket;
    var subject = ticket.subject;
    var user = ticket.user_name;
    var tech = ticket.tech_name;
    var account = ticket.account_name;
    var tclass = ticket.class_name;
    var priority = ticket.priority_level;
    var project = ticket.project;
    var status = ticket.status_name;
    var level = ticket.ticket_level;
    var ticket_time = ticket.created_time_str;
    
    var data = [];
    
	// subject
    var rowSubject = Ti.UI.createTableViewRow({
		title:subject	
		//header:'Subject'	
	});
	data[0] = rowSubject;	

	// User row
	var rowUser = Ti.UI.createTableViewRow({
		title:user		
		//header:'User'	
	});
	data[1] = rowUser;
	
	// Tech row
	var rowTech = Ti.UI.createTableViewRow({
		title:tech	
	});
	data[2] = rowTech;
	
	// Account row
	var rowAccount = Ti.UI.createTableViewRow({
		title:account,
		header:'Account'	
	});
	data[3] = rowAccount;
	
	// Class row
	var rowClass = Ti.UI.createTableViewRow({
		title:tclass,
		header:'Class'	
	});
	data[4] = rowClass;
	
	// Status row
	var rowStatus = Ti.UI.createTableViewRow({
		title:status,
		header:'Status'	
	});
	data[5] = rowStatus;
	
	// Priority row
	var rowPriority = Ti.UI.createTableViewRow({
		title:priority,
		header:'Priority'	
	});
	data[6] = rowPriority;
	
	// Project row
	var rowProject = Ti.UI.createTableViewRow({
		title:project,
		header:'Project'	
	});
	data[7] = rowProject;
	
	// Level row
	var rowLevel = Ti.UI.createTableViewRow({
		title:level,
		header:'Level'	
	});
	data[8] = rowLevel;
	
	return data;
}

