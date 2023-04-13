import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType, ImageType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';

export default function CameraPage({ navigation }) {
  
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
   // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);
  
    useEffect(() => {
      (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
      })();
    }, []);
  
    const picOptions = {exif:true,imageType:'jpg',quality:1};


    const takePicture = async () => {
      if (cameraRef) {
        try {
          const data = await cameraRef.current.takePictureAsync(picOptions);
          console.log(data);
          setImage(data.uri);
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    const savePicture = async () => {
      if (image) {
        try {
          const asset = await MediaLibrary.createAssetAsync(image);
          alert('Picture saved! 🎉');
          setImage(null);
          console.log('saved successfully');
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    const sendImg = async () => {
      if (cameraRef) {
        try {
            fetch('https://mywebsite.example/endpoint/', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
     // 'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstParam: 'yourValue',
      secondParam: 'yourOtherValue',
    })
  })
        } catch (error) {
          console.log(error);
        }
      }
    };


    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
      <View style={styles.container}>
        {!image ? (
          <Camera
            style={styles.camera}
            type={type}
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
                  setType(
                    type === CameraType.back ? CameraType.front : CameraType.back
                  );
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