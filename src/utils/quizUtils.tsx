// src/utils/quizUtils.ts
import { AnswerResponseDTO } from '../types';

export const calculateScore = (answerResponse: AnswerResponseDTO): number => {
    const { correctness } = answerResponse;
    let score = 0;

    Object.values(correctness).forEach((isCorrect) => {
        if (isCorrect) score += 1;
    });

    return score;
};
