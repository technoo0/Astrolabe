import DATA from "./time6.json";
import Location from "./getlocation";

var observerGd = {
  longitude: degreesToRadians(-122.0308),
  latitude: degreesToRadians(36.9613422),
  height: 0,
};

const getloc = async () => {
  const myLoc = Location();
  myLoc.init();
  const { altitude, latitude, longitude } = await (
    await myLoc.getData()
  ).coords;
  observerGd = {
    longitude: degreesToRadians(longitude),
    latitude: degreesToRadians(latitude),
    height: 0,
  };
  //   console.log({ latitude, longitude });
};
getloc();
import {
  propagate,
  degreesToRadians,
  gstime,
  eciToEcf,
  ecfToLookAngles,
} from "satellite.js";

const PropgateData = (time) => {
  return new Promise(async (resolve, reject) => {
    // console.log("goooooooooooo");
    let fulldata = [];
    var gmst = await gstime(
      new Date(new Date().getTime() + time * 60 * 60 * 1000)
    );
    for (var i = 0, len = DATA.length; i < len; i++) {
      const { satrec, name, catalogNumber } = await DATA[i];

      var positionAndVelocity = await propagate(
        satrec,
        new Date(new Date().getTime() + time * 60 * 60 * 1000)
      );
      var positionEci = await positionAndVelocity.position;

      if (positionEci) {
        var positionEcf = await eciToEcf(positionEci, gmst);
        var lookAngles = await ecfToLookAngles(observerGd, positionEcf);

        var { azimuth, elevation, rangeSat } = await lookAngles;
        if (elevation > 0) {
          fulldata.push({
            name,
            catalogNumber,
            azimuth,
            elevation,
            rangeSat,
          });
        }
      }
    }
    //   var end = new Date().getTime();
    //   var time = end - start;
    //   console.log("Execution time: " + time);
    // console.log("pogdddddd");

    resolve(fulldata);
  });
};

export default PropgateData;
