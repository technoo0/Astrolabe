import DATA from "./FULLDATATEL1.json";

import { getSatelliteInfo } from "tle.js/dist/tlejs.esm";

var observerGd = {
  longitude: -122.0308,
  latitude: 36.9613422,
  height: 0.37,
};

const PropgateData = () => {
  return new Promise(async (resolve, reject) => {
    // console.log("goooooooooooo");
    let fulldata = [];

    for (let i in DATA) {
      const { LINE1, LINE2, name, catalogNumber } = await DATA[i];
      const tle = [name, LINE1, LINE2];
      const lookAngles = getSatelliteInfo(
        tle,
        null,
        observerGd.latitude,
        observerGd.longitude,
        0
      );

      var { azimuth, elevation, range } = await lookAngles;
      if (elevation > 0) {
        fulldata.push({
          name,
          catalogNumber,
          azimuth: (azimuth * Math.PI) / 180,
          elevation: (elevation * Math.PI) / 180,
          range,
        });
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
