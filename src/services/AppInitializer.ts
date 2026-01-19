import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

/**
 * 初始化应用
 */
export const initializeApp = () => {
  // 初始化推送通知
  initializePushNotifications();

  // 其他初始化逻辑
  console.log('App initialized on platform:', Platform.OS);
};

/**
 * 初始化推送通知
 */
const initializePushNotifications = () => {
  PushNotification.configure({
    // 接收到推送通知时触发（前台）
    onRegister: function (token) {
      console.log('Push token:', token);
      // TODO: 将 token 发送到服务器
    },

    // 接收到推送通知时触发
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // iOS 需要调用 finish
      notification.finish(PushNotification.FetchResult.NoData);
    },

    // 获取初始通知（应用从通知启动时）
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },

    // Android 特定配置
    senderID: 'YOUR_SENDER_ID', // GCM Sender ID (HarmonyOS 需要配置)
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'harmony',
  });

  // 创建通知频道（Android/HarmonyOS）
  if (Platform.OS === 'harmony' || Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'labx-default',
        channelName: 'LabX Notifications',
        channelDescription: 'LabX app notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }
};

/**
 * 显示本地通知
 */
export const showLocalNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: 'labx-default',
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};
