# Prompt Engineering & System Design Log

## 1. Prompt Strategy
The core strategy relies on **Strict Policy Grounding via System Instructions**. By placing the entire trendly_policy.md file inside the model's system instructions, the model treats the policy as absolute truth and avoids generating unauthorized answers.

---

## 2. Guardrail Rules Implemented
- **No Inventions:** Explicitly instructed to refuse answering questions not mentioned in the policy document.
- **Privacy Assurance:** Prohibits sharing information across different customer accounts.
- **Financial Security:** Direct directive forbidding the collection of bank accounts, credit cards, or passwords inside chat.
- **Special Case Routing:** Instructed to route lost parcels (Section 1.6) and policy exceptions directly to human support (support@trendly.com).

---

## 3. Prompt Iteration History

### Iteration 1 (Initial Setup)
* **Prompt:** *"You are a customer support agent. Answer questions using the policy."*
* **Issue Observed:** Model was too lenient and attempted to answer general clothing questions outside store policy.
* **Fix Applied:** Added explicit refusal constraints: *"If a query is not covered by the policy or is outside your scope, state clearly that it is not covered and offer human support."*

### Iteration 2 (Adding Order Context)
* **Prompt:** *"Here is the user message and order details."*
* **Issue Observed:** Model occasionally confused delivery dates with return window eligibility dates.
* **Fix Applied:** Injected policy rules directly alongside the order context, reminding the model to calculate the 30-day return window from delivered_at rather than placed_at.

### Iteration 3 (Edge Case Handling)
* **Prompt:** Handling edge cases like non-returnable categories (jewellery/innerwear) and final sale items.
* **Fix Applied:** Embedded Category Rules (Section 2.3) and Final Sale Rules (Section 2.4) directly into system instruction boundaries, forcing refusal on hygiene/category grounds rather than date grounds.