import { Stack } from "expo-router"

import { THEME } from "@/src/shared/styles/theme"

export default function FormsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerTitleStyle: {
          fontFamily: "Jakarta-Bold",
        },
        headerTintColor: THEME.colors.primary,
        headerBackTitle: "Voltar",
      }}
    />
  )
}