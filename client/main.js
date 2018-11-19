import test from "./test.js";

const { store } = window;

export default function init() {
  console.log(test())
  store.dispatch(
    addLines([{ x1: 0, y1: 0, x2: Math.random() * 100, y2: 100, type: 2 }])
  );
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
