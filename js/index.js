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

const {robotGroup,torsoBody} = createRobot(scene,physicsWorld)


function animate(){

    requestAnimationFrame(animate)

    physicsWorld.step()

     const position = torsoBody.translation();
  const rotation = torsoBody.rotation();

  robotGroup.position.set(position.x,position.y,position.z);

  robotGroup.quaternion.set(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

    controls.update()

    renderer.render(scene,camera)
}
animate()

  window.addEventListener("resize",()=>{

        camera.aspect = window.innerWidth / window.innerHeight 
        
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    })