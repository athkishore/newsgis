OpenLayers.ProxyHost = "http://188.166.179.117/proxy?url=";
var map, infoControls, selectControl, pointLayer;
var bounds = new OpenLayers.Bounds(
		8434465,1214769,
		8585072,1131719
);
function load(points) {
	map = new OpenLayers.Map('map', {projection: new
	OpenLayers.Projection("EPSG:900913")});

	var districts = new OpenLayers.Layer.WMS("Districts",
            "http://188.166.179.117:8080/geoserver-2.5/vayal/wms", 
            {'layers': 'vayal:districts', projection: new
            OpenLayers.Projection("EPSG:4326"), transparent: true, format: 'image/gif'},
            {isBaseLayer: false}
	);
        
	var news = new OpenLayers.Layer.WMS("News",
            "http://188.166.179.117:8080/geoserver-2.5/vayal/wms",
            {'layers': 'vayal:news_clippings_summary', projection: new
            OpenLayers.Projection("EPSG:4326"), transparent: true, format:
            'image/gif'},
            {isBaseLayer: false}
	);

        pointLayer = new OpenLayers.Layer.Vector("Point Layer");	
	var osm = new OpenLayers.Layer.OSM("OpenStreetMap");

        infoControls = new OpenLayers.Control.WMSGetFeatureInfo({
                url: 'http://188.166.179.117:8080/geoserver-2.5/vayal/wms', 
                title: 'Identify features by clicking',
                layers: [news],
                queryVisible: true
            });
            
        selectControl = new OpenLayers.Control.SelectFeature(
            pointLayer,
            {
              clickout: false, toggle: false,
              multiple: false, hover: false,
              toggleKey: "ctrlKey",
              multipleKey: "shiftKey",
              box: false
            }
        );
        
	infoControls.infoFormat = 'application/vnd.ogc.gml';
	infoControls.events.register("getfeatureinfo", this, showInfo);

        map.addLayers([osm, districts, news, pointLayer]); 
        loadPointLayer(points);
        map.addControl(infoControls); 
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(selectControl);
        selectControl.activate();
        infoControls.activate();
        map.zoomToExtent(bounds);
}

function showInfo(evt) {
        if (evt.features && evt.features.length) {
          var text = '<table>\
            <tr>\
            <th><b>Place</b></th>\
            <th><b>Date</b></th>\
            <th><b>Url</b></th>\
            <th><b>Summary</b></th>\
            </tr>';
          for (var i=0; i<evt.features.length; i+=1){
            text = text+'<tr>\
            <th>'+evt.features[i].attributes.Place+'</th>\
            <th>'+evt.features[i].attributes.File.substring(0,10)+'</th>\
            <th><a href="'+evt.features[i].attributes.url+'" target="_blank">Read news</a></th>\
            <th>'+evt.features[i].attributes.Summary+'</th>\
            </tr>';
          }
          text = text+'</table>';
          document.getElementById('responseText').innerHTML = text;
        } 
}

function loadPointLayer(points) {
  var proj = new OpenLayers.Projection("EPSG:4326");
  var lonlatPoints = [];
  var pointFeatures = [];
  for (var i=0; i<points.length; i++) {
    var lonlat = new OpenLayers.LonLat(points[i].lon, points[i].lat);
    lonlat.transform(proj, map.getProjectionObject());
    lonlatPoints.push(lonlat);
  }
  for (var i=0; i<lonlatPoints.length; i++) {
    var lonlatPoint = new OpenLayers.Geometry.Point(
        lonlatPoints[i].lon, lonlatPoints[i].lat
    );
    var pointFeature = new OpenLayers.Feature.Vector(
        lonlatPoint, null, null
    );
    pointFeatures.push(pointFeature);
  }
  for (var i=0; i<points.length; i++) {
    console.log(points[i].lon+'|'+points[i].lat+
            '|'+points[i].date+'|'+points[i].details);
  }

  pointLayer.addFeatures(pointFeatures);
}
    
            