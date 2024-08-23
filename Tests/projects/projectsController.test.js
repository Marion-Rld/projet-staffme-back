const request = require('supertest');
const express = require('express');
const projectsController = require('../../src/api/projects/projectsController');
const projectsService = require('../../src/api/projects/projectsService');
const Joi = require('joi');

jest.mock('../../src/api/projects/projectsService');

const app = express();
app.use(express.json());

app.get('/projects', projectsController.getProjects);
app.post('/projects', projectsController.createProject);
app.get('/projects/:id', projectsController.getProjectById);
app.patch('/projects/:id', projectsController.updateProject);
app.delete('/projects/:id', projectsController.deleteProject);

describe('Projects Controller', () => {
    describe('GET /projects', () => {
        it('should return a list of projects', async () => {
            const mockProjects = [{ name: 'Project A' }, { name: 'Project B' }];
            projectsService.getProjects.mockResolvedValue(mockProjects);

            const res = await request(app).get('/projects');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockProjects);
        });

        it('should return projects by team ID if teamId query param is provided', async () => {
            const mockProjects = [{ name: 'Project A' }];
            projectsService.getProjectsByTeamId.mockResolvedValue(mockProjects);

            const res = await request(app).get('/projects').query({ teamId: 'teamId123' });

            expect(projectsService.getProjectsByTeamId).toHaveBeenCalledWith('teamId123');
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

    describe('POST /projects', () => {
        it('should create a new project', async () => {
            const newProject = { name: 'Project C', description: 'Desc', status: 'Active', startDate: '2023-01-01', endDate: '2023-12-31', budget: 1000, teams: ['team1'] };
            const createdProject = { id: '1', ...newProject };
            projectsService.createProject.mockResolvedValue(createdProject);

            const res = await request(app).post('/projects').send(newProject);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(createdProject);
        });

        it('should return 400 for invalid data', async () => {
            const invalidProject = { name: 'P' }; // Invalid because it's missing required fields

            const res = await request(app).post('/projects').send(invalidProject);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });

        it('should handle errors during creation', async () => {
            const validProject = { name: 'Project C', description: 'Desc', status: 'Active', startDate: '2023-01-01', endDate: '2023-12-31', budget: 1000, teams: ['team1'] };
            projectsService.createProject.mockRejectedValue(new Error('Creation error'));

            const res = await request(app).post('/projects').send(validProject);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la création du projet' });
        });
    });

    describe('GET /projects/:id', () => {
        it('should return a project by ID', async () => {
            const mockProject = { id: '1', name: 'Project A' };
            projectsService.getProjectById.mockResolvedValue(mockProject);

            const res = await request(app).get('/projects/1');

            expect(projectsService.getProjectById).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockProject);
        });

        it('should return 404 if project not found', async () => {
            projectsService.getProjectById.mockResolvedValue(null);

            const res = await request(app).get('/projects/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Le projet demandé n'a pas été trouvé" });
        });

        it('should handle errors during retrieval by ID', async () => {
            projectsService.getProjectById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/projects/1');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la récupération du projet' });
        });
    });

    describe('PATCH /projects/:id', () => {
        it('should update a project', async () => {
            const updatedProject = {
                name: 'Updated Project',
                description: 'Updated Desc',
                status: 'Completed',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                budget: 2000,
                teams: ['team1']
            };
        
            projectsService.updateProject.mockResolvedValue({ id: '1', ...updatedProject });
        
            const res = await request(app)
                .patch('/projects/1')
                .send(updatedProject); 
        
            expect(projectsService.updateProject).toHaveBeenCalledWith('1', updatedProject);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ id: '1', ...updatedProject });
        });
        
        

        it('should return 400 for invalid data', async () => {
            const invalidProject = { name: 'P' }; 
        
            const res = await request(app).patch('/projects/1').send(invalidProject);
        
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });

        it('should return 404 if project not found', async () => {
            // Mock du service pour renvoyer null, simulant un projet non trouvé
            projectsService.updateProject.mockResolvedValue(null);
        
            const res = await request(app)
                .patch('/projects/999')
                .send({
                    name: 'Nonexistent Project',
                    description: 'Desc',
                    status: 'Active',
                    startDate: '2023-01-01',
                    endDate: '2023-12-31',
                    budget: 1000,
                    teams: ['team1']
                });
        
            expect(projectsService.updateProject).toHaveBeenCalledWith('999', expect.any(Object));
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Le projet demandé n'a pas été trouvé" });
        });
        

        it('should handle errors during update', async () => {
            projectsService.updateProject.mockRejectedValue(new Error('Update error'));

            const res = await request(app).patch('/projects/1').send({ name: 'Updated Project' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });
    });

    describe('DELETE /projects/:id', () => {
        it('should delete a project', async () => {
            projectsService.deleteProject.mockResolvedValue(true);

            const res = await request(app).delete('/projects/1');

            expect(projectsService.deleteProject).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Le projet a été supprimé avec succès' });
        });

        it('should return 404 if project not found', async () => {
            projectsService.deleteProject.mockResolvedValue(null);

            const res = await request(app).delete('/projects/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Le projet demandé n'a pas été trouvé" });
        });

        it('should handle errors during deletion', async () => {
            projectsService.deleteProject.mockRejectedValue(new Error('Delete error'));

            const res = await request(app).delete('/projects/1');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la suppression du projet' });
        });
    });
});

