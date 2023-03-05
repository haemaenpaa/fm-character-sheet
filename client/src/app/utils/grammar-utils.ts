export function article(word: string): string {
  if (word.length === 0) {
    return '';
  }
  const first = word.charAt(0).toLowerCase();
  switch (first) {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
      return 'an';
    default:
      return 'a';
  }
}
