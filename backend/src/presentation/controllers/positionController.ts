import { Request, Response } from 'express';
import { getCandidatesByPosition } from '../../application/services/applicationService';

/**
 * Controlador para obtener candidatos en proceso de una posición
 * @param req - Request con positionId en params
 * @param res - Response
 */
export const getCandidatesByPositionController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const positionIdParam = req.params.id;
        const positionId = parseInt(positionIdParam, 10);

        // Validar que positionId es un número entero positivo
        if (
            isNaN(positionId) ||
            positionId <= 0 ||
            positionId.toString() !== positionIdParam
        ) {
            res.status(400).json({ error: 'Invalid position ID format' });
            return;
        }

        const candidates = await getCandidatesByPosition(positionId);

        res.status(200).json(candidates);
    } catch (error: any) {
        // Manejar errores de Prisma
        if (error?.code === 'P2025') {
            res.status(404).json({ error: 'Position not found' });
            return;
        }

        if (error instanceof Error) {
            // Verificar si es un error de "not found"
            if (error.message.includes('not found') || error.message.includes('Not found')) {
                res.status(404).json({ error: 'Position not found' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

