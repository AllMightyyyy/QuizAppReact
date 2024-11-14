// src/services/quizService.ts
import axiosInstance from '../api/axiosInstance';
import { Question, QuizResponse } from "../types";

export const fetchQuizQuestions = async (quizId: number): Promise<Question[]> => {
    try {
        const response = await axiosInstance.get<{ questions: Question[] }>(`/api/quizzes/${quizId}/questions`);
        return response.data.questions;
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        throw error;
    }
};

export const fetchQuizById = async (quizId: number): Promise<QuizResponse> => {
    try {
        const response = await axiosInstance.get<QuizResponse>(`/api/quizzes/${quizId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
};
