const Sequelize = require("sequelize");

class Stop extends Sequelize.Model {
  static initiate(sequelize) {
    Stop.init(
      {
        stop_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        stop: {
          type: Sequelize.FLOAT,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Stop",
        tableName: "Stop",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = Stop;
