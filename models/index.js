const db = require("../db")
const {Sequelize, DataTypes} = require("sequelize")
const Movie = require("./movie")
const User = require("./user")



  const watched_movies = db.define('watched_movies', 
{
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
                    checkRating(val) {
                        if (val > 5 || val <= 0) {
                            throw new Error("Rating must be between 1 & 5")
                        }
                    }
                }
            }
        

  }, { timestamps: false });



User.belongsToMany(Movie, {through: "watched_movies"})
Movie.belongsToMany(User, {through: "watched_movies"})


async function makeDB () {
await db.sync({force: true})
}

makeDB()