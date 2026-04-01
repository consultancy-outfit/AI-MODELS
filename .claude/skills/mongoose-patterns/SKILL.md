---
name: mongoose-patterns
description: Mongoose schema design, indexing, and query patterns for backend-app.
---

## Rules
- Design indexes from actual read paths — not speculatively.
- `timestamps: true` on every schema unless explicitly excluded.
- `.lean()` on all read-only queries.
- No `Mixed` type. Type every field. Avoid deep nesting unless justified.
- Keep schema fields aligned with DTOs and API docs. No silent drift.

## Schema + Index
```typescript
@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, index: true }) ownerId: string;
  @Prop({ enum: ResourceStatus, default: ResourceStatus.ACTIVE }) status: ResourceStatus;
}
export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.index({ ownerId: 1, status: 1 });
```

## Query Patterns
```typescript
// Read-only
const docs = await this.model.find({ ownerId }).lean().exec();

// Paginated
const [items, total] = await Promise.all([
  this.model.find(filter).skip(skip).limit(limit).lean().exec(),
  this.model.countDocuments(filter),
]);
```

## Checklist
Schema shape → Validation → Index plan → Query path → Serialization impact
