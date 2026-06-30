import { appRoutes, ROUTES } from './resources/routes'
import LoginScreen from './screens/pages/login_screen.jsx'
import MailScreen from './screens/pages/mail_screen.jsx'
import RegisterScreen from './screens/pages/register_screen.jsx'
import './App.css'

const pages = {
  login: LoginScreen,
  mails: MailScreen,
  register: RegisterScreen,
}

function App() {
  const currentPath = window.location.pathname
  const route =
    appRoutes.find((item) => item.path === currentPath) ||
    appRoutes.find((item) => item.path === ROUTES.home)

  const Page = pages[route.page]

  return <Page />
}

export default App
