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
        data: {
            service_id:'SE'
        },
        dataType: 'json',
        success:    
            function( json ) {
                $.each(json.rows, function(i, value) {
                    $('#Lignes').append($('<option>').text(value.route_id).attr('value', value.route_id));
                });
            }
    }); 


    //***------------------------------Génération de la carte------------------------------***
     mapboxgl.accessToken = 'pk.eyJ1Ijoid2RvdWNldGsiLCJhIjoiY2pnamprcmpjMGYwbDJ4cW5qa2luYTVmZSJ9.q0GEqGvVpCyvAY09gr4vsA';
                    
    var map = new mapboxgl.Map({
        container: 'mapboxgl-container', // container id
         style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
         center: [-73.466756, 45.527169], // starting position
         zoom: 11 // starting zoom
    });

    //Ajout des boutons de contrôle dans le coin supérieur droit
    map.addControl(new mapboxgl.NavigationControl());

    //Ajout de la fonction mapbox gl draw (dessin de ligne pour calcul d'intersection avec les shapes du réseau)
    var draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            line_string: true,
        }
    });
    map.addControl(draw);

    //Ajout des sources de données pour la génération des couches
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

    //***------------------------------Fonctions associées à la sélection de ligne------------------------------***
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
            ligne:ligneValue,
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
                data: {
                    trace:traceValue
                },
                
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
                    trace:traceValue
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
                    let departs = JSON.parse(e.features[0].properties.departs);

                    //création de la table qui contient les heures de passage
                    var $tableBody = $('<table></table>');
                    departs.forEach(function(e){
                        var $row = $('<tr></tr>');
                        $row.append($('<td></td>').text(e));
                        $tableBody.append($row);
                    })
                                                            
                    //var feature = e.features[0];
                    new mapboxgl.Popup().setLngLat(map.unproject(e.point))
                        .setHTML("Arrêt " + num + "<br/>" + nom + "<br/>" + $tableBody[0].outerHTML )
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

    //***------------------------------Module intersect------------------------------***
    
    //Popup contenant le tableau des lignes intersectant la ligne dessinée pour l'analyse de corridor
    let intersectPopup = new mapboxgl.Popup(
        {closeOnClick: false}
    );


    //intersectPopup.on('close', () => {
    //    draw.deleteAll();
    //});

    map.on('draw.create', () => {
        
        let pt_tableau = draw.getAll().features[0].geometry;
        let ligne_intersect = JSON.stringify(draw.getAll().features[0].geometry);
        console.log(ligne_intersect)

        $.ajax({
            type: "POST",
            url: '/api/traces/:intersects',
            dataType: 'json',
            data: {
                intersect:ligne_intersect
            },
            
            success: function(data) {
                draw.deleteAll();
                
                let departs_intersect = data.rows;

                //création de la table qui contient les heures de passage
                var $tableBody = $('<table></table>');

                var $row = $('<tr></tr>');
                $row.append($('<th></th>').text('Ligne'));
                $row.append($('<th></th>').text('Direction'));
                $row.append($('<th></th>').text('MA'));
                $row.append($('<th></th>').text('AM'));
                $row.append($('<th></th>').text('HP'));
                $row.append($('<th></th>').text('PM'));
                $row.append($('<th></th>').text('SO'));
                $tableBody.append($row);

                departs_intersect.forEach(function(e){
                    var $row = $('<tr></tr>');
                    $row.append($('<td></td>').text(e.route_id));
                    $row.append($('<td></td>').text(e.direction_id));
                    $row.append($('<td></td>').text(e.ma));
                    $row.append($('<td></td>').text(e.am));
                    $row.append($('<td></td>').text(e.hp));
                    $row.append($('<td></td>').text(e.pm));
                    $row.append($('<td></td>').text(e.so));
                    $tableBody.append($row);
                })
                
                new mapboxgl.Popup()
                    .setLngLat((pt_tableau.coordinates[1]))
                    .setHTML($tableBody[0].outerHTML)
                    .addTo(map);

            }
        })
    })

})

