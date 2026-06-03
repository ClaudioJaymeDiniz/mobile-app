import { Drawer } from "expo-router/drawer"
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { Text, View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

import { THEME } from "@/src/shared/styles/theme"
import { useAuthStore } from "@/src/features/auth/store/useAuthStore"

function CustomDrawerContent(props: any) {
  const router = useRouter()
  const { user, signOut } = useAuthStore()

  async function handleLogout() {
    await signOut()
    router.replace("/(auth)/login")
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={THEME.colors.primary} />
        </View>

        <Text style={styles.userName}>{user?.name ?? "Usuário"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItem
          label="Painel Principal"
          icon={({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(app)/(tabs)")}
        />

        <DrawerItem
          label="Explorar"
          icon={({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(app)/(tabs)")}
        />

        <DrawerItem
          label="Perfil"
          icon={({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(app)/(tabs)/profile")}
        />
      </View>

      <View style={styles.footer}>
        <DrawerItem
          label="Sair"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  )
}

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: THEME.colors.surface,
          height: 76,
        },
        headerTitleStyle: {
          fontFamily: "Jakarta-Bold",
          fontSize: 18,
        },
        headerTintColor: THEME.colors.textPrimary,
        drawerActiveTintColor: THEME.colors.primary,
        drawerInactiveTintColor: THEME.colors.textSecondary,
        drawerLabelStyle: {
          fontFamily: "Manrope-SemiBold",
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Smart Forms",
        }}
      />
    </Drawer>
  )
  
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${THEME.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontFamily: "Jakarta-Bold",
    fontSize: 18,
    color: THEME.colors.textPrimary,
  },
  userEmail: {
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  drawerItems: {
    flex: 1,
    paddingTop: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingBottom: 16,
  },
})