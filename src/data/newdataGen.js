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
var observerGd;

const initTheLoc = async () => {
  console.log("helllo");
  const LocationSensor = GetLocation();
  await LocationSensor.init();
  const { altitude, latitude, longitude } = await (
    await LocationSensor.getData()
  ).coords;
  console.log({ altitude, latitude, longitude });
  observerGd = {
    longitude: degreesToRadians(await longitude),
    latitude: degreesToRadians(await latitude),
    height: (await altitude) / 1000 || 0,
  };
};

const getData = () => {
  if (observerGd) {
    let fulldata = [];
    data.map((sat) => {
      const { LINE1, LINE2, name, catalogNumber } = sat;
      var satrec = twoline2satrec(LINE1, LINE2);
      var positionAndVelocity = propagate(satrec, new Date());

      var positionEci = positionAndVelocity.position;
      var gmst = gstime(new Date());

      if (positionEci) {
        var positionEcf = eciToEcf(positionEci, gmst);

        var lookAngles = ecfToLookAngles(observerGd, positionEcf);

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
    });
    console.log("pog");
    return fulldata;
  } else {
    return [];
  }
};

module.exports = {
  initTheLoc,
  getData,
};

// const MyDataGen = getData();
// await MyDataGen.init();
// console.log(await MyDataGen.GetData());
