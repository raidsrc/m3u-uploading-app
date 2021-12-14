import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as FileSystem from "expo-file-system";


export default function App() {
  
  const [huh, setHuh] = React.useState(0)
  const [m3uFiles, setM3uFiles] = React.useState([])

  
  
  return (
    <View style={styles.container}>
      <Text>!!!!!!11</Text>
      <StatusBar style="auto" />
      <Text>{huh}</Text>
      <Button title="click me to fetch playlists" onPress={() => {
        setHuh(oldValue => oldValue + 1)
        m3uFilesPromise = fetch_m3u()
        m3uFilesPromise.then((m3u) => {
          setM3uFiles(m3u)
        }).catch((err) => {
          console.error(err)
        })
      }} />
      <Text>{JSON.stringify(m3uFiles)}</Text>
      <Button title="click me to upload playlists to google drive"></Button>
    </View>
  );
}

/**
 * for each m3u file found:
 * obtain the raw text of the file 
 * put that raw text into the body of an upload to google drive, get back the id
 * use the id to name the file appropriately 
 */

async function postRequest(url, data) {
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });
  return response;
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
    // console.log(m3uFileURIs)
    return m3uFileURIs
  } else {
    console.error("permissions to access the file system not granted. bummer")
    return []
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
