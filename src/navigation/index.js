import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraPage from '../components/CameraPage';
import DetailsPage from '../components/DetailsPage';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="CameraPage">
      <Stack.Screen name="CameraPage" component={CameraPage} unmountOnBlur={true}/>
      <Stack.Screen name="DetailsPage" component={DetailsPage} />
    </Stack.Navigator>
  );
};

export default Navigator;