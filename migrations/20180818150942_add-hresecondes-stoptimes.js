
exports.up = function(knex, Promise) {
    return knex.raw(
        `ALTER TABLE public.stop_times ADD COLUMN hresecondes INTEGER;`
    );
};

exports.down = function(knex, Promise) {
    return knex.raw(
        `ALTER TABLE public.stop_times DROP COLUMN hresecondes;`
    );
};
