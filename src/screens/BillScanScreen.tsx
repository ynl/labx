import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';

const BillScanScreen = ({ navigation, route }: any) => {
  const { mode } = route.params || { mode: 'camera' };
  const cameraRef = useRef<RNCamera>(null);
  const [flashMode, setFlashMode] = useState('off');

  useEffect(() => {
    if (mode === 'picker') {
      pickImageFromGallery();
    }
  }, [mode]);

  const pickImageFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.didCancel) {
        navigation.goBack();
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        console.log('Selected photo:', photo.uri);
        Alert.alert('成功', '已选择照片，正在分析账单...');
        // TODO: 调用 AI 服务分析账单
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
      Alert.alert('错误', '选择照片失败');
      navigation.goBack();
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.8,
          base64: false,
          pauseAfterCapture: true,
        };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Photo taken:', data.uri);
        Alert.alert('成功', '拍照成功，正在分析账单...');
        // TODO: 调用 AI 服务分析账单
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('错误', '拍照失败');
      }
    }
  };

  const toggleFlash = () => {
    setFlashMode((prev) => (prev === 'off' ? 'torch' : 'off'));
  };

  if (mode !== 'camera') {
    return (
      <View style={styles.loadingContainer}>
        <Text>正在加载...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={flashMode}
        androidCameraPermissionOptions={{
          title: '相机权限',
          message: '需要相机权限用于扫描账单',
          buttonPositive: '确定',
          buttonNegative: '取消',
        }}>
        {/* 顶部工具栏 */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>扫描账单</Text>
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <Text style={styles.buttonText}>{flashMode === 'off' ? '💡' : '🔦'}</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* 扫描框 */}
        <View style={styles.scanAreaContainer}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <Text style={styles.hint}>将账单放入框内</Text>
        </View>

        {/* 底部拍照按钮 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#07C160',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  hint: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  bottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});

export default BillScanScreen;
