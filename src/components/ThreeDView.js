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
var jsonData = [{"name":"THOR ABLE DEB [YO]","catalogNumber":"00115","azimuth":65.40561137409493,"elevation":7.884684362587274,"rangeSat":2099.4123998960627},{"name":"THOR ABLESTAR DEB","catalogNumber":"00124","azimuth":329.99847436412176,"elevation":2.1208758290484475,"rangeSat":3148.1329305195345},{"name":"THOR ABLESTAR DEB","catalogNumber":"00125","azimuth":187.85739753903434,"elevation":1.31184395657651,"rangeSat":3376.036758087897}]


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


    //function for cube creation
    function createCube(x,y,z){
      const geometry2 = new BoxGeometry();
      const material2 = new MeshBasicMaterial({ color: 0x00ff00 });
      const cube2 = new Mesh(geometry2, material2);
      cube2.position.x = x;
      cube2.position.y = y;
      cube2.position.z = z;
      scene.add(cube2);
    }
    

    const size = 50;
    const divisions = 50;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    camera.position.y = 2;


    // looping over json data note: json data was reduced for ease of testing but the code is scalable
    for (let obj of jsonData) {
      let phi = obj['azimuth'];
      let theta = obj['elevation'];
      let r = obj['rangeSat'];
      // changing from spherical coordinates to cartesian coordinates ( from angles to x y z)
      let x = r*Math.cos(phi)*Math.sin(theta);
      let y = r*Math.cos(theta)*Math.sin(phi);
      let z = r*Math.cos(theta);
      //since grid size is 50 and average rangesat is 2000 therefore the ration is 1:40 thus I divided by 40 to display objects on the screen
      createCube(x/40,y/40,z/40);
    }
    
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






