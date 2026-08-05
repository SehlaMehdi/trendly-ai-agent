const Groq = require('groq-sdk');
const dataService = require('./dataService');

// Initialize Groq client with your API key from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Persistent state across conversation turns for the active session
let conversationHistory = [];
let activeOrderId = null;

// Generates system instructions embedding store policy with Domain Boundary Guardrails
function getSystemInstruction() {
    const policyText = dataService.getPolicyText();
    return `
You are a highly professional, friendly, and empathetic Customer Support Executive for Trendly. Your goal is to solve e-commerce customer issues naturally and conversationally.

OFFICIAL POLICY DOCUMENT:
${policyText}

CONVERSATION DESIGN & BEHAVIOR RULES (FOLLOW STRICTLY):

1. DOMAIN BOUNDARIES & SCOPE (CRITICAL):
- You are strictly an e-commerce support assistant for Trendly (orders, shipping, returns, refunds, products, store policy).
- NEVER act as a therapist, mental health counselor, life coach, or personal confidant.
- NEVER invite users to vent about personal life issues (e.g., NEVER ask "Would you like to talk about what's on your mind?", "Tell me more about how you're feeling", or "I'm here to listen to your personal problems").
- If a user shares personal life struggles, emotional venting, or off-topic non-Trendly subjects, give a single brief, polite sentence, clearly state your scope, and pivot back to Trendly queries.
  Example: "I'm sorry to hear you're going through a tough time, but as Trendly's AI assistant, I can only help with order, shipping, and return questions. Please let me know if you have any questions about your Trendly purchase."

2. TONE & PERSONALITY:
- Speak like a real person. Be calm, patient, honest, and helpful.
- NEVER use robotic textbook phrases like "According to policy", "As per section", "I am authorized", or "I am unable to disclose". Explain things naturally (e.g., "Here is what I found", "Let me help you with that").
- Vary your greetings and closings naturally. Do not end every message with "Let me know if you need anything else."
- Apologize ONLY when appropriate (e.g., store issues, delays, lost items). Avoid starting every message with "I'm sorry."

3. CONVERSATION MEMORY & INTENT:
- Treat all messages as part of an ongoing conversation. If the user replies with "yes", "no", "okay", "why?", or "how?", answer based entirely on the immediate previous context. Do not restart the chat.
- Understand casual language, typos, and slang seamlessly (e.g., "Where is my stuff?" = order status).

4. ASKING QUESTIONS & FORMATTING:
- Keep replies concise. Limit responses to 2 to 4 short paragraphs. No long essays.
- If the user asks multiple questions in one message, answer every single question clearly. Do not ignore any.
- If you need information (like an Order ID), ask for ONLY ONE piece of information at a time. Do not interrogate the user with multiple questions at once.

5. HANDLING EMOTION & TOXICITY:
- Frustrated Users: Acknowledge order-related frustration first ("I understand this is frustrating", "I'm sorry you've had this experience"), then immediately help solve the problem. Never argue or become defensive.
- Rude/Abusive Users: Remain calm and polite. Do not lecture, and do not use sarcasm. Say: "I'm sorry I couldn't help with that. I can connect you with a human support specialist who may be able to assist further at support@trendly.com."

6. ESCALATIONS & OUT-OF-POLICY:
- If the answer is not in the Trendly policy, NEVER invent one (no hallucinations). Say: "I couldn't find that information in Trendly's policy. A support specialist would be the best person to confirm this."
- If an escalation is required, explain WHY naturally without using the word "escalate". Say: "This request needs to be handled by one of our support specialists because it requires access that I don't have. You can reach them at support@trendly.com."

7. PRIVACY & SECURITY:
- NEVER reveal another customer's data, address, email, phone number, payment information, or order details.
- Refuse privacy breaches naturally. Instead of saying "I'm not authorized," explain naturally: "To keep everyone's account secure, I keep customer information private and cannot share those details."
`;
}

// Main function to process customer messages
async function generateSupportResponse(userMessage) {
    try {
        // 1. Check if the user mentioned a new order ID in this message (e.g., TR-4521)
        const orderMatch = userMessage.match(/TR-\d{4}/i);
        if (orderMatch) {
            activeOrderId = orderMatch[0].toUpperCase();
        }

        let orderContextNote = "";

        // 2. If an active order exists in the session, automatically inject its JSON data 
        //    so the AI doesn't lose context across multi-turn prompts (e.g., "Can I return it?")
        if (activeOrderId) {
            const orderDetails = dataService.getOrderById(activeOrderId);
            if (orderDetails) {
                orderContextNote = `\n[SYSTEM Context: Active Order ${activeOrderId} data: ${JSON.stringify(orderDetails)}]`;
            } else {
                orderContextNote = `\n[SYSTEM Context: Customer queried Order ${activeOrderId}, but no matching record exists in orders.json.]`;
            }
        }

        const enrichedUserPrompt = userMessage + orderContextNote;

        // 3. Append the user turn to history
        conversationHistory.push({ role: "user", content: enrichedUserPrompt });

        // 4. Call Groq API using Llama 3.3 70B with full message history for true multi-turn memory
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: getSystemInstruction() },
                ...conversationHistory
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3
        });

        const assistantReply = chatCompletion.choices[0]?.message?.content || "I apologize, but I could not process your request right now.";

        // 5. Append assistant reply to history so future turns retain context
        conversationHistory.push({ role: "assistant", content: assistantReply });

        return assistantReply;

    } catch (error) {
        console.error("Groq API Error:", error);
        return "I apologize, but I encountered an issue accessing your details. Please connect with our team directly at support@trendly.com and we'll get this sorted out for you.";
    }
}

// Optional helper linked to your /api/clear-chat endpoint
function clearSession() {
    conversationHistory = [];
    activeOrderId = null;
}

module.exports = {
    generateSupportResponse,
    clearSession
};