import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import ThreeDView from "../components/ThreeDView";

import { Camera } from "expo-camera";

let myControls = null;

export default function ARScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [slider,showSlider] = useState(false);
  const myCamera = useRef(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera ref={myCamera} style={styles.camera} type={type}>
        <View style={styles.grid}>
          <ThreeDView />
        </View>
        {
        slider &&  
        <View style={styles.timeStampContainer}>
            <Text>Time Slider</Text>
        </View>
        }
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {navigation.goBack()}} style={styles.backButton}>
            <Image source={require("../../assets/back-arrow.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {showSlider(!slider)}}>
            <Image source={require("../../assets/time-icon.png")} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  grid: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonContainer: {
    marginBottom: "5%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeStampContainer:{
    width:"100%",
    height:50,
    backgroundColor:'white'
  }
});
