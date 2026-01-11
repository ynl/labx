import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types/navigation';
import { AICreation } from '../types/database';
import { aiCreationApi } from '../lib/api';
import { CATEGORIES } from '../constants/categories';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [creations, setCreations] = useState<AICreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'likes'>('created_at');

  useEffect(() => {
    loadCreations();
  }, [selectedCategory, sortBy]);

  const loadCreations = async () => {
    try {
      setLoading(true);
      const data = await aiCreationApi.getAll(selectedCategory, sortBy);
      setCreations(data);
    } catch (error) {
      console.error('Error loading creations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCreations();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const data = await aiCreationApi.search(searchQuery);
        setCreations(data);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadCreations();
    }
  };

  const renderCreationItem = ({ item }: { item: AICreation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { creation: item })}
    >
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.metadata}>
          <Text style={styles.model}>{item.ai_model}</Text>
          <View style={styles.likes}>
            <Text style={styles.likesText}>❤️ {item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索 AI 创意作品..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'created_at' && styles.sortButtonActive]}
          onPress={() => setSortBy('created_at')}
        >
          <Text style={[styles.sortText, sortBy === 'created_at' && styles.sortTextActive]}>
            最新
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'likes' && styles.sortButtonActive]}
          onPress={() => setSortBy('likes')}
        >
          <Text style={[styles.sortText, sortBy === 'likes' && styles.sortTextActive]}>
            最热
          </Text>
        </TouchableOpacity>
      </View>

      {/* Creations List */}
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
      ) : (
        <FlatList
          data={creations}
          renderItem={renderCreationItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8B5CF6']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  categories: {
    backgroundColor: '#FFFFFF',
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  sortButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sortTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '48%',
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  model: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
