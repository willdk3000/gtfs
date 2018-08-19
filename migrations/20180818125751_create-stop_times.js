
exports.up = function(knex, Promise) {
    return knex.schema.createTable('stop_times', (table) => {
        table.text('trip_id');
        table.text('arrival_time');
        table.text('departure_time');
        table.integer('stop_id');
        table.integer('stop_sequence');
        table.text('stop_headsign');
        table.integer('pickup_type');
        table.integer('drop_off_type');
        table.double('shape_dist_traveled');
        table.integer('timepoint')
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('stop_times');
};