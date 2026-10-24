import { useState } from "react";
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from "axios";
import AppButton from './AppButton';
import {colors, cardShadow} from './theme';

export default function LoginScreen({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Mac (MAMP)
    // const LOGIN_URL = "http://10.10.52.212:8888/API/login.php";
    // Windows (Laragon)
    const LOGIN_URL = "http://192.168.1.38/SocialDema/API/login.php";

    function handleLogin() {
        axios
            .post(LOGIN_URL, { username: username, password: password})
            .then((response) => {
                setError('');
                onLogin(response.data.token);
            })
            .catch((err) => {
                setError(err.response?.data?.Error ?? 'Impossibile contattare il server');
            })
            .finally(() => {
                console.log("Request completed");
            });
    }
    return(
        <SafeAreaView style={styles.loginContainer}>
            <Text style={styles.title}>SocialDema</Text>
            <Text style={styles.subtitle}>Accedi per continuare</Text>
            <View style={styles.loginBox}>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <AppButton title="Login" onPress={handleLogin} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 24,
    },
    loginBox: {
        width: '85%',
        padding: 20,
        backgroundColor: colors.card,
        borderRadius: 12,
        ...cardShadow,
    },
    error: {
        color: colors.danger,
        marginBottom: 10,
    },
    input: {
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        color: colors.text,
    },
});
