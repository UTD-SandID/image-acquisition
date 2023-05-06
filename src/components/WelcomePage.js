import {Text, View} from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { Button } from 'react-native';


const INSTRUCTIONS = [
  { id: 1, text: 'Welcome to SandID! You can take and send images that will createa machine learning dataset.' },
  { id: 2, text: 'You will need a coin. Select one below.' },
  { id: 3, text: 'Use a sample of sand that is flat and evenly lit. Lay the coin on the sand.' },
  { id: 4, text: 'Line up the coin with the outline and take your picture. The coin should appear larger than the outline (the closer/larger the better). ' },
  { id: 5, text: 'Next, you can then send or save it. You can also select images you have already taken from the gallery.' },
];

const data = [
  { label: 'Penny', value: 'penny' },
  { label: 'Nickel', value: 'nickel' },
  { label: 'Dime', value: 'dime' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Dollar coin', value: 'dollarCoin' },
];

const WelcomePage = ({ navigation }) => {
  const [selected, setSelected] = React.useState("");

  const renderInstruction = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
    <View style={styles.container}>
  <View style={styles.instructionsContainer}>
    {INSTRUCTIONS.map((instruction) => (
      <View key={instruction.id} style={{ padding:5 }}>
        <Text>{instruction.text}</Text>
      </View>
    ))}
  </View>
  <View style={{ marginTop: 10 }}>
    <Text>Selected Value : </Text>
    <Text style={{ marginTop: 10, color: 'gray' }}>{selected}</Text>
  </View>
  <View style={styles.selectListContainer}>
    <SelectList setSelected={setSelected} data={data} />
  </View>
  
  {selected && (
    <Button
      title="Confirm Selection"
      onPress={() => {
        navigation.navigate('CameraPage', { text: { selected } });
      }}
    />
  )}
</View>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 15, 
    paddingHorizontal: 15,
  },
  instructionsContainer: {
    flex: 0.5,
  },
  selectListContainer: {
    marginTop: 10,
    height: 100,
    flexDirection: 'column',
    marginBottom: 100,
    position: 'relative',
  },
  selectedCoinText: {
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute', // Add this line
    bottom: 10, // Set to the height of the button
    height: 10,
    borderRadius: 6,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default WelcomePage;