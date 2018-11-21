// import test from "./test.js";

const { store, V2 } = window;

const range = (start, end, step = 1) =>
  Array(end - start)
    .fill(0)
    .map((_, i) => i * step + start);

export default function init() {
  const fps = 40;
  const startTime = 47 * fps + 22;
  // const timeRange = range(startTime, 60 * fps + 5);
  const timeRange = range(startTime, (2 * 60 + 11) * fps);
  const gridLength = 2;
  const gridSpan = range(-gridLength, gridLength + 1);
  const track = getSimulatorTrack(store.getState());

  const getPos = i => track.getRider(i).position;
  // const getPos = i => track.getRawRider(i).points[0].pos;
  const getTan = i => new V2(getPos(i + 0.5)).sub(getPos(i - 0.5));

  const freq = ((1 / 30) * 121) / 60;
  const period = 1 / freq;

  const lines = [];
  for (let t of timeRange) {
    {
      const meter = (t - startTime) / period;
      const phase = meter % 1;
      const t0 = t - 0.5;
      const t2 = t + 0.5;
      const p0 = getPos(t0);

      const p2 = getPos(t2);
      const n0 = getTan(t0).rotCW();

      const n2 = getTan(t2).rotCW();

      const norm0 = new V2(n0).norm();
      const norm2 = new V2(n2).norm();
      lines.push({
        x1: p0.x - phase * 100 * norm0.x,
        y1: p0.y - phase * 100 * norm0.y,
        x2: p2.x - phase * 100 * norm2.x,
        y2: p2.y - phase * 100 * norm2.y,
        type: 2
      });
      lines.push({
        x1: p0.x - 100 * norm0.x,
        y1: p0.y - 100 * norm0.y,
        x2: p2.x - 100 * norm2.x,
        y2: p2.y - 100 * norm2.y,
        type: 2
      });
    }

    const modulateTime = t => {
      t -= startTime;

      let mod = Math.cos(Math.PI * t / period)
      mod = Math.sign(mod) * Math.pow(Math.abs(mod), 0.5)
      mod = 0.5 + 0.5 * mod
      mod *= 0.5
      t -= mod

      // t -= t / period; // base meter
      // const meter = t / period; // modulation meter

      // // let mod = Math.sin(2 * Math.PI * meter);
      // // mod /= 2 * Math.PI;
      // let mod = meter % 1;
      // // mod = (Math.pow(3, mod) - 1) / (3 - 1)
      // mod *= 0.25;
      // t += mod;

      t += startTime;
      return t;
    };

    const t0 = modulateTime(t - 0.5);
    const t1 = modulateTime(t);
    const t2 = modulateTime(t + 0.5);
    const p0 = getPos(t0);
    const p1 = getPos(t1);
    const p2 = getPos(t2);
    const n0 = getTan(t0).rotCW();
    const n1 = getTan(t1).rotCW();
    const n2 = getTan(t2).rotCW();

    // let m0 = Math.cos(Math.PI * (t - 0.5) / period)
    // m0 = Math.sign(m0) * Math.pow(Math.abs(m0), 0.5)
    // m0 = -0.5 + 0.5 * m0
    // m0 *= 0.5

    // let m1 = Math.cos(Math.PI * t / period)
    // m1 = Math.sign(m1) * Math.pow(Math.abs(m1), 0.5)
    // m1 = -0.5 + 0.5 * m1
    // m1 *= 0.5

    // let m2 = Math.cos(Math.PI * (t + 0.5) / period)
    // m2 = Math.sign(m2) * Math.pow(Math.abs(m2), 0.5)
    // m2 = -0.5 + 0.5 * m2
    // m2 *= 0.5

    let m0 = 0
    let m1 = 0
    let m2 = 0

    // first half
    for (let v of gridSpan) {
      lines.push({
        x1: p0.x + (n0.x * (m0 + v + 1 / 6) * 3) / Math.sqrt(3),
        y1: p0.y + (n0.y * (m0 + v + 1 / 6) * 3) / Math.sqrt(3),
        x2: p1.x + (n1.x * (m1 + v + 2 / 6) * 3) / Math.sqrt(3),
        y2: p1.y + (n1.y * (m1 + v + 2 / 6) * 3) / Math.sqrt(3),
        type: 2
      });
      lines.push({
        x1: p1.x + (n1.x * (m1 + v + 2 / 6) * 3) / Math.sqrt(3),
        y1: p1.y + (n1.y * (m1 + v + 2 / 6) * 3) / Math.sqrt(3),
        x2: p2.x + (n2.x * (m2 + v + 1 / 6) * 3) / Math.sqrt(3),
        y2: p2.y + (n2.y * (m2 + v + 1 / 6) * 3) / Math.sqrt(3),
        type: 2
      });

      lines.push({
        x1: p0.x + (n0.x * (m0 + v - 1 / 6) * 3) / Math.sqrt(3),
        y1: p0.y + (n0.y * (m0 + v - 1 / 6) * 3) / Math.sqrt(3),
        x2: p1.x + (n1.x * (m1 + v - 2 / 6) * 3) / Math.sqrt(3),
        y2: p1.y + (n1.y * (m1 + v - 2 / 6) * 3) / Math.sqrt(3),
        type: 2
      });
      lines.push({
        x1: p1.x + (n1.x * (m1 + v - 2 / 6) * 3) / Math.sqrt(3),
        y1: p1.y + (n1.y * (m1 + v - 2 / 6) * 3) / Math.sqrt(3),
        x2: p2.x + (n2.x * (m2 + v - 1 / 6) * 3) / Math.sqrt(3),
        y2: p2.y + (n2.y * (m2 + v - 1 / 6) * 3) / Math.sqrt(3),
        type: 2
      });

      lines.push({
        x1: p0.x + (n0.x * (m0 + v - 1 / 6) * 3) / Math.sqrt(3),
        y1: p0.y + (n0.y * (m0 + v - 1 / 6) * 3) / Math.sqrt(3),
        x2: p0.x + (n0.x * (m0 + v + 1 / 6) * 3) / Math.sqrt(3),
        y2: p0.y + (n0.y * (m0 + v + 1 / 6) * 3) / Math.sqrt(3),
        type: 2
      });
      lines.push({
        x1: p1.x + (n1.x * (m1 + v - 4 / 6) * 3) / Math.sqrt(3),
        y1: p1.y + (n1.y * (m1 + v - 4 / 6) * 3) / Math.sqrt(3),
        x2: p1.x + (n1.x * (m1 + v - 2 / 6) * 3) / Math.sqrt(3),
        y2: p1.y + (n1.y * (m1 + v - 2 / 6) * 3) / Math.sqrt(3),
        type: 2
      });
    }
  }

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
