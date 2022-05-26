import { extendTheme } from "@chakra-ui/react"

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const colors = {
  primary:"#333D51",
  secondary:"#D5AC29",
  terciary:"#8D9093"
}

const fonts = {
    heading: "Josefin Sans",
    body: "Josefin Sans",
}

const theme = extendTheme({config,colors,fonts})

export default theme