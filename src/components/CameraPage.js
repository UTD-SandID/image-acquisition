import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType, ImageType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import * as Location from 'expo-location';
import LoginDialog from './LoginDialog';
import { Buffer } from 'buffer';
import HollowCircle from './HollowCircle';


export default function CameraPage({ navigation, route }) {
  
  const IPHONE_VIEW_WIDTH = 370; //starter value
  const MIN_PIXEL_PER_IN = 750; //coin pixel width

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const [image, setImage] = useState(null);
    //const [type, setType] = useState(Camera.Constants.Type.back);  was for flipping camera
   // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); was for flash
    const cameraRef = useRef(null);

    const [widthVal, setWidth] = useState(2376); //do not remove initial value
    const [heightVal, setHeight] = useState(null);
    const [metaData, setMeta] = useState(null);
    const [LatitudeValue, setLat] = useState(null);
    const [LongitudeValue, setLong] = useState(null);
    const [timestamp, setTime] = useState(null);
    
    const [calibrated, setCalib] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [coinValue, setCoinValue] = useState(null);
    const [viewWidth, setViewWidth] = useState(IPHONE_VIEW_WIDTH);

    //recieve coin type from welcom page and assign value
    useEffect(() => {
     (async () => {  
       var coinChoice = route.params.text;
       var penny = {"selected" : "penny"}
       var nickel = {"selected" : "nickel"}
       var dime = {"selected" : "dime"}
       var quarter = {"selected" : "quarter"}
       var dollarCoin = {"selected" : "dollarCoin"}

       if (coinChoice.selected === penny.selected){
         setCoinValue(0.750);
       } else if (coinChoice.selected === nickel.selected){
         setCoinValue(0.835);
       } else if (coinChoice.selected === dime.selected){
         setCoinValue(0.705);
       } else if (coinChoice.selected === quarter.selected){
         setCoinValue(0.955);
       } else if (coinChoice.selected === dollarCoin.selected){
         setCoinValue(1.043);
       }
     })();
   }, []);


    //when this page is opened, check for and request permissions, prompt user to take calibration picture
    //if no permission, error text displayed instead of view
    useEffect(() => {
      (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(locationStatus === 'granted');

        //if image height and width not assigned yet, take calibration picture
        if(widthVal==null||heightVal==null){
           
            Alert.alert(  
                'Initial Calibration',  
                'Please take any picture to calibrate the camera.',  
                [   
                    {text: 'OK', onPress: () => console.log('OK Pressed')},  
                ]  
            );  
        }
      })();
    }, []);

    //use Effects for state updates synchronization
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
    useEffect(() => {
      console.log(`new coinVal : ${coinValue}`);
    }, [coinValue]);
   
  //reset after calibration
    const handleCalib = () => {
      setCalib(true); //only once, change view
      setImage(null);
      console.log(`width of view : ${viewWidth}`);
    };

    //save login info from dialog, called by save button on dialog
    const handleUserSave = (newUsername, newPassword) => {
      setUsername(newUsername);
      setPassword(newPassword);
    };

    //if login info not available, show dialog
    //called by send button
    const handleSend = () => {
      if(username=='' || password==''||password==undefined||username==undefined){
        setShowDialog(true);

      }
      else {
        sendImg();
      }
      
    };

    //close dialog and send image with information once entered
    //reopens if nothing entered
    const closeDia = () => {
      if(username=='' || password==''||password==undefined||username==undefined){
        setShowDialog(true);

      }
      else {
        setShowDialog(false);
        sendImg();
      }
      
    };


    //take picture with correct settings, get height and width, get location coordinates
    const takePicture = async () => {
      if (cameraRef) {
        try {
          const picOptions = {exif:true,imageType:'jpg',quality:1}; //image settings
          const { uri, width, height, exif } = await cameraRef.current.takePictureAsync(picOptions); //take pic and get info

          setImage(uri);
          setWidth(width);
          setHeight(height);

          const location = await Location.getCurrentPositionAsync({});

          //set location metadata in image
          exif['GPSLatitude'] = location.coords.latitude;
          exif['GPSLatitudeRef'] = location.coords.latitude < 0 ? 'S' : 'N';
          exif['GPSLongitude'] = location.coords.longitude;
          exif['GPSLongitudeRef'] = location.coords.longitude < 0 ? 'W' : 'E';
          
          //timestamp for filename from metadata
          const timeNow = exif['DateTimeOriginal'];
          const formattedTimestamp = timeNow.replace(/[: ]/g, '-');
          exif['imgFileDate'] = formattedTimestamp;
          
          //set data
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



    

//save current picture to system gallery
    const savePicture = async () => {
      if (image) {
        try {
          const asset = await MediaLibrary.createAssetAsync(image);
          alert('Picture saved!'); //inform user
          setImage(null);
          console.log('saved successfully');
        } catch (error) {
          console.log(error);
        }
      }
    };

    //send POST request with image, including location and login info
    //will not be called until all info available, see handleSend
    const sendImg = async () => {
      console.log('sending');
      console.log(username);
      
      //uniques filename, keep track of user and time for organization and retrieving bad images on server
      const fileName = (`${username}_${timestamp}.jpg`);
      console.log(fileName)
     
      //blob format in order to send image, append necessary data
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: fileName,
      });
      formData.append("latitude", LatitudeValue);
      formData.append("longitude", LongitudeValue);
      formData.append("coin", coinValue);
      formData.append("image_uri", image);
  
      
      fetch('http://75.12.150.23:8000/api/upload/', {
        method: 'POST',
        headers: {
          //login info in header, base 64 encoded
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
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
  
    //when view renders, onLayout saves width of view, used to scale coin outline
    return (
      <View style={styles.container} onLayout={event => setViewWidth(event.nativeEvent.layout.width)}>
        
        {!image ? (
        //show camera when no picture taken
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={cameraRef}
            //flashMode={flash} not used
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 30,
              }}
            >
              <View /> 

              <Button
                title=""//Gallery
                icon="folder-images"
                onPress={() => navigation.navigate('GalleryPage', {text: {coinValue}})}
              />
              
               <HollowCircle size={coinValue*(MIN_PIXEL_PER_IN/widthVal)*viewWidth} borderWidth={5} color = "rgba(255, 255, 255, 0.6)" 
               //scaled coin outline. Calculation: coin diameter in inch*(necessary pixels per inch/image resolution width)*width of view in pixels
               //calculates minimum size for coin outline on screen using actual coin size
               //ensures at least 750 pixels per inch for image processing
               />
           
            </View>
          </Camera>
          
        ) : (
          <Image source={{ uri: image }} style={styles.camera} 
          //show image when taken
          />
        )}
        
        <View style={styles.controls}>
          {image ? (
            //buttons for pictures taken after calibration picture
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
                //opened if login info empty
                  isVisible={showDialog}
                  onSave={handleUserSave}
                  onClose={() => {closeDia();}} //checks if info entered, reopens if not
                />
              </View>
            ) : (
              <Button title="Done" onPress={handleCalib} icon="camera"
              //for one time calibration pic
              />
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
  /*
  was in top bar with gallery button
 <Button
                title=""//flip
                icon="retweet"
                onPress={() => {
                  setType(type === CameraType.back ? CameraType.front : CameraType.back);
                  // flipped camera to front, could use button for smtg else
                }}
              />


   overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

  <View style={{ flex: 1 }}>
          <View style={styles.overlay} />
        </View>
        coinValue*750
  */