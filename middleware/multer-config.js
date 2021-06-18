// Import des packages
const multer = require('multer');

// création du dictionnaire d'extension de fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On la fonction qui permet d'indiquer la destination des fichiers entrants
const storage = multer.diskStorage({
  // Enregistrement des fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // On renome le nom du fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export du middleware multer
module.exports = multer({ storage: storage }).single('image');
