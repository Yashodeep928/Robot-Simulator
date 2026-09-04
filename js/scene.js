import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";



export function createScene(){

   const scene =  new THREE.Scene()

   scene.background = new THREE.Color(0x87ceeb)

   const camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight ,0.1, 1000)
    
   camera.position.set(0,5,10)

   const renderer = new THREE.WebGLRenderer({antialias:true});

   renderer.setSize(window.innerWidth, window.innerHeight);

   renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

   renderer.shadowMap.enabled = true

   document.body.appendChild(renderer.domElement)


   const controls = new OrbitControls(camera,renderer.domElement)
   
   controls.target.set(0,1,0)

   controls.enableDamping = true

   const ambientLight = new THREE.HemisphereLight(0xffffff,0x444444,2)


   scene.add(ambientLight)

   const sunlight = new THREE.DirectionalLight(0xffffff,3)

   sunlight.position.set(5,10,5)

   sunlight.castShadow = true

   scene.add(sunlight)


   return {
    scene,
    camera,
    renderer,
    controls
   }
}