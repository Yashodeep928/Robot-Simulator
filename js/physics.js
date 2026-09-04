import RAPIER from "rapier";

export async function createWorld(){
    await RAPIER.init();


    const gravity = {
        x: 0,
        y: -9.81,
        z: 0
    }

    const world = new RAPIER.World(gravity)

    world.timestep = 1/60;

    console.log("Rapier physics world created");

    return world;
}


export function createGroundPhysics(world){
    const groundBodyDescription  = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.1, 0);


  const groundBody = world.createRigidBody(groundBodyDescription);

  const groundColliderDescription = RAPIER.ColliderDesc.cuboid(10, 0.1, 10).setFriction(0.8)
  const groundCollider = world.createCollider(groundColliderDescription, groundBody)

  return{
    groundBody,
    groundCollider
  }
}