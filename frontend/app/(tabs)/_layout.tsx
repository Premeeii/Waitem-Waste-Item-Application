import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen name="index" options={{ title: 'Items', tabBarIcon: ({ color }) => <TabIcon name="shopping-bag" color={color} /> }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ color }) => <TabIcon name="list-alt" color={color} /> }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories', tabBarIcon: ({ color }) => <TabIcon name="tags" color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: ({ color }) => <TabIcon name="comments" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon name="user" color={color} /> }} />
    </Tabs>
  );
}
