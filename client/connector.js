export class TriangleLatticeConnector {
  constructor(lines, colA, colB, height) {
    this.lines = lines;
    this.colA = colA;
    this.colB = colB;
    this.height = height;
  }
  addLine(p1, p2) {
    this.lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, type: 2 });
  }
  A() {}
  B() {}
  AB() {}
  BA() {}
}
export class TriConnector extends TriangleLatticeConnector {
  A() {
    for (let i = 1; i < this.height; i++) {
      this.addLine(this.colA[i - 1], this.colA[i]);
    }
  }
  B() {
    for (let i = 1; i < this.height; i++) {
      this.addLine(this.colB[i - 1], this.colB[i]);
    }
  }
  AB() {
    for (let i = 0; i < this.height; i++) {
      this.addLine(this.colA[i], this.colB[i]);
    }
    for (let i = 1; i < this.height; i++) {
      this.addLine(this.colA[i], this.colB[i - 1]);
    }
  }
  BA() {
    for (let i = 0; i < this.height; i++) {
      this.addLine(this.colB[i], this.colA[i]);
    }
    for (let i = 1; i < this.height; i++) {
      this.addLine(this.colB[i - 1], this.colA[i]);
    }
  }
}
export class HexConnector extends TriangleLatticeConnector {
  A() {
    for (let i = 1; i < this.height; i++) {
      if (i % 3 === 1) {
        this.addLine(this.colA[i - 1], this.colA[i]);
      }
    }
  }
  B() {
    for (let i = 1; i < this.height; i++) {
      if (i % 3 === 2) {
        this.addLine(this.colB[i - 1], this.colB[i]);
      }
    }
  }
  AB() {
    for (let i = 0; i < this.height; i++) {
      if (i % 3 === 1) {
        this.addLine(this.colA[i], this.colB[i]);
      }
    }
    for (let i = 1; i < this.height; i++) {
      if (i % 3 === 0) {
        this.addLine(this.colA[i], this.colB[i - 1]);
      }
    }
  }
  BA() {
    for (let i = 0; i < this.height; i++) {
      if (i % 3 === 1) {
        this.addLine(this.colB[i], this.colA[i]);
      }
    }
    for (let i = 1; i < this.height; i++) {
      if (i % 3 === 0) {
        this.addLine(this.colB[i - 1], this.colA[i]);
      }
    }
  }
}
export class RhoConnector extends TriangleLatticeConnector {
  A() {
    for (let i = 1; i < this.height; i++) {
      if (i % 3 !== 2) {
        this.addLine(this.colA[i - 1], this.colA[i]);
      }
    }
  }
  B() {
    for (let i = 1; i < this.height; i++) {
      if (i % 3 !== 0) {
        this.addLine(this.colB[i - 1], this.colB[i]);
      }
    }
  }
  AB() {
    for (let i = 0; i < this.height; i++) {
      if (i % 3 !== 2) {
        this.addLine(this.colA[i], this.colB[i]);
      }
    }
    for (let i = 1; i < this.height; i++) {
      if (i % 3 !== 1) {
        this.addLine(this.colA[i], this.colB[i - 1]);
      }
    }
  }
  BA() {
    for (let i = 0; i < this.height; i++) {
      if (i % 3 !== 2) {
        this.addLine(this.colB[i], this.colA[i]);
      }
    }
    for (let i = 1; i < this.height; i++) {
      if (i % 3 !== 1) {
        this.addLine(this.colB[i - 1], this.colA[i]);
      }
    }
  }
}
