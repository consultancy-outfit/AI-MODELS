# Frontend Rules

- Work in `frontend-app` unless the task is explicitly cross-stack.
- Keep context tight. Skip `node_modules`, `.next`, lockfiles, and generated files.
- Prefer MUI 7 and theme-driven styling.
- When converting external HTML, preserve UX structure and visual intent, not the original markup.
- Default delivery order: design direction, section breakdown, reusable components, data contract, implementation.
- Keep responses concise.
- After every 10-15 assistant replies, send `/compact` as a standalone response.

Specialists:

- `.claude/agents/ui-builder.md`
- `.claude/agents/state-manager.md`
- `.claude/agents/api-client.md`

Skills:

- `.claude/skills/react-patterns/SKILL.md`
- `.claude/skills/mui-system/SKILL.md`
