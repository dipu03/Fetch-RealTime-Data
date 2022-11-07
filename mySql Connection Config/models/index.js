const Sequelize = require("sequelize");
const dbConfig = require("../config/dbConfig.json");
const env = "development";
const dbSetting = dbConfig[env];

const sequelize = new Sequelize(
    dbSetting.database,
    dbSetting.username,
    dbSetting.password,
    dbSetting.dialectInfo
)


try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.commentary = require("./commentary.model")(sequelize, Sequelize);

db.sequelize.sync({
    force: false
}).then((response) => {
    console.log("Commentary table sync");
});

module.exports = db;