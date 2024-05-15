const Document = require('./DocumentModel');
const crudService = require('../common/crud/crudService');

exports.getDocuments = async () => {
    return await crudService.getAll(Document, 'user');
};

exports.createDocument = async (documentData) => {
    return await crudService.create(Document, documentData);
};

exports.getDocumentById = async (id) => {
    return await crudService.getById(Document, id, 'user');
};

exports.updateDocument = async (id, documentData) => {
    return await crudService.updateById(Document, id, documentData);
};

exports.deleteDocument = async (id) => {
    return await crudService.deleteById(Document, id);
};
