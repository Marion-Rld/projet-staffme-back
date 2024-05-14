const Document = require('../models/Document');

exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().populate('user');
        res.json(documents);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createDocument = async (req, res) => {
    try {
        const document = new Document(req.body);
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id).populate('user');
        if (!document) {
            return res.status(404).send('No document found');
        }
        res.json(document);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!document) {
            return res.status(404).send('No document found');
        }
        res.json(document);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).send('No document found');
        }
        res.send('Document deleted');
    } catch (error) {
        res.status(500).send(error);
    }
};
