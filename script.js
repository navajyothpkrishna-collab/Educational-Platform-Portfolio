// --- Three.js 3D Background ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: '#06B6D4',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
// Create Floating Geometric Shapes
const shapes = [];
const geometries = [
    new THREE.IcosahedronGeometry(2, 0),
    new THREE.TorusGeometry(1.5, 0.5, 16, 100),
    new THREE.OctahedronGeometry(2, 0)
];
const colors = ['#4F46E5', '#06B6D4', '#F43F5E'];
for(let i = 0; i < 5; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    
    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.y = (Math.random() - 0.5) * 40;
    mesh.position.z = (Math.random() - 0.5) * 20 - 10;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Animation properties
    mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2
    };
    
    shapes.push(mesh);
    scene.add(mesh);
}
// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});
// Scroll Interaction for 3D Scene
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});
// Animation Loop
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // Update target for smooth mouse movement
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    // Animate Particles
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    
    // Mouse influence on particles
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    // Scroll influence on camera
    camera.position.y = -scrollY * 0.01;
    // Animate Shapes
    shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotSpeedX;
        shape.rotation.y += shape.userData.rotSpeedY;
        
        // Float effect
        shape.position.y += Math.sin(elapsedTime * 2 + shape.userData.floatOffset) * 0.02;
    });
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);
// Hero Animations
const tl = gsap.timeline();
tl.from(".glass-nav", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
})
.from(".hero h1", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
}, "-=0.5")
.from(".hero p", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power4.out"
}, "-=0.6")
.from(".hero-buttons", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power4.out"
}, "-=0.6")
.from(".course-card", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power4.out"
}, "-=0.4");
// Scroll Animations for Sections
gsap.utils.toArray('section').forEach(section => {
    if(section.id !== 'home') {
        gsap.from(section.querySelectorAll('.section-title, .course-card, .faculty-card, .contact-container'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }
});
