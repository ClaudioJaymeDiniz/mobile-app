import { StyleSheet, Text, View } from "react-native"

import { THEME } from "@/src/shared/styles/theme"

export function DeveloperFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Desenvolvido por <Text style={styles.author}>Claudio Jayme</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  author: {
    fontFamily: "Manrope-SemiBold",
    color: THEME.colors.primary,
  },
})