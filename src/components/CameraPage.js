import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType, ImageType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import * as Location from 'expo-location';
export default function CameraPage({ navigation }) {
  
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    //const [type, setType] = useState(Camera.Constants.Type.back); was for flipping camera
   // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); was for flash
    const cameraRef = useRef(null);
    const [widthVal, setWidth] = useState(null);
    const [heightVal, setHeight] = useState(null);
    const [metaData, setMeta] = useState(null);
    const [LatitudeValue, setLat] = useState(null);
    const [LongitudeValue, setLong] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);

    //when this page is opened, check for nd request permissions, prompt user to take calibration picture
    useEffect(() => {
      (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(locationStatus === 'granted');
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
  
    //take picture with correct settings, get height and width, get location coordinates
    const takePicture = async () => {
      if (cameraRef) {
        try {
          const picOptions = {exif:true,imageType:'jpg',quality:0.9};
          const { uri, width, height, exif } = await cameraRef.current.takePictureAsync(picOptions);

          setImage(uri);
          setWidth(width);
          setHeight(height);

          const location = await Location.getCurrentPositionAsync({});
          exif['GPSLatitude'] = location.coords.latitude;
          exif['GPSLatitudeRef'] = location.coords.latitude < 0 ? 'S' : 'N';
          exif['GPSLongitude'] = location.coords.longitude;
          exif['GPSLongitudeRef'] = location.coords.longitude < 0 ? 'W' : 'E';
          setMeta(exif);
          
          const { GPSLatitude, GPSLongitude } = metaData;
          if (GPSLatitude && GPSLongitude ) {
            setLat(GPSLatitude);
            setLong(GPSLongitude);
          } else {
            console.log('GPS data not found in EXIF metadata');
          }
          console.log(`new Latitude: ${LatitudeValue},${LongitudeValue}`);
        } catch (error) {
          console.log(error);
        }
      }
    };

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

    //TODO username and password have no values, put correct url, file name should be meaningful, untested
    const sendImg = async () => {

      const requestObject = {
        image: {
          uri: image,
          name: 'image.jpg',
          type: 'image/jpeg'
        },
        latitude: LatitudeValue,
        longitude: LongitudeValue
      };
      
      fetch('https://mywebsite.example/endpoint/', {
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

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
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
              
            </View>
          </Camera>
        ) : (
          <Image source={{ uri: image }} style={styles.camera} />
        )}
        
        <View style={styles.controls}>
          {image ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 50,
              }}
            >
              <Button
                title="Re-take"
                onPress={() => setImage(null)}
                icon="retweet"
              />
              <Button title="Save" onPress={savePicture} icon="check" />
              <Button title="Send" //onPress={sendImg} 
              icon="export" />
            </View>
          ) : (
            <Button title="Take a picture" onPress={takePicture} 
            icon="camera" />
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