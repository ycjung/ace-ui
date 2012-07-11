/*
// example dataset
var features = {
	"type": "FeatureCollection",
	"features": [
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [1332700, 7906300]},
			"properties": {"datakey":"item1","Name": "Igor Tihonov", "Country":"Sweden", "City":"Gothenburg","Crop":"Wheat","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [790300, 6573900]},
			"properties": {"datakey":"item2","Name": "Marc Jansen", "Country":"Germany", "City":"Bonn","Crop":"Maize","PlantingYear":"1987","HarvestYear":"1987"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [568600, 6817300]},
			"properties": {"datakey":"item3","Name": "Bart van den Eijnden", "Country":"Netherlands", "City":"Utrecht","Crop":"Soybean","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [-7909900, 5215100]},
			"properties": {"datakey":"item4","Name": "Christopher Schmidt", "Country":"United States of America", "City":"Boston","Crop":"Maize","PlantingYear":"1987","HarvestYear":"1987"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [-937400, 5093200]},
			"properties": {"datakey":"item5","Name": "Jorge Gustavo Rocha", "Country":"Portugal", "City":"Braga","Crop":"Wheat","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [-355300, 7547800]},
			"properties": {"datakey":"item6","Name": "Jennie Fletcher ", "Country":"Scotland", "City":"Edinburgh","Crop":"Soybean","PlantingYear":"1987","HarvestYear":"1987"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [657068.53608487, 5712321.2472725]},
			"properties": {"datakey":"item7","Name": "Bruno Binet ", "Country":"France", "City":"Chambéry","Crop":"Wheat","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [667250.8958124, 5668048.6072737]},
			"properties": {"datakey":"item8","Name": "Eric Lemoine", "Country":"France", "City":"Theys","Crop":"Soybean","PlantingYear":"1987","HarvestYear":"1987"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [653518.03606319, 5721118.5122914]},
			"properties": {"datakey":"item9","Name": "Antoine Abt", "Country":"France", "City":"La Motte Servolex","Crop":"Maize","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [657985.78042416, 5711862.6251028]},
			"properties": {"datakey":"item10","Name": "Pierre Giraud", "Country":"France", "City":"Chambéry","Crop":"Wheat","PlantingYear":"1987","HarvestYear":"1987"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [742941.93818208, 5861818.9477535]},
			"properties": {"datakey":"item11","Name": "Stéphane Brunner", "Country":"Switzerland", "City":"Paudex","Crop":"Soybean","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [736082.61064069, 5908165.4649505]},
			"properties": {"datakey":"item12","Name": "Frédéric Junod", "Country":"Switzerland", "City":"Montagny-près-Yverdon","Crop":"Maize","PlantingYear":"1986","HarvestYear":"1986"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [771595.97057525, 5912284.7041793]},
			"properties": {"datakey":"item13","Name": "Cédric Moullet", "Country":"Switzerland", "City":"Payerne","Crop":"Wheat","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [744205.23922364, 5861277.319748]},
			"properties": {"datakey":"item14","Name": "Benoit Quartier", "Country":"Switzerland", "City":"Lutry","Crop":"Soybean","PlantingYear":"1986","HarvestYear":"1986"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [1717430.147101, 5954568.7127565]},
			"properties": {"datakey":"item15","Name": "Andreas Hocevar", "Country":"Austria", "City":"Graz","Crop":"Potato","PlantingYear":"1988","HarvestYear":"1988"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [-12362007.067301,5729082.2365672]},
			"properties": {"datakey":"item16","Name": "Tim Schaub", "Country":"United States of America", "City":"Bozeman","Crop":"Potato","PlantingYear":"1986","HarvestYear":"1986"}},
		{ "type": "Feature", "geometry": {"type": "Point", "coordinates": [-9179900, 3465100]},
			"properties": {"datakey":"item16","Name": "Tim Schaub", "Country":"United States of America", "City":"Gainesville","Crop":"Potato","PlantingYear":"1986","HarvestYear":"1986"}}
	]
};
*/
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




