import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Image } from 'react-native';
import * as FileSystem from "expo-file-system";
import * as Google from "expo-auth-session/providers/google";

const googleDriveSimpleUploadEndpoint = "https://www.googleapis.com/upload/drive/v3/files?uploadType=media"
const googleDriveUpdateFileMetadataEndpoint = "https://www.googleapis.com/drive/v3/files/fileId"
const computerMusicPath = "C:\\Users\\15107\\Music\\iTunes\\iTunes Media\\Music\\"

const productionRedirectUri = "exp://exp.host/@raidsrc/m3u-uploading-app"

export default function App() {
  const [m3uFiles, setM3uFiles] = React.useState([])
  const [debugUploadText, setDebugUploadText] = React.useState("")
  const [uploadedText, setUploadedText] = React.useState("")
  const [showGoogleLoginResponse, setShowGoogleLoginResponse] = React.useState(false)
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
    <ScrollView style={styles.parentContainer}>
      <StatusBar />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Ray's Personal Phone-To-Computer .m3u File Synchronizer</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.bananas} source={require("./assets/eighth_notes_icon.png")} />
        <Image style={styles.bananas} source={{ uri: "https://m.media-amazon.com/images/I/61fZ+YAYGaL._SL1500_.jpg" }} />
        <Image style={styles.bananas} source={require("./assets/eighth_notes_icon.png")} />
      </View>
      <View style={styles.container}>

        <Button title="click me to fetch playlists" onPress={() => {
          let m3uFilesPromise = fetch_m3u()
          m3uFilesPromise.then((m3u) => {
            setM3uFiles(m3u)
          }).catch((err) => {
            console.error(err)
          })
        }} />
        <Text>The .m3u files found in the directory of your choosing will be printed below.</Text>
        <Text>{returnM3uFilesMoreAttractively(m3uFiles)}</Text>
      </View>
      <View style={styles.container}>
        <Button
          disabled={!request}
          title="click me to log into google"
          onPress={() => {
            promptAsync({ productionRedirectUri });
            setShowGoogleLoginResponse(true)
          }}
        />
        <Text>{showGoogleLoginResponse ? JSON.stringify(Object.keys(response)[0]) + ": " + JSON.stringify(response.type) : ""}</Text>
      </View>
      <View style={styles.container}>
        <Button title="click me to upload to google drive" onPress={() => {
          handleUploadingM3uToGoogleDrive(response.authentication.accessToken, m3uFiles, setUploadedText)
        }}></Button>
        {/* <Button title="test m3u phone to computer filepath conversion" onPress={() => {
        let test1 = getContentsOfM3uFiles(m3uFiles)
      }}></Button> */}
        <Text>{uploadedText}</Text>
        {/* <Text>debuggery text goes here</Text> */}
        {/* <Text>{debugUploadText}</Text> */}
      </View>
      <View style={styles.bottomContainer}>
        <Button title="clear text" onPress={() => {
          setUploadedText("")
          setM3uFiles([])
          setShowGoogleLoginResponse(false)
        }}></Button>
      </View>
    </ScrollView>
  );
}

function getPlaylistName(m3uFilePath) {
  // find last occurrence of '/', substring from then on is our playlist name
  let decodedM3uFilePath = decodeURIComponent(m3uFilePath)
  return decodedM3uFilePath.substring(decodedM3uFilePath.lastIndexOf("/") + 1)
}

function returnM3uFilesMoreAttractively(m3uList) {
  let m3uFilesString = ""
  m3uList.forEach(m3u => {
    m3uFilesString += decodeURIComponent(m3u)
    m3uFilesString += "\n"
  })
  return m3uFilesString
}

/**
 * 
 * @param {*} m3uPhone a string containing the contents of an m3u file. in this m3u file are paths pointing to locations of music files on my phone.
 * @returns the same string, mostly, but suitable for importing into itunes on my computer. meaning it contains paths to music files on my computer
 */
function generateComputerMusicPaths(m3uPhone) {
  let splitM3uPhone = m3uPhone.split("\n")
  let m3uComputer = "#EXTM3U\n"
  splitM3uPhone.filter(line => !line.includes("#")).forEach((line) => {
    let searchRegex = /\//g
    let newLine = line.replace(searchRegex, "\\")
    m3uComputer += computerMusicPath
    m3uComputer += newLine
    m3uComputer += "\n"
  })
  return m3uComputer
}

/**
 * takes a list of paths to m3u files and returns an object with keys that are the paths of the 
 * files and values that are the contents of each file in plaintext
 */
async function getContentsOfM3uFiles(m3uFilePaths) {
  let totalM3uContentsObject = {}
  let index = 0
  while (index < m3uFilePaths.length) {
    let path = m3uFilePaths[index]
    let m3uContents = await FileSystem.readAsStringAsync(path)
    totalM3uContentsObject[path] = generateComputerMusicPaths(m3uContents)
    index++
  }
  return totalM3uContentsObject
}

/**
 * for each m3u file found:
 * use the paths we got to acquire the raw text of the file 
 * put that raw text into the body of an upload to google drive, get back the id in the response 
 * use that id to name the file appropriately 
 */

async function handleUploadingM3uToGoogleDrive(accessToken, m3uFiles, setUploadedText) {
  const m3uFilesContentsObject = await getContentsOfM3uFiles(m3uFiles) // returns an object 
  const headersForPost = {
    'Content-Type': 'text/plain',
    'Authorization': "Bearer " + accessToken,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  }
  const headersForPatch = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + accessToken,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  }
  for (let index = 0; index < Object.keys(m3uFilesContentsObject).length; index++) { // loop through each entry in the m3u files object
    index === 0 ? setUploadedText("Uploading initiated.") : ""
    let response = await postRequest(googleDriveSimpleUploadEndpoint, headersForPost, m3uFilesContentsObject[m3uFiles[index]]) // post request to upload the m3u file with no metadata
    let responseBody = await response.json() // this gets you the response body!
    let fileId = responseBody.id
    let updateEndpoint = googleDriveUpdateFileMetadataEndpoint + "?fileId=" + fileId // i should probably adopt some kind of abstraction for my parameters 
    let fileMetadata = {
      "name": getPlaylistName(m3uFiles[index]),
      "description": "Uploaded from Ray's Personal Phone-To-Computer .m3u File Synchronizer",
    }
    let response2 = await patchRequest(updateEndpoint, headersForPatch, JSON.stringify(fileMetadata))
    let response2Body = await response2.json()
    console.log(response2Body)
    setUploadedText(old => old + "\nUploaded " + fileMetadata.name + ".")
  }
  setUploadedText(old => old + "\nSuccessfully uploaded all your playlists.")
}

async function postRequest(url, headers, data) {
  let response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: data
  });
  return response;
}

async function patchRequest(url, headers, data) {
  let response = await fetch(url, {
    method: 'PATCH',
    headers: headers,
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
      if (uri.includes(".m3u")) {
        m3uFileURIs.push(uri)
      }
    })
    //alert(`m3u files inside ${uri}:\n\n ${m3uFileURIs}`);
    return m3uFileURIs
  } else {
    console.error("permissions to access the file system not granted. bummer")
    return []
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  container: {
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  bottomContainer: {
    marginBottom: 150
  },
  bananas: {
    width: 100,
    height: 100,
  },
  notes: {
    width: 80,
    height: 80,
  },
  titleText: {
    fontSize: 20,
    textAlign: "center"
  },
  titleContainer: {
    padding: 20,
    marginBottom: 20
  }
});
