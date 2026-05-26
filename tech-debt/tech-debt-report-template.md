# Tech Debt Assessment Report

**Report period:** [YYYY-MM-DD to YYYY-MM-DD]  
**Prepared by:** [Name]  
**Last updated:** [YYYY-MM-DD]

---

## 1. Executive Summary

[Brief overview of total debt items, highest-priority themes, and recommended next actions for stakeholders.]

---

## 2. Technical Debt Classification (The "Why")

To help non-technical stakeholders understand the necessity of the work, categorize debt into clear buckets:

| Category | Description | Business Impact if Ignored |
|----------|-------------|----------------------------|
| **Velocity / Developer Efficiency** | Inefficient CI/CD pipelines, messy codebases, lack of documentation, or rigid architectures. | Engineering slows down; new features take twice as long to build. |
| **Stability & Reliability** | Lack of automated test coverage, outdated dependencies, or fragile error handling. | High risk of production outages, bugs, and degraded user experience. |
| **Scalability & Performance** | Suboptimal database queries, monolithic bottlenecks, or poor caching strategies. | The system will crash or slow down under heavy user load. |
| **Security & Compliance** | Vulnerable libraries, unencrypted data at rest, or lack of proper audit logs. | Legal liabilities, data breaches, and loss of customer trust. |

---

## 3. Tech Debt Items

Every technical debt item logged should follow this standard template to make prioritization objective.

---

### [ID-101] Short, Descriptive Title

**Example:** Upgrade Legacy Auth Service

| Field | Value |
|-------|-------|
| **Owner / Reporter** | [Name] |
| **Component / Microservice** | [e.g., User-Service] |
| **Category** | [Velocity / Developer Efficiency \| Stability & Reliability \| Scalability & Performance \| Security & Compliance] |
| **Effort (T-Shirt Size)** | [Small \| Medium \| Large] |
| **Priority tier** | [Critical \| Strategic \| Opportunistic] |

#### A. Technical Description

A brief, objective summary of what the current implementation is and why it is considered debt.

> **Example:** Our authentication service is running on Node.js v14, which reached End-of-Life in 2023. It uses a deprecated encryption library that does not support modern hashing standards.

[Describe the current state and why it is debt.]

#### B. The Business & Engineering Impact (The Justification)

This is the most critical section for prioritization. Answer two questions:

**What happens if we fix it? (The Benefit)**

[Describe the positive outcome: security, velocity, reliability, compliance, etc.]

**What happens if we ignore it? (The Risk / Cost)**

[Describe the risk: outages, compliance failure, slower delivery, breach exposure, etc.]

> **Example:** If ignored, we cannot patch critical security vulnerabilities, leaving us exposed to compliance failures. If fixed, we ensure system security and can easily integrate with our new single sign-on (SSO) provider.

#### C. Effort Estimation (T-Shirt Sizing)

Keep it high-level during the initial reporting phase:

| Size | Estimate | When to use |
|------|----------|-------------|
| **Small** | 1–3 days | Can be tackled in a normal sprint cycle. |
| **Medium** | 1 sprint | Requires dedicated planning. |
| **Large** | Multiple sprints / cross-team effort | Requires a dedicated project initiative. |

**Selected size:** [Small \| Medium \| Large]  
**Notes:** [Optional: dependencies, unknowns, or team capacity assumptions.]

---

### [ID-102] [Next Item Title]

| Field | Value |
|-------|-------|
| **Owner / Reporter** | [Name] |
| **Component / Microservice** | [e.g., Billing-Service] |
| **Category** | [Category] |
| **Effort (T-Shirt Size)** | [Small \| Medium \| Large] |
| **Priority tier** | [Critical \| Strategic \| Opportunistic] |

#### A. Technical Description

[Describe the current state and why it is debt.]

#### B. The Business & Engineering Impact (The Justification)

**What happens if we fix it? (The Benefit)**

[Benefit.]

**What happens if we ignore it? (The Risk / Cost)**

[Risk / cost.]

#### C. Effort Estimation (T-Shirt Sizing)

**Selected size:** [Small \| Medium \| Large]  
**Notes:** [Optional.]

---

## 4. Prioritization Matrix: The Contagion & Impact Model

To prevent subjective debates about what to fix first, use a simple scoring matrix based on **Impact vs. Effort**, or calculate a **Tech Debt Interest Rate**.

### Urgency vs. Impact

| Priority tier | Risk | Velocity impact | Action |
|---------------|------|-----------------|--------|
| **Critical Debt** | High | High velocity blocker | Fix immediately. |
| **Strategic Debt** | Low | High velocity blocker | Schedule for the next 1–2 sprints. |
| **Opportunistic Debt** | Low | Low velocity blocker | Fix alongside relevant feature work. |

### Impact vs. Effort Matrix

Use this when comparing items of similar urgency:

|  | **Low Effort** | **High Effort** |
|--|----------------|-----------------|
| **High Impact** | Do now — quick wins with strong payoff | Plan as initiative — high value, needs capacity |
| **Low Impact** | Opportunistic — bundle with related work | Defer — revisit when context or risk changes |

### Summary Backlog (fill after scoring items)

| ID | Title | Category | Effort | Priority tier | Target sprint / quarter |
|----|-------|----------|--------|---------------|-------------------------|
| ID-101 | [Title] | [Category] | [Size] | [Critical \| Strategic \| Opportunistic] | [When] |
| ID-102 | [Title] | [Category] | [Size] | [Critical \| Strategic \| Opportunistic] | [When] |

---

## 5. Recommended Next Steps

1. [Immediate action for Critical Debt items.]
2. [Planned work for Strategic Debt in upcoming sprints.]
3. [How Opportunistic Debt will be paired with feature work.]
4. [Any cross-team dependencies, budget, or stakeholder decisions needed.]
