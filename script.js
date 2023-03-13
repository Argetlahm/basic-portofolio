var points = [],
    velocity2 = 2, // velocity squared
    canvas = 
document.getElementById('canvas-container'),
  context = canvas.getContext('2d'),
  radius = 1.5,
  boundaryX = window.innerWidth,
  boundaryY = window.innerHeight,
  distanceToDraw = 120,
  numberOfPoints = 75;

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

init();


function init() {
  // create points
  for (var i = 0; i<numberOfPoints; i++) {
    createPoint();
  }
  // create connections
  for (var i = 0, l=points.length; i<l; i++) {
    var point = points[i];
    if(i == 0) {
      points[i].buddy = points[points.length-1];
    } else {
      points[i].buddy = points[i-1];
    }
  }
  
  // animate
  animate();
}

function createPoint() {
  var point = {}, vx2, vy2;
  point.x = Math.random()*boundaryX;
  point.y = Math.random()*boundaryY;
  // random vx 
  point.vx = (Math.floor(Math.random())*2-1)*Math.random();
  vx2 = Math.pow(point.vx, 2);
  // vy^2 = velocity^2 - vx^2
  vy2 = velocity2 - vx2;
  point.vy = Math.sqrt(vy2) * (Math.random()*2-1);
  points.push(point);
}

function resetVelocity(point, axis, dir) {
  var vx, vy;
  if(axis == 'x') {
    point.vx = dir*Math.random();  
    vx2 = Math.pow(point.vx, 2);
  // vy^2 = velocity^2 - vx^2
  vy2 = velocity2 - vx2;
  point.vy = Math.sqrt(vy2) * (Math.random()*2-1);
  } else {
    point.vy = dir*Math.random();  
    vy2 = Math.pow(point.vy, 2);
  // vy^2 = velocity^2 - vx^2
  vx2 = velocity2 - vy2;
  point.vx = Math.sqrt(vx2) * (Math.random()*2-1);
  }
}

function drawCircle(x, y) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = '#97badc';
  context.fill();  
}

function drawLine(x1, y1, x2, y2) {
  var dist = distance(x1, y1, x2, y2);
  if (dist < distanceToDraw) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = '#8ab2d8'
    context.lineWidth = 0.02;
    context.stroke();
  }
}

function distance(x1, y1, x2, y2) {
  // Calculate the distance between 1 and 2 using Pythagoras theorem
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function draw() {

  if (window.scrollY < 1000) {
    
    for(var i =0, l=points.length; i<l; i++) {
      // circles
      var point = points[i];
      point.x += point.vx;
      point.y += point.vy;
      drawCircle(point.x, point.y);
      // lines
      

      // Filter out the pairs of points that have the desired distance
      let pairs = points.filter((p1, i) => {
        // Compare each point with the rest of the array
        return points.slice(i + 1).some(p2 => {
          let d = distance(p1.x, p1.y, p2.x, p2.y)
          // Return true if d equals distance
          return d <= distanceToDraw;
        });
      });

      // Draw a line between each pair of points
      pairs.forEach(p1 => {
        // Find the matching point for p1 in the array
        let p2 = points.find(p2 => {
          let d = distance(p1.x, p1.y, p2.x, p2.y)
          // Return true if d equals distance
          return d <= distanceToDraw;
        });
        // Call drawLine function with the coordinates of p1 and p2
        drawLine(p1.x, p1.y, p2.x, p2.y);
        // console.log("hmmmmm")
      });


      // drawLine(point.x, point.y, point.buddy.x, point.buddy.y);
      // check for edge
      if(point.x < 0+radius) {
        resetVelocity(point, 'x', 1);
      } else if(point.x > boundaryX-radius) {
        resetVelocity(point, 'x', -1);
      } else if(point.y < 0+radius) {
        resetVelocity(point, 'y', 1);
      } else if(point.y > boundaryY-radius) {
        resetVelocity(point, 'y', -1);
      } 
    }
  }
}

function animate() {
  
  context.clearRect ( 0 , 0 , canvas.width , canvas.height );
  draw();
  requestAnimationFrame(animate);
  
}

window.onscroll = function() {

  // ubah animasi tergantung koordinat scroll
  // console.log(window.scrollY)
  const navAlpha = window.scrollY/100
  if (navAlpha >= 0) {

    let realOpacity = navAlpha > 1 ? 1 : navAlpha;
    const navContainer = document.querySelector(".nav-container")
    navContainer.style.backgroundColor = "rgba(96, 54, 1, "+realOpacity+")"

  }
  

}