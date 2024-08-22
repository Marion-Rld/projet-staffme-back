const request = require('supertest');
const express = require('express');
const teamsRouter = require('../../src/api/teams/teamRoutes');
const teamsService = require('../../src/api/teams/teamsService');

jest.mock('../../src/api/teams/teamsService');

const app = express();
app.use(express.json());
app.use('/', teamsRouter);

describe('Team Routes', () => {
    describe('GET /api/teams-api/', () => {
        it('should return a welcome message', async () => {
            const res = await request(app).get('/');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: "Bienvenue sur l'API Team !" });
        });
    });

    describe('GET /api/teams-api/teams', () => {
        it('should return a list of teams', async () => {
            const mockTeams = [{ name: 'Team A' }, { name: 'Team B' }];
            teamsService.getTeams.mockResolvedValue(mockTeams);

            const res = await request(app).get('/teams');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockTeams);
        });

        it('should handle errors', async () => {
            teamsService.getTeams.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/teams');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Une erreur est survenue lors de la sélection des equipes' });
        });
    });

    describe('POST /api/teams-api/team', () => {
        it('should create a new team', async () => {
            const newTeam = { name: 'Team C' };
            const createdTeam = { id: '1', ...newTeam };
            teamsService.createTeam.mockResolvedValue(createdTeam);

            const res = await request(app).post('/team').send(newTeam);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(createdTeam);
        });

        it('should return 400 for invalid data', async () => {
            const invalidTeam = { name: 'T' }; // Name too short

            const res = await request(app).post('/team').send(invalidTeam);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });
    });

    describe('GET /api/teams-api/team/:id', () => {
        it('should return a team by ID', async () => {
            const mockTeam = { id: '1', name: 'Team A' };
            teamsService.getTeamById.mockResolvedValue(mockTeam);

            const res = await request(app).get('/team/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockTeam);
        });

        it('should return 404 if team not found', async () => {
            teamsService.getTeamById.mockResolvedValue(null);

            const res = await request(app).get('/team/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "L'équipe demandée n'a pas été trouvée" });
        });
    });

    describe('PATCH /api/teams-api/team/:id', () => {
        it('should update a team', async () => {
            const updatedTeam = { id: '1', name: 'Updated Team' };
            teamsService.updateTeam.mockResolvedValue(updatedTeam);

            const res = await request(app).patch('/team/1').send({ name: 'Updated Team' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(updatedTeam);
        });

        it('should return 404 if team not found', async () => {
            teamsService.updateTeam.mockResolvedValue(null);

            const res = await request(app).patch('/team/999').send({ name: 'Nonexistent Team' });

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "L'équipe demandée n'a pas été trouvée" });
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app).patch('/team/1').send({ name: 'T' }); 

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Les données envoyées sont invalides' });
        });
    });

    describe('DELETE /team/:id', () => {
        it('should delete a team', async () => {
            teamsService.deleteTeam.mockResolvedValue(true);

            const res = await request(app).delete('/team/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: "L'équipe a été supprimée avec succes" });
        });

        it('should return 404 if team not found', async () => {
            teamsService.deleteTeam.mockResolvedValue(null);

            const res = await request(app).delete('/team/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "L'équipe demandée n'a pas été trouvée" });
        });
    });
});