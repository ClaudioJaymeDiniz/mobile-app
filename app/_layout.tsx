import { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"

import {
  useFonts,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_400Regular,
} from "@expo-google-fonts/plus-jakarta-sans"

import {
  Manrope_400Regular,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope"

import { useAuthStore } from "@/src/features/auth/store/useAuthStore"
import { THEME } from "@/src/shared/styles/theme"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments()

  const {
    isAuthenticated,
    isLoading,
    loadSession,
  } = useAuthStore()

  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Bold": PlusJakartaSans_700Bold,
    "Jakarta-Medium": PlusJakartaSans_500Medium,
    "Jakarta-Regular": PlusJakartaSans_400Regular,
    "Manrope-Regular": Manrope_400Regular,
    "Manrope-SemiBold": Manrope_600SemiBold,
  })

  useEffect(() => {
    loadSession()
  }, [loadSession])

  useEffect(() => {
    if ((!fontsLoaded && !fontError) || isLoading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login")
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)")
    }

    SplashScreen.hideAsync()
  }, [
    fontsLoaded,
    fontError,
    isLoading,
    isAuthenticated,
    segments,
    router,
  ])

  if ((!fontsLoaded && !fontError) || isLoading) {
    return null
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: THEME.colors.background }}>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.colors.background,
          },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaProvider>
  )
}