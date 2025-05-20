import React, { createContext, useContext, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View,
    StyleProp,
    ViewStyle,
} from 'react-native';

type ToastType = 'success' | 'error' | 'info';

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const [visible, setVisible] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-30)).current;

    const showToast = (msg: string, toastType: ToastType = 'info') => {
        setMessage(msg);
        setType(toastType);
        setVisible(true);

        opacity.setValue(0);
        translateY.setValue(30);

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: -30,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start(() => setVisible(false));
            }, 3000);
        });
    };

    const getToastStyle = (): StyleProp<ViewStyle> => {
        switch (type) {
            case 'success':
                return { backgroundColor: '#4CAF50' };
            case 'error':
                return { backgroundColor: '#f44336' };
            case 'info':
            default:
                return { backgroundColor: '#6a4e3b' };
        }
    };

    const getEmoji = (): string => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.toast,
                        getToastStyle(),
                        { opacity, transform: [{ translateY }] },
                    ]}
                >
                    <Text style={styles.toastText}>
                        {getEmoji()} {message}
                    </Text>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 1000,
    },
    toastText: {
        color: '#fff',
        fontSize: 16,
    },
});
