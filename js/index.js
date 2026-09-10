import * as THREE from "three";
import { createScene } from "./scene.js";
import { createRobot } from "./robot.js";
import { createWorld,createGroundPhysics } from "./physics.js";

const {scene,camera,renderer,controls} = createScene();

const groundGeometry = new THREE.BoxGeometry(20,0.2,20)

const groundMaterial = new THREE.MeshStandardMaterial({color:0x4f9b4f})


const ground = new THREE.Mesh(groundGeometry,groundMaterial)

ground.position.y = -0.1


ground.receiveShadow = true

scene.add(ground)


const physicsWorld = await createWorld()

createGroundPhysics(physicsWorld)

const {physicsParts} = createRobot(scene,physicsWorld)

  


function animate(){

    const timeStep = physicsWorld.timestep;

let previousTime = performance.now();
let accumulatedTime = 0;

function animate(currentTime) {
  requestAnimationFrame(animate);

  
  const elapsedTime = Math.min((currentTime - previousTime) / 1000, 0.1);

  previousTime = currentTime;
  accumulatedTime += elapsedTime;

 
  while (accumulatedTime >= timeStep) {
    physicsWorld.step();
    accumulatedTime -= timeStep;
  }

 
  physicsParts.forEach((part) => {

    const position = part.body.translation();
    
    const rotation = part.body.rotation();

    part.mesh.position.set( position.x,position.y,position.z);

    part.mesh.quaternion.set(rotation.x,rotation.y,rotation.z,rotation.w);
  });

  controls.update();
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
}
animate()

  window.addEventListener("resize",()=>{

        camera.aspect = window.innerWidth / window.innerHeight 
        
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    })