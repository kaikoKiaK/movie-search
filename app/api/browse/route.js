import movies from "@/lib/movies";

// Returns 6 movies per year for years 2023 down to 2000
export async function GET() {
  const years = [];
  for (let y = 2023; y >= 2000; y--) years.push(y);

  const result = years.map((year) => ({
    year,
    movies: movies.filter((m) => m.year === year && m.thumbnail).slice(0, 6),
  })).filter((group) => group.movies.length > 0);

  return Response.json(result);
}
