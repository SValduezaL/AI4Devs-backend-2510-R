import { Request, Response } from 'express';
import { updateCandidateStageController } from '../../presentation/controllers/candidateController';
import * as applicationService from '../../application/services/applicationService';

// Mock del servicio
jest.mock('../../application/services/applicationService');
const mockUpdateCandidateStage = applicationService.updateCandidateStage as jest.MockedFunction<
    typeof applicationService.updateCandidateStage
>;

describe('candidateController - updateCandidateStageController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockStatus = jest.fn().mockReturnThis();
        mockJson = jest.fn().mockReturnThis();

        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };

        mockRequest = {
            params: {},
            body: {},
        };
    });

    it('should return 200 with updated application when update succeeds', async () => {
        // Arrange
        const mockApplication = {
            id: 1,
            positionId: 1,
            candidateId: 1,
            currentInterviewStep: 2,
            applicationDate: new Date('2024-01-15'),
            candidate: { id: 1, firstName: 'Juan', lastName: 'Pérez' },
            interviewStep: { id: 2, name: 'Entrevista Técnica' },
        };
        mockUpdateCandidateStage.mockResolvedValue(mockApplication as any);
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockUpdateCandidateStage).toHaveBeenCalledWith(1, 1, 2);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockApplication);
    });

    it('should return 400 when candidateId is not a number', async () => {
        // Arrange
        mockRequest.params = { id: 'abc' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid candidate ID format' });
        expect(mockUpdateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when candidateId is negative or zero', async () => {
        // Arrange
        mockRequest.params = { id: '-1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid candidate ID format' });
    });

    it('should return 400 when body is missing positionId', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = { currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.stringContaining('positionId'),
            })
        );
    });

    it('should return 400 when body is missing currentInterviewStep', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.stringContaining('currentInterviewStep'),
            })
        );
    });

    it('should return 400 when positionId is not a number', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 'abc', currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 when currentInterviewStep is not a number', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 'abc' };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 when positionId is negative or zero', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: -1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 when currentInterviewStep is negative or zero', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 0 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 404 when application does not exist', async () => {
        // Arrange
        const error = new Error('Application not found');
        mockUpdateCandidateStage.mockRejectedValue(error);
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Application not found' });
    });

    it('should return 404 when interview step is invalid for position', async () => {
        // Arrange
        const error = new Error('Invalid interview step for this position');
        mockUpdateCandidateStage.mockRejectedValue(error);
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Invalid interview step for this position',
        });
    });

    it('should return 500 when service throws unexpected error', async () => {
        // Arrange
        const error = new Error('Unexpected error');
        mockUpdateCandidateStage.mockRejectedValue(error);
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should call service with correct parameters', async () => {
        // Arrange
        mockUpdateCandidateStage.mockResolvedValue({} as any);
        mockRequest.params = { id: '123' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockUpdateCandidateStage).toHaveBeenCalledWith(123, 1, 2);
    });

    it('should handle empty body gracefully', async () => {
        // Arrange
        mockRequest.params = { id: '1' };
        mockRequest.body = {};

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should handle Prisma error P2025 as 404', async () => {
        // Arrange
        const prismaError: any = new Error('Record not found');
        prismaError.code = 'P2025';
        mockUpdateCandidateStage.mockRejectedValue(prismaError);
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Application not found' });
    });

    it('should handle other Prisma errors as 500', async () => {
        // Arrange
        const prismaError: any = new Error('Prisma connection error');
        prismaError.code = 'P1001';
        mockUpdateCandidateStage.mockRejectedValue(prismaError);
        mockRequest.params = { id: '1' };
        mockRequest.body = { positionId: 1, currentInterviewStep: 2 };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should have consistent error message format', async () => {
        // Arrange
        mockRequest.params = { id: 'abc' };

        // Act
        await updateCandidateStageController(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});

