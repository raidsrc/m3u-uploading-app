import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as FileSystem from "expo-file-system";
import { readDirectoryAsync } from 'expo-file-system';


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

// the plan is to go down each directory and recursively read all the files

// async function recursively_read_directory(URIs: Array) {
//   all_files = []
//   for (URI in list of URIs) {
//     if (URI points to a directory) {
//       array of URIs inside that directory = readDirectoryAsync(URI we just looked at)
//       all_files.append(recursively_read_directory(array of URIs inside that directory))
//     } else {
//       all_files.append(URI)
//     }
//   }
//   return all_files
// }

async function recursively_read_directory() {

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  console.log("requested permissions")

  if (permissions.granted) {
    console.log("permissions granted")
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
