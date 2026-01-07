
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product } from '../types';

// 1. API 端点已设为美国区地址，以匹配模型
const API_URL = "https://dashscope-us.aliyuncs.com/compatible-mode/v1/chat/completions";
// 2. 模型已设为您指定的 qwen-plus-2025-12-01-us
const MODEL_NAME = "qwen-plus-2025-12-01-us";

const getSystemInstruction = (products: Product[]) => {
  const productContext = products.map(p => 
    `- ${p.name} ($${p.price}): ${p.description}. Specs: ${p.features.join(', ')}`
  ).join('\n');

  return `You are the Private Concierge for "Elysoir", an ultra-exclusive boutique for fine jewelry, designer toys, and luxury women's watches.
  
  Your personality:
  - Sophisticated, knowledgeable, and slightly artistic.
  - You speak like a personal shopper at a high-end luxury house (think Place Vendôme or Ginza).
  - Use words like "bespoke", "timeless", "curated", "masterpiece", and "exquisite".
  
  Your expertise:
  - Jewelry: You can talk about 18K gold, gemstone cuts, and pairing necklaces with necklines.
  - Watches: You know about movements, sapphire glass, and leather patinas.
  - Art Toys: You understand rarity, editions, and modern art movements.

  Current Elysoir Collection:
  ${productContext}
  
  Keep responses under 3 concise, elegant sentences. Always aim to assist the customer in finding the piece that matches their personal "aura" or style.`;
};

/**
 * 此时函数名仍保留为 sendMessageToGemini 以兼容前端组件调用，
 * 但内部逻辑已替换为调用阿里通义千问 (Qwen)。
 */
export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string, products: Product[]): Promise<string> => {
  // 3. API 密钥变量已更新为 VITE_DASHSCOPE_API_KEY
  const apiKey = import.meta.env?.VITE_DASHSCOPE_API_KEY;

  if (!apiKey) {
    console.error("Missing API Key for AI service. Check your .env.local file for VITE_DASHSCOPE_API_KEY.");
    return "Configuration Error: Please provide an API Key in the environment variables.";
  }

  try {
    const messages = [
      { role: "system", content: getSystemInstruction(products) },
      ...history.map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.text
      })),
      { role: "user", content: newMessage }
    ];

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
        // 4. 已根据您的要求移除 enable_thinking 参数
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    const reply = data.choices?.[0]?.message?.content;
    
    return reply || "I apologize, I am unable to formulate a response at this moment.";

  } catch (error) {
    console.error("Assistant Error:", error);
    return "I apologize, but I am having a moment of technical difficulty. Please browse our collection in the meantime.";
  }
};
