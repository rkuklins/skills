# Review Checklist

Evaluate the PR diff against each category below. Skip categories that are not relevant to the PR — for example, do not report on database migrations if the PR does not touch migration files.

Only report actual findings. Do not report "no issues found" for skipped categories.

## Category 0: Repository Standards (`repo-standards`)

Violations of anything defined in `AGENTS.md`, `CLAUDE.md`, and their linked documents — coding standards, testing guidelines, review criteria, architectural conventions.

Each finding in this category MUST cite the specific source document and rule. Format: "[source-file.md] specifies that [rule], but the code here does [violation]".

## Category 1: Data & Storage (`data-storage`)

- **Breaking MySQL migrations**: missing transactions wrapping DDL, locking large tables without `pt-online-schema-change` or equivalent, non-reversible DDL statements.
- **Rollback-blocking migrations**: column drops, column renames without backward-compatible aliases, adding NOT NULL constraints on existing columns without defaults, dropping indexes that existing queries depend on.
- **DynamoDB schema changes**: key schema changes (partition key, sort key), GSI/LSI additions or removals that break existing queries, changing attribute types.

## Category 2: API & Schema Contracts (`api-schema-contracts`)

- **Breaking REST API changes**: removed or renamed fields in response bodies, changed field types, removed or renamed endpoints, changed required/optional status of request fields.
- **Breaking Twirp/Protobuf service changes**: changed field numbers, removed fields (vs. deprecated), changed field types, renamed services or RPCs, removed RPCs.
- **Breaking Protobuf event schema changes on Kafka**: any change that would cause deserialization failures for existing consumers — field number reuse, type changes, removing fields that consumers depend on, changing `repeated`/`optional`/`required` qualifiers.

## Category 3: Infrastructure & Workflows (`infrastructure-workflows`)

- **Inngest workflow changes**: step ID changes that break in-flight function executions, removed steps that in-flight executions are waiting on, changed sleep/wait durations that affect retries, changed concurrency keys.
- **Configuration and environment**: new environment variables referenced in code without corresponding deployment config (e.g., Kubernetes manifests, Terraform, `.env.example`), removed or renamed environment variables.

## Category 4: Correctness & Reliability (`correctness-reliability`)

- **Acceptance criteria adherence**: if a Linear ticket was found, compare the implementation against each acceptance criterion. Flag any that are not addressed or only partially addressed.
- **Bugs and logic errors**: obvious logical mistakes, off-by-one errors, incorrect boolean logic, unreachable code paths.
- **Nil/null safety**: nil pointer dereferences (Go), null reference access (TypeScript/Java/Kotlin), missing nil/null checks before dereferencing.
- **Race conditions**: unprotected shared state in concurrent code, especially in Go (goroutines without synchronization, unsynchronized map access), but also in any language with concurrent execution.
- **Error handling**: missing error handling at system boundaries (HTTP handlers, RPC handlers, message consumers), swallowed errors, errors logged but not propagated when they should be.

## Category 5: Security (`security`)

- **Secrets and PII**: hardcoded credentials, API keys, tokens, or passwords in code. PII logged or exposed in error messages. Sensitive data in comments.
- **Injection vulnerabilities**: SQL injection (string concatenation in queries), command injection (unsanitized input in shell commands), template injection, XSS (unescaped user input in HTML/templates).
- **Authentication and authorization**: endpoints or handlers missing auth checks, privilege escalation paths, IDOR (insecure direct object references), missing ownership validation.

## Category 6: General Quality (`general-quality`)

- **Test coverage**: new or significantly changed behavior without corresponding tests. Changed logic paths without updated test assertions.
- **Dead code**: unused functions, unreachable branches, commented-out code, unused imports or dependencies.
- **Code smells**: functions doing too many things, deeply nested logic, duplicated logic that should be extracted, overly complex conditionals.
