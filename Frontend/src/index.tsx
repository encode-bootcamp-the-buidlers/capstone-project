import { ChakraProvider, LightMode, useColorMode } from "@chakra-ui/react"
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import App from "./App"
import Web3 from "./components/Web3"
import "./index.css"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <ChakraProvider>
    <Web3>
      <LightMode>
        <React.StrictMode>
          <App />
        </React.StrictMode>

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
      </LightMode>
    </Web3>
  </ChakraProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
