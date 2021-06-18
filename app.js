// Import des packages
const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const path = require('path');

// Import les routers
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Création de l'application express
const app = express()

require('dotenv').config()

// Connexion à la base de données
mongoose.connect(process.env.DB_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajout des headers sur l'objet reponse pour autoriser la communication entre le serveurs
// Gestion CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Protection des cookies de session et attaques XSS
app.use(cookieSession({
  name: 'session',
  maxAge: 3600000,
  secret: process.env.SESSION,
  secure: true,
  httpOnly: true,
  domain: 'http://localhost:3000',
}));

app.use(express.json());
// Utilisation du middleware Helmet protéger les cookies
app.use(helmet());

// Gestionnaire de routage pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// On associe les routes aux routers correspondant
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export de l'application express
module.exports = app;