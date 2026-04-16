function setup() {
    createCanvas(400, 400, WEBGL);
}

function draw() {
    background(0);
    
    //circle1
    push();
     rotateX(frameCount * 0.01);
     rotateY(frameCount * 0.01);
    fill(0);
    stroke(120);
    //size(10);
    torus(180);
    pop();
    
    //circle2
    push();
     rotateX(frameCount * 0.03);
     rotateY(frameCount * 0.03);
    fill(0);
    stroke(140);
    //size(10);
    torus(200);
    pop();
    
    //circle3
    push();
     rotateX(frameCount * 0.06);
     rotateY(frameCount * 0.06);
    fill(0);
    stroke(80);
    torus(220);
    pop();
    
    //circle4
    push();
     rotateX(frameCount * 0.12);
     rotateY(frameCount * 0.12);
    fill(0);
    stroke(60);
    torus(240);
    pop();
    
    //circle5
    push();
     rotateX(frameCount * 0.12);
     rotateY(frameCount * 0.12);
    fill(0);
    stroke(20);
    torus(260);
    pop();
    
    //circle6
    push();
     rotateX(frameCount * 0.005);
     rotateY(frameCount * 0.005);
    fill(0);
    stroke(180);
    torus(160);
    pop();
    
    //cone
    push();
    stroke(255, 253, 132);
    //cone1
    rotateX(frameCount * 0.12);
    rotateY(frameCount * 0.12);
    noStroke();
    fill(240);
    cone(60);
    
    //cone2 
    rotateX(frameCount * -1);
    rotateY(frameCount * -1);
    noStroke();
    fill(240);
    cone(60);
    //ringcenter
    rotateX(frameCount * 0.14);
     rotateY(frameCount * 0.24);
    fill(255, 253, 132);
    torus(40);
    pop();
    
    
}
