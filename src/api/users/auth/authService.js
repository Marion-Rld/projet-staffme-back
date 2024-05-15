const UserModel = require('../UserModel');
const { hashPassword, comparePasswords } = require('./utils/passwordUtils');
const { generateAuthToken } = require('./authMiddleware');

const createUser = async (userData) => {
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await UserModel.create({...userData, password: hashedPassword});
    return newUser;
};

const loginUser = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
        throw new Error('Invalid email or password.');
    }

    const token = generateAuthToken(user);
    return { user, token };
};

module.exports = { createUser, loginUser };