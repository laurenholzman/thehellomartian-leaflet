let myMap;
let canvas;
const mappa = new Mappa('Leaflet');


// Lets change the map tiles to something with more contrast



const options = {
  lat: 49.264097,
  lng: -123.247285,
  
  zoom: 3.2,
  style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
  
}


function setup(){
  canvas = createCanvas(640,640);
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas) 
  
  // Load the data
  url = 'https://raw.githubusercontent.com/cvalenzuela/Mappa/master/tutorials/basic/Meteorite_Landings.csv';
  meteorites = loadTable(url, 'csv', 'header');

  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(drawMeteorites);

  fill(147,112,219); 
  stroke(75,0,130);
  strokeWeight(1);

}

function draw(){
}


// Draw the meteorites
function drawMeteorites() {
  // Clear the canvas
  clear();

  for (let i = 0; i < meteorites.getRowCount(); i++) {
    // Get the lat/lng of each meteorite 
    const latitude = Number(meteorites.getString(i, 'reclat'));
    const longitude = Number(meteorites.getString(i, 'reclong'));

    // Only draw them if the position is inside the current map bounds. We use a
    // Leaflet method to check if the lat and lng are contain inside the current
    // map. This way we draw just what we are going to see and not everything. See
    // getBounds() in http://leafletjs.com/reference-1.1.0.html
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
      // Get the size of the meteorite and map it. 60000000 is the mass of the largest
      // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
      let size = meteorites.getString(i, 'mass (g)');
      let size2 = meteorites.getString(i, 'mass (g)');
      size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      if (size2>= 23000000) {
        //Changes the shape of the 10 largest meteorites
        rectMode(CENTER)
        push();
        translate(pos.x,pos.y)
          rect(0,0,size/sqrt(2),size/sqrt(2))
          rotate(PI/4);
          rect(0,0,size/sqrt(2),size/sqrt(2))
         pop();
    
      } else {
      
      ellipse(pos.x, pos.y, size, size);
      
    }
  } 
  }
}
