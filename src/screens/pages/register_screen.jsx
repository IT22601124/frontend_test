import { ROUTES } from '../../resources/routes'
import { useAuth } from '../../hooks/useAuth'

function RegisterScreen() {
  const { loading, error, success, setError, register } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    await register({
      name: formData.get('name'),
      email: formData.get('email'),
      password,
      password_confirmation: confirmPassword,
    })
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Register</h1>

          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tharindu@gmail.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
          />

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
              <span className="button-loader" aria-label="Creating account">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              'Create account'
            )}
          </button>

          <p className="signup-note">
            Already have an account? <a href={ROUTES.login}>Sign in</a>
          </p>
        </form>
      </section>
    </main>
  )
}

export default RegisterScreen
