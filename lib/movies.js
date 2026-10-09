import rawMovies from "../data/movies.json";

const movies = rawMovies.map((movie, index) => ({
  id: index + 1,
  ...movie,
}));

export default movies;
