"use strict";
/* LOW DESERT MOTEL · 14f-auditorium.js
   what is behind the second door in the speakeasy
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   11f · THE LONG ROOM
   ----------------------------------------------------------------------
   Beside the piano in The Dry Well there is a second door, and behind it a
   vestibule, and off the vestibule a corridor nineteen metres long with
   nothing in it but carpet and sconces. The corridor matters more than
   anything in the room it leads to: it is low, it is straight, it is dull,
   and by the time you reach the end of it you have stopped expecting
   anything. Then the ceiling leaves.

   THE SECTION IS THE WHOLE IDEA. You come out onto a balcony at the back,
   three metres under a flat soffit. The floor in front of you drops six
   metres and the ceiling climbs fifteen, in five steps, each one further
   away — so the hall is three metres tall where you are standing and
   twenty-two where the stage is. Nothing is revealed by walking forward;
   the whole volume arrives at once, at the doorway, which is the only
   place a room this size can be felt from.

   WHY IT FITS. The desert west of the shelter is the flank of a mesa: the
   ground is 1.4 m above the speakeasy's datum at the balcony and 27 m above
   it over the stage. The ceiling follows that line up, two metres under the
   rock the whole way. It is not a room that was dug; it is a room that was
   quarried into a hill from the one side where the hill is thin, which is
   also the only answer the building gives to "why is this here".

   WHAT IT IS FOR is not answered. There is a programme on a seat, a music
   stand in the pit, a coat over a chair at the back, and the house lights
   are on. Nothing says what was performed or who came.
   ---------------------------------------------------------------------- */
(function(){
  const SX=-80, SZ=340;                 // the same frame the speakeasy is in
  const m=mk(SX,SZ), GY=m.y;
  const W=(x)=>SX+x, Z=(z)=>SZ+z;

  /* --- the one page of numbers --------------------------------------- */
  const RD  = -5.55;                    // the speakeasy's floor; we stay level with it
  const WT  = 0.60;                     // the walls down here are thick
  const VX1 = -53.34;                   // the speakeasy's west face
  const VX0 = -59.20;                   // the vestibule's far wall
  const VZ0 =  42.00, VZ1=48.80;        // the vestibule
  const CZ0 =  43.90, CZ1=46.90;        // the corridor, three metres wide
  const CX0 = -76.00;                   // and where it ends: the hall's east wall
  const VH  =  2.90;                    // vestibule and corridor clear height

  const AX1 = -76.00, AX0=-112.00;      // the hall, east to west: thirty-six metres
  const AZ0 =  32.00, AZ1=58.00;        // and across: twenty-six
  const BALX= -81.00;                   // the balcony's front edge
  const BALY=  RD;                      // which is level with the corridor, so the
                                        // door puts you straight out over the drop

  const STLY= -11.40;                   // the stalls, at the orchestra rail
  const ROWS=  11, ROWG=1.10, ROWR=0.26;
  const rowX = r => -99.50 + r*ROWG;    // row 0 is nearest the stage and lowest
  const rowY = r => STLY + r*ROWR;      // -11.40 up to -8.80
  const XAF = -100.60;                  // the front cross-aisle ends here
  const XAB = -87.95;                   // and the back one runs from here to the balcony
  const STGX= -104.00;                  // the proscenium line
  const STGY= -10.20;                   // the stage, 1.2 above the stalls
  const PITY= -12.80;                   // the pit
  const CA0 =  43.40, CA1=46.60;        // the centre aisle, and the grand stair in it
  const SA  =  2.20;                    // the side aisles

  /* THE CEILING, IN SIX STEPS, EACH ONE HIGHER AND FURTHER AWAY. The
     numbers are not chosen; they are the ground profile minus two metres of
     rock and sixty centimetres of slab, measured along this line with
     prof41.js. Raise any of them and the hall comes out of the hillside. */
  const BAY=[[ -84.00, -76.00, -2.60],
             [ -89.00, -84.00,  0.20],
             [ -94.00, -89.00,  3.40],
             [ -99.00, -94.00,  6.60],
             [-104.00, -99.00,  9.80],
             [-112.00,-104.00, 12.00]];
  const FLOORB=PITY-0.70;               // the underside of everything
  /* THE DOOR AT THE SIDE OF THE STAGE. It is in the AZ0 wall, in the front
     cross-aisle, three metres downstage of the first row — the one place
     in the hall where the wall is at arm's length and the floor is flat.
     Everything that spans that wall has to leave it out: the mass, the
     collider, the plaster field, the dado panelling. Declared here rather
     than next to any one of them, because the last four times a doorway in
     this world came out blocked it was one course that had not heard. */
  const SDX0=-101.80, SDX1=-100.60, SDH=2.20;

  const OAKD="#4a3426", OAKM="#6b4a2c", PLAS="#7a5c3c";
  const OX="#5e2420", OXD="#43110f", BR="#c9a24a", BRD="#8e6f2e";
  const GILT="#b8923c", CARP="#5e1e1c", CARD="#43110f";
  const AVOL=[W(AX0-1), W(VX1+1), Z(AZ0-1), Z(AZ1+1), GY+PITY-2, GY+13.5];

  let _r=0; const R=n=>((Math.sin((n+(_r+=0.41))*57.3+11.7)*39217.4)%1+1)%1;

  /* ====================================================================
     1 · THE VESTIBULE AND THE LONG CORRIDOR
     --------------------------------------------------------------------
     Deliberately uneventful. Carpet, a dado, a sconce every four metres,
     and a ceiling low enough that you duck slightly without meaning to.
     ==================================================================== */
  (function approach(){
    const CEILV=RD+VH;
    // the vestibule: a small square room with the door on one side
    m.B("concrete", VX1-VX0+WT, 0.45, VZ1-VZ0+WT*2, (VX0+VX1)/2-WT/2, RD-0.225,
        (VZ0+VZ1)/2, 0.5, 0, "#948d83");
    m.P("plank", planeGeo(VX1-VX0, VZ1-VZ0, 0.42), (VX0+VX1)/2, RD+0.01,
        (VZ0+VZ1)/2, 0, "#8d7049", -Math.PI/2, 0);
    m.P("carpet", boxGeo(VX1-VX0-0.9, 0.018, VZ1-VZ0-0.9, 0.5), (VX0+VX1)/2, RD+0.03,
        (VZ0+VZ1)/2, 0, CARP, 0, 0);
    m.flat(VX0, VX1+0.9, VZ0, VZ1, RD);   // well past the speakeasy's own flat
    // walls round it, with the corridor mouth left out of the west one
    const vw=(x0,x1,z0,z1)=>{ m.B("concrete", x1-x0, VH+0.45, z1-z0, (x0+x1)/2,
        RD+(VH+0.45)/2, (z0+z1)/2, 0.42, 0, "#8d877c");
      m.col(x0,x1,z0,z1, RD-1, RD+VH+0.45); };
    vw(VX0-WT, VX1, VZ0-WT, VZ0);
    vw(VX0-WT, VX1, VZ1, VZ1+WT);
    vw(VX0-WT, VX0, VZ0, CZ0);
    vw(VX0-WT, VX0, CZ1, VZ1);
    m.B("concrete", WT, VH+0.45-2.30, CZ1-CZ0, VX0-WT/2, RD+2.30+(VH+0.45-2.30)/2,
        (CZ0+CZ1)/2, 0.42, 0, "#8d877c");
    m.col(VX0-WT, VX0, CZ0, CZ1, RD+2.30, RD+VH+0.45);
    // ceiling over the vestibule
    m.B("concrete", VX1-VX0+WT, 0.45, VZ1-VZ0+WT*2, (VX0+VX1)/2-WT/2, CEILV+0.225,
        (VZ0+VZ1)/2, 0.5, 0, "#6e5a4a");

    /* THE CORRIDOR. One bore, built the way the tunnel from the shelter is:
       two side walls, a soffit and a floor, each a single long box, with the
       flats overlapping their neighbours so no line of the floor is a line
       with nothing on it. */
    m.B("concrete", VX0-CX0, 0.45, CZ1-CZ0+WT*2, (CX0+VX0)/2, RD-0.225,
        (CZ0+CZ1)/2, 0.5, 0, "#948d83");
    m.P("plank", planeGeo(VX0-CX0, CZ1-CZ0, 0.42), (CX0+VX0)/2, RD+0.01,
        (CZ0+CZ1)/2, 0, "#8d7049", -Math.PI/2, 0);
    m.P("carpet", boxGeo(VX0-CX0-0.2, 0.018, CZ1-CZ0-0.76, 0.5), (CX0+VX0)/2, RD+0.03,
        (CZ0+CZ1)/2, 0, CARP, 0, 0);
    m.P("carpet", boxGeo(VX0-CX0-0.2, 0.010, CZ1-CZ0-1.30, 0.5), (CX0+VX0)/2, RD+0.042,
        (CZ0+CZ1)/2, 0, CARD, 0, 0);          // the worn strip down the middle
    m.flat(CX0-0.4, VX0+0.4, CZ0, CZ1, RD);
    for(const q of [[CZ0-WT, CZ0],[CZ1, CZ1+WT]]){
      m.B("concrete", VX0-CX0, VH, q[1]-q[0], (CX0+VX0)/2, RD+VH/2, (q[0]+q[1])/2,
          0.42, 0, "#8d877c");
      m.col(CX0, VX0, q[0], q[1], RD-1, RD+VH+0.5);
    }
    m.B("concrete", VX0-CX0, 0.45, CZ1-CZ0+WT*2, (CX0+VX0)/2, RD+VH+0.225,
        (CZ0+CZ1)/2, 0.5, 0, "#6e5a4a");
    // dado and plaster, both sides of the corridor and round the vestibule
    /* Same convention as the speakeasy's line(): ry 0 or pi means the run
       goes along X and `pz` is the wall's plane; +-pi/2 means it runs along
       Z and `px` is. Getting that backwards paints the lining across the
       middle of the room instead of onto the wall. */
    const lineRun=(ry,px,pz,a0,a1)=>{
      const L=a1-a0, c=(a0+a1)/2, flat=(ry===0||Math.abs(ry)>3);
      const nx=Math.sin(ry), nz=Math.cos(ry);
      const X2=flat?c:px, Z2=flat?pz:c;
      m.P("oak", planeGeo(L, 1.06, 1.9), X2, RD+0.56, Z2, ry, OAKM, 0, 0);
      m.P("plaster", planeGeo(L, VH-1.16, 0.55), X2, RD+1.16+(VH-1.16)/2, Z2, ry, PLAS, 0, 0);
      for(let i=0;i<Math.max(3,Math.round(L/2.6));i++){
        const u=a0+L*((i+0.5)/Math.max(3,Math.round(L/2.6))+(R(i)-0.5)*0.1);
        m.P("stain", streakGeo(0.7+R(i+2)*1.8, 0.5+R(i+5)*1.1, 0),
            flat?u:X2+nx*(0.010+i*0.0015), RD+1.4+R(i+3)*1.0,
            flat?Z2+nz*(0.010+i*0.0015):u, ry, R(i+7)<0.5?"#56402a":"#6b5236", 0, 0);
      }
      m.B("oak", flat?L:0.07, 0.09, flat?0.07:L, X2+nx*0.035, RD+1.10, Z2+nz*0.035,
          0.4, 0, OAKD);
    };
    lineRun(0,        0, CZ0+0.02, CX0+0.1, VX0-0.1);       // the corridor
    lineRun(Math.PI,  0, CZ1-0.02, CX0+0.1, VX0-0.1);
    lineRun(0,        0, VZ0+0.02, VX0+0.1, VX1-0.1);       // and the vestibule
    lineRun(Math.PI,  0, VZ1-0.02, VX0+0.1, VX1-0.1);
    for(const g of [[VZ0+0.1, CZ0-0.1],[CZ1+0.1, VZ1-0.1]])
      lineRun(Math.PI/2, VX0+0.02, 0, g[0], g[1]);
    // a sconce every four metres, and a pool of light under each
    for(let i=0;i<5;i++){
      const px=CX0+2.2+i*3.9;
      for(const q of [[CZ0+0.06,1],[CZ1-0.06,-1]]){
        m.B("brass", 0.26, 0.09, 0.14, px, RD+2.06, q[0]+q[1]*0.07, 0.4, 0, BRD);
        m.P("sconce", planeGeo(0.22, 0.26, 0), px, RD+2.22, q[0]+q[1]*0.11,
            q[1]>0?0:Math.PI, "#ffb866", 0, 0);
        m.P("floorglow", planeGeo(1.7, 1.7, 0), px, RD+0.052, q[0]+q[1]*0.55,
            0, "#ffa348", -Math.PI/2, 0);
      }
      if(i%2===0)
        m.lamp(px, RD+2.10, (CZ0+CZ1)/2, {color:0xffbe78, intensity:0.60, dist:9.0,
               decay:1.6, indoor:true, vol:AVOL});
    }
    m.voidAt(CX0-0.6, VX1+0.5, CZ0-0.3, CZ1+0.3, RD-1.2, RD+VH+0.3, RD);
    /* The void overlaps the speakeasy's by more than half a metre. voidAt's
       bounds are strict and it is keyed on the height you are ALREADY at,
       so two volumes that merely touch put you on the roof of one of them
       with no way back — round 39 lost a whole tunnel to this. */
    m.voidAt(VX0-0.6, VX1+0.9, VZ0, VZ1, RD-1.2, RD+VH+0.3, RD);
    addBuried(W(CX0-0.6), W(VX1+0.5), Z(VZ0-0.5), Z(VZ1+0.5), GY+RD-1, GY+RD+VH+0.6);
    addZone(W(VX0), W(VX1), Z(VZ0), Z(VZ1), GY+RD-1, GY+RD+VH, "A VESTIBULE", true);
    addZone(W(CX0), W(VX0), Z(CZ0), Z(CZ1), GY+RD-1, GY+RD+VH, "A LONG CORRIDOR", true);
    // the coat rail and the two umbrellas nobody came back for
    m.C("brass", 0.022,0.022,1.90,8, VX0+0.26, RD+1.70, VZ0+0.70, BR, 0, 0, Math.PI/2);
    for(let i=0;i<3;i++)
      m.C("brass", 0.016,0.016,0.16,6, VX0+0.26, RD+1.62, VZ0+0.40+i*0.30, BRD);
    m.P("velvet", boxGeo(0.34, 0.92, 0.16, 2.2), VX0+0.34, RD+1.08, VZ0+0.70, 0,
        "#2e2a26", 0, 0);
    m.C("oak", 0.030,0.030,0.86,8, VX1-0.30, RD+0.44, VZ1-0.40, OAKD, 0.10, 0, 0.06);
  })();

  /* ====================================================================
     2 · THE SHELL
     --------------------------------------------------------------------
     Walls the full height of each ceiling bay, a stepped soffit over them,
     and a floor slab under everything. The bays butt; nothing overlaps.
     ==================================================================== */
  (function shell(){
    m.B("concrete", AX1-AX0+WT*2, 0.60, AZ1-AZ0+WT*2, (AX0+AX1)/2, FLOORB-0.30,
        (AZ0+AZ1)/2, 0.5, 0, "#8a847a");
    for(const b of BAY){
      const h=b[2]-FLOORB;
      for(const q of [[AZ0-WT, AZ0],[AZ1, AZ1+WT]]){
        const cut = q[0]<AZ0 && b[0]<SDX1 && b[1]>SDX0;   // the stage door's bay
        const runs = cut ? [[b[0], SDX0],[SDX1, b[1]]] : [[b[0], b[1]]];
        for(const r of runs) if(r[1]-r[0]>0.02)
          m.B("concrete", r[1]-r[0], h, q[1]-q[0], (r[0]+r[1])/2, FLOORB+h/2,
              (q[0]+q[1])/2, 0.5, 0, "#8d877c");
        if(cut)                                           // and the head over it
          m.B("concrete", SDX1-SDX0, b[2]-(STLY+SDH), q[1]-q[0], (SDX0+SDX1)/2,
              (b[2]+STLY+SDH)/2, (q[0]+q[1])/2, 0.5, 0, "#8d877c");
      }
      /* The ceiling of the bay, COFFERED. Flat and near-black it read as
         no ceiling at all, which throws away the one thing this room is
         for: a ceiling you cannot see is a ceiling that is not twenty
         metres up. Ribs across it at two and a half metres, picked out in
         gilt, give the eye something to measure the height against. */
      m.B("concrete", b[1]-b[0], 0.60, AZ1-AZ0+WT*2, (b[0]+b[1])/2, b[2]+0.30,
          (AZ0+AZ1)/2, 0.5, 0, "#6e5444");
      { const L=b[1]-b[0], nr=Math.max(2, Math.round(L/2.5));
        for(let i=1;i<nr;i++){
          const u=b[0]+L*(i/nr);
          m.B("plaster", 0.28, 0.30, AZ1-AZ0, u, b[2]-0.15, (AZ0+AZ1)/2, 0.5, 0, "#8a6a48");
          m.B("brass", 0.12, 0.08, AZ1-AZ0, u, b[2]-0.32, (AZ0+AZ1)/2, 0.4, 0, GILT);
        }
        for(let i=0;i<nr;i++){
          const u=b[0]+L*((i+0.5)/nr);
          m.P("plaster", planeGeo(L/nr-0.40, AZ1-AZ0-1.2, 0.5), u, b[2]-0.03,
              (AZ0+AZ1)/2, 0, "#7a5c3c", Math.PI/2, 0);
          m.B("brass", L/nr-0.50, 0.07, AZ1-AZ0-1.4, u, b[2]-0.09, (AZ0+AZ1)/2,
              0.4, 0, GILT);
        }
        for(let i=0;i<nr;i++){                        // a rosette in each coffer
          const u=b[0]+L*((i+0.5)/nr);
          for(const cz of [(AZ0+AZ1)/2-6.0, (AZ0+AZ1)/2, (AZ0+AZ1)/2+6.0]){
            m.C("brass", 0.34,0.42,0.14,16, u, b[2]-0.10, cz, GILT, 0, 0, Math.PI);
            m.P("sconce", planeGeo(0.80, 0.80, 0), u, b[2]-0.19, cz, 0,
                "#ffb45c", Math.PI/2, 0);
          }
        }
      }
    }
    // the end walls
    m.B("concrete", WT, 12.00-FLOORB, AZ1-AZ0+WT*2, AX0-WT/2, FLOORB+(12.00-FLOORB)/2,
        (AZ0+AZ1)/2, 0.5, 0, "#8d877c");
    m.P("plaster", planeGeo(AZ1-AZ0, 12.00-FLOORB, 0.5), AX0+0.02,
        (12.00+FLOORB)/2, (AZ0+AZ1)/2, Math.PI/2, "#2a2420", 0, 0);   // the back wall
    /* The east wall, with the corridor's mouth left out of it — the one way
       in, and the only thing in this room that has to line up exactly with
       something in another file. The mass, the collider and the lining all
       get the hole; forgetting any one of them is how a door gets blocked. */
    for(const q of [[AZ0-WT, CZ0],[CZ1, AZ1+WT]])
      m.B("concrete", WT, -2.60-FLOORB, q[1]-q[0], AX1+WT/2, FLOORB+(-2.60-FLOORB)/2,
          (q[0]+q[1])/2, 0.5, 0, "#8d877c");
    m.B("concrete", WT, -2.60-(RD+2.30), CZ1-CZ0, AX1+WT/2, (RD+2.30-2.60)/2,
        (CZ0+CZ1)/2, 0.5, 0, "#8d877c");
    /* UP TO THE FLOOR, NOT UP TO THE HEAD OF THE DOOR. This piece is the
       wall BELOW the opening — the mass the balcony sits on. It was built
       to RD+2.30, which is the top of the doorway, so it filled the doorway
       from the inside: the collider was open, the walk probe went straight
       through, and the geometry was a blank wall at the end of the
       corridor. A hole has a sill, a head and two jambs, and the piece
       under the sill stops AT the sill. */
    m.B("concrete", WT, RD-FLOORB, CZ1-CZ0, AX1+WT/2, FLOORB+(RD-FLOORB)/2,
        (CZ0+CZ1)/2, 0.5, 0, "#8d877c");
    // and the opening gets a lining, like every other hole in this world
    for(const q of [CZ0, CZ1]){
      const sd=q===CZ0?1:-1;
      m.B("plaster", WT+0.10, 2.34, 0.10, AX1+WT/2, RD+1.17, q+sd*0.005, 0.5, 0, "#6e5234");
    }
    m.B("plaster", WT+0.10, 0.10, CZ1-CZ0+0.18, AX1+WT/2, RD+2.31, (CZ0+CZ1)/2,
        0.5, 0, "#6e5234");
    m.B("brass", 0.06, 0.06, CZ1-CZ0+0.24, AX1-0.03, RD+2.39, (CZ0+CZ1)/2, 0.4, 0, GILT);
    // colliders: four walls, from well below the pit to above the fly tower
    m.col(AX0-WT, SDX0, AZ0-WT, AZ0, PITY-2, 13.0);
    m.col(SDX1, AX1+WT, AZ0-WT, AZ0, PITY-2, 13.0);
    m.col(SDX0, SDX1, AZ0-WT, AZ0, STLY+SDH, 13.0);
    m.col(SDX0, SDX1, AZ0-WT, AZ0, PITY-2, STLY-0.05);
    m.col(AX0-WT, AX1+WT, AZ1, AZ1+WT, PITY-2, 13.0);
    m.col(AX0-WT, AX0, AZ0, AZ1, PITY-2, 13.0);
    m.col(AX1, AX1+WT, AZ0, CZ0, PITY-2, 13.0);
    m.col(AX1, AX1+WT, CZ1, AZ1, PITY-2, 13.0);
    m.col(AX1, AX1+WT, CZ0, CZ1, RD+2.30, 13.0);
    // and the risers between the ceiling bays, which are walls in the air
    for(let i=0;i<BAY.length-1;i++){
      const lo=BAY[i][2], hi=BAY[i+1][2], x=BAY[i][0];
      m.B("concrete", 0.60, hi-lo+0.60, AZ1-AZ0+WT*2, x-0.30, lo+(hi-lo+0.60)/2-0.30,
          (AZ0+AZ1)/2, 0.5, 0, "#4e3a30");
      // a moulded band under each step, which is what makes it read as a
      // rising coffered ceiling rather than as a mistake
      m.B("brass", 0.26, 0.26, AZ1-AZ0, x-0.30, lo-0.18, (AZ0+AZ1)/2, 0.4, 0, GILT);
      m.P("sconce", planeGeo(AZ1-AZ0-0.4, 0.26, 0), x-0.46, lo-0.46, (AZ0+AZ1)/2,
          -Math.PI/2, "#ffaa52", 0, 0);
      m.P("floorglow", planeGeo(AZ1-AZ0-0.4, 2.4, 0), x-0.33, lo-0.70, (AZ0+AZ1)/2,
          -Math.PI/2, "#ff9c3e", 0, 0);
    }
    /* The walls, lined: a plaster field with pilasters between the bays.
       The stage house is NOT lined — behind a proscenium the walls are
       black, because anything you can see up there you were not meant to. */
    for(const b of BAY) for(const q of [[AZ0+0.03, 0],[AZ1-0.03, Math.PI]]){
      const L=b[1]-b[0], ry=q[1]===0?0:Math.PI, house=b[1]<=STGX;
      const cut = q[1]===0 && b[0]<SDX1 && b[1]>SDX0;
      for(const r of (cut ? [[b[0], SDX0],[SDX1, b[1]]] : [[b[0], b[1]]]))
        if(r[1]-r[0]>0.02)
          m.P("plaster", planeGeo(r[1]-r[0], b[2]-FLOORB, 0.55), (r[0]+r[1])/2,
              (b[2]+FLOORB)/2, q[0], ry, house?"#2a2420":PLAS, 0, 0);
      if(cut)
        m.P("plaster", planeGeo(SDX1-SDX0, b[2]-(STLY+SDH), 0.55), (SDX0+SDX1)/2,
            (b[2]+STLY+SDH)/2, q[0], ry, PLAS, 0, 0);
      if(house) continue;
      for(let i=0;i<Math.round(L/2.5);i++){
        const u=b[0]+L*((i+0.5)/Math.round(L/2.5));
        m.B("plaster", 0.34, b[2]-FLOORB-0.3, 0.16, u, (b[2]+FLOORB-0.3)/2,
            q[0]+(q[1]===0?0.08:-0.08), 0.5, 0, "#6e5234");
        m.B("brass", 0.42, 0.14, 0.22, u, b[2]-0.46, q[0]+(q[1]===0?0.11:-0.11),
            0.4, 0, GILT);
      }
      /* A PANELLED DADO. A plaster field from the floor to the ceiling is
         an aircraft hangar; what makes a room this size feel made is the
         band at human height that is a different material from everything
         above it. Oak to 1.9 m, framed in fielded panels with a gilt bead
         at the top, the whole way down both walls. */
      { const base = house ? STGY : STLY-0.6;
        for(const r of (cut ? [[b[0], SDX0],[SDX1, b[1]]] : [[b[0], b[1]]]))
          if(r[1]-r[0]>0.02)
            m.P("oak", planeGeo(r[1]-r[0], 1.90, 1.3), (r[0]+r[1])/2, base+0.95,
                q[0], ry, OAKM, 0, 0);
        /* THE CAP RAIL STOPS AT THE DOOR. A rail carried across an opening
           is the single most-repeated fault in this project; it is thin, it
           is easy to miss in a screenshot, and it is a barrier across the
           way through all the same. */
        for(const r of (cut ? [[b[0], SDX0],[SDX1, b[1]]] : [[b[0], b[1]]])){
          const RL=r[1]-r[0]; if(RL<=0.02) continue;
          m.B("oak", RL, 0.11, 0.17, (r[0]+r[1])/2, base+1.95,
              q[0]+(q[1]===0?0.075:-0.075), 0.5, 0, OAKD);
          m.B("brass", RL, 0.045, 0.11, (r[0]+r[1])/2, base+2.03,
              q[0]+(q[1]===0?0.055:-0.055), 0.4, 0, GILT);
          m.B("oak", RL, 0.13, 0.15, (r[0]+r[1])/2, base+0.10,
              q[0]+(q[1]===0?0.07:-0.07), 0.5, 0, OAKD);
        }
        for(let i=0;i<Math.round(L/1.25);i++){
          const u=b[0]+L*((i+0.5)/Math.round(L/1.25));
          if(cut && u>SDX0-0.6 && u<SDX1+0.6) continue;   // not across the door
          m.B("oak", 0.96, 1.26, 0.06, u, base+1.02,
              q[0]+(q[1]===0?0.035:-0.035), 0.6, 0, "#5e3f26");
          m.B("oak", 0.80, 1.10, 0.09, u, base+1.02,
              q[0]+(q[1]===0?0.05:-0.05), 0.6, 0, OAKM);
        }
      }
      for(let i=0;i<9;i++)
        m.P("stain", streakGeo(1.2+R(i)*3.0, 1.0+R(i+4)*2.4, 0),
            b[0]+L*((i+0.5)/9+(R(i+2)-0.5)*0.1),
            STLY-0.6+R(i+6)*(b[2]-STLY),
            q[0]+(q[1]===0?0.012+i*0.002:-0.012-i*0.002), ry,
            R(i+3)<0.5?"#4e3a26":"#63492e", 0, 0);
    }
    m.voidAt(AX0-0.5, AX1+0.6, AZ0-0.5, AZ1+0.5, PITY-1.5, 13.0, PITY);
    addBuried(W(AX0-0.6), W(AX1+0.6), Z(AZ0-0.6), Z(AZ1+0.6), GY+PITY-1.5, GY+13.2);
    addZone(W(AX0), W(AX1), Z(AZ0), Z(AZ1), GY+PITY-1.5, GY+13.0, "THE LONG ROOM", true);
  })();

  /* ====================================================================
     3 · THE FLOOR OF THE HALL: stage, pit, rake, aisles
     ==================================================================== */
  (function floors(){
    const plank=(x0,x1,z0,z1,y,c)=>{
      m.B("concrete", x1-x0, 0.50, z1-z0, (x0+x1)/2, y-0.26, (z0+z1)/2, 0.5, 0, "#8a847a");
      m.P("plank", planeGeo(x1-x0, z1-z0, 0.42), (x0+x1)/2, y+0.005, (z0+z1)/2,
          0, c, -Math.PI/2, 0);
      /* The flat is 10 cm bigger than the board on every side. Two steps
         that merely MEET leave a line with nothing on it and you fall
         through it; the shelter's threshold taught this the hard way. */
      m.flat(x0-0.10, x1+0.10, z0-0.10, z1+0.10, y);
    };
    // the stage, boarded, with a lip over the pit
    plank(AX0, STGX, AZ0, AZ1, STGY, "#7a5c3a");
    /* THE STAGE HAD NO FRONT. Under the boards there was a 50 cm pale
       concrete sub-slab and then a metre of nothing down to the pit, open
       to the hall — which is the "gap near the stage". A real stage front
       is a dark panelled apron from the pit floor to the lip, with a gilt
       moulding along the top of it, and it is one of the two or three
       things in a theatre you look at most. */
    m.B("oak", 0.26, 0.26, AZ1-AZ0, STGX-0.13, STGY-0.13, (AZ0+AZ1)/2, 0.5, 0, OAKD);
    m.B("brass", 0.32, 0.09, AZ1-AZ0, STGX-0.16, STGY-0.30, (AZ0+AZ1)/2, 0.4, 0, GILT);
    m.B("oak", 0.20, STGY-0.34-PITY, AZ1-AZ0, STGX-0.10, (STGY-0.34+PITY)/2,
        (AZ0+AZ1)/2, 0.5, 0, "#3a2418");
    for(let i=0;i<Math.round((AZ1-AZ0)/1.3);i++){      // the panelling in it
      const z=AZ0+0.65+i*1.3;
      m.B("oak", 0.07, STGY-0.60-PITY-0.2, 1.06, STGX-0.03, (STGY-0.60+PITY+0.2)/2,
          z, 0.5, 0, "#4a3020");
      m.B("brass", 0.04, 0.04, 1.16, STGX-0.015, STGY-0.52, z, 0.4, 0, GILT);
    }
    m.col(AX0, STGX, AZ0, AZ1, PITY-1, STGY-0.03);
    // the pit, which you can see into and not get into
    plank(STGX, STGX+1.80, AZ0+7.5, AZ1-7.5, PITY, "#53402a");
    /* The two ends of the pit trench were colliders with nothing drawn in
       them, so from the stalls you looked into a void beside the players.
       They are filled masonry now, with the stalls floor carried over. */
    for(const q of [[AZ0-WT, AZ0+7.5],[AZ1-7.5, AZ1+WT]]){
      m.B("concrete", 1.80, STLY-PITY+0.9, q[1]-q[0], STGX+0.90, (STLY+PITY-0.9)/2,
          (q[0]+q[1])/2, 0.5, 0, "#857f75");
      m.P("plank", planeGeo(1.80, q[1]-q[0], 0.42), STGX+0.90, STLY+0.005,
          (q[0]+q[1])/2, 0, "#7a5c3a", -Math.PI/2, 0);
      m.flat(STGX-0.10, STGX+1.90, q[0], q[1], STLY);
      m.col(STGX, STGX+1.80, q[0], q[1], PITY-1, STLY);
    }
    // the pit's own walls, dark, so it reads as a trench and not a hole
    for(const q of [[AZ0+7.5, AZ0+7.62],[AZ1-7.62, AZ1-7.5]])
      m.B("oak", 1.80, STLY-PITY, q[1]-q[0], STGX+0.90, (STLY+PITY)/2,
          (q[0]+q[1])/2, 0.5, 0, "#3a2418");
    m.B("oak", 0.14, STLY-PITY, AZ1-AZ0-15.0, STGX+1.87, (STLY+PITY)/2,
        (AZ0+AZ1)/2, 0.5, 0, "#3a2418");
    /* AND THE RAIL ITSELF IS SOLID. Without it you walk off the front
       cross-aisle straight into the orchestra pit, which is a metre and a
       half down and has no way out. */
    m.col(STGX+1.76, STGX+1.92, AZ0, AZ1, PITY-1, STLY+0.95);
    m.B("brass", 0.07, 0.09, AZ1-AZ0-15.0, STGX+1.84, STLY+0.55, (AZ0+AZ1)/2,
        0.4, 0, GILT);                                   // the orchestra rail
    for(let i=0;i<9;i++)
      m.C("brass", 0.030,0.030,0.60,8, STGX+1.84, STLY+0.28,
          AZ0+7.9+i*((AZ1-AZ0-15.8)/8), BR);
    // the front cross-aisle, the rake, and the back cross-aisle. Each piece
    // butts the next and the flats overlap, so the whole floor is one
    // continuous surface with eleven 26 cm steps in it.
    plank(STGX+1.80, rowX(0)-ROWG/2, AZ0, AZ1, STLY, "#7a5c3a");
    for(let r=0;r<ROWS;r++)
      plank(rowX(r)-ROWG/2, rowX(r)+ROWG/2, AZ0, AZ1, rowY(r),
            r%2?"#775737":"#7e5e3c");
    plank(rowX(ROWS-1)+ROWG/2, BALX, AZ0, AZ1, rowY(ROWS-1), "#7a5c3a");
    // the riser face of each step, so the rake reads from the stage end
    for(let r=0;r<ROWS;r++){
      const yb=r?rowY(r-1):STLY;
      m.B("concrete", 0.06, rowY(r)-yb+0.04, AZ1-AZ0, rowX(r)-ROWG/2-0.01,
          (rowY(r)+yb)/2, (AZ0+AZ1)/2, 0.5, 0, "#6e665c");
    }
    m.B("concrete", 0.06, rowY(ROWS-1)-rowY(ROWS-2)+0.04, AZ1-AZ0,
        rowX(ROWS-1)+ROWG/2+0.01, (rowY(ROWS-1)+rowY(ROWS-2))/2+0.26,
        (AZ0+AZ1)/2, 0.5, 0, "#6e665c");
    // carpet down the three aisles, because a theatre is carpeted where you walk
    for(const q of [[CA0, CA1],[AZ0+0.4, AZ0+SA],[AZ1-SA, AZ1-0.4]])
      for(let r=0;r<ROWS;r++)
        m.P("carpet", boxGeo(ROWG-0.04, 0.016, q[1]-q[0], 0.5), rowX(r), rowY(r)+0.024,
            (q[0]+q[1])/2, 0, r%3?CARP:CARD, 0, 0);
    m.P("carpet", boxGeo(rowX(0)-ROWG/2-(STGX+1.9), 0.016, AZ1-AZ0-1.0, 0.6),
        (STGX+1.9+rowX(0)-ROWG/2)/2, STLY+0.024, (AZ0+AZ1)/2, 0, CARP, 0, 0);
    m.P("carpet", boxGeo(BALX-0.1-(rowX(ROWS-1)+ROWG/2), 0.016, AZ1-AZ0-1.0, 0.6),
        (rowX(ROWS-1)+ROWG/2+BALX-0.1)/2, rowY(ROWS-1)+0.024, (AZ0+AZ1)/2,
        0, CARP, 0, 0);
  })();

  /* ====================================================================
     4 · THE BALCONY AND THE GRAND STAIR OFF IT
     --------------------------------------------------------------------
     The balcony is where the door puts you and it is the only part of this
     building that is small. One flight, three metres wide, straight down
     the centre line into the back of the stalls — so the first thing you do
     after seeing the hall is walk into the middle of it.
     ==================================================================== */
  (function balcony(){
    m.B("concrete", AX1-BALX, 0.55, AZ1-AZ0, (BALX+AX1)/2, BALY-0.28,
        (AZ0+AZ1)/2, 0.5, 0, "#8a847a");
    m.P("plank", planeGeo(AX1-BALX, AZ1-AZ0, 0.42), (BALX+AX1)/2, BALY+0.008,
        (AZ0+AZ1)/2, 0, "#8d7049", -Math.PI/2, 0);
    m.P("carpet", boxGeo(AX1-BALX-0.4, 0.018, AZ1-AZ0-0.6, 0.6), (BALX+AX1)/2,
        BALY+0.03, (AZ0+AZ1)/2, 0, CARP, 0, 0);
    m.flat(BALX-0.10, AX1+0.4, AZ0, AZ1, BALY);
    /* THE BALCONY STANDS ON FILL, not on air: without this you could walk
       under it from the back of the stalls into a space that has no floor,
       which is the same bug as a slab poured across a stairwell with the
       sign reversed. It stands 45 cm back from the front edge because THE
       PLAYER HAS A RADIUS: standing on the stair's top tread, 34 cm of
       capsule reaches back under the balcony, and at a 2 cm setback that
       was enough to stop you taking the first step down. A setback is
       measured from the body, not from the foot. */
    m.col(BALX+0.45, AX1+WT, AZ0, AZ1, FLOORB, BALY-0.05);
    // a gilt soffit band under the front edge, lit from behind
    m.B("brass", 0.30, 0.30, AZ1-AZ0, BALX-0.15, BALY-0.44, (AZ0+AZ1)/2, 0.4, 0, GILT);
    m.P("sconce", planeGeo(AZ1-AZ0-0.3, 0.22, 0), BALX-0.32, BALY-0.70, (AZ0+AZ1)/2,
        -Math.PI/2, "#ffb05a", 0, 0);

    /* THE BALUSTRADE, with one gap in it, on the centre line, where the
       stair goes. A rail across the head of a stair is a barrier across the
       way down — the shelter's first rail was exactly that and the walk
       probe walked into it. */
    for(const g of [[AZ0, CA0],[CA1, AZ1]]){
      m.B("oak", 0.22, 0.14, g[1]-g[0], BALX+0.11, BALY+1.04, (g[0]+g[1])/2, 0.5, 0, OAKD);
      m.B("velvet", 0.15, 0.80, g[1]-g[0], BALX+0.11, BALY+0.57, (g[0]+g[1])/2,
          2.2, 0, OX);
      m.B("brass", 0.19, 0.07, g[1]-g[0], BALX+0.11, BALY+0.14, (g[0]+g[1])/2, 0.4, 0, GILT);
      // and a run of fielded panels in it, with a gilt swag over each
      for(let i=0;i<Math.round((g[1]-g[0])/1.9);i++){
        const z=g[0]+(g[1]-g[0])*((i+0.5)/Math.round((g[1]-g[0])/1.9));
        m.B("brass", 0.05, 0.56, 1.42, BALX+0.04, BALY+0.56, z, 0.4, 0, GILT);
        m.B("velvet", 0.04, 0.46, 1.28, BALX+0.025, BALY+0.56, z, 2.2, 0, OXD);
        m.P("brass", new T.TorusGeometry(0.30, 0.028, 5, 16), BALX+0.02, BALY+0.70, z,
            Math.PI/2, GILT, 0, 0);
      }
      for(let i=0;i<Math.round((g[1]-g[0])/1.1);i++)
        m.C("brass", 0.026,0.026,0.92,8, BALX+0.02, BALY+0.52,
            g[0]+0.55+i*1.1, BR);
      m.col(BALX, BALX+0.24, g[0], g[1], BALY, BALY+1.12);
    }

    /* THE FLIGHT. Sixteen steps. The rise and the going are DERIVED from
       the two levels and the distance between them, never chosen — a stair
       built off a guessed going misses its landing by a tread and you step
       into the air at the bottom of it. */
    const FALL=BALY-rowY(ROWS-1), RUN=BALX-XAB, N=16;
    const RISE=FALL/N, GO=RUN/N;
    for(let i=1;i<=N;i++){
      const ty=BALY-i*RISE, x1=BALX-(i-1)*GO, x0=x1-GO;
      m.B("stairs", GO+0.03, 0.08, CA1-CA0, x0+GO/2, ty-0.04, (CA0+CA1)/2, 0.7, 0,
          i%2?"#9c8e78":"#a2947c");
      m.B("oak", 0.05, RISE+0.02, CA1-CA0, x1-0.02, ty+RISE/2-0.02, (CA0+CA1)/2,
          0.5, 0, OAKD);
      m.P("carpet", boxGeo(GO-0.06, 0.012, CA1-CA0-0.46, 0.5), x0+GO/2, ty+0.048,
          (CA0+CA1)/2, 0, CARP, 0, 0);
      m.flat(x0-0.04, x1+0.04, CA0-0.10, CA1+0.10, ty);
      m.B("concrete", GO+0.06, 0.40, CA1-CA0+0.30, x0+GO/2, ty-0.26, (CA0+CA1)/2,
          0.5, 0, "#8a847a");                       // the stringer under it
    }
    // the two cheeks, with a brass rail running down each on raking standards
    for(const sd of [-1,1]){
      const zr=(CA0+CA1)/2 + sd*((CA1-CA0)/2+0.15);
      for(let i=0;i<=N;i+=2){
        const ty=BALY-i*RISE, x0=BALX-i*GO;
        m.C("brass", 0.028,0.028,0.98,8, x0, ty+0.49, zr, BR);
      }
      const pitch=Math.atan2(RISE, GO), L=Math.hypot(RUN, FALL)+0.3;
      m.P("brass", new T.CylinderGeometry(0.034,0.034,L,10), BALX-RUN/2,
          BALY-FALL/2+0.98, zr, 0, BR, 0, Math.PI/2+pitch);
      m.P("velvet", boxGeo(0.16, 0.56, L, 2.2), BALX-RUN/2, BALY-FALL/2+0.22,
          zr+sd*0.08, 0, OX, 0, pitch);
    }
    addZone(W(XAB), W(BALX), Z(CA0), Z(CA1), GY+rowY(ROWS-1)-0.5, GY+BALY+1.2,
            "THE GRAND STAIR", true);
    addZone(W(BALX), W(AX1), Z(AZ0), Z(AZ1), GY+BALY-0.5, GY-2.60, "THE BALCONY", true);
  })();

  /* ====================================================================
     5 · THE PROSCENIUM, THE CURTAIN AND WHAT IS ON THE STAGE
     ==================================================================== */
  (function proscenium(){
    const PW=12.0, PZ_0=(AZ0+AZ1)/2-PW/2, PZ_1=(AZ0+AZ1)/2+PW/2;
    const HEAD=STGY+9.20;
    // the piers
    for(const q of [[AZ0, PZ_0],[PZ_1, AZ1]]){
      m.B("plaster", 1.40, HEAD-STLY, q[1]-q[0], STGX+0.70, (HEAD+STLY)/2,
          (q[0]+q[1])/2, 0.5, 0, "#6e5234");
      m.col(STGX, STGX+1.40, q[0], q[1], PITY-1, HEAD);
      // fluting
      for(let i=0;i<Math.round((q[1]-q[0])/0.62);i++)
        m.C("plaster", 0.09,0.09,HEAD-STLY-1.2, 8, STGX+1.36,
            (HEAD+STLY)/2-0.3, q[0]+0.31+i*0.62, "#7e6038");
      m.B("brass", 1.60, 0.34, q[1]-q[0]+0.20, STGX+0.70, HEAD-0.17,
          (q[0]+q[1])/2, 0.4, 0, GILT);
    }
    // the entablature over the opening, and the tympanum above it
    m.B("plaster", 1.40, 1.30, PW+0.6, STGX+0.70, HEAD+0.65, (AZ0+AZ1)/2, 0.5, 0, "#6e5234");
    m.B("brass", 1.70, 0.30, PW+0.9, STGX+0.70, HEAD+0.15, (AZ0+AZ1)/2, 0.4, 0, GILT);
    m.B("brass", 1.70, 0.26, PW+0.9, STGX+0.70, HEAD+1.32, (AZ0+AZ1)/2, 0.4, 0, GILT);
    m.B("plaster", 1.20, 12.00-(HEAD+1.30), PW+0.6, STGX+0.60,
        (HEAD+1.30+12.00)/2, (AZ0+AZ1)/2, 0.5, 0, "#6e5234");
    m.col(STGX, STGX+1.40, PZ_0, PZ_1, HEAD, 13.0);
    /* A SUNBURST over the arch, which is the one piece of ornament in the
       building that is trying. Forty gilt rays off a boss, lit from behind:
       at this size an emissive is the only light that can sit on a wall
       eleven metres up and still be seen from the door. */
    /* ON THE AUDIENCE SIDE OF THE ARCH. The piers stand at STGX..STGX+1.40,
       which is downstage of the proscenium line, so the face you can see
       from the hall is the +x one and everything on it faces +x. Put it at
       STGX and it is behind the arch, lighting the back of the curtain. */
    { const cy=HEAD+3.20, cz=(AZ0+AZ1)/2, fx=STGX+1.42;
      m.P("sconce", planeGeo(5.2, 5.2, 0), fx, cy, cz, Math.PI/2, "#ffa83e", 0, 0);
      for(let i=0;i<40;i++){
        const a=i/40*Math.PI*2, L=1.5+((i%3)*0.42);
        m.P("brass", boxGeo(0.12, L, 0.07, 0.4), fx+0.06,
            cy+Math.sin(a)*(1.0+L/2), cz+Math.cos(a)*(1.0+L/2), 0, GILT, -a, 0);
      }
      m.C("brass", 0.62,0.70,0.26,20, fx+0.13, cy, cz, GILT, 0, 0, Math.PI/2);
      m.P("flame", new T.SphereGeometry(0.40,14,10), fx+0.26, cy, cz, 0, "#ffc46a");
      m.lamp(fx+1.4, cy, cz, {color:0xffb052, intensity:1.00, dist:22.0, decay:1.1,
             indoor:true, vol:AVOL});
    }
    /* THE CURTAIN, half out. Swagged velvet in folds — a fold is a vertical
       cylinder and the swag is the line their tops run along, which is all a
       curtain is at this distance. */
    for(let i=0;i<34;i++){
      const t=i/33, z=PZ_0+0.3+t*(PW-0.6);
      const sag=Math.sin(t*Math.PI)*1.10;
      const top=HEAD-0.5, bot=top-2.2-sag*2.4;
      m.C("velvet", 0.30,0.26,top-bot, 10, STGX-0.42, (top+bot)/2, z,
          i%2?OX:OXD);
    }
    m.B("velvet", 0.44, 0.44, PW-0.4, STGX-0.42, HEAD-0.36, (AZ0+AZ1)/2, 2.2, 0, OXD);
    for(const q of [PZ_0+0.9, PZ_1-0.9])                 // the legs, drawn back
      for(let i=0;i<7;i++)
        m.C("velvet", 0.34,0.30, HEAD-STGY-1.0, 10, STGX-0.42-0.0,
            (HEAD+STGY)/2-0.5, q+(q<(AZ0+AZ1)/2?1:-1)*i*0.30, i%2?OX:OXD);
    /* THE TIE-BACKS FACE THE HOUSE. A torus's axis is +z, so with ry of
       nothing it hangs edge-on to the audience and reads as a gold sliver;
       the ring has to be turned a quarter turn to be a ring at all. A
       rosette and a tassel beat a bare hoop anyway. */
    for(const q of [PZ_0+1.5, PZ_1-1.5]){
      m.C("brass", 0.26,0.20,0.10,16, STGX-0.10, STGY+3.6, q, GILT, 0, 0, Math.PI/2);
      m.P("brass", new T.TorusGeometry(0.17, 0.040, 6, 16), STGX-0.04, STGY+3.6, q,
          Math.PI/2, GILT, 0, 0);
      m.C("brass", 0.045,0.075,0.34,10, STGX-0.08, STGY+3.33, q, "#9c7c34");
      for(let i=0;i<7;i++)
        m.C("brass", 0.009,0.006,0.26,5, STGX-0.08+Math.cos(i*0.9)*0.05,
            STGY+3.03, q+Math.sin(i*0.9)*0.05, "#9c7c34");
    }
    // footlights along the stage edge, in a trough
    m.B("metal", 0.26, 0.22, AZ1-AZ0-2.0, STGX-0.22, STGY+0.11, (AZ0+AZ1)/2, 0.4, 0, "#5a5048");
    for(let i=0;i<24;i++){
      const z=AZ0+1.4+i*((AZ1-AZ0-2.8)/23);
      m.P("bulkhead", new T.SphereGeometry(0.075,10,8), STGX-0.22, STGY+0.22, z,
          0, "#ffd79a");
    }
    m.P("floorglow", planeGeo(3.4, AZ1-AZ0-2.0, 0), STGX-2.0, STGY+0.03, (AZ0+AZ1)/2,
        0, "#ff9c3e", -Math.PI/2, 0);
    for(const q of [AZ0+5.0, (AZ0+AZ1)/2, AZ1-5.0])
      m.lamp(STGX-1.2, STGY+0.9, q, {color:0xffc078, intensity:0.80, dist:16.0,
             decay:1.3, indoor:true, vol:AVOL});
    /* On the stage, almost nothing: a chair, a music stand, a drum kit under
       a sheet. Whatever happened here finished. */
    m.C("oak", 0.030,0.030,1.30,8, STGX-3.4, STGY+0.65, (AZ0+AZ1)/2-1.2, "#3a3330");
    m.P("metal", boxGeo(0.42,0.30,0.03,0.4), STGX-3.4, STGY+1.26, (AZ0+AZ1)/2-1.2,
        0, "#5a5450", -0.5, 0);
    m.B("oak", 0.46, 0.05, 0.44, STGX-4.6, STGY+0.46, (AZ0+AZ1)/2+1.6, 0.5, 0, OAKD);
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      m.C("oak", 0.022,0.018,0.44, 6, STGX-4.6+a[0]*0.19, STGY+0.22,
          (AZ0+AZ1)/2+1.6+a[1]*0.18, OAKD);
    m.B("oak", 0.05, 0.50, 0.42, STGX-4.82, STGY+0.73, (AZ0+AZ1)/2+1.6, 0.5, 0, OAKD);
    { const g=new T.SphereGeometry(0.90,14,10); g.scale(1.0,0.62,1.0);
      m.P("paper", g, STGX-6.4, STGY+0.50, (AZ0+AZ1)/2-3.2, 0.3, "#b8b0a0"); }
    m.P("paper", boxGeo(0.22,0.012,0.30,0.4), STGX-2.2, STGY+0.012, (AZ0+AZ1)/2+0.4,
        0.4, "#cfc6ae", 0, 0);
    // a music stand in the pit, and a chair
    m.C("metal", 0.024,0.024,1.10,6, STGX+0.9, PITY+0.55, (AZ0+AZ1)/2-0.8, "#5a5450");
    m.P("metal", boxGeo(0.40,0.28,0.03,0.4), STGX+0.9, PITY+1.08, (AZ0+AZ1)/2-0.8,
        0, "#5a5450", -0.55, 0);
    m.B("oak", 0.42, 0.05, 0.40, STGX+1.3, PITY+0.44, (AZ0+AZ1)/2+0.6, 0.5, 0, OAKD);
  })();

  /* ====================================================================
     6 · THE SEATS
     --------------------------------------------------------------------
     Two blocks of thirteen rows. A theatre seat is four things: two cast
     standards, a tipped seat, a back and an arm — and the reason a hall
     reads as a hall is that there are three hundred of them in rows you
     can see all the way down.
     ==================================================================== */
  (function seating(){
    const PITCH=0.58;
    const seat=(sx,sy,sz,up)=>{
      for(const q of [-1,1])
        m.B("metal", 0.46, 0.44, 0.05, sx-0.02, sy+0.22, sz+q*(PITCH/2-0.025),
            0.4, 0, "#3e3832");
      if(up) m.P("velvet", boxGeo(0.44, 0.07, PITCH-0.09, 2.2), sx-0.20, sy+0.46, sz,
                 0, OX, 0, Math.PI/2-0.22);
      else   m.P("velvet", boxGeo(0.46, 0.09, PITCH-0.09, 2.2), sx, sy+0.44, sz,
                 0, OX, 0, 0);
      m.P("velvet", boxGeo(0.10, 0.52, PITCH-0.09, 2.2), sx-0.22, sy+0.70, sz,
          0, OX, 0, -0.12);
      m.P("oak", boxGeo(0.34, 0.05, 0.07, 0.4), sx+0.02, sy+0.50, sz+PITCH/2-0.025,
          0, OAKD, 0, 0);
      m.B("metal", 0.07, 0.10, 0.07, sx+0.16, sy+0.05, sz+PITCH/2-0.025, 0.4, 0, "#3e3832");
    };
    let n=0;
    for(let r=0;r<ROWS;r++){
      const sx=rowX(r), sy=rowY(r);
      for(const blk of [[AZ0+SA, CA0],[CA1, AZ1-SA]]){
        const cnt=Math.floor((blk[1]-blk[0])/PITCH);
        const z0=blk[0]+((blk[1]-blk[0])-cnt*PITCH)/2+PITCH/2;
        for(let i=0;i<cnt;i++){
          const sz=z0+i*PITCH;
          seat(sx, sy, sz, R(n)<0.72);          // most of them tipped up
          if((n%37)===5) addSeat(W(sx), Z(sz), GY+sy+0.52, Math.PI, "A SEAT");
          n++;
        }
        // the row letter on the end standard
        m.P("art", planeGeo(0.14,0.14,0), sx+0.10, sy+0.62, blk[0]+0.06,
            blk[0]<CA0?-Math.PI/2:Math.PI/2, "#8a7a5e", 0, 0);
      }
      m.col(sx-0.30, sx+0.30, AZ0+SA, CA0, rowY(r), rowY(r)+0.50);
      m.col(sx-0.30, sx+0.30, CA1, AZ1-SA, rowY(r), rowY(r)+0.50);
    }
    /* The three things that say somebody was here. A coat over the back of
       a seat at the end of a row, a programme face down on another, and one
       seat in the middle of the hall still tipped down. */
    m.P("velvet", boxGeo(0.14, 0.70, 0.46, 2.2), rowX(9)-0.26, rowY(9)+0.78,
        CA1+0.9, 0, "#2e2a26", 0.08, 0);
    m.P("paper", boxGeo(0.17, 0.012, 0.24, 0.4), rowX(4), rowY(4)+0.50, CA0-1.6,
        0.3, "#cfc6ae", 0, 0);
    m.P("glass", new T.CylinderGeometry(0.030,0.024,0.10,10), rowX(2)+0.18,
        rowY(2)+0.05, CA1+2.1, 0, "#9aa8a4");
  })();

  /* ====================================================================
     7 · BOXES, CHANDELIERS AND THE HOUSE LIGHTS
     ==================================================================== */
  (function dressing(){
    // four boxes, two a side, hung off the walls over the stalls
    for(const sd of [1,-1]) for(let k=0;k<2;k++){
      const bx0=STGX+4.2+k*6.4, bz=sd>0?AZ0+0.02:AZ1-0.02, inw=sd>0?1:-1;
      const by=STLY+4.6;
      m.B("plaster", 4.0, 0.34, 2.2, bx0, by, bz+inw*1.1, 0.5, 0, "#6e5234");
      m.B("velvet", 4.0, 0.92, 0.24, bx0, by+0.63, bz+inw*2.2, 2.2, 0, OX);
      for(const q of [-1,1])
        m.B("velvet", 0.24, 0.92, 2.2, bx0+q*1.88, by+0.63, bz+inw*1.1, 2.2, 0, OX);
      m.B("brass", 4.2, 0.12, 2.4, bx0, by+1.12, bz+inw*1.1, 0.4, 0, GILT);
      // the canopy over it, on two brackets
      m.B("plaster", 4.4, 0.30, 2.6, bx0, by+3.40, bz+inw*1.3, 0.5, 0, "#6e5234");
      m.B("brass", 4.6, 0.16, 2.8, bx0, by+3.22, bz+inw*1.3, 0.4, 0, GILT);
      for(const q of [-1,1])
        m.C("brass", 0.05,0.05,3.3, 8, bx0+q*1.9, by+1.70, bz+inw*2.1, GILT);
      // two chairs in it, and a lamp
      for(const q of [-0.8, 0.8]){
        m.C("oak", 0.20,0.22,0.06,12, bx0+q, by+0.62, bz+inw*1.2, OAKD);
        m.P("velvet", boxGeo(0.40,0.07,0.40,0.5), bx0+q, by+0.69, bz+inw*1.2, 0, OX, 0, 0);
        m.P("velvet", boxGeo(0.08,0.52,0.40,0.5), bx0+q, by+0.98, bz+inw*0.88, 0, OX, 0, 0);
      }
      m.B("brass", 0.22, 0.09, 0.14, bx0-1.7, by+2.10, bz+inw*0.22, 0.4, 0, BRD);
      m.P("sconce", planeGeo(0.20, 0.28, 0), bx0-1.7, by+2.24, bz+inw*0.34,
          inw>0?0:Math.PI, "#ffb866", 0, 0);
      m.P("floorglow", planeGeo(2.6, 1.6, 0), bx0, by+0.36, bz+inw*1.2,
          0, "#ff9c3e", -Math.PI/2, 0);
      m.lamp(bx0, by+1.6, bz+inw*2.4, {color:0xffb470, intensity:0.70, dist:16.0,
             decay:1.3, indoor:true, vol:AVOL});
      /* THE BOX IS HUNG, SO ITS COLLIDER HANGS TOO. At STLY it was a solid
         four metres of nothing standing in the side aisle from the floor
         up — the box is five metres in the air and the aisle under it is
         the way to the back of the hall. Only the box itself, and the two
         brackets holding it. */
      m.col(bx0-2.1, bx0+2.1, sd>0?AZ0:AZ1-2.4, sd>0?AZ0+2.4:AZ1, by-0.30, by+1.30);
      for(const q of [-1,1])
        m.col(bx0+q*1.9-0.08, bx0+q*1.9+0.08, sd>0?AZ0+1.9:AZ1-2.3,
              sd>0?AZ0+2.3:AZ1-1.9, STLY, by+1.3);
    }

    /* AISLE STANDARDS. A brass post with a little shaded lamp on the end
       of every row, both sides of the centre aisle — the detail that more
       than any other says "theatre" rather than "hall with seats in it",
       and the only light in the stalls that is at knee height where you
       are actually walking. */
    for(let r=0;r<ROWS;r++) for(const q of [[CA0-0.10,-1],[CA1+0.10,1]]){
      const px=rowX(r)-0.34, py=rowY(r);
      m.C("brass", 0.085,0.105,0.030,14, px, py+0.015, q[0], BRD);
      m.C("brass", 0.022,0.022,0.86,10, px, py+0.44, q[0], BR);
      m.C("brass", 0.062,0.038,0.09,12, px, py+0.90, q[0], BRD);
      m.P("sconce", planeGeo(0.17, 0.11, 0), px, py+0.84, q[0]+q[1]*0.055,
          q[1]>0?Math.PI/2:-Math.PI/2, "#ffbc6a", 0, 0);
      m.P("floorglow", planeGeo(1.3, 1.3, 0), px, py+0.03, q[0]+q[1]*0.30,
          0, "#ffa348", -Math.PI/2, 0);
      if(r%4===1)
        m.lamp(px, py+0.80, q[0]+q[1]*0.4, {color:0xffbe78, intensity:0.48,
               dist:9.0, decay:1.6, indoor:true, vol:AVOL});
    }
    /* Two urns on plinths, where the side walls meet the proscenium. They
       are the only thing in the room that is purely ornamental and they
       are what the eye uses to judge how far away the stage is. */
    /* ON THE PIT'S END BAYS, not in the cross-aisle. At STGX+2.9 they
       stood in the middle of the walk from the centre aisle to the side
       one and the walk probe hit both of them: a 2.5 m plinth is a wall
       wherever you put it, so it goes where nobody is walking. */
    for(const q of [AZ0+3.4, AZ1-3.4]){
      const px=STGX+0.90;
      m.B("plaster", 0.90, 0.16, 0.90, px, STLY+0.08, q, 0.5, 0, "#6e5234");
      m.B("plaster", 0.74, 1.10, 0.74, px, STLY+0.71, q, 0.5, 0, "#7a5c3c");
      m.B("plaster", 0.92, 0.14, 0.92, px, STLY+1.33, q, 0.5, 0, "#6e5234");
      m.B("brass", 0.98, 0.05, 0.98, px, STLY+1.42, q, 0.4, 0, GILT);
      m.C("brass", 0.17,0.30,0.30,16, px, STLY+1.60, q, GILT);
      { const g=new T.SphereGeometry(0.40,16,12); g.scale(1,1.08,1);
        m.P("brass", g, px, STLY+2.08, q, 0, GILT); }
      m.C("brass", 0.42,0.30,0.14,16, px, STLY+2.46, q, GILT);
      for(const h of [-1,1])
        m.P("brass", new T.TorusGeometry(0.17, 0.030, 5, 14), px+h*0.44, STLY+2.20, q,
            0, GILT, 0, 0);
      m.P("floorglow", planeGeo(2.2, 2.2, 0), px, STLY+0.03, q, 0, "#ff9c3e", -Math.PI/2, 0);
      m.col(px-0.52, px+0.52, q-0.52, q+0.52, STLY, STLY+2.5);
    }
    /* THE CHANDELIERS. Three of them down the centre line, each hung from
       the bay above it — which means each hangs from a different height, and
       the three of them stepping away and upward is the thing that tells you
       how far the ceiling goes. */
    const CH=[[-87.0, 0.20, 2.6],[-93.0, 3.40, 3.4],[-99.5, 6.60, 4.2]];
    for(const q of CH){
      const cx=q[0], top=q[1], drop=q[2], cz=(AZ0+AZ1)/2, cy=top-drop;
      m.C("brass", 0.030,0.030,drop, 8, cx, top-drop/2, cz, BRD);
      m.C("brass", 0.26,0.34,0.22,14, cx, top-0.11, cz, GILT);
      m.C("brass", 0.90,0.70,0.26,18, cx, cy, cz, GILT);
      m.C("brass", 1.36,1.36,0.07,24, cx, cy-0.30, cz, GILT);
      m.P("flame", new T.SphereGeometry(0.30,14,10), cx, cy-0.05, cz, 0, "#ffcc80");
      for(let i=0;i<18;i++){
        const a=i/18*Math.PI*2;
        m.C("glass", 0.026,0.016,0.52,6, cx+Math.cos(a)*1.30, cy-0.60,
            cz+Math.sin(a)*1.30, "#cfe0e6");
        m.P("flame", new T.SphereGeometry(0.075,8,6), cx+Math.cos(a)*1.30,
            cy-0.28, cz+Math.sin(a)*1.30, 0, "#ffd79a");
      }
      for(let i=0;i<10;i++){
        const a=i/10*Math.PI*2;
        m.C("glass", 0.022,0.014,0.40,6, cx+Math.cos(a)*0.72, cy-0.38,
            cz+Math.sin(a)*0.72, "#cfe0e6");
        m.P("flame", new T.SphereGeometry(0.060,8,6), cx+Math.cos(a)*0.72,
            cy-0.12, cz+Math.sin(a)*0.72, 0, "#ffd79a");
      }
      m.P("floorglow", planeGeo(7.0, 7.0, 0), cx, cy-1.1, cz, 0, "#ff9c3e", -Math.PI/2, 0);
      m.lamp(cx, cy-0.8, cz, {color:0xffbe7a, intensity:1.15, dist:26.0, decay:1.05,
             indoor:true, vol:AVOL});
    }
    /* House lights down the side walls, under each pilaster's bracket. They
       are emissive and they light nothing — the lamps that do the work are
       the three on the chandeliers and the ones in the boxes, which is nine
       all told and exactly the size of the pool. What these do is tell your
       eye where the walls are, which over twenty-six metres is the whole
       job. */
    for(const b of BAY) for(const q of [[AZ0+0.14, 0],[AZ1-0.14, Math.PI]]){
      const L=b[1]-b[0], n=Math.round(L/2.5);
      for(let i=0;i<n;i++){
        const u=b[0]+L*((i+0.5)/n);
        m.P("sconce", planeGeo(0.30, 0.60, 0), u, b[2]-1.10, q[0], q[1], "#ffa84e", 0, 0);
        m.P("floorglow", planeGeo(1.4, 3.2, 0), u, b[2]-1.10,
            q[0]+(q[1]===0?0.10:-0.10), q[1], "#ff9436", 0, 0);
      }
    }
  })();

  /* ====================================================================
     8 · THE DOOR AT THE SIDE OF THE STAGE, AND WHAT IS BEHIND IT
     --------------------------------------------------------------------
     Everything else down here was built. This was not. The hall is lined,
     gilded, carpeted and lit; you open the door beside the stage and it
     stops dead at the plaster. Bare render, a concrete floor with a worn
     line down the middle of it, four bulkheads in twenty-eight metres and
     two of them out, and a row of doors that do not open. It turns once,
     so you cannot see the end from the start, and the end is a small room
     with one chair in it facing the corner.

     Nothing happens in it. That is the whole of what it is for: the hall
     is a question you can at least look at, and this is the part of the
     building that does not answer.
     ==================================================================== */
  (function backstage(){
    const CW=2.40, WT2=0.50, CH=2.30;               // corridor, walls, clear height
    const FY=STLY, CY=FY+CH;
    const L1X0=-102.40, L1X1=-100.00;               // leg one, running out in -z
    const L1Z0=16.00,   L1Z1=AZ0;
    const L2Z0=13.60,   L2Z1=16.00;                 // leg two, running out in -x
    const L2X0=-112.00, L2X1=-100.00;
    const EX0=-118.40,  EX1=-112.00, EZ0=11.40, EZ1=18.20;   // and the room at the end
    const EH=2.60;
    const DIM="#6e675c", DIMD="#56504a", FLR="#7e776c";
    const BVOL=[W(EX0-1), W(L1X1+1), Z(EZ0-1), Z(AZ0+1), GY+FY-1, GY+CY+1.2];

    /* ---- the hole in the hall's wall, lined and furnished with a door -- */
    for(const q of [SDX0, SDX1]){
      const sd=q===SDX0?1:-1;
      m.B("oak", 0.10, SDH+0.10, WT+0.12, q+sd*0.005, FY+(SDH+0.10)/2, AZ0-WT/2,
          0.5, 0, "#4a3020");
    }
    m.B("oak", SDX1-SDX0+0.18, 0.10, WT+0.12, (SDX0+SDX1)/2, FY+SDH+0.03,
        AZ0-WT/2, 0.5, 0, "#4a3020");
    m.B("brass", SDX1-SDX0+0.24, 0.05, 0.06, (SDX0+SDX1)/2, FY+SDH+0.12, AZ0+0.03,
        0.4, 0, GILT);
    m.flat(SDX0-0.2, SDX1+0.2, AZ0-WT-0.3, AZ0+0.3, FY);
    /* The hinge is at the SDX0 jamb and the leaf runs +x from it, because
       XF with ry = 0 lays the leaf along +x; hung off the other jamb it
       would swing out across a metre of wall instead of across the hole. */
    makeDoor(XF(W(SDX0+0.07), Z(AZ0-WT/2), 0), 0, GY+FY+0.02, 0,
             "THE STAGE DOOR", false, 0, "steel");
    /* An EXIT box over it — the only bright thing in the hall that is not
       gold, and the only thing in the corridor behind it you can read. */
    m.B("metal", 0.46, 0.20, 0.10, (SDX0+SDX1)/2, FY+SDH+0.34, AZ0+0.06, 0.4, 0, "#2e3230");
    m.P("sconce", planeGeo(0.40, 0.15, 0), (SDX0+SDX1)/2, FY+SDH+0.34, AZ0+0.12,
        0, "#8cff9e", 0, 0);
    m.P("sconce", planeGeo(0.40, 0.15, 0), (SDX0+SDX1)/2, FY+SDH+0.34, AZ0-0.01,
        Math.PI, "#8cff9e", 0, 0);

    /* ---- the shell: two legs and a room, all the same bare box -------- */
    const box=(x0,x1,z0,z1,h)=>{
      m.B("concrete", x1-x0+WT2*2, 0.50, z1-z0+WT2*2, (x0+x1)/2, FY-0.25,
          (z0+z1)/2, 0.5, 0, "#7a746a");
      m.P("concrete", planeGeo(x1-x0, z1-z0, 0.5), (x0+x1)/2, FY+0.006, (z0+z1)/2,
          0, FLR, -Math.PI/2, 0);
      m.flat(x0-0.3, x1+0.3, z0-0.3, z1+0.3, FY);
      m.B("concrete", x1-x0+WT2*2, 0.50, z1-z0+WT2*2, (x0+x1)/2, FY+h+0.25,
          (z0+z1)/2, 0.5, 0, "#4a443c");
      m.voidAt(x0-0.6, x1+0.6, z0-0.6, z1+0.6, FY-1.0, FY+h+0.4, FY);
    };
    const wall=(x0,x1,z0,z1,h)=>{
      m.B("concrete", x1-x0, h+0.5, z1-z0, (x0+x1)/2, FY+(h+0.5)/2-0.1,
          (z0+z1)/2, 0.5, 0, "#7a746a");
      m.col(x0, x1, z0, z1, FY-1, FY+h+0.6);
    };
    box(L1X0, L1X1, L1Z0, L1Z1, CH);
    box(L2X0, L2X1, L2Z0, L2Z1, CH);
    box(EX0, EX1, EZ0, EZ1, EH);
    // leg one's two sides, with the hall's wall as its head
    wall(L1X0-WT2, L1X0, L1Z0, L1Z1+WT2, CH);
    wall(L1X1, L1X1+WT2, L2Z1, L1Z1+WT2, CH);
    // leg two: the far side, and the stub that makes the corner a corner
    wall(L2X0-WT2, L2X1+WT2, L2Z0-WT2, L2Z0, CH);
    wall(L1X1, L2X1+WT2, L2Z1, L2Z1+WT2, CH);
    /* NO WALL AT THE WEST END OF LEG TWO. There was one, and it stood
       across the only way into the room at the end — the corridor's far
       wall and the room's near wall are the same wall, and the room's own
       east pieces already build it with the doorway left out of them. */
    // the end room
    wall(EX0-WT2, EX0, EZ0-WT2, EZ1+WT2, EH);
    wall(EX0-WT2, EX1+WT2, EZ0-WT2, EZ0, EH);
    wall(EX0-WT2, EX1+WT2, EZ1, EZ1+WT2, EH);
    wall(EX1, EX1+WT2, EZ0, L2Z0, EH);
    wall(EX1, EX1+WT2, L2Z1, EZ1, EH);
    // the ceiling step where the room is taller than the corridor
    m.B("concrete", 0.50, EH-CH+0.5, L2Z1-L2Z0, EX1+0.25, FY+CH+(EH-CH+0.5)/2,
        (L2Z0+L2Z1)/2, 0.5, 0, "#4a443c");

    /* ---- render, and forty years of damp on it ----------------------- */
    const face=(ry,px,pz,a0,a1,h)=>{
      const L=a1-a0, c=(a0+a1)/2, flat=(ry===0||Math.abs(ry)>3);
      const nx=Math.sin(ry), nz=Math.cos(ry);
      const X2=flat?c:px, Z2=flat?pz:c;
      m.P("plaster", planeGeo(L, h, 0.5), X2, FY+h/2, Z2, ry, DIM, 0, 0);
      m.B("concrete", flat?L:0.08, 0.16, flat?0.08:L, X2+nx*0.04, FY+0.08,
          Z2+nz*0.04, 0.5, 0, DIMD);                       // a skirting, and that is all
      for(let i=0;i<Math.max(2,Math.round(L/2.2));i++){
        const n=Math.max(2,Math.round(L/2.2));
        const u=a0+L*((i+0.5)/n+(R(i)-0.5)*0.12), o=0.010+i*0.0018;
        m.P("stain", streakGeo(0.6+R(i+1)*1.9, 0.7+R(i+4)*1.5, 0),
            flat?u:X2+nx*o, FY+0.5+R(i+6)*(h-1.0), flat?Z2+nz*o:u, ry,
            R(i+2)<0.5?"#3e3228":"#4e4134", 0, 0);
      }
      for(let i=0;i<Math.round(L/1.7);i++){               // and the cracks
        const u=a0+L*((i+0.6)/Math.round(L/1.7));
        m.P("art", planeGeo(0.02, 0.5+R(i+9)*1.3, 0), flat?u:X2+nx*0.012,
            FY+0.8+R(i+3)*(h-1.6), flat?Z2+nz*0.012:u, ry, "#4a4036",
            0, (R(i+7)-0.5)*0.7);
      }
    };
    face(Math.PI/2, L1X0+0.02, 0, L1Z0, L1Z1, CH);
    face(-Math.PI/2, L1X1-0.02, 0, L2Z1, L1Z1, CH);
    face(0, 0, L2Z0+0.02, L2X0, L2X1, CH);
    face(Math.PI, 0, L2Z1-0.02, L1X1, L2X1, CH);
    face(Math.PI/2, L2X0+0.02, 0, L2Z0, L2Z1, CH);
    for(const q of [[0, EZ0+0.02],[Math.PI, EZ1-0.02]]) face(q[0], 0, q[1], EX0, EX1, EH);
    face(Math.PI/2, EX0+0.02, 0, EZ0, EZ1, EH);

    /* ---- the light, or what is left of it ----------------------------- */
    /* Four fittings in twenty-eight metres and two of them dead. The dead
       ones are drawn exactly like the live ones and carry no glow and no
       lamp, which is the only way a light reads as broken rather than as
       missing: you can see the thing that should be working. */
    const bulk=(x,z,live,flick)=>{
      m.B("metal", 0.14, 0.26, 0.34, x, FY+2.08, z, 0.4, 0, "#4e4a44");
      m.P(live?"bulkhead":"glass", new T.SphereGeometry(0.095,10,8), x, FY+2.08, z,
          0, live?"#ffe6bc":"#6a6a62");
      for(let k=0;k<3;k++)
        m.C("metal", 0.010,0.010,0.30,5, x, FY+2.08, z, "#3e3a34", 0, 0, k*1.05);
      if(!live) return;
      m.P("floorglow", planeGeo(3.0, 3.0, 0), x, FY+0.04, z, 0, "#ffcf8a", -Math.PI/2, 0);
      const o={color:0xffdcae, intensity:flick?0.46:0.40, dist:7.0, decay:1.7,
               indoor:true, vol:BVOL};
      if(flick) o.flicker=true;
      m.lamp(x, FY+2.00, z, o);
    };
    bulk((L1X0+L1X1)/2, L1Z1-2.4, true, false);
    bulk((L1X0+L1X1)/2, L1Z1-9.0, false, false);
    bulk((L1X0+L1X1)/2, L1Z0+1.6, true, true);
    bulk(L2X0+6.0, (L2Z0+L2Z1)/2, false, false);
    bulk(EX1-2.2, (EZ0+EZ1)/2, true, true);
    // conduit and a dead pipe down the length of both legs
    m.C("metal", 0.026,0.026, L1Z1-L1Z0, 6, L1X0+0.14, FY+2.42, (L1Z0+L1Z1)/2,
        "#5a5450", Math.PI/2);
    m.C("metal", 0.055,0.055, L1Z1-L1Z0, 8, L1X0+0.30, FY+2.26, (L1Z0+L1Z1)/2,
        "#4e4a44", Math.PI/2);
    m.C("metal", 0.026,0.026, L2X1-L2X0, 6, (L2X0+L2X1)/2, FY+2.42, L2Z0+0.14,
        "#5a5450", 0, 0, Math.PI/2);

    /* ---- the doors that do not open ----------------------------------- */
    for(let i=0;i<5;i++){
      const z=L1Z1-2.0-i*2.6;
      m.B("concrete", 0.10, 2.06, 0.94, L1X1-0.05, FY+1.03, z, 0.5, 0, "#625c54");
      m.B("oak", 0.06, 1.98, 0.86, L1X1-0.12, FY+0.99, z, 0.6, 0, "#4e4238");
      m.B("oak", 0.04, 0.78, 0.70, L1X1-0.155, FY+1.42, z, 0.6, 0, "#584a3e");
      m.B("oak", 0.04, 0.60, 0.70, L1X1-0.155, FY+0.52, z, 0.6, 0, "#584a3e");
      m.P("brass", new T.SphereGeometry(0.038,8,6), L1X1-0.19, FY+1.00, z+0.33,
          0, "#6e5a32");
      m.P("art", planeGeo(0.13, 0.13, 0), L1X1-0.158, FY+1.62, z-0.30,
          -Math.PI/2, "#8a8274", 0, 0);                  // a number nobody reads
      if(i===2){                                          // one of them boarded
        for(let k=0;k<3;k++)
          m.B("oak", 0.05, 0.16, 1.06, L1X1-0.20, FY+0.60+k*0.56, z, 0.6,
              (k%2?0.05:-0.05), "#6a5a44");
      }
    }
    /* ---- the dressing mirror at the turn, with its bulbs out ---------- */
    {
      const mz=L2Z1-0.05, mx=L2X0+3.6;
      m.B("oak", 1.70, 1.26, 0.09, mx, FY+1.52, mz-0.04, 0.6, 0, "#4e4238");
      m.P("mirror", planeGeo(1.40, 0.96, 0), mx, FY+1.52, mz-0.10, Math.PI,
          "#4a4a46", 0, 0);
      for(let i=0;i<8;i++){
        const a=i/8*Math.PI*2;
        m.P("glass", new T.SphereGeometry(0.055,8,6), mx+Math.cos(a)*0.78,
            FY+1.52+Math.sin(a)*0.56, mz-0.12, 0, i===3?"#ffe6bc":"#6a6a62");
      }
      m.B("oak", 1.50, 0.07, 0.42, mx, FY+0.78, mz-0.26, 0.6, 0, "#4e4238");
      m.C("oak", 0.030,0.030,0.74,8, mx-0.64, FY+0.39, mz-0.26, "#3e3428");
      m.C("oak", 0.030,0.030,0.74,8, mx+0.64, FY+0.39, mz-0.26, "#3e3428");
      m.col(mx-0.80, mx+0.80, mz-0.50, mz, FY, FY+0.82);
      m.C("glass", 0.032,0.026,0.10,10, mx+0.30, FY+0.86, mz-0.30, "#8a9490");
      m.P("paper", boxGeo(0.16,0.012,0.22,0.4), mx-0.34, FY+0.818, mz-0.24,
          0.3, "#9a9280", 0, 0);
    }
    /* ---- the things left in a corridor nobody uses -------------------- */
    m.C("metal", 0.16,0.13,0.26,14, L1X0+0.42, FY+0.13, L1Z1-5.2, "#6a4a38");
    m.B("oak", 0.05, 1.30, 0.05, L1X0+0.30, FY+0.65, L1Z1-11.4, 0.5, 0.10, "#5e4e3a");
    m.C("metal", 0.012,0.012,1.44,6, L1X0+0.34, FY+0.72, L1Z1-11.4, "#4e4a44", 0.08);
    for(let i=0;i<5;i++)                                   // a stack of chairs
      m.B("oak", 0.42, 0.05, 0.42, L2X0+1.3, FY+0.46+i*0.09, L2Z0+0.70,
          0.6, 0.04*i, "#4a3c2c");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      m.C("metal", 0.016,0.016,0.44,6, L2X0+1.3+a[0]*0.17, FY+0.22,
          L2Z0+0.70+a[1]*0.17, "#4e4a44");
    m.col(L2X0+1.0, L2X0+1.6, L2Z0+0.4, L2Z0+1.0, FY, FY+0.9);
    for(let i=0;i<9;i++)                                   // a coil of cable
      m.P("metal", new T.TorusGeometry(0.22-i*0.012, 0.022, 5, 14), L2X0+8.4,
          FY+0.03+i*0.035, L2Z0+0.60, 0, "#3a3a38", Math.PI/2, 0);
    /* ---- and the room at the end -------------------------------------- */
    {
      const cx=EX0+1.5, cz=EZ0+1.4;
      m.C("oak", 0.028,0.024,0.46,8, cx-0.18, FY+0.23, cz-0.18, "#4a3c2c");
      m.C("oak", 0.028,0.024,0.46,8, cx+0.18, FY+0.23, cz-0.18, "#4a3c2c");
      m.C("oak", 0.028,0.024,0.88,8, cx-0.18, FY+0.44, cz+0.18, "#4a3c2c");
      m.C("oak", 0.028,0.024,0.88,8, cx+0.18, FY+0.44, cz+0.18, "#4a3c2c");
      m.B("oak", 0.44, 0.045, 0.42, cx, FY+0.46, cz, 0.6, 0, "#584a38");
      for(let k=0;k<3;k++)
        m.B("oak", 0.42, 0.055, 0.04, cx, FY+0.62+k*0.14, cz+0.17, 0.6, 0, "#4a3c2c");
      m.col(cx-0.3, cx+0.3, cz-0.3, cz+0.3, FY, FY+0.5);
      addSeat(W(cx), Z(cz), GY+FY+0.50, Math.PI, "A CHAIR");
      // a bulb on a flex, a rail with one coat on it, and a bucket
      m.C("metal", 0.006,0.006,0.70,4, EX1-2.2, FY+2.28, (EZ0+EZ1)/2, "#4a443c");
      m.C("brass", 0.022,0.022,1.90,8, EX0+0.9, FY+1.86, EZ1-0.8, "#6e5a32",
          0, 0, Math.PI/2);
      m.P("velvet", boxGeo(0.30, 0.96, 0.15, 2.2), EX0+1.1, FY+1.26, EZ1-0.8, 0,
          "#2a2622", 0, 0);
      m.C("metal", 0.17,0.14,0.28,14, EX1-0.8, FY+0.14, EZ0+0.6, "#5a5248");
      m.P("stain", streakGeo(1.9, 1.5, 0), EX0+2.8, FY+0.03, (EZ0+EZ1)/2, 0,
          "#3a3028", -Math.PI/2, 0);
      m.P("art", planeGeo(0.30, 0.22, 0), EX0+0.03, FY+1.52, EZ0+2.9,
          Math.PI/2, "#6e675c", 0, 0);                   // a notice, long dead
    }
    addBuried(W(EX0-1), W(L1X1+1), Z(EZ0-1), Z(AZ0+1), GY+FY-1, GY+CY+1.4);
    addZone(W(L1X0), W(L1X1), Z(L1Z0), Z(L1Z1), GY+FY-1, GY+CY, "BACKSTAGE", true);
    addZone(W(L2X0), W(L2X1), Z(L2Z0), Z(L2Z1), GY+FY-1, GY+CY, "BACKSTAGE", true);
    addZone(W(EX0), W(EX1), Z(EZ0), Z(EZ1), GY+FY-1, GY+FY+EH, "THE END OF IT", true);
  })();

  /* The ceiling bays drop a 2 m apron off every terrain ring edge they
     cross, exactly as the speakeasy does; 04-terrain.js lists this box. */
})();
