const request = require('supertest');
const express = require('express');
const router  = require('../../src/api/projects/projectRoutes');
const projectsService = require('../../src/api/projects/projectsService');

jest.mock('../../src/api/projects/projectsService');


const app = express();
app.use(express.json());
app.use('/', router);

describe('Projects API Routes', () => {
    describe('GET /api/projects-api/', () => {
        it('should return a welcome message', async () => {
            const res = await request(app).get('/');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Bienvenue sur l\'API Project !' });
        });
    });

    describe('GET /api/projects-api/projects', () => {
        it('should return a list of projects', async () => {
            const mockProjects = [{ name: 'Project A' }, { name: 'Project B' }];
            projectsService.getProjects.mockResolvedValue(mockProjects);

            const res = await request(app).get('/projects');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockProjects);
        });

        it('should handle errors', async () => {
            projectsService.getProjects.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/projects');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la récupération des projets' });
        });
    });

    describe('POST /api/projects-api/project', () => {
        it('should create a new project', async () => {
            const newProject = { name: 'Project C', description: 'Desc', status: 'Active', startDate: '2023-01-01', endDate: '2023-12-31', budget: 1000, teams: ['team1'] };
            const createdProject = { id: '1', ...newProject };
            projectsService.createProject.mockResolvedValue(createdProject);

            const res = await request(app).post('/project').send(newProject);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(createdProject);
        });

        it('should return 400 for invalid data', async () => {
            const invalidProject = { name: 'P' }; 

            const res = await request(app).post('/project').send(invalidProject);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });
    });

    describe('GET /api/projects-api/project/:id', () => {
        it('should return a project by ID', async () => {
            const mockProject = { id: '1', name: 'Project A' };
            projectsService.getProjectById.mockResolvedValue(mockProject);

            const res = await request(app).get('/project/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockProject);
        });

        it('should return 404 if project not found', async () => {
            projectsService.getProjectById.mockResolvedValue(null);

            const res = await request(app).get('/project/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Le projet demandé n'a pas été trouvé" });
        });
    });

    describe('PATCH /api/projects-api/project/:id', () => {
        it('should update a project', async () => {
            const updatedProject = { id: '1', name: 'Updated Project', description: 'Updated Desc', status: 'Completed', startDate: '2023-01-01', endDate: '2023-12-31', budget: 2000, teams: ['team1'] };
            projectsService.updateProject.mockResolvedValue(updatedProject);

            const res = await request(app).patch('/project/1').send({ name: 'Updated Project', description: 'Updated Desc', status: 'Completed', startDate: '2023-01-01', endDate: '2023-12-31', budget: 2000, teams: ['team1'] });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(updatedProject);
        });

        it('should return 404 if project not found', async () => {
            projectsService.updateProject.mockResolvedValue(null);
    
            const validData = {
                name: 'Nonexistent Project',
                description: 'Desc',
                status: 'Active',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                budget: 1000,
                teams: ['team1']
            };
    
            const res = await request(app).patch('/project/999').send(validData);
    
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'Le projet demandé n\'a pas été trouvé' });
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app).patch('/project/1').send({ name: 'P' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });
    });

    describe('DELETE /api/projects-api/project/:id', () => {
        it('should delete a project', async () => {
            projectsService.deleteProject.mockResolvedValue(true);

            const res = await request(app).delete('/project/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Le projet a été supprimé avec succès' });
        });

        it('should return 404 if project not found', async () => {
            projectsService.deleteProject.mockResolvedValue(null);

            const res = await request(app).delete('/project/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Le projet demandé n'a pas été trouvé" });
        });
    });
});