const teamsService = require('../../src/api/teams/teamsService');
const crudService = require('../../src/api/common/crud/crudService');
const Team = require('../../src/api/teams/TeamModel');

jest.mock('../../src/api/common/crud/crudService');

describe('Teams Service', () => {
    describe('getTeams', () => {
        it('should return all teams with associated users and projects', async () => {
            const mockTeams = [{ name: 'Team A' }, { name: 'Team B' }];
            crudService.getAll.mockResolvedValue(mockTeams);

            const teams = await teamsService.getTeams();

            expect(teams).toEqual(mockTeams);
            expect(crudService.getAll).toHaveBeenCalledWith(Team, 'users projects');
        });
    });

    describe('createTeam', () => {
        it('should create a new team', async () => {
            const mockTeamData = { name: 'Team C' };
            const mockCreatedTeam = { id: '1', ...mockTeamData };
            crudService.create.mockResolvedValue(mockCreatedTeam);

            const team = await teamsService.createTeam(mockTeamData);

            expect(team).toEqual(mockCreatedTeam);
            expect(crudService.create).toHaveBeenCalledWith(Team, mockTeamData);
        });
    });

    describe('getTeamById', () => {
        it('should return a team by ID with associated users and projects', async () => {
            const mockTeam = { id: '1', name: 'Team A' };
            crudService.getById.mockResolvedValue(mockTeam);

            const team = await teamsService.getTeamById('1');

            expect(team).toEqual(mockTeam);
            expect(crudService.getById).toHaveBeenCalledWith(Team, '1', 'users projects');
        });
    });

    describe('updateTeam', () => {
        it('should update a team by ID', async () => {
            const mockUpdatedTeam = { id: '1', name: 'Updated Team' };
            crudService.updateById.mockResolvedValue(mockUpdatedTeam);

            const team = await teamsService.updateTeam('1', { name: 'Updated Team' });

            expect(team).toEqual(mockUpdatedTeam);
            expect(crudService.updateById).toHaveBeenCalledWith(Team, '1', { name: 'Updated Team' });
        });
    });

    describe('deleteTeam', () => {
        it('should delete a team by ID', async () => {
            crudService.deleteById.mockResolvedValue(true);

            const result = await teamsService.deleteTeam('1');

            expect(result).toBe(true);
            expect(crudService.deleteById).toHaveBeenCalledWith(Team, '1');
        });
    });
});
