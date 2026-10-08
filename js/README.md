# How the world is put together

`index.html` is the page: the markup, the CSS, the HUD, and twenty-seven
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
| `14f-auditorium.js` | The Long Room, its stage and the backstage corridor |
| `14g-warehouse.js` | the stores, through the door in the backstage end room |
| `14h-pool.js` | the old baths, through the fire door at the far end of the stores |
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
scripts share one global lexical scope, which is what lets these twenty-seven files
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

**A hole has a sill, a head and two jambs — and the piece under the sill
stops AT the sill.** The auditorium's entrance was built to the top of the
doorway instead of to the floor, so the mass below the opening filled the
opening. The collider was correct, the walk probe went straight through,
and the corridor ended in a blank wall. Geometry and collision disagreeing
is the signature of this class of bug: when a probe says a way is open and
a screenshot says it is shut, the probe is testing the wrong thing, not
lying.

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

**Model the thing that has a silhouette.** Four attempts at an armchair for
the speakeasy were all reported as "a pile of random shapes", and the
fourth was a correctly proportioned club chair. A club chair is a box with
two smaller boxes on it: at this fidelity that is what it looks like,
however right the dimensions are. The fifth was a WING chair, off a
photograph, and it read immediately — because a back twice the height of
the arms with two wings coming forward off it to meet them is a shape
nothing else in the world has. **When a model will not read, the answer is
usually a different object, not a better version of the same one.**

Two things were also wrong in the code the whole time and neither was
visible in a candlelit room at three metres: the back's roll was given `rx`
instead of `rz`, so it ran front-to-back as a 74 cm log driven through the
chair at shoulder height, and the arm's scroll face was in the cushion's
lighter tone, so it read as a pale coin stuck on each arm. Both were
obvious within seconds of rendering the chair LIT and CLOSE. `free.js`
takes a `lit` flag now and it should be the first thing used on any new
object, not the last.

**Upholstery is not made of boxes.** Three goes at the speakeasy's
armchairs were built out of rectangular prisms with correct dimensions on
them, and all three read as flat-pack — because a box has eight hard
corners and stuffing has none, and at this fidelity the corner is all the
eye has to go on. The banquette in the same room always read correctly, and
it is built the other way: a squashed sphere over a frame, with a piped
roll and buttons. So the rule is that the two or three pieces you actually
sit on are squashed spheres, the arms are capsules — a cylinder with a ball
on each end — and the only boxes left are the frame underneath, which
nobody sees. Three measurements matter more than any modelling: an arm 7 cm
above the cushion is a rail and an arm 25 cm above it is an arm; a back
taller than the arms; and a seat that tucks UNDER the arms rather than
butting them, because two faces that merely meet are a seam you can see
across a room. And check the map the bucket carries: `velvet` was laid at
0.5 repeats per metre, which stretches a fine nap into ten-centimetre
stripes — that was the corduroy.

**A round piece has an axis, and it is usually pointing the wrong way.** A
`CylinderGeometry`'s axis is +y; a `TorusGeometry`'s is +z. Under the
`"YXZ"` order those need *different* rotations to end up facing the same
way, so a scroll face and the welt around it — drawn with the same rx —
came out as a wheel and a hoop stuck on the front of each arm. The
proscenium's tie-backs had the mirror of the same fault and read as two
gold slivers. When a round thing looks wrong, check which axis the
primitive was born with before touching anything else.

And work out WHICH rotation, every time, for every piece: within one
object the answer differs per piece. The armchair's arm rolls run front to
back, so their axis goes to local Z and `rx = pi/2` is right; its back roll
runs side to side, so its axis goes to local X, which is `rz = pi/2`. The
back roll was given `rx` for four rounds and came out as a 74 cm log driven
through the middle of the chair from front to back, sticking out at
shoulder height either side. Every attempt to fix the chair reproportioned
everything around that log. **When a model keeps reading as "a pile of
random shapes" after the proportions are right, one of the pieces is not
where the code says it is** — render it alone and large before changing
anything else.

**Dig where the hill is thick.** `prof41.js` prints the ground profile in a
local frame, which is how the auditorium's ceiling was set: it climbs in six
steps from 2.6 m under the datum at the door to 12 m over the stage, and
every one of those numbers is the measured ground minus two metres of rock
and sixty centimetres of slab. The hall is twenty-two metres tall at the
proscenium and never comes within two metres of the surface, and the reason
it can be is that it runs into the flank of a mesa. A big room underground
is a surveying problem before it is a modelling one.

## The checks that are not optional

Asked for, in round 43, after four rounds of the same three faults being
reported from screenshots instead of being caught here. **Anything added to
this world is not finished until all four of these have been run over it**,
and "it is only a corridor" is exactly the kind of addition that fails them.

1. **`coplanar45.js` over the new region's box** (it supersedes
   `coplanar.js`, which could not see a face at an angle). Every time. The pairs that
   matter have `dp` at 0.0000 and at least one opaque bucket; pairs between
   two `depthWrite:false` decal buckets are noise. One omission in round 42
   left twenty-two square metres of flicker in a corridor nobody had
   scanned.
2. **`doors18.js`, and a `walk39.js` polyline through the new space and
   back out.** Collision and geometry disagree constantly — a probe walking
   clean through a wall is the signature.
3. **Name every wall of every room out loud, in order, and check the list
   against the code.** Leg two of the backstage corridor was missing nine
   metres of its north side and the whole of its east end, because the
   wall-drawing calls were written by eye rather than off a list. Four
   sides per rectangle, and a rectangle with a doorway in it is two pieces
   plus a head.
4. **A free-camera shot of it, pitched, from inside — and for anything
   object-sized, a close one with `free.js`'s `lit` flag on.** Judging a
   model in the lighting it will finally be seen in is how a chair with a
   log through it survived four rounds. The ray
   probes cannot see a wrong colour, a stretched map or a cylinder pointing
   the wrong way, and all three of those have shipped.

And two faults that have now each cost three rounds, so they get their own
line: a decal must never be a free crop of a map (see cellGeo), and a
primitive's axis must be worked out rather than guessed (see below).

5. **Anything object-sized goes on the turntable before it is believed.**
   `turntable.js` renders one thing from four sides at a fixed radius and
   height, lit, and `strip.py` stitches the four into one picture. This is
   step 4 taken seriously: a walkthrough screenshot shows an object from
   whatever angle you happened to be standing at, and one angle cannot
   tell a wrong shape from a wrong *transform*.

### The handedness of a local offset

This cost five rebuilds of the same armchair, so it is written down.

`push()` orients a piece with `rotation.y = ry`. three.js builds that from
`makeRotationY`, which is

    [  cos t   0   sin t ]
    [    0     1     0   ]
    [ -sin t   0   cos t ]

so a local offset `(dx, dz)` lands at

    ( dx·cos t + dz·sin t ,  −dx·sin t + dz·cos t )

If the helper that places the pieces computes `(dx·c − dz·s, dx·s + dz·c)`
instead — which is what you get by writing the 2-D rotation matrix out of
habit — then every piece is **oriented by +t and positioned by −t**. At
`ry = 0` the two agree, so it passes every test you are likely to run; at
any other angle the object comes apart into a pile of correctly-shaped
blocks in the wrong places, which looks exactly like bad modelling and is
not. The same wrong-handed helper was found in `10-office.js` twice.

Write the offset helper once, as

    const S=(dx,dz)=>[cx + dx*Math.cos(ry) + dz*Math.sin(ry),
                      cz - dx*Math.sin(ry) + dz*Math.cos(ry)];

and build the object from a table of extents (min/max per axis), not from
centres and sizes: extents are what you can check against a drawing.

### Nothing in this world may clip to white

Painted colours are vertex colours and the renderer is on `NoToneMapping`,
so a hex above about `#c0` under a sunlit irradiance of ~2.0 leaves the
shader past 1.0 and hard-clips. Every face of it comes out 255,255,255:
no shading, no edges, no form — "blown out with harsh white light". Two
things stop that now and both are central, so nothing has to be repainted:

* `03-scene.js` installs a **CustomToneMapping shoulder**. Below 0.76 it is
  the identity, so painted colours stay literal, which was the whole reason
  for `NoToneMapping`; above it each channel rolls off exponentially and
  approaches 1.0 without reaching it. Per channel, so a warm highlight
  stays warm instead of being pulled grey.
* `19-loop.js` puts the same soft knee on the GLOW emissives, whose `k`
  factor runs to 2.35 underground and would otherwise take all three
  channels of a bulkhead past one.

A new emissive bucket goes through `emitMat()` in `15-bake.js`, which gives
it a near-black diffuse: an emissive surface that also takes room light adds
the two together and clips.

### What `float.js` calls floating, and what it means

Two thirds of its output is not a fault, and knowing which two thirds saves
a round. It unions primitives whose boxes touch and then reports a cluster
with nothing beneath it — but it **skips oversized slabs from the index**
(anything spanning more than 600 grid cells), and the highway, the car
park and the terrain rings are all oversized slabs. So:

* anything standing on the road or the lot — the payphone, the speed signs,
  the bus bench — reads as floating by half a metre. It is not.
* anything bolted to a wall — a poster, a shelf, a sconce, the whole
  contents of the projection room — reads as floating. It is not.
* a plant in the far desert reads as floating by ~0.5 m, because the only
  thing under it is a terrain ring. Check it against
  `Terrain.groundAt(x,z)`, not against the report: scatter is placed on the
  drawn surface, and in the far field that sits up to a metre above the
  analytic `heightAt`.

What is a real find is a cluster with a *neighbour* it should be touching
and is not — the six laundry sheets hanging 15 cm below the wire they were
pegged to, which is exactly the shape of fault it exists to catch. Use
`at44.js` to read the cluster back as real boxes before believing it.

### A shadow camera does not update its own projection

`OrthographicCamera` builds its projection matrix in its constructor and
never again on its own, and three.js's shadow pass only recomputes the
*view* matrix each frame. So `key.shadow.camera.left = …` and friends do
nothing at all until `key.shadow.camera.updateProjectionMatrix()` is called.
Until round 44 the whole world was lit through the stock
`DirectionalLightShadow` frustum — a ten-metre box — which is why the motel
cast no shadow on its own car park. **Any change to `ksc` is followed by
that call.**

### What is allowed to cast a shadow, and how close it stands

three.js draws every `castShadow` mesh into the depth map, and for a
single-sided material it draws the **back** faces. A plane's back face is
its front face, so anything flat sat in the depth map exactly on the surface
it was lying on and shadowed itself; the only thing holding that acne off
was a normalBias of 4.6 cm, and a big normalBias is precisely what lifts a
shadow off the foot of whatever casts it — 11 cm of daylight under a post.
So `bakeBuckets` splits every bucket in two (see the note over `FLAT_T` in
`01-helpers.js`): entries thinner than 12 mm go in a second mesh that
receives but does not cast, and transparent, additive or depth-less buckets
cast nothing at all. With the self-shadowing gone the bias can be tight:
`bias -0.00005, normalBias 0.012`, and the key sits 110 m back from its
target on the sun line (`KEY_D`), so the near and far planes hug the scene.
Measured with `sgap45.js`: the gap between a post and its shadow went from
11.1 cm to 0.3–1.8 cm, and acne on the court is under 1 %.

**Do not raise `normalBias` to cure acne.** Find what is shadowing itself.

### Decals stand on a ladder, not at one height

Everything printed on a floor — oil, soot, tyre marks, paper, rugs' edges —
is a plane a few millimetres up, and two of them at the same height fight
wherever they overlap. At 30 m the depth buffer resolves about a fifth of a
millimetre, so decals get distinct heights at least 0.6 mm apart, and the
height is handed out by **overlap**, greedily: each decal takes the rung
above the highest one already under it (`LY()` in `14d-diner.js`). Cycling a
counter is enough only where the decals are sparse (`dec()` in the stores).

### A lampshade is a tube, and a ceiling fitting is a bowl

Every shade used to be a closed cylinder, which puts a flat disc across its
mouth: from a chair or from under a ceiling rose it read as a lid of
glowing cream with no bulb and no inside — a sticker, and the brightest flat
area in the room. Use `shadeGeo()` (an open tube, in the double-sided
`lampshade` bucket, so the lamp standing in it lights its inside) with a
`shadeBulb()` in it, and `domeGeo()` under a canopy for a flush fitting.
The `ceilfix` bucket has a grey diffuse under its glow on purpose: a fitting
always has its own lamp a few inches away, and white diffuse let that lamp
push the face past white. An enamel pendant is dark paint outside and a
`shadein` lining (double-sided, not emissive) — the `lampshade` emissive
ignores vertex colour, so a dark shade in that bucket glows amber.

A room's fittings follow its MOOD row: a lamp that is off draws its shade
in `shadein` and its bulb in `paint`, rather than glowing at dusk with
nothing behind it.

### A seat looks the other way from its chair

A chair built facing its own +z (back at −z) and placed with `ry` faces
world `(sin ry, cos ry)`. A seat's yaw is the *camera's*, and the camera
looks down its own −z: `(−sin yaw, −cos yaw)`. So the seat that looks the
way the chair faces has **yaw = ry + π**. Getting this backwards is how the
speakeasy's armchairs, the end room's chair and the manager's armchair all
shipped facing away from what they were set at — and the armchair was
facing away in its geometry as well, because its `ry` carried the half turn
the seat should have had. Aim a chair with `atan2(tx−cx, tz−cz)` at the
thing it faces and add π for the seat. `seats45.js` checks every seat's
yaw against the tops around it.

### Local helpers take local coordinates

`AP()` in the motel's alcoves transforms what it is given through the bay's
frame. Handing it a coordinate that had already been through `xf.x()` moved
the purple floor glow, the zapper and the cobwebs a second time — the
floating purple square outside the motel was a floor glow from an alcove
sixty metres away. When a helper takes `(x, z)`, find out which frame it
expects before calling it.

### Underground is not on the clock

A lamp inside a BURIED volume burns at full strength at noon as at
midnight: `updateLights` asks `buriedAt()` once per lamp and remembers.
The `buried` emissive kind and the `floorglowb` bucket (a basic glow with
`always:true`) do the same for surfaces. The ordinary `floorglow` is on the
clock, which is right at the surface — a vending machine's pool is washed
out by daylight — and wrong forty feet down.

### What `float45.js` adds

The old `float.js` skipped oversized slabs from its index and so reported
everything on a wall, a road or a soffit. `float45.js` unions primitives
that touch (3 cm), counts a cluster as held up if it touches *any*
primitive, however big, and reports only clusters that are above the
ground and the walkable surfaces **and** more than 6 cm from anything
that is not themselves. Its output is short enough to read, and in round 45
nearly all of it was real: a VACANCY board hanging over its name board,
gooseneck lamps in front of a sign, a mast beacon and a lookout's cupola
on nothing, barbed wire off its arms, TV brackets and a fan rod short of
the ceiling, speakers in mid-air facing the wall, bunting with no string,
photographs edge-on in front of a bar. The scan page now records the
source line of every primitive, so each find names its file and line.

### An open end gets no face, and only the drawn world can show one

The grey wall across the way into the stores was a `face()` closing the
west end of the auditorium's second leg — a plane with no collider behind
it, left over from before that end was opened. Every probe the world had
reads colliders, so the doors walked clean and the routes walked clean
while a wall stood in the opening. It was the third time a new doorway
shipped with its old face across it. When an end of a corridor or a room
is opened, the face that closed it goes; and `sight46.js` raycasts the
**drawn** world along both lanes of every door and along any route you
give it, and names whatever it hits by bucket and source line.

### A lintel stops where it is

The `wall()` helpers in the stores and the baths sank every collider half
a metre below its base, which is right for a wall standing on a floor (no
gap for the player to slip under at a seam) and wrong for a lintel: the
fire door's head became a bar 1.64 m off the floor, in the doorway, at
head height. A wall that starts above the floor now stops where it is.
`heads46.js` checks the opening of every door for colliders between ankle
and head height; run it with the other door probes.

### The view is set across, not up

A perspective camera fixes its **vertical** field of view and lets the
horizontal fall out of the window's shape. It was 72° vertical, which is
104° across on a widescreen, and a flat projection stretches anything off
centre by 1/cos² of its angle along the radius: two and a half times at
the edge of that frame, so a car changed shape with a few degrees of
turn. `baseFov(aspect)` in `03-scene.js` aims for 88° across and clamps
the vertical between 50° and 66°; the resize handler and the mouse wheel
(an offset, `fovZoom`) both go through `applyFov()`.

### Each buried volume has its own ambient

`addBuried(..., amb)` gives a volume the colour its ambient fades to: the
lamplit rooms stay warm, the tiled baths lit by a few cold fittings do
not. The loop lerps to it as you cross from one volume to the next.

### Paint, puddles and a rug: three things a plane gets wrong

`streakGeo()` picks a random cell of a 2×2 decal map, which is right for
stains (any one will do) and wrong for graffiti — the pieces in
`TEX.tags` are not interchangeable, so `tagGeo(w,h,ci,ri)` names its
cell. Standing water is `puddleGeo()`, an irregular disc already lying in
xz, in the `puddle` bucket: a rectangle of dark water reads as a slab
somebody laid on the floor, and the `mirrorw` bucket it used to borrow
glows amber on purpose (it is the speakeasy's back-bar mirror). And a rug
is the `runner` map on `runnerGeo()`: border down the long sides, fringe
on the ends, which is how rugs are made.

### A slab's top is the flat's height, written as one

`B()` takes the centre of a box. The filling station's apron was 0.26
thick and centred at 0.13, so its top stood 12 cm above the flat the
player walks on (`F+0.02`): the shop's checker floor, the bay's slab and
every stain, joint and drift printed on the apron were inside it, and
your feet were sunk in it. When a slab and a flat describe the same floor,
write the slab's centre from the flat (`F+0.02-0.13`), and give a site on
sloping desert a graded pad in `04-terrain.js` (`dinerPad`, `fillPad`)
rather than a thicker slab.

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
the end of every leg, `turntable.js` plus `strip.py` show one object from
four sides at once, `at44.js` lists every primitive AABB inside a query box
so a cluster `float.js` names by its centre can be read back as real boxes,
`whatis40.js` casts a grid of rays from a camera
and names what fills the frame by bucket *and* by the triangle's own plane —
the only thing that finds a wall no source file draws — `free.js` puts the
camera anywhere and points it anywhere, which `look22.js` cannot do for a
walking shot, and `prof41.js` and `ground41.js` measure how much rock there
is over a place you want to dig.

Round 45 added: `coplanar45.js`, which finds overlapping coplanar triangles
at **any** orientation (the old probe only saw axis-aligned faces) and
filters the ones nobody can see — faces buried inside an opaque primitive,
rock (below the ground and outside every VOID; not BURIED, which is
oversized by 0.4 m), and the underside of anything resting on a walkable
surface; `plan45.js`, a top-down orthographic plan of a box between two
heights, which is how the Canteen and the lounge were laid out;
`sgap45.js`, the shadow-gap and acne meter; `colov45.js`, collider
overlaps; `seats45.js`, the seat-facing audit; `float45.js`, above; and
`hgt45.js`, a terrain height grid over a box with the primitives in it,
for siting something underground.

Round 46 added `sight46.js` (above: rays through the drawn world along
door lanes and routes), `heads46.js` (colliders in a doorway at head
height), `path46.js` (the player's own view along a path, with the doors
simulated open as they would be in play — give it a feet height for
anything underground, or it stands you on the mesa over it), `elev46.js`
(an orthographic elevation of one wall, which is how the Canteen's walls
were laid out; its first shot of a run is always a perspective frame, so
start with a dummy) and `cols46.js` (the colliders in a box).

If the scratchpad is lost, it is quick to rebuild: the CDNs answer 403
from the sandbox, so three.js comes from `npm pack three@0.128.0`
(`build/three.min.js`); playwright is the global one under
`/opt/node22/lib/node_modules`, linked into a local `node_modules`, with
chromium at `/opt/pw-browsers`; and the image scripts want `pillow`.
`sync.sh` asserts the script count, so it has to change with `index.html`.
