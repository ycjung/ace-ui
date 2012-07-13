
/**
 * display initial features. original. called at init
 */ 
// not used, set inactivated 
function getFeatures() {
	var reader = new OpenLayers.Format.GeoJSON();
	return reader.read(features);
}
// init with null feature data
function getInitFeatures() {
	selectedFeaturesObj = _resetSelectedFeaturesObj();
	var reader = new OpenLayers.Format.GeoJSON();
	return reader.read(selectedFeaturesObj);
}
function getDCInitFeatures() {
	datacartFeaturesObj = _getNewDatacartFeaturesObj();
	var reader = new OpenLayers.Format.GeoJSON();
	return reader.read(datacartFeaturesObj);
}
// get data with given search options
function _searchData(searchValueArray){
	
	selectedFeaturesObj = _resetSelectedFeaturesObj();

	var dirtyFlg = false;
	var lonbuffer = 5.0;
	var latbuffer = 5.0;
	var isNeedStop = false;
	for(var i =0; i<features.features.length; i++ ){
		for(var j=0;j<1;j++){
			dirtyFlg = false;
			/** location cat */
			if(searchValueArray.options[0].LocationCat){
				//isNeedStop = false;// search 'country' or 'lonlat'
				//country
				if(searchValueArray.options[0].Child[0].Country){
					if( (searchValueArray.options[0].Child[0].Fvalue != features.features[i].properties.Country) ){
						//break;
						//isNeedStop = true;
					}else{
						dirtyFlg = true;
					}
				}
				//lonlat
				if(searchValueArray.options[0].Child[1].LonLat){	
					var lonlatsrc = new OpenLayers.LonLat(features.features[i].geometry.coordinates[0],
							features.features[i].geometry.coordinates[1]);					
					var lonlattrans = lonlatsrc.transform(toProjection,fromProjection);
					
					var lon = new Number(searchValueArray.options[0].Child[1].Fvaluelon);
					var lat = new Number(searchValueArray.options[0].Child[1].Fvaluelat);

					if( (lonlattrans.lon < lon+lonbuffer) && (lonlattrans.lon > lon-lonbuffer) 
						&& (lonlattrans.lat < lat+latbuffer) && (lonlattrans.lat > lat-latbuffer) ){
						dirtyFlg = true;
					}//else{
					//	isNeedStop = true;
					//}
				}
				// 'Or' search
				if(!dirtyFlg) {
					_clearSearchResults();
					break;				
				}
			}
			/** crop cat */
			if(searchValueArray.options[1].CropCat){
				//alert(searchValueArray.options[1].Child[0].Fvalue +'/'+ features.features[i].properties.Crop);
				//crop
				if(searchValueArray.options[1].Child[0].Crop){
					if( (searchValueArray.options[1].Child[0].Fvalue != features.features[i].properties.Crop) ){
						_clearSearchResults();
						break;
					}else{
						dirtyFlg = true;
					}
				}			
			}
			/** date cat */
			if(searchValueArray.options[2].DateCat){
				isNeedStop = true;// search 'planting year' or 'harvesting year'
				//alert(searchValueArray.options[2].Child[0].Fvalue != features.features[i].properties.PlantingYear);
				// planting year
				if(searchValueArray.options[2].Child[0].PlantingYear){
					if( (searchValueArray.options[2].Child[0].Fvalue != features.features[i].properties.PlantingYear) ){
						//break;
						//isNeedStop = true;
					}else{
						dirtyFlg = true;
						isNeedStop = false;
					}
				}	
				// harvest year
				if(searchValueArray.options[2].Child[1].HarvestYear){
					if( (searchValueArray.options[2].Child[1].Fvalue != features.features[i].properties.HarvestYear) ){
						//break;
						//isNeedStop = true;						
					}else{
						dirtyFlg = true;
						isNeedStop = false;
					}
				}
				// 'Or' search
				if(isNeedStop){
					_clearSearchResults();
					break;
				}				
			}	
			
			//add searched data
			if(dirtyFlg) {
				selectedFeaturesObj.features.push(features.features[i]);
			}
		}
	}	
	// update map 
	_updatePlot(selectedFeaturesObj);
}
// update map
function _updatePlot(selectedFeaturesObj){
	var reader = new OpenLayers.Format.GeoJSON();
	var selectedFeatures = reader.read(selectedFeaturesObj);	
		
	// update feature data
	searchFeatureLayer.removeAllFeatures();
	searchFeatureLayer.addFeatures(selectedFeatures);
	searchFeatureLayer.refresh();
}
function _updateDataCartPlot(datacartFeaturesObj){
	var reader = new OpenLayers.Format.GeoJSON();
	var datacartFeatures = reader.read(datacartFeaturesObj);	
		
	// update feature data
	datacartFeatureLayer.removeAllFeatures();
	datacartFeatureLayer.addFeatures(datacartFeatures);
	datacartFeatureLayer.refresh();
}

/**
 * datakey & element id for search page
 */
// search item left list li id
function _getSearchItemLeftLiID(itemDatakey){
	return itemDatakey+'_li';
}
// search item left list li chkbox id
function _getSearchItemLeftLiChkboxID(itemDatakey){
	return itemDatakey+'_li_chkbox';
}
// search item right list content li id
function _getSearchItemRightLiID(itemDatakey){
	return itemDatakey+'_li_content';
}
function _getSearchItemLeftLiIDFromChkboxId(chkboxID){
	//ex) itemDatakey+'_li_chkbox';
	return chkboxID.replace('_chkbox','');
}
function _getSearchItemRightLiIDFromChkboxId(chkboxID){
	//ex) itemDatakey+'_li_chkbox';
	return chkboxID.replace('_chkbox','_content');
}
function _getSearchItemDatakeyFromChkboxId(chkboxID){
	//ex) itemDatakey+'_li_chkbox';
	return chkboxID.replace('_li_chkbox','');
}

/**
 * datakey & element id for datatool page
 */
function _getDatacartLeftLidID(itemDatakey){
	//ex) itemDatakey+'_li_dcart'
	return itemDatakey+'_li_dcart';
}
function _getDatacartLeftLidChkboxID(itemDatakey){
	//ex) itemDatakey+'_li_dcart_chkbox'
	return itemDatakey+'_li_dcart_chkbox';
}
function _getDatacartRightLidID(itemDatakey){
	//ex) itemDatakey+'_li_dcart_content'
	return itemDatakey+'_li_dcart_content';
}
function _getDatakeyFromDatacartChkboxID(datacartChkboxID){
	return datacartChkboxID.replace('_li_dcart_chkbox','');
}




