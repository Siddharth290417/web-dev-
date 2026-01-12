const canvas = document.getElementById("c");

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, 400);
renderer.shadowMap.enabled = true;

// ================= SCENE =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // BLACK 3D BACKGROUND


// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / 400, 0.1, 100);
camera.position.set(0, 1.4, 4.6);
camera.lookAt(0, 0.2, 0);

// ================= LIGHTS =================
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(4, 6, 5);
light.castShadow = true;
scene.add(light);

// ================= SIMPLE STAGE =================
const stage = new THREE.Mesh(
  new THREE.CylinderGeometry(2, 2, 0.15, 32),
  new THREE.MeshStandardMaterial({ color: 0xd5d5d5, roughness: 0.9 })
);
stage.position.y = -1.1;
stage.receiveShadow = true;
scene.add(stage);

// ================= PAPER MATERIAL =================
function paper(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0
  });
}

const orange = paper(0xf7931e);
const black  = paper(0x000000);
const white  = paper(0xffffff);
const pink   = paper(0xff6f91);

// ================= TIGER =================
const tiger = new THREE.Group();
tiger.position.y = 0.15;
tiger.position.z = 0.2;
scene.add(tiger);

// -------- HEAD --------
const head = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.3, 1.0),
  orange
);
head.castShadow = true;
tiger.add(head);

// ================= FACE DETAILS =================

// White mouth oval
const mouthWhite = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 24, 16),
  white
);
mouthWhite.scale.z = 0.15;
mouthWhite.position.set(0, -0.15, 0.51);
tiger.add(mouthWhite);

// Triangle
const triangle = new THREE.Mesh(
  new THREE.ConeGeometry(0.12, 0.18, 3),
  black
);
triangle.rotation.x = Math.PI;
triangle.position.set(0, -0.05, 0.55);
tiger.add(triangle);

// Dots
function dot(x, y) {
  const d = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 12, 12),
    black
  );
  d.position.set(x, y, 0.55);
  tiger.add(d);
}
dot(-0.28, -0.12); dot(-0.34, -0.18); dot(-0.28, -0.24);
dot( 0.28, -0.12); dot( 0.34, -0.18); dot( 0.28, -0.24);

// Cheek stripes
function cheekStripe(x) {
  const s = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.45, 0.04),
    black
  );
  s.position.set(x, 0.05, 0.5);
  tiger.add(s);
}
cheekStripe(-0.75);
cheekStripe(0.75);

// ================= MOUTH (PUPPET) =================
const mouthHinge = new THREE.Group();
mouthHinge.position.set(0, -0.35, -0.55);
tiger.add(mouthHinge);

// Jaw
const mouth = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 0.5, 0.8),
  orange
);
mouth.position.set(0, -0.15, 0.35);
mouth.castShadow = true;
mouthHinge.add(mouth);

// Tongue
const tongue = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.12, 0.4),
  pink
);
tongue.position.set(0, -0.12, 0.2);
tongue.visible = false;
mouth.add(tongue);

// ================= EYES =================
function eye(x) {
  const e = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 16, 16),
    white
  );
  const p = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16),
    black
  );
  p.position.z = 0.12;
  e.add(p);
  e.position.set(x, 0.25, 0.6);
  tiger.add(e);
}
eye(-0.4);
eye(0.4);

// ================= EARS =================
function ear(x) {
  const e = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16),
    orange
  );
  e.position.set(x, 0.85, 0.1);
  e.castShadow = true;
  tiger.add(e);
}
ear(-0.65);
ear(0.65);

// ================= INTERACTION =================
let dragging = false;
let lastX = 0;

canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
});
window.addEventListener("mouseup", () => dragging = false);
window.addEventListener("mousemove", e => {
  if (!dragging) return;
  tiger.rotation.y += (e.clientX - lastX) * 0.01;
  lastX = e.clientX;
});

// ================= ANIMATION =================
let t = 0;

function animate() {
  requestAnimationFrame(animate);

  // 🔄 Faster rotation (FINAL CHANGE)
  tiger.rotation.y += 0.008;   // was 0.004

  // Mouth animation
  t += 0.045;
  const open = Math.max(0, Math.sin(t));
  mouthHinge.rotation.x = open * 0.85;
  tongue.visible = open > 0.15;

  renderer.render(scene, camera);
}
animate();

// ================= RESIZE =================
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, 400);
  camera.aspect = window.innerWidth / 400;
  camera.updateProjectionMatrix();
});
