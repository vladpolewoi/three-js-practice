import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js"

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// TASK 1: Ambient Light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// TASK 2: Directional Light
const directionalLight = new THREE.DirectionalLight()
directionalLight.color = new THREE.Color(0x00fffc)
directionalLight.intensity = 0.3
directionalLight.position.set(1, 0.25, 0)

gui.add(directionalLight, "intensity").min(0).max(1).step(0.001)
scene.add(directionalLight)

// TASK 3: Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight()
hemisphereLight.color = new THREE.Color(0xff0000)
hemisphereLight.groundColor = new THREE.Color(0x0000ff)
hemisphereLight.intensity = 0.3

gui.add(hemisphereLight, "intensity").min(0).max(1).step(0.001)
scene.add(hemisphereLight)

// TASK 4: Point Light
const pointLight = new THREE.PointLight()
pointLight.color = new THREE.Color(0xff9000)
pointLight.intensity = 0.5
pointLight.distance = 10
pointLight.decay = 2
pointLight.position.set(1, -0.5, 1)

gui.add(pointLight, "intensity").min(0).max(3).step(0.001)
gui.add(pointLight, "distance").min(0).max(10).step(0.001)
gui.add(pointLight, "decay").min(0).max(10).step(0.001)
scene.add(pointLight)

// TASK 5: RectArea Light
// only for meshStandardMaterial or meshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight()
rectAreaLight.color = new THREE.Color(0x4e00ff)
rectAreaLight.intensity = 2
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.width = 1
rectAreaLight.height = 1

rectAreaLight.lookAt(new THREE.Vector3())

gui.add(rectAreaLight, "intensity").min(0).max(10).step(0.001)
gui.add(rectAreaLight, "width").min(0).max(10).step(0.001)
gui.add(rectAreaLight, "height").min(0).max(10).step(0.001)
scene.add(rectAreaLight)

// TASK 6: Spot Light
const spotLight = new THREE.SpotLight()
spotLight.color = new THREE.Color(0x78ff00)
spotLight.intensity = 2
spotLight.distance = 10
spotLight.angle = Math.PI * 0.1
spotLight.penumbra = 0.3
spotLight.position.set(0, 2, 3)

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 10

gui.add(spotLight, "intensity").min(0).max(10).step(0.001)
gui.add(spotLight, "distance").min(0).max(10).step(0.001)
gui
	.add(spotLight, "angle")
	.min(0)
	.max(Math.PI * 0.5)
	.step(0.001)
gui.add(spotLight, "penumbra").min(0).max(1).step(0.001)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)

scene.add(spotLight)
// --------------------------------------------

// TASK 7: Cost of light
// Minimal cost
// 1. Ambient Light
// 2. Hemisphere Light
// Moderate cost
// 3. Directional Light
// 4. Point Light
// High cost
// 5. Spot Light
// 6. RectArea Light

// TASK 8: Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
	hemisphereLight,
	0.2
)
const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	0.2
)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(
	hemisphereLightHelper,
	directionalLightHelper,
	pointLightHelper,
	spotLightHelper,
	rectAreaLightHelper
)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 32, 64),
	material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update objects
	sphere.rotation.y = 0.1 * elapsedTime
	cube.rotation.y = 0.1 * elapsedTime
	torus.rotation.y = 0.1 * elapsedTime

	sphere.rotation.x = 0.15 * elapsedTime
	cube.rotation.x = 0.15 * elapsedTime
	torus.rotation.x = 0.15 * elapsedTime

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
