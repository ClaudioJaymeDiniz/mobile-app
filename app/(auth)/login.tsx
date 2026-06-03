import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

import { THEME } from "@/src/shared/styles/theme"
import { useAuthStore } from "@/src/features/auth/store/useAuthStore"
import { Button } from "@/src/shared/components/Button"
import { CustomInput } from "@/src/shared/components/CustomInput"
import { DeveloperFooter } from "@/src/shared/components/DeveloperFooter"
import { Logo } from "@/src/shared/components/Logo"

export default function LoginScreen() {
  const router = useRouter()
  const { signIn, isLoading } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setError(null)

    if (!email || !password) {
      setError("Informe e-mail e senha.")
      return
    }

    try {
      await signIn({
        email: email.trim(),
        password,
      })

      router.replace("/(app)")
    } catch {
      setError("E-mail ou senha incorretos.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Logo size={34} />
          <Text style={styles.subtitle}>
            Gestão inteligente de formulários
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            label="Senha"
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/recover")}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Entrar"
            loading={isLoading}
            onPress={handleLogin}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.footerLink}
        >
          <Text style={styles.footerText}>
            Novo por aqui?{" "}
            <Text style={styles.footerTextBold}>Criar conta</Text>
          </Text>
        </TouchableOpacity>

        <DeveloperFooter />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 28,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    ...THEME.fonts.body,
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  error: {
    ...THEME.fonts.body,
    color: THEME.colors.error,
    marginBottom: 12,
  },
  footerLink: {
    marginTop: 28,
    alignItems: "center",
  },
  footerText: {
    ...THEME.fonts.body,
    color: THEME.colors.textSecondary,
  },
  footerTextBold: {
    color: THEME.colors.primary,
    fontFamily: "Jakarta-Bold",
  },
})