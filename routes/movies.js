const express = require("express")
const routerMovies = express.Router()
const {check, validationResult} = require("express-validator")

const {getMovie, showAllMovies, addMovie, deleteMovie, showByGenre} = require("../src/dbQueries")


routerMovies.get("/", async (req, res) => {
  let data = await showAllMovies();
  res.send(data);
});

routerMovies.get("/:genre", async (req, res) => {
  let data = await showByGenre(req.params.genre);
  res.send(data);
});

routerMovies.get("/t/:title", async (req, res) => {
  let data = await getMovie(req.params.title);
  res.send(data);
});

routerMovies.post("/", [check("title",).trim().not().isEmpty(),check("genre",).trim().not().isEmpty(),check("year",).trim().not().isEmpty()], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({error: errors.array()})
    }

        const { title, genre, year } = req.body;
        try {
            await addMovie(title, genre, year);
            res.redirect("/");
            return;
        } catch {
            res.redirect("/");
        }
        });

routerMovies.delete("/:id", async (req, res) => {

    await deleteMovie(req.params.id);
    res.redirect("/");

});

module.exports = routerMovies
