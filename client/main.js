import * as Worlds from "./worlds.js";

const { store } = window;

export default function init() {
  const track = getSimulatorTrack(store.getState());

  store.dispatch(addLines(Worlds.worldA(track)));
  store.dispatch(addLines(Worlds.worldB(track)));
  store.dispatch(addLines(Worlds.worldC(track)));
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
