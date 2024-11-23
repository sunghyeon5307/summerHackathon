const Sequelize = require("sequelize");

class Whyrano extends Sequelize.Model {
  static initiate(sequelize) {
    Whyrano.init(
      {
        whyrano_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        whyrano: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Whyrano",
        tableName: "Whyrano",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = Whyrano;
