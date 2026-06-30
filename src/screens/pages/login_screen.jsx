import { ROUTES } from '../../resources/routes'
import { useAuth } from '../../hooks/useAuth'

function LoginScreen() {
  const { loading, error, success, login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const data = await login({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (data) {
      window.location.href = ROUTES.mails
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tharindu@gmail.com"
            autoComplete="email"
            required
          />

          <div className="label-row">
            <label htmlFor="password">Password</label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <label className="remember-option">
            <input type="checkbox" name="remember" />
            <span>Keep me signed in</span>
          </label>

          {error && (
            <div className="alert-box alert-error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert-box alert-success" role="status">
              {success}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="button-loader" aria-label="Signing in">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <p className="signup-note">
            New here? <a href={ROUTES.register}>Create an account</a>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginScreen
