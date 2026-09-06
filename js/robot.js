import * as THREE from "three";
import RAPIER from "rapier";

export function createRobot(scene, physicsWorld) {
 

  const robotGroup = new THREE.Group();

  scene.add(robotGroup);



  const torsoWidth = 1.4;
  const torsoHeight = 1.6;
  const torsoDepth = 0.8;


  const torsoGeometry = new THREE.BoxGeometry(torsoWidth,torsoHeight,torsoDepth);

  const torsoMaterial = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
  });

  const torsoMesh = new THREE.Mesh(torsoGeometry,torsoMaterial);

  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;

  robotGroup.add(torsoMesh);


  const headGeometry = new THREE.SphereGeometry(0.45,32,32);

  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
  });

  const headMesh = new THREE.Mesh(headGeometry,headMaterial);

  headMesh.position.y =  torsoHeight / 2 + 0.55;

  headMesh.castShadow = true;


  torsoMesh.add(headMesh);



  const torsoBodyDescription =
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, 5, 0);

  const torsoBody = physicsWorld.createRigidBody(
    torsoBodyDescription
  );



  const torsoColliderDescription =
    RAPIER.ColliderDesc.cuboid(
      torsoWidth / 2,
      torsoHeight / 2,
      torsoDepth / 2
    )
      .setFriction(0.8)
      .setRestitution(0.1);

  const torsoCollider =
    physicsWorld.createCollider(
      torsoColliderDescription,
      torsoBody
    );

  return {
    robotGroup,
    torsoMesh,
    headMesh,
    torsoBody,
    torsoCollider,
  };
}