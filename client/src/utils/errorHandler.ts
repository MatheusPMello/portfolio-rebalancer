import { AxiosError } from 'axios';

/**
 * Extracts a readable error message from a thrown exception (e.g., AxiosError),
 * falling back to a default value if no server message is present.
 *
 * @param error - The caught exception object.
 * @param fallback - The default message to return if none could be extracted.
 * @returns The extracted error message or fallback.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
  }
  return fallback;
};
