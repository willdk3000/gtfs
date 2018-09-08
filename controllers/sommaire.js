const knex = require('../config/knex')

module.exports = {

    requete(req, res){

        switch(req.params.action) {

            case ':dates':
            return knex.raw(
                `SELECT
                    DISTINCT start_date,
                    end_date
                FROM calendar`) 
            .then(result => {
                res.json(result)
            });
            break;
        
            
            case ':voyages':
            return knex.raw(
                `SELECT
                    service_id,
                    COUNT(trip_id)
                FROM trips
                GROUP BY service_id`) 
            .then(result => {
                res.json(result)
            })
            break;


            case ':heures':
            return knex.raw(
                `WITH tablevoy AS(
                    SELECT
                        stop_times.trip_id,
                        MIN(stop_times.hresecondes) AS hremin,
                        MAX(stop_times.hresecondes) AS hremax,
                        trips.service_id
                    FROM stop_times
                    LEFT JOIN trips ON trips.trip_id = stop_times.trip_id
                    GROUP BY trips.service_id, stop_times.trip_id
                    )
                    SELECT
                        tablevoy.service_id,
                        SUM(tablevoy.hremax)-SUM(tablevoy.hremin) AS hreservice
                    FROM tablevoy
                    GROUP BY service_id`) 
            .then(result => {
                res.json(result)
            })
            break;


            case ':dist':
            return knex.raw(
                `WITH tabledist AS(
                    SELECT
                        stop_times.trip_id,
                        MAX(stop_times.shape_dist_traveled) AS distmax,
                        trips.service_id
                    FROM stop_times
                    LEFT JOIN trips ON trips.trip_id = stop_times.trip_id
                    GROUP BY trips.service_id, stop_times.trip_id
                    )
                    SELECT
                        tabledist.service_id,
                        SUM(tabledist.distmax) AS distservice
                    FROM tabledist
                    GROUP BY service_id`) 
            .then(result => {
                res.json(result)
            })
            break;
        
        }
    },


}