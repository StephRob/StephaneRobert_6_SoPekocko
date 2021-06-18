// Import des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
// Import du modèle User
const User = require('../models/User');
// Création de regex pour mots de passes pour limiter les injections SQL
const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*^[^=']+$).{8,}$/g);

// On implémente la fonction pour customiser le cryptage de l'email dans la bdd
encryptEmail = (mail) => {
  var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
  var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
  return CryptoJS.AES.encrypt(mail, key, {iv: iv}).toString();
}

// POST: Création d'un nouveau user et sauvegarde dans le BdD
exports.signup = (req, res, next) => {
  // On verifie que le mot de passe respecte la regex
  if (passwordRegex.test(req.body.password)) {
    // On hash le mot de passe 10 fois
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // On crée un nouveau user grâce a son modele
        const user = new User({
          email: encryptEmail(req.body.email),
          password: hash
        });
        // On sauvegarde le user dans la base de donnée
        user.save()
          .then(() => res.status(201).json({
            message: 'Utilisateur créé !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      })
      .catch(error => res.status(500).json({
        error
      }));
  } else {
    return res.status(401).json({
      error: 'Le mot de passe doit contenir au moins 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre et pas de caractère \" = \" ou \" \' \" !'
    });
  }
};

// POST: On cherche les données du user afin de se connecté
exports.login = (req, res, next) => {
  // Recherche d'email existant
  User.findOne({
      email: encryptEmail(req.body.email)
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      // On compare les mot de passe entré au mot de passe crypter dans la BdD
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          res.status(200).json({
            userId: user._id,
            // Encodage d'un nouveau token
            token: jwt.sign({
                userId: user._id
              },
              'RANDOM_TOKEN_SECRET', {
                expiresIn: '24h'
              } // expire au bout de 24h
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};
