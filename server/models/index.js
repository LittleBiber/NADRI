'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// DB 관계설정

const {users, categories, posts} = sequelize.models;

users.belongsToMany( posts, { through: 'comments', foreignKey: 'userId' })
posts.belongsToMany( users, { through: 'comments', foreignKey: 'postId' })

users.belongsToMany( posts, { through: 'user_post_likes', foreignKey: 'userId' })
posts.belongsToMany( users, { through: 'user_post_likes', foreignKey: 'postId' })

posts.belongsTo(categories)
categories.hasMany(posts, { foreignKey: 'categoryId'})

posts.belongsTo(users)
users.hasMany(posts, {foreignKey: 'userId'})

// DB 관계설정 끝

module.exports = db;
