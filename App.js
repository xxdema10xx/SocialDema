import {StyleSheet, View} from 'react-native';
import HomeScreen from './ui/HomeScreen';
import LoginScreen from "./ui/LoginScreen";
export default function App() {
  const auth = false;

  if (auth) {
    return (
        <HomeScreen></HomeScreen>
    );
  } else {
  return (
        <LoginScreen></LoginScreen>
  );
  }
}
