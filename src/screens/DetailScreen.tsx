import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { aiCreationApi } from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { creation } = route.params;
  const [likes, setLikes] = useState(creation.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (liked) return;

    try {
      await aiCreationApi.incrementLikes(creation.id);
      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error('Error liking creation:', error);
      Alert.alert('错误', '点赞失败，请稍后重试');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: creation.image_url }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{creation.title}</Text>

        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>AI模型</Text>
            <Text style={styles.metadataValue}>{creation.ai_model}</Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>分类</Text>
            <Text style={styles.metadataValue}>{creation.category}</Text>
          </View>
          {creation.author && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>作者</Text>
              <Text style={styles.metadataValue}>{creation.author}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>作品描述</Text>
          <Text style={styles.description}>{creation.description}</Text>
        </View>

        {creation.prompt && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI 提示词</Text>
            <View style={styles.promptBox}>
              <Text style={styles.prompt}>{creation.prompt}</Text>
            </View>
          </View>
        )}

        {creation.tags && creation.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>标签</Text>
            <View style={styles.tags}>
              {creation.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.likeButton, liked && styles.likeButtonActive]}
          onPress={handleLike}
          disabled={liked}
        >
          <Text style={styles.likeButtonText}>
            {liked ? '已点赞' : '点赞'} ❤️ {likes}
          </Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            发布于 {new Date(creation.created_at).toLocaleDateString('zh-CN')}
          </Text>
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
  image: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metadataItem: {
    marginRight: 20,
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  promptBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  prompt: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '500',
  },
  likeButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  likeButtonActive: {
    backgroundColor: '#6D28D9',
  },
  likeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  date: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
