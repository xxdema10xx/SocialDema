import {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import AppButton from './AppButton';
import {colors, cardShadow} from './theme';

export default function Message({id, username, messageText, timeStamp, editButton, deleteButton, onDelete, onEdit}) {
    const dateObj = new Date(timeStamp * 1000);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(messageText);

    function saveEdit() {
        onEdit(editedText);
        setIsEditing(false);
    }

    return (
        <View style={styles.card}>
            <Text style={styles.username}>{username} · #{id}</Text>

            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={editedText}
                    onChangeText={setEditedText}
                    multiline
                    autoFocus
                />
            ) : (
                <Text style={styles.text}>{messageText}</Text>
            )}

            <View style={styles.footer}>
                <View style={styles.actions}>
                    {isEditing ? (
                        <>
                            <AppButton title="Salva" variant="text" onPress={saveEdit} />
                            <AppButton title="Annulla" variant="danger" onPress={() => setIsEditing(false)} />
                        </>
                    ) : (
                        <>
                            <AppButton title={editButton} variant="text" onPress={() => setIsEditing(true)} />
                            <AppButton title={deleteButton} variant="danger" onPress={onDelete} />
                        </>
                    )}
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
    input: {
        fontSize: 15,
        color: colors.text,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 8,
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
