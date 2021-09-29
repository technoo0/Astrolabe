import React, { useEffect } from "react";

import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import Conrols from "./Controls";

//convert the phone rotation to xyz cord
const GanrateCamDircation = (phi, theta) => {
  theta = theta - (90 * Math.PI) / 180;
  phi = -phi;
  const r = 10;
  const x = r * Math.sin(theta) * Math.cos(phi);

  const z = r * Math.sin(theta) * Math.sin(phi);

  const y = r * Math.cos(theta);
  return { x, y, z };
};

let myControls;
export default function App() {
  //init the sensors
  useEffect(() => {
    myControls = Conrols();
    myControls.start();
    return () => {
      myControls.stop();
      myControls = null;
    };
  }, []);

  _onGLContextCreate = async (gl) => {
    // 1. Scene
    let scene = new Scene();
    let camera = new PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.01,
      1000
    );

    // 3. Renderer
    gl.canvas = {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
    };
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    cube.position.x = 5;

    scene.add(cube);
    const size = 50;
    const divisions = 50;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    camera.position.y = 2;

    const render = () => {
      requestAnimationFrame(render);
      //if sensors are init
      if (myControls) {
        //get rotation
        const { YR, ZR } = myControls.getData();
        //convert phone rotaion to xyz cords
        const { x, y, z } = GanrateCamDircation(ZR, YR);

        // create vector from the cords
        const pp = new THREE.Vector3(x, y, z);

        // make the camera rotate to the diraction of the cords
        camera.lookAt(pp);
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };
  return <GLView style={{ flex: 1 }} onContextCreate={_onGLContextCreate} />;
}
