import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Button from './Button';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Exif from 'exif-js';
import LoginDialog from './LoginDialog';
import { Buffer } from 'buffer';

//will become gallery page
export default function GalleryPage({navigation}) {

  const [image, setImages] = useState([]);
  const { width } = useWindowDimensions();
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [coinValue, setCoinValue] = useState(3.0);
  const [LatitudeValue, setLat] = useState(1);
  const [LongitudeValue, setLong] = useState(2);

  const handleSend = () => {
    if(username=='' || password==''||password==undefined||username==undefined){
      setShowDialog(true);

    }
    else {
      sendImg();
    }
    
  };

  const handleUserSave = (newUsername, newPassword) => {
    setUsername(newUsername);
    setPassword(newPassword);
  };

  const closeDia = () => {
    if(username=='' || password==''||password==undefined||username==undefined){
      setShowDialog(true);

    }
    else {
      setShowDialog(false);
      sendImg();
    }
    
  };

  const pickImages = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      aspect: [4,3],
      quality: 1,
    })
    console.log(result);
    if(!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...newImages]);
      } else if (result.uri) {
        setImages((prevImages) => [...prevImages, result.uri]);
      }
    }


  };

  const sendImg = async () => {
    console.log(image[0]);
    console.log('sending');
    console.log(username);
    
    const fileName = ('`${username}_${timestamp}.jpg`');
    console.log(fileName);
   
    const formData = new FormData();
    formData.append("image", {
      uri: image[0],
      type: "image/jpeg",
      name: fileName,
    });
    formData.append("latitude", LatitudeValue);
    formData.append("longitude", LongitudeValue);
    formData.append("coin", coinValue);
    formData.append("image_uri", image[0]);

    
    fetch('http://18.189.83.39:8000/api/upload/', {
      method: 'POST',
      headers: {
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

 /* const sendTemp = async () => {
    console.log('will send');
  }
  const sendImg = async () => {
    try {
      const formData = new FormData();
  
      images.forEach((image, index) => {
        formData.append('image' + index, {
          uri: image,
          name: 'image' + index + '.jpg',
          type: 'image/jpeg'
        });
  
        const exifData = Exif.parse(image);
        const {latitude, longitude} = exifData.gps || {};
        if (latitude && longitude) {
          formData.append('lat' + index, latitude);
          formData.append('long' + index, longitude);
        }
      });
  
      const response = await fetch('http://18.189.83.39:8000/api/upload/', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Server response was not ok.');
      }
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  };
/*
  const sendImg = async () => {
    
    //const fileName = (`${username}_${timestamp}.jpg`);
    //console.log(fileName)

    try {

    console.log('sending');
    console.log(username);

    const formData = new FormData();

    image.forEach((image, index) => {
      formData.append('image' + index, {
        uri: image,
        name: 'image' + index + '.jpg',
        type: image + '/jpeg',
      });

      formData.append("latitude", LatitudeValue);
      formData.append("longitude", LongitudeValue);
      formData.append("coin", coinValue)
      /*try {

        const exifData = Exif.parse(image);
        const {latitude, longitude} = exifData.gps || {};
        if (latitude && longitude) {
          formData.append('lat' + index, latitude);
          formData.append('long' + index, longitude);
        }
      } catch (error) {
        console.error('Error Parsing EXIF data:', error);
      }
      
    });

    fetch('http://18.189.83.39:8000/api/upload/', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        //'Content-Type': 'multipart/form-data'
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

  } catch (error) {
    console.error(error.message);
  }
    
  };*/

  const CustomHeader = () => {
    return (
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gallery Page</Text>
       
        <Button title="Send" onPress={handleSend} icon="export" /> 
                <LoginDialog
                  isVisible={showDialog}
                  onSave={handleUserSave}
                  onClose={() => {closeDia();}}
                />
        <TouchableOpacity style={styles.headerButton} onPress={pickImages}>
          <Text style={styles.headerButtonText}>Pick Images</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

    return (
      <FlatList
        ListHeaderComponent={
          <CustomHeader />
        }

        data={image}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: width, height: 250 }}
            key={item}
          />
            
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={{ marginVertical: 100, paddingBottom: 100 }}
        
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 1,
    borderBottomWidth: 0,
    borderBottomColor: 'black',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});