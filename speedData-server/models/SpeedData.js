const Sequelize = require("sequelize");

class SpeedData extends Sequelize.Model {
  static initiate(sequelize) {
    SpeedData.init(
      {
        speed_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        speed: {
          type: Sequelize.FLOAT,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "SpeedData",
        tableName: "speed_data",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = SpeedData;
