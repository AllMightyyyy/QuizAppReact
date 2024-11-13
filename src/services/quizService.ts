import axios from 'axios';
import { Question } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ''; // This is for future java spring boot backend API

export const fetchQuizQuestions = async (quizPath: string): Promise<Question[]> => {
    try {
        const response = await axios.get<Question[]>(`${API_BASE_URL}${quizPath}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        throw error;
    }
};
