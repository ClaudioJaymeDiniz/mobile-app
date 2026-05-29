import { Link, Stack } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { THEME } from "@/src/shared/styles/theme"

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Página não encontrada",
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        <Text style={styles.errorCode}>404</Text>

        <Text style={styles.title}>Ops! Caminho errado.</Text>

        <Text style={styles.message}>
          Parece que essa página não existe ou foi movida.
        </Text>

        <Link href="/(app)" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Voltar para o início</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorCode: {
    fontFamily: "Jakarta-Bold",
    fontSize: 72,
    color: THEME.colors.border,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 24,
    textAlign: "center",
    marginTop: 16,
  },
  message: {
    ...THEME.fonts.body,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    ...THEME.fonts.button,
  },
})