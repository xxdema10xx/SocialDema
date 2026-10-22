import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, Button} from 'react-native';
import InputAndButton from "./ui/InputAndButton";
import Message from "./ui/Message";
import { useState } from "react";
import axios from "axios";

const MESSAGES_URL = "http://10.10.52.212:8888/API/messages.php";

export default function App() {
  //let messages = [{
  const [messages, setMessages] = useState([{
    id: 1,
    text: 'Ciao',
    date: 1779981508,
    name: 'Damiano'
  }, {
    id: 2,
    text: 'Daje',
    date: 1779981508,
    name: 'Francesco'
  },{
    id: 3,
    text: 'NOOOOO!!!',
    date: 1779981508,
    name: 'Lorenzo'
  }, {
    id: 4,
    text: 'Non SObri0!',
    date: 1779981508,
    name: 'Alberto'
  }, {
    id: 5,
    text: 'Che magnata!',
    date: 1779981508,
    name: 'Marco'
  }]);
  function handleDelete (id) {
    setMessages(prev => prev.filter(message => message.id !== id));
  }

  function handlePost(textInput){
    if (!textInput || !textInput.trim()) return;

    setMessages(prev => {
      const nextId = Math.max(...prev.map(m => m.id)) + 1;
      const newMessage = {
        id: nextId,
        name: 'Dema',
        text: textInput.trim(),
        date: Date.now()
      };
      return [newMessage, ...prev];
    });
  }
  function handleEdit (id) {

  }

  async function loadPosts() {
    try {
      const token = process.env.EXPO_PUBLIC_API_TOKEN;
      const response = await axios.get(MESSAGES_URL, {
        headers: token ? {Authorization: "Bearer " + token} : {},
      });
      const apiMessages = Array.isArray(response.data)
        ? response.data
        : response.data.items;

      if (!Array.isArray(apiMessages)) {
        throw new Error("La risposta dell'API non contiene una lista di messaggi");
      }

      setMessages(apiMessages.map((message) => ({
        id: message.id,
        name: message.name ?? message.username ?? "Utente",
        text: message.text ?? message.content ?? message.message ?? "",
        date: message.date ?? message.creation_date ?? message.created_at ?? Date.now(),
      })));
    } catch (error) {
      console.error("Errore durante il caricamento dei messaggi:", error);
    }
  }

  return (
    <View style={styles.container}>

      <View>
        <Text style={styles.textContainer}>Social Network X</Text>
        <Text style={styles.textDeveloper}>Powered by Damiano</Text>
      </View>

      <View style={styles.userRow}>
        <Text style={styles.textUser}>Utente: Dema</Text>
        <View style={styles.textContainer}>
          <Button style={styles.button} onPress={loadPosts} title={"Scarica"} />
        </View>

          <View style={styles.logoutButtonWrapper}>

            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={() => {}}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
      </View>
      <View style={{alignSelf: 'stretch'}}>
        <InputAndButton buttonLabel='Invia' inputLabel='Scrivi qualcosa..' postButton={handlePost} />
      </View>
      <View style={{alignSelf: 'stretch', flex: 1}}>
         <FlatList
           data={messages}
           keyExtractor={(item) => String(item.id)}
           renderItem={({item}) => (
            <Message
                id={item.id}
              username={item.name}
              messageText={item.text}
              timeStamp={item.date}
              editButton={"Modifica"}
              deleteButton={"Elimina"}
              onDelete={() => handleDelete(item.id)}/>
          )}
        />
      </View>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    fontSize: 38,
    color: 'black',
    fontWeight: '500',
  },
  textDeveloper: {
    color:'black',
    fontSize: 20,
    textAlign: 'left',
  },
  textUser: {
    color:'grey',
    fontSize: 20,
    textAlign: 'left',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonWrapper: {
    marginLeft: 110,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  inputAndButtonContainer: {
    width: 100,
  },
});
