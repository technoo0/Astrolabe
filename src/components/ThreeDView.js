import React, { useEffect } from "react";
import jsonData from "./data";
// import  from "../data/ganrateData";
import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
} from "three";
import { initTheLoc, getData } from "../data/newdataGen";
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
let mydata = [];
export default function App() {
  //init the sensors
  useEffect(() => {
    myControls = Conrols();
    myControls.start();
    initTheLoc();

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
    camera.position.y = 1;
    // 3. Renderer
    gl.canvas = {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
    };
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    //function for cube creation
    var MyShapes = [];
    function createCube(x, y, z) {
      const geometry2 = new SphereGeometry(1, 5, 5);
      const material2 = new MeshBasicMaterial({ color: 0x00ff00 });
      const cube2 = new Mesh(geometry2, material2);
      cube2.position.x = x;
      cube2.position.y = y;
      cube2.position.z = z;
      scene.add(cube2);
      MyShapes.push(cube2);
    }

    const size = 50;
    const divisions = 50;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    // camera.position.y = 2;

    // looping over json data note: json data was reduced for ease of testing but the code is scalable
    const convertandpaint = (obj) => {
      let phi = obj["elevation"];
      let theta = obj["azimuth"];
      let r = obj["rangeSat"];
      if (theta > 180) {
        theta = theta - 360;
        phi = -phi;
      }
      // changing from spherical coordinates to cartesian coordinates ( from angles to x y z)
      let x =
        r * Math.cos((phi * Math.PI) / 180) * Math.sin((theta * Math.PI) / 180);
      let y =
        r * Math.sin((theta * Math.PI) / 180) * Math.sin((phi * Math.PI) / 180);
      let z = r * Math.cos((theta * Math.PI) / 180);
      //since grid size is 50 and average rangesat is 2000 therefore the ration is 1:40 thus I divided by 40 to display objects on the screen
      createCube(x / 20, y / 20, z / 20);
    };

    // const MyDataGen = getData();
    // await MyDataGen.init();
    // await MyDataGen.runData();

    // for (i in scene.children) {
    //   console.log(scene.children[i]);
    // }
    // let fobj = {
    //   elevation: 0,
    //   azimuth: 270,
    //   rangeSat: 1000,
    // };
    // const SatLoop = async()=>{

    // }
    // setInterval(() => {
    //   getData().then((data) => {
    //     console.log("ok", data[1]);
    //   });
    // }, 100);

    const render = async () => {
      requestAnimationFrame(render);

      MyShapes.map((i) => {
        // const object = scene.getObjectByProperty("uuid", i);
        // object.geometry.dispose();
        // object.material.dispose();
        scene.remove(i);
      });

      MyShapes = [];

      const myjsonData = await getData();
      for (let obj of myjsonData) {
        convertandpaint(obj);
      }

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
