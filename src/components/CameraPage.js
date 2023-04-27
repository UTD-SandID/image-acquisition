import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType, ImageType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import * as Location from 'expo-location';
import LoginDialog from './LoginDialog';


export default function CameraPage({ navigation }) {
  
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back); // for flipping camera
   // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); was for flash
    const cameraRef = useRef(null);

    const [widthVal, setWidth] = useState(null);
    const [heightVal, setHeight] = useState(null);
    const [metaData, setMeta] = useState(null);
    const [LatitudeValue, setLat] = useState(null);
    const [LongitudeValue, setLong] = useState(null);
    const [timestamp, setTime] = useState(null);
    const [calibrated, setCalib] = useState(false);
    //const [savedLocation, setLoc] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    
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
    useEffect(() => {
      console.log(`new time: ${timestamp}`);
    }, [timestamp]);
   
  
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

          setImage(uri);
          setWidth(width);
          setHeight(height);

          const location = await Location.getCurrentPositionAsync({});
          //setLoc(location);
          exif['GPSLatitude'] = location.coords.latitude;
          exif['GPSLatitudeRef'] = location.coords.latitude < 0 ? 'S' : 'N';
          exif['GPSLongitude'] = location.coords.longitude;
          exif['GPSLongitudeRef'] = location.coords.longitude < 0 ? 'W' : 'E';
          
          const timeNow = exif['DateTimeOriginal'];
          const formattedTimestamp = timeNow.replace(/[: ]/g, '-');
          exif['imgFileDate'] = formattedTimestamp;
          
          setMeta(exif);
          setTime(formattedTimestamp);

          if (location) {
            setLat(location.coords.latitude);
            setLong(location.coords.longitude);
            console.log('GPS data set');
          } else {
            console.log('Location data not received');
          }
 
         //console.log(exif);
        } catch (error) {
          console.log(error);
        }
      }
    };



    
   /* no good because async state update lags 
    const fileNaming = () => {
      console.log(`before call time: ${timestamp}`);
      const dateStr = getFormattedDate();
      console.log(`after format time: ${dateStr}`);
    }

    const getFormattedDate = () => {
      console.log(`inside call time: ${timestamp}`);
      const time = timestamp;
      if (!time) {
        console.error('timestamp not found ');
        return '';
      }
    
      const formattedTimestamp = timestamp.replace(/[: ]/g, '-');
      return formattedTimestamp;
    };



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

    //TODO  put correct url, file name should be meaningful, untested
    const sendImg = async () => {
      const formTime = timestamp;
      const requestObject = {
        image: {
          uri: image,
          name: 'image.jpg',
          type: 'image/jpeg'
        },
        latitude: LatitudeValue,
        longitude: LongitudeValue
        //coin
      };
      
      fetch('http://3.17.207.109:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
      })
      .then(response => {
        // handle the response
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Server response was not ok.');
        }
      })
      .catch(error => {
        // handle the error
        console.error(error.message);
      });
      
    };

    /* CHAT GPT AWAIT VERSION
    const sendImg = async () => {
  try {
    const formTime = timestamp;
    const requestObject = {
      image: {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg'
      },
      latitude: LatitudeValue,
      longitude: LongitudeValue
    };

    const response = await fetch('http://3.17.207.109:8000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestObject)
    });

    if (response.ok) {
      const json = await response.json();
      // do something with the response data
    } else {
      throw new Error('Server response was not ok.');
    }
  } catch (error) {
    console.error(error.message);
  }
};
    */

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
                  setType(type === CameraType.back ? CameraType.front : CameraType.back);
                  // flipped camera to front, use button for smtg else
                }}
              />
              <Button
                title=""//Gallery
                icon="folder-images"
                onPress={() => navigation.navigate('DetailsPage')}
              />
              
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
                <Button title="Send" onPress={handleSend} icon="export" />
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