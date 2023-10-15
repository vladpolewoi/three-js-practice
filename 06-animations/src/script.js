import * as THREE from "three"
import gsap from "gsap"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
	width: 800,
	height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// 1 Time
// let time = Date.now()

// 2 Clock
// const clock = new THREE.Clock()

// Task 3: gsap. All you need is to render yourself
// 3 gsap
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })

// Animations
const tick = () => {
	// TASK 1: Make the cube rotate around the Y axis
	// using the time variable and the deltaTime variable
	// const currentTime = Date.now()
	// const deltaTime = currentTime - time
	// time = currentTime
	// // Update objects
	// mesh.rotation.y += 0.001 * deltaTime

	// TASK 2: Make the cube rotate around the Y axis
	// using the clock object
	// const elapsedTime = clock.getElapsedTime()
	// // Update objects
	// // mesh.rotation.y = elapsedTime * Math.PI
	// // make cube go round
	// // mesh.position.y = Math.sin(elapsedTime)
	// // mesh.position.x = Math.cos(elapsedTime)
	// // make camera go round
	// camera.position.y = Math.sin(elapsedTime)
	// camera.position.x = Math.cos(elapsedTime)
	// camera.lookAt(mesh.position)

	// Render
	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}

tick()
