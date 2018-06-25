const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const config = require('../config/db_config');
let db_user       = {};
//创建一个sequelize对象实例,连接数据库
let sequelize = new Sequelize(config.database, config.username, config.password,{
    host: config.host,
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db_user[model.name] = model;
    });

db_user.sequelize = sequelize;
db_user.Sequelize = Sequelize;

module.exports = db_user;