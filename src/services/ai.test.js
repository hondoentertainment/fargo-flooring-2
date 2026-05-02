import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFieldContent } from './ai';

let mockText = 'Mocked text';

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async () => ({
            response: {
              text: () => mockText
            }
          })
        };
      }
    }
  };
});

describe('AI Service limits', () => {
  beforeEach(() => {
    mockText = 'Mocked text';
    vi.clearAllMocks();
  });

  it('generates content successfully', async () => {
    const result = await generateFieldContent('productName', { style: 'Modern' });
    expect(result).toBe('Mocked text');
  });

  it('enforces character limits', async () => {
    mockText = 'This is a very long string that will definitely exceed the twenty character limit of the price field.';

    const result = await generateFieldContent('price', {});
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result).toBe('This is a very long');
  });
});
