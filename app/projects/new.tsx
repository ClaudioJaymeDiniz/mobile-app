import { useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import { createProject } from "@/src/features/projects/api/projectsApi"

const PRESET_COLORS = [
  "#3B82F6",
  "#059669",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#99CCFF",
]

export default function NewProjectScreen() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [themeColor, setThemeColor] = useState("#3B82F6")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setError(null)

    if (!name.trim()) {
      setError("O nome do projeto é obrigatório.")
      return
    }

    setLoading(true)

    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim(),
        themeColor,
        isPublic: false,
      })

      router.replace({
        pathname: "/projects/[id]",
        params: { id: project.id },
      })
    } catch {
      setError("Não foi possível criar o projeto.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Novo projeto" }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar projeto</Text>
        <Text style={styles.subtitle}>
          Organize formulários, membros e respostas em um espaço de trabalho.
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Pesquisa de Campo"
          placeholderTextColor={THEME.colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o objetivo do projeto"
          placeholderTextColor={THEME.colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Cor do tema</Text>

        <View style={styles.colorGrid}>
          {PRESET_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                themeColor === color && styles.colorActive,
              ]}
              onPress={() => setThemeColor(color)}
            >
              {themeColor === color && (
                <Ionicons name="checkmark" size={18} color="#FFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Criar projeto</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 28,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginTop: 8,
    marginBottom: 32,
  },
  label: {
    ...THEME.fonts.body,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textPrimary,
  },
  textArea: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  colorActive: {
    borderWidth: 3,
    borderColor: THEME.colors.textPrimary,
  },
  error: {
    ...THEME.fonts.body,
    color: THEME.colors.error,
    marginBottom: 12,
  },
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    ...THEME.fonts.button,
  },
})