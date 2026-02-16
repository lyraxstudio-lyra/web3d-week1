var particles = [];
var explosionProb = 0.99;
var explosionNum = 40;
let shape;
let snowflakes = [];

function setup() {
  createCanvas(0.8*windowWidth, 0.8*windowHeight, WEBGL);
}

function preload() {
  shape = loadModel("Poeney.obj", true);
}


function draw() {
    background(0);
  if (random(1) > explosionProb) {
    for (let i = 0; i < explosionNum; i++) {
      var p = new Particles();
      particles.push(p);
    }
  }
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
    orbitControl();
  //rotate
  let axis2 = [0, 0, 1];
  rotate(160, axis2);
  
  model(shape);
}


//how do i clean the screen every like 5 go to keep it from lagging?
class Particles {
  constructor() {
    this.pos = createVector(0, 0);
    this.vel = p5.Vector.random3D().normalize().mult(random(4,6));
  }
  
  update() {
    this.pos.add(this.vel);
  }
  
  show() {
    push();
    noStroke();
    fill(255);
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255, 254, 207,60);
    sphere(10);
    pop();
  }
}

