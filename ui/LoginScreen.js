import { useState } from "react";
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Mac (MAMP)
    // const LOGIN_URL = "http://10.10.52.212:8888/API/login.php";
    // Windows (Laragon)
    const LOGIN_URL = "http://192.168.1.38/SocialDema/API/login.php";

    function handleLogin() {
        axios
            .post(LOGIN_URL, { username: username, password: password})
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                console.log("Request completed");
            });
    }
    return(
        <View style={styles.loginContainer}>
            <View style={styles.loginBox}>
                <Text>Username:</Text>
                <TextInput value={username} onChangeText={setUsername} style={styles.input} />
                <Text>Password:</Text>
                <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                <Button title="Login" color="blue" onPress={handleLogin} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
    },
    loginBox: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
