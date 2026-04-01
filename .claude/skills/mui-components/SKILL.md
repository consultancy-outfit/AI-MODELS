---
name: mui-components
description: MUI 7 component patterns, theme tokens, sx conventions, and HTML-to-MUI translation for frontend-app.
---

## Rules
- Start from design primitives: palette, spacing, type scale, radius, elevation.
- No raw `<div>` for layout — use `Box`, `Stack`, or `Grid`.
- No inline `style={{}}` — use `sx` prop only. Extract reusable wrappers when patterns repeat.
- Use `size` prop (not `xs`/`md` directly) for MUI v7 Grid.
- Loading: `Skeleton`. Error: `Alert severity="error"`. Empty: `null`.

## Theme Token Usage
```typescript
sx={{ color: 'primary.main', bgcolor: 'background.paper', p: 2 }}
sx={{ px: { xs: 2, md: 4 }, py: 3 }}  // responsive
```

## Layout
```typescript
<Stack spacing={2}>...</Stack>
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 6 }}>...</Grid>
</Grid>
```

## Translation Order
Theme direction → Page sections → Reusable components → Responsive behavior → Polish
