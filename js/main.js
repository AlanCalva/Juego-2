import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MapControls } from 'three/addons/controls/MapControls.js';

let camera, controls, scene, renderer;

init();

function init() {
  scene = new THREE.Scene();
 scene.background = new THREE.Color(0x222244); // azul oscuro
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 200, -400);

  // Controles
  controls = new MapControls(camera, renderer.domElement);
  // controls.addEventListener('change', render); // usar solo si NO hay animation loop
  controls.enableDamping = true;        // requiere animation loop
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;

  // Mundo
  const geometry = new THREE.BoxGeometry();
  geometry.translate(0, 0.5, 0);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 1600 - 800;
    mesh.position.y = 0;
    mesh.position.z = Math.random() * 1600 - 800;
    mesh.scale.x = 20;
    mesh.scale.y = Math.random() * 80 + 10;
    mesh.scale.z = 20;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);
  }

  // Luces
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  // Eventos
  window.addEventListener('resize', onWindowResize);

  // GUI
  const gui = new GUI();
  gui.add(controls, 'zoomToCursor');
  gui.add(controls, 'screenSpacePanning');
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  controls.update();   // necesario si enableDamping o autoRotate
  render();
}

function render() {
  renderer.render(scene, camera);
}
