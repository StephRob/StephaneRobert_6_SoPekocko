// Import des packages
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
const mongoose = require('mongoose');

// Création du modele Sauce avec la methode Schema de mongoose
const sauceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3,'3 caractères minimum'],
    maxLength: [20, '20 caractères maximum'],
  },
  manufacturer: {
    type: String,
    required: true,
    minLength: [3,'3 caractères minimum'],
    maxLength: [20, '20 caractères maximum'],
  },
  description: {
    type: String,
    required: true,
    minLength: [3,'3 caractères minimum'],
    maxLength: [120, '120 caractères maximum'],
  },
  heat: { type: Number, required: true },
  likes: { type: Number},
  dislikes: { type: Number},
  imageUrl: { type: String, required: true },
  mainPepper: {
    type: String,
    required: true,
    minLength: [3,'3 caractères minimum'],
    maxLength: [20, '20 caractères maximum'],
  },
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]},
  userId: { type: String, required: true },
});

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
// Evite les attaques XSS
sauceSchema.plugin(sanitizerPlugin);

// Export du schema en tant que modèle
module.exports = mongoose.model('Sauce', sauceSchema);
