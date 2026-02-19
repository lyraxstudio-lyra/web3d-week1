var particles = [];
var explosionProb = 0.99;
var explosionNum = 30;
let shape;
let snowflakes = [];
let cam;
let x=100;
let y=100;
let z=600;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  //cam.setPosition(x, y, z);
}

function preload() {
  shape = loadModel("Poeney2.obj", true);
}


function draw() {
  background(48, 52, 52);
   lights();
    
  
  //push();
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
   //filter(BLUR, 5);
    //translate(x,-20,-100);
    orbitControl();

  push();
  let axis2 = [0, 0, 1];
  let axis1 = [1, 0, 0];
  rotate(160, axis2);
  rotate(-100, axis1);
  noStroke();
  scale(2);
  fill(0);
  model(shape);
  pop();
  cam.setPosition(x, y, z);
  
  if (keyIsDown(65) || keyIsDown(97)) { // 'A' or 'a'
    x -= 5;
  }

  if (keyIsDown(68) || keyIsDown(100)) { // 'D' or 'd'
    x += 5;
  }

  if (keyIsDown(87) || keyIsDown(119)) { // 'W' or 'w'
    y -= 5;
  }

  if (keyIsDown(83) || keyIsDown(115)) { // 'S' or 's'
    y += 5;
  }
  
  if (keyIsDown(81) || keyIsDown(113)) {
  z -= 5;
}

if (keyIsDown(69) || keyIsDown(101)) {
  z += 5;
}
  if (particles.length >= 300) {
   particles = [];
  }
  console.log(x, y, z);
}



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
    stroke(250);
    //fill(255);
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(139,0, 0,20);
    sphere(10);
    //translate(20,20,20);
    fill(255, 255, 224,10);
    sphere(15);
    pop();
  }
}


function textAppear(){
  
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    x = 100;
    y = 100;
    z = 600;  
    cam.lookAt(0, 0, 0);
    return false;
  }
}


