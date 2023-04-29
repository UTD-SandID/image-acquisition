import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraPage from '../components/CameraPage';
import GalleryPage from '../components/GalleryPage';
import WelcomePage from '../components/WelcomePage';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomePage" screenOptions={{headerShown: true}}>
      <Stack.Screen name="WelcomePage" component={WelcomePage} />
      <Stack.Screen name="CameraPage" component={CameraPage} unmountOnBlur={true}/>
      <Stack.Screen name="DetailsPage" component={GalleryPage} />
    </Stack.Navigator>
  );
};

export default Navigator;