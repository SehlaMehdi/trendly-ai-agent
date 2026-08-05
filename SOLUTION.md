# Solution.md

# Solution Overview

The Trendly AI Customer Support Assistant is built to help customers with common support queries such as order tracking, returns, exchanges, refunds, shipping, and store policies. Instead of allowing the AI model to answer from its own knowledge, every response is grounded using Trendly's official policy document and the customer's order details. This helps the assistant give consistent and reliable responses while reducing the hallucinations.

---

# Architecture

## Orchestration Design

I used a **Linear Sequential Orchestration** approach for this project.

Whenever a user sends a message, the request follows the same flow:

```
Customer Message
        │
        ▼
Express Backend
        │
        ▼
Detect Order ID (if present)
        │
        ▼
Load Trendly Policy + Order Details
        │
        ▼
Inject Context into the LLM
        │
        ▼
Generate Response
        │
        ▼
Return Response to User
```

I chose a linear workflow instead of ReAct or autonomous planning because this project works with a fixed policy document and structured order data. Every request follows a predictable flow, so there was no need for complex multi-step reasoning. This also keeps the responses faster, easier to control, and less likely to hallucinate.

## Components

**Frontend**

Built using HTML, CSS, and JavaScript. It provides a simple chat interface where users can interact with the assistant.

**Backend**

Built with Node.js and Express.js. It receives the user's message, manages conversation history, extracts the Order ID if available, and prepares the context for the AI model.

**Data Layer**

The application uses `orders.json` and `trendly_policy.md` as its knowledge sources. When an Order ID is detected, only the relevant order information is passed to the model along with the policy document.

**LLM**

The application uses  **Groq's Llama 3.1 8B Instant** model model. The model receives the customer's message together with the relevant policy and order information so that responses stay grounded instead of relying on general knowledge.

---

# Key Trade-offs

| Decision | Chosen Approach | Alternative | Why I Chose It |
|----------|----------------|-------------|----------------|
| Data Retrieval | Direct JSON + Policy File | Vector Database / RAG | Since the assignment only contains a small set of orders and one policy document, direct context injection is simpler and faster. |

| Frontend | HTML, CSS, JavaScript | React / Next.js | I wanted to keep the application lightweight and avoid unnecessary frontend complexity. |

| Order Detection | Regex Pattern Matching | LLM Tool Calling | Order IDs follow a fixed format, so Regex is faster and more reliable for this use case. |

| Orchestration | Linear Sequential Pipeline | ReAct / Autonomous Agent | Customer support follows a predictable flow, so a simple pipeline provides better consistency with lower latency. |

---

# Known Limitations

Although the assistant works well for the assignment, there are some limitations.

1. Conversation history is currently stored in memory. In production, I would use Redis or another session store to support multiple users.

2. Orders are stored in a local JSON file. A real application would connect to a live database or order management system.

3. Customer authentication is not implemented. Before showing order information in production, the user should be verified using login or OTP.

4. The assistant depends on a static policy document. If Trendly updates its policies, the document would need to be updated as well.

---

# Discovery Questions for the Trendly Team

Before deploying this assistant to real customers, these are the questions I would ask the Trendly team.

### 1.

How are order details updated today? Is there an existing API that the assistant can use instead of reading from static data?

### 2.

When the assistant needs to escalate a case, which platform should it use (Zendesk, Freshdesk, Intercom, etc.)?

### 3.

For Cash on Delivery refunds, how are customers expected to securely share their bank details? Is there already a secure workflow available?

### 4.

When a customer requests a size exchange, should the assistant check live warehouse inventory before confirming the exchange?

### 5.

Before showing order information, what level of customer verification is required? Should the assistant verify using OTP, email, phone number, or another authentication method?

---

# Conclusion

This project was designed to build a reliable and policy-grounded customer support assistant rather than a general-purpose chatbot. By combining Trendly's policy document with order-specific context, the assistant is able to provide accurate responses while handling common customer support scenarios, respecting privacy, and safely escalating requests that require human intervention.