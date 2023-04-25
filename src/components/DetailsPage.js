import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Button from './Button';

//will become gallery page
export default function DetailsPage({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
        title="Back to camera"
        onPress={() => navigation.goBack()}
      />
      </View>
    );
  }