import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { aiCreationApi } from '../lib/api';
import { CATEGORIES, AI_MODELS } from '../constants/categories';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('art');
  const [aiModel, setAiModel] = useState('Midjourney');
  const [prompt, setPrompt] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('权限', '需要相册权限才能上传图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri || !title || !description) {
      Alert.alert('提示', '请填写标题、描述并选择图片');
      return;
    }

    try {
      setLoading(true);

      // In a real app, you would upload the image to Supabase Storage first
      // and get the public URL. For this demo, we'll use the selected image URI
      // or you could use a placeholder image URL
      const imageUrl = imageUri.startsWith('http')
        ? imageUri
        : 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead';

      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await aiCreationApi.create({
        title,
        description,
        image_url: imageUrl,
        category,
        tags: tagsArray,
        ai_model: aiModel,
        prompt: prompt || undefined,
        author: author || undefined,
      });

      Alert.alert('成功', '作品已上传！', [
        {
          text: '确定',
          onPress: () => {
            // Reset form
            setImageUri('');
            setTitle('');
            setDescription('');
            setPrompt('');
            setAuthor('');
            setTags('');
          },
        },
      ]);
    } catch (error) {
      console.error('Error uploading creation:', error);
      Alert.alert('错误', '上传失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>上传 AI 创意作品</Text>

        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <Text style={styles.imagePickerIcon}>📷</Text>
              <Text style={styles.imagePickerText}>点击选择图片</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>标题 *</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入作品标题"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>描述 *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请描述你的作品"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>分类</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryOption,
                  category === cat.id && styles.categoryOptionActive,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryOptionText,
                    category === cat.id && styles.categoryOptionTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Model */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>AI 模型</Text>
          <View style={styles.modelGrid}>
            {AI_MODELS.map((model) => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.modelOption,
                  aiModel === model && styles.modelOptionActive,
                ]}
                onPress={() => setAiModel(model)}
              >
                <Text
                  style={[
                    styles.modelOptionText,
                    aiModel === model && styles.modelOptionTextActive,
                  ]}
                >
                  {model}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prompt */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>提示词 (可选)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="输入用于生成此作品的 AI 提示词"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Author */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>作者 (可选)</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入作者名称"
            value={author}
            onChangeText={setAuthor}
          />
        </View>

        {/* Tags */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>标签 (可选)</Text>
          <TextInput
            style={styles.input}
            placeholder="使用逗号分隔，如: 科幻, 未来, 城市"
            value={tags}
            onChangeText={setTags}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>上传作品</Text>
          )}
        </TouchableOpacity>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  imagePicker: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  imagePickerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryOptionActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  categoryOptionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryOptionTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  modelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modelOptionActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  modelOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modelOptionTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
