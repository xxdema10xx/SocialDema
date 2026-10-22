import {View, TextInput, Button, StyleSheet} from 'react-native';
import React from "react";
import { useState } from "react";
export default function InputAndButton({inputLabel, buttonLabel, postButton}) {
    const [userText, setUserText] = useState('');

    const handleSend = () => {
        if (postButton && userText.trim()) {
            postButton(userText.trim());
            setUserText('');
        }
    };

    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{width: '100%', paddingHorizontal: 8}}>
                <TextInput placeholder={inputLabel} style={styles.textInput} value={userText} onChangeText={setUserText} />
                <Button style={styles.buttonInvia} title={buttonLabel} onPress={handleSend} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: 'white',
        padding: 8,
        borderWidth: 3,
        borderColor: 'lightblue',
        borderRadius: 4,
        marginBottom: 3,
        margin: 8,
    },
    buttonInvia: {
        width: '100%',
        padding: 8,
        borderWidth: 3,
        borderColor: 'lightblue',
        borderRadius: 4,
        marginBottom: 3,
    }
});