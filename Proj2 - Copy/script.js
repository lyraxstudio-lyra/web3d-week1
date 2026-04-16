// Images and 3D Font Example Three.js Example
// Chelsea Thompto - Spring 2026

// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

// The main library script
import * as THREE from "three";

// The plug-ins
import { PointerLockControls } from "./src/PointerLockControls.js";
import { Font } from "./src/FontLoader.js";
import { TTFLoader } from "./src/TTFLoader.js";
import { TextGeometry } from "./src/TextGeometry.js";
import { OBJLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/OBJLoader.js";
//import { HDRLoader } from "./src/HDRLoader.js";
import { GUI } from "./src/lil-gui.module.min.js";

// Declaring global variables.
let camera, canvas, controls, scene, renderer;

// Variables for First Person Controls
let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = true;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let font;
let text = "Did you practice today?";
let textGeo;
let materials;
let textMesh1;
let textMesh2;
let group;
let group2;
let group3;

// for exposure slider
const params = {
    exposure: 1.0
};

// Run the "init" function which is like "setup" in p5.
init();

// Define initial scene
function init() {
    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x5f2828);
    //scene.fog = new THREE.FogExp2(0xbfeff5, 0.0015);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(innerWidth, innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = params.exposure;
    canvas.appendChild(renderer.domElement);
    // HDR Basic

    new THREE.TextureLoader().load("./src/bg2.jpeg", function (texture) {
        const material1 = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.SphereGeometry(1000, 50, 50);

        const mesh = new THREE.Mesh(sphere, material1);

        scene.add(mesh);

        render();
    });

    // Setup camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 10, 200);

    //load wallpaper
    const paint1 = new THREE.TextureLoader().load("./src/wall1.jpg");
    // Setup First Person Controls
    // DO NOT TOUCH

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

    const gui = new GUI();
    gui.add(params, "exposure", 0, 4, 0.01).onChange(render);
    gui.open();

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

    // End First Person Controls

    // Add world geometry

    // room material

    const wall = new THREE.MeshPhongMaterial({
        //color: 0xff6a6a
        map: paint1
        //transparancy: true,
        //opacity: 0.4
    });

    const paint2 = new THREE.TextureLoader().load("./src/wall2.jpg");

    //chair

    const tex2 = new THREE.TextureLoader().load("./src/wood.jpg");
    const chair = new THREE.MeshPhongMaterial({
        map: tex2
    });
    const seat1 = new THREE.BoxGeometry(100, 10, 80);
    const Bottomseat = new THREE.Mesh(seat1, chair);
    //Bottomseat.rotateX(2);
    Bottomseat.position.set(-10, 5, -300);

    //const seat2 = new THREE.BoxGeometry(100, 10, 80);
    const Backseat = new THREE.Mesh(seat1, chair);
    Backseat.position.set(-10, 50, -340);
    Backseat.rotateX(1.5);

    const seat2 = new THREE.BoxGeometry(10, 10, 65);
    const Leg1 = new THREE.Mesh(seat2, chair);
    Leg1.position.set(-40, -30, -280);
    Leg1.rotateX(1.5);

    const Leg2 = new THREE.Mesh(seat2, chair);
    Leg2.position.set(20, -30, -280);
    Leg2.rotateX(1.5);

    const Leg3 = new THREE.Mesh(seat2, chair);
    Leg3.position.set(20, -30, -330);
    Leg3.rotateX(-1.5);

    const Leg4 = new THREE.Mesh(seat2, chair);
    Leg4.position.set(-40, -30, -330);
    Leg4.rotateX(-1.5);
    //chair 1

    const group2 = new THREE.Group();
    group2.add(Bottomseat);
    group2.add(Backseat);
    group2.add(Leg1);
    group2.add(Leg2);
    group2.add(Leg3);
    group2.add(Leg4);

    group2.rotateY(0.8);
    group2.scale.set(1.5, 1.5, 1.5);
    group2.position.x = 10;
    group2.position.y = -300;
    group2.position.z = -130;

    scene.add(group2);

    const group3 = group2.clone();
    group3.scale.set(3, 3, 3);
    group3.rotation.set(Math.PI, -0.8, 0);
    group3.position.set(100, 500, -1000);

    scene.add(group3);

    //chair 2
    //const group3 = new THREE.Group();
    //group3.add(Bottomseat);
    //group3.add(Backseat);
    //group3.add(Leg1);
    //group3.add(Leg2);
    //group3.add(Leg3);
    //group3.add(Leg4);
    //
    //group3.rotateY(-0.8);
    //group3.scale.set(1.5, 1.5, 1.5);
    //group3.position.x = 80;
    //group3.position.y = 200;
    //group3.position.z = -150;
    //
    //scene.add(group3);

    //const longWall = new THREE.BoxGeometry(10, 200, 510);
    //const leftWall = new THREE.Mesh(longWall, wall);
    //leftWall.position.set(-150, 0, 0);
    //scene.add(leftWall);
    // text
    //text group
    group = new THREE.Group();
    group.position.y = 100;
    group.position.z = -50;

    scene.add(group);
    // materials for the text
    materials = [
        new THREE.MeshPhongMaterial({
            color: 0xff0000,
            flatShading: true
        }), // front
        new THREE.MeshPhongMaterial({ color: 0xf5ffb0 }) // side
    ];

    // establish font loader
    const loader = new TTFLoader();

    // use loader with desired ttf font
    loader.load("./WalterTurncoat-Regular.ttf", function (json) {
        font = new Font(json);
        // see create text function below
        createText();
    });

    // add resulting shapes to scene

    // image

    // load image as a texture
    const imgSource = new THREE.TextureLoader().load("./src/violin.png");
    // use loaded testure in a material
    const imgMaterial = new THREE.MeshBasicMaterial({
        map: imgSource,
        transparent: true,
        //depth: 100,
        side: THREE.DoubleSide
    });
    // create image shape (should be the same aspect ratio as the image)
    const imgGeometry = new THREE.PlaneGeometry(500, 1000);
    // apply image to shape and add to scene
    const imgPlane = new THREE.Mesh(imgGeometry, imgMaterial);
    imgPlane.position.set(0, -100, -550);
    imgPlane.rotateZ(-0.6);
    imgPlane.scale.set(1, 1, 1);
    scene.add(imgPlane);

    const imgPlane2 = imgPlane.clone();
    imgPlane2.scale.set(1.3, 1.3, 1.3);
     imgPlane2.rotateZ(Math.PI / 2);
    imgPlane2.rotateX(Math.PI / 2);
   
    imgPlane2.position.set(750, -100, 0);
    scene.add(imgPlane2);
    
        const imgPlane3 = imgPlane.clone();
    imgPlane3.scale.set(1, 1, 1);
    imgPlane3.rotateZ(Math.PI / 2);
    //imgPlane3.rotateX(Math.PI / 2);
    imgPlane3.position.set(20, 0, -800);
    scene.add(imgPlane3);

    // Ground
    const earth = new THREE.PlaneGeometry(2000, 2000);
    const floor = new THREE.TextureLoader().load("./src/wood.jpg");
    const ground = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: floor,
        flatShading: true
    });
    const mesh2 = new THREE.InstancedMesh(earth, ground, 1);
    mesh2.position.y = -80;
    mesh2.rotateX(-1.5708);
    //scene.add(mesh2);

    //model Chain
    const OBJloader = new OBJLoader();
    //const loader = new FBXLoader();

    //
    //const objectChain = await loader.loadAsync( './src/Chains2.gltf' );
    //        objectChain.scale.set(5, 5, 5);
    //    objectChain.position.set(0, 0, -80);

    // chain
    const tex = new THREE.TextureLoader().load("./src/Rust.jpg");
    OBJloader.load("./src/chains.obj", function (chain) {
        chain.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    map: tex,
                    roughness: 1,
                    metalness: 1,
                    emissive: 0x000000
                    //Reflect: 0;
                    //transparent: true,
                    //opacity: 0.8
                });
            }
        });
        chain.scale.set(10, 10, 10);
        chain.position.set(-15, 100, -460);
        chain.rotateY(1.6);
        scene.add(chain);

        const chain2 = chain.clone();
        chain2.scale.set(20, 20, 20);
        chain2.position.set(30, 100, 300);
        chain.rotateY(-0.6);
        scene.add(chain2);
    });

    //const mirrorMat = new THREE.MeshPhysicalMaterial({
    //    color: 0x000000,
    //    emissive: 0xff2121,
    //    roughness: 0,
    //    metalness: 1,
    //    transmission: 0
    //    //envMap: ,
    //});
    //
    //OBJloader.load("./src/ring1.obj", function (ring1) {
    //    ring1.traverse((child) => {
    //        if (child.isMesh) {
    //            child.material = mirrorMat;
    //        }
    //    });
    //
    //    ring1.scale.set(600, 600, 600);
    //    ring1.position.set(0, 550, 0);
    //    ring1.rotateY(1.6);
    //    scene.add(ring1);
    //});

    //OBJloader.load("./src/ring2.obj", function (ring2) {
    //    ring2.traverse((child) => {
    //        if (child.isMesh) {
    //            child.material = new THREE.MeshStandardMaterial({
    //                //envMap: reflectCube,
    //                color: 0xffa1a1,
    //                //roughness: 0,
    //                //metalness: 1,
    //                emissive: 0x00a7ff,
    //                transparancy: true,
    //                opacity: 0.2
    //            });
    //        }
    //    });
    //
    //    ring2.scale.set(400, 400, 600);
    //    ring2.position.set(-100, 400, -630);
    //    ring2.rotateX(1.6);
    //    scene.add(ring2);
    //});
    //

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xfffcfb, 5);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff0000, 4);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);
}

function animate() {
    // Start First Person Control Animations
    const time = performance.now();
    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 2500.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 2500.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        // jump fix
        controls.object.position.y += velocity.y * delta;
        if (controls.object.position.y < 10) {
            velocity.y = 0;
            controls.object.position.y = 10;

            canJump = true;
        }
    }

    prevTime = time;
    // End First Person Control Animations

    render();
}

// Function to render the scene using the camera.
function render() {
    renderer.toneMappingExposure = params.exposure;
    renderer.render(scene, camera);
}

// Function to generate text shapes
function createText() {
    // create geomtery with parameters, change parameters to test modifications
    // "text" on next line is the message to be written
    textGeo = new TextGeometry(text, {
        font: font,
        size: 30,
        depth: 5,
        curveSegments: 6,
        bevelThickness: 4,
        bevelSize: 1.5,
        bevelEnabled: true
    });

    // finish making geometry
    textGeo.computeBoundingBox();
    const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    // apply material to geometry
    textMesh1 = new THREE.Mesh(textGeo, materials);

    // set position and rotation
    textMesh1.position.x = centerOffset;
    textMesh1.position.z = -200;
    textMesh1.position.y = -100;
    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    // add to group to be added to scene
    group.add(textMesh1);
}
