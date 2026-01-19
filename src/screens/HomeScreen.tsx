import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

interface Experiment {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
}

const experiments: Experiment[] = [
  {
    id: '1',
    title: 'AI账单识别',
    description: '智能识别账单信息并自动分账',
    category: 'AI',
  },
  {
    id: '2',
    title: '创意实验A',
    description: '探索新的交互方式',
    category: '交互',
  },
  {
    id: '3',
    title: '创意实验B',
    description: '测试新功能原型',
    category: '原型',
  },
];

const Tab = createBottomTabNavigator();

// 实验列表页面
const ExperimentsTab = ({ navigation }: any) => {
  const renderExperiment = ({ item }: { item: Experiment }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ExperimentDetail', { experiment: item })}>
      <View style={styles.cardImage}>
        <Text style={styles.cardImagePlaceholder}>🧪</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>实验广场</Text>
      </View>
      <FlatList
        data={experiments}
        renderItem={renderExperiment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

// 扫描页面
const ScanTab = ({ navigation }: any) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.scanTitle}>扫描账单</Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('BillScan', { mode: 'camera' })}>
        <Text style={styles.scanButtonText}>📷 打开相机扫描</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.scanButton, styles.scanButtonSecondary]}
        onPress={() => navigation.navigate('BillScan', { mode: 'picker' })}>
        <Text style={styles.scanButtonText}>🖼️ 从相册选择</Text>
      </TouchableOpacity>
    </View>
  );
};

// 我的页面
const ProfileTab = ({ navigation }: any) => {
  return (
    <View style={styles.centerContainer}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileButtonText}>进入个人中心</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#07C160',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Experiments"
        component={ExperimentsTab}
        options={{
          tabBarLabel: '实验',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🧪</Text>,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanTab}
        options={{
          tabBarLabel: '扫描',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📷</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#07C160',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholder: {
    fontSize: 48,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#07C160',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  scanButton: {
    width: '80%',
    backgroundColor: '#07C160',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  scanButtonSecondary: {
    backgroundColor: '#666',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#07C160',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
