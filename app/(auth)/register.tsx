import { useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import { useAuthStore } from "@/src/features/auth/store/useAuthStore"
import { Button } from "@/src/shared/components/Button"
import { CustomInput } from "@/src/shared/components/CustomInput"
import { Logo } from "@/src/shared/components/Logo"

export default function RegisterScreen() {
  const router = useRouter()
  const { signUp, isLoading } = useAuthStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleRegister() {
    setError(null)

    if (!name || !email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      router.replace("/(app)")
    } catch {
      setError("Não foi possível criar sua conta.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
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

          <Logo size={30} />

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Cadastre-se para começar a criar projetos e formulários.
          </Text>

          <CustomInput
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
          />

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

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Criar conta"
            loading={isLoading}
            onPress={handleRegister}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.footerLink}
          >
            <Text style={styles.footerText}>
              Já tem conta?{" "}
              <Text style={styles.footerTextBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 28,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 24,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 28,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginBottom: 32,
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