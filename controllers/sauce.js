// Import du modèle Sauce
const Sauce = require('../models/Sauce');
const fs = require('fs'); // file system

// POST: Création d'un nouvelle sauce et sauvegarde dans le BdD
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // On retire le champ Id avant de copier l'objet
  delete sauceObject._id;
  // On crée une nouvelle sauce grâce a son modele
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  // On sauvegarde la sauce dans la base de donnée
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// PUT: On modifie les informations d'une sauce grâce a la methode updateOne
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE: On supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// GET: On récupère une sauce en cherchant son Id grace a la methode findOne()
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// GET: On récupère la liste des sauces grâce a la methode find()
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// POST: On gère le likes et dislikes
exports.likeDislikeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 1: // On incremente de 1 les likes
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
        .then(() => res.status(200).json({ message: 'Objet liké !' }))
        .catch(error => res.status(404).json({ error }));
      break;
    case -1: // On increment de 1 les dislikes
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
        .then(() => res.status(200).json({ message: 'Objet disliké !' }))
        .catch(error => res.status(404).json({ error }));
      break;
    case 0: // On supprime le like ou dislike
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: 'Like supprimé !' }))
              .catch(error => res.status(404).json({ error }));
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: 'Dislike supprimé !' }))
              .catch(error => res.status(404).json({ error }));
          }
        })
        .catch(error => res.status(400).json({ error }));
      break;
  }
};
