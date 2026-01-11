import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>AI 创意爱好者</Text>
          <Text style={styles.email}>user@example.com</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>作品</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>点赞</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuText}>我的作品</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❤️</Text>
            <Text style={styles.menuText}>我的点赞</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>我的收藏</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>设置</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>关于</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>关于此应用</Text>
          <Text style={styles.aboutText}>
            这是一个用于展示和分享 AI 创意作品的平台。您可以浏览各种由 AI
            生成的艺术作品，上传自己的创作，并与其他创作者交流。
          </Text>
          <Text style={styles.aboutText}>技术栈：</Text>
          <Text style={styles.aboutText}>• Expo React Native</Text>
          <Text style={styles.aboutText}>• Supabase</Text>
          <Text style={styles.aboutText}>• TypeScript</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  menuArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  about: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
});
