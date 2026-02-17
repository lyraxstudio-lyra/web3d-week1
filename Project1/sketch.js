var particles = [];
var explosionProb = 0.99;
var explosionNum = 40;
let shape;
let snowflakes = [];
let x;

function setup() {
  createCanvas(0.8*windowWidth, 0.8*windowHeight, WEBGL);
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
   filter(BLUR, 10);
    translate(x,-20,-100);
    orbitControl();

  //rotate
  //let axis2 = [0, 0, 1];
  //let axis1 = [1,0,0];
  // rotate(160, axis2);
  //rotate(-100,axis1);
  //
  //scale(2);
  //model(shape);
  
  //if (particles.length >=100){
  //particles.length(0);
  //pop();
     push(); 
  let axis2 = [0, 0, 1];
  let axis1 = [1,0,0];
   rotate(160, axis2);
  rotate(-100,axis1);
  noStroke();
  scale(2);
    fill(0);
  model(shape);
  pop();
  

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
    stroke(250);
    fill(255);
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255, 254, 207,60);
    sphere(10);
    pop();
  }
}


