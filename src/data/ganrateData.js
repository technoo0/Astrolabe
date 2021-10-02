import {
  twoline2satrec,
  propagate,
  degreesToRadians,
  gstime,
  eciToEcf,
  ecfToLookAngles,
} from "satellite.js";
import GetLocation from "./getlocation";
import data from "./FULLDATATEL.json";

const getData = () => {
  let object = {};
  object.SatRecs = [];
  object.init = async () => {
    object.LocationSensor = GetLocation();
    await object.LocationSensor.init();
    const { altitude, latitude, longitude } = await (
      await object.LocationSensor.getData()
    ).coords;

    object.SatRecs = [];

    object.observerGd = {
      longitude: degreesToRadians(longitude),
      latitude: degreesToRadians(latitude),
      height: altitude / 1000 || 0,
    };

    for (i in data) {
      const { LINE1, LINE2, name, catalogNumber } = await data[i];
      // console.log({ LINE1, LINE2 });
      var satrec = twoline2satrec(LINE1, LINE2);
      // console.log(satrec);

      object.SatRecs.push({
        satrec,
        name,
        catalogNumber,
      });
    }
  };

  object.GetData = async () => {
    // const { altitude, latitude, longitude } = await (
    //   await object.LocationSensor.getData()
    // ).coords;

    // object.observerGd = {
    //   longitude: degreesToRadians(longitude),
    //   latitude: degreesToRadians(latitude),
    //   height: altitude / 1000 || 0,
    // };
    let fulldata = [];
    for (i in object.SatRecs) {
      const { satrec, name, catalogNumber } = object.SatRecs[i];
      var positionAndVelocity = propagate(satrec, new Date());

      var positionEci = positionAndVelocity.position;
      var gmst = gstime(new Date());
      if (positionEci) {
        var positionEcf = eciToEcf(positionEci, gmst);

        var lookAngles = ecfToLookAngles(object.observerGd, positionEcf);

        var { azimuth, elevation, rangeSat } = lookAngles;
        if (elevation > 0) {
          fulldata.push({
            name,
            catalogNumber,
            azimuth: (azimuth * 180) / Math.PI,
            elevation: (elevation * 180) / Math.PI,
            rangeSat,
          });
        }
      }
    }
    return fulldata;
  };

  return object;
};

export default getData;

// const MyDataGen = getData();
// await MyDataGen.init();
// console.log(await MyDataGen.GetData());
