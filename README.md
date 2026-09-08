# Downtown Inn — a walkable desert motel

A first-person, single-file web scene: a two-storey Route 66 motel dropped in
the middle of the New Mexico desert. Walk the lot, let yourself into any of the
24 rooms, take the outdoor stairs to the balcony, look in on the front desk
office, and wait for dark — the pool goes the colour every Hollywood motel pool
goes at night.

Open `index.html` in a browser. There is no build step and no asset pipeline.

## What is in it

- **24 guest rooms**, all enterable, all furnished: two doubles, a nightstand
  and lamp, dresser with a CRT television, a chair at the window, and a tiled
  bathroom with a tub, vanity and mirror. Doors swing open as you reach them,
  or on `E`.
- **Two wings in an L** around the courtyard — nine bays and five bays, with a
  service alcove in each (ice machine, vending) and an outdoor stair up to the
  balcony.
- **The front desk office**: counter, key pigeonholes with fobs, register, desk
  bell (`E`), lobby seating, brochure rack, coffee urns, and the glazed street
  wall with gold drapes.
- **The pool**: a real tank with a sloped floor, waterline tile, coping, entry
  steps you can walk down and a deep-end ladder. After dark, underwater niche
  lights, scrolling caustics and an emissive water sheet throw light blue across
  the whole courtyard and up the facade.
- **The desert**: a graded pad, a two-lane highway with power poles and sagging
  wires, saguaro and creosote, boulders, tumbleweeds, and named mesas on the
  horizon.
- **A full day/night cycle** — sun and moon discs, a repainted gradient sky,
  stars, and every artificial light in the scene ramping up as the sun goes down.

## Controls

| | |
|---|---|
| Walk | `W` `A` `S` `D` (or arrows) |
| Look | drag, or pointer lock after a click |
| Run | `Shift` |
| Open door / use | `E` or `Space` |
| Zoom | mouse wheel (45°–95°) |
| Nightfall / midday | `N` / `M` |
| Scrub time | `[` `]` |
| Plan view | `O` |
| Hide HUD | `H` |

Touch: drag to look, on-screen pad to walk.

## How it is built

`index.html` is the whole game — one file, one IIFE, three.js r128 from cdnjs,
no bundler and no image assets. It follows two references:

- The **Coconuts scene technical style guide** for the engine and the look:
  every texture is drawn at runtime into a 2D canvas, materials default to high
  roughness and zero metalness, tone mapping is off and output is sRGB, lighting
  is layered base → key → fixture pools with a single shadow caster, physics runs
  on a fixed 1/60 s step, collision is AABBs resolved separately on X and Z so
  you slide along walls, and look works by drag as well as pointer lock.
- The **Project 76 sandbox** for the desert and the dressing: the value-noise
  height field, the gritty sand palette, the gradient sky dome with star field
  and sun/moon billboards, the phase-blended day/night model, and the amber CRT
  HUD.

A few pieces are specific to this scene:

- **Merge buckets.** Every static mesh is pushed into a bucket keyed by material
  and baked into one `BufferGeometry` at startup, with world-scaled UVs computed
  per box face so differently-sized boxes share a tiling texture. The entire
  motel — walls, walkways, roofs, railings, and all 24 room interiors — lands in
  under a hundred draw calls.
- **Two floors.** Colliders carry a vertical span, so the same footprint blocks
  the ground floor and the balcony independently. Walkable surfaces are flat
  plates and ramps; the player takes the highest one within step-up reach, which
  is all an outdoor stair needs.
- **A hole in the ground.** The terrain is built as a hand-rolled grid rather
  than a `PlaneGeometry` so cells can be dropped — the pool tank is a real void,
  and the fine grid around the site does not double up on the coarse one that
  carries the horizon.

`window.MOTEL` exposes the player, the clock and a `go(x, z, yaw, level)` helper
for tooling and screenshots.
