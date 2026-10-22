import {StyleSheet, View} from 'react-native';
import HomeScreen from './ui/HomeScreen';

export default function App() {
  return (
    <View style={styles.appContainer}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});
