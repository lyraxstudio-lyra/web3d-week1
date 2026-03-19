import * as THREE from "three/webgpu";
import { PointerLockControls } from "./src/PointerLockControls.js";

import { pass, mrt, output, emissive, renderOutput } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { fxaa } from "three/addons/tsl/display/FXAANode.js";

import { Inspector } from "three/addons/inspector/Inspector.js";
import { UltraHDRLoader } from "three/addons/loaders/UltraHDRLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { WaterMesh } from "three/addons/objects/WaterMesh.js";

let camera, canvas, controls, scene, renderer, water, renderPipeline;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const params = {
  color: "#99e0ff",
  scale: 2,
  flowX: 1,
  flowY: 1
};

init().catch((err) => {
  console.error("Init failed:", err);
});

async function init() {
  canvas = document.getElementById("3-holder");
  if (!canvas) {
    throw new Error('Missing element with id="3-holder"');
  }

  if (!THREE.WebGPU.isAvailable()) {
    document.body.appendChild(THREE.WebGPU.getErrorMessage());
    throw new Error("WebGPU is not available in this browser/device.");
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfeff5);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 0);

  renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  renderer.inspector = new Inspector();

  canvas.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8fb3c6, 1.5);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const hdrLoader = new UltraHDRLoader();
  hdrLoader.load(
    "textures/equirectangular/moonless_golf_2k.hdr.jpg",
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.needsUpdate = true;
      scene.background = texture;
      scene.environment = texture;
    },
    undefined,
    (err) => {
      console.warn("HDR load failed:", err);
    }
  );

  controls = new PointerLockControls(camera, document.body);
  scene.add(camera);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  if (instructions) {
    instructions.addEventListener("click", () => {
      controls.lock();
    });
  }

  controls.addEventListener("lock", () => {
    if (instructions) instructions.style.display = "none";
    if (blocker) blocker.style.display = "none";
  });

  controls.addEventListener("unlock", () => {
    if (blocker) blocker.style.display = "block";
    if (instructions) instructions.style.display = "";
  });

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("jsm/libs/draco/gltf/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const textureLoader = new THREE.TextureLoader();

  const [gltf, normalMap0, normalMap1] = await Promise.all([
    gltfLoader.loadAsync("models/gltf/pool.glb"),
    textureLoader.loadAsync("textures/water/Water_1_M_Normal.jpg"),
    textureLoader.loadAsync("textures/water/Water_2_M_Normal.jpg")
  ]);

  gltf.scene.position.z = 2;
  gltf.scene.scale.setScalar(0.1);
  scene.add(gltf.scene);

  normalMap0.wrapS = normalMap0.wrapT = THREE.RepeatWrapping;
  normalMap1.wrapS = normalMap1.wrapT = THREE.RepeatWrapping;

  const waterGeometry = new THREE.PlaneGeometry(30, 40);

  water = new WaterMesh(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    normalMap0,
    normalMap1
  });

  water.position.set(0, 0.2, -2);
  water.rotation.x = -Math.PI * 0.5;
  water.renderOrder = 999;
  scene.add(water);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({ color: 0x88aa88 })
  );
  ground.rotation.x = -Math.PI * 0.5;
  ground.position.y = 0;
  scene.add(ground);

  renderPipeline = new THREE.RenderPipeline(renderer);
  renderPipeline.outputColorTransform = false;

  const scenePass = pass(scene, camera);
  scenePass.setMRT(
    mrt({
      output,
      emissive
    })
  );

  const beautyPass = scenePass.getTextureNode();
  const emissivePass = scenePass.getTextureNode("emissive");
  const bloomPass = bloom(emissivePass, 2);
  const outputPass = renderOutput(beautyPass.add(bloomPass));
  const fxaaPass = fxaa(outputPass);

  renderPipeline.outputNode = fxaaPass;

  const gui = renderer.inspector.createParameters("Water");
  const waterNode = water.material.colorNode;

  if (waterNode) {
    gui.addColor(params, "color").onChange((value) => {
      waterNode.color.value.set(value);
    });

    gui.add(params, "scale", 1, 10).onChange((value) => {
      waterNode.scale.value = value;
    });

    gui.add(params, "flowX", -1, 1, 0.01).onChange((value) => {
      waterNode.flowDirection.value.x = value;
      waterNode.flowDirection.value.normalize();
    });

    gui.add(params, "flowY", -1, 1, 0.01).onChange((value) => {
      waterNode.flowDirection.value.y = value;
      waterNode.flowDirection.value.normalize();
    });
  }

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onWindowResize);

  canJump = true;
}

function onKeyDown(event) {
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
      if (canJump) {
        velocity.y += 18;
        canJump = false;
      }
      break;
  }
}

function onKeyUp(event) {
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
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const time = performance.now();

  if (controls.isLocked === true) {
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 30.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 45.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 45.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    camera.position.y += velocity.y * delta;

    if (camera.position.y < 10) {
      velocity.y = 0;
      camera.position.y = 10;
      canJump = true;
    }
  }

  prevTime = time;
  render();
}

function render() {
  if (renderPipeline) {
    renderPipeline.render();
  } else {
    renderer.render(scene, camera);
  }
}