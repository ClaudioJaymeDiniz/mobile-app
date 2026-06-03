import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import { getProjectById } from "@/src/features/projects/api/projectsApi"
import type { Project } from "@/src/features/projects/types/projectTypes"
import { useAuthStore } from "@/src/store/useAuthStore"
import { useProjectForms } from "@/src/features/forms/hooks/useProjectForms"

export default function ProjectDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuthStore()

  const {
    forms,
    isLoading: formsLoading,
    loadForms,
  } = useProjectForms(id)

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProject = useCallback(async () => {
    if (!id) return

    setError(null)

    try {
      const data = await getProjectById(id)
      setProject(data)
    } catch {
      setError("Não foi possível carregar o projeto.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [id])

  useFocusEffect(
  useCallback(() => {
    loadProject()
    loadForms()
  }, [loadProject, loadForms])
  )

  const color = project?.themeColor || THEME.colors.primary
  const isOwner = project?.ownerId === user?.id

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={THEME.colors.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: project?.name ?? "Projeto",
          headerTintColor: color,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              loadProject()
            }}
            colors={[color]}
          />
        }
      >
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.heroCard}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}18` }]}>
            <Ionicons name="layers-outline" size={28} color={color} />
          </View>

          <Text style={styles.title}>{project?.name}</Text>

          <Text style={styles.description}>
            {project?.description ||
              "Organize formulários, convites e respostas."}
          </Text>

          <View style={styles.badge}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isOwner ? THEME.colors.primary : "#F59E0B",
                },
              ]}
            />
            <Text style={styles.badgeText}>
              {isOwner ? "Owner" : "Colaborador"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {isOwner && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: color }]}
              onPress={() =>
                router.push({
                  pathname: "/projects/[id]/edit",
                  params: {
                    id: String(id),
                  },
                })
              }
            >
              <Ionicons name="settings-outline" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Configurações</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
                router.push({
                pathname: "/forms/new",
                params: {
                  projectId: String(id),
                  color,
                },
              })
            }
          >
            <Ionicons name="add-circle-outline" size={20} color={color} />
            <Text style={[styles.secondaryButtonText, { color }]}>
              Novo formulário
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>Formulários</Text>
      <Text style={styles.sectionSubtitle}>
        Formulários vinculados a este projeto.
      </Text>
    </View>

    {isOwner && (
      <TouchableOpacity
        style={[styles.smallAddButton, { backgroundColor: color }]}
        onPress={() =>
          router.push({
            pathname: "/forms/new",
            params: {
              projectId: String(id),
              color,
            },
          })
        }
      >
        <Ionicons name="add" size={20} color="#FFF" />
      </TouchableOpacity>
    )}
  </View>

  {formsLoading ? (
    <ActivityIndicator color={color} style={{ marginTop: 24 }} />
  ) : forms.length === 0 ? (
    <View style={styles.emptyForms}>
      <Ionicons
        name="document-text-outline"
        size={42}
        color={THEME.colors.border}
      />
      <Text style={styles.emptyFormsTitle}>Nenhum formulário</Text>
      <Text style={styles.emptyFormsSubtitle}>
        Crie o primeiro formulário deste projeto.
      </Text>
    </View>
  ) : (
    forms.map((form) => (
      <TouchableOpacity
        key={form.id}
        style={styles.formCard}
        onPress={() =>
          router.push({
            pathname: "/forms/[id]",
            params: {
              id: form.id,
            },
          })
        }
      >
        <View style={[styles.formIcon, { backgroundColor: `${color}15` }]}>
          <Ionicons name="document-text-outline" size={22} color={color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.formTitle}>{form.title}</Text>
          <Text style={styles.formSubtitle} numberOfLines={2}>
            {form.description || "Sem descrição"}
          </Text>

          <Text style={styles.formMeta}>
            {form.submissionCount ?? 0} resposta(s)
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={THEME.colors.textSecondary}
        />
      </TouchableOpacity>
    ))
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
  paddingHorizontal: 24,
  paddingTop: 8,
  paddingBottom: 48,
},
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: THEME.colors.error,
    fontFamily: "Manrope-Regular",
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 26,
  },
  description: {
    ...THEME.fonts.body,
    color: THEME.colors.textSecondary,
    marginTop: 8,
    lineHeight: 22,
  },
  badge: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: "Manrope-SemiBold",
    color: THEME.colors.textSecondary,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionButtonText: {
    ...THEME.fonts.button,
  },
  secondaryButton: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    fontFamily: "Manrope-SemiBold",
    fontSize: 15,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontFamily: "Jakarta-Bold",
    fontSize: 18,
    color: THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    ...THEME.fonts.subtitle,
    marginTop: 6,
  },
  sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
},

smallAddButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  alignItems: "center",
  justifyContent: "center",
},

emptyForms: {
  backgroundColor: THEME.colors.surface,
  borderRadius: 18,
  padding: 28,
  alignItems: "center",
  borderWidth: 1,
  borderColor: THEME.colors.border,
},

emptyFormsTitle: {
  fontFamily: "Jakarta-Bold",
  fontSize: 17,
  color: THEME.colors.textPrimary,
  marginTop: 12,
},

emptyFormsSubtitle: {
  fontFamily: "Manrope-Regular",
  color: THEME.colors.textSecondary,
  marginTop: 6,
  textAlign: "center",
},

formCard: {
  backgroundColor: THEME.colors.surface,
  borderRadius: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: THEME.colors.border,
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},

formIcon: {
  width: 46,
  height: 46,
  borderRadius: 23,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

formTitle: {
  fontFamily: "Jakarta-Bold",
  fontSize: 16,
  color: THEME.colors.textPrimary,
},

formSubtitle: {
  fontFamily: "Manrope-Regular",
  color: THEME.colors.textSecondary,
  marginTop: 3,
},

formMeta: {
  fontFamily: "Manrope-SemiBold",
  fontSize: 12,
  color: THEME.colors.primary,
  marginTop: 6,
},
})