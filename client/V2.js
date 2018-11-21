/**
 * @typedef Vec2
 *
 * @property {number} x - X component
 * @property {number} y - Y component
 *
 */

export default class V2 {
  static len (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  static lenSq (v) {
    return v.x * v.x + v.y * v.y
  }

  static angle (v) {
    return Math.atan2(v.y, v.x)
  }

  static angleTo (v, u) {
    return V2.angle(u) - V2.angle(v)
  }

  static dist (v, u) {
    const dx = u.x - v.x
    const dy = u.y - v.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  static distSq (v, u) {
    const dx = u.x - v.x
    const dy = u.y - v.y
    return dx * dx + dy * dy
  }

  static dot (v, u) {
    return v.x * u.x + v.y * u.y
  }

  static cross (v, u) {
    return v.x * u.y - v.y * u.x
  }

  static equals (v, u) {
    return v.x === u.x && v.y === u.y
  }

  static from (x, y) {
    return new V2({ x: x, y: y })
  }

  constructor (v) {
    this.x = v.x
    this.y = v.y
  }

  set (v) {
    this.x = v.x
    this.y = v.y
    return this
  }

  copy () {
    return new V2(this)
  }

  copyAsObject () {
    return { x: this.x, y: this.y }
  }

  /* mutating methods */
  add (v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  sub (v) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  mul (s) {
    this.x *= s
    this.y *= s
    return this
  }

  div (s) {
    this.x /= s
    this.y /= s
    return this
  }

  norm () {
    this.div(this.len())
    return this
  }

  // [a, c, tx,
  //  b, d, ty]
  // js: [a, b, c, d, tx, ty]
  transform ([a, b, c, d, tx, ty]) {
    const x = this.x
    const y = this.y

    this.x = a * x + c * y + tx
    this.y = b * x + d * y + ty

    return this
  }

  // X axis →
  // Y axis ↓
  // rotates clockwise
  // (not appropriate for physics engine usage)
  rot (rads) {
    const cos = Math.cos(rads)
    const sin = Math.sin(rads)
    const x = this.x
    const y = this.y
    this.x = x * cos - y * sin
    this.y = x * sin + y * cos
    return this
  }

  rotateAbout (origin, rads) {
    return this.sub(origin).rot(rads).add(origin)
  }

  scaleAbout (origin, scale) {
    return this.sub(origin).mul(scale).add(origin)
  }

  rotCW () {
    const x = this.x
    const y = this.y
    this.x = -y
    this.y = x
    return this
  }

  rotCCW () {
    const x = this.x
    const y = this.y
    this.x = y
    this.y = -x
    return this
  }

  len () {
    return V2.len(this)
  }

  lenSq () {
    return V2.lenSq(this)
  }

  angle () {
    return V2.angle(this)
  }

  angleTo (v) {
    return V2.angleTo(this, v)
  }

  dist (v) {
    return V2.dist(this, v)
  }

  distSq (v) {
    return V2.distSq(this, v)
  }

  dot (v) {
    return V2.dot(this, v)
  }

  cross (v) {
    return V2.cross(this, v)
  }

  equals (v) {
    return V2.equals(this, v)
  }
}
