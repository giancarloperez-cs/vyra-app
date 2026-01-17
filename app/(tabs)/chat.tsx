import { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { sendMessage, saveApiKey, loadApiKey, isConfigured } from '../../services/ai';
import {
  loadAthleteProfile,
  getSportDisplayName,
  AthleteProfile,
} from '../../services/athlete';
import { GradientButton } from '../../components';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const loaded = await loadAthleteProfile();
        setProfile(loaded);

        await loadApiKey();
        setIsLoadingKey(false);

        if (!isConfigured()) {
          setShowApiKeyModal(true);
        }

        // Set initial greeting with personalization
        if (messages.length === 0) {
          const sportsText = loaded.sports.length > 0
            ? loaded.sports.map(s => getSportDisplayName(s.sport)).join(', ')
            : 'various activities';

          setMessages([{
            id: '1',
            text: `Hey ${loaded.firstName || 'there'}! I'm Vrya Coach, your AI fitness partner. I see you're training in ${sportsText}. How can I help you today? I can suggest workouts, answer training questions, or help optimize your performance!`,
            sender: 'ai',
            timestamp: new Date(),
          }]);
        }
      };
      init();
    }, [])
  );

  const handleSaveApiKey = async () => {
    if (apiKeyInput.trim().startsWith('sk-')) {
      try {
        await saveApiKey(apiKeyInput.trim());
        setShowApiKeyModal(false);
        setError(null);
      } catch (err) {
        setError('Failed to save API key. Please try again.');
      }
    } else {
      setError('Please enter a valid OpenAI API key (starts with sk-)');
    }
  };

  const getConversationHistory = () => {
    return messages
      .filter((m) => m.id !== '1')
      .map((m) => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }));
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    if (!isConfigured()) {
      setShowApiKeyModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(userMessage.text, getConversationHistory());

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      {item.sender === 'ai' && (
        <LinearGradient
          colors={Colors.gradients.primary}
          style={styles.aiAvatar}
        >
          <FontAwesome5 name="robot" size={12} color={Colors.background} />
        </LinearGradient>
      )}
      <View style={styles.messageContent}>
        {item.sender === 'ai' && (
          <Text style={styles.aiLabel}>VRYA COACH</Text>
        )}
        <Text
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  const QuickPrompt = ({ text, icon }: { text: string; icon: string }) => (
    <TouchableOpacity
      style={styles.quickPrompt}
      onPress={() => setInputText(text)}
    >
      <FontAwesome5 name={icon} size={14} color={Colors.primary} />
      <Text style={styles.quickPromptText}>{text}</Text>
    </TouchableOpacity>
  );

  if (isLoadingKey) {
    return (
      <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.loadingKeyContainer}>
            <FontAwesome5 name="robot" size={40} color={Colors.primary} />
            <Text style={styles.loadingText}>Initializing Coach...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* API Key Modal */}
        <Modal
          visible={showApiKeyModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => isConfigured() && setShowApiKeyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.modalIcon}
              >
                <FontAwesome5 name="robot" size={28} color={Colors.background} />
              </LinearGradient>

              <Text style={styles.modalTitle}>Setup Vrya Coach</Text>
              <Text style={styles.modalSubtitle}>
                Connect your OpenAI API key to unlock AI-powered coaching
              </Text>

              <TextInput
                style={styles.apiKeyInput}
                placeholder="sk-..."
                placeholderTextColor={Colors.textPlaceholder}
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <GradientButton
                title="Save & Start Chatting"
                onPress={handleSaveApiKey}
                icon="bolt"
                size="large"
              />

              <Text style={styles.modalHint}>
                Get your API key at platform.openai.com
              </Text>
            </View>
          </View>
        </Modal>

        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <LinearGradient
            colors={Colors.gradients.primary}
            style={styles.headerAvatar}
          >
            <FontAwesome5 name="robot" size={20} color={Colors.background} />
          </LinearGradient>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Vrya Coach</Text>
            <Text style={styles.headerStatus}>
              <View style={styles.statusDot} />
              {' '}Online
            </Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowApiKeyModal(true)}
          >
            <FontAwesome5 name="cog" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            messages.length === 1 ? (
              <View style={styles.quickPromptsContainer}>
                <Text style={styles.quickPromptsLabel}>Quick prompts</Text>
                <View style={styles.quickPrompts}>
                  <QuickPrompt text="Create today's workout" icon="dumbbell" />
                  <QuickPrompt text="How can I improve my form?" icon="running" />
                  <QuickPrompt text="Nutrition tips for training" icon="apple-alt" />
                  <QuickPrompt text="Recovery advice" icon="spa" />
                </View>
              </View>
            ) : null
          }
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingBubbleText}>Coach is thinking...</Text>
            </View>
          </View>
        )}

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              placeholderTextColor={Colors.textPlaceholder}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <LinearGradient
                colors={
                  inputText.trim() && !isLoading
                    ? Colors.gradients.primary
                    : [Colors.cardBackground, Colors.cardBackground]
                }
                style={styles.sendButtonGradient}
              >
                <FontAwesome5
                  name="paper-plane"
                  size={16}
                  color={inputText.trim() && !isLoading ? Colors.background : Colors.textMuted}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingKeyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },

  // Chat Header
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerStatus: {
    fontSize: 13,
    color: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Messages
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContent: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textPrimary,
  },
  aiText: {
    color: Colors.textPrimary,
  },

  // Quick Prompts
  quickPromptsContainer: {
    marginTop: 20,
  },
  quickPromptsLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickPromptText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Loading
  loadingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: 42,
  },
  loadingBubbleText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 8,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 15,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {},

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  apiKeyInput: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalHint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
