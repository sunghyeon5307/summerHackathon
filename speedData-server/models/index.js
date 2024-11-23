const Sequelize = require("sequelize");
const SpeedData = require("./SpeedData");
const BeforeSpeedData = require("./BeforeSpeedData");
const Whyrano = require("./whyrano");
const before = require("./beforeDate");
const Stop = require("./Stop");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    timezone: "+09:00",
    port: config.port,
  }
);

db.sequelize = sequelize;

db.SpeedData = SpeedData;
db.BeforeSpeedData = BeforeSpeedData;
db.Whyrano = Whyrano;
db.before = before;
db.Stop = Stop;

SpeedData.initiate(sequelize);
BeforeSpeedData.initiate(sequelize);
Whyrano.initiate(sequelize);
before.initiate(sequelize);
Stop.initiate(sequelize);

SpeedData.associate(db);
BeforeSpeedData.associate(db);
Whyrano.associate(db);
before.associate(db);
Stop.associate(db);

module.exports = db;
