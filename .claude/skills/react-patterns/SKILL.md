---
name: react-patterns
description: Component structure, state ownership, and server-client boundaries in frontend-app (React 19, Next.js 16).
---

## Rules
- Default to server components. Add `"use client"` only when state, effects, refs, or browser APIs are required.
- Keep components focused on one job. Extract only after repetition appears.
- Prefer typed view models at the page or data boundary.
- Lift state only when two sibling branches need the same source of truth.

## Hook Pattern
```typescript
export function useResource(id: string) {
  const [data, setData] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setIsLoading(true);
    fetchResource(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);
  return { data, isLoading, error };
}
```

## Component Pattern
```typescript
export function ResourceCard({ id }: { id: string }) {
  const { data, isLoading, error } = useResource(id);
  if (isLoading) return <Skeleton />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;
  return <CardContent data={data} />;
}
```

## Output Shape
- Component map — State ownership — Data flow — File plan
