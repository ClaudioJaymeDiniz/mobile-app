import { Text, TextInput, TextInputProps, StyleSheet, View } from "react-native"

import { THEME } from "@/src/shared/styles/theme"

type CustomInputProps = TextInputProps & {
  label: string
  error?: string | null
}

export function CustomInput({
  label,
  error,
  style,
  ...props
}: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        placeholderTextColor={THEME.colors.textSecondary}
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...THEME.fonts.body,
    marginBottom: 8,
    color: THEME.colors.textPrimary,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 14,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    fontFamily: "Manrope-Regular",
    color: THEME.colors.textPrimary,
  },
  inputError: {
    borderColor: THEME.colors.error,
  },
  error: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: THEME.colors.error,
    marginTop: 6,
  },
})