import { useEffect, useState } from "react"
import TopBar from "../components/TopBar"
import CardJob from "../components/CardJob"
import BottomBar from "../components/BottomBar"
import { getJobs } from "../data/jobs"
import { getUser } from "../data/auth"
import { pesanError } from "../data/api"

const Dashboard = () => {
  const user = getUser()
  const [search, setSearch] = useState("")
  const [hasil, setHasil] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Ambil lowongan dari API setiap kali kata pencarian berubah
  useEffect(() => {
    setLoading(true)
    getJobs(search)
      .then((data) => {
        setHasil(data)
        setError("")
      })
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div className="page">
      <main className="page-content">
        <TopBar />

        <div className="container py-4" style={{ maxWidth: "700px" }}>
          <div className="bg-primary text-white rounded-3 p-4 mb-4">
            <h4 className="mb-1">Halo, {user.name} 👋</h4>
            <p className="mb-0">Temukan pekerjaan yang cocok untukmu</p>
          </div>

          <input type="text" className="form-control form-control-lg mb-3" placeholder="🔍 Cari posisi..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {loading ? (
            <p className="text-center text-muted">Memuat lowongan...</p>
          ) : (
            <>
              <p className="text-muted small">{hasil.length} lowongan ditemukan</p>

              {hasil.map((job) => (
                <CardJob key={job.id} id={job.id} title={job.title} company={job.company} location={job.location} salary={job.salary} />
              ))}

              {hasil.length === 0 && !error && <p className="text-center text-muted">Lowongan tidak ditemukan</p>}
            </>
          )}
        </div>
      </main>
      <BottomBar />
    </div>
  )
}

export default Dashboard
