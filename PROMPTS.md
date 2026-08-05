# Prompt Engineering

This document summarizes how the prompts for the Trendly AI Customer Support Assistant evolved during development. The primary goal was to transform a general-purpose LLM into a reliable customer support assistant that responds naturally while remaining strictly grounded in Trendly's policies and order data.

---

# Prompt Strategy

The assistant follows a **strict policy grounding** approach. The complete `trendly_policy.md` is provided as part of the system instructions so the model answers only using Trendly's official policies instead of relying on its general knowledge.

Whenever an Order ID is detected, the corresponding order information from `orders.json` is dynamically injected into the prompt. This allows the assistant to answer questions using both the company policy and the customer's order details.

The objective throughout development was to keep the assistant:

- Accurate
- Policy-grounded
- Privacy-aware
- Helpful
- Natural to converse with

---

# Guardrails Implemented

Several guardrails were introduced to improve reliability and safety.

## Policy Grounding

The assistant answers only using the Trendly policy and provided order data. If a question is not covered, it clearly states that the information is unavailable and offers to connect the customer with human support.

## Privacy Protection

The assistant never reveals another customer's personal information, order details, addresses, payment information, or any confidential data.

## Financial Safety

The assistant never requests or stores sensitive information such as passwords, CVV numbers, bank account details, or card information.

## Human Escalation

Requests such as lost parcels, policy exceptions, damaged products requiring manual verification, or situations outside the documented policy are redirected to human support.

## Prompt Injection Protection

Instructions such as "Ignore previous instructions", "Pretend you are ChatGPT", or attempts to reveal internal prompts are politely refused while maintaining the original system behaviour.

---

# Prompt Iterations

## Iteration 1 – Initial Prompt

### Goal

Create a basic Trendly customer support assistant.

### Issue

The assistant answered questions outside the scope of Trendly customer support and occasionally behaved like a general AI assistant, responding to personal or emotional conversations instead of politely redirecting users back to Trendly-related support.

### Improvement

Added explicit instructions restricting the assistant to Trendly-related queries only and redirecting unrelated questions to human support when appropriate.

---

## Iteration 2 – Policy & Order Context

### Goal

Improve accuracy using company policy and customer order information.

### Issue

The assistant occasionally confused order dates while determining return eligibility.

### Improvement

Order information from `orders.json` was injected alongside the Trendly policy so return eligibility could be determined using the correct delivery date.

---

## Iteration 3 – Business Rules

### Goal

Handle special policy scenarios correctly.

### Issue

Items such as jewellery, innerwear, footwear, and Final Sale products required category-specific handling.

### Improvement

Additional instructions were added so the assistant correctly follows product-specific return and exchange rules instead of applying general return logic.

---

## Iteration 4 – Conversation Quality

### Goal

Make conversations feel more natural.

### Issue

Responses were often too long, robotic, and overly formal.

### Improvement

The assistant was instructed to:

- Keep responses concise.
- Ask only for required information.
- Respond with empathy where appropriate.
- Maintain conversation context.
- Handle short replies such as "Yes", "No", or "Okay" naturally.

---

## Iteration 5 – Safety & Edge Cases

### Goal

Improve reliability under unusual situations.

### Issue

Testing exposed prompt injection attempts, privacy attacks, rude users, and unrelated conversations.

### Improvement

Additional guardrails were added for:

- Prompt injection resistance
- Privacy protection
- Out-of-scope conversations
- Human escalation
- Professional handling of frustrated users

---

## Iteration 6 – Reducing Hallucinations & Improving Response Quality

### Goal

Make the assistant behave more like a real customer support representative by avoiding false assumptions and unrealistic actions.

### Issue

During testing, the assistant occasionally claimed to perform actions that the application could not actually perform, such as adding store credit, creating tickets, contacting the shipping team, or promising future updates. Some responses also became longer than necessary or included information that the customer had not asked for.

### Improvement

Additional instructions were introduced to:

- Never claim to complete backend actions that are not implemented.
- Explain only what the customer is eligible for according to the Trendly policy.
- Avoid making false assumptions about refunds, replacements, tickets, or shipping investigations.
- Keep responses short and focused on the customer's immediate question.
- Use more natural customer support language instead of robotic phrases.
- Limit conversation history to recent messages to maintain context while reducing unnecessary token usage and improving response speed.

---

# Final Prompt Design

The final prompt was designed around five principles:

- Answer only using Trendly policy and order data.
- Never invent policies or business rules.
- Keep responses short, natural, and professional.
- Protect customer privacy and sensitive information.
- Escalate to human support whenever required.

---

# AI Tools Used

AI tools were used throughout development as engineering assistants.

They helped with:

- Project planning
- Prompt engineering
- Backend debugging
- Code explanations
- Conversation refinement
- Edge-case generation
- Documentation drafting

All implementation, testing, integration, and final verification were reviewed before submission.

---

# Key Learnings

Developing this project demonstrated that building a reliable AI assistant requires much more than connecting an LLM to an application.

Some of the key learnings were:

- Strong prompt engineering significantly improves response quality.
- Policy grounding is essential for preventing hallucinations.
- Maintaining conversation context creates a much more natural user experience.
- Security and privacy guardrails should be built into the system from the beginning.
- Thorough edge-case testing is just as important as testing normal customer conversations.
- Testing with real customer scenarios helped identify hallucinations and improve the assistant's overall reliability.