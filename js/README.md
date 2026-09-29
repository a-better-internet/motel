# How the world is put together

`index.html` is the page: the markup, the CSS, the HUD, and twenty-three
`<script src="js/…">` tags. Everything else lives here, one file per part of
the world, loaded **in order** as classic scripts sharing one global scope.

Order is load-bearing. Each file runs its top-level code as it arrives, and
by the time `19-loop.js` returns the world is built and the first frame is
scheduled. The numbering is the load order; nothing re-orders itself.

| file | what is in it |
|---|---|
| `00-config.js` | scene constants, the `IMAGES` slot map, aspect ratios |
| `01-helpers.js` | rng, geometry makers, merge buckets, the `push()` pipeline |
| `02-textures.js` | every canvas-drawn texture, and the sign-face helpers |
| `03-scene.js` | renderer, scene, cameras |
| `04-terrain.js` | the heightfield, the LOD grids, the pads cut into it |
| `05-sky.js` | sky dome, stars, sun, moon, clouds, highway traffic |
| `06-collision.js` | AABB colliders, walkable surfaces, the collider grid |
| `07-site.js` | highway, curbs, lot, landscape beds, desert scatter |
| `08-motel.js` | the two wings and everything inside the bays |
| `09-pool.js` | the pool, its water shader, its deck |
| `10-office.js` | the front desk office, and the cars parked outside it |
| `11-driving.js` | rigid body, four springs, the bicycle handling model |
| `12-signage.js` | the pole sign and the boards on it |
| `13-canteen.js` | The Rusty Canteen, inside and out |
| `14-desert.js` | out there, part one: the roadside, the drive-in, the snack bar |
| `14b-desert.js` | part two: the filling station, the mast, the tracking station |
| `14c-desert.js` | part three: the graves, the adit, the trailer, site ambience |
| `14d-diner.js` | Roxie's Diner, the car out east — inside and out |
| `15-bake.js` | glow materials, then merge and bake every bucket |
| `16-lighting.js` | the pool of real lights that follows the player |
| `17-player.js` | movement, collision response, doors, seats |
| `18-hud.js` | compass, clock, vacancy, the painted site plan |
| `19-loop.js` | fixed-timestep loop, cameras, day/night, the `MOTEL` handle |

## Two rules that matter when you add a file or move code between them

**A function declaration only hoists within its own script.** Inside the one
big file this never came up — anything could call anything. Split across
scripts it does: if a file's *top-level* code calls a function declared in a
later file, it throws on load. That is why `fitText`, `fitSerif`, `signTex`
and `signPanel` sit in `02-textures.js` rather than with the signage — the
motel, the office, the Canteen and half the desert all raise signs, and every
one of them is built before `12-signage.js` loads. Referring to a later
file's function from *inside* a function body is fine: by the time anything
is called, every script has run.

**No modules, no bundler, no build step.** ES modules will not load from a
`file://` page, and this is meant to open by double-clicking it. Classic
scripts share one global lexical scope, which is what lets these twenty-three files
behave exactly like the single file they came from.

**A wall you can stand inside has to be a ring, not a slab.** A course of
wall built as one box the full width of the building reads correctly from
outside and is a disaster in: the underside of the course above the windows
becomes the ceiling of the room, everything above it disappears, and the
course at eye level is not there at all, so the back wall is open desert.
Anything with an interior gets four thin runs and a corner at each end —
`band()` in `14d-diner.js` is the worked example.

**A doorway is a hole in every course, not just the one with the frame in
it.** The diner's front entrance had a collider hole, a step up to it and a
door leaf hung in it, and `doors18.js` reported the lane clear every single
run — because the thing blocking it carried no collider at all. Three
decorative courses of the shell (the tile skirt, its capping, the stainless
below the glass) ran unbroken along the road face, so there was 72 cm of
wall standing in the opening that you could walk straight through and still
not see past. `band()` takes a `gap` flag now and splits the road-face run
either side of the door, and the fluting that crosses the head is split the
same way. If you add a course to a wall with a door in it, split it.

**A skirt emitted in both windings shades black.** The aprons that hide the
cracks between terrain rings were built as double-wound quads so they would
show whichever side the crack opened on. `computeVertexNormals` sums face
normals per vertex and two opposite windings sum to zero, so every skirt
vertex came out with no normal and shaded pure black: the apron was hiding
the sky behind a strip of void, which looked like the same hole. They are
single-wound now and the terrain material is `DoubleSide`, which makes
three.js flip the normal on back faces instead.

**Decals stack, so the order you write them in is the order they read —
and the step has to fit the count.** Everything scattered on a flat surface
here is a plane a fraction of a millimetre above the one under it, indexed
off a counter. Two ways that goes wrong. Write the crack pattern first and
three passes of weathering on top and the cracks are gone, which is how the
diner's apron ended up as soft grey clouds with no crack in it; the thing
you want read goes LAST. And give five hundred decals a 0.4 mm step and the
topmost one is twenty centimetres in the air, so a count and a step are one
decision, not two — trim the count until a step that survives z-fighting
still fits inside a few centimetres.

**A vertex colour can only ever darken the texture under it.** `TEX.gravel`
is built on `#8a5f45`, so two dozen "spalled concrete" patches drawn in that
bucket came out as orange-red tiles scattered over grey; `TEX.paint` and
`TEX.sand` are bright, so "nearly gone" stall lines came out fresh white and
"blown sand" came out as spilled cement. Pick the bucket for the colour you
want to end at, not the material you would name the thing after.

**Two terrain rings that meet have to sample the border in step.** The
coarse ring had 12 m cells and the middle one 7 m, so along the shared line
the two only touched ground at the same place every 84 m. Where an
escarpment crossed the seam the ground moved 46 m across one coarse cell and
all of it could open as sky. The middle ring is 6 m now — 12 is a whole
number of 6 — so every coarse node on the border falls on a fine node too.
Whatever cell sizes you pick, the outer one has to be an exact multiple of
the inner one, and the inner ring's box has to land on the outer ring's
lattice at all four edges.

**The desert is three files that share three helpers.** `14-desert.js` defines
`G`, `mk` and `mkPi` at file scope and `14b` / `14c` use them. They were all
inside one `desertFinds` IIFE three thousand lines long; the blocks inside it
were already self-contained IIFEs, so lifting the wrapper off and promoting
those three was enough to let it be read in pieces. If you add a fourth
piece, it goes after `14c` and relies on the same three — `14d-diner.js` is
exactly that, and was written as a new file rather than an edit to an old
one, which is what the split was for.

## Checking it still works

The harness in the scratchpad drives a headless build: `sync.sh` mirrors
`js/` next to a local three.js, `r17c.js` is the smoke test, `doors18.js`
walks every doorway, `stuck26.js` hunts for places the player cannot leave,
`float.js` looks for clusters hanging in the air, `coplanar.js` finds faces
sharing a plane, `reach33.js` floods a building's floor from its front door
and says which rooms you can actually get to, `why33.js` walks a line and
names whatever is standing in it, and `drive29.js` / `jump30.js` /
`jitter31.js` exercise the car. `seam35.js` hides each terrain ring in turn
and measures how far apart the rings are along their shared border, which is
the only way to tell a hole in the world from a hole in one mesh.
