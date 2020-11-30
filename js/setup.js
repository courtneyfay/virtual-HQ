////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
////////////////////////////////////////////////////////////////
let renderer, scene, camera, raycaster, object;

function init() {
  // set up the renderer
  renderer = new THREE.WebGLRenderer();
  // sets the size at which the app renders
  renderer.setSize(window.innerWidth, window.innerHeight);
  // adds the renderer (a <canvas/> element) to our HTML document
  document.body.appendChild(renderer.domElement);

  // set up the scene
  scene = new THREE.Scene();

  // set up the camera
  // 1st parameter: field of view (extent of the scene on display in any moment), in degrees
  // 2nd parameter: aspect ratio (usu want width/height to avoid a squished ratio)
  // 3rd parameter: near clipping plane (won't render anything closer than near, related to performance)
  // 4th parameter: far clipping plane (won't render anything farther than far, related to performance)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
}

function createCube(url) {
  // box geometry allows for a cube object
  const geometry = new THREE.BoxGeometry();

  // material that the shape will be made out of
  // uses hex colors
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00, //green
  });

  // a mesh is an object that takes a geometry, and applies a material to it
  // which we can then insert into our scene and move freely around
  const cube = new THREE.Mesh(geometry, material);

  // adds the URL to the cube
  cube.userData = { URL: url };

  // adds the cube to the scene
  scene.add(cube);

  // by default, when scene.add is called, the object is added to the coordinates (0,0,0)
  // this would cause both the camera and the cube to be inside each other
  // so moving the camera out a bit avoids this
  camera.position.z = 5;

  object = cube;

  document.addEventListener("mousedown", onDocumentMouseDown, false);
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  // set up vector
  const vector = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  // set up the raycaster to detect if mouse clicked on object
  raycaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );
  const intersects = raycaster.intersectObject(object);
  if (intersects.length > 0) {
    window.open(intersects[0].object.userData.URL);
  }
}

// need an animate loop to get this stuff to render to the page
// creates a loop that causes the renderer to draw the scene
// every time the screen is refreshed (~60 times per second)
// unlike `setInterval`, `requestAnimationFrame` pauses when a user navigates to another browser tab
// which saves their precious processing power and battery life
// anything you want to move or change while the app is running has to go through the animate loop
// you can call other functions from there, so you don't end up with an animate function that's hundreds of lines
function animate() {
  requestAnimationFrame(animate);
  // can animate the cubes to rotate every frame (~60 times per second)
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
}

function render() {
  // renders the scene
  renderer.render(scene, camera);
}

function start() {
  init();
  createCube("https://stackoverflow.com/");
  animate();
  render();
}

start();
