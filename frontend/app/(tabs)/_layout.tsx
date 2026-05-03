import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#61412A',
      tabBarInactiveTintColor: '#A8A39D',
      tabBarStyle: {
        backgroundColor: '#F8F7F4',
        borderTopColor: '#E0DCD6',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerStyle: {
        backgroundColor: '#F8F7F4',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E0DCD6',
      },
      headerTitleStyle: {
        color: '#3D2C23',
        fontWeight: '700',
      }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />, headerShown: false }} />
      <Tabs.Screen name="listings" options={{ href: null }} />
      <Tabs.Screen name="add" options={{ title: 'Add', tabBarIcon: ({ color }) => <TabIcon name="plus-circle" color={color} />, headerShown: false }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ color }) => <TabIcon name="file-text-o" color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: ({ color }) => <TabIcon name="comments-o" color={color} />, headerShown: false }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon name="user-o" color={color} /> }} />
    </Tabs>
  );
}
