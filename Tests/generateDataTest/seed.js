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
    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Skill.deleteMany({});
    await SkillLevel.deleteMany({});
    await Project.deleteMany({});
    await Document.deleteMany({});

    // Create skills
    const skills = await Skill.insertMany([
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'Project Management' },
      { name: 'Design' }
    ]);

    // Create skill levels
    const skillLevels = await SkillLevel.insertMany([
      { name: 'Beginner' },
      { name: 'Intermediate' },
      { name: 'Advanced' },
      { name: 'Expert' }
    ]);

    // Create users with hashed passwords
    const users = await User.insertMany([
      {
        password: await passwordUtils.hashPassword("password123"),
        role: "admin",
        lastName: "Doe",
        firstName: "John",
        email: "john.doe@example.com",
        phoneNumber: "123-456-7890",
        job: "Software Engineer",
        gender: "male",
        postalAddress: "123 Main St, Anytown, USA",
        skills: [
          { skill_id: skills[0]._id, level_id: skillLevels[2]._id },
          { skill_id: skills[1]._id, level_id: skillLevels[1]._id }
        ],
        teams: [],
        documents: []
      },
      {
        password: await passwordUtils.hashPassword("securepass456"),
        role: "user",
        lastName: "Smith",
        firstName: "Jane",
        email: "jane.smith@example.com",
        phoneNumber: "987-654-3210",
        job: "Project Manager",
        gender: "female",
        postalAddress: "456 Elm St, Othertown, USA",
        skills: [
          { skill_id: skills[3]._id, level_id: skillLevels[3]._id },
          { skill_id: skills[4]._id, level_id: skillLevels[0]._id }
        ],
        teams: [],
        documents: []
      },
      {
        password: await passwordUtils.hashPassword("mypassword789"),
        role: "user",
        lastName: "Brown",
        firstName: "Alice",
        email: "alice.brown@example.com",
        phoneNumber: "555-123-4567",
        job: "Designer",
        gender: "female",
        postalAddress: "789 Maple Ave, Villagetown, USA",
        skills: [
          { skill_id: skills[4]._id, level_id: skillLevels[3]._id }
        ],
        teams: [],
        documents: []
      }
    ]);

    // Create documents
    const documents = await Document.insertMany([
      {
        name: "Resume",
        type: "pdf",
        url: "http://example.com/resume.pdf",
        user: users[0]._id
      },
      {
        name: "Project Plan",
        type: "docx",
        url: "http://example.com/project_plan.docx",
        user: users[1]._id
      },
      {
        name: "Design Mockup",
        type: "png",
        url: "http://example.com/design_mockup.png",
        user: users[2]._id
      }
    ]);

    // Link documents to users
    users[0].documents.push(documents[0]._id);
    users[1].documents.push(documents[1]._id);
    users[2].documents.push(documents[2]._id);
    await users[0].save();
    await users[1].save();
    await users[2].save();

    // Create teams
    const teams = await Team.insertMany([
      { name: 'Development Team', users: [users[0]._id, users[1]._id], projects: [] },
      { name: 'Design Team', users: [users[2]._id], projects: [] }
    ]);

    // Create projects
    const projects = await Project.insertMany([
      {
        name: 'Project Alpha',
        description: 'A software development project',
        status: 'Ongoing',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        budget: 100000,
        teams: [teams[0]._id]
      },
      {
        name: 'Project Beta',
        description: 'A design project',
        status: 'Planned',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-05-31'),
        budget: 50000,
        teams: [teams[1]._id]
      }
    ]);

    // Link projects to teams
    teams[0].projects.push(projects[0]._id);
    teams[1].projects.push(projects[1]._id);
    await teams[0].save();
    await teams[1].save();

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seedDatabase();