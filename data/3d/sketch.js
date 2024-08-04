let fontRegular, fontBold;
let data;
var title;
var titlenew;

let pointModel;
let pointGrid
let xpos;
let ypos;
let url;
let unit;
let date;

let currenturl;
let openurl = false;

let randomPoint;
let interval = 2;
let orbitcontroly = 0;

var boxSz;
var x = [];
var y = [];
var z = [];

let newBox_x;
let newBox_y;

let ex = 1;
let easing = 0.05;

p5.disableFriendlyErrors = true; // disables FES


// preload table data
function preload() {
  data = loadTable(
    '/data/mock-points.csv',
		'csv',
		'header');

    fontRegular = loadFont('Inter-Regular.ttf');
    fontBold = loadFont('Inter-Bold.ttf');
    //fontRegular = textFont('Arial');
    //fontBold = textFont('Arial');

}

function setup() {
  createCanvas(windowWidth,windowHeight, WEBGL);

  frameRate(60);
  makePointModel();
  makePointGrid();

  boxSz = height/4;

  for (var i = 0; i < data.getRowCount(); i++) {

      let newBox_x = boxSz -  map(i, 0, data.getRowCount(), 0, boxSz*2);
      let newBox_y = boxSz -  map(data.getNum(i, "post_views_count"), 0, 6500, 0, boxSz);
       x[i] = newBox_x;
       y[i] = newBox_y;
       z[i] = random(-boxSz, boxSz);

  }

}

function draw() {
  background(241);

  orbitcontroly = frameCount * (0.005);


  //get random point
  if(frameCount % (interval * 100) == 0){
    randomPoint = round(random(0,data.getRowCount()), 0);
  }

    //infocard
    for (i = randomPoint; i < randomPoint+1; i++) {
      push();
      resetMatrix();
      //camera(0, 0, (height/2) / tan(PI/(width/85)), 0, 0, 0, 0, 1, 0);
      camera(0, 0, 800, 0, 0, 0, 0, 1, 0);
      title = data.getString(i, "Title");
      titlenew = title.substring(60, 0);
      cat = data.getString(i, "Categories");
      catnew = cat.substring(40, 0);
      date = data.getString(i, "Date");
      url = data.getString(i, "Permalink");
      drawCard(-width/2,height/2-0,titlenew,catnew,date,url);
      pop();

      push();

      rotateY(orbitcontroly);
      translate(x[i], y[i], z[i]);
      noStroke();
      fill(255,0,0);
      //strokeWeight(15);
      sphere(10);
      pop();

      if (mouseX>0 && mouseX<width/2 && mouseY > height-60 && mouseY < height){
        cursor(HAND);
        openurl = true;
        currenturl = data.getString(i, "Permalink");
      } else {
        cursor(ARROW);
        openurl = false;
      }
    }


  noFill();
  orbitControl(1,1,0,true);
  rotateY(orbitcontroly);
  stroke(0);
  strokeWeight(1);
  model(pointModel);

  noFill();
  strokeWeight(0.3);
  model(pointGrid);


}

function makePointGrid() {
  if (pointGrid) freeGeometry(pointGrid);
  pointGrid = buildGeometry(() => {

    boxSz = height/4;


    //GRID
    for (var j = 0; j < boxSz*2; j += boxSz / 5) {
      for (var k = 0; k < boxSz*2; k += boxSz / 5) {
        push();
        translate(-boxSz, boxSz, -boxSz);
        rotateX(PI/2);
        //strokeWeight(0.1);
        line(k, 0, k, boxSz*2);
        line(0, j, boxSz*2, j);
        pop();
      }
    }

  });
}

function makePointModel() {
  if (pointModel) freeGeometry(pointModel);
  pointModel = buildGeometry(() => {

    boxSz = height/4;
    box(boxSz*2);

    //POINTS
    for (var i = 0; i < data.getRowCount(); i++) {
        push();
        newBox_x = boxSz -  map(i, 0, data.getRowCount(), 0, boxSz*2);
        newBox_y = boxSz -  map(data.getNum(i, "post_views_count"), 0, 6500, 0, boxSz);
         x[i] = newBox_x;
         y[i] = newBox_y;
         z[i] = random(-boxSz, boxSz);

         translate(x[i], y[i], z[i]);
         let boxsize = (boxSz - newBox_y)/40;
         box(1);
         pop();
    }

  });
}

function mouseClicked() {
	if (openurl == true){
  window.open(currenturl);
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawCard(xloc,yloc,title,cat,date,url) {
	push();
  textFont(fontRegular);
  fill(0);
  textAlign(LEFT);
  textSize(12);
  text(title, xloc+5,yloc-23, width, 60);
  textSize(10);
  text(cat, xloc+5,yloc-41);
  text(date, xloc+5,yloc-7);
	pop();
}
