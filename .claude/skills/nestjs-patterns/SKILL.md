---
name: nestjs-patterns
description: NestJS 11 module, controller, service, and DTO patterns for backend-app.
---

## Rules
- Separate `controller`, `service`, `dto`, and schema concerns strictly.
- Controllers route only — thin. Services hold all logic and are testable.
- Validate incoming data with DTOs + `class-validator`. Document with `@ApiProperty`.
- Add tests close to behavior changes when risk is non-trivial.

## Module / Controller / Service
```typescript
// Module
@Module({
  imports: [MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }])],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}

// Controller
@Get(':id')
@ApiResponse({ status: 200, type: ResourceResponseDto })
async findOne(@Param('id') id: string): Promise<ResourceResponseDto> {
  return this.resourceService.findOne(id);
}

// Service
async findOne(id: string): Promise<ResourceResponseDto> {
  const doc = await this.model.findById(id).lean().exec();
  if (!doc) throw new NotFoundException(`Resource ${id} not found`);
  return plainToInstance(ResourceResponseDto, doc);
}
```

## Output Shape
Module impact → Endpoint contract → DTO/validation changes → Service + test plan
