import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as FileSystem from "expo-file-system";


export default function App() {

  const [huh, setHuh] = React.useState("this a hook.")



  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!!!!!!!!!!!!!!!!!!!!!!1!!!!!!!!!!!11</Text>
      <StatusBar style="auto" />
      <Text>{huh}</Text>
      <Button title="click me lol" onPress={() => {
        setHuh("bru")
        readShit()
      }} />
    </View>
  );
}

async function readShit() {

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (permissions.granted) {
    // Gets SAF URI from response
    const uri = permissions.directoryUri;

    // Gets all files inside of selected directory
    console.log("help")
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
    alert(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
