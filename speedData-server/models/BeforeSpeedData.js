const Sequelize = require("sequelize");

class BeforeSpeedData extends Sequelize.Model {
  static initiate(sequelize) {
    BeforeSpeedData.init(
      {
        bspeed_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        bspeed: {
          type: Sequelize.FLOAT,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "BeforeSpeedData",
        tableName: "BeforeSpeedData",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = BeforeSpeedData;
