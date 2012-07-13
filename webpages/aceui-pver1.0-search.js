/**
 * File : AgmipUI-pver1.0-search.js
 * created by/at : Yunchul Jung, Jun,2012
 */
/**
 * Function name rule
 * - top level func at js file : ex) fixContentHeight()
 * - sub level func at js file : ex) _initLayerList()
 * - func binding DOM element id : ex) search_contents()
 */

/**
 * dataset of searched data
 **/
// dataset for selected features 
var	selectedFeaturesObj;
// reset dataset
function _resetSelectedFeaturesObj(){
	var newSelectedFeaturesObj = {
		"type": "FeatureCollection",
		"features": []	
	};
	return newSelectedFeaturesObj;
}
// get a feature having a specific datakey from selectedFeaturesObj set
function _getFeaturesFromSelectedObj (datakey){
	for(var j=0;j<selectedFeaturesObj.features.length;j++){
		sitem = selectedFeaturesObj.features[j].properties.datakey;
		if(datakey == sitem) {
			return selectedFeaturesObj.features[j];
		}
	}
	return NaN;
}
// remove a feature having a specific datakey from selectedFeaturesObj set
function _removeDataFromSelectedObject(datakey){
	var sitem;
	for(var j=0;j<selectedFeaturesObj.features.length;j++){
		sitem = selectedFeaturesObj.features[j].properties.datakey;
		if(datakey == sitem) {
			//alert(datakey+'/'+sitem+'/'+(datakey == sitem));
			selectedFeaturesObj.features.splice(j,1);
			break;
		}
	}
}
 
/**
 * display
 */
function displaySearchItems(data){
	if(data.features.length == 0){
		$('<li>')
			.hide()
			.append($('<h2 />', {
				text: 'Your search returned 0 data.'
			}))
			.appendTo('#search_results')
			.show();
	}else{
		//left header
		$('<li>')
			.hide()
			.append($('<h3 />', {
				text: '#',
				style:'height:25px'
			}))
			.appendTo('#search_results_chkbox')
			.show();
		//right header	
		$('<li>')
			.hide()
			.append($('<h2 />', {
				text: 'Your search returned below data.' //+data.features.length+' data.'
			}))
			.appendTo('#search_results')
			.show();
			
		// for each row of item	
		$.each(data.features, function(i) {
			var place = this;
			
			var lonlatsrc = new OpenLayers.LonLat(place.geometry.coordinates[0],
					place.geometry.coordinates[1]);
			var lonlattrans = lonlatsrc.transform(toProjection,fromProjection);//(place.lng, place.lat);
			
			var itemkey = place.properties.datakey;					
			var item_left_li_id = _getSearchItemLeftLiID(itemkey);
			var item_left_li_chkbox_id = _getSearchItemLeftLiChkboxID(itemkey);
			var item_right_li_id = _getSearchItemRightLiID(itemkey);
			
			//left checkboxs
			$('<li>')
				.hide()
				.attr('id', item_left_li_id)
				.append($('<input />', {
					type: 'checkbox',
					id: item_left_li_chkbox_id,
					style:'height:160px'
				}))
				.appendTo('#search_results_chkbox')
				.show();
			//right items	
			$('<li>')
				.hide()
				.attr('id', item_right_li_id)
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
					html: '<b>' + '- Institute :' + '</b> ' + place.properties.Institute
				}))
				.append($('<p />', {
					html: '<b>' + '- Data Source :' + '</b> ' + place.properties.Data_source
				}))
				.append($('<p />', {
					html: '<b>' + '- Data Source Version :' + '</b> ' + place.properties.Data_source_version
				}))
				.append($('<p />', {
					html: '<b>' + '- Crop :' + '</b> ' + place.properties.Crop
				}))	
				.append($('<p />', {
					html: '<b>' + '- Planting/Harvesting Year :' + '</b> ' + place.properties.PlantingYear +' / '+ place.properties.HarvestYear
				}))						
				.appendTo('#search_results')
				.click(function() {
					$.mobile.changePage('#mappage');
					//var lonlatsrc1 = new OpenLayers.LonLat(-71,42);
					//map.setCenter(lonlatsrc1.transform(fromProjection,toProjection), 5);
					var lonlatsrc1 = new OpenLayers.LonLat(lonlattrans.lon,lonlattrans.lat);
					//alert(lonlattrans.lon+'/'+lonlattrans.lat);
					map.setCenter(lonlatsrc1.transform(fromProjection,toProjection), 10);
				})
				.show();
		});
	}
	$('#search_results_chkbox').listview('refresh');
	$('#search_results').listview('refresh');
	$.mobile.pageLoading(true);			
}
// update map
function updateSearchedItem(){
	_updatePlot(selectedFeaturesObj);
}

/**
 * search control
 */
// define selected options and values
var optionValueArray;
function _getNewSearchOptionValueArray(){
	var searchOptionValueArray = 
	{"options":[
				{"LocationCat":false,
				 "Child":[{"Country":false,"Fvalue":""},
						  {"LonLat":false,"Fvaluelon":"","Fvaluelat":""}
						 ]},
				{"CropCat":false, 
				 "Child":[{"Crop":false,"Fvalue":""}]},
				{"DateCat":false, 
				 "Child":[{"PlantingYear":false,"Fvalue":""},
						  {"HarvestYear":false,"Fvalue":""}	
						 ]}
				]
	};
	return searchOptionValueArray;
}	
// check option flag/data, and then invoke searchData func
function _searchContents(){

	optionValueArray = _getNewSearchOptionValueArray();//initialize
	
	var locationCategory = $('#locationCB').is(':checked');
	var cropCategory = $('#cropCB').is(':checked');
	var dateCategory = $('#phdateCB').is(':checked');
	/** location cat */
	if(locationCategory){
		var dirtyFlg = false;
		// country field
		var country = $('#country option:selected').text();	
		if(country != '') {
			optionValueArray.options[0].Child[0].Country = true;
			optionValueArray.options[0].Child[0].Fvalue = country;
			dirtyFlg = true;
		}
		// lonlat field
		var lon = $('#lonquery').val();
		var lat = $('#latquery').val();
		
		if( _checkLonLatNumbers(lon, lat) ){
			optionValueArray.options[0].Child[1].LonLat = true;
			optionValueArray.options[0].Child[1].Fvaluelon = lon;
			optionValueArray.options[0].Child[1].Fvaluelat = lat;
			dirtyFlg = true;		
		}
		
		if(dirtyFlg)
			optionValueArray.options[0].LocationCat = true;
		else
			optionValueArray.options[0].LocationCat = false;
	}else{
		optionValueArray.options[0].LocationCat = false;
	}
	/** crop cat */
	if(cropCategory){
		var dirtyFlg = false;
		// crop field
		var crop = $('#crop option:selected').val();

		if(crop != '') {
			optionValueArray.options[1].Child[0].Crop = true;
			optionValueArray.options[1].Child[0].Fvalue = crop;
			dirtyFlg = true;
		}	
		
		if(dirtyFlg)
			optionValueArray.options[1].CropCat = true;
		else
			optionValueArray.options[1].CropCat = false;		
	}else{
		optionValueArray.options[1].CropCat = false;
	}
	/** date cat */
	if(dateCategory){
		var dirtyFlg = false;
		// plant year field	
		var plantyear = $('#plantyear option:selected').text();
		if(plantyear != '') {
			optionValueArray.options[2].Child[0].PlantingYear = true;
			optionValueArray.options[2].Child[0].Fvalue = plantyear;
			dirtyFlg = true;
		}
		// harvest year field	
		var harvestyear = $('#harvestyear option:selected').text();
		if(harvestyear != '') {
			optionValueArray.options[2].Child[1].HarvestYear = true;
			optionValueArray.options[2].Child[1].Fvalue = harvestyear;
			dirtyFlg = true;
		}		
		
		if(dirtyFlg)
			optionValueArray.options[2].DateCat = true;
		else
			optionValueArray.options[2].DateCat = false;		
	}else{
		optionValueArray.options[2].DateCat = false;
	}
	
	// search data
	_searchData(optionValueArray);
}	

/**
 * Search result control
 */
function select_all_search_result(){
	$('#search_results_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				$(this).attr('checked', true);
		}	
	});
}
function reset_search_result_selection(){
	var isUpdated = false;
	$('#search_results_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				$(this).attr('checked', false);
				isUpdated = true;
		}	
	});
	if(isUpdated) updateSearchedItem();
}
function remove_selected_search_result(){
	var isUpdated = false;
	$('#search_results_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				if($(this).is(':checked')){	
					var chkboxId = $(this).attr('id');//ex) itemDatakey+'_li_chkbox'
					var leftLidId = _getSearchItemLeftLiIDFromChkboxId(chkboxId);	
					var rightLidId = _getSearchItemRightLiIDFromChkboxId(chkboxId);
					var datakey = _getSearchItemDatakeyFromChkboxId(chkboxId);
					//remove ui
					$('#'+leftLidId).remove();//remove li of checkbox
					$('#'+rightLidId).remove();//remove li of item			
					//remove item	
					_removeDataFromSelectedObject(datakey);
					isUpdated = true;
				}
		}	
	});	
	if(isUpdated) updateSearchedItem();
}
function remove_all_search_result(){
	var isUpdated = false;
	$('#search_results_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				{	
					var chkboxId = $(this).attr('id');//ex) itemDatakey+'_li_chkbox'
					var leftLidId = _getSearchItemLeftLiIDFromChkboxId(chkboxId);	
					var rightLidId = _getSearchItemRightLiIDFromChkboxId(chkboxId);
					var datakey = _getSearchItemDatakeyFromChkboxId(chkboxId);
					//remove ui
					$('#'+leftLidId).remove();//remove li of checkbox
					$('#'+rightLidId).remove();//remove li of item			
					//remove item	
					_removeDataFromSelectedObject(datakey);
					isUpdated = true;
				}
		}	
	});	
	if(isUpdated) updateSearchedItem();
}
function exeAddSelectionsToQueue(){
	var datakeys = [];
	$('#search_results_chkbox').find(':input').each(function(){
		switch(this.type){
			case 'checkbox': 
				if($(this).is(':checked')){
					var chkboxId = $(this).attr('id');//ex) itemDatakey+'_li_chkbox'
					var datakey = _getSearchItemDatakeyFromChkboxId(chkboxId);
					datakeys.push(datakey);
				}
		}	
	});

	var itemnumber = _addDataToDatacartObject(datakeys);
	alert('['+itemnumber+'] data are added to queue in data tool page.');
	
	if(itemnumber>0){
		// remove from list
		remove_selected_search_result();	
		// update map of datacart item
		updateDataCartItem();
		// update datacart item
		updateDatacartList();
	}
}

/**
 * form
 */
// clear contents in form in search option panel
function clearOptionContents(){

	_clearFormElements('#locCat');
	_clearFormElements('#cropCat');
	_clearFormElements('#dateCat');

	//reset contents in search result pane
	_clearSearchResults();
}
// clear contents in form
function _clearFormElements(ele){
	$(ele).find(':input').each(function(){
		switch(this.type){
			case 'select': //cannot detect
			case 'select-one':
				$(this)[0].selectedIndex = 0;
				$(this).selectmenu("refresh");
				break;
			case 'text':
				$(this).val('');
				break;
			case 'checkbox':
			case 'radio':
				$(this).attr('checked', false).checkboxradio("refresh");
		}	
	});
}
// reset search result pane (chkbox,list) 
function _clearSearchResults(){
	$('#search_results_chkbox').empty();
	$('#search_results').empty();
}
// put a row at top of search result
function displaySearchResultTopRow(){
	$('<li>')
		.hide()
		.append($('<h4 />', {
			text: 'Find data by specifying options.',
			style:'margin:10px 10px 10px 10px;height:30px;' 
		}))
		.appendTo('#search_results')
		.show();
}





