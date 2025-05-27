import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import styles from './App.module.css';
import { AxiosError } from 'axios';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (formData: FormData) => {
    setMovies([]);
    setError(false);
    setLoading(true);

    const query = formData.get('query') as string;

    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(results);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`Failed to fetch movies: ${error.response?.data?.status_message || error.message}`);
      } else {
        toast.error('Failed to fetch movies');
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.container}>
      <SearchBar action={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}