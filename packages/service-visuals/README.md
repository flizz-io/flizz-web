# @workspace/service-visuals

A small library of Three.js "specimen" visuals — one distinct wireframe/point
motif per idea (a layered stack, a pulsing orb, an orbiting ring…), each
mountable standalone. A service picks one by its stable `ServiceVisualKind`
key; the same key is what a future admin CRUD picker will let an operator
choose from when creating a service, so the palette itself lives here rather
than inside any one app.

## Usage

```tsx
import { ServiceVisual } from '@workspace/service-visuals';

<ServiceVisual
	kind="layered-stack"
	focused={isHovered}
	className="aspect-square"
/>;
```

`focused` is read every frame through a ref, so toggling it never remounts
the scene — hover/focus states stay cheap.

## Adding a specimen

1. Add the id to `SERVICE_VISUAL_KINDS` in `src/types.ts`.
2. Add a `visuals/<id>.tsx` exporting a `build: ServiceVisualBuilder` — it
   receives the scene and the current accent/ink colors, and returns
   `{ update(elapsed, focused), dispose() }`.
3. Register it in `src/registry.ts`.

The shared lifecycle (renderer, camera, resize, IntersectionObserver gating,
`prefers-reduced-motion`, teardown) lives in `use-service-visual-scene.ts` —
visuals never touch it directly.
