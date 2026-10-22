import {View, Text, StyleSheet, Button} from 'react-native';

export default function Message({username, messageText, timeStamp, editButton, deleteButton, onDelete}) {
    const dateObj = timeStamp instanceof Date ? timeStamp : new Date(timeStamp > 1e12 ? timeStamp : timeStamp * 1000);
    return (
        <View style={styles.messageContainer}>
            <View style={styles.message}>
                <View style={styles.borderMessage}>
                    <Text>{username}</Text>
                </View>
                <View style={styles.borderMessage}>
                    <Text>{messageText}</Text>
                </View>
                <View>
                    <Text style={styles.borderMessage}>{dateObj.toLocaleString()}</Text>
                </View>

                <View style={{gap: 10, flexDirection: 'row', marginTop: 3}}>
                    <Button style={styles.messageContainer} title={editButton} color="green"/>
                    <Button style={styles.messageContainer} title={deleteButton} onPress={() => onDelete && onDelete()} color="red"/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        backgroundColor: 'lightblue',
        padding: 5,
        borderWidth: 3,
        borderColor: 'lightblue',
        borderRadius: 4,
    },
    message: {
        backgroundColor: 'white',
        padding: 5,
        borderWidth: 3,
        borderColor: 'lightblue',
        marginBottom: 3,
    },
    borderMessage:{
        borderColor:'lightblue',
        borderBottomWidth: 3,
        borderRadius: 4,
        paddingBottom: 3,
    },
});