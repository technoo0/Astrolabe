import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import ThreeDView from "../components/ThreeDView";

import { Camera } from "expo-camera";

var myControls = null;

export default function ARScreen({}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
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
        <View style={styles.buttonContainer}>
          <ThreeDView />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
});
