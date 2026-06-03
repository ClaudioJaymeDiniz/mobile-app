import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import * as Crypto from "expo-crypto"

import { THEME } from "@/src/shared/styles/theme"
import { Button } from "@/src/shared/components/Button"
import { Container } from "@/src/shared/components/Container"
import { CustomInput } from "@/src/shared/components/CustomInput"
import { getFormById } from "@/src/features/forms/api/formsApi"
import type { Form, FormField } from "@/src/features/forms/types/formTypes"
import { createSubmission } from "@/src/features/submissions/api/submissionsApi"

import { Image } from "react-native"

import {
  getImagePreviewUri,
  pickAndPersistImage,
  uploadLocalImageToCloudinary,
} from "@/src/features/forms/services/formImage"

export default function AnswerFormScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const loadForm = useCallback(async () => {
    if (!id) return

    try {
      const data = await getFormById(id)
      setForm(data)

      const initial: Record<string, any> = {}
      data.structure.forEach((field) => {
        const key = field.fieldId || field.label
        initial[key] = field.type === "checkbox" ? [] : ""
      })

      setResponses(initial)
    } catch {
      Alert.alert("Erro", "Formulário não encontrado.")
      router.back()
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useFocusEffect(
    useCallback(() => {
      loadForm()
    }, [loadForm])
  )

  function setValue(field: FormField, value: any) {
    const key = field.fieldId || field.label
    setResponses((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function getValue(field: FormField) {
    const key = field.fieldId || field.label
    return responses[key]
  }

  function validateRequired() {
    const missing = form?.structure.find((field) => {
      if (!field.required) return false

      const value = getValue(field)

      if (Array.isArray(value)) return value.length === 0

      return value === null || value === undefined || String(value).trim() === ""
    })

    if (missing) {
      Alert.alert("Campo obrigatório", `Preencha: ${missing.label}`)
      return false
    }

    return true
  }

  async function handleSubmit() {
  if (!id || !form) return

  if (!validateRequired()) return

  setSending(true)

  try {
    const normalizedData: Record<string, any> = {}

    for (const field of form.structure) {
      const key = field.fieldId || field.label
      let value = responses[key]

      if (
        field.type === "image" &&
        value &&
        typeof value === "object"
      ) {
        value = await uploadLocalImageToCloudinary(
          value,
          "submissions"
        )
      }

      normalizedData[key] = value
    }

    await createSubmission({
      id: Crypto.randomUUID(),
      formId: id,
      formData: normalizedData,
    })

    Alert.alert("Sucesso", "Resposta enviada com sucesso.", [
      {
        text: "OK",
        onPress: () =>
          router.replace({
            pathname: "/forms/[id]",
            params: { id },
          }),
      },
    ])
  } catch (error: any) {
    const message =
      error.response?.data?.detail?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Não foi possível enviar a resposta."

    Alert.alert("Erro", String(message))
  } finally {
    setSending(false)
  }
}

  function renderField(field: FormField) {
  const value = getValue(field)

  if (field.type === "image") {
    const previewUri = getImagePreviewUri(value)

    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{field.label}</Text>

        {previewUri ? (
          <>
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
            />

            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setValue(field, null)}
            >
              <Text style={styles.removeImageText}>Remover imagem</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={async () => {
              try {
                const image = await pickAndPersistImage()

                if (image) {
                  setValue(field, image)
                }
              } catch {
                Alert.alert("Erro", "Não foi possível selecionar a imagem.")
              }
            }}
          >
            <Ionicons
              name="image-outline"
              size={24}
              color={THEME.colors.primary}
            />

            <Text style={styles.imagePickerText}>
              Selecionar imagem
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  if (field.type === "select") {
    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{field.label}</Text>

        <View style={styles.optionsGrid}>
          {(field.options || []).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                value === option && styles.optionButtonActive,
              ]}
              onPress={() => setValue(field, option)}
            >
              <Text
                style={[
                  styles.optionText,
                  value === option && styles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  if (field.type === "checkbox") {
    const selected = Array.isArray(value) ? value : []

    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{field.label}</Text>

        <View style={styles.optionsGrid}>
          {(field.options || []).map((option) => {
            const active = selected.includes(option)

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  active && styles.optionButtonActive,
                ]}
                onPress={() => {
                  const next = active
                    ? selected.filter((item) => item !== option)
                    : [...selected, option]

                  setValue(field, next)
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    active && styles.optionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  if (field.type === "textarea") {
    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{field.label}</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          value={String(value ?? "")}
          onChangeText={(text) => setValue(field, text)}
          multiline
          placeholder="Digite aqui"
          placeholderTextColor={THEME.colors.textSecondary}
        />
      </View>
    )
  }

  return (
    <CustomInput
      label={field.label}
      placeholder="Digite aqui"
      value={String(value ?? "")}
      onChangeText={(text) => setValue(field, text)}
      keyboardType={field.type === "number" ? "numeric" : "default"}
    />
  )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={THEME.colors.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Responder formulário" }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Container>
            <Text style={styles.title}>{form?.title}</Text>
            <Text style={styles.description}>
              {form?.description || "Preencha os campos abaixo."}
            </Text>

            {form?.structure.map((field, index) => (
              <View key={field.fieldId ?? index} style={{ marginBottom: 12 }}>
                {renderField(field)}

                {field.required && (
                  <Text style={styles.requiredText}>Obrigatório</Text>
                )}
              </View>
            ))}
          </Container>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Enviar resposta"
            loading={sending}
            onPress={handleSubmit}
          />
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
  centered: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 120,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 26,
  },
  description: {
    ...THEME.fonts.body,
    color: THEME.colors.textSecondary,
    marginTop: 8,
    marginBottom: 28,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    ...THEME.fonts.body,
    marginBottom: 8,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 14,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textPrimary,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  optionButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  optionText: {
    fontFamily: "Manrope-SemiBold",
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  optionTextActive: {
    color: "#FFF",
  },
  requiredText: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
imagePickerButton: {
  height: 120,
  borderRadius: 14,
  borderWidth: 1,
  borderStyle: "dashed",
  borderColor: THEME.colors.primary,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: `${THEME.colors.primary}10`,
},

imagePickerText: {
  marginTop: 8,
  color: THEME.colors.primary,
  fontFamily: "Manrope-SemiBold",
},

previewImage: {
  width: "100%",
  height: 220,
  borderRadius: 14,
},

removeImageButton: {
  marginTop: 10,
  alignSelf: "flex-end",
},

removeImageText: {
  color: THEME.colors.error,
  fontFamily: "Manrope-SemiBold",
},

})