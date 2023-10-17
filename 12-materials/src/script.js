import * as THREE from "three"
import { GUI } from "lil-gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// TASK 12: Set debug panel
const gui = new GUI()

THREE.ColorManagement.enabled = false

// TASK 3: Load textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg"
)
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const matcapTexture = textureLoader.load("/textures/matcaps/8.png")
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg")

// TASK 13: Environment Map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
	"/textures/environmentMaps/3/px.jpg",
	"/textures/environmentMaps/3/nx.jpg",
	"/textures/environmentMaps/3/py.jpg",
	"/textures/environmentMaps/3/ny.jpg",
	"/textures/environmentMaps/3/pz.jpg",
	"/textures/environmentMaps/3/nz.jpg",
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Object
// TASK 4: MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0x50c290)
// material.map = doorColorTexture
// material.wireframe = true
// For opacity or alpha need to add transparent = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// TASK 5: MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// TASK 6: MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// TASK 7: MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// TASK 9: MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// TASK 10: MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// TASK 11: MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// TASK 12: MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// // material.metalness = 0.45
// // material.roughness = 0.65
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 2
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = doorAlphaTexture
// material.transparent = true

// gui.add(material, "metalness").min(0).max(1).step(0.001)
// gui.add(material, "roughness").min(0).max(1).step(0.001)
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001)
// gui.add(material, "displacementScale").min(0).max(1).step(0.001)
// gui.add(material.normalScale, "x").min(0).max(10).step(0.001)
// -------------------------------------------

// TASK 13: Environment Map
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2

material.envMap = environmentMapTexture

gui.add(material, "metalness").min(0).max(1).step(0.001)
gui.add(material, "roughness").min(0).max(1).step(0.001)

// TASK 8: Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)

pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(ambientLight, pointLight)

// TASK 1: Add objects to scene
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

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

	// TASK 2: animation
	// Update objects
	sphere.rotation.y = 0.1 * elapsedTime
	plane.rotation.y = 0.1 * elapsedTime
	torus.rotation.y = 0.1 * elapsedTime

	sphere.rotation.x = 0.15 * elapsedTime
	plane.rotation.x = 0.15 * elapsedTime
	torus.rotation.x = 0.15 * elapsedTime

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
