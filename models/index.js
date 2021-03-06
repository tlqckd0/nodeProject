const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize,Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize,Sequelize);
db.Recommend = require('./recommend')(sequelize,Sequelize);

db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

db.Post.hasMany(db.Recommend);
db.Recommend.belongsTo(db.Post);

module.exports = db;
