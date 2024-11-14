// src/types.d.ts
export interface Question {
    id: number;
    subject: string;
    question: string;
    options: string[];
    answer: string | string[]; // Supports single or multiple correct answers
}

export interface UserAnswer {
    questionId: number;
    selectedOption: string | string[]; // Supports single or multiple selections
    isCorrect: boolean;
    timeTakenSeconds: number;
}

export interface DetailedFeedback {
    id: number;
    text: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
}
