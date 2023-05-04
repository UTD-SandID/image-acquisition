import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraPage from '../components/CameraPage';
import GalleryPage from '../components/GalleryPage';
import WelcomePage from '../components/WelcomePage';
import CoordinatePage from '../components/CoordinatePage';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomePage" screenOptions={{headerShown: true}}>
      <Stack.Screen name="WelcomePage" component={WelcomePage} />
      <Stack.Screen name="CameraPage" component={CameraPage} unmountOnBlur={true}/>
      <Stack.Screen name="GalleryPage" component={GalleryPage} />
      <Stack.Screen name="CoordinatePage" component={CoordinatePage} />
    </Stack.Navigator>
  );
};

export default Navigator;