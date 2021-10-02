import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SliderBase,
} from "react-native";
import * as Sharing from "expo-sharing";
import ThreeDView from "../components/ThreeDView";
import Slider from "react-native-slider";
import useStore from "../../state";
import { Camera } from "expo-camera";
import { captureScreen } from "react-native-view-shot";
import { Asset } from "expo-asset";

let myControls = null;

export default function ARScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [slider, showSlider] = useState(false);
  const myCamera = useRef(null);
  const handelSliderChange = (value) => {
    useStore.setState({ time: Math.round(value) });
  };
  const takeScreenShot = () => {
    // To capture Screenshot
    captureScreen({
      // Either png or jpg (or webm Android Only), Defaults: png
      format: "jpg",
      // Quality 0.0 - 1.0 (only available for jpg)
      quality: 0.8,
    }).then(
      //callback function to get the result URL of the screnshot
      async (uri) => {
        console.log(uri);
        if (!(await Sharing.isAvailableAsync())) {
          alert(`Uh oh, sharing isn't available on your platform`);
          return;
        }

        await Sharing.shareAsync(uri);
      },
      (error) => console.error("Oops, Something Went Wrong", error)
    );
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
          >
            <Image source={require("../../assets/back-arrow.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={takeScreenShot}>
            <Image source={require("../../assets/screenShot.png")} />
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
    alignItems: "center",
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
