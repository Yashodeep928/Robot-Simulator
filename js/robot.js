import * as THREE from "three";
import RAPIER from "rapier";

export function createRobot(scene, physicsWorld) {

  const robotGroup = new THREE.Group();

  scene.add(robotGroup);

  const torsoWidth = 1.4;
  const torsoHeight = 1.6;
  const torsoDepth = 0.8;

  const legWidth =0.45;
  const legHeight =1.5;
  const legDepth =0.5; 

  const torsoStartY = 2.9;
  const legStartY = torsoStartY - torsoHeight / 2 - legHeight / 2;
  const legOffsetX = 0.45;


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



  const torsoBodyDescription = RAPIER.RigidBodyDesc.fixed().setTranslation(0, torsoStartY, 0);

  const torsoBody = physicsWorld.createRigidBody(torsoBodyDescription);



  const torsoColliderDescription = RAPIER.ColliderDesc.cuboid(torsoWidth / 2,torsoHeight / 2,torsoDepth / 2 ).setFriction(0.8).setRestitution(0.1);

  const torsoCollider = physicsWorld.createCollider(torsoColliderDescription,torsoBody);

  const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);

  const legMaterial =  new THREE.MeshStandardMaterial({color: 0x1e3a8a});

  const leftLegMesh = new THREE.Mesh(legGeometry, legMaterial);

  const rightLegMesh = new THREE.Mesh(legGeometry, legMaterial);

  leftLegMesh.position.set(-legOffsetX, legStartY, 0);

  rightLegMesh.position.set(legOffsetX, legStartY, 0);

  leftLegMesh.castShadow = true;
  rightLegMesh.castShadow = true;
  
  robotGroup.add(leftLegMesh);
  robotGroup.add(rightLegMesh);

  const leftLegBody = physicsWorld.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-legOffsetX, legStartY, 0));

  const rightLegBody = physicsWorld.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(legOffsetX, legStartY, 0));

  const leftLegCollider = physicsWorld.createCollider(RAPIER.ColliderDesc.cuboid(legWidth / 2, legHeight / 2, legDepth / 2).setFriction(0.8).setRestitution(0.05), leftLegBody);

  const rightLegCollider = physicsWorld.createCollider(RAPIER.ColliderDesc.cuboid(legWidth / 2, legHeight / 2, legDepth / 2).setFriction(0.8).setRestitution(0.05), rightLegBody);

const physicsParts = [
  {
    mesh: torsoMesh,
    body: torsoBody,
  },
  {
    mesh: leftLegMesh,
    body: leftLegBody,
  },
  {
    mesh: rightLegMesh,
    body: rightLegBody,
  },
];


const hipAxis = { x: 1, y: 0, z: 0,};

const leftHipDescription = RAPIER.JointData.revolute({x: -legOffsetX, y: -torsoHeight/2, z: 0},{x: 0, y: legHeight/2, z: 0},hipAxis)

const leftHipJoint = physicsWorld.createImpulseJoint(leftHipDescription, torsoBody, leftLegBody,true);


const rightHipDescription = RAPIER.JointData.revolute({x: legOffsetX, y: -torsoHeight/2, z: 0},{x: 0, y: legHeight/2, z: 0},hipAxis)

const rightHipJoint = physicsWorld.createImpulseJoint(rightHipDescription, torsoBody, rightLegBody,true);

const hipSwingLimit = Math.PI / 4;

leftHipJoint.setLimits(-hipSwingLimit, hipSwingLimit);

rightHipJoint.setLimits(-hipSwingLimit, hipSwingLimit);

leftHipJoint.setContactsEnabled(false);
rightHipJoint.setContactsEnabled(false);

const motorStiffness = 100;
const motorDamping = 10;


leftHipJoint.configureMotorPosition(0,motorStiffness,motorDamping);

rightHipJoint.configureMotorPosition(0,motorStiffness,motorDamping);


function setLeftHipAngle(degrees) {
  
  const limitedDegrees = Math.max(-45,Math.min(45, degrees));

  const radians = limitedDegrees * Math.PI / 180;

  leftHipJoint.configureMotorPosition(radians, motorStiffness,motorDamping);

  leftLegBody.wakeUp();
}

function setRightHipAngle(degrees) {
  const limitedDegrees = Math.max(
    -45,
    Math.min(45, degrees)
  );

  const radians = limitedDegrees * Math.PI / 180;

  rightHipJoint.configureMotorPosition(
    radians,
    motorStiffness,
    motorDamping
  );

  rightLegBody.wakeUp();
}



  return {
    robotGroup,
    torsoMesh,
    headMesh,
    torsoBody,
    torsoCollider,
    leftLegMesh,
    rightLegMesh,
    leftLegBody,
    rightLegBody,
    leftLegCollider,
    rightLegCollider,
    physicsParts,
    leftHipJoint,
    rightHipJoint,
    setLeftHipAngle,
  setRightHipAngle, 
  };
}