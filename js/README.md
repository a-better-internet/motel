# How the world is put together

`index.html` is the page: the markup, the CSS, the HUD, and twenty-two
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
scripts share one global lexical scope, which is what lets these twenty-two files
behave exactly like the single file they came from.

**The desert is three files that share three helpers.** `14-desert.js` defines
`G`, `mk` and `mkPi` at file scope and `14b` / `14c` use them. They were all
inside one `desertFinds` IIFE three thousand lines long; the blocks inside it
were already self-contained IIFEs, so lifting the wrapper off and promoting
those three was enough to let it be read in pieces. If you add a fourth
piece, it goes after `14c` and relies on the same three.

## Checking it still works

The harness in the scratchpad drives a headless build: `sync.sh` mirrors
`js/` next to a local three.js, `r17c.js` is the smoke test, `doors18.js`
walks every doorway, `stuck26.js` hunts for places the player cannot leave,
`float.js` looks for clusters hanging in the air, `coplanar.js` finds faces
sharing a plane, and `drive29.js` / `jump30.js` / `jitter31.js` exercise the
car.
