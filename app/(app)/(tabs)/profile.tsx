import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router"

import { THEME } from "@/src/shared/styles/theme"
import { useAuthStore } from "@/src/features/auth/store/useAuthStore"

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()

  async function handleLogout() {
    await signOut()
    router.replace("/(auth)/login")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 24,
  },
  title: {
    ...THEME.fonts.title,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginTop: 8,
  },
  button: {
    marginTop: 32,
    height: 52,
    borderRadius: 14,
    backgroundColor: THEME.colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...THEME.fonts.button,
  },
})