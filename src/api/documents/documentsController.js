const documentsService = require('./documentsService');
const Joi = require('joi');

const validateDocument = (document) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        type: Joi.string().required(),
        url: Joi.string().uri().required(),
        user: Joi.string().required(),
    });
    return schema.validate(document);
};

exports.getDocuments = async (req, res) => {
    try {
        const documents = await documentsService.getDocuments();
        res.json(documents);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération des documents');
    }
};

exports.createDocument = async (req, res) => {
    const { error } = validateDocument(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const document = await documentsService.createDocument(req.body);
        res.status(201).json(document);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la création du document');
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await documentsService.getDocumentById(req.params.id);
        if (!document) return res.status(404).send('Le document demandé n\'a pas été trouvé');
        res.json(document);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération du document');
    }
};

exports.updateDocument = async (req, res) => {
    const { error } = validateDocument(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const document = await documentsService.updateDocument(req.params.id, req.body);
        if (!document) return res.status(404).send('Le document demandé n\'a pas été trouvé');
        res.json(document);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la mise à jour du document');
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const document = await documentsService.deleteDocument(req.params.id);
        if (!document) return res.status(404).send('Le document demandé n\'a pas été trouvé');
        res.send('Le document a été supprimé avec succès');
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la suppression du document');
    }
};