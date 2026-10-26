import { useState } from "react"
import TopBar from "../components/TopBar"
import BottomBar from "../components/BottomBar"
import { getUser, updateAccount } from "../data/auth"
import { pesanError } from "../data/api"

const Profile = () => {
  const [user, setUser] = useState(getUser())
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone || "")
  const [password, setPassword] = useState("")
  const [pesan, setPesan] = useState("")

  const buttonSimpan = async (e) => {
    e.preventDefault()

    if (name.trim() === "" || email.trim() === "") {
      setPesan("Nama dan email tidak boleh kosong")
      return
    }

    const data = { name: name.trim(), email: email.trim(), phone: phone }
    if (password !== "") data.password = password

    try {
      setUser(await updateAccount(user.username, data))
      setPassword("")
      setPesan("Profil berhasil disimpan")
    } catch (err) {
      setPesan(pesanError(err))
    }
  }

  return (
    <div className="page">
      <main className="page-content">
        <TopBar />

        <div className="container py-4" style={{ maxWidth: "500px" }}>
          <div className="text-center mb-4">
            <div className="inisial mx-auto mb-2" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
              {user.name.charAt(0)}
            </div>
            <h4 className="mb-0">{user.name}</h4>
            <p className="text-muted">@{user.username}</p>
          </div>

          <form className="card border-0 shadow-sm p-4" onSubmit={buttonSimpan}>
            <label>Nama</label>
            <input type="text" className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Email</label>
            <input type="email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Nomor HP</label>
            <input type="text" className="form-control mb-3" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>Password Baru</label>
            <input type="password" className="form-control mb-3" placeholder="Kosongkan jika tidak diganti" value={password} onChange={(e) => setPassword(e.target.value)} />

            {pesan && <div className="alert alert-info py-2">{pesan}</div>}

            <button type="submit" className="btn btn-primary w-100">
              Simpan
            </button>
          </form>
        </div>
      </main>
      <BottomBar />
    </div>
  )
}

export default Profile
