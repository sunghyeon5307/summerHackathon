    const Sequelize = require("sequelize");

    class beforeDate extends Sequelize.Model {
    static initiate(sequelize) {
        beforeDate.init(
        {
            before_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            },
            createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "beforeDate",
            tableName: "beforeDate",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        }
        );
    }

    static associate(db) {}
    }

    module.exports = beforeDate;