# Trendly Agentic Support Assistant — Solution Architecture & Notes

## 1. Architecture Overview
The system follows a lightweight, decoupled Client-Server architecture:

- **Frontend:** Vanilla HTML/CSS/JS provides a chat user interface. It sends asynchronous POST requests containing the customer message to the Node.js backend.
- **Backend API (`/api/chat`):** Built with Express.js. Receives user queries, validates request bodies, and orchestrates context retrieval.
- **Data Layer (`dataService.js`):** Loads orders.json and trendly_policy.md into memory. Extracts specific order metadata when an order_id (e.g., TR-4521) is recognized.
- **AI Model (`geminiService.js`):** Integrates @google/genai using the gemini-2.5-flash model. It injects the policy document and matching order details directly into the system instructions to ensure answers remain strictly grounded.

---

## 2. Key Architectural Trade-Offs

| Decision | Chosen Approach | Alternative Considered | Trade-Off Rationale |
|---|---|---|---|
| **Data Retrieval** | Direct In-Memory JSON & MD Reading | Vector Database / RAG Setup | For 10 fixed orders and a single policy document, vector search adds setup overhead. Direct context injection ensures 100% accuracy with zero retrieval latency. |
| **Frontend Stack** | Vanilla HTML / CSS / JavaScript | React.js / Next.js | Eliminates client-side build complexity and external framework dependencies, prioritizing readability and execution stability. |
| **Tool Calling** | RegEx Context Matching + Direct System Context | Dynamic Function Calling Tools | Pattern matching order IDs directly in system instructions guarantees immediate context delivery without requiring extra LLM tool-call roundtrips. |

---

## 3. Known Limitations
1. **Multi-Turn History:** The current endpoint processes single turn prompts with dynamic context. In high-volume production, session state persistence (e.g., Redis) would be required for extended back-and-forth context.
2. **Authentication:** Customer ID verification is minimal. In production, JWT-based authentication should verify that the requester owns the queried order_id.
3. **Static File Load:** Orders are read from a static local JSON file rather than a database. Real-time inventory or order status updates require a live database connection.

---

## 4. Operational Discovery Questions for Trendly Ops Team
To scale this assistant for real-world deployment (handling 2,000 daily chats), I would ask the Trendly Operations team:

1. **Webhook Integration:** *"Do you have real-time webhooks or REST APIs for carrier tracking updates (BlueDart/Delhivery) so the assistant can pull live tracking statuses rather than static json expected dates?"*
2. **Human Escalation Hand-off:** *"Which customer support ticketing platform (e.g., Zendesk, Freshdesk, Intercom) should the assistant route human escalations and lost-parcel claims to?"*
3. **Cash-on-Delivery Collection:** *"What automated secure link vendor do you use for collecting COD bank transfer details, so the assistant can send automated submission links safely?"*
4. **Exchange Inventory Checks:** *"When a customer requests a size exchange, is there a real-time warehouse inventory API to confirm size availability before approving the exchange?"*
5. **Authenticity & Verification:** *"What step-up authentication (e.g., OTP sent to email/phone) is required before disclosing order details to an unauthenticated chat user?"*