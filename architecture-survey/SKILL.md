---
name: repo-architecture-survey
description: Build an architectural picture of a codebase or engineering org you've never seen. Use when asked to map services, understand system structure, or produce an architecture overview from source code.
---

Survey the architecture of: $ARGUMENTS

## Methodology

Five phases, each building on the last. Don't skip ahead — topology-first prevents wasted effort on irrelevant repos.
TODO: VErify my flow and questions

### Phase 1: Repo Discovery

**Goal:** Identify the full set of relevant repositories.

```bash
# Full org scan with metadata (never use -q without --json)
gh repo list <org> --limit 300 --json name,description,pushedAt 2>&1 | python3 -c "
import sys, json
from datetime import datetime, timezone, timedelta
repos = json.loads(sys.stdin.read())
cutoff = datetime.now(timezone.utc) - timedelta(days=30)
for r in repos:
    pushed = r.get('pushedAt','')
    if pushed and datetime.fromisoformat(pushed.replace('Z','+00:00')) > cutoff:
        print(f\"{r['name']}: {r.get('description','')}\")
"
```

Key principles:
- **Activity-windowed scan** (30-day recency) finds what's actually live. "Most stars" or "top PRs" are misleading.
- **Filter bot/automation accounts early** — look for names like chronoism, scaffolder, dependabot, renovate, github-actions.
- **Check for meta-repos** (docs, policy, tooling) — useful for context but not architecture. Set them aside.
- **Clone in batches by functional cluster** — don't clone 100 repos blindly.

### Phase 2: Topology from Connective Tissue

**Goal:** Understand the system's shape before reading individual services.

Scan these first — they reveal all product domains, data flows, and service relationships at once:

1. **API gateway / supergraph schema** — GraphQL federated schema, OpenAPI specs, or gateway route configs show every product domain.
2. **K8s workload configs** — ArgoCD ApplicationSets, Helm charts, resource limits reveal deployment topology and relative scale.
3. **Event schemas** — Kafka topic names, Protobuf definitions, event registry. These reveal the data flow graph.
4. **Service discovery** — Consul configs, DNS SRV records, Istio VirtualServices, internal service registries.
5. **eng-doc / internal docs repo** — architecture diagrams, ADRs, glossary. These are the org's own map (possibly stale but useful framing).
6. **Infrastructure-as-code** — Terraform/Terragrunt modules, EKS configs reveal cloud topology, account structure, region strategy.

From these, sketch the system's layers and group repos into functional clusters before diving into any individual service.

### Phase 3: Per-Repo Scan (Consistent Pattern)

**Goal:** Extract the architectural role of each service quickly.

For each repo, always in this order:
1. `ls` — top-level structure (monorepo? single service? library?)
2. README.md — stated purpose (may be stale)
3. Main entry point — `main.go`, `cmd/*/main.go`, `app.rb`, `src/main/*`, `server.ts`, etc.
4. Config files — these are more truthful than README. Look for:
   - Database connection strings (MySQL, Redis, DynamoDB, Bigtable, Spanner)
   - Kafka topic names (consumed and produced)
   - External service URLs/hostnames
   - S3 bucket names
   - Environment variables with service names
5. Proto/OpenAPI/GraphQL definitions — the typed contract this service exposes
6. AGENTS.md / CLAUDE.md — sometimes contains useful architectural context about the repo's role

**Config files > README.** Connection strings don't rot. READMEs do.

### Phase 4: Cluster Analysis

**Goal:** Understand each functional domain as a unit.

- Group repos by functional domain (upload pipeline, social graph, recommendations, etc.) — not by team or language.
- Analyze clusters in parallel (spawn agents per cluster for speed).
- Each agent writes a structured intermediate file with: services in the cluster, data flow between them, storage backends, external dependencies, known issues.
- Write intermediate files to a persistent location (e.g., `~/proj/sc-research/arch-*.md`) — these survive context compaction and enable handoff between sessions.

### Phase 5: Synthesis

**Goal:** Produce the unified architecture document.

- Read all intermediate cluster files together.
- Structure around the organizing question (e.g., "What is X and how is it structured?") not "what repos did we look at."
- Include: system diagram (ASCII or Mermaid), key subsystems (one section each), technology choices table, architectural patterns, known gaps.
- Be explicit about what's confirmed from code vs. inferred from naming/context.
- Date-stamp and list sources.

## Anti-Patterns to Avoid

- **Don't sample by popularity** — `--limit 20` sorted by stars/PRs misses critical infrastructure repos with low PR velocity.
- **Don't read services in isolation** — you'll miss that "okidoki" is just a gateway to Mothership unless you see the callers first.
- **Don't trust repo names** — `yoda-the-encoder` might be a PII obfuscation service. `captions` might be user-created annotations, not speech-to-text.
- **Don't conflate "has AGENTS.md" with "actively uses AI"** — many are aspirational.
- **Don't try to read JSONL agent transcripts directly** — they overflow context. Use the agent result summary.
- **Use general-purpose agents, not Explore-type** — Explore agents lack Bash access and can't run `ls`, `find`, or `cat` on repos.

## Output Format

Write intermediate files per cluster:
```
arch-<cluster-name>.md  (e.g., arch-media.md, arch-social-stream.md)
```

Write a synthesis index pointing to all inputs:
```
arch-synthesis-index.md
```

Write the final architecture overview as a standalone document answering the organizing question.
