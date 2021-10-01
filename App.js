import React, { useState } from "react";
import ARScreen from "./src/screens/ARScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import Home from "./src/components/Home";
import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    "ropa-sans": require("./fonts/RopaSans-Regular.ttf"),
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ARScreen" component={ARScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
