import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Button from './Button';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginDialog from './LoginDialog';
import { Buffer } from 'buffer';



export default function GalleryPage({navigation, route}) {

  const [image, setImages] = useState([]);
  const { width } = useWindowDimensions();
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [coinValue, setCoinValue] = useState('');

  var coinFinal = route.params.text.coinValue;

  useEffect(() => {
    setCoinValue(coinFinal);
  },[]);

  

  const handleSend = () => {
    if(username=='' || password==''||password==undefined||username==undefined){
      setShowDialog(true);

    }
    else {
      getCoords();
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

  const getCoords = async () => {
    for (let i = 0; i < image.length; i++) {

      let latitudeValue = null;
      let longitudeValue = null;
      
      await new Promise((resolve) => {
        navigation.navigate('CoordinatePage', {
          onSubmit: (latitude, longitude) => {
            latitudeValue = latitude;
            longitudeValue = longitude;
            resolve();
          },
        });
      });

      const currentDate = new Date();
      const dateString = currentDate.toString();
      
      const newTime = dateString.replace(/[: ]/g, '-');
      console.log(newTime);

      sendImg(image[i], latitudeValue, longitudeValue, newTime);
    };
  };

  const sendImg = async (image, latitudeValue, longitudeValue, newTime) => {

    try {

      console.log('sending');
      console.log(username);

      const formData = new FormData();
      const fileName = (`${username}_${newTime}.jpg`);

      formData.append('image', {
      uri: image,
      type: image + '/jpeg',
      name: fileName,
      });

      formData.append('latitude', latitudeValue);
      formData.append('longitude', longitudeValue);
      formData.append("coin", coinValue);
      formData.append("image_uri", image);

      console.log(latitudeValue);
      console.log(longitudeValue);
      console.log(coinValue);
      console.log(image);

      fetch('http://75.12.150.23:8000/api/upload/', {
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

  } catch (error) {
    console.error(error.message);
  }
    
  };

  const CustomHeader = () => {
    return (
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gallery Page</Text>
       
        <Button  title="Send" onPress={handleSend} icon="export" color="#007AFF" /> 
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
        contentContainerStyle={{ marginVertical: 1, paddingBottom: 10 }}
        
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