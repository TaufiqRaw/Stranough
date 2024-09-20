export function caseInsensitiveRegex(str: string) {
  return new RegExp(`^${str}$`, 'i');
}