import React, { useState } from 'react';
import { View, TextInput, Modal, Button } from 'react-native';

const LoginDialog = ({ isVisible, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    onSave(username, password);
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ padding: 20 }}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={{ borderWidth: 1, borderColor: 'red', padding: 10 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={{ borderWidth: 1, borderColor: 'red', padding: 10, marginTop: 10 }}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default LoginDialog;
