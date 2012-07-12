


// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var fromProjection = new OpenLayers.Projection("EPSG:4326");//gg// Transform from WGS 1984
var toProjection = new OpenLayers.Projection("EPSG:900913");//sm// to Spherical Mercator Projection
/**
 * usage : lon/lat to location
 *  var position       = new OpenLayers.LonLat(13.41,52.52).transform( fromProjection, toProjection);
 *  var zoom           = 15; 
 *  map.setCenter(position, zoom );
 * usage : location to lon/lat
 *  var position       = new OpenLayers.LonLat(1341000.00,5200000.00).transform( toProjection, fromProjection);  
 */
var searchFeatureLayer;
var targetLayerName = "Searched Items";
var datacartFeatureLayer;
var dctargetLayerName = "Data Cart Items";


// init
var init = function (onSelectFeatureFunction) {
	// vector layer for locate - not used
    var vector = new OpenLayers.Layer.Vector("Vector Layer", {});
	
	var searchstrategy = new OpenLayers.Strategy.Cluster({distance:50});	
	var datacartstrategy = new OpenLayers.Strategy.Cluster({distance:50});

	var searchstyle = new OpenLayers.Style(
		{		
		externalGraphic: "${image}",
		graphicOpacity: 1.0,graphicWith: 35,
		graphicHeight: 35,graphicYOffset: -26,	
							
		label : "${name}",			
		fontColor: "white",fontSize: "18px",
		fontFamily: "Courier New, monospace",
		fontWeight: "bold",labelAlign: "ct", //cm, cb
		// positive value moves the label to the right
		labelXOffset: "0",
		// negative value moves the label down
		labelYOffset: "16"					
		},
		{ context: {
					name: function(feature) {
							if(feature.cluster && feature.attributes.count>1) {
								return feature.attributes.count;
							}else {
								return ""; 
							}
						},
					image: function(feature) {
							if(feature.cluster && feature.attributes.count>1) {
								return "img/clustered-b.png";
							}else {
								return "img/loc-b.png"; 
							}
						}
					}
		}
	);
	searchFeatureLayer = new OpenLayers.Layer.Vector(targetLayerName, {
        styleMap: new OpenLayers.StyleMap({'default': searchstyle}), 
		strategies: [searchstrategy]});	

		
	var datacartstyle = new OpenLayers.Style(
		{		
		externalGraphic: "${image}",
		graphicOpacity: 1.0,graphicWith: 35,
		graphicHeight: 35,graphicYOffset: -26,	
							
		label : "${name}",			
		fontColor: "white",fontSize: "18px",
		fontFamily: "Courier New, monospace",
		fontWeight: "bold",labelAlign: "ct", //cm, cb
		// positive value moves the label to the right
		labelXOffset: "0",
		// negative value moves the label down
		labelYOffset: "16"					
		},
		{ context: {
					name: function(feature) {
							if(feature.cluster && feature.attributes.count>1) {
								return feature.attributes.count;
							}else {
								return ""; 
							}
						},
					image: function(feature) {
							if(feature.cluster && feature.attributes.count>1) {
								return "img/clustered-a.png";
							}else {
								return "img/loc-a.png"; 
							}
						}
					}
		}
	);
	datacartFeatureLayer = new OpenLayers.Layer.Vector(dctargetLayerName, {
        styleMap: new OpenLayers.StyleMap({'default': datacartstyle}), 
		strategies: [datacartstrategy]});	


    //var sprinters = getFeatures(); original - not used
	var sitems = getInitFeatures();
    searchFeatureLayer.addFeatures(sitems);
	var dcitems = getDCInitFeatures();
    datacartFeatureLayer.addFeatures(dcitems);

    var selectControl = new OpenLayers.Control.SelectFeature(searchFeatureLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
    var dcselectControl = new OpenLayers.Control.SelectFeature(datacartFeatureLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});		

	/*
    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });
	*/
	
    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: toProjection,
        units: "m",
        numZoomLevels: 18,
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(
            -20037508.34, -20037508.34, 20037508.34, 20037508.34
        ),
        controls: [
            new OpenLayers.Control.Attribution(),			
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),			
			new OpenLayers.Control.Navigation(),
			//new OpenLayers.Control.ScaleLine(), //fix location
			//new OpenLayers.Control.ZoomBox({alwaysZoom:true}),
            //geolocate,
            dcselectControl,
			selectControl			
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Road",
                // custom metadata parameter to request the new map style - only useful
                // before May 1st, 2011
                metadataParams: {
                    mapVersion: "v1"
                },
                name: "Bing Road",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Aerial",
                name: "Bing Aerial",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "AerialWithLabels",
                name: "Bing Aerial + Labels",
                transitionEffect: 'resize'
            }),
            vector,
			datacartFeatureLayer,
			searchFeatureLayer			
        ],
        center: new OpenLayers.LonLat(0, 0),
        zoom: 2 // YJ: default 1 - does not work at local web
    });

    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
	/*
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.zoomToExtent(vector.getDataExtent());
    });
	*/
				
};





