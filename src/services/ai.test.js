import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFieldContent } from './ai';

describe('AI Service fetch wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('calls the backend API and returns text', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Mocked server text' }),
    });

    const result = await generateFieldContent('productName', { style: 'Modern' });
    expect(result).toBe('Mocked server text');
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fieldName: 'productName', currentFormData: { style: 'Modern' } }),
    });
  });

  it('throws an error on server failure', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    await expect(generateFieldContent('productName', {})).rejects.toThrow('Internal Server Error');
  });
});
