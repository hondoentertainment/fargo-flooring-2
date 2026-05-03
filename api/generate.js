import { GoogleGenerativeAI } from '@google/generative-ai';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fieldName, currentFormData } = req.body;

  if (!fieldName || !currentFormData) {
    return res.status(400).json({ error: 'Missing fieldName or currentFormData' });
  }

  const fieldInfo = FIELD_PROMPTS[fieldName];
  if (!fieldInfo) {
    return res.status(400).json({ error: `No AI prompt configured for field: ${fieldName}` });
  }

  const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
}
