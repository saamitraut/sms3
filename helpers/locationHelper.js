import React, {Component} from 'react';
import Geolocation from 'react-native-geolocation-service'; //V IMP
import {PermissionsAndroid} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';

async function requestLocationPermission(PermissionDenied) {
  //
  if (Platform.OS === 'ios') {
    // getOneTimeLocation();
    // subscribeLocationLocation();
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        //   this.getOneTimeLocation();
        //   this.subscribeLocationLocation();
      } else {
        PermissionDenied;
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
//

function getOneTimeLocation(engineerId) {
  Geolocation.getCurrentPosition(
    position => {
      var data = new FormData();

      data.append(
        'currentLongitude',
        JSON.stringify(position.coords.longitude),
      );

      data.append('currentLatitude', JSON.stringify(position.coords.latitude));
      data.append('deviceid', DeviceInfo.getUniqueId());
      data.append('engineerId', engineerId);

      var xhr = new XMLHttpRequest();

      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          // alert(this.responseText);
          const response = JSON.parse(this.responseText);

          showMessage({
            message: response.Message,
            type: 'info',
          });
        }
      });
      xhr.open('POST', 'http://103.219.0.103/sla/savelocation.php');

      xhr.send(data);
    },
    error => {
      this.setState({locationStatus: error.message});
    },
    {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 10000,
    },
  );
}
//

export {requestLocationPermission, getOneTimeLocation};
