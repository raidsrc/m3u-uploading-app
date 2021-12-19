import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as FileSystem from "expo-file-system";
import * as Google from "expo-auth-session/providers/google";

const googleDriveSimpleUploadEndpoint = "https://www.googleapis.com/upload/drive/v3/files?uploadType=media"

export default function App() {
  const [m3uFiles, setM3uFiles] = React.useState([])
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "595299029637-sqhkdpn78fd87gaa68mscfs430ckgcih.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/drive.file"]
  })

  React.useEffect(() => { // the function contained inside useEffect runs after render
    if (response?.type === 'success') { // the ? is optional chaining. if response doesn't exist, response? will return undefined. this allows us to avoid throwing a runtime error
      const { authentication } = response; // this is object destructuring. this line pulls the key "authentication" out of the object "response" and assigns it to the variable with the same name, authentication
    }
  }, [response]); // only runs after the value of response changes

  return (
    <View style={styles.container}>

      <StatusBar style="auto" />
      <Image style={styles.bananas} source={{ uri: "https://m.media-amazon.com/images/I/61fZ+YAYGaL._SL1500_.jpg" }}></Image>
      <Button title="click me to fetch playlists" onPress={() => {
        m3uFilesPromise = fetch_m3u()
        m3uFilesPromise.then((m3u) => {
          setM3uFiles(m3u)
        }).catch((err) => {
          console.error(err)
        })
      }} />
      <Text>The .m3u files found in the directory of your choosing will be printed below.</Text>
      <Text nativeID='m3uFilesOutputText'>{returnM3uFilesMoreAttractively(m3uFiles)}</Text>
      <Button
        disabled={!request}
        title="click me to log into google"
        onPress={() => {
          promptAsync();
        }}
      />
      <Button title="click me to upload to google drive" onPress={() => {
        console.log(response.authentication.accessToken)
        handleUploadingM3uToGoogleDrive(response.authentication.accessToken)
      }}></Button>
    </View>
  );
}

function returnM3uFilesMoreAttractively(m3uList) {
  let m3uFilesString = ""
  m3uList.forEach(m3u => {
    m3uFilesString += m3u
    m3uFilesString += "\n"
  })
  return m3uFilesString
}

/**
 * for each m3u file found:
 * obtain the raw text of the file 
 * put that raw text into the body of an upload to google drive, get back the id in the response 
 * use that id to name the file appropriately 
 */

async function handleUploadingM3uToGoogleDrive(accessToken) {

  let response = await postRequest(googleDriveSimpleUploadEndpoint, {
    'Content-Type': 'text/plain',
    'Authorization': "Bearer " + accessToken,
  }, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
  console.log(response)
}

async function postRequest(url, headers, data) {
  let response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: data
  });
  //console.log(JSON.stringify(response))
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
    padding: 20,
  },
  bananas: {
    width: 100,
    height: 100,
  }
});
