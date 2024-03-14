// dataset for all earthquakes in a month
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
// Center point is my house location
var myMap = L.map("map", {
    center: [ 38.70,  -121.17 ],
    zoom: 6,
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Import and visualize the earthquake data on the map
d3.json(url).then(function (data) {
    function myRange(feature) {
        return {
            fillOpacity: 1,
            fillColor: myColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: myRadius(feature.properties.mag),
            weight: 0.5,
            stroke: true,
        };
    }
    function myColor(depth) {
        if (depth < 10 && depth >= -10 ) {
            return "#b6d7a8";
        } else if (depth < 30 && depth >=10) {
            return "#6aa84f";
        } else if (depth < 50 && depth >=30) {
            return "#ffd966";
        } else if (depth < 70 && depth >=50) {
            return "#f1c232";
        } else if (depth < 90 && depth >=70) {
            return "#e06666";
        } else return "#990000";
        
    }
    function myRadius(mag) {
        if (mag === 0) {
            return mag;
        } else if (mag > 1) {
            return mag * 5;
        } else if (mag > 3) {
            return mag * 6;
        } else if (mag > 4) {
            return mag * 7;
        } else if (mag > 5) {
            return mag * 8;
        } else if (mag > 6) {
            return mag * 9;
        } else if (mag > 7) {
            return mag * 10;
        } else if (mag > 8) {
            return mag * 11;
        }
        return mag * 12;
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: myRange,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>Magnitude: </b>" + feature.properties.mag +
             "<br><b>Location: </b> " + feature.properties.place + "<br><b>Depth: </b>" + 
             feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    // Create legend that will provide context for your map data.
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        var depthRanges = [-10, 10, 30, 50, 70,90];
        labels = [];
        div.innerHTML += "<h3 style='text-align: center'><b>Depth</b></h3>"
        for (var i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + myColor(depthRanges[i] + 1) +
                 '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;'
                 + depthRanges[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});
