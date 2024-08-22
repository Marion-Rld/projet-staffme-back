const mongoose = require('mongoose');
const User = require('../../src/api/users/UserModel');
const Team = require('../../src/api/teams/TeamModel');
const Skill = require('../../src/api/skills/SkillModel');
const SkillLevel = require('../../src/api/skill-levels/SkillLevelModel');
const Project = require('../../src/api/projects/ProjectModel');
const Document = require('../../src/api/documents/DocumentModel');
const passwordUtils = require('../../src/api/users/auth/utils/passwordUtils');
require('dotenv').config({ path: './.env' });

const dbUrl = process.env.DATABASE_URL;

mongoose.connect(dbUrl);

async function seedDatabase() {
  try {
    await User.deleteMany({});
    await Team.deleteMany({});
    await Skill.deleteMany({});
    await SkillLevel.deleteMany({});
    await Project.deleteMany({});
    await Document.deleteMany({});

    const skillNames = [
      'JavaScript', 'Python', 'Java', 'Gestion de projet', 'Design',
      'C++', 'Ruby', 'PHP', 'HTML', 'CSS', 'React', 'Angular',
      'Vue', 'Node.js', 'Swift', 'Kotlin', 'SQL', 'NoSQL', 'AWS', 'Docker'
    ];
    const skills = await Skill.insertMany(skillNames.map(name => ({ name })));

    const skillLevelNames = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
    const skillLevels = await SkillLevel.insertMany(skillLevelNames.map(name => ({ name })));

    const userRoles = ['admin', 'user'];
    const genders = ['homme', 'femme'];
    const users = [];

    const firstNames = ['Pierre', 'Marie', 'Luc', 'Sophie', 'Jean', 'Isabelle', 'Michel', 'Nathalie', 'Alain', 'Caroline'];
    const lastNames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Leroy', 'Moreau', 'Simon'];

    const jobs = [
      'Développeur Web', 'Designer UX/UI', 'Chef de Projet', 'Ingénieur DevOps', 'Responsable Marketing',
      'Spécialiste en SEO', 'Consultant IT', 'Analyste Business', 'Responsable des Ventes', 'Support Technique'
    ];

    for (let i = 0; i < 20; i++) {
      const randomSkills = [
        { skill_id: skills[Math.floor(Math.random() * skills.length)]._id, level_id: skillLevels[Math.floor(Math.random() * skillLevels.length)]._id }
      ];
      users.push({
        password: await passwordUtils.hashPassword(`motdepasse${i + 1}`),
        role: userRoles[Math.floor(Math.random() * userRoles.length)],
        lastName: lastNames[i % lastNames.length],
        firstName: firstNames[i % firstNames.length],
        email: `utilisateur${i + 1}@exemple.com`,
        phoneNumber: `01234567${String(i).padStart(2, '0')}`,
        job: jobs[i % jobs.length],
        gender: genders[Math.floor(Math.random() * genders.length)],
        postalAddress: `${i + 1} Rue Exemple, Ville ${i + 1}, France`,
        skills: randomSkills,
        documents: []
      });
    }
    const createdUsers = await User.insertMany(users);

    const documentTypes = ['pdf', 'docx', 'png'];
    const documents = [];

    for (let i = 0; i < 20; i++) {
      documents.push({
        name: `Document${i + 1}`,
        type: documentTypes[Math.floor(Math.random() * documentTypes.length)],
        url: `http://exemple.com/document${i + 1}.${documentTypes[Math.floor(Math.random() * documentTypes.length)]}`,
        user: createdUsers[i]._id
      });
    }
    const createdDocuments = await Document.insertMany(documents);

    for (let i = 0; i < 20; i++) {
      createdUsers[i].documents.push(createdDocuments[i]._id);
      await createdUsers[i].save();
    }

    const teamNames = ['Équipe Développement', 'Équipe Design', 'Équipe Marketing', 'Équipe Ventes', 'Équipe Support'];
    const teams = [];

    for (let i = 0; i < 5; i++) {
      teams.push({
        name: teamNames[i],
        users: createdUsers.slice(i * 4, (i + 1) * 4).map(user => user._id),
      });
    }
    const createdTeams = await Team.insertMany(teams);

    const projectNames = [
      'Refonte du site web corporate',
      'Développement de l’application mobile e-commerce',
      'Campagne marketing pour le lancement de produit',
      'Optimisation du processus de vente',
      'Mise en place d’un système de support client'
    ];

    const projectDescriptions = [
      'Ce projet vise à moderniser et améliorer le site web corporate afin d\'optimiser l\'expérience utilisateur et d\'augmenter les conversions.',
      'Développement d\'une application mobile e-commerce pour permettre aux utilisateurs d\'acheter nos produits directement depuis leur smartphone.',
      'Lancement d\'une nouvelle campagne marketing pour promouvoir notre dernier produit sur plusieurs canaux, y compris les réseaux sociaux et les médias en ligne.',
      'Analyse et révision des processus actuels de vente pour identifier les inefficacités et mettre en place des solutions pour améliorer la performance commerciale.',
      'Implémentation d\'un nouveau système de support client pour améliorer la satisfaction des clients et réduire les temps de réponse.'
    ];

    const projects = [];

    for (let i = 0; i < 5; i++) {
      projects.push({
        name: projectNames[i],
        description: projectDescriptions[i],
        status: i % 2 === 0 ? 'in progress' : (i % 3 === 0 ? 'completed' : 'planned'),
        startDate: new Date(`2023-0${i + 1}-01`),
        endDate: new Date(`2024-0${i + 1}-01`),
        budget: (i + 1) * 20000,
        teams: [createdTeams[i]._id]
      });
    }
    const createdProjects = await Project.insertMany(projects);

    for (let i = 0; i < 5; i++) {
      createdTeams[i].projects = [createdProjects[i]._id];
      await createdTeams[i].save();
    }

    console.log('Données semées avec succès');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seedDatabase();
