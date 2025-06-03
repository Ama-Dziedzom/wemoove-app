import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  PanResponder,
  StatusBar
} from 'react-native';
import { MessageSquare, Send, X, Bot, ChevronDown } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const BOTTOM_SHEET_MIN_HEIGHT = 0;
const DRAG_THRESHOLD = 50;

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your travel assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const listRef = useRef<FlatList>(null);
  const lastScrollY = useRef(0);

  // Create pan responder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) { // Only allow dragging down
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_THRESHOLD) {
          // User dragged down past threshold, close the sheet
          closeBottomSheet();
        } else {
          // User didn't drag far enough, snap back to open position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  const openBottomSheet = () => {
    setIsOpen(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeBottomSheet = () => {
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! How can I assist you with your travel plans today?";
    } else if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('reservation')) {
      return "To book a bus ticket, go to the Home tab and enter your destination and travel date. You can then select from available buses and complete your booking.";
    } else if (lowerCaseMessage.includes('cancel')) {
      return "You can cancel your booking from the History tab. Select the booking you want to cancel and tap the Cancel button. Refunds are processed according to our refund policy.";
    } else if (lowerCaseMessage.includes('payment') || lowerCaseMessage.includes('pay')) {
      return "We accept various payment methods including credit/debit cards, mobile money, and bank transfers. You can manage your payment methods in the Profile tab.";
    } else if (lowerCaseMessage.includes('refund')) {
      return "Refunds are processed within 5-7 business days. The refund amount depends on how early you cancel before the departure date.";
    } else if (lowerCaseMessage.includes('luggage') || lowerCaseMessage.includes('baggage')) {
      return "Each passenger is allowed one piece of luggage up to 20kg and one carry-on bag. Additional luggage may incur extra charges.";
    } else if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('support')) {
      return "You can reach our customer support at support@wemoove.com or call us at +1-800-BUS-HELP (800-287-4357).";
    } else {
      return "I'm not sure I understand. Could you please rephrase your question or ask about booking, cancellations, payments, refunds, or luggage policies?";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Effect to scroll to bottom when new messages arrive
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle keyboard appearance
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (listRef.current) {
          listRef.current.scrollToEnd({ animated: true });
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <TouchableOpacity 
          style={[styles.chatButton, { backgroundColor: themeColors.primary }]}
          onPress={openBottomSheet}
        >
          <MessageSquare size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* Bottom sheet chat interface */}
      {isOpen && (
        <Animated.View 
          style={[
            styles.bottomSheet,
            { 
              backgroundColor: themeColors.card,
              transform: [{ translateY }],
              borderTopColor: themeColors.border,
            }
          ]}
        >
          {/* Drag handle */}
          <View 
            {...panResponder.panHandlers}
            style={styles.dragHandleContainer}
          >
            <View style={[styles.dragHandle, { backgroundColor: themeColors.border }]} />
          </View>
          
          {/* Chat header */}
          <View style={[styles.chatHeader, { borderBottomColor: themeColors.border }]}>
            <View style={styles.chatHeaderLeft}>
              <Bot size={20} color={themeColors.primary} />
              <Text style={[styles.chatTitle, { color: themeColors.text }]}>
                Travel Assistant
              </Text>
            </View>
            <TouchableOpacity onPress={closeBottomSheet}>
              <ChevronDown size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Messages list */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[
                styles.messageContainer,
                item.sender === 'user' ? styles.userMessage : styles.botMessage
              ]}>
                <View style={[
                  styles.messageBubble,
                  item.sender === 'user' 
                    ? [styles.userBubble, { backgroundColor: themeColors.primary }]
                    : [styles.botBubble, { backgroundColor: themeColors.card, borderColor: themeColors.border }]
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: item.sender === 'user' ? '#FFFFFF' : themeColors.text }
                  ]}>
                    {item.text}
                  </Text>
                </View>
                <Text style={[styles.timestamp, { color: themeColors.subtext }]}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            )}
          />
          
          {/* Message input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
          >
            <View style={[styles.inputContainer, { borderTopColor: themeColors.border }]}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                  borderColor: themeColors.border
                }]}
                placeholder="Type a message..."
                placeholderTextColor={themeColors.subtext}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: themeColors.primary }]}
                onPress={handleSend}
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_MAX_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  dragHandleContainer: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.5,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatbotWidget;