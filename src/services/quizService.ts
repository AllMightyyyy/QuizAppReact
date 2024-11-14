// src/services/quizService.ts
import axiosInstance from '../api/axiosInstance';
import { Question } from "../types";

export const fetchQuizQuestions = async (quizId: number): Promise<Question[]> => {
    try {
        const response = await axiosInstance.get<{ questions: Question[] }>(`/api/quizzes/${quizId}`);
        return response.data.questions;
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        throw error;
    }
};
