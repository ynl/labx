import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const ExperimentDetailScreen = ({ navigation, route }: any) => {
  const { experiment } = route.params;

  const handleStartExperiment = () => {
    if (experiment.id === '1') {
      navigation.navigate('BillScan', { mode: 'camera' });
    } else {
      // 其他实验的处理
      alert('该实验正在开发中...');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{experiment.title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* 实验图片 */}
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>🧪</Text>
        </View>

        {/* 实验信息 */}
        <View style={styles.infoContainer}>
          {/* 分类标签 */}
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{experiment.category}</Text>
          </View>

          {/* 标题 */}
          <Text style={styles.title}>{experiment.title}</Text>

          {/* 描述 */}
          <Text style={styles.description}>{experiment.description}</Text>

          {/* 详细说明 */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>功能特点</Text>
            <Text style={styles.sectionText}>
              • 智能识别账单信息{'\n'}
              • 自动提取商品和金额{'\n'}
              • 支持多人分账{'\n'}
              • 快速导入联系人
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>使用说明</Text>
            <Text style={styles.sectionText}>
              1. 点击"开始体验"按钮{'\n'}
              2. 拍摄或选择账单照片{'\n'}
              3. AI 自动分析账单内容{'\n'}
              4. 查看识别结果并进行分账
            </Text>
          </View>

          {/* 体验按钮 */}
          <TouchableOpacity style={styles.startButton} onPress={handleStartExperiment}>
            <Text style={styles.startButtonText}>开始体验</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    fontSize: 16,
    color: '#07C160',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#07C160',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 80,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 15,
  },
  categoryText: {
    fontSize: 14,
    color: '#07C160',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  detailSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#07C160',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExperimentDetailScreen;
