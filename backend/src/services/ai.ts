import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedData, setCachedData } from "../lib/redis";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getTravelRecommendations(destination: string, budget: number) {
  const cacheKey = `recommendations:${destination.toLowerCase().replace(/\s+/g, '-')}:${budget}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `Act as a travel expert. For a trip to ${destination} with a budget of $${budget}, provide 5 specific travel recommendations. 
  Include a mix of hidden gems, local food spots, and must-see attractions. 
  Keep each recommendation concise and exciting. Format as a JSON array of strings.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const jsonStr = text.match(/\[.*\]/s)?.[0] || text;
    const data = JSON.parse(jsonStr);
    await setCachedData(cacheKey, data);
    return data;
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    return [text]; // Fallback to raw text if JSON parsing fails
  }
}

export async function getTripItinerary(destination: string, days: number, budget: number) {
  const cacheKey = `itinerary:${destination.toLowerCase().replace(/\s+/g, '-')}:${days}:${budget}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `Generate a day-by-day itinerary for a ${days}-day trip to ${destination} with a budget of $${budget}. 
  Include morning, afternoon, and evening activities for each day. 
  Format the response as a JSON array where each object has "day" and "activities" (an array of strings).`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonStr = text.match(/\[.*\]/s)?.[0] || text;
    const data = JSON.parse(jsonStr);
    await setCachedData(cacheKey, data);
    return data;
  } catch (err) {
    console.error("Failed to parse AI itinerary:", text);
    return [{ day: 1, activities: [text] }];
  }
}
