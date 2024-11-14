// src/utils/quizUtils.ts
import { Question, UserAnswer } from '../types';

export const calculateScore = (questions: Question[], userAnswers: UserAnswer[]): number => {
    let score = 0;
    questions.forEach((question) => {
        const userAnswer = userAnswers.find((ua) => ua.questionId === question.id);
        if (userAnswer) {
            const correct = Array.isArray(question.answer)
                ? Array.isArray(userAnswer.selectedOption) &&
                (question.answer as string[]).sort().join() === (userAnswer.selectedOption as string[]).sort().join()
                : userAnswer.selectedOption === question.answer;
            if (correct) score += 1;
        }
    });
    return score;
};
