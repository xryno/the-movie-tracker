const db = require("../db") 
const bcrypt = require("bcrypt")
const Movie = require("../models/movie")
const User = require("../models/user")
const {Sequelize, DataTypes} = require("sequelize")

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


Movie.belongsToMany(User, {through: "watched_movies"})
User.belongsToMany(Movie, {through: "watched_movies"})

let queryDB = async (username, password) => {
    try{
        let userLookup = await User.findOne({
            where: {
                username: username,
            },
            include: Movie
        });

        if (userLookup && await bcrypt.compare(password, userLookup.password)) {
            return userLookup.toJSON();
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

let createUser = async (username, firstName, surname, email, password) => {

        // await db.sync({ force: true });
    
    try {
         await User.create({username: username, firstName: firstName, surname: surname, email: email, password, password })

    } catch (error) {
        console.log(error)

    }
}

let addMyMovie = async (mid, usid, rating) => {
    try {
        let movie = await Movie.findOne({
            where: {
                id: mid,
            }
        })
         let user = await User.findOne({
            where: {
                id: usid,
            }
        })

       await user.addMovie(movie, { through: { rating: rating}})
      
    } catch (error) {
        return error
    }
}

let addMovie = async (title, genre, year) => {
    try {
       await Movie.create({title: title, genre: genre, year: year})

       return 
    } catch (error) {
        return error
    }
}

let deleteMovie = async (mid) => {
    try {
        let toDel = await Movie.findOne({
            where: {
                id: mid,
            }
        })
        await toDel.destroy()
        return
    }
    catch (error) {
        return error
    }
}

let deleteMyMovie = async (mid, usid) => {

    try {
        let toDel = await watched_movies.findOne({
            where: {
                userId: usid,
                movieId: mid
            }
        })
        await toDel.destroy()
    }
    catch (error) {
        console.log(error)
    }
}

let showAllMovies = async () => {
    try {
        let all = await Movie.findAll()

        return all
    } catch (error){
        return error
    }
}

let showByGenre = async (genre) => {
    try {
        let all = await Movie.findAll({
            where: {
                genre: genre,
            }
        })

        return all
    } catch (error){
        return error
    }
}

let showMyMovies = async (usid) => {
    try{
        let user = await User.findOne({
            where: {
                id: usid,
            }
        })

        return user.getMovies()
    }
     catch (error){
            return error
        }
}

let getMovie = async (title) => {
    try{
        let movie = await Movie.findOne({
            where: {
                title: title,
            }
        })

        return movie
    }
     catch (error){
            return error
        }
}


let getUser = async (usid) => {
    try{
        let user = await User.findOne({
            where: {
                id: usid,
            }
        })
        return user
    }
     catch (error){
            return error
        }
}

let getUsers = async (usid) => {
    try{
        let user = await User.findAll({
           
        })
        return user
    }
     catch (error){
            return error
        }
}

module.exports = { queryDB, createUser, getUser, getUsers,  addMyMovie, deleteMovie, getMovie, showAllMovies, addMovie, showByGenre, deleteMyMovie, showMyMovies, };