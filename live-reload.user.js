// ==UserScript==
// @name         Live Reload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Live reloaded scripting
// @author       David Lu
// @include      http://127.0.0.1:8080/*
// @match        https://www.linerider.com/*
// @grant        none
// ==/UserScript==

/* constants */
const host = "localhost";
const port = 40510;

/* actions */
const commitTrackChanges = () => ({
  type: "COMMIT_TRACK_CHANGES"
});

/* selectors */
const getSimulatorTrack = state => state.simulator.engine;
const getSimulatorCommittedTrack = state => state.simulator.committedEngine;

/* init */
if (window.registerCustomTool) {
  main();
} else {
  const prevCb = window.onCustomToolsApiReady;
  window.onCustomToolsApiReady = () => {
    if (prevCb) prevCb();
    main();
  };
}

function main() {
  const { React, store, DefaultTool } = window;

  const e = React.createElement;

  class LiveReloadTool extends DefaultTool {
    detach() {}
  }

  class LiveReloadUi extends React.Component {
    constructor(props) {
      super(props);

      if (!this.setState) {
        this.setState = this.setState;
      }

      this.state = {
        count: 0,
        changed: false,
        status: "Not Connected"
      };

      store.subscribe(() => {
        const changed =
          getSimulatorTrack(store.getState()) !==
          getSimulatorCommittedTrack(store.getState());
        if (changed !== this.state.changed) {
          this.setState({ changed });
        }
      });

      this.ws = new WebSocket(`ws://${host}:${port}`);

      this.ws.addEventListener("open", () => {
        this.setState({
          status: "Inital Connection"
        });

        this.ws.addEventListener("message", e => {
          this.setState(state => ({
            count: state.count + 1,
            status: "Received Script"
          }));
          const path = `http://${host}:${e.data}`;

          import(path)
            .then(module => {
              this.tryUnload();
              this.mod = module;

              this.tryExec();
            })
            .catch(err => {
              this.setState({
                status: `Error: ${err}`
              });
            });
        });
      });

      this.ws.addEventListener("close", () => {
        this.setState({
          status: "Closed"
        });
      });

      this.ws.addEventListener("error", err => {
        this.setState({
          status: `Error: ${err}`
        });
      });
    }
    componentWillUnmount() {
      this.ws.close();
      this.tryUnload();
    }
    tryUnload() {
      if (this.mod && this.mod.unload) {
        try {
          this.mod.unload();
        } catch (e) {
          console.error(e);
        }
      }
    }
    tryExec() {
      if (this.mod) {
        try {
          this.mod.default();
        } catch (e) {
          console.error(e);
        }
      }
    }
    onCommit() {
      store.dispatch(commitTrackChanges());
    }
    onReload() {
      this.tryUnload();
      this.tryExec();
    }
    render() {
      return e("div", null, [
        `${this.state.status}: ${this.state.count}`,
        e("div", null, [
          e(
            "button",
            {
              onClick: this.onCommit.bind(this),
              disabled: !this.state.changed
            },
            "Commit"
          ),
          e("button", { onClick: this.onReload.bind(this) }, "Reload")
        ])
      ]);
    }
  }

  window.registerCustomTool("Live Reload", LiveReloadTool, LiveReloadUi);
}
