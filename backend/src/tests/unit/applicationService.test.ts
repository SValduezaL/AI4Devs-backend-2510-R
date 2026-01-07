// Mock de Prisma Client ANTES de importar el servicio
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockUpdate = jest.fn();
const mockFindUniquePosition = jest.fn();
const mockFindUniqueStep = jest.fn();

const mockPrisma = {
    application: {
        findMany: mockFindMany,
        findFirst: mockFindFirst,
        update: mockUpdate,
    },
    position: {
        findUnique: mockFindUniquePosition,
    },
    interviewStep: {
        findUnique: mockFindUniqueStep,
    },
};

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrisma),
}));

// Importar el servicio DESPUÉS del mock
import { getCandidatesByPosition } from '../../application/services/applicationService';

describe('applicationService - getCandidatesByPosition', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return empty array when position has no applications', async () => {
        // Arrange
        mockFindMany.mockResolvedValue([]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result).toEqual([]);
        expect(mockFindMany).toHaveBeenCalledWith({
            where: { positionId: 1 },
            include: {
                candidate: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                interviewStep: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                interviews: {
                    select: {
                        score: true,
                    },
                },
            },
        });
    });

    it('should return candidates with full name concatenated correctly', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0].fullName).toBe('Juan Pérez');
        expect(result[0].candidateId).toBe(1);
    });

    it('should return current interview step with id and name', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result[0].currentInterviewStep.id).toBe(2);
        expect(result[0].currentInterviewStep.name).toBe('Entrevista Técnica');
    });

    it('should calculate average score correctly from interviews with scores', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [
                { score: 8 },
                { score: 7 },
                { score: 9 },
            ],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result[0].averageScore).toBe(8); // (8 + 7 + 9) / 3 = 8
    });

    it('should return null average score when no interviews exist', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result[0].averageScore).toBeNull();
    });

    it('should return null average score when all interviews have null score', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [
                { score: null },
                { score: null },
            ],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result[0].averageScore).toBeNull();
    });

    it('should filter out interviews with null scores when calculating average', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [
                { score: 8 },
                { score: null },
                { score: 7 },
            ],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result[0].averageScore).toBe(7.5); // (8 + 7) / 2 = 7.5
    });

    it('should handle multiple applications for same position', async () => {
        // Arrange
        const mockApplications = [
            {
                id: 1,
                candidateId: 1,
                candidate: {
                    id: 1,
                    firstName: 'Juan',
                    lastName: 'Pérez',
                },
                interviewStep: {
                    id: 2,
                    name: 'Entrevista Técnica',
                },
                interviews: [{ score: 8 }],
            },
            {
                id: 2,
                candidateId: 2,
                candidate: {
                    id: 2,
                    firstName: 'María',
                    lastName: 'García',
                },
                interviewStep: {
                    id: 3,
                    name: 'Entrevista Final',
                },
                interviews: [{ score: 9 }],
            },
            {
                id: 3,
                candidateId: 3,
                candidate: {
                    id: 3,
                    firstName: 'Pedro',
                    lastName: 'López',
                },
                interviewStep: {
                    id: 2,
                    name: 'Entrevista Técnica',
                },
                interviews: [],
            },
        ];
        mockFindMany.mockResolvedValue(mockApplications);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result).toHaveLength(3);
        expect(result[0].fullName).toBe('Juan Pérez');
        expect(result[1].fullName).toBe('María García');
        expect(result[2].fullName).toBe('Pedro López');
        expect(result[0].applicationId).toBe(1);
        expect(result[1].applicationId).toBe(2);
        expect(result[2].applicationId).toBe(3);
    });

    it('should include applicationId in response', async () => {
        // Arrange
        const mockApplication = {
            id: 123,
            candidateId: 1,
            candidate: {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
            },
            interviewStep: {
                id: 2,
                name: 'Entrevista Técnica',
            },
            interviews: [],
        };
        mockFindMany.mockResolvedValue([mockApplication]);

        // Act
        const result = await getCandidatesByPosition(1);

        // Assert
        expect(result[0].applicationId).toBe(123);
    });

    it('should handle Prisma errors gracefully', async () => {
        // Arrange
        const prismaError = new Error('Database connection error');
        mockFindMany.mockRejectedValue(prismaError);

        // Act & Assert
        await expect(getCandidatesByPosition(1)).rejects.toThrow('Database connection error');
    });
});

describe('applicationService - updateCandidateStage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update currentInterviewStep when all validations pass', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
            currentInterviewStep: 1,
        };
        const mockPosition = {
            id: 1,
            interviewFlowId: 10,
        };
        const mockStep = {
            id: 2,
            interviewFlowId: 10,
        };
        const updatedApplication = {
            ...mockApplication,
            currentInterviewStep: 2,
            candidate: { id: 1, firstName: 'Juan', lastName: 'Pérez' },
            interviewStep: { id: 2, name: 'Entrevista Técnica' },
            position: mockPosition,
        };

        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(mockPosition);
        mockFindUniqueStep.mockResolvedValue(mockStep);
        mockUpdate.mockResolvedValue(updatedApplication);

        // Act
        const result = await updateCandidateStage(1, 1, 2);

        // Assert
        expect(result.currentInterviewStep).toBe(2);
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { currentInterviewStep: 2 },
            include: {
                candidate: true,
                interviewStep: true,
                position: true,
            },
        });
    });

    it('should throw error when application does not exist', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        mockFindFirst.mockResolvedValue(null);

        // Act & Assert
        await expect(updateCandidateStage(1, 1, 2)).rejects.toThrow('Application not found');
    });

    it('should throw error when position does not exist', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
        };
        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(null);

        // Act & Assert
        await expect(updateCandidateStage(1, 1, 2)).rejects.toThrow('Position not found');
    });

    it('should throw error when interview step does not exist', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
        };
        const mockPosition = {
            id: 1,
            interviewFlowId: 10,
        };
        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(mockPosition);
        mockFindUniqueStep.mockResolvedValue(null);

        // Act & Assert
        await expect(updateCandidateStage(1, 1, 2)).rejects.toThrow('Interview step not found');
    });

    it('should throw error when step belongs to different interview flow', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
        };
        const mockPosition = {
            id: 1,
            interviewFlowId: 10,
        };
        const mockStep = {
            id: 2,
            interviewFlowId: 20, // Diferente flujo
        };
        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(mockPosition);
        mockFindUniqueStep.mockResolvedValue(mockStep);

        // Act & Assert
        await expect(updateCandidateStage(1, 1, 2)).rejects.toThrow(
            'Invalid interview step for this position'
        );
    });

    it('should find application by candidateId and positionId', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
        };
        const mockPosition = {
            id: 1,
            interviewFlowId: 10,
        };
        const mockStep = {
            id: 2,
            interviewFlowId: 10,
        };
        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(mockPosition);
        mockFindUniqueStep.mockResolvedValue(mockStep);
        mockUpdate.mockResolvedValue({ ...mockApplication, currentInterviewStep: 2 });

        // Act
        await updateCandidateStage(1, 1, 2);

        // Assert
        expect(mockFindFirst).toHaveBeenCalledWith({
            where: {
                candidateId: 1,
                positionId: 1,
            },
        });
    });

    it('should return updated application with all relations', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
        };
        const mockPosition = {
            id: 1,
            interviewFlowId: 10,
        };
        const mockStep = {
            id: 2,
            interviewFlowId: 10,
        };
        const updatedApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
            currentInterviewStep: 2,
            candidate: { id: 1, firstName: 'Juan', lastName: 'Pérez' },
            interviewStep: { id: 2, name: 'Entrevista Técnica' },
            position: mockPosition,
        };
        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(mockPosition);
        mockFindUniqueStep.mockResolvedValue(mockStep);
        mockUpdate.mockResolvedValue(updatedApplication);

        // Act
        const result = await updateCandidateStage(1, 1, 2);

        // Assert
        expect(result.candidate).toBeDefined();
        expect(result.interviewStep).toBeDefined();
        expect(result.position).toBeDefined();
    });

    it('should handle Prisma update errors gracefully', async () => {
        // Arrange
        const applicationService = require('../../application/services/applicationService');
        const { updateCandidateStage } = applicationService;
        const mockApplication = {
            id: 1,
            candidateId: 1,
            positionId: 1,
        };
        const mockPosition = {
            id: 1,
            interviewFlowId: 10,
        };
        const mockStep = {
            id: 2,
            interviewFlowId: 10,
        };
        const prismaError = new Error('Prisma update error');
        mockFindFirst.mockResolvedValue(mockApplication);
        mockFindUniquePosition.mockResolvedValue(mockPosition);
        mockFindUniqueStep.mockResolvedValue(mockStep);
        mockUpdate.mockRejectedValue(prismaError);

        // Act & Assert
        await expect(updateCandidateStage(1, 1, 2)).rejects.toThrow('Prisma update error');
    });
});

