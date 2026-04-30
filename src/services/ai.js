import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const FIELD_PROMPTS = {
  productName: {
    limit: 40,
    prompt: "Generate a premium, catchy product name for a flooring product. Keep it under 40 characters. Examples: 'Midnight Oak Hardwood', 'Arctic White Porcelain'. Respond with JUST the name, no quotes."
  },
  price: {
    limit: 20,
    prompt: "Generate a realistic, competitive price per square foot for premium flooring. Keep it under 20 characters. Examples: '$4.99 / sq ft', '$12.50 / sq ft'. Respond with JUST the price, no quotes."
  },
  dimensions: {
    limit: 30,
    prompt: "Generate standard dimensions for flooring planks or tiles. Keep it under 30 characters. Examples: '7.5\" x 72\" Planks', '12\" x 24\" Tiles'. Respond with JUST the dimensions, no quotes."
  },
  warranty: {
    limit: 40,
    prompt: "Generate a strong, reassuring warranty text for flooring. Keep it under 40 characters. Examples: 'Lifetime Residential Warranty', '50-Year Commercial Warranty'. Respond with JUST the warranty text, no quotes."
  },
  description: {
    limit: 150,
    prompt: "Generate a compelling, short marketing description for a flooring product. Highlight durability, aesthetics, and lifestyle benefits. Keep it strictly under 150 characters. Respond with JUST the description, no quotes."
  },
  partnerName: {
    limit: 40,
    prompt: "Generate a professional, trustworthy name for a local flooring installation business. Keep it under 40 characters. Examples: 'Summit Flooring Experts', 'Elite Tile & Wood'. Respond with JUST the business name, no quotes."
  },
  partnerContact: {
    limit: 50,
    prompt: "Generate a clean, professional contact string containing an email and phone number. Keep it under 50 characters. Examples: 'sales@elitefloors.com | (555) 123-4567'. Respond with JUST the contact info, no quotes."
  }
};

export async function generateFieldContent(fieldName, currentFormData) {
  if (!genAI) {
    throw new Error("Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const fieldInfo = FIELD_PROMPTS[fieldName];
  if (!fieldInfo) {
    throw new Error(`No AI prompt configured for field: ${fieldName}`);
  }

  // Construct context string to ground the generation
  const contextParts = Object.entries(currentFormData)
    .filter(([k, v]) => k !== fieldName && v && typeof v === 'string' && !v.startsWith('blob:'))
    .map(([k, v]) => `${k}: ${v}`);
    
  const fullPrompt = `
    Context: You are writing marketing copy for a premium flooring generator tool.
    Current Data Context:
    ${contextParts.join('\n')}
    
    Task: ${fieldInfo.prompt}
    Constraint: Your response MUST be less than or equal to ${fieldInfo.limit} characters.
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    let text = result.response.text().trim();
    
    // Remove quotes if the AI included them accidentally
    text = text.replace(/^["'](.*)["']$/, '$1');
    
    // Enforce limits strictly
    if (text.length > fieldInfo.limit) {
      text = text.substring(0, fieldInfo.limit).trim();
    }
    
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
