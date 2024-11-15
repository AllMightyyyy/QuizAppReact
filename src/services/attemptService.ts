// src/services/attemptService.ts
import axiosInstance from '../api/axiosInstance';

interface StartAttemptResponse {
    attemptId: number;
}

interface SubmitAttemptPayload {
    quizId: number;
    attemptId: number;
    totalTimeTaken: number;
    retry: boolean;
    questions: {
        questionId: number;
        selectedOption: string | string[];
        timeTakenSeconds: number;
    }[];
}

interface SubmitAttemptResponse {
    message: string;
    pointsEarned: number;
}

interface AnswerSubmissionDTO {
    userId: number;
    quizId: number;
    answers: { [questionId: number]: string | string[] };
}

interface AnswerResponseDTO {
    correctness: { [questionId: number]: boolean };
    correctAnswers: { [questionId: number]: number | number[] };
}

export const startAttempt = async (quizId: number): Promise<StartAttemptResponse> => {
    try {
        const response = await axiosInstance.post<StartAttemptResponse>('/api/attempts/start', { quizId });
        return response.data;
    } catch (error) {
        console.error('Error starting attempt:', error);
        throw error;
    }
};

export const submitAttempt = async (payload: SubmitAttemptPayload): Promise<SubmitAttemptResponse> => {
    try {
        const response = await axiosInstance.post<SubmitAttemptResponse>('/api/attempts/submit', payload);
        return response.data;
    } catch (error) {
        console.error('Error submitting attempt:', error);
        throw error;
    }
};

// New Function: Submit Answers
export const submitAnswers = async (payload: AnswerSubmissionDTO): Promise<AnswerResponseDTO> => {
    try {
        const response = await axiosInstance.post<AnswerResponseDTO>('/api/quizzes/submit-answers', payload);
        return response.data;
    } catch (error) {
        console.error('Error submitting answers:', error);
        throw error;
    }
};
