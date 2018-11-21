import { TriangleLatticeConnector } from "./connector.js";
import V2 from "./V2.js";

const triangleSideLength = 1 / Math.sqrt(3);
export function triangleLattice(width, height) {
  const points = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      points.push(V2.from(x, y * triangleSideLength));
    }
    for (let j = 0; j < height; j++) {
      points.push(V2.from(x + 0.5, (j + 0.5) * triangleSideLength));
    }
  }
  return points;
}

/**
 *
 * @param {number} width
 * @param {number} height
 * @param {Array<V2>} points
 * @param {typeof TriangleLatticeConnector} Connector
 */
export function triangleTess(width, height, points, Connector) {
  const lines = [];
  const colA = [];
  const colB = [];
  const connect = new Connector(lines, colA, colB, height);
  const fillColA = x => {
    colA.length = 0;
    for (let y = 0; y < height; y++) {
      colA.push(points[2 * height * x + y]);
    }
  };
  const fillColB = x => {
    colB.length = 0;
    for (let y = 0; y < height; y++) {
      colB.push(points[2 * height * x + y + height]);
    }
  };

  fillColA(0);
  connect.A();

  fillColB(0);
  connect.B();

  for (let x = 1; x < width; x++) {
    connect.AB();

    fillColA(x);
    connect.A();

    connect.BA();

    fillColB(x);
    connect.B();
  }
  connect.AB();

  return lines;
}
