import { tokenize } from "./tokenizer";
import movies from "./movies";
import { buildIndex } from "./invertedIndex";

const index = buildIndex();
const indexKeys = Object.keys(index);

export function searchMovies(query) {
  const words = tokenize(query);
  const scores = {};

  for (const word of words) {
    // exact match
    const exactMatches = index[word] || [];
    for (const id of exactMatches) {
      scores[id] = (scores[id] || 0) + 2;
    }

    // prefix match — only if query word is at least 3 chars
    if (word.length >= 3) {
      for (const key of indexKeys) {
        if (key !== word && key.startsWith(word)) {
          for (const id of index[key]) {
            scores[id] = (scores[id] || 0) + 1;
          }
        }
      }
    }
  }

  return movies
    .filter((m) => scores[m.id])
    .sort((a, b) => scores[b.id] - scores[a.id]);
}
