/* ------------------------------------------------------------------------------
*
*  # Mapbox gl map

*  Version: 1.0
*  Latest update: 2018-07-16
*
* ---------------------------------------------------------------------------- */

$(function () {


    $.ajax({
        type: "POST",
        url: '/api/stops/:allStops',
        dataType: 'json',
        //data: {
        //    requete:requeteDyn
        //},
        success: function(data) {
            
        //Extraction des arrêts de la requête SQL
        var geojson = JSON.parse(JSON.stringify(data.rows[0].jsonb_build_object));
        
        //Création de buffers avec turf
        var buffered = turf.buffer(geojson, 300, {units: 'meters'});

        mapboxgl.accessToken = 'pk.eyJ1Ijoid2RvdWNldGsiLCJhIjoiY2pnamprcmpjMGYwbDJ4cW5qa2luYTVmZSJ9.q0GEqGvVpCyvAY09gr4vsA';
        
        var map = new mapboxgl.Map({
            container: 'mapboxgl-container', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [-73.466756, 45.527169], // starting position
            zoom: 11 // starting zoom
        });

        //Création de la carte
        map.on('load', function () {
            //Source de données arrêts
            map.addSource(
                "arrets", {
                    "type": "geojson",
                    "data": geojson
                }
            );
            //Source de données buffers
            map.addSource(
                "buffers", {
                        "type": "geojson",
                        "data": buffered
                    }
            );
            
            //Couche de buffers (la première couche appelée se trouve en dessous)
            map.addLayer(
                {
                "id": "buffers",
                "type": "fill",
                "source": "buffers",
                "paint": {
                    "fill-color": "#b30000",
                    "fill-opacity": 0.1
                    }
                }
            );

            //Couche de points
            map.addLayer(
                {
                "id": "arrets",
                "type": "circle",
                "source": "arrets",
                "paint": {
                        "circle-radius": 4,
                        "circle-color": "#ff0000"
                        }
                }
            );

        });

        //Couches à afficher
        var toggleableLayerIds = [ 'arrets', 'buffers' ];

        for (var i = 0; i < toggleableLayerIds.length; i++) {
            var id = toggleableLayerIds[i];

            var link = document.createElement('a');
            link.href = '#';
            link.className = 'active';
            link.textContent = id;

            link.onclick = function (e) {
                var clickedLayer = this.textContent;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    this.className = '';
                } else {
                    this.className = 'active';
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                }
            };

            var layers = document.getElementById('menu');
            layers.appendChild(link);
        }



        //Gestion des popup
        map.on('click', 'arrets', function(e) {
            let code= e.features[0].properties.code;
            let nom = e.features[0].properties.name;

            new mapboxgl.Popup().setLngLat(map.unproject(e.point))
                .setHTML("Code " + code + "<br/>" + " Arrêt " + nom )
                .addTo(map);
        });

        //Modification du curseur quand il passe par dessus un arrêt
        map.on('mouseenter', 'arrets', function () {
            map.getCanvas().style.cursor = 'pointer';
            //map.off('click', 'arret_selectionne', onClick);
        });
        map.on('mouseleave', 'arrets', function () {
            map.getCanvas().style.cursor = '';
            //map.on('click', 'arret_selectionne', onClick);
        });

        }
    })
})
