import { PrismaClient } from '@prisma/client';

// Crear instancia de Prisma Client
// En tests, esto será mockeado
const prisma = new PrismaClient();

/**
 * Tipo para la respuesta de getCandidatesByPosition
 */
export interface CandidateByPositionResponse {
    candidateId: number;
    fullName: string;
    currentInterviewStep: {
        id: number;
        name: string;
    };
    averageScore: number | null;
    applicationId: number;
}

/**
 * Obtiene todos los candidatos en proceso para una posición específica
 * @param positionId - ID de la posición
 * @returns Array de candidatos con información agregada (nombre completo, etapa actual, puntuación media)
 */
export const getCandidatesByPosition = async (
    positionId: number
): Promise<CandidateByPositionResponse[]> => {
    const applications = await prisma.application.findMany({
        where: { positionId },
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

    return applications.map((application) => {
        // Calcular puntuación media
        const scoresWithValue = application.interviews
            .map((interview) => interview.score)
            .filter((score): score is number => score !== null);

        let averageScore: number | null = null;
        if (scoresWithValue.length > 0) {
            const sum = scoresWithValue.reduce((acc, score) => acc + score, 0);
            averageScore = sum / scoresWithValue.length;
        }

        return {
            candidateId: application.candidateId,
            fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
            currentInterviewStep: {
                id: application.interviewStep.id,
                name: application.interviewStep.name,
            },
            averageScore,
            applicationId: application.id,
        };
    });
};

/**
 * Actualiza la etapa del proceso de un candidato en una aplicación específica
 * @param candidateId - ID del candidato
 * @param positionId - ID de la posición
 * @param newStepId - ID del nuevo paso de entrevista
 * @returns Aplicación actualizada con relaciones
 */
export const updateCandidateStage = async (
    candidateId: number,
    positionId: number,
    newStepId: number
) => {
    // Buscar la aplicación
    const application = await prisma.application.findFirst({
        where: {
            candidateId,
            positionId,
        },
    });

    if (!application) {
        throw new Error('Application not found');
    }

    // Obtener la posición para validar el flujo de entrevistas
    const position = await prisma.position.findUnique({
        where: { id: positionId },
    });

    if (!position) {
        throw new Error('Position not found');
    }

    // Validar que el nuevo paso existe y pertenece al mismo flujo
    const interviewStep = await prisma.interviewStep.findUnique({
        where: { id: newStepId },
    });

    if (!interviewStep) {
        throw new Error('Interview step not found');
    }

    if (interviewStep.interviewFlowId !== position.interviewFlowId) {
        throw new Error('Invalid interview step for this position');
    }

    // Actualizar la aplicación
    const updatedApplication = await prisma.application.update({
        where: { id: application.id },
        data: { currentInterviewStep: newStepId },
        include: {
            candidate: true,
            interviewStep: true,
            position: true,
        },
    });

    return updatedApplication;
};

