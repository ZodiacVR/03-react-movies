import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast'; 
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import type { Movie, MovieResponse } from '../../types/movie';
export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { refetch } = useQuery<MovieResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: false, // Виклик через refetch
  });

  useEffect(() => {
    setIsLoading(true);
    refetch()
      .then(({ data }) => {
        if (data) {
          setMovies(data.results);
          setIsLoading(false);
          setError(null);
        }
      })
      .catch((err: Error) => {
        setIsLoading(false);
        setError(err.message || 'Failed to fetch movies');
        toast.error(err.message || 'An error occurred');
      });
  }, [query, page, refetch]);

  const handleSearch = (formData: FormData) => {
    const searchQuery = formData.get('query')?.toString().trim() || '';
    if (searchQuery) {
      setQuery(searchQuery);
      setPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <Toaster />
      <SearchBar action={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : movies.length > 0 ? (
        <>
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => handlePageChange(page + 1)}>Next</button>
        </>
      ) : (
        <p>No movies found</p>
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}