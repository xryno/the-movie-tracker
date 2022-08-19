const express = require("express")
const routerUsers = express.Router()
const {check, validationResult} = require("express-validator")

const { getUser, getUsers} = require("../src/dbQueries")

    routerUsers.get("/:id", async (req, res) => {

    try {
    let user = await getUser (req.params.id)
    res.send(user)
    return
    } catch {
        res.redirect("/register")
    }
    })
    
    routerUsers.get("/", async (req, res) => {
    
    try {
    let users = await getUsers ()
    res.send(users)
    return
    } catch {
        res.redirect("/register")
    }
    })

module.exports = routerUsers
