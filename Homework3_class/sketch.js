function setup() {
    createCanvas(400, 400, WEBGL);
    angleMode(DEGREES);
}

function draw() {
    ambientLight(20);
    background(0);
    orbitControl();
    lights();

    //spinning disk in the bg
    push();
    fill(250);
    shininess(10);
    specularMaterial(255);
    emissiveMaterial(20, 0, 25);
    noStroke();
    //rotateX(frameCount * 1);
    //rotateZ(frameCount * 1);
    //rotateY(frameCount * 1);
    ellipsoid(100, 50, 10);
    filter(BLUR, 20);
    pop();
    
    for (let i=0; i<10; i++){
        push();
        translate(i*20,0,0);
        box(20);
        pop();
    for (let j=0; j<10; j++){
        translate(i*50,j*50,0);
        box(10);
    }
    }
    
}


