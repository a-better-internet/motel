# Low Desert Motel — the shape of a game

An outline, not an implementation. Nothing in here is in `index.html` yet.
There is a second, unrelated one in `PLOT-2.md` — same world, same Myst-shaped
brief, different story and a different core verb. They are alternatives, not
two halves.

The brief: a Myst-shaped game. You are alone in the world. There is no
character to talk to and nothing to fight. You find out what happened by
looking at what is left, and the last thing you find out is what you are
supposed to do about it.

---

## 1 · The premise

In 1972 the interstate opened forty miles north and the road outside the
motel stopped carrying anybody. Over the next seven years everything on this
stretch shut: the drive-in, the snack bar, the filling station, the motel
across the county line whose pool is full of sand now.

The Low Desert Motel stayed lit.

The people who would not leave made an arrangement. They worked it out in an
old silver adit in the hills west of the burying ground, and they called it
**the Vigil**. The terms were simple and they are written on the chamber
wall: *the place is kept, and whoever keeps it does not have to go.* Lights
on. Register marked. Rooms turned. Sign lit. **One tally cut per night.**

It held for a hundred and twenty nights. On the night of **Friday 10 August
1979** the person keeping the count did not cut the hundred and twenty-first.

You arrive with no explanation and no luggage. The ice machine is running.
The television in 206 is on. The vacancy board says **15 / 24 OPEN**, which
means nine rooms are occupied, and the nine rooms that are lit are the nine
names in the register, and none of them ever checked out.

**Tone:** not a haunting. Nothing chases you. The horror, such as it is, is
administrative — somebody has been keeping this place open for forty-six
years and the paperwork is immaculate.

---

## 2 · What the player can already do

The verbs exist. This is what the outline is built on, so the plot needs
very little new machinery:

| Verb | Already in | Used by the plot for |
|---|---|---|
| Walk, run, look | — | everything |
| `E` / `Space` to use | doors, seats | reading clues, the stakes, the projector |
| `L` flashlight | round 21 | the adit, the projection room |
| `N` / `M` / `[` `]` — move the clock | day/night | **the payphone window** |
| Compass with a live bearing | HUD | **the recorded directions** |
| Location name on the HUD | zones | confirming you found the right place |
| Vacancy counter on the HUD | mast | **the score, and the ending** |
| Animated image slots (`ANIM`, `gifDecode`) | round 14ish | **the drive-in screen** |
| Sit / lie | seats, beds | the ending, and one clue you only see lying down |

The clock being a control the player already has is the single most useful
thing in the build, and the outline leans on it hard: **the world's time is a
lock**, not a mood setting.

---

## 3 · The spine

Seven beats. Each one hands you exactly one thing you did not have, and the
thing is always knowledge, never an item in a bag.

### Beat 0 — Arrival · *the motel*
Dusk, in the lot. The HUD says 15 / 24 OPEN.

- **The office.** The register is open on the desk. Nine names, checked in on
  dates spread across 1972–79, none checked out. The tenth line is blank and
  the pen is lying on it.
- **The key board.** Twenty-four hooks, nine empty. 206's hook is empty.
- **Under the blotter.** A card in a different hand: *"If it rings it is for
  whoever answers it. — H."*

→ You know there are nine, and that something rings.

### Beat 1 — The nine · *the lit rooms*
The nine lit rooms are the nine names. **This already works.** Wing A lights
102, 105, 107, 108, 203 and 206; wing B lights 110, 112 and 209; that is nine
of twenty-four, and the vacancy counter on the HUD has been reading 15 / 24
OPEN since long before there was a plot to hang on it. Each already looks slightly different;
each gains **one object that belongs to a person** and **one line in their
handwriting**. A welding mask. A child's shoe. A tin of slides. A cribbage
board. These nine objects are the vocabulary of the final puzzle and the
player will not know that until Beat 5.

**206** is the one with the set still on — a dead channel, and burned into
the corner of the picture, **four digits**.

→ You have four digits and nine faces.

### Beat 2 — The Rusty Canteen
- **The clock on the brick** stopped at 4:20. So has the one in the office.
  So has one more, later. Every other clock in the world reads something
  different — these three agree, and that is the tell.
- **The stage.** The hand-lettered board is a bill for *the Salt Flats Revue,
  Friday August 10th*. The backline never went home.
- **Behind the bar.** The house phone is off the hook. Pencilled on the wall
  beside it: the nine names, each with a tick, and a tenth name with a line
  through it.

→ You have the date, the time, and a tenth person nobody counted.

### Beat 3 — The payphone · *the kerb outside the Canteen*
The payphone rings — but only **between 4:00 and 4:30, after dark**. The
player has to take the clock there themselves. Answering it plays a
recording, a woman, already mid-sentence, no greeting:

> "— two hundred and forty off the sign, near enough eleven hundred out. He
> kept the reel. He wouldn't put it back and he wouldn't burn it."

A **bearing and a distance**, read off the compass the HUD has had all along.
It walks you to the trailer.

*(The phone booth alone in the desert at (-96, 196) is the other end of this
line. It rings too. It is the same recording, run backwards.)*

→ You have a heading.

### Beat 4 — Somebody's trailer
The tenth person. Not one of them — an outsider who came to document what a
bypass does to a town and stayed to document *them*.

- A wall of index cards and photographs: the nine, named.
- A USGS sheet with the adit marked and a pencil line drawn to it from the
  motel.
- A tape recorder, and the tape that the payphone plays.
- A film can labelled **LOW DESERT — REEL 3**. Empty.
- A note: *"3 is back in the booth. I'm not keeping it here."*

→ You know what the adit is, and where the reel is.

### Beat 5 — The drive-in · **the big one**
The projection room is pitch dark and the projector is off its mount with one
reel arm snapped — all of that is already built. You need the flashlight. You
find reel 3 among the cans on the shelf, get it up, and throw the switch.

**The screen turns on.** Out in the dark, forty feet of it, and the whole
lot goes blue.

What plays is silent 16 mm, badly exposed, and about ninety seconds long:

1. The nine of them at the mouth of the adit, in daylight, being ordinary.
2. Inside. The circle. The nine stakes going in.
3. **Nine portrait shots, one per person, in an order** — and each of them is
   holding the object that is sitting in their room right now.
4. A long static hold on the tally wall, held long enough to count.
5. A hand cutting one more tally. The frame goes white.

→ **You have the order.** This is the only place in the game it exists.

### Beat 6 — The adit
Everything in the chamber now means something it did not mean the first time
you walked through it. The nine wrapped stakes each carry a bundle, and each
bundle matches one of the nine rooms.

**The puzzle:** light the nine in the order the film gave. `E` on a stake
lights it; a wrong one puts them all out. The three candles still going on
the altar are the progress indicator — they gutter as you get it right.

The tally wall holds a hundred and twenty marks. The knife is on the altar.

### Beat 7 — The endings
Three, and the game does not tell you which is the good one.

- **Cut the hundred and twenty-first.** You take the Vigil on. The clock goes
  back to 4:20, the board reads **14 / 24**, and there is a tenth name in the
  register in your handwriting. The world starts again with the lights on.
- **Break the circle.** Scuff the ochre ring. The nine room lights go out one
  at a time, across the whole motel, in the order of the film. The board goes
  to **24 / 24 OPEN**. The sun comes up on a world with nothing running in
  it — the first real dawn in the game. The payphone rings once, a long way
  off, and nobody answers it.
- **Drive on.** Walk west past the burying ground and keep going. The bypass
  ending: you leave, it keeps running, and the twelve stones behind the wire
  turn out to be nine you now know and three that were here first.

---

## 4 · Clue furniture off the spine

Places that already exist and want a reason to be visited. None of these gate
anything; all of them deepen it.

| Place | What is there |
|---|---|
| **The filling station** | The board of keys behind the counter has one tagged with a room number. That is how the tenth got in. |
| **The snack bar** | A till roll. Last sale 10 Aug 1979, mid-afternoon, and then nothing. |
| **What is left of a motel** | The same sign painter, the same typeface, a pool full of sand. This is what the Vigil is holding off. |
| **The radio mast** | The red light does not blink on a timer. It blinks the count, in fives. |
| **The burying ground** | Twelve stones. Nine match the register. Three are children's and predate all of it. |
| **The three graves by the dead motel** | No names. Cut by the same hand as the tally wall. |
| **The cold fire ring and the mattress** | Where the tenth slept before the trailer. |
| **The windmill, the fence that stops mattering** | Nothing. Some places are just places, and a game that hides a clue in every one of them stops being a world. |

---

## 5 · What would have to be built

Roughly in order of how much it costs:

1. **A read/examine interaction.** `E` on a clue surface opens a full-screen
   readable. `interact()` and the canvas image slots do most of this already.
2. **A found-things list.** What you *know*, not what you carry — one screen,
   and it is also the save file.
3. **The clock as a lock.** A ring window on the payphone; trivial given
   `DayNight`.
4. **Nine room objects + nine handwriting cards.** Art, not code.
5. **The projector.** One interaction, plus the screen sequence — the
   existing `ANIM` machinery can drive the drive-in screen as an image slot.
6. **The film itself.** Ninety seconds of drawn frames. The single biggest
   art cost in the whole outline, and the thing the game is remembered for.
7. **Ordered interaction on the nine stakes**, with a fail-soft reset.
8. **Three endings and a reset**, plus the room-light cascade.

---

## 6 · Open questions

- **Voice or text?** The recordings want a voice. Text-on-screen is free,
  reads more Myst, and never sounds like a bad read. My instinct is text.
- **Does the player have a name or a reason to be here?** I would give them
  neither. The blank tenth line in the register does more work if it is blank.
- **How punishing is the stake order?** Fail-soft — all nine go out, nothing
  else happens, try again. There is no failure state anywhere else in the
  game and adding one here would be the only cruel thing in it.
- **Is the film literal?** I have written it as a document — badly exposed,
  handheld, no cuts. The other option is that it is not a record of 1979 but
  a record of *right now*, and the ninth portrait is you.
