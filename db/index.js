const { Sequelize } = require("sequelize")

const db = new Sequelize({
    dialect: "sqlite",
    storage: "/Users/crdy/Repos/the-movie-tracker/db/data.sqlite"
})

module.exports = db