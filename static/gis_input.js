OpenLayers.ProxyHost = "http://localhost:5000/proxy?url=";
var map, drawPoint; //, infoControls, highlightLayer;
var bounds = new OpenLayers.Bounds(
		8434465,1214769,
		8585072,1131719
);

function load() {
  map = new OpenLayers.Map('map', {projection: new
  OpenLayers.Projection("EPSG:900913")});

  var osm = new OpenLayers.Layer.OSM("OpenStreetMap");

  var pointLayer = new OpenLayers.Layer.Vector("Point Layer");
        	
  map.addLayers([osm, pointLayer]);
  map.zoomToExtent(bounds);
  map.addControl(new OpenLayers.Control.LayerSwitcher());
  map.addControl(new OpenLayers.Control.MousePosition());
        
  drawPoint = new OpenLayers.Control.DrawFeature(pointLayer, 
                          OpenLayers.Handler.Point)

  map.addControl(drawPoint);          
  drawPoint.activate();
}
