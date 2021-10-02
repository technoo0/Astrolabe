import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Home({ navigation }) {
  return (
    <View style={styles.screen}>
      <Svg
        height="13%"
        width="100%"
        viewBox="0 0 1440 320"
        style={{ position: "absolute" }}
      >
        <Path
          fill="#F2EFEA"
          d="M0,256L80,266.7C160,277,320,299,480,277.3C640,256,800,192,960,154.7C1120,117,1280,107,1360,101.3L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </Svg>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Astrolabe</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          Earth Orbit is Full With Debris and Junk
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ARScreen")}
        style={styles.button}
      >
        <Text
          style={{ fontSize: 15, fontFamily: "ropa-sans" }}
          onPress={() => navigation.navigate("ARScreen")}
        >
          See What it Looks Like!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#1E1E24",
  },
  titleContainer: {
    marginTop: "25%",
  },
  title: {
    fontSize: 65,
    color: "white",
    fontFamily: "ropa-sans",
  },
  descriptionContainer: {
    marginTop: "10%",
  },
  description: {
    fontSize: 18,
    color: "white",
    fontFamily: "ropa-sans",
  },
  button: {
    backgroundColor: "#F2EFEA",
    width: 201,
    height: 69,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
});
