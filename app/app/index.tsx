import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const [url, setUrl] = useState("https://google.com"); // Default URL
  const [injectedJavaScript, setInjectedJavaScript] = useState(`
    // Your JavaScript to inject accessibility tags here
    document.querySelectorAll('img').forEach(img => {
      img.setAttribute('role', 'img');
      img.setAttribute('aria-label', img.alt || 'Image');
    });
  `);

  const handleNavigation = () => {
    // You can add more logic here if needed
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        injectedJavaScript={injectedJavaScript}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("HTTP error: ", nativeEvent);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
      />
      <Button title="Navigate" onPress={handleNavigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
});
