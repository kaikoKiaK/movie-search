export function tokenize(text) {
  return text.toLowerCase().split(/\W+/).filter(Boolean);
}
