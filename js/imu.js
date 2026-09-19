import * as THREE from "three";

export function createVirtualIMU(torsoBody) {

  const quaternion = new THREE.Quaternion();
  
  const euler = new THREE.Euler();

  function read() {

    const rotation = torsoBody.rotation();

    quaternion.set(rotation.x,rotation.y,rotation.z,rotation.w);


    euler.setFromQuaternion(quaternion,"XYZ");

    const forwardTilt = THREE.MathUtils.radToDeg(euler.x);

    const turningAngle = THREE.MathUtils.radToDeg(euler.y);

    const sidewaysTilt = THREE.MathUtils.radToDeg(euler.z);


    const angularVelocity = torsoBody.angvel();

    return {
      forwardTilt,
      turningAngle,
      sidewaysTilt,

      forwardTiltSpeed: angularVelocity.x,
      turningSpeed: angularVelocity.y,
      sidewaysTiltSpeed: angularVelocity.z,
    };
  }

  return {
    read,
  };
}