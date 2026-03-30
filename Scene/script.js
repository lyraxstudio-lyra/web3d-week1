import * as THREE from "three";
import { OBJLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/OBJLoader.js";

// Controls
import { OrbitControls } from "./src/OrbitControls.js";
import { PointerLockControls } from "./src/PointerLockControls.js";

let camera, canvas, controls, scene, renderer;

let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = true;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();

async function init() {
    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfeff5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setAnimationLoop(animate);
    canvas.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 10, 40);

    // controls
    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    instructions.addEventListener("click", function () {
        controls.lock();
    });

    controls.addEventListener("lock", function () {
        instructions.style.display = "none";
        blocker.style.display = "none";
    });

    controls.addEventListener("unlock", function () {
        blocker.style.display = "block";
        instructions.style.display = "";
    });

    scene.add(controls.object);

    const onKeyDown = function (event) {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                moveForward = true;
                break;

            case "ArrowLeft":
            case "KeyA":
                moveLeft = true;
                break;

            case "ArrowDown":
            case "KeyS":
                moveBackward = true;
                break;

            case "ArrowRight":
            case "KeyD":
                moveRight = true;
                break;

            case "Space":
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    };

    const onKeyUp = function (event) {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                moveForward = false;
                break;

            case "ArrowLeft":
            case "KeyA":
                moveLeft = false;
                break;

            case "ArrowDown":
            case "KeyS":
                moveBackward = false;
                break;

            case "ArrowRight":
            case "KeyD":
                moveRight = false;
                break;
        }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    // lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(20, 30, 10);
    scene.add(directionalLight);

    // LOAD obj
    const OBJloader = new OBJLoader();

    // obj1 boat
    const object1 = await OBJloader.loadAsync("./src/boat1.obj");

    object1.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                color: 0x735839,
                flatShading: true
            });
        }
    });

    object1.scale.set(5, 5, 5);
    object1.position.set(0, 0, -80);

    // obj2 plate
    const object2 = await OBJloader.loadAsync("./src/plate.obj");

    object2.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                color: 0xc7f1ff,
                flatShading: true
            });
        }
    });
     
    //const object2Line = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    //const objectLine = new THREE.Mesh(object2, object2Line);
    object2.scale.set(10, 10, 10);
    object2.position.set(-25, 0, -30);
    //objectLine.scale.set(10, 10, 10);
    //objectLine.position.set(-25, 0, -30);

    // obj3 tree
    const object3 = await OBJloader.loadAsync("./src/tree.obj");

    object3.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                color: 0x735839,
                flatShading: true
            });
        }
    });

    object3.scale.set(5, 5, 5);
    object3.position.set(40, -10, -120);

    // obj4 cloud1
    const object4 = await OBJloader.loadAsync("./src/cloud.obj");

    object4.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                color: 0xffc2b3,
                flatShading: true
            });
        }
    });
    object4.scale.set(30, 30, 30);
    object4.position.set(-205, 0, -130);

    // obj5 cloud2
    const object5 = await OBJloader.loadAsync("./src/cloud.obj");

    object5.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                color: 0xf0e1c2,
                flatShading: true
            });
        }
    });
    object5.scale.set(60, 60, 60);
    object5.position.set(-35, 10, -270);

    // add obj
    scene.add(object1);
   scene.add(object2);
    scene.add(object3);
    scene.add(object4);
    scene.add(object5);
    //scene.add(objectLine);

    const textureLoader = new THREE.TextureLoader();
    const envTexture = await textureLoader.loadAsync("./src/bg2.jpg");

    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = envTexture;
    scene.background = envTexture;

    const tex = await new THREE.TextureLoader().loadAsync("./src/waterSurface.jpeg");

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({
            map: tex,
            transparent: true,
            opacity: 0.8
        })
    );

    plane.position.set(0, -25, 0);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
}

function animate() {
    const time = performance.now();

    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.object.position.y += velocity.y * delta;

        if (controls.object.position.y < 10) {
            velocity.y = 0;
            controls.object.position.y = 10;
            canJump = true;
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}
