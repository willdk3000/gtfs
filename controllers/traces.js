const knex = require('../config/knex')

module.exports = {

    list(req, res) {
        return knex('routes')
        .then(routes => res.status(200).send(routes))
      },

    requete(req, res) {
        switch(req.params.action) {

            case ':getRoutes':
            return knex.raw(
                'SELECT DISTINCT route_id FROM "routes" ORDER BY route_id', 
            )
            .then(result => {
                res.json(result)
            })
            break;
      
            case ':showRoutes':
            return knex.raw(
                `SELECT jsonb_build_object(
                    'type',     'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM (
                  SELECT jsonb_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(routes)::jsonb,
                    'properties', jsonb_build_object(
                                'ID', shape_id,
                                'ligne', route_id,
                                'direction', direction_id)        
                  ) AS feature
                 
                  FROM (SELECT * FROM traces WHERE route_id = ${req.body.requete}) inputs) features;`,   
            ).then(result => {
                res.json(result)
            });
            break;
      
            case ':getTraces':
            return knex.raw(
                `SELECT DISTINCT shape_id FROM "trips" WHERE route_id=${req.body.requete} ORDER BY shape_id`, 
            )
            .then(result => {
                res.json(result)
            });
            break;
      
            case ':showTrace':
            return knex.raw(
                `SELECT jsonb_build_object(
                    'type',     'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM (
                  SELECT jsonb_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(routes)::jsonb,
                    'properties', jsonb_build_object(
                                'ID', shape_id,
                                'ligne', route_id,
                                'direction', direction_id)        
                  ) AS feature
                 
                  FROM (SELECT * FROM traces WHERE shape_id='${req.body.requete}') inputs) features;`,   
            ).then(result => {
                res.json(result)
            });
            break;

        }
    }
}