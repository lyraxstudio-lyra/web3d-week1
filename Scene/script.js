import * as THREE from 'three';

import { OrbitControls } from './src/OrbitControls.js';
import { PointerLockControls } from './src/PointerLockControls.js';

let camera, canvas, controls, scene, renderer;

function init() {
    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfeff5 );
}