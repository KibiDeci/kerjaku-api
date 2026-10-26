import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, cekLogin } from "../data/auth"
import { pesanError } from "../data/api"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const buttonLogin = async (e) => {
    e.preventDefault()

    if (username.trim() === "" || password === "") {
      setError("Username dan password wajib diisi")
      return
    }

    setLoading(true)
    try {
      const user = await cekLogin(username.trim(), password)
      login(user)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(pesanError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <main className="page-content">
        <div className="container py-5" style={{ maxWidth: "400px" }}>
          <div className="card border-0 shadow-sm p-4 mt-5">
            <div className="text-center fs-1">💼</div>
            <h1 className="text-primary fw-bold text-center">KerjaKu</h1>
            <p className="text-muted text-center mb-4">Cari dan lamar pekerjaan</p>

            <form onSubmit={buttonLogin}>
              <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <small className="text-muted text-center mt-3">
              Akun test: <b>anggia</b> / <b>kerja123</b>
            </small>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
