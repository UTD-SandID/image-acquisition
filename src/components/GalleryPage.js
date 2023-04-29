import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Button from './Button';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { Share } from 'react-native';
//import * as FileSystem from 'expo-file-system';
//import Exif from 'exif-js';

//will become gallery page
export default function GalleryPage({navigation}) {

  const [images, setImages] = useState([]);
  const { width } = useWindowDimensions();

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

  /*const onShare = async () => {
    try {
      const result = await Share.share({
        message: images.join('\n'), // join all images with a new line separator
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error);
    }
  };*/

  const sendTemp = async () => {
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
  
      const response = await fetch('https://mywebsite.example/endpoint/', {
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

  const CustomHeader = () => {
    return (
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerTitle}>DetailsPage</Text>
       
        <TouchableOpacity style={styles.headerButton} onPress={sendTemp}>
          <Text style={styles.headerButtonText}>Share</Text>
        </TouchableOpacity>
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

        data={images}
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
  /*
 <Button
        title="Back to camera"
        onPress={() => navigation.goBack()}
      />
  */