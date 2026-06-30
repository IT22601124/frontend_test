export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  mails: '/mails',
}

export const appRoutes = [
  {
    path: ROUTES.home,
    page: 'login',
  },
  {
    path: ROUTES.login,
    page: 'login',
  },
  {
    path: ROUTES.register,
    page: 'register',
  },
  {
    path: ROUTES.mails,
    page: 'mails',
  },
]
