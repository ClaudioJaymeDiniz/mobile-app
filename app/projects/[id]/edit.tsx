import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import {
  archiveProject,
  getProjectById,
  permanentDeleteProject,
  restoreProject,
  updateProject,
} from "@/src/features/projects/api/projectsApi"
import type { Project } from "@/src/features/projects/types/projectTypes"

const PRESET_COLORS = [
  "#3B82F6",
  "#059669",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#99CCFF",
]

export default function EditProjectScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [themeColor, setThemeColor] = useState("#3B82F6")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadProject = useCallback(async () => {
    if (!id) return

    try {
      const data = await getProjectById(id)

      setProject(data)
      setName(data.name)
      setDescription(data.description ?? "")
      setThemeColor(data.themeColor ?? "#3B82F6")
    } finally {
      setLoading(false)
    }
  }, [id])

  useFocusEffect(
    useCallback(() => {
      loadProject()
    }, [loadProject])
  )

  async function handleSave() {
    if (!id || !name.trim()) return

    setSaving(true)

    try {
      await updateProject(id, {
        name: name.trim(),
        description: description.trim(),
        themeColor,
      })

      router.back()
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o projeto.")
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive() {
  if (!id) return

  try {
    await archiveProject(id)

    router.dismissAll()
    router.replace("/(app)/(tabs)")
  } catch {
    Alert.alert("Erro", "Não foi possível arquivar o projeto.")
  }
}

  async function handleRestore() {
    if (!id) return

    try {
      await restoreProject(id)
      await loadProject()
    } catch {
      Alert.alert("Erro", "Não foi possível restaurar o projeto.")
    }
  }

  async function handlePermanentDelete() {
    if (!id) return

    try {
      await permanentDeleteProject(id)
      router.replace("/(app)/(tabs)")
    } catch {
      Alert.alert(
        "Erro",
        "Para excluir definitivamente, o projeto precisa estar arquivado."
      )
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={THEME.colors.primary} />
      </View>
    )
  }

  const isArchived = Boolean(project?.deletedAt)

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: "Configurações",
          headerTintColor: themeColor,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
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

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: themeColor }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Zona de risco</Text>

          {isArchived ? (
            <>
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestore}
              >
                <Text style={styles.restoreButtonText}>Restaurar projeto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handlePermanentDelete}
              >
                <Text style={styles.deleteButtonText}>
                  Excluir definitivamente
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.archiveButton}
              onPress={handleArchive}
            >
              <Text style={styles.archiveButtonText}>Arquivar projeto</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
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
    marginBottom: 24,
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
  saveButton: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    ...THEME.fonts.button,
  },
  dangerZone: {
    marginTop: 36,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 24,
  },
  dangerTitle: {
    fontFamily: "Jakarta-Bold",
    fontSize: 18,
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  archiveButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
  },
  archiveButtonText: {
    fontFamily: "Manrope-SemiBold",
    color: "#F59E0B",
  },
  restoreButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  restoreButtonText: {
    fontFamily: "Manrope-SemiBold",
    color: THEME.colors.primary,
  },
  deleteButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: THEME.colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    ...THEME.fonts.button,
  },
})