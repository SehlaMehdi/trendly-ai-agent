# Trendly AI Customer Support Assistant

An AI-powered customer support assistant built for Trendly, an e-commerce store. The assistant helps customers with order tracking, returns, refunds, shipping, exchanges, and store policy questions by using strict policy grounding and real-time order context.

---

# 🚀 Quick Start

## Local Base URL

```
http://localhost:3000
```

## Start Command

```bash
npm start
```

or

```bash
node backend/server.js
```

---

# 📋 Prerequisites

- Node.js v18 or above
- A free Groq API Key

Get your API key here:

https://console.groq.com

---

# 🛠 Installation

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd trendly-ai-agent
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a file named `.env` in the project root.

Add the following:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

## 4. Run the application

```bash
npm start
```

Open your browser and visit:

```
http://localhost:3000
```

---

# 🏗 Project Architecture

```
trendly-ai-agent/

├── backend/
│   ├── data/
│   │   ├── orders.json
│   │   └── trendly_policy.md
│   │
│   ├── routes/
│   │   └── chatRoutes.js
│   │
│   ├── services/
│   │   ├── dataService.js
│   │   └── groqService.js
│   │
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── .env
├── PROMPTS.md
├── SOLUTION.md
└── README.md
```

---

# ⚙ How the Assistant Works

1. The user sends a message from the chat interface.

2. The frontend sends the request to the Express backend.

3. The backend checks whether an Order ID (TR-XXXX) is present.

4. If an Order ID is found, the corresponding order is retrieved from `orders.json`.

5. The complete Trendly policy (`trendly_policy.md`) is loaded.

6. The backend injects the relevant order details together with the policy into the LLM prompt.

7. The Groq LLM generates a response while following the system instructions and policy constraints.

8. The response is returned to the frontend and displayed to the customer.

---

# ✨ Features

- Order status lookup
- Shipping policy assistance
- Return eligibility checks
- Refund guidance
- Exchange support
- Policy grounded responses
- Human escalation where required
- Privacy protection for customer information
- Multi-turn conversation support
- Prompt injection resistance
- Out-of-scope query handling

---

# 🤖 AI Usage

AI tools were used as development assistants throughout this project.

They assisted with:

- Project architecture planning
- Folder structure design
- Prompt engineering
- Conversation guardrails
- Backend debugging
- API integration
- Test case generation
- Documentation drafting

All implementation, testing, integration, and final verification were reviewed before submission.

---

# 📄 Documentation

## PROMPTS.md

Contains:

- Prompt evolution
- Prompt engineering decisions
- Guardrails
- Prompt iterations

---

## SOLUTION.md

Contains:

- Architecture overview
- Design decisions
- Trade-offs
- Known limitations
- Five discovery questions for Trendly

---

# 🧪 Testing

The assistant was tested using:

- Happy path scenarios
- Policy edge cases
- Multi-turn conversations
- Privacy and security tests
- Prompt injection attempts
- Out-of-scope questions
- Human escalation scenarios

---

# 📦 Deliverables

- ✅ README.md
- ✅ PROMPTS.md
- ✅ SOLUTION.md
- ✅ Source Code
- ✅ Demo Video

---

# 📌 Technology Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### AI

- Groq API
- Llama 3.3 70B Versatile

---

# 👤 Author

Built as part of the **Yellow.ai Forward Deployed Engineer (Intern) Screening Assignment**.