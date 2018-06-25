module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name:DataTypes.STRING,
        password:DataTypes.STRING,
        authority:DataTypes.STRING
    }, {
        freezeTableName: true, // Model 对应的表名将与model名相同
        timestamps: false
    });

    return User;
};