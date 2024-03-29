var mongoose = require('libs/mongoose');
var async = require('async');
var log = require('libs/log')(module);

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(err) {
    //console.log(arguments);
    log.info("ok");
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        {username: 'admin', password: 'admin'},
        {username: 'user1', password: 'user1'},
        {username: 'user2', password: 'user2'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}
