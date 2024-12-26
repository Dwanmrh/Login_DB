const express = require("express");
const app = express();
require("dotenv").config();
const session = require("express-session");
const expressLayout = require("express-ejs-layouts");
const authRoutes = require("./routes/authRoutes");
const { isAuthenticated } = require("./middlewares/middleware.js");
const db = require("./database/db");

// Konfigurasi port
const port = process.env.PORT || 3001;

// Middleware
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Middleware untuk memberikan informasi user dan path saat ini
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.isLoggedIn = !!req.session.username;
  res.locals.userName = req.session.username || null;
  next();
});

// Built-in Middleware
app.use(express.static("public"));

// Mengatur view engine menjadi EJS
app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);

// Route untuk halaman utama (Movie)
app.get("/", (req, res) => {
    res.render("home", { layout: "layouts/main-layout" }); 
  });

  // Route untuk halaman Login
app.get('/login', (req, res) => {
    res.render('login', { layout: false });
  });
  
  // Route untuk halaman Signup
  app.get('/signup', (req, res) => {
    res.render('signup', { layout: false });
  });
  
  // Route untuk halaman Home
  app.get("/home", isAuthenticated, (req, res) => {
    res.render("home", {
      layout: "layouts/main-layout",
      username: req.session.user ? req.session.user.username : 'User',
    });
  });

  // Penanganan 404 untuk rute yang tidak ditemukan
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
  });
  
  // Memulai server
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}/`);
  });