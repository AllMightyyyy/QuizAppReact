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
    timeTaken: number;
}
