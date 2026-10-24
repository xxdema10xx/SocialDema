import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import HomeScreen from './ui/HomeScreen';
import LoginScreen from "./ui/LoginScreen";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getValueFor('token')
        .then(result => setToken(result))
        .finally(() => setLoading(false));
  }, []);

  async function handleLogin(newToken) {
    await save('token', newToken);
    setToken(newToken);
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
  }

  if (loading) {
    return null;
  }

  if (token) {
    return (
        <HomeScreen token={token} onLogout={handleLogout}></HomeScreen>
    );
  } else {
    return (
        <LoginScreen onLogin={handleLogin}></LoginScreen>
    );
  }
}
