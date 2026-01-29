function setup() {
    let canvas = createCanvas(400,400,WEBGL);
    angleMode(DEGREES);
}

function draw(){
    background(0);
    fill(200,100,100);
    noStroke();
    orbitControl();
    box(100);
    translate(0,0,100);
    rotateX(30);
    box(50);
    translate(0,0,50);
    rotateX(60);
    box(25);
    translate(0,0,25);
    rotateX(30);
    scale(0.5);
    box(25);
}