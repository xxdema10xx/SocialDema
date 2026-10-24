import {View, Text, StyleSheet} from 'react-native';
import AppButton from './AppButton';
import {colors, cardShadow} from './theme';

export default function Message({username, messageText, timeStamp, editButton, deleteButton, onDelete}) {
    const dateObj = timeStamp instanceof Date ? timeStamp : new Date(timeStamp > 1e12 ? timeStamp : timeStamp * 1000);
    return (
        <View style={styles.card}>
            <Text style={styles.username}>{username}</Text>

            <Text style={styles.text}>{messageText}</Text>

            <View style={styles.footer}>
                <View style={styles.actions}>
                    <AppButton title={editButton} variant="text" />
                    <AppButton title={deleteButton} variant="danger" onPress={() => onDelete && onDelete()} />
                </View>
                <Text style={styles.date}>{dateObj.toLocaleString()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        ...cardShadow,
    },
    username: {
        marginBottom: 6,
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    date: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    text: {
        fontSize: 15,
        color: colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    actions: {
        flexDirection: 'row',
        marginLeft: -8,
    },
});
