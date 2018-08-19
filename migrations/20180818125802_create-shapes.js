
exports.up = function(knex, Promise) {
    return knex.schema.createTable('shapes', (table) => {
        table.text('shape_id');
        table.double('shape_pt_lat');
        table.double('shape_pt_lon');
        table.integer('shape_pt_sequence');
        table.double('shape_dist_traveled');

    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('shapes');
};
