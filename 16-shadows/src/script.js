import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg")
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg")

// IDK some fix for new version
bakedShadow.colorSpace = THREE.SRGBColorSpace
simpleShadow.colorSpace = THREE.SRGBColorSpace

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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001)
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001)
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001)
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001)
scene.add(directionalLight)

// TASK 3: Enable shadows
// Only 3 lights can cast shadows: DirectionalLight, SpotLight, PointLight
directionalLight.castShadow = true

// TASK 4: Improve shadow quality
// need to use the power of 2 n**2
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// TASK 5: Near and far
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// TASK 6: Amplitude
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

// TASK 7: Blur
directionalLight.shadow.radius = 10

// TASK 8: Shadow map algorithm
// Different types of algorithms can be applied to shadow maps:
// THREE.BasicShadowMap: Very performant but lousy quality
// THREE.PCFShadowMap: Less performant but smoother edges
// THREE.PCFSoftShadowMap: Less performant but even softer edges
// THREE.VSMShadowMap: Less performant, more constraints, can have unexpected results

// need to add helper after setting near and far
const directionalLightCameraHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
)
scene.add(directionalLightCameraHelper)

directionalLightCameraHelper.visible = false
// --------------------------------------------

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, "metalness").min(0).max(1).step(0.001)
gui.add(material, "roughness").min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5

scene.add(sphere, plane)

// TASK 13: Dynamic baking shadow
const sphereShadow = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(1.5, 1.5),
	new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true,
		alphaMap: simpleShadow,
	})
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphereShadow)

// TASK 2: Enable shadows
sphere.castShadow = true
plane.receiveShadow = true

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

// TASK 1: Enable shadows
// renderer.shadowMap.enabled = true
renderer.shadowMap.enabled = false
// TASK 8: Shadow map algorithm
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// TASK 9: Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
// TASK 10: Optimise spot light
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false

// TASK 11: Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
// TASK 12: Optimise point light
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)
pointLightCameraHelper.visible = false

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// TASK: 14 update baked shadow position
	sphere.position.x = Math.cos(elapsedTime) * 1.5
	sphere.position.z = Math.sin(elapsedTime) * 1.5
	sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

	sphereShadow.position.x = sphere.position.x
	sphereShadow.position.z = sphere.position.z
	sphereShadow.material.opacity = (1 - sphere.position.y) * 0.4

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
