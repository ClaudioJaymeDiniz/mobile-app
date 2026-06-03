import { ReactNode } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native"

import { THEME } from "@/src/shared/styles/theme"

type ButtonProps = TouchableOpacityProps & {
  title: string
  loading?: boolean
  variant?: "primary" | "danger" | "outline"
  icon?: ReactNode
}

export function Button({
  title,
  loading = false,
  variant = "primary",
  icon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? THEME.colors.primary : "#FFF"} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              variant === "outline" && styles.outlineText,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primary: {
    backgroundColor: THEME.colors.primary,
  },
  danger: {
    backgroundColor: THEME.colors.error,
  },
  outline: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    ...THEME.fonts.button,
  },
  outlineText: {
    color: THEME.colors.primary,
  },
})