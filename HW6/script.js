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
    scene.background = new THREE.Color(0xf6ffc4);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(1920, 1080);
    renderer.setAnimationLoop(animate);
    canvas.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1500);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    window.addEventListener("resize", onWindowResize);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    const loader = new TTFLoader();

    loader.load("./CourierPrime-Regular.ttf", function (json) {
        console.log("ttf loaded", json);

        const font = new Font(json);

        const material = {
            dark: new THREE.MeshBasicMaterial({
                color: 0xff7878,
                side: THREE.DoubleSide
            }),
            lite: new THREE.MeshBasicMaterial({
                color: 0x55f1dd,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide
            }),
            color: new THREE.Color(0x000000)
        };
        
        //some shapes
    const geometry = new THREE.TorusGeometry( 10, 20, 8, 10 );
    const material2 = new THREE.MeshPhongMaterial( { color: 0xd5ff7b, flatShading: true } );
    const mesh = new THREE.InstancedMesh( geometry, material2, 500 );
    const tree = new THREE.Object3D();
    for ( let i = 0; i < 10; i ++ ) {
        tree.position.x = Math.random() * 1000 - 10;
        tree.position.y = Math.random() * 1000 - 10;
        tree.position.z = Math.random() * 1000 -10;
        tree.updateMatrix();
        mesh.setMatrixAt( i, tree.matrix );
    }
    scene.add( mesh );
        
        //shape 2
    const geometry2 = new THREE.BoxGeometry( 3, 200, 40 );
const material3 = new THREE.MeshBasicMaterial( { color: 0xfdadff } );
            const mesh2 = new THREE.InstancedMesh( geometry2, material3, 500 );
   const cube = new THREE.Object3D();
        for ( let j = 0; j < 20; j ++ ) {
        cube.position.x = Math.random() * 1200 - 0;
        cube.position.y = Math.random() * 1000 - 10;
        cube.position.z = Math.random() * 1000 -10;
        cube.updateMatrix();
        mesh2.setMatrixAt( j, cube.matrix );
    }
    scene.add( mesh );
scene.add( mesh2 );


        const text1 = generateStrokeText(font, material, "Made this in a rush...", 80, "ltr");
        text1.position.set(0, 0, 0);
        
        const text2 = generateStrokeText(font, material, "want to sleep", 80, "ltr");
        text2.position.set(0, -80, 300);

        scene.add(text1);
        scene.add(text2);
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
            strokeGeometry.translate(xMid, 0, 100);
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
