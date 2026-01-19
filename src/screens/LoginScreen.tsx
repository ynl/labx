import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const { login, sendVerificationCode } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('错误', '请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    const success = await sendVerificationCode(email);
    setIsLoading(false);

    if (success) {
      setIsCodeSent(true);
      setCountdown(60);

      // 倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert('成功', '验证码已发送到您的邮箱');
    } else {
      Alert.alert('错误', '发送验证码失败，请稍后重试');
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('错误', '请输入6位验证码');
      return;
    }

    setIsLoading(true);
    const success = await login(email, code);
    setIsLoading(false);

    if (success) {
      navigation.replace('Home');
    } else {
      Alert.alert('错误', '验证码错误或已过期');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>LabX</Text>
          <Text style={styles.subtitle}>AI 创意实验平台</Text>
        </View>

        {/* 表单 */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="请输入您的邮箱"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isCodeSent}
          />

          {isCodeSent && (
            <TextInput
              style={styles.input}
              placeholder="请输入验证码"
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || (isCodeSent && countdown > 0)) && styles.buttonDisabled,
            ]}
            onPress={isCodeSent ? handleVerifyCode : handleSendCode}
            disabled={isLoading || (isCodeSent && countdown > 0)}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isCodeSent
                  ? '验证登录'
                  : countdown > 0
                  ? `${countdown}s`
                  : '发送验证码'}
              </Text>
            )}
          </TouchableOpacity>

          {isCodeSent && (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setIsCodeSent(false);
                setCode('');
              }}>
              <Text style={styles.resendText}>重新输入邮箱</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#07C160',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  button: {
    backgroundColor: '#07C160',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#07C160',
    fontSize: 14,
  },
});

export default LoginScreen;
