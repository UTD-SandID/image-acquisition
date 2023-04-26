import {Text, View} from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Button from './Button';


const INSTRUCTIONS = [
  { id: 1, text: 'Step 1: First instruction' },
  { id: 2, text: 'Step 2: Second instruction' },
  { id: 3, text: 'Step 3: Third instruction' },
  { id: 4, text: 'Step 4: Fourth instruction' },
];

const data = [
  { label: 'Penny', value: 'penny' },
  { label: 'Nickel', value: 'nickel' },
  { label: 'Dime', value: 'dime' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Dollar coin', value: 'dollarCoin' },
];

const WelcomePage = () => {
  const [selected, setSelected] = React.useState("");

  const renderInstruction = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructionsContainer}>
        {INSTRUCTIONS.map((instruction) => (
          <View key={instruction.id} style={{ padding: 10 }}>
            <Text>{instruction.text}</Text>
          </View>
        ))}
      </View>
      <SelectList setSelected={setSelected} data={data}  />
      <View style={{marginTop:50}}>
        <Text>Selected Value : </Text>
        <Text style={{marginTop:10,color:'gray'}}>{selected}</Text>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15, 
    paddingHorizontal: 15,
  },
  instructionsContainer: {
    flex: 0.4,
  },
  selectedCoinText: {
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomePage;
