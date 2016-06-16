function createMap(data) {

//instantiate map; 

  var map = L.map('map');
  //calling maps from leaflet-providers.js
  var layer = L.tileLayer.provider('MichiMap');
  //below is my "test" provider value
  //Esri.NatGeoWorldMap

  //hard code the URL ...
  //var layer = L.tileLayer('https://api.mapbox.com/styles/v1/mdalmau/ciphprhz9002ecvnfofftwkcp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWRhbG1hdSIsImEiOiJjaWpwdDV5aW0wMWR4dW9seDZxOTRkZTdqIn0.BIFhbOoGg96voOW6PYsa5Q');

   map.addLayer(layer)

//coordinate sets the focus and the number, zoom level
  map.setView([0,0], 3)

  var markers = [];

  _.each(data.features, function(feature) {
    //testing output
    //console.log(feature);

    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    var marker = L.circleMarker([lat, lon],{
      className: 'toponym',
      offset: Number(feature.properties.offset),
    });

    marker.bindPopup(feature.properties.toponym);
    markers.push(marker);

//turns off so that the layers toggle works instead of adding all to the map for starters

    //map.addLayer(marker);

  });

// instantiating slider

  //uses loaddash.js

  // auto calculating max offset
  var input = $('#slider input');

  var max = _.last(data.features).properties.offset;

  // adding max attribute to input
  input.attr('max', max);
  input.on('input', function(){

    var offset = Number(input.val());

    //console.log(input.val());
    //console.log(typeof offset);

    _.each(markers, function(marker){

        if (marker.options.offset < offset) {
          map.addLayer(marker);
        }

        else {
          map.removeLayer(marker);
        }

      //console.log(marker);

    });

  });

  //debugging commands for developer tools; check console ...
  //console.log(max);
  //console.log(data);

//this clears all markers when map is loaded
//if we comment this out all markers load and then go away ...
  input.trigger('input');

  //marker clusters

  var clusters = L.markerClusterGroup();

  _.each(markers, function(marker){
      clusters.addLayer(marker);

  });

  //map.addLayer(clusters);

  //console.log(clusters);

  //heat map

  var points = _.map(data.features, function(feature){
    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    return[lat, lon, 1];
  });

  var heat = L.heatLayer(points, {
    minOpacity: 0.3
  });

  //map.addLayer(heat);

  // layers toggle

  var layers = L.control.layers({
    'Points': L.layerGroup(markers),
    'Clusters': clusters,
    'Heat Map': heat,
  })

.addTo(map);

}

// on page start
$(function() {
  $.getJSON('aroundtheworld_verne.geojson', function(data) {
      //testing output
      //console.log(data);
      createMap(data);
  });
});
