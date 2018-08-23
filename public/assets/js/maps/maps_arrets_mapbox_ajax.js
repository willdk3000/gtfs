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
    
        var geojson = JSON.parse(JSON.stringify(data.rows[0].jsonb_build_object));
        
        mapboxgl.accessToken = 'pk.eyJ1Ijoid2RvdWNldGsiLCJhIjoiY2pnamprcmpjMGYwbDJ4cW5qa2luYTVmZSJ9.q0GEqGvVpCyvAY09gr4vsA';
        
        var map = new mapboxgl.Map({
            container: 'mapboxgl-container', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [-73.466756, 45.527169], // starting position
            zoom: 11 // starting zoom
        });

        //Création de la carte
        map.on('load', function () {
            //Source de données
            map.addSource("arrets", {
                    "type": "geojson",
                    "data": geojson
            });
            //Couche de points
            map.addLayer({
                "id": "arrets",
                "type": "circle",
                "source": "arrets",
                "paint": {
                        "circle-radius": 4,
                        "circle-color": "#ff0000"
                }
            });
        });

        //Gestion des popup
        map.on('click', 'arrets', function(e) {
            let code= e.features[0].properties.code;
            let nom = e.features[0].properties.name;
            var feature = e.features[0];
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
