const LocalStrategy = require("passport-local").Strategy
const db = require("./db") 
const bcrypt = require ("bcrypt")
const Movie = require("./models/movie")
const User = require("./models/user");


 function initialize(passport, getUserByUserN, getUserById) {

    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUserN(username)
        // console.log(user.username + "<---this!")

        if (user == null) {
            return done(null, false, { message: "No user with that username"})
        }

        try {
            
            if ( await bcrypt.compare(password, user.password)) {
                return done (null, user)
            }else {
                return done (null, false, {message: "Incorrect password"})
            }
        } catch(err) {
            return done(err)

        }
    }

    passport.use(new LocalStrategy({ usernameField: "username"}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
})
}

module.exports = initialize