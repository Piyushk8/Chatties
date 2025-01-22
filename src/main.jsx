import { StrictMode } from 'react'
// import { Provider } from "@/components/ui/provider"
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './redux/store.js'
import { Provider as ReduxProvider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ReduxProvider store={store}>
      {/* <Provider> */}
        <App />
      {/* </Provider> */}
    </ReduxProvider>
  // </StrictMode>,
)
