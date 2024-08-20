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

    const skillNames = ['JavaScript', 'Python', 'Java', 'Project Management', 'Design', 'C++', 'Ruby', 'PHP', 'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Swift', 'Kotlin', 'SQL', 'NoSQL', 'AWS', 'Docker'];
    const skills = await Skill.insertMany(skillNames.map(name => ({ name })));

    const skillLevelNames = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const skillLevels = await SkillLevel.insertMany(skillLevelNames.map(name => ({ name })));

    const userRoles = ['admin', 'user'];
    const genders = ['male', 'female'];
    const users = [];

    for (let i = 0; i < 20; i++) {
      const randomSkills = [
        { skill_id: skills[Math.floor(Math.random() * skills.length)]._id, level_id: skillLevels[Math.floor(Math.random() * skillLevels.length)]._id }
      ];
      users.push({
        password: await passwordUtils.hashPassword(`password${i + 1}`),
        role: userRoles[Math.floor(Math.random() * userRoles.length)],
        lastName: `LastName${i + 1}`,
        firstName: `FirstName${i + 1}`,
        email: `user${i + 1}@example.com`,
        phoneNumber: `123-456-78${String(i).padStart(2, '0')}`,
        job: `Job${i + 1}`,
        gender: genders[Math.floor(Math.random() * genders.length)],
        postalAddress: `${i + 1} Example St, Anytown, USA`,
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
        url: `http://example.com/document${i + 1}.${documentTypes[Math.floor(Math.random() * documentTypes.length)]}`,
        user: createdUsers[i]._id
      });
    }
    const createdDocuments = await Document.insertMany(documents);

    for (let i = 0; i < 20; i++) {
      createdUsers[i].documents.push(createdDocuments[i]._id);
      await createdUsers[i].save();
    }

    const teamNames = ['Development Team', 'Design Team', 'Marketing Team', 'Sales Team', 'Support Team'];
    const teams = [];

    for (let i = 0; i < 5; i++) {
      teams.push({
        name: teamNames[i],
        users: createdUsers.slice(i * 4, (i + 1) * 4).map(user => user._id),
      });
    }
    const createdTeams = await Team.insertMany(teams);

    const projectNames = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon'];
    const projects = [];

    for (let i = 0; i < 5; i++) {
      projects.push({
        name: projectNames[i],
        description: `Description for ${projectNames[i]}`,
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

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seedDatabase();