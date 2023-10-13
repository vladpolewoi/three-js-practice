import * as THREE from "three"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// TASK 8. Group
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
group.add(cube1)

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
group.add(cube3)

group.rotation.reorder("YXZ")
group.rotation.y = -0.6
group.rotation.x = 1

// ------------------------------------------------

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// TASK 1. change the position of the mesh

// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1

// same here
mesh.position.set(0.7, -0.6, 1)

// normalize the vector to 1
// mesh.position.normalize()
// ------------------------------------------------

// TASK 4. Scale
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5

mesh.scale.set(2, 0.5, 0.5) // same as above
// ------------------------------------------------

// TASK 5. Rotation
// Euler angles
// mesh.rotation.reorder("YXZ") // to avoid gimbal lock
// mesh.rotation.x = Math.PI * 0.25
// mesh.rotation.y = Math.PI * 0.25

// // Quaternion
const q = new THREE.Quaternion()
q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.25)
mesh.quaternion.copy(q)
// ------------------------------------------------

// TASK 3. Axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)
// ------------------------------------------------

/**
 * Sizes
 */
const sizes = {
	width: 800,
	height: 600,
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0.5, 0.3, 4)
scene.add(camera)

// TASK 7. Look at
camera.lookAt(mesh.position)
// ------------------------------------------------

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// TASK 2. How to get the distance between two objects
console.log(mesh.position.length()) // vector length from center of the scene to the mesh
console.log(mesh.position.distanceTo(camera.position))
// ------------------------------------------------
