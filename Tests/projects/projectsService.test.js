const projectsService = require('../../src/api/projects/projectsService');
const Project = require('../../src/api/projects/ProjectModel');
const crudService = require('../../src/api/common/crud/crudService');

jest.mock('../../src/api/projects/ProjectModel');
jest.mock('../../src/api/common/crud/crudService');

describe('Projects Service', () => {
    describe('getProjects', () => {
        it('should return all projects with associated teams', async () => {
            const mockProjects = [{ name: 'Project A' }, { name: 'Project B' }];
            crudService.getAll.mockResolvedValue(mockProjects);

            const projects = await projectsService.getProjects();

            expect(crudService.getAll).toHaveBeenCalledWith(Project, 'teams');
            expect(projects).toEqual(mockProjects);
        });
    });

    describe('getProjectsByTeamId', () => {
        it('should return projects by team ID', async () => {
            const mockProjects = [{ name: 'Project A' }];
            Project.find.mockResolvedValue(mockProjects);

            const projects = await projectsService.getProjectsByTeamId('teamId123');

            expect(Project.find).toHaveBeenCalledWith({ teams: 'teamId123' });
            expect(projects).toEqual(mockProjects);
        });

        it('should throw an error if fetching projects fails', async () => {
            Project.find.mockRejectedValue(new Error('Database error'));

            await expect(projectsService.getProjectsByTeamId('teamId123')).rejects.toThrow(
                'Erreur lors de la récupération des projets pour l\'équipe spécifiée'
            );
        });
    });

    describe('createProject', () => {
        it('should create a new project', async () => {
            const newProject = { name: 'Project C' };
            const createdProject = { id: '1', ...newProject };
            crudService.create.mockResolvedValue(createdProject);

            const project = await projectsService.createProject(newProject);

            expect(crudService.create).toHaveBeenCalledWith(Project, newProject);
            expect(project).toEqual(createdProject);
        });
    });

    describe('getProjectById', () => {
        it('should return a project by ID with associated teams', async () => {
            const mockProject = { id: '1', name: 'Project A' };
            crudService.getById.mockResolvedValue(mockProject);

            const project = await projectsService.getProjectById('1');

            expect(crudService.getById).toHaveBeenCalledWith(Project, '1', 'teams');
            expect(project).toEqual(mockProject);
        });
    });

    describe('updateProject', () => {
        it('should update a project by ID', async () => {
            const updatedProject = { id: '1', name: 'Updated Project' };
            crudService.updateById.mockResolvedValue(updatedProject);

            const project = await projectsService.updateProject('1', { name: 'Updated Project' });

            expect(crudService.updateById).toHaveBeenCalledWith(Project, '1', { name: 'Updated Project' });
            expect(project).toEqual(updatedProject);
        });
    });

    describe('deleteProject', () => {
        it('should delete a project by ID', async () => {
            crudService.deleteById.mockResolvedValue(true);

            const result = await projectsService.deleteProject('1');

            expect(crudService.deleteById).toHaveBeenCalledWith(Project, '1');
            expect(result).toBe(true);
        });
    });
});