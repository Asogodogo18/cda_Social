import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "@shopify/restyle";
import { StatusBar } from "expo-status-bar";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";

import theme from "./src/theme";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./src/navigation";
import { RootStack } from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./src/Context";
import { Provider } from "react-redux";
import store from "./src/store/store";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          {/* <Navigation colorScheme={colorScheme} /> */}
          <NavigationContainer>
            <StatusBar />
            <Provider store={store}>
              <UserProvider>
                <MenuProvider>
                  <RootStack />
                </MenuProvider>
              </UserProvider>
            </Provider>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
