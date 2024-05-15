const documentsService = require('./documentsService');

exports.getDocuments = async (req, res) => {
    try {
        const documents = await documentsService.getDocuments();
        res.json(documents);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createDocument = async (req, res) => {
    try {
        const document = await documentsService.createDocument(req.body);
        res.status(201).json(document);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await documentsService.getDocumentById(req.params.id);
        if (!document) return res.status(404).send('No document found');
        res.json(document);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const document = await documentsService.updateDocument(req.params.id, req.body);
        if (!document) return res.status(404).send('No document found');
        res.json(document);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const document = await documentsService.deleteDocument(req.params.id);
        if (!document) return res.status(404).send('No document found');
        res.send('Document deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
