// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

// The main library script
import * as THREE from "three";

import { SVGLoader } from "./src/SVGLoader.js";
import { Font } from "./src/FontLoader.js";
import { TTFLoader } from "./src/TTFLoader.js";
import { OrbitControls } from "./src/OrbitControls.js";

let camera, scene, canvas, controls, renderer;

init();

function init() {
    canvas = document.getElementById("3-holder");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    canvas.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.set(0, 0, 600);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    window.addEventListener("resize", onWindowResize);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    // load the actual .ttf file, not the json file
    const loader = new TTFLoader();

    loader.load("./src/PlaywriteDKUloopetGuides.ttf", function (json) {
        const font = new Font(json);

        const material = {
            dark: new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide
            }),
            lite: new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide
            }),
            color: new THREE.Color(0x000000)
        };

        const text = generateStrokeText(font, material, "test text", 80, "ltr");
        text.position.set(0, 0, 0);

        scene.add(text);
        render();
    });
}

function generateStrokeText(font, material, message, size, direction = "ltr") {
    const shapes = font.generateShapes(message, size, direction);
    const geometry = new THREE.ShapeGeometry(shapes);
    const group = new THREE.Group();

    geometry.computeBoundingBox();

    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    const yMid = -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);

    geometry.translate(xMid, yMid, 0);

    const fillMesh = new THREE.Mesh(geometry, material.lite);
    group.add(fillMesh);

    const holeShapes = [];

    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
                holeShapes.push(shape.holes[j]);
            }
        }
    }

    shapes.push(...holeShapes);

    const style = SVGLoader.getStrokeStyle(3, material.color.getStyle());

    for (let i = 0; i < shapes.length; i++) {
        const points = shapes[i].getPoints();
        const strokeGeometry = SVGLoader.pointsToStroke(points, style);

        if (strokeGeometry) {
            strokeGeometry.translate(xMid, yMid, 0);
            const strokeMesh = new THREE.Mesh(strokeGeometry, material.dark);
            group.add(strokeMesh);
        }
    }

    return group;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate() {
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}