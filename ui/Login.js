import { useState } from "react";
import {View, Text, StyleSheet, Button} from 'react-native';

export default function Login({id, username, password, onLogin}) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
