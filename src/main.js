import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createConveyor, createRotaryTable, animateConveyor } from './conveyor';

let scene, camera, renderer, controls;
let conveyors = [];
let lastTime = 0;

// Configuration initiale avec rotation et types
const defaultConfig = [
  { x: 0, y: 0, z: 0, length: 10, width: 2, r: 0, type: "Rouleau" },
  { x: 10, y: 0, z: 0, length: 10, width: 2, r: 90, type: "Rouleau" },
  { x: 0, y: 0, z: 5, length: 2, width: 2, r: 0, type: "Rotative" }
];

init();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(20, 20, 20);

  // Renderer avec antialiasing
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
  scene.add(hemisphereLight);

  // Grid
  const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x888888);
  scene.add(gridHelper);

  // Sol
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Load initial conveyors
  loadConveyors(defaultConfig);

  // Set initial config in textarea
  document.getElementById('config').value = JSON.stringify(defaultConfig, null, 2);

  // Window resize handler
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
 
function loadConveyors(config) {
  // Clear existing conveyors
  scene.children = scene.children.filter(child => 
    child instanceof THREE.GridHelper || 
    child instanceof THREE.Light ||
    child instanceof THREE.PlaneGeometry
  );
  conveyors = [];

  // Add new conveyors
  config.forEach(conv => {
    let conveyorMesh;
    if (conv.type === "Rotative") {
      conveyorMesh = createRotaryTable(conv.width);
    } else {
      conveyorMesh = createConveyor(conv.length, conv.width);
    }
    
    conveyorMesh.position.set(conv.x, conv.y, conv.z);
    conveyorMesh.rotation.y = (conv.r || 0) * Math.PI / 180;
    conveyorMesh.type = conv.type;
    
    scene.add(conveyorMesh);
    conveyors.push(conveyorMesh);
  });
}

function animate(currentTime) {
  requestAnimationFrame(animate);
  
  // Calculer le delta time en secondes
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Animer chaque convoyeur
  conveyors.forEach(conveyor => {
    animateConveyor(conveyor, deltaTime);
  });

  controls.update();
  renderer.render(scene, camera);
}

// Démarrer l'animation avec le temps initial
animate(0);

window.updateConveyors = function() {
  try {
    const config = JSON.parse(document.getElementById('config').value);
    loadConveyors(config);
  } catch (e) {
    alert('Configuration invalide');
  }
}