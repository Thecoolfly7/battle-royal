// Basic scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Player
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

// Player Movement Variables
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canJump = false, velocity = new THREE.Vector3();

// Gun (Basic model for demonstration)
const gunGeometry = new THREE.BoxGeometry(0.5, 0.2, 1);
const gunMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const gun = new THREE.Mesh(gunGeometry, gunMaterial);
gun.position.set(0, 1, 2);  // Position the gun in front of the player
player.add(gun);

// Set up the camera
camera.position.z = 5;

// Bullet settings
const bullets = [];
const bulletSpeed = 0.5;
const bulletLifetime = 3;  // Lifetime before bullet disappears

// Enemy setup (simple red cube)
const enemyGeometry = new THREE.BoxGeometry(1, 2, 1);
const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(10, 1, -10);
scene.add(enemy);

// Movement controls (WASD and Space for jump)
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') moveForward = true;
    if (event.key === 's') moveBackward = true;
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
    if (event.key === ' ') {
        if (canJump) velocity.y = 10;
        canJump = false;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') moveForward = false;
    if (event.key === 's') moveBackward = false;
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

// Bullet Shooting
function shootBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(player.position.x, player.position.y, player.position.z + 1);
    scene.add(bullet);
    bullet.velocity = new THREE.Vector3(0, 0, -bulletSpeed);
    bullets.push({ bullet, lifetime: 0 });
}

// Collision detection for bullets
function checkBulletCollisions() {
    bullets.forEach((item) => {
        item.bullet.position.add(item.bullet.velocity);
        item.lifetime += 0.1;
        // Remove bullet if it goes out of bounds
        if (item.lifetime > bulletLifetime) {
            scene.remove(item.bullet);
        }
        // Check collision with enemy
        if (item.bullet.position.distanceTo(enemy.position) < 1) {
            console.log("Hit the enemy!");
            scene.remove(item.bullet);
        }
    });
}

// Animate game loop
function animate() {
    requestAnimationFrame(animate);

    // Player movement
    if (moveForward) player.position.z -= 0.1;
    if (moveBackward) player.position.z += 0.1;
    if (moveLeft) player.position.x -= 0.1;
    if (moveRight) player.position.x += 0.1;

    // Apply gravity
    if (player.position.y > 1) {
        velocity.y -= 0.1;
    } else {
        velocity.y = 0;
        player.position.y = 1;
        canJump = true;
    }
    player.position.y += velocity.y;

    // Handle shooting
    checkBulletCollisions();

    // Render scene
    renderer.render(scene, camera);
}

animate();

// Mouse click to shoot
document.addEventListener('mousedown', () => {
    shootBullet();
});
