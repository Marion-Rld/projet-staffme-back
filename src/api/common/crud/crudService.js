exports.getAll = async (Model, populate = '') => {
    return await Model.find().populate(populate);
};

exports.getById = async (Model, id, populate = '') => {
    return await Model.findById(id).populate(populate);
};

exports.create = async (Model, data) => {
    const item = new Model(data);
    await item.save();
    return item;
};

exports.updateById = async (Model, id, data) => {
    return await Model.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteById = async (Model, id) => {
    return await Model.findByIdAndDelete(id);
};