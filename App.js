import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as FileSystem from "expo-file-system";


export default function App() {

  const [huh, setHuh] = React.useState(0)

  return (
    <View style={styles.container}>
      <Text>!!!!!!11</Text>
      <StatusBar style="auto" />
      <Text>{huh}</Text>
      <Button title="click me" onPress={() => {
        setHuh(oldValue => oldValue + 1)
        fetch_m3u()
      }} />
    </View>
  );
}

async function fetch_m3u() {

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (permissions.granted) {
    // Gets SAF URI from response
    const uri = permissions.directoryUri;

    // Gets all files inside of selected directory
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
    let m3uFileURIs = []
    files.forEach((uri) => {
      if (uri.includes("m3u")) {
        m3uFileURIs.push(uri)
      }
    })
    alert(`m3u files inside ${uri}:\n\n ${m3uFileURIs}`);

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
