import movies from "@/lib/movies";

export async function GET() {
  const genreSet = new Set();
  for (const movie of movies) {
    for (const genre of movie.genres ?? []) {
      genreSet.add(genre);
    }
  }
  const genres = Array.from(genreSet).sort();
  return Response.json(genres);
}
