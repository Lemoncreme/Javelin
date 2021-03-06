//Classes
var mouse = {
	x: 0,
	y: 0,
	left: false,
	right: false,
	lastx: 0,
	lasty: 0
}
var player = {
	pos: new THREE.Vector3(0, 0, 0),
	jav: new THREE.Vector3(0, 0, 0),
	hp: 6,
	speed: 0.25
}

//Functions
function lerp(a, b, amnt) {
	return a + (b - a) * amnt;
}
function angle(x1, y1, x2, y2) {
	return -Math.atan2(x2 - x1, y2 - y1);
}
function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
Number.prototype.clamp = function(min, max) {
	return Math.min(max, Math.max(this, min));
};

//Listeners
window.addEventListener("resize", function f() {
	camera.left = window.innerWidth / -2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / -2;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.updateProjectionMatrix();
});
document.addEventListener("mousemove", function f(event){
	var vector = new THREE.Vector3(
		(event.clientX / window.innerWidth - 0.5) * 2, 
		-(event.clientY / window.innerHeight - 0.5) * 2, -1).unproject(camera);
	mouse.x = vector.x - camera.position.x;
	mouse.y = vector.y - camera.position.y;
});
document.addEventListener("touchmove", function f(event){
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});
document.addEventListener("mousedown", function f(event){
	mouse.left = (event.buttons & 1);
	mouse.right = (event.buttons & 2);
});
document.addEventListener("mouseup", function f(event){
	mouse.left = (event.buttons & 1);
	mouse.right = (event.buttons & 2);
});
document.addEventListener("pointerlockchange", function f(event){

});

//Setup
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(
	window.innerWidth / -2, 
	window.innerWidth / 2,
	window.innerHeight / 2,
	window.innerHeight / -2,
	-10, 1000);
camera.zoom = 50;
camera.updateProjectionMatrix();
var renderer = new THREE.WebGLRenderer({ antialias:true });

//Set Renderer Things
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement)

//Definitions
var debugText = document.getElementById("debug");

//Add Cube
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x333333});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Add Arrow
var arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 0.1, 0xffffff, 0.3, 0.1);
arrow.line.material.color.setHex(0x000000);
arrow.cone.material.color.setHex(0x000000);
scene.add(arrow);

//Add Circle
var circle = new THREE.Shape();
circle.moveTo(0, 1);
circle.arc(0, -1, 1, 0, 2 * Math.PI);
var circLine = new THREE.Line(circle.createPointsGeometry(8), new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1}));
circLine.scale.x = circLine.scale.y = 0.15;
scene.add(circLine);

//Render
document.body.requestPointerLock();
render();
var lineLength = 0;
function render() {
	//Pre-Frame
	requestAnimationFrame(render);

	//Text
	debugText.innerHTML = 
		"Javelin Position = " + player.jav.x + "," + player.jav.y
		+ "<br>Camera Position = " + camera.position.x + "," + camera.position.y
		+ "<br>Player Position = " + player.pos.x + "," + player.pos.y
		+ "<br>Mouse Position = " + mouse.x + "," + mouse.y;

	//Move
	cube.rotation.y += 0.05;
	cube.rotation.z += 0.05;
	player.jav.x = player.pos.x;
	player.jav.y = player.pos.y;
	player.pos.x += mouse.x / 20;
	player.pos.y += mouse.y / 20;

	//Visual
	circLine.position.copy(player.pos);
	arrow.rotation.z = angle(0, 0, mouse.x, mouse.y);
	arrow.position.copy(player.pos);
	lineLength = lerp(lineLength, dist(mouse.x, mouse.y, 0, 0), 0.5);
	arrow.setLength(lineLength, lineLength / 4, 0.2);

	//Translate Camera
	camera.position.lerp(player.pos, 0.2);

	//Post-Frame
	renderer.render(scene, camera);
	mouse.lastx = mouse.x;
	mouse.lasty = mouse.y;
}