
function setup(){
  createCanvas(600, 600, WEBGL);
  angleMode(DEGREES);
}

function draw(){
    background(250);
    cat(10,20,30);
    cat(50,100,200);
    orbitControl();
}

function cat(x,y,z){
    torus(30);
    box(20);
}