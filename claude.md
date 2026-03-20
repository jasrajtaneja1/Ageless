# Claude Instructions

## Source of truth
Always read `spec.md` before making changes. Treat `spec.md` as the primary source of truth for requirements, scope, and intended behavior.

## Required workflow
For every coding task:
1. Read `spec.md`
2. Inspect the relevant files and understand the current implementation
3. Run relevant unit tests if available
4. Make the smallest clean change that solves the issue
5. Refactor where appropriate to improve clarity, efficiency, and maintainability
6. Run tests again after changes

## Refactoring rules
Prefer refactoring over quick patches.
Reduce duplication.
Simplify complex logic.
Improve naming and readability.
Remove dead code where safe.
Do not change behavior unless required by the task or `spec.md`.

## Efficiency
Favor solutions that are efficient in performance, simple in design, and easy to maintain.
Avoid overengineering.
Avoid unnecessary abstractions.
Prefer existing utilities and patterns over creating new ones.

## Codebase consistency
Follow the existing architecture and coding style.
Keep changes scoped and minimal.
Do not introduce unnecessary dependencies.
Do not duplicate logic already present elsewhere in the codebase.

## Testing and validation
Run relevant unit tests before and after changes whenever possible.
Do not claim code is working unless it has been verified by tests or explicit validation.
If tests cannot be run, state that clearly.

## Communication
Be explicit about:
- what files were changed
- why the change was made
- what was refactored
- what tests were run
- any risks, assumptions, or unresolved issues