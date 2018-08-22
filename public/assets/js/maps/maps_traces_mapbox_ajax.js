/* ------------------------------------------------------------------------------
*
*  # Mapbox gl map

*  Version: 1.0
*  Latest update: 2018-07-16
*
* ---------------------------------------------------------------------------- */

$(document).ready(function () { 

    //toutes les lignes dans le dropdown
    $.ajax({
        url:'/api/traces/:getRoutes',
        type:'POST',
        //data: {
        //    requete:test
        //},
        dataType: 'json',
        success:    
            function( json ) {
                $.each(json.rows, function(i, value) {
                    $('#Lignes').append($('<option>').text(value.route_id).attr('value', value.route_id));
                });
            }
    }); 


    //génération de la carte   
     mapboxgl.accessToken = 'pk.eyJ1Ijoid2RvdWNldGsiLCJhIjoiY2pnamprcmpjMGYwbDJ4cW5qa2luYTVmZSJ9.q0GEqGvVpCyvAY09gr4vsA';
                    
    var map = new mapboxgl.Map({
        container: 'mapboxgl-container', // container id
         style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
         center: [-73.466756, 45.527169], // starting position
         zoom: 11 // starting zoom
    });

    //Ajout des boutons de contrôle dans le coin supérieur droit
    map.addControl(new mapboxgl.NavigationControl());

    var emptyGeoJSON = {"type": "FeatureCollection", "features": []}

    map.on('load', function () {
        map.addSource(
            "traces", {
                "type": "geojson",
                "data": emptyGeoJSON
            });
        map.addSource(
            "arrets", {
                "type": "geojson",
                "data": emptyGeoJSON
            });
    })

    document.getElementById("filtreLigne").addEventListener("click", function() {

    //identifier la ligne choisie dans la boite de sélection
    var ligneValue = document.getElementById("Lignes").value;


    map.getSource("arrets").setData(emptyGeoJSON);

    $('#Trace').children('option:not(:first)').remove();

    //tous les tracés dans le dropdown
    $.ajax({
        url:'/api/traces/:getTraces',
        type:'POST',
        data: {
            requete:ligneValue
        },
        dataType: 'json',
        success:    
            function( json ) {
                $.each(json.rows, function(i, value) {
                    $('#Trace').append($('<option>').text(value.shape_id).attr('value', value.shape_id));
                });
            }
    }); 

    
    //charger les données sur la carte
        $.ajax({
            type: "POST",
            url: '/api/traces/:showRoutes',
            dataType: 'json',
            data: {
                requete:ligneValue
            },
            
            success: function(data) {
        
            //var geojson = JSON.parse(JSON.stringify(data.jsonb_build_object));
            //var geojson = JSON.stringify(data.jsonb_build_object);
            var geojson = JSON.parse(JSON.stringify(data.rows[0].jsonb_build_object));
            
            //map.on('load', function () {
                //Source de données
                map.getSource("traces").setData(geojson);
                    
                //Couche de lignes
                map.addLayer({
                    "id": "traces",
                    "type": "line",
                    "source": "traces",
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round",
                        "visibility":"visible"
                    },
                    "paint": {
                            "line-width": 3,
                            "line-color": "#ff0000"
                    }
                });
            }
        })

        //afficher le bon shape
        document.getElementById("filtreTrace").addEventListener("click", function() {

            let traceValue = document.getElementById("Trace").value.toString();
            //let ligneValue = document.getElementById("Lignes").value;
            
            //console.log(requeteTrace)
            $.ajax({
                type: "POST",
                url: '/api/traces/:showTrace',
                dataType: 'json',
                data: {requete:traceValue},
                
                success: function(data) {
                
                var geojson = JSON.parse(JSON.stringify(data.rows[0].jsonb_build_object));
                //var geojson = JSON.stringify(data.jsonb_build_object);
                //var geojson = JSON.parse(JSON.stringify(data[0].jsonb_build_object));
                
                //map.on('load', function () {
                    //Source de données
                    map.getSource("traces").setData(geojson);
                    
                    //Couche de lignes
                    map.addLayer({
                        "id": "traces",
                        "type": "line",
                        "source": "traces",
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round",
                            "visibility":"visible"
                        },
                        "paint": {
                                "line-width": 3,
                                "line-color": "#ff0000"
                        }
                    });
                }

            });

            //afficher les arrêts et les heures de passages
            $.ajax({
                type: "POST",
                url: '/api/stops/:filtreStops',
                dataType: 'json',
                data: {
                    requete:traceValue
                },
                
                success: function(data) {
                
                var geojson_arrets = JSON.parse(JSON.stringify(data.rows[0].jsonb_build_object));
                //var geojson = JSON.stringify(data.jsonb_build_object);
                //var geojson = JSON.parse(JSON.stringify(data[0].jsonb_build_object));
                
                //map.on('load', function () {
                    //Source de données
                    map.getSource("arrets").setData(geojson_arrets);
                    
                    //Couche de lignes
                    map.addLayer({
                        "id": "arrets",
                        "type": "circle",
                        "source": "arrets",
                        "paint": {
                                "circle-radius": 4,
                                "circle-color": "#ff0000"
                        }
                    });
                
                //Gestion des popup
                map.on('click', 'arrets', function(e) {
                    let num= e.features[0].properties.code;
                    let nom = e.features[0].properties.name;
                    let departs = JSON.parse(JSON.stringify(e.features[0].properties.departs));
                    var feature = e.features[0];
                    new mapboxgl.Popup().setLngLat(map.unproject(e.point))
                        .setHTML("Arrêt " + num + "<br/>" + nom + "<br/>" + departs )
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

    })
})

    