function setup() {
    createCanvas(400, 400, WEBGL);
    angleMode(DEGREES);
}

function draw() {
    ambientLight(20);
    background(0);
    orbitControl();
    lights();
    fill(250);
    shininess(10);
    specularMaterial(255);
    emissiveMaterial(20, 0, 25);
    noStroke();
    ellipsoid(100, 100, 10);
    filter(BLUR,20);
}
