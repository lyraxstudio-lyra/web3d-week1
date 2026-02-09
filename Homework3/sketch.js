let lightZ=-100;

let shape;
let options = {
  normalize: true,
  successCallback: handleModel,
  failureCallback: handleError,
  fileType: '.obj'
};
let y = -1200;
let snowflakes = 400;

// Load the file and create a p5.Geometry object.
// Normalize the geometry's size to fit the canvas.
function preload() {
  shape = loadModel('lotus_ez.obj', true);
}

function setup() {
  createCanvas(600, 600, WEBGL);
  angleMode(DEGREES);
}

function draw() {
  background(250);
   lights();
  //pointLight(237, 143, 237,0,0,lightZ);
  push();
  translate(0,0,100);
  
  pop();
   scale(2);
  
  //ellipse1
  push();
    fill(0);
    //shininess(10);
    //specularMaterial(255);
    //emissiveMaterial(20, 0, 25);
    noStroke();
    translate(0,-10,0);
   let axis1 = [0, 0,1];
   rotate(160, axis1);
    rotateX(-frameCount * 1);
    rotateZ(-frameCount * 1);
    //rotateY(frameCount * 1);
    ellipsoid(100, 160, 5);
    //filter(BLUR, 40);
    //filter(BLUR, 2);
  pop();
  
  //ellipse2
  push();
    fill(21, 155, 255);
    //shininess(10);
    //specularMaterial(255);
    //emissiveMaterial(20, 0, 25);
    noStroke();
    translate(20,-100,50);
   let axis3 = [0, 0,1];
   rotate(-160, axis3);
    rotateX(frameCount * 1);
    rotateZ(-frameCount * 1);
    //rotateY(frameCount * 1);
    ellipsoid(100, 160, 50);
    //filter(BLUR, 40);
    //filter(BLUR, 2);
  pop();
  filter(BLUR, 40);
  filter(THRESHOLD);
  
  push();
  //stroke(129, 0, 250);
  //stroke(0);
  noStroke();
  //fill(167, 255, 228);
  fill(0);
  ambientMaterial(0, 255, 179);
  //ambientMaterial(126, 181, 164);
  //normalMaterial();
  //shininess(50);
  specularMaterial(167, 255, 228);
  //specularMaterial(155, 138, 228);
  //emissiveMaterial(250, 157, 255);
  emissiveMaterial(167, 255, 228);
  //filter(BLUR, 10);
  //rotate
 let axis2 = [0, 0,1];
  rotate(160, axis2);
  
  //rotateX(frameCount * 1);
  //rotateZ(frameCount * 1);
  rotateY(frameCount * 2);


  orbitControl();

  model(shape);
  pop();
  //filter(INVERT,2);
  //filter(THRESHOLD);
//torus halo if works
  push();
  rotateX(frameCount * 2);
    rotateY(frameCount * 2);
   noFill();  
  //fill(250);
    stroke(250);
  //stroke(129, 0, 250);  
  //torus(150);
  pop();
  //snowfall
  //for (let s = 0; s < snowflakes*0.01; s++) {
  //  //circle(random(width), y + random(1200), random(1, 6));
  //   ellipsoid(30);
  //}
  //y += 20;
//
  //if (y > 0) {
  //  y = -600;
//}
}

