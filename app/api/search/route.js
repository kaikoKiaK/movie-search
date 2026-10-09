import { searchMovies } from "@/lib/search";
import movies from "@/lib/movies";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";

  let results = q ? searchMovies(q) : movies;

  if (genre) {
    results = results.filter((m) => m.genres?.includes(genre));
  }

  return Response.json(results);
}
