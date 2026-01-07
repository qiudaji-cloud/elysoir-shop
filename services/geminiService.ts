
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product } from '../types';

// 配置阿里的 API 端点
const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
// 这里使用 qwen-plus，您也可以改为 qwen-turbo (更便宜) 或 qwen-max (更强)
const MODEL_NAME = "qwen-plus";

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
  const apiKey = process.env.API_KEY || process.env.REACT_APP_API_KEY || import.meta.env?.VITE_API_KEY;

  if (!apiKey) {
    console.error("Missing API Key");
    return "Configuration Error: Please provide an API Key in the environment variables.";
  }

  try {
    // 构建符合 OpenAI 兼容格式的消息历史
    const messages = [
      { role: "system", content: getSystemInstruction(products) },
      ...history.map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user', // 阿里/OpenAI 使用 'assistant' 而不是 'model'
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
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // 提取返回的文本内容
    const reply = data.choices?.[0]?.message?.content;
    
    return reply || "I apologize, I am unable to formulate a response at this moment.";

  } catch (error) {
    console.error("Assistant Error:", error);
    return "I apologize, but I am having a moment of technical difficulty. Please browse our collection in the meantime.";
  }
};
