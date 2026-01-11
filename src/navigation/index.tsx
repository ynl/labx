import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types/navigation';

// Screens
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'AI创意',
          tabBarLabel: '首页',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          title: '上传作品',
          tabBarLabel: '上传',
          tabBarIcon: ({ color }) => <TabIcon icon="➕" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return <span style={{ fontSize: 24 }}>{icon}</span>;
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: '作品详情',
            headerStyle: {
              backgroundColor: '#8B5CF6',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
