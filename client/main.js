import { TriConnector } from "./connector.js";

import { triangleLattice, triangleTess } from "./tess.js";
import V2 from "./V2.js";

const { store } = window;

/*
1. lattice
2. warp
3. translate
4. map to spacetime (tangent or axis)
5. tessellation
*/

export default function init() {
  const track = getSimulatorTrack(store.getState());
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

  const startTime = (1 * 60 + 35) * 40 + 22;
  const W = 440;
  const H = 16;
  const lattice = triangleLattice(W, H);

  for (let i = 0; i < lattice.length; i++) {
    const p = lattice[i];
    const { x, y } = p;
    // warp
    const meter = p.x / 30 * 121 / 60
    const mod = 20 * Math.pow(1 - (meter % 1), 2)

    // translate
    p.x += startTime + 0.5;
    p.y -= H / Math.sqrt(3) / 2;

    // map to spacetime
    const pos = getPos(p.x);
    let norm = getTan(p.x).rotCW();

    const platform = p.y < 0.4 && p.y > -0.4 && (x % 1 === 0.5)
    if (platform) {
      norm = V2.from(-norm.len(), 0);
    }

    p.x = pos.x + norm.x * p.y;
    p.y = pos.y + norm.y * p.y;

    // final warp
    if (platform) {
      p.x += mod * (2 * Math.random() - 1)
    } else {
      p.x += mod * (2 * Math.random() - 1)
      p.y += mod * (2 * Math.random() - 1)
    }
  }

  const lines = triangleTess(W, H, lattice, TriConnector);

  store.dispatch(addLines(lines));
}

export function unload() {
  store.dispatch(revertTrackChanges());
}

/* constants */

/* actions */

const updateLines = (linesToRemove, linesToAdd, name) => ({
  type: "UPDATE_LINES",
  payload: { linesToRemove, linesToAdd },
  meta: { name: name }
});

const addLines = line => updateLines(null, line, "ADD_LINES");

const revertTrackChanges = () => ({
  type: "REVERT_TRACK_CHANGES"
});

/* selectors */
const getSimulatorTrack = state => state.simulator.engine;
