import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import { recoverPassword } from "@/src/features/auth/api/authApi"
import { Button } from "@/src/shared/components/Button"
import { CustomInput } from "@/src/shared/components/CustomInput"

export default function RecoverPasswordScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRecover() {
    setError(null)
    setMessage(null)

    if (!email.includes("@")) {
      setError("Informe um e-mail válido.")
      return
    }

    setLoading(true)

    try {
      await recoverPassword(email.trim())

      setMessage(
        "Se este e-mail estiver cadastrado, você receberá as instruções."
      )
    } catch {
      setError("Não foi possível processar a solicitação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={THEME.colors.primary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail para receber as instruções de recuperação.
        </Text>

        <CustomInput
          label="E-mail"
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={error}
        />

        {message && <Text style={styles.message}>{message}</Text>}

        <Button
          title="Enviar link"
          loading={loading}
          onPress={handleRecover}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 28,
  },
  backButton: {
    marginTop: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginBottom: 32,
  },
  message: {
    ...THEME.fonts.body,
    color: THEME.colors.primary,
    marginBottom: 12,
  },
})