module.exports = (sequelize, Sequelize) =>  {
    const Commentary = sequelize.define("commentary", {
        id : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        comment : {
            type : Sequelize.STRING
        }
    })
    return Commentary;
};