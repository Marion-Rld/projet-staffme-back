const request = require('supertest');
const express = require('express');
const teamsController = require('../../src/api/teams/teamsController');
const teamsService = require('../../src/api/teams/teamsService');

jest.mock('../../src/api/teams/teamsService');

const app = express();
app.use(express.json());

app.get('/teams', teamsController.getTeams);
app.post('/teams', teamsController.createTeam);
app.get('/teams/:id', teamsController.getTeamById);
app.put('/teams/:id', teamsController.updateTeam);
app.delete('/teams/:id', teamsController.deleteTeam);

describe('Teams Controller', () => {
    describe('GET /teams', () => {
        it('should return a list of teams', async () => {
            const mockTeams = [{ name: 'Team A' }, { name: 'Team B' }];
            teamsService.getTeams.mockResolvedValue(mockTeams);

            const res = await request(app).get('/teams');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockTeams);
            expect(teamsService.getTeams).toHaveBeenCalled();
        });

        it('should handle errors gracefully', async () => {
            teamsService.getTeams.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/teams');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la sélection des equipes' });
        });
    });

    describe('POST /teams', () => {
        it('should create a new team', async () => {
            const newTeam = { name: 'Team C' };
            teamsService.createTeam.mockResolvedValue(newTeam);

            const res = await request(app).post('/teams').send(newTeam);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(newTeam);
            expect(teamsService.createTeam).toHaveBeenCalledWith(newTeam);
        });

        it('should return 400 if the request data is invalid', async () => {
            const invalidTeam = { name: 'A' }; 

            const res = await request(app).post('/teams').send(invalidTeam);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });

        it('should handle errors during creation', async () => {
            const newTeam = { name: 'Team D' };
            teamsService.createTeam.mockRejectedValue(new Error('Creation error'));

            const res = await request(app).post('/teams').send(newTeam);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la création de l\'équipe' });
        });
    });

    describe('GET /teams/:id', () => {
        it('should return a team by ID', async () => {
            const mockTeam = { name: 'Team A' };
            teamsService.getTeamById.mockResolvedValue(mockTeam);

            const res = await request(app).get('/teams/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockTeam);
            expect(teamsService.getTeamById).toHaveBeenCalledWith('1');
        });

        it('should return 404 if the team is not found', async () => {
            teamsService.getTeamById.mockResolvedValue(null);

            const res = await request(app).get('/teams/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'L\'équipe demandée n\'a pas été trouvée' });
        });

        it('should handle errors gracefully', async () => {
            teamsService.getTeamById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/teams/1');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la sélection de l\'équipe' });
        });
    });

    describe('PUT /teams/:id', () => {
        it('should update a team', async () => {
            const updatedTeam = { name: 'Updated Team' };
            teamsService.updateTeam.mockResolvedValue(updatedTeam);

            const res = await request(app).put('/teams/1').send(updatedTeam);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(updatedTeam);
            expect(teamsService.updateTeam).toHaveBeenCalledWith('1', updatedTeam);
        });

        it('should return 400 if the request data is invalid', async () => {
            const invalidTeam = { name: 'A' };

            const res = await request(app).put('/teams/1').send(invalidTeam);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });

        it('should return 404 if the team to update is not found', async () => {
            teamsService.updateTeam.mockResolvedValue(null);

            const res = await request(app).put('/teams/999').send({ name: 'Nonexistent Team' });

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'L\'équipe demandée n\'a pas été trouvée' });
        });

        it('should handle errors during update', async () => {
            teamsService.updateTeam.mockRejectedValue(new Error('Update error'));

            const res = await request(app).put('/teams/1').send({ name: 'Updated Team' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la mise à jour de l\'équipe' });
        });
    });

    describe('DELETE /teams/:id', () => {
        it('should delete a team', async () => {
            teamsService.deleteTeam.mockResolvedValue(true);

            const res = await request(app).delete('/teams/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'L\'équipe a été supprimée avec succes' });
            expect(teamsService.deleteTeam).toHaveBeenCalledWith('1'); 
        });

        it('should return 404 if the team to delete is not found', async () => {
            teamsService.deleteTeam.mockResolvedValue(null);

            const res = await request(app).delete('/teams/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'L\'équipe demandée n\'a pas été trouvée' });
        });

        it('should handle errors during deletion', async () => {
            teamsService.deleteTeam.mockRejectedValue(new Error('Deletion error'));

            const res = await request(app).delete('/teams/1');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la suppression de l\'équipe' });
        });
    });
});