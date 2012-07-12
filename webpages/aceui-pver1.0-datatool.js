/**
 * File : AgmipUI-pver1.0-datatool.js
 * created by/at : Yunchul Jung, Jun,2012
 */
/**
 * Function name rule
 * - top level func at js file : ex) fixContentHeight()
 * - sub level func at js file : ex) _initLayerList()
 * - func binding DOM element id : ex) search_contents()
 */
 
/**
 * data in data tool which comes from searched result
 */
// dataset of data cart
var	datacartFeaturesObj;
function _getNewDatacartFeaturesObj(){
	var	newdatacartFeaturesObj = {
		"type": "FeatureCollection",
		"features": []	
	};
	return newdatacartFeaturesObj;
}
// init data cart
function resetDatacart(){
	datacartFeaturesObj = _getNewDatacartFeaturesObj();
}
// not used
function addToDatacart(feature){
	datacartFeaturesObj.features.push(feature);
}
// add items from seached feature list to data cart
function _addDataToDatacartObject(datakeyarray){
	var itemcount = 0;	
	var item;
	var sitem;
	var isExist = false;
	var srcData;
	for(var i=0;i<datakeyarray.length;i++){
		item = datakeyarray[i];
		//duplication check in target
		for(var j=0;j<datacartFeaturesObj.features.length;j++){
			sitem = datacartFeaturesObj.features[j].properties.datakey;
			if(item == sitem) {
				isExist = true;
				break;
			}
		}
		//add data
		if(!isExist){
			srcData = _getFeaturesFromSelectedObj(item);
			if(srcData != NaN){
				datacartFeaturesObj.features.push(srcData);
				itemcount++;
			}
		}
	}
	return itemcount;
} 
// remove items from data cart
function _removeDataFromDatacartObject(datakey){
	var sitem;
	for(var j=0;j<datacartFeaturesObj.features.length;j++){
		sitem = datacartFeaturesObj.features[j].properties.datakey;
		if(datakey == sitem) {
			datacartFeaturesObj.features.splice(j,1);
			break;
		}
	}
}

/**
 * display
 */
// display
function displayDatacartItems(data){

	if(data.features.length == 0){
		$('<li>')
			.hide()
			.append($('<h2 />', {
				text: 'Your queue holds 0 data.'
			}))
			.appendTo('#datacart_items')
			.show();
	}else{
		//left header
		$('<li>')
			.hide()
			.append($('<h3 />', {
				text: '#',
				style:'height:25px'
			}))
			.appendTo('#datacart_items_chkbox')
			.show();
		//right header	
		$('<li>')
			.hide()
			.append($('<h2 />', {
				text: 'Your queue holds below data.' //+data.features.length+' data.'
			}))
			.appendTo('#datacart_items')
			.show();
			
		// for each row of item	
		$.each(data.features, function(i) {			
			var place = this;

			var lonlatsrc = new OpenLayers.LonLat(place.geometry.coordinates[0],
					place.geometry.coordinates[1]);
			var lonlattrans = lonlatsrc.transform(toProjection,fromProjection);//(place.lng, place.lat);

			var itemdatakey = place.properties.datakey;
			var dcleftLidId = _getDatacartLeftLidID(itemdatakey);//ex) itemDatakey+'_li_dcart'
			var dcchkboxId = _getDatacartLeftLidChkboxID(itemdatakey);//ex) itemDatakey+'_li_dcart_chkbox'
			var dcrightLidId = _getDatacartRightLidID(itemdatakey);//ex) itemDatakey+'_li_dcart_content'
	
			//left checkboxs
			$('<li>')
				.hide()
				.attr('id', dcleftLidId)
				.append($('<input />', {
					type: 'checkbox',
					id: dcchkboxId,
					style:'height:110px'
				}))
				.appendTo('#datacart_items_chkbox')
				.show();
			//right items	
			$('<li>')
				.hide()
				.attr('id', dcrightLidId)
				.append($('<h2 />', {
					text: '['+(i+1)+'] '+place.properties.datakey
				}))
				.append($('<p />', {
					html: '<b>' + '- Country :' + '</b> ' + place.properties.Country
				}))
				.append($('<p />', {
					html: '<b>' + '- City :' + '</b> ' + place.properties.City
				}))
				.append($('<p />', {
					html: '<b>' + '- Lon / Lat :' + '</b> ' + new Number(lonlattrans.lon).toFixed(2)
							+'&nbsp;&nbsp;/&nbsp;&nbsp;'+ new Number(lonlattrans.lat).toFixed(2)									
				}))
				.append($('<p />', {
					html: '<b>' + '- Crop :' + '</b> ' + place.properties.Crop
				}))	
				.append($('<p />', {
					html: '<b>' + '- Planting/Harvesting Year :' + '</b> ' + place.properties.PlantingYear +' / '+ place.properties.HarvestYear
				}))						
				.appendTo('#datacart_items')
				.click(function() {
					displayDataContent(itemdatakey);
				/*
					$.mobile.changePage('#mappage');
					var lonlatsrc1 = new OpenLayers.LonLat(lonlattrans.lon,lonlattrans.lat);
					map.setCenter(lonlatsrc1.transform(fromProjection,toProjection), 10);
					*/
				})
				.show();
		});
	}
	
	$('#datacart_items_chkbox').listview('refresh');
	$('#datacart_items').listview('refresh');
	$.mobile.pageLoading(true);
} 
// top row of data cart
function displayDataCartTopRow(){
	$('<li>')
		.hide()
		.append($('<h4 />', {
			text: 'Your queue holds 0 data.'
		}))
		.appendTo('#datacart_items')
		.show();		
}  
// clear contents in forms
function clearQueueList(){
	$('#datacart_items_chkbox').empty();
	$('#datacart_items').empty();
	$('#datacart_contentview').empty();
}
// show data detail when item is clicked
function displayDataContent(datakey){
	$('#datacart_contentview').empty();
	$('<li>')
		.hide()
		.attr('style','height:380px;')
		.append($('<h4 />', {
			text: '  - Data description : ['+datakey+']'
		}))
		.appendTo('#datacart_contentview')
		.show();		
}  
// update data cart list by add queue func at search page
function updateDatacartList(){
	clearQueueList();
	displayDatacartItems(datacartFeaturesObj);
}
// update map
function updateDataCartItem(){
	_updateDataCartPlot(datacartFeaturesObj);
}
/**
 * data item control functions
 */
function select_all_items_in_queue(){
	$('#datacart_items_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				$(this).attr('checked', true);
		}	
	});
}
function reset_queue_item_selection(){
	$('#datacart_items_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				$(this).attr('checked', false);
		}	
	});
}
function remove_selected_items(){
	$('#datacart_items_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				if($(this).is(':checked')){	
					var chkboxId = $(this).attr('id');//ex) itemDatakey+'_li_dcart_chkbox'
					var datakey = _getDatakeyFromDatacartChkboxID(chkboxId);
					var leftLidId = _getDatacartLeftLidID(datakey);	
					var rightLidId = _getDatacartRightLidID(datakey);
					//remove row
					$('#'+leftLidId).remove();//remove li of checkbox
					$('#'+rightLidId).remove();//remove li of item		
					//remove data
					_removeDataFromDatacartObject(datakey);
				}
		}	
	});	
	$('#datacart_contentview').empty();
}
function remove_all_items(){
	$('#datacart_items_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				{	
					var chkboxId = $(this).attr('id');//ex) itemDatakey+'_li_dcart_chkbox'
					var datakey = _getDatakeyFromDatacartChkboxID(chkboxId);
					var leftLidId = _getDatacartLeftLidID(datakey);	
					var rightLidId = _getDatacartRightLidID(datakey);
					//remove row
					$('#'+leftLidId).remove();//remove li of checkbox
					$('#'+rightLidId).remove();//remove li of item	
					//remove data
					_removeDataFromDatacartObject(datakey);
				}
		}	
	});
	$('#datacart_contentview').empty();
}



