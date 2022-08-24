import { ChakraProvider, useColorMode } from "@chakra-ui/react"
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import App from "./App"
import Web3 from "./components/Web3"
import "./index.css"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

function ForceLightMode(props: { children: JSX.Element }) {
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === "light") return
    toggleColorMode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode])

  return props.children
}

root.render(
  <ChakraProvider>
    <Web3>
      <ForceLightMode>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ForceLightMode>
      
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "1rem",
            maxWidth: "40rem",
            marginBottom: "2rem",
          },
        }}
      />
    </Web3>
  </ChakraProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
