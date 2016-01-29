OpenLayers.ProxyHost = "http://188.166.179.117/proxy?url=";
var map, infoControls;
var bounds = new OpenLayers.Bounds(
		8483531,1154182,
		8484780,1153347
);
function load(points) {
	map = new OpenLayers.Map('map', {projection: new
	OpenLayers.Projection("EPSG:900913"), numZoomLevels: 28});

	var districts = new OpenLayers.Layer.WMS("Districts",
            "http://188.166.179.117:8080/geoserver-2.5/vayal/wms", 
            {'layers': 'vayal:districts', projection: new
            OpenLayers.Projection("EPSG:4326"), transparent: true, format: 'image/gif'},
            {isBaseLayer: false}
	);
        
	var kannoli = new OpenLayers.Layer.WMS("Kannolichira",
            "http://188.166.179.117:8080/geoserver-2.5/vgr/wms",
            {'layers': 'vgr:plots_modified', projection: new
            OpenLayers.Projection("EPSG:4326"), transparent: true, format:
            'image/gif'},
            {isBaseLayer: false}
	);

	var osm = new OpenLayers.Layer.OSM("OpenStreetMap");

        infoControls = new OpenLayers.Control.WMSGetFeatureInfo({
                url: 'http://188.166.179.117:8080/geoserver-2.5/vgr/wms', 
                title: 'Identify features by clicking',
                layers: [kannoli],
                queryVisible: true
            });
            
	infoControls.infoFormat = 'application/vnd.ogc.gml';
	infoControls.events.register("getfeatureinfo", this, showInfo);

        map.addLayers([osm, districts, kannoli]); 
        map.addControl(infoControls); 
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        infoControls.activate();
        map.zoomToExtent(bounds);
}

function showInfo(evt) {
        if (evt.features && evt.features.length) {
          var text = '<table><tr>\
            <th><b>Id</b></th>\
            <th><b>Owner</b></th>\
            <th><b>Lessee</b></th>\
            <th><b>Farming</b></th>\
            <th><b>Threat</b></th>\
            <th><b>Remarks</b></th>\
            <th><b>Thandaper</b></th>\
            </tr>';
          for (var i=0; i<evt.features.length; i+=1){
            text = text+'<tr>\
            <th>'+evt.features[i].attributes.id+'</th>\
            <th>'+evt.features[i].attributes.owner+'</th>\
            <th>'+evt.features[i].attributes.lessee+'</th>\
            <th>'+evt.features[i].attributes.Farming+'</th>\
            <th>'+evt.features[i].attributes.Threat+'</th>\
            <th>'+evt.features[i].attributes.Remarks+'</th>\
            <th>'+evt.features[i].attributes.Thandaper+'</th>\
            </tr>';
          }
          text = text+'</table><p></p>';
          document.getElementById('responseText').innerHTML = text;
        }
        else {
          document.getElementById('responseText').innerHTML = '';
        } 
}

    
            