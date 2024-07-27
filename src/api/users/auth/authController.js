const authService = require('./authService');
const crypto = require('crypto');
const SibApiV3Sdk = require('@sendinblue/client');
const User = require('../UserModel');
const { hashPassword } = require('./utils/passwordUtils');

exports.signup = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send('Une erreur est survenue lors de la création de l\'utilisateur');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(400).send('Identifiants invalides');
  }
};

exports.validateToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
};

exports.isAdmin = (req, res) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
};

exports.isSuperAdmin = (req, res) => {
  if (req.user && req.user.role === 'superadmin') {
    res.json({ isSuperAdmin: true });
  } else {
    res.json({ isSuperAdmin: false });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Configuration de Brevo/Sendinblue
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: user.email }];
    sendSmtpEmail.sender = { email: 'rollando.marion@gmail.com', name: 'Support Staffme' };
    sendSmtpEmail.subject = 'Réinitialisation de votre mot de passe';
    sendSmtpEmail.textContent = `Vous recevez cet email car vous avez demandé la réinitialisation du mot de passe de votre compte.\n\n
                                 Veuillez cliquer sur le lien suivant ou le coller dans votre navigateur pour terminer le processus :\n\n
                                <p><a href="http://${req.headers.host}/api/auth-api/reset-password/${resetToken}" target="_blank">Réinitialiser mon mot de passe</a></p>
                                 Si vous n'avez pas demandé cela, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ message: 'Un email de réinitialisation a été envoyé' });
  } catch (error) {
    console.error('Erreur dans forgotPassword:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
  }
};

exports.getResetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré.' });
    }

    return res.redirect(`http://localhost:4200/reset-password/${token}`);
  } catch (error) {
    console.error('Erreur dans getResetPassword:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la vérification du token.' });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Trouver l'utilisateur avec le token valide
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré.' });
    }

    const hashedPassword = await hashPassword(newPassword); 

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Votre mot de passe a été réinitialisé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
  }
};