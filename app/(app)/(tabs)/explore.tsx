import { StyleSheet, Text, View } from "react-native"

import { THEME } from "@/src/shared/styles/theme"

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar</Text>
      <Text style={styles.subtitle}>
        Aqui vamos listar formulários públicos.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 24,
  },
  title: {
    ...THEME.fonts.title,
  },
  subtitle: {
    ...THEME.fonts.subtitle,
    marginTop: 8,
  },
})