import { TriConnector, HexConnector, RhoConnector } from "./connector.js";

import { triangleLattice, triangleTess } from "./tess.js";
import V2 from "./V2.js";

/*
1. lattice
2. warp
3. translate
4. map to spacetime (tangent or axis)
5. tessellation
*/

const correctY = ([x, y]) => [x, (y * Math.sqrt(3)) / 2];
const leftRightShift = [[0, 0], [-1, 0]];
const hexShift = [
  [-0.5, -1],
  [0.5, -1],
  [1, 0],
  [0.5, 1],
  [-0.5, 1],
  [-1, 0]
].map(correctY);
const starShift = [
  [0, 0],
  [-0.5, -1],
  [0, 0],
  [0.5, -1],
  [0, 0],
  [1, 0],
  [0, 0],
  [0.5, 1],
  [0, 0],
  [-0.5, 1],
  [0, 0],
  [-1, 0]
].map(correctY);

function beatShift(beat, mod, shift, p, offset = 0) {
  const n = shift.length;
  const b = Math.floor(beat + 0.5);
  if (b % 2 === 1) {
    mod = 1 - mod;
  }
  const j = (b + offset) % n;
  const [a1, b1] = shift[(j + n - 1) % n];
  const [a2, b2] = shift[j];
  p.x -= a1 * (1 - mod) + a2 * mod;
  p.y -= b1 * (1 - mod) + b2 * mod;
}

export function worldA(track) {
  const getPos = i => track.getRider(i).position;
  const tempTan = V2.from(0, 0);
  const getTan = i => tempTan.set(getPos(i + 0.5)).sub(getPos(i - 0.5));

  const startTime = 47 * 40 + 23;
  const endTime = (1 * 60 + 29) * 40 + 10;
  const W = endTime - startTime + 1;
  const H = 18;
  const lattice = triangleLattice(W, H);

  for (let i = 0; i < lattice.length; i++) {
    const p = lattice[i];
    const { x, y } = p;
    /* warp */
    const beat = ((p.x / 30) * 121) / 60;

    let vibMod = 3 * Math.pow(1 - (beat % 1), 4);

    let mod = Math.sin(Math.PI * beat);
    mod = Math.max(-1, Math.min(1, 2 * mod));
    mod = Math.sign(mod) * Math.pow(Math.abs(mod), 0.4);

    mod = 0.5 + 0.5 * mod;
    if (beat < 8 * 4 - 0.5) {
      beatShift(beat, mod, leftRightShift, p);
    } else if (beat < 16 * 4 - 0.5) {
      beatShift(beat, mod, hexShift, p, 4);
    } else {
      beatShift(beat, mod, starShift, p);
    }

    /* translate */
    p.x += startTime + 0.5;
    p.y -= (H + 1) / Math.sqrt(3) / 2;

    /* map to spacetime */
    const pos = getPos(p.x);
    let norm = getTan(p.x).rotCW();

    p.x = pos.x + norm.x * p.y;
    p.y = pos.y + norm.y * p.y;

    /* final warp */
    p.x += vibMod * (2 * Math.random() - 1);
    p.y += vibMod * (2 * Math.random() - 1);
  }

  return triangleTess(W, H, lattice, HexConnector);
}

export function worldB(track) {
  const getRawPos = i => {
    const rider = track.getRawRider(i);
    return new V2(rider.points[1].pos).add(rider.points[2].pos).div(2);
  };
  // const getPos = i => track.getRider(i).position;
  const getPos = i => {
    const a = i % 1;
    if (a === 0) {
      return getRawPos(i);
    }
    return getRawPos(Math.floor(i))
      .mul(1 - a)
      .add(getRawPos(Math.ceil(i)).mul(a));
  };
  const tempTan = V2.from(0, 0);
  const getTan = i => tempTan.set(getPos(i + 0.5)).sub(getPos(i - 0.5));

  const startTime = (1 * 60 + 35) * 40 + 7;
  const endTime = (1 * 60 + 47) * 40 + 3;
  const W = endTime - startTime + 1;
  const H = 16;
  const lattice = triangleLattice(W, H);

  for (let i = 0; i < lattice.length; i++) {
    const p = lattice[i];
    const { x, y } = p;
    /* warp */
    const beat = ((p.x / 30) * 121) / 60;
    let mod = 25 * Math.pow(1 - (beat % 1), 4);
    // do not mod on first beat
    if (Math.floor(beat) === 0) {
      mod = 0;
    }

    /* translate */
    p.x += startTime + 0.5;
    p.y -= H / Math.sqrt(3) / 2;

    /* map to spacetime */
    const pos = getPos(p.x);
    let norm = getTan(p.x).rotCW();

    // keep rider platform horizontal
    const platform = p.y < 0.4 && p.y > -0.4 && x % 1 === 0.5;
    if (platform) {
      norm = V2.from(-norm.len(), 0);
    }

    p.x = pos.x + norm.x * p.y;
    p.y = pos.y + norm.y * p.y;

    /* final warp */
    if (platform) {
      p.x += mod * (2 * Math.random() - 1);
    } else {
      p.x += mod * (2 * Math.random() - 1);
      p.y += mod * (2 * Math.random() - 1);
    }
  }

  return triangleTess(W, H, lattice, TriConnector);
}

export function worldC(track) {
  const getPos = i => track.getRider(i).position;
  const tempTan = V2.from(0, 0);
  const getTan = i => tempTan.set(getPos(i + 0.5)).sub(getPos(i - 0.5));

  const startTime = (2 * 60 + 10) * 40 + 36;
  // const endTime = (2 * 60 + 20) * 40 + 36;
  const endTime = (2 * 60 + 31) * 40 + 30;
  const W = endTime - startTime + 1;
  const H = 16;

  const lines = [];

  [0, 1].forEach(s => {
    const lattice = triangleLattice(W, H);

    for (let i = 0; i < lattice.length; i++) {
      const p = lattice[i];
      const { x, y } = p;

      /* warp */
      const beat = ((p.x / 30) * 121) / 60;

      let vibMod = 3 * Math.pow(1 - (beat % 1), 4);

      let mod = Math.sin(Math.PI * beat);
      mod = Math.max(-1, Math.min(1, 1.9 * mod));
      mod = Math.sign(mod) * Math.pow(Math.abs(mod), 0.7);

      mod = 0.5 + 0.5 * mod;
      if (beat > 14 * 4 - 0.5) {
        mod = 0;
        vibMod = 0;
      }
      if (beat > 0.5) {
        beatShift(beat, mod, starShift, p, (s * starShift.length) / 2);
      }

      /* translate */
      p.x += startTime;
      p.y -= (H + 2 * s - 1) / Math.sqrt(3) / 2;

      /* map to spacetime */
      const pos = getPos(p.x);
      let norm = getTan(p.x).rotCW();

      p.x = pos.x + norm.x * p.y;
      p.y = pos.y + norm.y * p.y;

      /* final warp */
      p.x += vibMod * (2 * Math.random() - 1);
      p.y += vibMod * (2 * Math.random() - 1);
    }
    lines.push(...triangleTess(W, H, lattice, HexConnector));
  });

  return lines;
}
