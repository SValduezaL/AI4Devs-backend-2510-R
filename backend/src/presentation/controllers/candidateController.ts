import { Request, Response } from 'express';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';
import { updateCandidateStage } from '../../application/services/applicationService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Controlador para actualizar la etapa del proceso de un candidato
 * @param req - Request con candidateId en params y body con positionId y currentInterviewStep
 * @param res - Response
 */
export const updateCandidateStageController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const candidateId = parseInt(req.params.id);

        // Validar que candidateId es un número válido
        if (isNaN(candidateId) || candidateId <= 0 || candidateId.toString() !== req.params.id) {
            res.status(400).json({ error: 'Invalid candidate ID format' });
            return;
        }

        // Validar body
        const { positionId, currentInterviewStep } = req.body;

        if (
            positionId === undefined ||
            currentInterviewStep === undefined ||
            typeof positionId !== 'number' ||
            typeof currentInterviewStep !== 'number' ||
            positionId <= 0 ||
            currentInterviewStep <= 0
        ) {
            res.status(400).json({
                error: 'Invalid request body. positionId and currentInterviewStep are required and must be positive numbers',
            });
            return;
        }

        const updatedApplication = await updateCandidateStage(
            candidateId,
            positionId,
            currentInterviewStep
        );

        res.status(200).json(updatedApplication);
    } catch (error: any) {
        // Manejar errores de Prisma
        if (error?.code === 'P2025') {
            res.status(404).json({ error: 'Application not found' });
            return;
        }

        if (error instanceof Error) {
            if (
                error.message.includes('not found') ||
                error.message.includes('Not found') ||
                error.message.includes('Invalid interview step')
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export { addCandidate };