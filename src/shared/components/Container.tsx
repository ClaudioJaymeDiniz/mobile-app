import { ReactNode } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"

type ContainerProps = {
  children: ReactNode
  style?: ViewStyle
}

export function Container({ children, style }: ContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
  },
})