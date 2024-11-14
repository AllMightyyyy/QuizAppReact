// src/types.d.ts
export interface Question {
    id: number;
    subject: string;
    question: string;
    options: string[];
    imageName?: string;
    timeLimitSeconds: number;
}

export interface QuestionResponse {
    id: number;
    subject: string;
    question: string;
    options: string[];
    imageName?: string;
    timeLimitSeconds: number;
}

export interface QuizResponse {
    id: number;
    subject: string;
    questions: QuestionResponse[];
    pointRules: PointRuleResponse[];
}

export interface UserAnswer {
    questionId: number;
    selectedOption: string | string[];
    selectedOptionIndex?: number | number[]; // Optional, based on usage
    isCorrect?: boolean; // Optional, based on usage
}

export interface DetailedFeedback {
    id: number;
    text: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
}

export interface AnswerResponseDTO {
    correctness: { [questionId: number]: boolean };
    correctAnswers: { [questionId: number]: number | number[] };
}

export interface PointRuleResponse {
    id: number;
    maxTimeSeconds: number;
    pointsForCorrectAnswer: number;
}
