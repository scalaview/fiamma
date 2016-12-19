'use strict';
module.exports = function(sequelize, DataTypes) {
  var Commands = sequelize.define('Commands', {
    namespace: DataTypes.STRING,
    funName: {
      type: DataTypes.STRING
    },
    argsCode: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defauleValue: 0
    },
    resultCode: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Commands.STATUS = {
    "初始化": 0,
    "正在运行": 1,
    "运行成功": 2,
    "运行失败": 3,
  }

  return Commands;
};