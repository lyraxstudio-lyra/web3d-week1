// Basic Three.js Example
// Chelsea Thompto - Spring 2026

// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

// The main library script
import * as THREE from "three/webgpu";

import {
	uniform,
	refract,
	div,
	frameId,
	lightViewPosition,
	float,
	positionView,
	positionViewDirection,
	screenUV,
	pass,
	texture3D,
	time,
	screenCoordinate,
	normalView,
	texture,
	Fn,
	vec2,
	vec3
} from "three/tsl";

// The plug-in for orbit controls
import { OrbitControls } from "./src/OrbitControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";
import { DRACOLoader } from "./src/DRACOLoader.js";
import { ImprovedNoise } from "./src/ImprovedNoise.js";

import { Inspector } from "./src/Inspector.js";

import { bayer16 } from "./src/Bayer.js";
import { bloom } from "./src/tsl/display/BloomNode.js";
// Declaring global variables.
let camera, canvas, controls, scene, renderer;
let renderPipeline;
let gltf;
let gltf2;
// Run the "init" function which is like "setup" in p5.
init();

// Define initial scene
async function init() {
	//camera from example
	const LAYER_VOLUMETRIC_LIGHTING = 10;

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.025, 5);
	camera.position.set(-70, 400, 600);

	scene = new THREE.Scene();

	//Light
	const spotLight = new THREE.SpotLight(0xfffdfb, 4);
	spotLight.position.set(0.4, 0.6, 0.3);
	spotLight.castShadow = true;
	spotLight.angle = Math.PI / 8;
	spotLight.penumbra = 0.8;
	spotLight.decay = 1;
	spotLight.distance = 0;
	spotLight.shadow.mapType = THREE.HalfFloatType; // For HDR Caustics
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 0.1;
	spotLight.shadow.camera.far = 1.1;
	spotLight.shadow.intensity = 0.9;
	spotLight.layers.enable(LAYER_VOLUMETRIC_LIGHTING);
	scene.add(spotLight);

	//model
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("./src/draco/");
	dracoLoader.setDecoderConfig({ type: "js" });

	gltf = (await new GLTFLoader().setDRACOLoader(dracoLoader).loadAsync("./src/tree.glb")).scene;
	gltf.scale.setScalar(0.1);
	scene.add(gltf);

	gltf2 = (await new GLTFLoader().setDRACOLoader(dracoLoader).loadAsync("./src/garden.glb")).scene;
	gltf2.scale.setScalar(0.03);
	scene.add(gltf2);

	const causticMap = new THREE.TextureLoader().load("./src/Caustic_Free.jpg");
	causticMap.wrapS = causticMap.wrapT = THREE.RepeatWrapping;
	causticMap.colorSpace = THREE.SRGBColorSpace;

	// Material

	const duck = gltf.children[0];
	//duck.size = (0.1,0,1,0.1);
	duck.material = new THREE.MeshPhysicalNodeMaterial();
	duck.material.side = THREE.DoubleSide;
	duck.material.transparent = true;
	duck.material.color = new THREE.Color(0x87e5ff);
	duck.material.transmission = 1;
	duck.material.thickness = 0.2;
	duck.material.ior = 1.3;
	duck.material.metalness = 0.2;
	duck.material.roughness = 0;
	duck.castShadow = true;

	// garden
	const rock = gltf2.children[0];
	//duck.size = (0.1,0,1,0.1);
	rock.material = new THREE.MeshPhysicalNodeMaterial();
	rock.material.side = THREE.DoubleSide;
	rock.material.transparent = true;
	rock.material.color = new THREE.Color(0xfff178);
	rock.material.transmission = 1;
	rock.material.thickness = 2;
	rock.material.ior = 1.0;
	rock.material.metalness = 5;
	rock.material.roughness = 2;
	rock.castShadow = true;

	// TSL Shader

	const causticOcclusion = uniform(1);

	const causticEffect = Fn(() => {
		const refractionVector = refract(
			positionViewDirection.negate(),
			normalView,
			div(1.0, duck.material.ior)
		).normalize();
		const viewZ = normalView.z.pow(causticOcclusion);

		const textureUV = refractionVector.xy.mul(0.6);

		const causticColor = uniform(duck.material.color);
		const chromaticAberrationOffset = normalView.z.pow(-0.9).mul(0.004);

		const causticProjection = vec3(
			texture(causticMap, textureUV.add(vec2(chromaticAberrationOffset.negate(), 0))).r,
			texture(causticMap, textureUV.add(vec2(0, chromaticAberrationOffset.negate()))).g,
			texture(causticMap, textureUV.add(vec2(chromaticAberrationOffset, chromaticAberrationOffset))).b
		);

		return causticProjection.mul(viewZ.mul(60)).add(viewZ).mul(causticColor);
	})().toVar();

	duck.material.castShadowNode = causticEffect;

	duck.material.emissiveNode = Fn(() => {
		// Custom emissive for illuminating backside of the mesh based on the caustic effect and light direction

		const thicknessPowerNode = float(3.0);

		const scatteringHalf = lightViewPosition(spotLight).sub(positionView).normalize();
		const scatteringDot = float(
			positionViewDirection.dot(scatteringHalf.negate()).saturate().pow(thicknessPowerNode)
		);

		return causticEffect.mul(scatteringDot.add(0.1)).mul(0.02);
	})();
	// Ground

	const textureLoader = new THREE.TextureLoader();
	const map = textureLoader.load("./src/hardwood2_diffuse.jpg");
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.repeat.set(10, 10);

	const geometry = new THREE.PlaneGeometry(2, 2);
	const material = new THREE.MeshStandardMaterial({ color: 0 });

	const ground = new THREE.Mesh(geometry, material);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);

	// Renderer

	renderer = new THREE.WebGPURenderer({ antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.transmitted = true;
	renderer.inspector = new Inspector();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animate);
	document.body.appendChild(renderer.domElement);

	// GUI

	const gui = renderer.inspector.createParameters("Volumetric Caustics");
	gui.add(causticOcclusion, "value", 0, 20).name("caustic occlusion");
	gui.addColor(duck.material, "color").name("material color");

	// Post-Processing

	renderPipeline = new THREE.RenderPipeline(renderer);

	// Layers

	const volumetricLightingIntensity = uniform(0.7);

	const volumetricLayer = new THREE.Layers();
	volumetricLayer.disableAll();
	volumetricLayer.enable(LAYER_VOLUMETRIC_LIGHTING);

	// Volumetric Fog Area

	function createTexture3D() {
		let i = 0;

		const size = 128;
		const data = new Uint8Array(size * size * size);

		const scale = 10;
		const perlin = new ImprovedNoise();

		const repeatFactor = 5.0;

		for (let z = 0; z < size; z++) {
			for (let y = 0; y < size; y++) {
				for (let x = 0; x < size; x++) {
					const nx = (x / size) * repeatFactor;
					const ny = (y / size) * repeatFactor;
					const nz = (z / size) * repeatFactor;

					const noiseValue = perlin.noise(nx * scale, ny * scale, nz * scale);

					data[i] = 128 + 128 * noiseValue;

					i++;
				}
			}
		}

		const texture = new THREE.Data3DTexture(data, size, size, size);
		texture.format = THREE.RedFormat;
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.unpackAlignment = 1;
		texture.needsUpdate = true;

		return texture;
	}

	const noiseTexture3D = createTexture3D();

	const smokeAmount = uniform(3);

	const volumetricMaterial = new THREE.VolumeNodeMaterial();
	volumetricMaterial.steps = 20;
	volumetricMaterial.offsetNode = bayer16(screenCoordinate.add(frameId)); // Add dithering to reduce banding
	volumetricMaterial.scatteringNode = Fn(({ positionRay }) => {
		// Return the amount of fog based on the noise texture

		const timeScaled = vec3(time.mul(0.01), 0, time.mul(0.03));

		const sampleGrain = (scale, timeScale = 1) =>
			texture3D(noiseTexture3D, positionRay.add(timeScaled.mul(timeScale)).mul(scale).mod(1), 0).r.add(0.5);

		let density = sampleGrain(1);
		density = density.mul(sampleGrain(0.5, 1));
		density = density.mul(sampleGrain(0.2, 2));

		return smokeAmount.mix(1, density);
	});

	const volumetricMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.5), volumetricMaterial);
	volumetricMesh.receiveShadow = true;
	volumetricMesh.position.y = 0.25;
	volumetricMesh.layers.disableAll();
	volumetricMesh.layers.enable(LAYER_VOLUMETRIC_LIGHTING);
	scene.add(volumetricMesh);

	// Scene Pass

	const scenePass = pass(scene, camera).toInspector();
	scenePass.name = "Scene";

	const sceneDepth = scenePass.getTextureNode("depth");
	sceneDepth.name = "Scene Depth";

	// Material - Apply occlusion depth of volumetric lighting based on the scene depth

	volumetricMaterial.depthNode = sceneDepth.sample(screenUV);

	// Volumetric Lighting Pass

	const volumetricPass = pass(scene, camera, { depth: false, samples: 0 }).toInspector("Volumetric Lighting / Raw");
	volumetricPass.name = "Volumetric Lighting";
	volumetricPass.setLayers(volumetricLayer);
	volumetricPass.setResolutionScale(0.5);

	// Compose and Denoise

	const bloomPass = bloom(volumetricPass, 1, 1, 0).toInspector("Volumetric Lighting / Mip-Chain Gaussian Blur");
	bloomPass.name = "Bloom";

	const scenePassColor = scenePass.add(bloomPass.mul(volumetricLightingIntensity));

	renderPipeline.outputNode = scenePassColor;

	// Controls

	controls = new OrbitControls(camera, renderer.domElement);
	controls.target.z = -0.05;
	controls.target.y = 0.02;
	controls.maxDistance = 1;

	window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to update moving objects, in this case the camera.
// The render function is trigger at the end to update the canvas.
function animate() {
	for (const mesh of gltf.children) {
		mesh.rotation.z -= 0.01;
	}

	controls.update();

	renderPipeline.render();
}
