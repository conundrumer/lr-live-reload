// import test from "./test.js";

const { store, V2 } = window;

const range = (start, end, step = 1) =>
  Array(end - start)
    .fill(0)
    .map((_, i) => i * step + start);

export default function init() {
  const fps = 40
  const timeRange = range(4 * fps, 20 * fps);
  const gridLength = 5;
  const gridSpan = range(-gridLength, gridLength + 1);
  const track = getSimulatorTrack(store.getState());

  const getPos = i => track.getRider(i).position;
  const getTan = i =>
    new V2(track.getRider(i + 1).position)
      .sub(track.getRider(i - 1).position)
      .div(2);

  const lines = [];
  for (let i of timeRange) {
    const p1 = getPos(i - 0.5);
    const p2 = getPos(i + 0.5);
    const t1 = getTan(i - 0.5);
    const t2 = getTan(i + 0.5);

    // parallels
    for (let j of gridSpan) {
      j += 0.5
      lines.push({
        x1: p1.x - t1.y * j,
        y1: p1.y + t1.x * j,
        x2: p2.x - t2.y * j,
        y2: p2.y + t2.x * j,
        type: 2
      });
    }
    // perpendicular
    lines.push({
      x1: p1.x - t1.y * (gridLength + 0.5),
      y1: p1.y + t1.x * (gridLength + 0.5),
      x2: p1.x + t1.y * (gridLength - 0.5),
      y2: p1.y - t1.x * (gridLength - 0.5),
      type: 2
    });
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
