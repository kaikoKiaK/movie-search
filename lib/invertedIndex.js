import { tokenize } from "./tokenizer";
import movies from "./movies";

export function buildIndex() {
  const index = {};

  for (const movie of movies) {
    const text = `
      ${movie.title}
      ${movie.cast.join(" ")}
      ${movie.genres.join(" ")}
    `;

    const words = new Set(tokenize(text));

    for (const word of words) {
      if (!index[word]) index[word] = [];
      index[word].push(movie.id);
    }
  }

  return index;
}
