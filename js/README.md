# How the world is put together

`index.html` is the page: the markup, the CSS, the HUD, and twenty-four
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
| `14e-speakeasy.js` | the equipment shelter, the shaft, the tunnel, The Dry Well |
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
scripts share one global lexical scope, which is what lets these twenty-four files
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

**You stand on the triangles that are drawn, not on the field they came
from.** `Terrain.heightAt` is a continuous analytic function; the terrain is
drawn by sampling it on a lattice of 0.5, 2, 3, 6 or 12 m and joining the
samples with flat triangles. On the flat those differ by millimetres. On the
flank of a mesa, where the field climbs most of a metre per metre, a 6 m
cell cuts the top off a spur or bridges a gully — a probe measured the two
**7.2 m apart**. So a player walking at `heightAt` sinks into the hillside
they can see or strides out into the air above it, which is what "the mesas
feel hollow and you fall through them" was. `Terrain.groundAt` finds the
finest ring that actually draws a triangle at that point, works out which of
the cell's two halves the point is in, and interpolates it. `groundY` uses
it, and so does everything that puts an object on the desert — a rock placed
at `heightAt` hangs over the slope it is meant to be lying on for the same
reason. Inside this one file, `grid()` samples the analytic field, because
that is what `groundAt` is interpolating; everywhere else wants `groundAt`.

**A doorway probe tests the hole. It does not test whether you can get to
the hole.** The door to the manager's apartment passed `clear36` and
`doors18` and was unusable in play, because the route to it ran through a
20 cm slot between the end of the front desk and the soda machine. You bump
along the furniture and never find it. The test for this is `reach33` run
over the WHOLE floor from the building's own front door — not over the room
the new door opens into. Run it every time a door goes into a room that
already has furniture in it.

**A stair is not a line at one height, so `why33` cannot test one.** It
walks a fixed y and asks whether each point is blocked, which on a flight
either passes under it or through it. `climb37` carries the height along the
way the player does — `surfaceY` from where you just were, then `blocked()`
at the height that gives — and names the first step that will not take. It
found the lookout's top tread stopping 43 cm short of the catwalk, so you
climbed thirty-one treads and walked off the end of the last one.

**Two surfaces on one plane flicker; interpenetration is free.** The glitch
down both sides of the diner's kitchen doorway was a jamb 0.06 thick offset
0.03, so its outer face landed exactly where the bulkhead's run ended. The
fix is to make it 0.11 and let it overlap — you never see the inside of a
solid. `coplanar.js` over a building finds these; it found 141 pairs in the
diner, the worst of them sixteen square metres of quarry tile laid one
millimetre over the hex floor underneath it. Scattered decals are the other
big source: twenty stains all pushed to the same depth is twenty overlapping
pairs, so give each one its own millimetre.

**Nothing carries a collider, so check the geometry.** This is the same bug
three rounds running and it is always the same shape: something is drawn
across an opening, none of it collides, and `doors18.js` — which walks
colliders — reports the lane clear while you stand in the doorway unable to
see in. It was three courses of shell wall, then the wainscot's chrome cap
rail and the sill ledge over it running the full length of the car, then a
stoop handrail a metre off the door centre at chest height. `clear36.js`
walks every triangle of every baked bucket against a prism drawn through
the opening and names the bucket and the height band. Run it on every
doorway you touch, and on every new one before you ship it — it caught a
full-width oak chair rail across the office's brand-new apartment door, and
a board of room keys hung on the door's own centre-line, in the same
session they were written.

**A vertex test is not enough to find what is in a doorway.** The first cut
of `clear36.js` asked whether any of a triangle's three corners was inside
the prism, and the diner's wainscot is one plane the full width of the car:
both of its triangles pass clean through the opening with every corner
metres away on either side. It reported the door clear. It does the
separating-axis test now — thirteen axes, triangle against box — which
finds a triangle crossing the opening however far away its corners are.

**Lay a room out from a plan, with a named lane nothing may enter.** The
manager's apartment was first placed by eye, each thing against the nearest
wall, and it came out with the bed and the fridge inside each other and the
door opening onto the bed. It is laid out from a block of named anchors at
the top of the function now, with `LANE` as the strip from the door into
the room. That is the same rule the doorways get from `clear36.js`, applied
to a room instead of an opening.

**A registry other files push into has to be declared before all of them.**
`GLOW` — the list 19-loop walks once a frame to ramp everything that
changes with the time of day — sat at the top of `15-bake.js` for twenty
rounds, because nothing earlier had ever registered a lamp. The moment
14c did, for the obstruction light on the mast, the page threw on load. It
lives in `01-helpers.js` now, with `ANIM`.

**A path up a steep slope has to be cut INTO the ground, and the ground has
to be drawn finely enough to show it.** The fire road up the lookout butte
is a 6.4 m bench forced into `heightAt` along a polyline, blending out over
seven more metres either side — which is the cut bank above it and the fill
below. Laid on top of the terrain instead it would either float off a
forty-degree flank or be buried in it, and you can walk on neither. Two
things it needs: the butte's own `flat` had to come down from 0.80 to 0.42
so there was a flank to put a trail on at all, and the butte gets 3 m cells
of its own, because at the middle ring's six the bench is one cell wide and
smears into a slight lean on the hillside — a trail you can walk up and
cannot see.

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
piece, it goes after `14c` and relies on the same three — `14d-diner.js` and
`14e-speakeasy.js` are
exactly that, and was written as a new file rather than an edit to an old
one, which is what the split was for.

**A doorway is a hole in every course — and the probe has to look on both
sides of the wall, not through it.** The door into the manager's apartment
was cleared three rounds running and was still a wall in play. The stucco
had its opening, the frame and reveal were right, the dado was split round
it — and the plaster lining ABOVE the dado ran the full width of the office
straight across the hole, eight centimetres proud of the wall. It survived
every check because the clearance prism was the thickness of the wall slab,
and a lining stands clear of the wall on the room side. **Run the prism a
good metre into the room at each end.** The same prism then catches the
other half of it: a PRIVATE card screwed to the door's own centre-line.
Nothing but the leaf goes between two jambs — not a sign, not a hook, not a
key board.

**A surface you can see is not a surface you can stand on.** The highway
slab is 30 cm deep with its top at y = 0, laid on a corridor the terrain
grades to -0.25, and nobody ever called `addFlat` on it — so every car on
Route 66 drove a quarter of a metre down inside its own asphalt. The painted
kerb was worse: eleven centimetres between where the sidewalk's flat stopped
and where the lot's began, registered to nothing, so you fell 55 cm into the
kerb along the whole frontage. **Every slab you draw needs a matching
`addFlat`, two flats that meet have to overlap** (the bounds test is strict,
so the motel lot ending at x = -52 and the bar's lot starting at x = -52
left a line one sample wide belonging to neither), **and `sink38.js` is the
probe: it raycasts down onto the baked scene and compares the first hit with
`surfaceY`.**

**A thing seen from a mile away gets ONE layer.** The fire road up the
lookout butte had a running surface, two ruts, a crown, drifted dust along
both edges and a spoil mound every seventh segment. Up close that is a
road; from the valley floor, which is where you look at that hill, it is a
bright scribble up the flank — detail you cannot resolve does not vanish,
it averages into noise. One strip, one colour, one width.

**A path to every landmark is a map with the answers printed on it.** Every
find in the desert used to sit on the end of its own graded track running
back to the highway, so from the air nothing was ever found, only followed.
Tracks now carry a `reach`: the fraction that was ever maintained, after
which they narrow away to nothing in open ground. Only the two places that
were businesses on this road — the filling station and the drive-in — keep
a way in all the way to the door.

**Three sticks that nearly touch is not a ladder.** The pool ladder's stiles
floated 35 cm off the tank floor and stopped 4 cm above the coping; its hand
grips hung 20 cm clear of them, joined to nothing; three rungs covered the
top third of the climb. A ladder, a grab rail, a bent handrail — anything
made of tube — is built by **chaining** the numbers: each piece starts where
the last one ended, with a quarter torus at every change of direction. Built
that way it cannot come apart.

**Tilt a roof over square-topped walls and you have built a clerestory.**
The shed behind the canteen shed 52 cm over its depth, so where the back
edge met the wall head the front edge stood half a metre above it — an open
slot across the front and tapering down both sides. A pitched roof needs the
walls built up to meet it: an upstand at the high end, a closer at the low
one, and a raking infill up each side laid at the roof's own angle and hung
off the roof's own frame, so if the roof moves they move with it.

**Two voids that meet have to overlap, and it is worse than two flats.**
The route into The Dry Well is five volumes end to end — shaft, tunnel leg,
tunnel leg, anteroom, room — and `voidAt`'s bounds test is strict, so the
one sample that landed exactly on the seam between two of them belonged to
neither. With flats that costs you a step; with voids it is unrecoverable,
because `surfaceY` asks `voidAt` about the height you are ALREADY at: the
moment the seam hands you the desert four metres overhead, you are standing
on the roof and every later query agrees with it. Every void here runs 40 cm
long into its neighbour.

**A collider's floor is a real number, not a round one.** The compound fence
was given `y0 = -2` the way every fence in this world is, and the tunnel
leaves the compound under its south run — so for the forty metres that
followed, a chain-link fence four metres underground stood across a concrete
tunnel. The same bug in a second costume: the hut's south wall ran from a
metre below its slab, and the flight passes beneath that wall two and a half
metres down, so an invisible lintel stopped you dead on the thirteenth
tread. **Anything you will later dig under needs to be asked how deep it
actually goes**, and a wall over a stair is a lintel, not a wall.

**A plane's normal is +z, and `ry` turns it.** A wall lining faces
`(sin ry, 0, cos ry)`, and the direction it must face is into the room — so
the speakeasy's north wall takes `ry = 0` and the manager's apartment's
north wall takes `π`, because the room is on the other side of it. They were
written the same and were opposite. Anything standing proud of a lining — a
cap rail, a frame, a sconce — is offset ALONG that same normal rather than
by a hand-written sign, so the two can never disagree again.

**One owner per surface.** The hut's floor was laid twice: once as a ring of
apron flats with the stairwell left out, and once as a single rectangle over
the whole footprint — and `surfaceY` takes the highest surface it can reach,
so the rectangle won and you walked out over the hole on air. Anything with
a hole in it has to be registered with the hole in it, by whichever piece of
code owns it, once.

**Traffic you cannot move is scenery with a paint job.** Putting a car into
the side of a moving truck at fifty and watching the truck carry on down the
white line was the single thing that most gave this highway away. A struck
vehicle now carries a sideways velocity and a lost-speed term, and its
heading is not animated at all — it is made to point down its own velocity
with one `atan2`, so the slew, the correction and the fishtail all come out
of the same number and cannot disagree with the path it takes.

**Under the ground there is no sky.** The hemisphere light stands in for the
sky and the ground bouncing light about, and the key is the sun; forty feet
down there is neither, and leaving them up lit the tunnel from above with
nothing at noon. `addBuried` registers a volume, and the loop fades both out
over about a third of a second while the camera is inside one — which is
what makes the stair a transition rather than a cut, and what makes the
"buried" glow kind (fixed emissive, not on the clock) do the whole job.

**A terrain apron is a curtain if you ever dig under it.** Every LOD ring
hangs a skirt off its border and off the inside of each of its holes, forty
or fifty metres deep, to cover the crack where two levels of detail
disagree. That is free while the only thing under the desert is more desert.
The look ring's east edge is at x = -120 **exactly**, and The Dry Well runs
from -133 to -114 — so that ring's apron and the middle ring's matching hole
apron both hung straight down through the middle of the bar: a fifty-metre
sheet of ground, lit like a wall, standing between the banquette and the
counter. It took a ray probe to name it, because from inside it is simply a
large pale wall and nothing in 14e-speakeasy.js draws one.
`SKIRT_GAPS` in `04-terrain.js` drops the apron to 1.2 m over a listed box —
still several times the crack, nowhere near the ceiling. **Anything
excavated under this terrain has to be listed there**, and the first thing
to check when a room has a wall in it that no file draws is the ring edges
it straddles.

**A stain is never the same stain twice, and a map has edges.** The streak
map was opaque along its top row, so every plane carrying it ended in a hard
horizontal line — and since `planeGeo` hands every instance the same 0..1
UVs, it was the *same* hard line in the *same* pattern, forty times over a
property. Two halves to the fix: the map now fades in at the top and has a
soft margin on all four sides, so a crop of it can never land on a cut; and
`streakGeo(w,h)` takes a different crop each time — a random offset, a
random scale under one, a random flip — off a counter, so it is
deterministic without being repetitive. Any decal pushed in a loop wants
this; `planeGeo` is for things whose UVs mean something.

**A landing is floor nobody asked for.** The flight down from the equipment
shelter started 58 cm inside the hut, which put a strip of concrete between
the threshold and the opening — and a strip of concrete is exactly what you
see when you open the door. It starts at the threshold now, and because a
door leaf must never swing out over a stairwell, the door opens outward.
Plant room doors do anyway.

**A reveal is centred on the wall it lines, not on a number of its own.**
The speakeasy's door reveal was built 0.30 deep off the anteroom's own wall
thickness while the wall between them is the room's, 0.34 — so the reveal's
far face landed exactly on the wall's, and two surfaces on one plane flicker
from the whole length of the tunnel. Lining a hole means standing proud of
the thing you are lining, on both faces.

**Two faces on one plane fight; two faces that butt do not.** This is the
whole of the z-fighting rule and it is worth stating once properly. The
depth buffer cannot separate two surfaces at the same depth, so they
speckle and swap as you move — *but only if they face the same way*. Where
two boxes merely meet edge to edge, their shared faces point in opposite
directions and backface culling throws one away, so butting is free and
overlapping is the thing to avoid. Which gives the working rules: a slab
and its finish are never the same height (the entry platform had thirty-
eight square metres of concrete and boards at TD+0.01); a riser's ends go
*inside* the treads above and below it, not half a millimetre under them; a
wall's foot sinks into the slab it stands on rather than resting level with
its top; anything applied to a surface — a plate on a door, a shade on its
stem, a worn board, a wall stain — sits at its own depth, and if there are
twenty-six of them, that is twenty-six depths a fifth of a millimetre
apart. `coplanar.js` finds all of it; it does not know about
`depthWrite:false`, so same-plane pairs between two unlit decal buckets are
noise. The ones that matter have `dp` at 0.0000 and an opaque bucket on at
least one side.

**Flats overlap; the concrete butts.** `addFlat`'s bounds are strict, so two
walking surfaces that *meet* exactly leave one line with no surface on it at
all, and on that line you drop to whatever is underneath. The hut's apron
and its floor met at the threshold — the one line every visitor crosses —
and walk39 caught the player 21 cm down in the desert standing in the
doorway. Grow every flat 10 cm into its neighbours. The exception is an
edge that faces a hole: a flat laid over a stairwell is the floor across the
opening, which is the complaint this round started with.

**An unlit decal is a constant brightness.** A `MeshBasicMaterial` stain
does not care how lit the wall behind it is, so in a room whose brightness
falls away between the sconces the "stain" ends up brighter than the plaster
and reads as fog hanging on the wall. Age that has to sit *in* a surface
rather than *on* it wants the same material class as the surface and a
vertex colour below it, so it can only ever darken. The same goes for a
shared bucket's emissive: the `mirror` bucket's cold blue reads as a sheet
of daylight behind an amber bar, which is why the speakeasy has its own.

**An emissive does not illuminate.** Every low table in The Dry Well had a
candle on it and none of them was lighting anything: the flame is an
emissive material, which is bright and casts nothing. The real lights are a
pool of nine that follows the camera and they are all spoken for. An
additive disc on the table under each flame costs one transparent quad and
is what makes the room read as candlelit.

**A HOLE GOES THROUGH EVERY COURSE, INCLUDING THE ONES YOU CANNOT SEE.**
The shelter's stairwell was reported blocked three times. The floor above
it was correctly built in three pieces round the opening both times it was
"fixed" — and the 80 cm mass of concrete *underneath* that floor was poured
as one box across the whole footprint, burying the first four treads and
leaving a continuous surface where the stair should be. Nothing in the file
reads as a wall across a stair, which is why reading it never found it: a
ray probe put 64% of the frame on that slab and hit no tread at all. So the
rule is not "cut the opening in the floor" but **every layer that spans the
footprint — the flats, the finish, the mass, the fill under a balcony — is
built with the hole in it**, and the way to be sure is to cast rays rather
than to read.

**A shaft that breaks the surface has to be cut out of the surface too.**
The stairwell's third report was not the concrete at all. With the slab
opened, what you were looking at was the desert: the terrain mesh runs
straight across the bore sixteen centimetres under the hut's floor, and no
amount of boxes will hide a horizontal plane you are looking down at. The
fix is a hole in the ground — `SHELTER_SITE`, a half-metre ring dropped
into the 6 m one (the coarse ring can only skip whole 6 m cells, which
would have taken the compound with it), with the bore as a hole in that.
Three things have to go with it: the fine ring's patch must reach past
anything buried that crosses its own rim (the mid ring hangs a 55 m apron
there, and leg A of the tunnel runs underneath), and both that rim and the
bore need `SKIRT_GAPS` entries — 1.2 m for the patch, 10 cm for the bore,
because even a short apron hung round the stairwell is a curtain across the
flight.

**A stair's riser closes the face ABOVE its own tread.** The shelter's
risers sat at `ty - RISE/2`: the gap between a tread and the NEXT one down,
which is behind the tread and can never be seen. The flight therefore had
no risers at all and from above read as a ramp. One step out in either
direction and a stair stops being a stair.

**Clear width is the structural opening MINUS what you line it with.** A
reveal that straddles its jamb stands proud into the opening on both sides;
a 1.10 structural opening with 4.5 cm of reveal each side gives 1.01 of
clear width, which does not pass a 1.06 leaf. That is a doorway blocked by
arithmetic rather than by a wall, and it is the subtler half of the reason
doors here keep coming out shut.

**A setback is measured from the body, not from the foot.** `PLAYER_R` is
34 cm, so a collider 2 cm behind the edge of a floor still catches someone
standing on that edge. The auditorium's balcony fill had to come back 45 cm
before you could take the first step down the stair in front of it.

**The map a bucket carries decides whether a shape has edges.** The
speakeasy's armchairs were in a `velvet` bucket whose map was `TEX.carpet`
— a coarse loop pile, which at carpet scale is right and on a 90 cm chair
is camouflage. They read as lumps however they were modelled. Velvet is
almost uniform: a fine vertical nap and a broad soft sheen, and nothing
else. With the right map the silhouette does the work, and the silhouette
is the four things a chair has — legs you can see daylight under, arms
standing clear of the seat, a back taller than the arms with a roll on it,
and a cushion with a front edge.

**Dig where the hill is thick.** `prof41.js` prints the ground profile in a
local frame, which is how the auditorium's ceiling was set: it climbs in six
steps from 2.6 m under the datum at the door to 12 m over the stage, and
every one of those numbers is the measured ground minus two metres of rock
and sixty centimetres of slab. The hall is twenty-two metres tall at the
proscenium and never comes within two metres of the surface, and the reason
it can be is that it runs into the flank of a mesa. A big room underground
is a surveying problem before it is a modelling one.

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
the only way to tell a hole in the world from a hole in one mesh, and
`clear36.js` walks the geometry of a doorway rather than its colliders,
`sink38.js` raycasts down onto the drawn world and reports everywhere
it stands above the surface the player and the car are given to walk on,
`walk39.js` walks a polyline and prints the surface height and the zone at
the end of every leg, `whatis40.js` casts a grid of rays from a camera
and names what fills the frame by bucket *and* by the triangle's own plane —
the only thing that finds a wall no source file draws — `free.js` puts the
camera anywhere and points it anywhere, which `look22.js` cannot do for a
walking shot, and `prof41.js` and `ground41.js` measure how much rock there
is over a place you want to dig.
