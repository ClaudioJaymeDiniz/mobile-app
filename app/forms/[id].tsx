import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import { Button } from "@/src/shared/components/Button"
import { Container } from "@/src/shared/components/Container"
import {
  archiveForm,
  getFormById,
  restoreForm,
} from "@/src/features/forms/api/formsApi"
import type { Form } from "@/src/features/forms/types/formTypes"
import { listFormSubmissions } from "@/src/features/submissions/api/submissionsApi"
import type { Submission } from "@/src/features/submissions/types/submissionTypes"

export default function FormDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const [form, setForm] = useState<Form | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  function getFieldLabel(key: string) {
    const field = form?.structure.find(
      (item) => item.fieldId === key || item.label === key
    )

    return field?.label ?? key
  }
  function isImageValue(value: any) {
    if (typeof value !== "string") return false

    const lower = value.toLowerCase()

    return (
      lower.includes("cloudinary.com") ||
      /\.(jpg|jpeg|png|webp|gif)(\?|$)/.test(lower)
    )
  }

  const loadData = useCallback(async () => {
    if (!id) return

    try {
      const [formData, submissionsData] = await Promise.all([
        getFormById(id),
        listFormSubmissions(id),
      ])

      setForm(formData)
      setSubmissions(submissionsData)
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o formulário.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [id])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData])
  )

  async function handleArchive() {
    if (!id) return

    try {
      await archiveForm(id)
      await loadData()
    } catch {
      Alert.alert("Erro", "Não foi possível arquivar o formulário.")
    }
  }

  async function handleRestore() {
    if (!id) return

    try {
      await restoreForm(id)
      await loadData()
    } catch {
      Alert.alert("Erro", "Não foi possível restaurar o formulário.")
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={THEME.colors.primary} size="large" />
      </View>
    )
  }

  const isArchived = Boolean(form?.deletedAt)

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: form?.title ?? "Formulário" }} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              loadData()
            }}
            colors={[THEME.colors.primary]}
          />
        }
      >
        <Container>
          <View style={styles.heroCard}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="document-text-outline"
                size={28}
                color={THEME.colors.primary}
              />
            </View>

            <Text style={styles.title}>{form?.title}</Text>
            <Text style={styles.description}>
              {form?.description || "Visualize e responda este formulário."}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                {form?.structure?.length ?? 0} campo(s)
              </Text>
              <Text style={styles.meta}>
                {submissions.length} resposta(s)
              </Text>
            </View>
          </View>

          {isArchived ? (
            <View style={styles.archivedBox}>
              <Ionicons name="archive-outline" size={20} color="#64748B" />
              <Text style={styles.archivedText}>Formulário arquivado</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            {!isArchived && (
              <Button
                title="Responder formulário"
                onPress={() =>
                  router.push({
                    pathname: "/forms/[id]/answer",
                    params: { id },
                  })
                }
              />
            )}

            <Button
              title={isArchived ? "Restaurar formulário" : "Arquivar formulário"}
              variant="outline"
              onPress={isArchived ? handleRestore : handleArchive}
            />
          </View>

          <Text style={styles.sectionTitle}>Campos</Text>

          {form?.structure.map((field, index) => (
            <View key={field.fieldId ?? index} style={styles.fieldCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Text style={styles.fieldMeta}>
                  {field.type} • {field.required ? "obrigatório" : "opcional"}
                </Text>
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Respostas</Text>

          {submissions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={42}
                color={THEME.colors.border}
              />
              <Text style={styles.emptyTitle}>Nenhuma resposta ainda</Text>
            </View>
          ) : (
            submissions.map((submission) => (
              <View key={submission.id} style={styles.submissionCard}>
                <Text style={styles.submissionAuthor}>
                  {submission.user?.name || submission.user?.email || "Usuário"}
                </Text>

                <Text style={styles.submissionDate}>
                  {new Date(submission.createdAt).toLocaleString("pt-BR")}
                </Text>

                {Object.entries(submission.formData || {}).map(([key, value]) => (
                  <View key={key} style={styles.responseLine}>
                    <Text style={styles.responseKey}>{getFieldLabel(key)}:</Text>
                    {isImageValue(value) ? (
                      <Image
                        source={{ uri: String(value) }}
                        style={styles.responseImage}
                      />
                        ) : (
                          <Text style={styles.responseValue}>
                            {Array.isArray(value) ? value.join(", ") : String(value)}
                          </Text>
                        )}
                  </View>
                ))}
              </View>
            ))
          )}
        </Container>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  responseImage: {
  width: 120,
  height: 120,
  borderRadius: 12,
  marginTop: 6,
  backgroundColor: "#E5E7EB",
},
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
    paddingVertical: 20,
    paddingBottom: 60,
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${THEME.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 26,
  },
  description: {
    ...THEME.fonts.body,
    color: THEME.colors.textSecondary,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  meta: {
    fontFamily: "Manrope-SemiBold",
    color: THEME.colors.primary,
    fontSize: 13,
  },
  archivedBox: {
    marginTop: 16,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  archivedText: {
    fontFamily: "Manrope-SemiBold",
    color: "#64748B",
  },
  actions: {
    marginTop: 18,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "Jakarta-Bold",
    fontSize: 18,
    color: THEME.colors.textPrimary,
    marginTop: 28,
    marginBottom: 12,
  },
  fieldCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 14,
    marginBottom: 10,
  },
  fieldLabel: {
    fontFamily: "Jakarta-Bold",
    color: THEME.colors.textPrimary,
  },
  fieldMeta: {
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "Jakarta-Bold",
    color: THEME.colors.textPrimary,
    marginTop: 10,
  },
  submissionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 16,
    marginBottom: 12,
  },
  submissionAuthor: {
    fontFamily: "Jakarta-Bold",
    color: THEME.colors.textPrimary,
  },
  submissionDate: {
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  responseLine: {
  marginTop: 10,
  },

  responseKey: {
    fontFamily: "Manrope-SemiBold",
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },

  responseValue: {
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
})