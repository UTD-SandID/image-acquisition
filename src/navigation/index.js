import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraPage from '../components/CameraPage';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CameraPage" component={CameraPage} />
    </Stack.Navigator>
  );
};

export default Navigator;