import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

import { THEME } from "@/src/shared/styles/theme"
import { Container } from "@/src/shared/components/Container"
import FormEditor  from "@/src/features/forms/components/FormEditor"
import { createForm } from "@/src/features/forms/api/formsApi"
import type { FormField } from "@/src/features/forms/types/formTypes"

export default function NewFormScreen() {
  const router = useRouter()
  const { projectId, color } = useLocalSearchParams<{
    projectId: string
    color?: string
  }>()

  const projectColor = color || THEME.colors.primary

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!projectId) {
      Alert.alert("Erro", "Projeto não informado.")
      return
    }

    if (!title.trim() || fields.length === 0) {
      Alert.alert("Aviso", "Preencha o título e adicione campos.")
      return
    }

    setLoading(true)

    try {
      const form = await createForm({
        title: title.trim(),
        description: description.trim(),
        isPublic,
        projectId,
        structure: fields,
      })

      Alert.alert("Sucesso", "Formulário publicado!")

      router.replace({
        pathname: "/forms/[id]",
        params: {
          id: form.id,
        },
      })
    } catch {
      Alert.alert("Erro", "Falha ao salvar formulário.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Novo formulário" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Container>
            <FormEditor
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              fields={fields}
              setFields={setFields}
              accentColor={projectColor}
            />

            <View style={styles.publicBox}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.publicTitle}>Formulário público</Text>
                <Text style={styles.publicSubtitle}>
                  Se ativado, usuários fora do projeto podem responder.
                </Text>
              </View>

              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ true: `${projectColor}88` }}
                thumbColor={isPublic ? projectColor : "#F4F4F5"}
              />
            </View>
          </Container>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: projectColor,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>PUBLICAR FORMULÁRIO</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 120,
  },
  publicBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: THEME.colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  publicTitle: {
    color: THEME.colors.textPrimary,
    fontFamily: "Jakarta-Bold",
    fontSize: 14,
  },
  publicSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Manrope-Regular",
  },
  footer: {
    padding: 20,
    backgroundColor: THEME.colors.background,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  saveButton: {
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontFamily: "Jakarta-Bold",
    fontSize: 14,
  },
})