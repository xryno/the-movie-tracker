if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const db = require("./db");
const Movie = require("./models/movie");
const User = require("./models/user");
const { queryDB, createUser, addMyMovie, deleteMyMovie, showMyMovies } = require("./src/dbQueries");

const routerMovies = require("./routes/movies");
const routerUsers = require("./routes/users");

const initializePassport = require("./passport-cfg");

async function username(username) {
  //get user by username ot pass to initializePassport fnc

  let val = await User.findOne({ where: { username: username } });
  if (val === null) {
    return null;
  } else {
    let res = val.toJSON();
    if (res.username === username) {
      return res;
    }
  }
}

async function id(id) {
  //get user by id ot pass to initializePassport fnc
  let val = await User.findOne({ where: { id: id } });
  if (val === null) {
    return false;
  }
  let res = val.toJSON();
  if (res.id === id) {
    return res;
  }
}

initializePassport(passport, username, id);

app.use(flash()); //displaying messages, use ejs
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs"); //so can render pages in ejs
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/movies", routerMovies);
app.use("/users", routerUsers);

app.get("/", checkAuthd, async (req, res) => {
  let test = { name: await req.user };
  let firstn = await test.name.firstName;
  let usern = await test.name.username;
  let userid = await test.name.id;

  res.render("index.ejs", { name: firstn, uname: usern, userid: userid });
});

app.get("/register", checkNotAuthd, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthd, async (req, res) => {
  const { username, firstName, surname, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await createUser(username, firstName, surname, email, hashedPassword);
    res.redirect("/login");
    return;
  } catch {
    res.redirect("/register");
  }
});

app.get("/login", checkNotAuthd, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthd,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/myMovies", checkAuthd, async (req, res) => {
  console.log(req.query.usid);
  let data = await showMyMovies(req.query.usid);
  res.send(data);
});

app.put("/myMovies", checkAuthd, async (req, res) => {
  const { mid, usid, rating } = req.body;
  try {
    await addMyMovie(mid, usid, rating);
    res.redirect("/");
    return;
  } catch {
    res.redirect("/");
  }
});

app.delete("/myMovies", checkAuthd, async (req, res) => {
  const { mid, usid } = req.query;
  try {
    await deleteMyMovie(mid, usid);
    res.redirect("/");
    return;
  } catch {
    res.redirect("/");
  }
});

function checkAuthd(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthd(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.delete("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}.`);
});
