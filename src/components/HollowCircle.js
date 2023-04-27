import React from 'react';
import { View } from 'react-native';

const HollowCircle = ({ size, borderWidth, color }) => {
  const circleSize = size || 100; // default size of 50
  const circleColor = color || 'transparent'; // default color of transparent
  const circleBorderWidth = borderWidth || 2; // default border width of 2

  return (
    <View
      style={{
        position: 'absolute',
        bottom: -500,
        left: 50,
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        borderWidth: circleBorderWidth,
        borderColor: circleColor,
      }}
    />
  );
};

export default HollowCircle;