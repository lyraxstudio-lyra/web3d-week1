// Click and drag the mouse to view the scene from different angles.

let shape;
let options = {
  normalize: true,
  successCallback: handleModel,
  failureCallback: handleError,
  fileType: '.obj'
};

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
  background(0);
   lights();
   scale(2);
  stroke(129, 0, 250);
  //fill(167, 255, 228);
  ambientMaterial(0, 255, 179);
  //normalMaterial();
  //shininess(500);
  specularMaterial(167, 255, 228);
  //emissiveMaterial(250, 157, 255);
  //emissiveMaterial(167, 255, 228);
  //filter(BLUR, 10);
  //rotate
 let axis = [0, 0,1];
  rotate(180, axis);
  
  rotateX(frameCount * 1);
  rotateZ(frameCount * 1);
  rotateY(frameCount * 1);


  orbitControl();

  model(shape);
  filter(BLUR, 2);
}