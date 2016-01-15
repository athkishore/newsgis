var map, pointLayer; 
var bounds = new OpenLayers.Bounds(
		8434465,1214769,
		8585072,1131719
);

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },
    
    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    },
    
    trigger: function(e) {
        var proj = new OpenLayers.Projection("EPSG:4326");
        var lonlat_mapproj = map.getLonLatFromPixel(e.xy);
        var lonlat = new OpenLayers.LonLat(lonlat_mapproj.lon,
            lonlat_mapproj.lat
        );
        lonlat.transform(map.getProjectionObject(), proj);
        var point = new OpenLayers.Geometry.Point(
            lonlat_mapproj.lon, lonlat_mapproj.lat
        );
        var pointFeature = new OpenLayers.Feature.Vector(
            point, null, null
        );
        pointLayer.addFeatures([pointFeature]);
        var text = '<p>You clicked on '+lonlat.lon+
            'E, '+lonlat.lat+'N</p>'
        document.getElementById('responseText').innerHTML = text;
        var data = {
            data: JSON.stringify({
                "lon": lonlat.lon,
                "lat": lonlat.lat
            })
        };
        
        document.getElementById('lon').value = lonlat.lon;
        document.getElementById('lat').value = lonlat.lat;
        
        $.post("http://188.166.179.117/add?source=ajax",
            data,
            function(data, status) {
              alert("Data: "+data+"\nStatus: "+status);
            }
        );
    }
});

function load() {
  map = new OpenLayers.Map('map', {projection: new
      OpenLayers.Projection("EPSG:900913")});

  var osm = new OpenLayers.Layer.OSM("OpenStreetMap");

  pointLayer = new OpenLayers.Layer.Vector("Point Layer");
        	
  map.addLayers([osm, pointLayer]);
  map.zoomToExtent(bounds);
  map.addControl(new OpenLayers.Control.LayerSwitcher());
        
  var click = new OpenLayers.Control.Click();
  map.addControl(click);
  click.activate();
}

