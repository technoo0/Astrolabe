import { Accelerometer, Magnetometer } from "expo-sensors";

const _angle = (magnetometer) => {
  let angle = 0;
  if (magnetometer) {
    let { x, y, z } = magnetometer;
    if (Math.atan2(z, x) >= 0) {
      angle = Math.atan2(z, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(z, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  return Math.round(angle);
};

const _degree = (magnetometer) => {
  return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
};

const Calculate_angle = (data) => {
  const { x, y, z } = data;

  const Az = -Math.atan(z / Math.sqrt(x * x + y * y));
  return Az;
};

export default function GetPhonePos() {
  const obj = {};
  obj.data = {
    YR: 0,
    ZR: 0,
  };

  obj.start = () => {
    obj.AccelerometerEvent = Accelerometer.addListener((accelerometerData) => {
      obj.data.YR = Calculate_angle(accelerometerData);
    });

    obj.CompassEvent = Magnetometer.addListener((data) => {
      Number.prototype.map = function (in_min, in_max, out_min, out_max) {
        return (
          ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        );
      };
      const num = Number(_degree(_angle(data))).map(0, 360, -180, 180);
      obj.data.ZR = (num * Math.PI) / 180;
    });
  };

  obj.stop = () => {
    obj.AccelerometerEvent.remove();
    obj.CompassEvent.remove();
  };

  obj.getData = () => {
    return obj.data;
  };

  return obj;
}
