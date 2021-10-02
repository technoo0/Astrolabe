import React, { useEffect, useState } from "react";
import * as Sharing from "expo-sharing";
// import jsonData from "./data";
// import  from "../data/ganrateData";

import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
} from "three";
import useStore from "../../state";
import gettheData from "../data/finalData";
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
let myinv;
let remove = false;
var Calrunning = false;
export default function App() {
  const [myGl, setMyGl] = useState();
  const TackPhotoHandler = async () => {
    const photo = await GLView.takeSnapshotAsync(myGl);
    console.log(photo);
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(photo.localUri);
  };
  useStore.setState({ tackphoto: TackPhotoHandler });
  //
  //init the sensors
  useEffect(() => {
    myControls = Conrols();
    myControls.start();
    remove = true;
    myinv = setInterval(function () {
      const time = useStore.getState().time;
      gettheData(time).then(async (fulldata) => {
        mydata = fulldata;
      });
    }, 1000);

    return () => {
      myControls.stop();
      myControls = null;
      mydata = null;
      remove = true;
      clearInterval(myinv);
      myinv = null;
    };
  }, []);

  _onGLContextCreate = async (gl) => {
    // 1. Scene
    let scene = new Scene();
    let camera = new PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.01,
      100000
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

    // const size = 50;
    // const divisions = 50;

    // const gridHelper = new THREE.GridHelper(size, divisions);
    // scene.add(gridHelper);

    // camera.position.y = 2;

    // looping over json data note: json data was reduced for ease of testing but the code is scalable
    const convertandpaint = (obj) => {
      let phi = obj["elevation"];
      let theta = obj["azimuth"];
      let r = obj["rangeSat"];
      if (theta > (180 * Math.PI) / 180) {
        // theta = theta - 360;
        phi = -phi;
      }
      // changing from spherical coordinates to cartesian coordinates ( from angles to x y z)
      let x = r * Math.cos(phi) * Math.sin(theta);
      let y = r * Math.sin(theta) * Math.sin(phi);
      let z = r * Math.cos(theta);
      //since grid size is 50 and average rangesat is 2000 therefore the ration is 1:40 thus I divided by 40 to display objects on the screen
      createCube(x / 30, y / 30, z / 30);
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

    let myjsonData = [];

    const renderLoop = () => {
      setMyGl(gl);
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

    const CalLoop = () => {
      // console.log(Calrunning);

      Calrunning = true;

      // console.log("finshed the running");
      // console.log(fulldata.length);
      myjsonData = mydata;

      MyShapes.map((i) => {
        scene.remove(i);
      });

      MyShapes = [];

      for (let obj of myjsonData) {
        convertandpaint(obj);
      }
      Calrunning = false;
    };

    const render = () => {
      requestAnimationFrame(render);
      renderLoop();
      CalLoop();

      //if sensors are init
    };
    render();
  };
  return <GLView style={{ flex: 1 }} onContextCreate={_onGLContextCreate} />;
}
