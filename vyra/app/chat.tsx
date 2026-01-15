import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';

type Message = { id: string; text: string; sender: 'user' | 'ai'; };

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello Alex! I'm VyraCoach. Ready to crush your 5K goal?", sender: 'ai' }
  ]);
  
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;
    const newMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Great work! Keep that streak alive.", 
        sender: 'ai' 
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'VyraCoach', headerBackTitle: 'Back' }} />
      <View style={styles.innerContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
            </View>
          )}
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor="#666" value={inputText} onChangeText={setInputText} />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <FontAwesome name="arrow-up" size={20} color="#0a0f1c" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1c' },
  innerContainer: { flex: 1, justifyContent: 'space-between' },
  messageBubble: { padding: 15, borderRadius: 20, marginBottom: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#00e0ff', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#162032', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#2d3b55' },
  userText: { color: '#0a0f1c', fontWeight: '600' },
  aiText: { color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#0a0f1c', borderTopWidth: 1, borderTopColor: '#162032', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#162032', color: '#fff', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, marginRight: 10, borderWidth: 1, borderColor: '#2d3b55' },
  sendButton: { backgroundColor: '#00e0ff', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
});