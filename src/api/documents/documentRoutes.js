const express = require('express');
const router = express.Router();
const documentsController = require('./documentsController');

// Route pour la racine de l'API (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Document !' });
});

router.get('/documents', documentsController.getDocuments);
router.post('/document', documentsController.createDocument);
router.get('/document/:id', documentsController.getDocumentById);
router.patch('/document/:id', documentsController.updateDocument);
router.delete('/document/:id', documentsController.deleteDocument);

module.exports = router;
