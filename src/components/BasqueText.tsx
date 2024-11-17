import { Text, StyleSheet } from "react-native"

export const BasqueText = ({children, style = {}}) => {

  return (<Text style={[styles.text, style]}>{children}</Text>)

}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Vascan'
  }
})