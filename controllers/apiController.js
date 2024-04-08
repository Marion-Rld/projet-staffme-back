// apiController.js
const getUser = (req, res) => {
    // Logique pour récupérer un utilisateur (par exemple, à partir d'une base de données)
    const user = { id: 1, name: 'John Doe' };
    res.json(user);
};

// Autres fonctions de contrôle ici...

module.exports = { getUser };
