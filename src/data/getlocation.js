import * as Location from "expo-location";

export default function getLocation() {
  //   const [location, setLocation] = useState(null);
  //   const [errorMsg, setErrorMsg] = useState(null);
  let object = {};
  object.Permission = false;
  object.init = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      object.Permission = true;
    } else {
      object.Permission = true;
    }
  };
  object.getData = async () => {
    if (object.Permission) {
      let location = await Location.getCurrentPositionAsync({});
      console.log("real");
      return location;
    } else {
      return {
        coords: {
          accuracy: 603,
          altitude: 0,
          altitudeAccuracy: 0,
          heading: 0,
          latitude: 36.9613422,
          longitude: -122.0308,
          speed: 0,
        },
        mocked: false,
        timestamp: 1633127095029,
      };
    }
  };

  return object;
}
