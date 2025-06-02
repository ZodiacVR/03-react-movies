import axios from 'axios';
import type { MovieResponse } from '../types/movie';

export const fetchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB API key is missing. Please set VITE_TMDB_API_KEY in your .env file.');
    }
    const response = await axios.get<MovieResponse>('https://api.themoviedb.org/3/search/movie', {
      params: { query, page, api_key: apiKey },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch movies error:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch movies');
  }
};