import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as FileSystem from "expo-file-system";


export default function App() {

  const [huh, setHuh] = React.useState(0)



  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!!!!!!!!!!!!!!!!!!!!!!1!!!!!!!!!!!11</Text>
      <StatusBar style="auto" />
      <Text>{huh}</Text>
      <Button title="click me" onPress={() => {
        setHuh(oldValue => oldValue + 1)
      recursively_read_directory()
      }} />
    </View>
  );
}

async function recursively_read_directory() {

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (permissions.granted) {
    // Gets SAF URI from response
    const uri = permissions.directoryUri;

    // Gets all files inside of selected directory
    
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
    console.log(files)
    alert(`Files inside ${uri}:\n\n ${JSON.stringify(files)}`);

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
