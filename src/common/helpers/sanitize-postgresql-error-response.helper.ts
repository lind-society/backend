export function sanitizePostgresqlErrorResponse(message: string): string {
  return message
    .replace(/Key /, '') // Remove "Key "
    .replace(/\((.*?)\)/g, '$1') // Remove parentheses ()
    .replace(/=/g, ' '); // Replace '=' with space
}
