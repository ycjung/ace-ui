/**
 * File : AgmipUI-pver1.0-base.js
 * created by/at : Yunchul Jung, Jun,2012
 */
/**
 * Function name rule
 * - top level func at js file : ex) fixContentHeight()
 * - sub level func at js file : ex) _initLayerList()
 * - func binding DOM element id : ex) search_contents()
 */

 /**
  * initialize 
  */
// Start with the map page
window.location.replace(window.location.href.split("#")[0] + "#mappage");
// original
var selectedFeature = null;

$(document).ready(function() {

    // fix height of content-original
    function fixContentHeight() {
        var footer = $("div[data-role='footer']:visible"),
            content = $("div[data-role='content']:visible:visible"),
            viewHeight = $(window).height(),
            contentHeight = viewHeight - footer.outerHeight();

        if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
            contentHeight -= (content.outerHeight() - content.height() + 1);
            content.height(contentHeight);
        }

        if (window.map) {
            map.updateSize();
        } else {
            // initialize map
            init(function(feature) { 
                selectedFeature = feature; 
                $.mobile.changePage("#popup", "pop"); 
            });
            _initLayerList();
        }
    }
    $(window).bind("orientationchange resize pageshow", fixContentHeight);
    document.body.onload = fixContentHeight;

    // Map zoom  
    $("#plus").click(function(){
        map.zoomIn();
    });
    $("#extent").click(function(){
		var bound = new OpenLayers.Bounds(
            -20761519.9, -11114555.4, 20761519.9, 11114555.4
        )
		map.zoomToExtent(bound, true);
    });	
    $("#minus").click(function(){
		if(map.getZoom()<3){
			var bound = new OpenLayers.Bounds(
				-20761519.9, -11114555.4, 20761519.9, 11114555.4
			)
			map.zoomToExtent(bound, true);
		}else{
			map.zoomOut();
		}        
    });
	/*
    $("#locate").click(function(){
        var control = map.getControlsBy("id", "locate-control")[0];
        if (control.active) {
            control.getCurrentLocation();
        } else {
            control.activate();
        }
    });
	*/
    // popup page show
    $('#popup').live('pageshow',function(event, ui){
		
		//var test1 = selectedFeature.cluster[0];
		//alert(test1);
		
        var li = "";
		/* original - when not using cluster
        for(var attr in selectedFeature.attributes){
            li += "<li><div style='width:25%;float:left'>" + attr + "</div><div style='width:75%;float:right'>" 
            + selectedFeature.attributes[attr] + "</div></li>";
        }
		*/
		
		for(var attr in selectedFeature.cluster[0].attributes){
            li += "<li><div style='width:35%;float:left'>" + attr + "</div><div style='width:65%;float:right'>" 
            + selectedFeature.cluster[0].attributes[attr] + "</div></li>";
        }
		
        $("ul#details-list").empty().append(li).listview("refresh");
	
    });
	
	// search page show
    $('#searchpage').live('pageshow',function(event, ui){
		// transform lon/lat to this coord system for raw-data1 version
		_initFeatureData();
		// initialize dropdown box at search page
		_initDropdownBox();
		// first row
		displaySearchResultTopRow();
		// search button clicked
		$('#searchfeature').click(function(e){
			_clearSearchResults();
			_searchContents();	

            // Prevent form send
            e.preventDefault();			

			var data = selectedFeaturesObj;
			displaySearchItems(data);
		});
		
		// reset button clicked	
		$('#resetoption').click(function(e){
			clearOptionContents();		
			displaySearchResultTopRow();
		});
		
		// button of add data to queue
		$('#addSelectionsToQueue').click(function(e){
			exeAddSelectionsToQueue();			
		});
		
        // only listen to the first event triggered
        $('#searchpage').die('pageshow', arguments.callee);
    });
	
	// data tool export page show
    $('#datatoolsexportpage').live('pageshow',function(event, ui){

		if(datacartFeaturesObj.features.length == 0){
			// first row
			displayDataCartTopRow();
		}
		
		// button of refresh items in list
		$('#refreshItemsInQueue').click(function(e){
			clearQueueList();
            // Prevent form send
            e.preventDefault();	
			
			var data = datacartFeaturesObj;	
			displayDatacartItems(data);
		});
					
        // only listen to the first event triggered
        $('#datatoolsexportpage').die('pageshow', arguments.callee);		
	});
	
	//init data cart
	resetDatacart();

});

/**
 * search page
 */
// initiate dropdown boxes for search options
function _initDropdownBox(){
	_getItemList();
	//for country item list
	for(var i=0;i<countryItemList.length;i++){
		$('<option>'+countryItemList[i].toString()+'</option>').appendTo('#country');
	}	
	//for crop item list
	for(var i=0;i<cropItemList.length;i++){
		var key = cropItemList[i].toString();
		$('<option value=\''+key+'\'>'+getCropName(key)+'</option>').appendTo('#crop');
	}		
	//for planting year item list
	for(var i=1970;i<2013;i++){
		$('<option>'+i+'</option>').appendTo('#plantyear');
	}	
	//for harvesting year item list
	for(var i=1970;i<2013;i++){
		$('<option>'+i+'</option>').appendTo('#harvestyear');
	}	
}
var countryItemList = new Array();
var cropItemList = new Array();
function _getItemList(){
	var isExist = false;
	if(countryItemList.length == 0 || cropItemList.length == 0 ){
		for(var i =0; i<features.features.length; i++ ){
			isExist = false;
			//for country list
			for(var j=0;j<countryItemList.length;j++){
				if(features.features[i].properties.Country == countryItemList[j]){
					isExist = true;	break;
				}				
			}
			if(!isExist){
				countryItemList.push(features.features[i].properties.Country);
			}	
			//for crop list
			for(var j=0;j<cropItemList.length;j++){
				if(features.features[i].properties.Crop == cropItemList[j]){
					isExist = true;	break;
				}				
			}
			if(!isExist){
				cropItemList.push(features.features[i].properties.Crop);
			}			
		}
		countryItemList.sort();
		cropItemList.sort();
	}else{
		//alert('use exist list');
	}
}
// numeric validation in textbox
function numeric_validation(e){
	var unicode=e.charCode? e.charCode : e.keyCode;
	if (unicode!=8 //backspace
		&& (unicode != 46) //delete key
		&& (unicode != 109) //subtract
		&& (unicode != 188) //comma
	){
		if (unicode<48||unicode>57) //if not a number
			return false; //disable key press
	}
} 
// check lon/lat range
function _checkLonLatNumbers(lon, lat){
	// when one of value is empty
	if( (lon != '' && lat == '') || (lon == '' && lat != '') )
	{
		if( (lon != '' && lat == '') ){
			alert('Enter a proper Latitude value.');
			$('#latquery').focus();
			return false;
		}else if( (lon == '' && lat != '') ){
			alert('Enter a proper Longitude value.');
			$('#lonquery').focus();
			return false;
		}
	}
	// when both values are not empty, check number format
	else if(lon != '' && lat != '')
	{
		if(isNaN(lon)){
			alert('Enter a proper number of Longitude.');
			$('#lonquery').focus();
			return false;
		}
		if(isNaN(lat)){
			alert('Enter a proper number of Latitude.');
			$('#latquery').focus();
			return false;
		}
		// number range check
		if( (lon < -180) || (lon > 180) ){
			alert('Enter a number of Longitude between -180 and 180.');
			$('#lonquery').focus();
			return false;
		}
		if( (lat < -90) || (lat > 90) ){
			alert('Enter a number of Latitude between -90 and 90.');
			$('#latquery').focus();
			return false;
		}		
	}
	// when both values are empty
	else return false;
	
	return true;
}

/**
 * layers page
 */
// original - initiate list of layers in layer page
function _initLayerList() {
    $('#layerspage').page();
    $('<li>', {
            "data-role": "list-divider",
            text: "Base Layers"
        })
        .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        _addLayerToList(this);
    });
    $('<li>', {
            "data-role": "list-divider",
            text: "Overlay Layers"
        })
        .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        _addLayerToList(this);
    });
    $('#layerslist').listview('refresh');   
    map.events.register("addlayer", this, function(e) {
        _addLayerToList(e.layer);
    });
}
// original - called at above only
function _addLayerToList(layer) {
    var item = $('<li>', {
            "data-icon": "check",
            "class": layer.visibility ? "checked" : ""
        })
        .append($('<a />', {
            text: layer.name
        })
            .click(function() {
                //$.mobile.changePage('#mappage');
                if (layer.isBaseLayer) {
                    layer.map.setBaseLayer(layer);
                } else {
                    layer.setVisibility(!layer.getVisibility());
                }
            })
        )
        .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function() {
            $(item).toggleClass('checked');
        }
    });
}


 

