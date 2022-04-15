//Targeted all the HTML elements from HTML

const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;
const BRUSH_TIME = 1500;

// Global Variables
const canvas = document.createElement('canvas');  //Creating Canvas
canvas.id = 'canvas';
const context = canvas.getContext('2d');  //Canvas that we want
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
  if (brushSlider.value < 10) {
    brushSize.textContent = `0${brushSlider.value}`;
  } else {
    brushSize.textContent = brushSlider.value;
  }
}

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color
bucketColorBtn.addEventListener('change', () => {  //choose the color can change the bucket color.. 
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();  //it will wipe out everything on the page..
  restoreCanvas();  //so we have to restore the canvas on the go
});

// Eraser
eraser.addEventListener('click', () => {
  isEraser = true;
  brushIcon.style.color = 'white';  //whichever button we have active will be black or white after clicking..
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';  //by hovering you will get the text written there Eraser.
  currentColor = bucketColor;
  currentSize = 50;
});


// // Switch back to Brush from Eraser(active Brush)
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;  //upon reactivating the brush the slider will be default to 10 size and the below syntax will will display the updated value.
  displayBrushSize();
}

//For cleaner Code we do set this inside function
function brushTimeSetTimeout(ms) {
  setTimeout(switchToBrush, ms);
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight -50;
  context.fillStyle = bucketColor; /*Background color variable*/ 
  context.fillRect(0, 0, canvas.width, canvas.height); /* top x, left y , width, height */ 
  body.appendChild(canvas);
  switchToBrush();
}

// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas(); //allowing us to create the canvas again when we want to change the background color..
  drawnArray = []; //resenting this array which will completely remove the lines that we have made..becoz lines made are stored in an array
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  brushTimeSetTimeout(BRUSH_TIME);
});

// Draw what is stored in DrawnArray (to allow us to switch background colors effectively i.e helps us to redraw everthing from our drawn array)
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  console.log(line);
  drawnArray.push(line);  //pushing line array in dawn array..
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,  //clicking on the page and subtracting with the boundaries of x and y where the cursor is on the page.
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {   //will  be fired when the mouse is unclicked..
  isMouseDown = false;
});

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray)); //JSON.stingify is used to stored the drawn array as a String.. Local storage acts as web server..
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  brushTimeSetTimeout(BRUSH_TIME);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {  //get the item saved in the local storage
    drawnArray =JSON.parse(localStorage.savedCanvas);  //if they do find something it will set our local drawnArray
    restoreCanvas();

  // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';  //if no canvas found
    brushTimeSetTimeout(BRUSH_TIME);
  }else{
    // Active Tool
  activeToolEl.textContent = 'No Canvas Found';  //if we click load canvas when we haven't made anything we will get this canvas not found..
  brushTimeSetTimeout(BRUSH_TIME); //for 1500ms it will pause then again active.
  }
});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');  //will delete the local storage canvas
  // Active Tool
  activeToolEl.textContent = 'Local Storage Cleared';
  brushTimeSetTimeout(BRUSH_TIME);
});

// Download Image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);  //setting image quality with jpeg
  downloadBtn.download = 'paint-example.jpeg';  //download file name
  // Active Tool
  activeToolEl.textContent = 'Image File Saved';
  brushTimeSetTimeout(BRUSH_TIME);
});

// Event Listener
brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
