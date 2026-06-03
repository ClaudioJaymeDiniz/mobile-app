import { useCallback } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { THEME } from "@/src/shared/styles/theme"
import { useAuthStore } from "@/src/features/auth/store/useAuthStore"
import { useProjects } from "@/src/features/projects/hooks/useProjects"

import {
  restoreProject,
  permanentDeleteProject,
} from "@/src/features/projects/api/projectsApi"

export default function ProjectsHomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()

  const {
    projects,
    archivedProjects,
    isLoading,
    isRefreshing,
    error,
    loadProjects,
    refreshProjects,
  } = useProjects()

  useFocusEffect(
    useCallback(() => {
      loadProjects()
    }, [loadProjects])
  )
  async function handleRestoreProject(projectId: string) {
  try {
    await restoreProject(projectId)
    await loadProjects()
  } catch {
    console.log("Erro ao restaurar projeto")
  }
}

async function handleDeleteArchivedProject(projectId: string) {
  try {
    await permanentDeleteProject(projectId)
    await loadProjects()
  } catch {
    console.log("Erro ao excluir projeto definitivamente")
  }
}

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshProjects}
            colors={[THEME.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Olá, {user?.name?.split(" ")[0] ?? "usuário"} 👋
            </Text>
            <Text style={styles.subtitle}>
              Acompanhe seus projetos e formulários.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/projects/new")}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Projetos ativos</Text>

            {projects.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="folder-open-outline"
                  size={48}
                  color={THEME.colors.border}
                />
                <Text style={styles.emptyTitle}>
                  Nenhum projeto encontrado
                </Text>
                <Text style={styles.emptySubtitle}>
                  Crie seu primeiro projeto para começar.
                </Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {projects.map((project) => {
                  const color = project.themeColor || THEME.colors.primary
                  const isOwner = project.ownerId === user?.id

                  return (
                    <TouchableOpacity
                      key={project.id}
                      style={styles.card}
                      onPress={() =>
                        router.push({
                          pathname: "/projects/[id]",
                          params: {
                            id: project.id,
                          },
                        })
                      }
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: `${color}18` },
                        ]}
                      >
                        <Ionicons
                          name={isOwner ? "folder" : "people"}
                          size={28}
                          color={color}
                        />
                      </View>

                      <Text style={styles.projectName} numberOfLines={1}>
                        {project.name}
                      </Text>

                      <Text style={styles.projectDescription} numberOfLines={2}>
                        {project.description || "Sem descrição"}
                      </Text>

                      <View style={styles.cardFooter}>
                        <View
                          style={[
                            styles.dot,
                            {
                              backgroundColor: isOwner
                                ? THEME.colors.primary
                                : "#F59E0B",
                            },
                          ]}
                        />
                        <Text style={styles.roleText}>
                          {isOwner ? "Meu projeto" : "Colaborador"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}

            {archivedProjects.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Arquivados</Text>

                {archivedProjects.map((project) => (
                  <View key={project.id} style={styles.archivedCard}>
                    <View>
                      <Text style={styles.archivedName}>{project.name}</Text>
                      <Text style={styles.archivedSubtitle}>
                        Projeto arquivado
                      </Text>
                    </View>

                    <Ionicons
                      name="archive-outline"
                      size={22}
                      color={THEME.colors.textSecondary}
                    />
                  </View>
                ))}
              </>
            )}
          </>
        )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    ...THEME.fonts.title,
    fontSize: 26,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
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
  loadingContainer: {
    paddingTop: 80,
  },
  sectionTitle: {
    fontFamily: "Jakarta-Bold",
    fontSize: 18,
    color: THEME.colors.textPrimary,
    marginBottom: 14,
    marginTop: 8,
  },
  grid: {
    gap: 14,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  projectName: {
    fontFamily: "Jakarta-Bold",
    fontSize: 17,
    color: THEME.colors.textPrimary,
  },
  projectDescription: {
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  roleText: {
    fontFamily: "Manrope-SemiBold",
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  emptyState: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyTitle: {
    fontFamily: "Jakarta-Bold",
    fontSize: 17,
    marginTop: 14,
    color: THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  archivedCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  archivedName: {
    fontFamily: "Jakarta-Bold",
    color: THEME.colors.textPrimary,
  },
  archivedSubtitle: {
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  restoreIconButton: {
  width: 38,
  height: 38,
  borderRadius: 19,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `${THEME.colors.primary}15`,
  marginRight: 8,
},

deleteIconButton: {
  width: 38,
  height: 38,
  borderRadius: 19,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FEE2E2",
},
})