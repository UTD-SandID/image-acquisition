import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType, ImageType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import * as Location from 'expo-location';
import LoginDialog from './LoginDialog';
import Exif from 'react-native-exif';
import { Buffer } from 'buffer';
import HollowCircle from './HollowCircle';
import * as FileSystem from 'expo-file-system';

export default function CameraPage({ navigation, route }) {

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [base64String, setBase64String] = useState(null)
    const [coinValue, setCoinValue] = useState(0.750)
    //const [type, setType] = useState(Camera.Constants.Type.back); was for flipping camera
   // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); was for flash
    const cameraRef = useRef(null);

    const [widthVal, setWidth] = useState(null);
    const [heightVal, setHeight] = useState(null);
    const [metaData, setMeta] = useState(null);
    const [LatitudeValue, setLat] = useState(32);
    const [LongitudeValue, setLong] = useState(96);
    const [calibrated, setCalib] = useState(false);
    //const [savedLocation, setLoc] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    var coinChoice = route.params.text
    console.log(coinChoice)
    // let coinValue;
    // if (coinChoice === 'penny'){
    //   coinValue = 0.750
    // } else if (coinChoice === "nickel"){
    //   coinValue = 0.835
    // } else if (coinChoice === "dime"){
    //   coinValue = 0.705
    // } else if (coinChoice === "dollarCoin"){
    //   coinValue = 1.043
    // }
    //console.log(coinChoice)
    //console.log(coinValue)
    
    //when this page is opened, check for and request permissions, prompt user to take calibration picture
    useEffect(() => {
      (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(locationStatus === 'granted');
       // const location = await Location.getCurrentPositionAsync({});
        //setLoc(location);
        if(widthVal==null||heightVal==null){
           
            Alert.alert(  
                'Initial Calibration',  
                'Please take a picture to calibrate the camera.',  
                [   
                    {text: 'OK', onPress: () => console.log('OK Pressed')},  
                ]  
            );  
          
        }
      })();
    }, []);

    //use Effects for state updates
    useEffect(() => {
      console.log(`Updated exif Metadata`);      
      //console.log(metaData);
    }, [metaData]);
    useEffect(() => {
      console.log(`new Lat : ${LatitudeValue}`);
    }, [LatitudeValue]);
    useEffect(() => {
      console.log(`new Long: ${LongitudeValue}`);
    }, [LongitudeValue]);
    useEffect(() => {
      console.log(`new user pass: ${username},${password}`);
    }, [username, password]);
  
    const handleCalib = () => {
      setCalib(true);
      setImage(null);
    };

    const handleUserSave = (newUsername, newPassword) => {
      setUsername(newUsername);
      setPassword(newPassword);
    };

    const handleSend = () => {
      if(username=='' || password==''){
        setShowDialog(true);
      }
      
      //function for POST
      //sendImg();
    };


    //take picture with correct settings, get height and width, get location coordinates
    const takePicture = async () => {
      if (cameraRef) {
        try {
          const picOptions = {exif:true,imageType:'jpg',quality:1};
          const { uri, width, height, exif } = await cameraRef.current.takePictureAsync(picOptions);
          
          const Base64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64,});
          setBase64String(Base64);
        
          setImage(uri);
          setWidth(width);
          setHeight(height);

          const location = await Location.getCurrentPositionAsync({});
          //setLoc(location);
          exif['GPSLatitude'] = location.coords.latitude;
          exif['GPSLatitudeRef'] = location.coords.latitude < 0 ? 'S' : 'N';
          exif['GPSLongitude'] = location.coords.longitude;
          exif['GPSLongitudeRef'] = location.coords.longitude < 0 ? 'W' : 'E';
          setMeta(exif);

          if (location) {
            setLat(location.coords.latitude);
            setLong(location.coords.longitude);
            console.log('GPS data set');
          } else {
            console.log('Location data not received');
          }
          //not used
         // saveLocation();
         //setLat(savedLocation.coords.latitude);
          //setLong(savedLocation.coords.longitude);
         
          //in progress
         // const imgDate = getDateTime(uri);
        //  console.log(imgDate);

        } catch (error) {
          console.log(error);
        }
      }
    };

   /* no good because async state update lags 
   const saveLocation = async () => {
      const { GPSLatitude, GPSLongitude } = metaData || {};
          if (GPSLatitude && GPSLongitude ) {
            setLat(GPSLatitude);
            setLong(GPSLongitude);
            console.log('GPS data set');
          } else {
            console.log('GPS data not found in EXIF metadata');
          }
    
    }*/

//save current picture to system gallery
    const savePicture = async () => {
      if (image) {
        try {
          const asset = await MediaLibrary.createAssetAsync(image);
          alert('Picture saved!');
          setImage(null);
          console.log('saved successfully');
        } catch (error) {
          console.log(error);
        }
      }
    };

    const getDateTime = async (uri) => {
      try {
        const mDate = await Exif.getMetaData(uri);
        const dateTimeOriginal = mDate.DateTimeOriginal;
        return dateTimeOriginal;
      } catch (error) {
        console.log(error);
      }
    };


    //TODO username and password have no values, put correct url, file name should be meaningful, untested
    const sendImg = async () => {
      //const timeNow = new Date().toString();
      const user = 'admin'
      const pass = 'admin123'
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("latitude", LatitudeValue);
      formData.append("longitude", LongitudeValue);
      formData.append("coin", coinValue)
      // const requestObject = {
      //   image: {
      //     uri: image,
      //     name: 'image.jpg',
      //     type: 'image/jpeg'
      //   },
      //   latitude: LatitudeValue,
      //   longitude: LongitudeValue,
      //   coin: 0.750
      // };
      
      fetch('http://172.31.46.167:8000/api/upload/', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
      .then(response => {
        // handle the response
        if (response.ok) {
          return response.json();
        } else {
          console.log(JSON.stringify(response));
          throw new Error(response);
        }
      })
      .catch(error => {
        // handle the error
        console.error(error.message);
      });
      
    };

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    if (hasLocationPermission === false) {
      return <Text>No permission to access location</Text>;
    }
  
    return (
      <View style={styles.container}>

        {!image ? (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={cameraRef}
            //flashMode={flash}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 30,
              }}
            >
              <Button
                title=""//flip
                icon="retweet"
                onPress={() => {
                  //setType(type === CameraType.back ? CameraType.front : CameraType.back);
                  // flipped camera to front, use button for smtg else
                }}
              />
              <Button
                title=""//Gallery
                icon="folder-images"
                onPress={() => navigation.navigate('DetailsPage')}
              />
              <HollowCircle size={100} borderWidth={4} color = "black" />
            </View>
          </Camera>
        ) : (
          <Image source={{ uri: image }} style={styles.camera} />
        )}
        
        <View style={styles.controls}>
          {image ? (
            calibrated ? (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 50,
              }}>
                <Button title="Re-take" onPress={() => setImage(null)} icon="retweet" />
                <Button title="Save" onPress={savePicture} icon="check" />
                <Button title="Send" onPress={sendImg} icon="export" />
                <LoginDialog
                  isVisible={showDialog}
                  onClose={() => setShowDialog(false)}
                  onSave={handleUserSave}
                />
              </View>
            ) : (
              <Button title="Done" onPress={handleCalib} icon="camera" />
            )
          ) : (
            <Button title="Take a picture" onPress={takePicture} icon="camera" />
          )}
        </View>


      </View>
      
    );
    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#000',
      padding: 8,
    },
    controls: {
      flex: 0.5,
    },
    button: {
      height: 40,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#E9730F',
      marginLeft: 10,
    },
    camera: {
      flex: 5,
      borderRadius: 20,
    },
    topControls: {
      flex: 1,
    },
  });