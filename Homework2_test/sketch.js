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
  shape = loadModel('/assets/bowl.obj', options);
}

function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(250);

   scale(100);
  translate(mouseX - width/2, mouseY - height/2);
  //orbitControl();

//fill(0);
//noStroke();
// Draw the shape.
  model(shape);
}