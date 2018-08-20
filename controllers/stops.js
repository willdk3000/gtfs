const knex = require('../config/knex')

module.exports = {

    requete(req, res){

        switch(req.params.action) {

            case ':allStops':
            return knex.raw(
                `SELECT jsonb_build_object(
                    'type', 'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM (
                    SELECT jsonb_build_object(
                        'type', 'Feature',
                        'id', stop_id,
                        'geometry', ST_AsGeoJSON(Point_geog)::jsonb,
                        'properties', jsonb_build_object(
                                'code', stop_code,
                                'name', stop_name)
                        ) AS feature 
                    FROM (SELECT * FROM "stops") inputs) features;`) 
            .then(result => {
                res.json(result)
            });
            break;
        
            
            case ':filtreStops':
            return knex.raw(
                `SELECT jsonb_build_object(
                    'type', 'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM (
                    SELECT jsonb_build_object(
                        'type', 'Feature',
                        'id', stop_id,
                        'geometry', ST_AsGeoJSON(point_geog)::jsonb,
                        'properties', jsonb_build_object(
                        'code', stop_code,
                        'name', stop_name)
                    ) AS feature 
                FROM (SELECT * FROM stop_traces WHERE shape_id ='${req.body.requete}') inputs) features;`) 
            .then(result => {
                res.json(result)
            })
            break;
        
        }
    },


}