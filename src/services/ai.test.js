import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFieldContent } from './ai';

describe('AI Service fetch wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('calls the backend API and returns text', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Mocked server text' }),
    });

    const result = await generateFieldContent('productName', { style: 'Modern' });
    expect(result).toBe('Mocked server text');
    expect(global.fetch).toHaveBeenCalledWith('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fieldName: 'productName', currentFormData: { style: 'Modern' } }),
    });
  });

  it('throws an error on server failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    await expect(generateFieldContent('productName', {})).rejects.toThrow('Internal Server Error');
  });
});
