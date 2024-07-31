import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

scene.add(camera);

let tanjiro;
let startRotationX;
let startRotationY;
let startPositionX;

const audio = new Audio("tanjiro/sound.mp4");

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("stone.webp");

loader.load(
  "tanjiro/scene.gltf",
  function (gltf) {
    tanjiro = gltf.scene;
    scene.add(tanjiro);
    tanjiro.rotation.y += 11;
    tanjiro.position.x = 5;
    startRotationX = tanjiro.rotation.x;
    startRotationY = tanjiro.rotation.y;
    startPositionX = tanjiro.position.x;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

loader.load(
  "forest/scene.gltf",
  function (gltf) {
    const forest = gltf.scene;
    scene.add(forest);
    forest.position.y += 20;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const material = new THREE.MeshBasicMaterial({ map: texture });
const cubeGeometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
const cube = new THREE.Mesh(cubeGeometry, material);
const sphereGeometry = new THREE.SphereGeometry(1, 16, 32);
const sphere = new THREE.Mesh(sphereGeometry, material);
const coneGeometry = new THREE.ConeGeometry(1, 1, 4, 1);
const cone = new THREE.Mesh(coneGeometry, material);
scene.add(cube);

cube.rotation.x += 2;
cone.position.y += 1.5;

camera.position.z = 3;

let startAnimation = 180;
let iterationCount = 0;
let maxIterations = 200;
let animationReset = 300;

function animate() {
  audio.play();
  if (iterationCount >= startAnimation) {
    if (tanjiro) {
      tanjiro.rotation.y += 0.5;
      tanjiro.rotation.x += 0.5;
      tanjiro.position.x -= 0.5;

      if (iterationCount >= maxIterations) {
        tanjiro.rotation.y = startRotationY;
        tanjiro.rotation.x = startRotationX;
        tanjiro.position.x += 0.5;
        scene.add(sphere);
        scene.add(cone);
        scene.remove(cube);
      }

      if (iterationCount >= animationReset) {
        tanjiro.rotation.y = startRotationY;
        tanjiro.rotation.x = startRotationX;
        tanjiro.position.x = startPositionX;

        scene.remove(sphere);
        scene.remove(cone);
        scene.add(cube);

        audio.pause();
        audio.currentTime = 0;
        iterationCount = 0;
      }
    }
  }
  iterationCount++;
  renderer.render(scene, camera);
}
