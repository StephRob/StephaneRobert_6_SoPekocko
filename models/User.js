// Import des packages
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du modele User avec la methode Schema de mongoose
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// On ajoute uniqueValidator comme plugin au schema
userSchema.plugin(uniqueValidator);

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
// Evite les attaques XSS
userSchema.plugin(sanitizerPlugin);

// Export du schema en tant que modèle
module.exports = mongoose.model('User', userSchema);