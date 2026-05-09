import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

// Mock the Gemini SDK BEFORE importing the service
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => '["Visit the Eiffel Tower", "Eat a croissant"]'
            }
          })
        };
      }
    }
  };
});

import { getTravelRecommendations, getTripItinerary } from '../services/ai';

describe('AI Service', () => {
  beforeAll(() => {
    process.env.GEMINI_API_KEY = 'test-key';
  });

  afterAll(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('should generate recommendations', async () => {
    const recommendations = await getTravelRecommendations('Paris', 1000);
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations[0]).toBe('Visit the Eiffel Tower');
  });

  it('should generate an itinerary', async () => {
    const itinerary = await getTripItinerary('Paris', 1, 1000);
    expect(Array.isArray(itinerary) || typeof itinerary === 'object').toBe(true);
  });
});
