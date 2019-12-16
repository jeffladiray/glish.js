import * as THREE from 'three';

import MapSpec from '../../mapSpec';
import World from '../../world';

import PointerLockControls from './pointerLockControls';

const mapSpec = new MapSpec(128, 128, 10, 256, 10, 'solo', 16, 256, 64);

const m = new World(mapSpec);

window.onload = (): void => {
    // eslint-disable-next-line
    const objects = new Array<any>();

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let controls: PointerLockControls;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    // eslint-disable-next-line
    const render = (): any => renderer.render(scene, camera);

    const onWindowResize = (): void => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // eslint-disable-next-line
    const init = (data: any) => {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 10;
        scene.add(new THREE.AxesHelper(10));

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, -5);
        scene.add(directionalLight);
        const light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1);
        light.position.set(50, 50, 50);
        scene.add(light);
        controls = new PointerLockControls(camera, document.body);
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');
        if (instructions && controls && blocker) {
            instructions.addEventListener(
                'click',
                () => {
                    controls.lock();
                },
                false,
            );
            controls.addEventListener('lock', () => {
                instructions.style.display = 'none';
                blocker.style.display = 'none';
            });
            controls.addEventListener('unlock', () => {
                blocker.style.display = 'block';
                instructions.style.display = '';
            });
        }

        scene.add(controls.getObject());

        // eslint-disable-next-line
    const onKeyDown = (event: any) => {
            switch (event.keyCode) {
                case 38: // up
                case 90: // z
                    moveForward = true;
                    break;
                case 37: // left
                case 81: // a
                    moveLeft = true;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;
                case 32: // space
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;
            }
        };
        // eslint-disable-next-line
    const onKeyUp = (event: any) => {
            switch (event.keyCode) {
                case 38: // up
                case 90: // z
                    moveForward = false;
                    break;
                case 37: // left
                case 81: // a
                    moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        const loader = new THREE.TextureLoader();
        const texture = loader.load('/assets/tileset3d.png', render);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        const world = new World(mapSpec);
        const { positions, normals, uvs, indices } = world.generateGeometryDataForCell(0, 0, 0);
        const geometry = new THREE.BufferGeometry();

        const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.1,
            transparent: true,
        });
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents),
        );
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        geometry.setIndex(indices);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(6, 6, 6);
        objects.push(mesh);
        scene.add(mesh);

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.id = 'main';
        if (!document.getElementById('main')) document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    };

    const animate = (): void => {
        requestAnimationFrame(animate);
        if (controls.isLocked === true) {
            const time = performance.now();
            const delta = (time - prevTime) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta;
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);

            direction.normalize();
            if (moveForward || moveBackward) velocity.z -= direction.z * 1000.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 1000.0 * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);
            controls.getObject().position.y += velocity.y * delta;
            if (controls.getObject().position.y < 100) {
                velocity.y = 0;
                controls.getObject().position.y = 100;
                canJump = true;
            }
            prevTime = time;
        }
        render();
    };

    init(m);
    animate();
};
