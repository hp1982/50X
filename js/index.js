"use strict";

var canvas = document.querySelector("canvas");
var scene = window.scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000000);

var renderer = window.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    logarithmicDepthBuffer: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(canvas.width, canvas.height);

var container = new THREE.Object3D();
//container.castShadow = container.receiveShadow = true;
var planet = new THREE.Mesh(new THREE.IcosahedronGeometry(69911, 4), new THREE.MeshPhongMaterial({
    specular: 0,
    anisotropy: 16,
    map: new THREE.TextureLoader().load("http://rojo2.com/labs/webgl/elite/jupiter2_4k.jpg")
}));
planet.receiveShadow = planet.castShadow = true;
container.add(planet);

var atmosphere = new THREE.Mesh(new THREE.RingGeometry(70000, 79000, 64), new THREE.MeshBasicMaterial({
    color: 0xbeaf9a,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    anisotropy: 16,
    map: new THREE.TextureLoader().load("http://rojo2.com/labs/webgl/elite/atmosphere.png")
}));
container.add(atmosphere);

var ring = new THREE.Mesh(new THREE.RingGeometry(92000, 129000, 64), new THREE.MeshPhongMaterial({
    specular: 0,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("http://rojo2.com/labs/webgl/elite/jupiter-ring.png")
}));
ring.receiveShadow = ring.castShadow = true;
ring.rotation.x = Math.PI * 0.5;
container.add(ring);

scene.add(container);

var ambient = new THREE.AmbientLight(0x000000);
scene.add(ambient);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;

light.position.set(-1000, 1000, 500);
scene.add(light);

camera.position.y = 10000;
container.position.z = -69911 * 3;

function update(now) {
    container.position.z = -69911 * 3 + Math.sin(now / 50000) * 69911;
    planet.rotation.y += 0.0005;
}

function render() {
    renderer.render(scene, camera);
}

function frame(now) {
    update(now);
    render();
    requestFrame();
};

function requestFrame() {
    window.requestAnimationFrame(frame);
}

function resize() {
    var _canvas$parentElement = canvas.parentElement.getBoundingClientRect();

    var width = _canvas$parentElement.width;
    var height = _canvas$parentElement.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function start() {

    requestFrame();

    window.addEventListener("resize", resize);
    window.dispatchEvent(new Event("resize"));
}

start();