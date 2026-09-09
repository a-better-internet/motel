# Downtown Inn — a walkable desert motel

A first-person, single-file web scene: a two-storey Route 66 motel dropped in
the middle of the New Mexico desert. Walk the lot, let yourself into any of the
24 rooms, take the outdoor stairs to the balcony, look in on the front desk
office, and wait for dark — the pool goes the colour every Hollywood motel pool
goes at night.

Open `index.html` in a browser. There is no build step and no asset pipeline.

## What is in it

- **24 guest rooms**, all enterable, all furnished: two doubles (or a king in
  every fourth room), a nightstand with a lamp and a clock radio, a dresser with
  a CRT television, a mini fridge and microwave, a coffee maker and ice bucket,
  a chair at the window under a valanced drape, a suitcase on the rack, and a
  tiled bathroom with a tub, vanity, mirror, folded towels and a bath mat. Doors
  swing open as you reach them, or on `E`.
- **Two wings in an L** around the courtyard — nine bays and five bays, with a
  service alcove in each (ice machine, vending) and an outdoor stair up to the
  balcony.
- **The front desk office**, done up the way these places always were: knotty-pine
  dado, a wagon-wheel chandelier, a longhorn skull and a jackalope on the wall,
  a saguaro in a terracotta pot, a spinning postcard rack, soda and cigarette
  machines, a payphone, a television on a bracket, a rag rug, a hat rack, and
  the counter itself with key pigeonholes and fobs, register, guest book and a
  desk bell you can ring (`E`).
- **The pool**: a real tank with a sloped floor, waterline tile, coping, entry
  steps you can walk down and a deep-end ladder. After dark, underwater niche
  lights, scrolling caustics and an emissive water sheet throw light blue across
  the whole courtyard and up the facade.
- **The desert**: a graded pad, a two-lane highway with power poles and sagging
  wires, saguaro and creosote, boulders and tumbleweeds. Two escarpments with
  wandering rim lines close the valley, with steep-sided buttes standing clear
  of them and sedimentary strata banding every cliff face. Clouds drift, birds
  circle, and the roadside carries a billboard, a mailbox, newspaper boxes and a
  bus bench, with a water tower away to the west.
- **The rest of the property**: thirteen parked cars — sedans, a pickup, a panel
  van — built from the same primitive stack as the Project 76 chassis; a
  chain-link fence around the back; a service yard with a dumpster, a propane
  tank, condensers, oil drums, a laundry line and stacked mattresses; and
  benches, planters, ice chests and cigarette urns along the walkways.
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
  and three rings (2 m over the site, 7 m across the canyon country, 24 m to the
  horizon) each cut a hole for the finer one inside it.
- **Light you can look at.** Tone mapping is off, per the style guide, so
  nothing may exceed a radiance of 1. Fixtures run at low intensity with a decay
  around 1.2 rather than the physical 2, which spreads the falloff and keeps
  cream walls off the clip ceiling; indoor lamps stay lit through the day, since
  a motel room with the drapes drawn has no daylight to speak of.

`window.MOTEL` exposes the player, the clock and a `go(x, z, yaw, level)` helper
for tooling and screenshots.
