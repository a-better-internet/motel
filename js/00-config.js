"use strict";
/* LOW DESERT MOTEL · 00-config.js
   scene config, image slots and the banner
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* =========================================================================
   LOW DESERT MOTEL — a first-person walkable desert motel.
   Built to the Coconuts scene technical style guide (hand-rolled engine on
   three.js r128, canvas-drawn textures, layered lighting, AABB colliders,
   fixed 1/60 timestep) with the desert, palette and CRT dressing of the
   Project 76 sandbox. One file, no build step, no external assets.
   ========================================================================= */

/* ----------------------------------------------------------------------
   0 · SCENE CONFIG  (near-top const block, per the guide)
   ---------------------------------------------------------------------- */
const NEXT_SCENE_URL = null;          // set to a sibling .html to enable handoff
const SPAWN   = { x: -24, z: -20.5, yaw: 3.30 }; // mid-lot, facing the motel across the asphalt
const EYE     = 1.66;                 // eye height above the walking surface
const PLAYER_R= 0.34;                 // collision radius

// Site geometry. North wing runs east-west; east wing runs north-south; they
// meet in an L around the pool courtyard, exactly like the reference aerial.
const BAY_W   = 6.0;                  // one motel bay (room + party wall)
const ROOM_D  = 6.4;                  // interior depth
const ROOM_H  = 2.66;                 // interior ceiling height
const FLOOR_H = 3.10;                 // floor-to-floor
const WALL_T  = 0.20;
const WALK_D  = 2.70;                 // walkway / balcony depth
const DECK_Y  = FLOOR_H;              // balcony deck height

const NORTH = { bays:9, x0:-27, z:14.0, stairBay:4 };   // front face at z = 14
const EAST  = { bays:5, z0:-16, x:27.0, stairBay:1 };   // front face at x = 27

const POOL = { x0:6.2, x1:17.0, z0:-0.5, z1:5.5, water:-0.14,
               deck:{x0:3.6, x1:19.6, z0:-4.6, z1:7.4} };

const OFFICE = { x0:-46, x1:-32, z0:-11.4, z1:-1.0, h:3.45 };

const LOT   = { x0:-52, x1:40, z0:-42, z1:26 };         // paved / flat pad
const ROADZ = -48.5;                                     // highway centre-line

/* ----------------------------------------------------------------------
   0b · IMAGE SLOTS
   Every printed surface in the scene is drawn into a canvas at build time.
   Any of them can be replaced by a hosted picture: put a URL against the
   slot key in IMAGES below and it is loaded and swapped onto the material
   at run time, with the canvas art as the fallback until it arrives.
   Each slot has a FIXED aspect ratio. Author to it and the picture lands
   square on the surface with no stretching and no cropping.

     slot          ratio (w:h)   suggested pixels
     brochure       4 : 9         800 x 1800   rack brochures, portrait
     postcard       2 : 3         800 x 1200   the spinner in the office
     artWide        2 : 1        1600 x  800   the print over every bed
     artLand        3 : 2        1200 x  800   framed landscape, rooms+office
     artPort        2 : 3         800 x 1200   framed portrait
     tv             4 : 3        1024 x  768   every television screen
     vendFront      1 : 2         900 x 1800   vending machine fronts
     vendHeader     3 : 1        1200 x  400   the lit header over a machine

   Keys take an optional variant after a colon, so a slot can carry more
   than one picture: "brochure:a", "brochure:b", "brochure:c", "artLand:room",
   "artLand:office", "vendFront:snack", "vendFront:soda". Instances sharing
   a key share one image and one draw call.
   ---------------------------------------------------------------------- */
const SLOT = { brochure:[4,9], postcard:[2,3], artWide:[2,1], artLand:[3,2],
               artPort:[2,3], tv:[4,3], vendFront:[1,2], vendHeader:[3,1],
               poster:[5,7], barSign:[22,5], barPole:[2,1], beerSign:[3,2],
               believe:[5,7], passboard:[3,2] };
const BROCHURE_URLS=[1,2,3,4,5,6,7,8,9,10].map(
  n=>"https://thelossless.neocities.org/Motel/Brochures/Brochure"+n+".jpg");
const TV_URLS=[
  "https://thelossless.neocities.org/Motel/TV%20Static/f801a36277fef9657a41b4c5954506e1.gif",
  "https://thelossless.neocities.org/Motel/TV%20Static/silhouette-watching-tv.gif",
  "https://thelossless.neocities.org/Motel/TV%20Static/static.gif",
  "https://thelossless.neocities.org/Motel/TV%20Static/tv-static.gif"];
// If your image host refuses cross-origin reads the screens fall back to
// procedural static and the prints to their canvas art. Putting a CORS proxy
// prefix here routes the fetch through it. Off by default, because it would
// send your URLs to a third party without asking.
const IMAGE_PROXY="";
const ART_BASE="https://thelossless.neocities.org/Motel/Over%20The%20Bed/";
const IMAGES = {
  "vendHeader":     "https://thelossless.neocities.org/Motel/Ice%20Machine/IceMachineHeader.jpg",
  "artWide":        ART_BASE+"OverBed.jpg",
  "artLand:office": ART_BASE+"FramedPrintOffice.jpg",
  "artLand:room":   ART_BASE+"FramedPrint.jpg",
  // brochure:0..9 and tv:0..3 are filled in below from the two lists above
};
// ten brochures, ten slots — six in the wall rack and four on the spinner —
// dealt without repeats, so the rack is different every visit
(function dealBrochures(){
  const deck=BROCHURE_URLS.slice();
  for(let i=deck.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0;
    const t=deck[i]; deck[i]=deck[j]; deck[j]=t; }
  for(let i=0;i<10;i++) IMAGES["brochure:"+i]=deck[i%deck.length];
})();
for(let i=0;i<4;i++) IMAGES["tv:"+i]=TV_URLS[i];
