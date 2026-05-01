# Backlog

Anything explicitly deferred from the phase plan goes here, with reasoning.

## Phase 1

- _(none — Phase 1 ships everything the spec requires)_

## Cross-cutting

- **Reviews provider integration (Trustpilot / Junip).** Spec §4 Phase 6 ships
  the review UI + data model only. Integration with a real provider is
  deferred until commercial choice is made.
- **Address autocomplete (Loqate / Google Places).** Optional per spec §4
  Phase 6. Decision deferred — plain inputs ship first.

## Phase 2 deviations from spec

- **`hurc-sendcloud` plugin added.** Spec lists five custom plugins; we add
  a sixth because no maintained Sendcloud npm SDK exists. Captured in
  ADR-0002 §R2.
- **`@vendure/payments-plugin` is on 3.5.6 while core is 3.6.2.** Captured
  in ADR-0002 §R1; revisit if the satellite plugin catches up before Phase 2
  starts.
