import { Camera, Euler, EventDispatcher, Vector3 } from 'three';

export default class PointerLockControls extends EventDispatcher {
    static CHANGE_EVENT = { type: 'change' };
    static LOCK_EVENT = { type: 'lock' };
    static UNLOCK_EVENT = { type: 'unlock' };
    domElement: HTMLElement;
    camera: Camera;
    isLocked: boolean;
    vec: Vector3;
    getDirection: (v: Vector3) => Vector3;
    constructor(camera: Camera, domElement?: HTMLElement) {
        super();
        if (domElement === undefined) {
            console.warn('THREE.PointerLockControls: The second parameter "domElement" is now mandatory.');
            domElement = document.body;
        }
        this.domElement = domElement;
        this.isLocked = false;
        this.camera = camera;

        this.vec = new Vector3();
        this.getDirection = this.getDirectionBuilder();
        this.connect();
    }

    onMouseMove(event: MouseEvent): void {
        const PI_2 = Math.PI / 2;
        const euler = new Euler(0, 0, 0, 'YXZ');
        if (this.isLocked === false) return;
        const movementX = event.movementX;
        const movementY = event.movementY;
        euler.setFromQuaternion(this.camera.quaternion);
        euler.y -= movementX * 0.002;
        euler.x -= movementY * 0.002;
        euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
        this.camera.quaternion.setFromEuler(euler);
        this.dispatchEvent(PointerLockControls.CHANGE_EVENT);
    }

    onPointerlockChange(): void {
        if (document.pointerLockElement === this.domElement) {
            this.dispatchEvent(PointerLockControls.LOCK_EVENT);
            this.isLocked = true;
        } else {
            this.dispatchEvent(PointerLockControls.UNLOCK_EVENT);
            this.isLocked = false;
        }
    }
    onPointerlockError(): void {
        console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
    }

    connect(): void {
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('pointerlockchange', this.onPointerlockChange.bind(this), false);
        document.addEventListener('pointerlockerror', this.onPointerlockError, false);
    }

    disconnect(): void {
        document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.removeEventListener('pointerlockchange', this.onPointerlockChange.bind(this), false);
        document.removeEventListener('pointerlockerror', this.onPointerlockError, false);
    }

    dispose(): void {
        this.disconnect();
    }

    getObject(): Camera {
        return this.camera;
    }

    getDirectionBuilder(): (v: Vector3) => Vector3 {
        const direction = new Vector3(0, 0, -1);
        return (v: Vector3): Vector3 => {
            return v.copy(direction).applyQuaternion(this.camera.quaternion);
        };
    }

    moveForward(distance: number): void {
        this.vec.setFromMatrixColumn(this.camera.matrix, 0);
        this.vec.crossVectors(this.camera.up, this.vec);
        this.camera.position.addScaledVector(this.vec, distance);
    }

    moveRight(distance: number): void {
        this.vec.setFromMatrixColumn(this.camera.matrix, 0);
        this.camera.position.addScaledVector(this.vec, distance);
    }

    lock(): void {
        this.domElement.requestPointerLock();
    }

    unlock(): void {
        document.exitPointerLock();
    }
}
