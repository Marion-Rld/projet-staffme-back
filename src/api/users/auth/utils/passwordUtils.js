const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const comparePasswords = async (plainPassword, hashedPassword) => {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
};

module.exports = { hashPassword, comparePasswords };