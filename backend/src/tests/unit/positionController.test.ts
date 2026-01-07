import { Request, Response } from 'express';
import { getCandidatesByPositionController } from '../../presentation/controllers/positionController';
import * as applicationService from '../../application/services/applicationService';

// Mock del servicio
jest.mock('../../application/services/applicationService');
const mockGetCandidatesByPosition = applicationService.getCandidatesByPosition as jest.MockedFunction<
    typeof applicationService.getCandidatesByPosition
>;

describe('positionController - getCandidatesByPositionController', () => {
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
        };
    });

    it('should return 200 with candidates array when positionId is valid', async () => {
        // Arrange
        const mockCandidates = [
            {
                candidateId: 1,
                fullName: 'Juan Pérez',
                currentInterviewStep: { id: 2, name: 'Entrevista Técnica' },
                averageScore: 7.5,
                applicationId: 1,
            },
        ];
        mockGetCandidatesByPosition.mockResolvedValue(mockCandidates);
        mockRequest.params = { id: '1' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockGetCandidatesByPosition).toHaveBeenCalledWith(1);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockCandidates);
    });

    it('should return 200 with empty array when position has no candidates', async () => {
        // Arrange
        mockGetCandidatesByPosition.mockResolvedValue([]);
        mockRequest.params = { id: '1' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith([]);
    });

    it('should return 400 when positionId is not a number', async () => {
        // Arrange
        mockRequest.params = { id: 'abc' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid position ID format' });
        expect(mockGetCandidatesByPosition).not.toHaveBeenCalled();
    });

    it('should return 400 when positionId is negative', async () => {
        // Arrange
        mockRequest.params = { id: '-1' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid position ID format' });
    });

    it('should return 400 when positionId is zero', async () => {
        // Arrange
        mockRequest.params = { id: '0' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid position ID format' });
    });

    it('should return 400 when positionId is decimal', async () => {
        // Arrange
        mockRequest.params = { id: '1.5' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid position ID format' });
    });

    it('should return 404 when position does not exist', async () => {
        // Arrange
        const error = new Error('Position not found');
        mockGetCandidatesByPosition.mockRejectedValue(error);
        mockRequest.params = { id: '999' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Position not found' });
    });

    it('should return 500 when service throws unexpected error', async () => {
        // Arrange
        const error = new Error('Unexpected error');
        mockGetCandidatesByPosition.mockRejectedValue(error);
        mockRequest.params = { id: '1' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should call service with parsed integer positionId', async () => {
        // Arrange
        mockGetCandidatesByPosition.mockResolvedValue([]);
        mockRequest.params = { id: '123' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockGetCandidatesByPosition).toHaveBeenCalledWith(123);
    });

    it('should handle service returning null gracefully', async () => {
        // Arrange
        mockGetCandidatesByPosition.mockResolvedValue(null as any);
        mockRequest.params = { id: '1' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(null);
    });

    it('should handle Prisma error P2025 as 404', async () => {
        // Arrange
        const prismaError: any = new Error('Record not found');
        prismaError.code = 'P2025';
        mockGetCandidatesByPosition.mockRejectedValue(prismaError);
        mockRequest.params = { id: '1' };

        // Act
        await getCandidatesByPositionController(
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Position not found' });
    });
});

