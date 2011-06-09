function createDashboardRow(active, image, title, subWTitle, subWURL, statusCount, sectionHeader)
{
	var row = Ti.UI.createTableViewRow({ hasChild: true, subWindowTitle: subWTitle });
	
	var leftNamePadding = 10;
	if (image)
	{
		row.leftImage = image;
		leftNamePadding = 40
	}
	
	if (sectionHeader)
		row.header = sectionHeader;
		
	if (subWURL)
		row.subWindowURL = subWURL;
	
	var rowName = Titanium.UI.createLabel({
		text:title,
		font:{fontSize:20,fontWeight:'bold'},
		width: 215,
		textAlign:'left',		
		left:leftNamePadding,
		height:22
	});
	if (!active)
		rowName.color = '#999999';
	row.add(rowName);	
	
	if (statusCount > 0)
	{
		var statusView = Titanium.UI.createView({			
			backgroundColor: '#999999',
			borderRadius:6,	
			borderWidth:0,
			borderColor:'#999999',
			width:30,
			height: 22,
			textAlign:'center',
			right:6
		});		
		var lblStatus = Titanium.UI.createLabel({
			text: statusCount,			
			color:'#ffffff',
			width:'auto',
			height: 'auto',
			font:{fontWeight:'bold'},
		});
		statusView.add(lblStatus);
		row.add(statusView);
	}
	return row;
}
