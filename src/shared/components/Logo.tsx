import { StyleSheet, Text, View } from "react-native"

import { THEME } from "@/src/shared/styles/theme"

type LogoProps = {
  size?: number
}

export function Logo({ size = 30 }: LogoProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.smart, { fontSize: size }]}>Smart</Text>
      <Text style={[styles.forms, { fontSize: size }]}>Forms</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  smart: {
    fontFamily: "Jakarta-Medium",
    color: THEME.colors.textSecondary,
  },
  forms: {
    fontFamily: "Jakarta-Bold",
    color: THEME.colors.primary,
  },
})