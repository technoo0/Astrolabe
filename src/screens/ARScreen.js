import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SliderBase,
} from "react-native";
import ThreeDView from "../components/ThreeDView";
import Slider from "react-native-slider";
import useStore from "../../state";
import { Camera } from "expo-camera";

let myControls = null;

export default function ARScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [slider, showSlider] = useState(false);
  const myCamera = useRef(null);
  const handelSliderChange = (value) => {
    useStore.setState({ time: Math.round(value) });
  };
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
        {slider ? (
          <View style={styles.timeStampContainer}>
            <View style={styles.timeContainer}>
              <View style={{ marginRight: "73%" }}>
                <Text style={{ color: "#F2EFEA" }}>-24</Text>
              </View>
              <View>
                <Text style={{ color: "#F2EFEA" }}>+24</Text>
              </View>
            </View>
            <Slider
              value={0}
              minimumValue={-24}
              maximumValue={24}
              minimumTrackTintColor="#F2EFEA"
              trackStyle={styles.sliderTrack}
              thumbStyle={styles.thumb}
              onValueChange={handelSliderChange}
              style={styles.slider}
              thumbTintColor="#1E1E24"
            />
          </View>
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.backButton}
          >
            <Image source={require("../../assets/back-arrow.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showSlider(!slider);
            }}
          >
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
  timeContainer: {
    flexDirection: "row",
  },
  timeStampContainer: {
    marginBottom: "3%",
    alignItems: "center",
  },
  slider: {
    width: "90%",
  },
  sliderTrack: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#F2EFEA",
  },
  thumb: {
    height: "90%",
    width: "3%",
  },
});
