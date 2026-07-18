import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { Colors } from './src/utils/constants';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.5 }}>
        {emoji}
      </Text>
    </View>
  );
}

function TabLabel({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? '600' : '400',
        color,
        marginTop: -2,
      }}
    >
      {label}
    </Text>
  );
}

function MainTabs() {
  const { isDark } = useTheme();
  const bg = isDark ? '#000000' : '#F2F2F7';
  const card = isDark ? '#1C1C1E' : '#FFFFFF';
  const active = Colors.primary;
  const inactive = '#8E8E93';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: card,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          tabBarLabel: ({ focused, color }) => <TabLabel label="首页" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
          tabBarLabel: ({ focused, color }) => <TabLabel label="统计" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          tabBarLabel: ({ focused, color }) => <TabLabel label="设置" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function WorkoutDetailScreen({ route, navigation }: any) {
  const { plan } = route.params;
  const { isDark } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;
  const { categoryLabels, difficultyLabels, difficultyColors } = require('./src/data/workouts');

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* 封面 */}
      <View style={{ height: 220, backgroundColor: plan.imageColor, justifyContent: 'flex-end', padding: 24 }}>
        <View style={{ position: 'absolute', top: 48, left: 16, zIndex: 1 }}>
          <Text
            style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
            onPress={() => navigation.goBack()}
          >
            ← 返回
          </Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
          {plan.name}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>{difficultyLabels[plan.difficulty]}</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>{categoryLabels[plan.category]}</Text>
          </View>
        </View>
      </View>

      {/* 信息 */}
      <View style={{ padding: 20 }}>
        <Text style={{ color: themeColors.textSecondary, fontSize: 15, lineHeight: 22, marginBottom: 20 }}>{plan.description}</Text>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
          <View style={{ flex: 1, backgroundColor: themeColors.card, padding: 16, borderRadius: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.primary, marginBottom: 4 }}>{plan.duration}</Text>
            <Text style={{ fontSize: 13, color: themeColors.textSecondary }}>分钟</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: themeColors.card, padding: 16, borderRadius: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.warning, marginBottom: 4 }}>{plan.calories}</Text>
            <Text style={{ fontSize: 13, color: themeColors.textSecondary }}>千卡</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: themeColors.card, padding: 16, borderRadius: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.success, marginBottom: 4 }}>{plan.exercises.length}</Text>
            <Text style={{ fontSize: 13, color: themeColors.textSecondary }}>动作</Text>
          </View>
        </View>

        <Text style={{ color: themeColors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 12 }}>动作列表</Text>
        {plan.exercises.map((ex: any, i: number) => (
          <View key={ex.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: themeColors.separator }}>
            <Text style={{ fontSize: 15, color: themeColors.textSecondary, width: 28, fontWeight: '600' }}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: themeColors.textPrimary }}>{ex.name}</Text>
              <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2 }}>{ex.duration}秒 · {ex.restDuration}秒休息</Text>
            </View>
          </View>
        ))}

        {/* 开始按钮 */}
        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <View
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 16,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}
              onPress={() => navigation.navigate('Workout', { plan })}
            >
              开始训练
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function NavigationContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
          <Stack.Screen
            name="Workout"
            component={WorkoutScreen}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContent />
    </ThemeProvider>
  );
}
