AFRAME.registerComponent('wasd-plus', {
  schema: {
    speed: { type: "number", default: .25 },
    mouseLock: { type: 'boolean', default: true },
  },

  init() {
    this.el.removeAttribute("wasd-controls");
    if (this.data.mouseLock) {
      this.el.removeAttribute("look-controls");
      this.el.setAttribute("look-controls", "pointerLockEnabled", true);
    }

    this.keys = {};
    this._onKeyDown = e => (this.keys[e.code] = true);
    this._onKeyUp = e => (this.keys[e.code] = false);

    // pointer/mouse state
    this._pointerDown = false;
    const r = this.el.object3D.rotation;
    this._yaw = THREE.MathUtils.radToDeg(r.y || 0);
    this._pitch = THREE.MathUtils.radToDeg(r.x || 0);

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  },

  tick(time, dt) {
    const forward = new THREE.Vector3(0, 0, -1);
    const left = new THREE.Vector3(-1, 0, 0);
    const up = new THREE.Vector3(0, 1, 0);

    forward.applyQuaternion(this.el.object3D.quaternion);
    left.applyQuaternion(this.el.object3D.quaternion);
    up.applyQuaternion(this.el.object3D.quaternion);

    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      this.el.object3D.position.addScaledVector(forward, this.data.speed);
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      this.el.object3D.position.addScaledVector(forward, -this.data.speed);
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      this.el.object3D.position.addScaledVector(left, this.data.speed);
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      this.el.object3D.position.addScaledVector(left, -this.data.speed);
    }
    if (this.keys['KeyQ']) {
      this.el.object3D.position.addScaledVector(up, -this.data.speed);
    }
    if (this.keys['KeyE'] || this.keys['Space']) {
      this.el.object3D.position.addScaledVector(up, this.data.speed);
    }
  },

  remove() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
  }
});