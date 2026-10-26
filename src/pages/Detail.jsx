import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TopBar from "../components/TopBar"
import { getUser } from "../data/auth"
import { getJob } from "../data/jobs"
import { kirimLamaran, sudahMelamar } from "../data/lamaran"
import { pesanError } from "../data/api"

const Detail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = getUser()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cv, setCv] = useState("")
  const [pesan, setPesan] = useState("")
  const [error, setError] = useState("")
  const [terkirim, setTerkirim] = useState(false)

  // Ambil detail lowongan dan status lamaran dari API
  useEffect(() => {
    setLoading(true)
    Promise.all([getJob(id), sudahMelamar(id, user.username)])
      .then(([dataJob, sudah]) => {
        setJob(dataJob)
        setTerkirim(sudah)
      })
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [id, user.username])

  if (loading) {
    return (
      <div className="page">
        <main className="page-content">
          <TopBar />
          <p className="text-center text-muted mt-5">Memuat lowongan...</p>
        </main>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="page">
        <main className="page-content">
          <TopBar />
          <p className="text-center mt-5">Lowongan tidak ditemukan</p>
        </main>
      </div>
    )
  }

  const buttonLamar = async (e) => {
    e.preventDefault()

    if (cv.trim() === "") {
      setError("Link CV wajib diisi")
      return
    }

    try {
      await kirimLamaran({ jobId: job.id, username: user.username, cv: cv.trim(), pesan: pesan })
      setError("")
      setTerkirim(true)
    } catch (err) {
      setError(pesanError(err))
    }
  }

  return (
    <div className="page">
      <main className="page-content">
        <TopBar />

        <div className="container py-4" style={{ maxWidth: "600px" }}>
          <button className="btn btn-link px-0 mb-3" onClick={() => navigate(-1)}>
            ← Kembali
          </button>

          <div className="card border-0 shadow-sm p-4 mb-4">
            <div className="d-flex gap-3 align-items-center mb-3">
              <div className="inisial">{job.company.charAt(0)}</div>
              <div>
                <h3 className="mb-0">{job.title}</h3>
                <p className="text-muted mb-0">{job.company}</p>
              </div>
            </div>
            <p className="mb-1">📍 {job.location}</p>
            <p className="text-success fw-bold">💰 {job.salary} / bulan</p>
            <h6 className="fw-bold">Deskripsi</h6>
            <p className="mb-0">{job.description}</p>
          </div>

          {terkirim ? (
            <div className="alert alert-success">✅ Lamaran kamu sudah terkirim.</div>
          ) : (
            <form className="card border-0 shadow-sm p-4" onSubmit={buttonLamar}>
              <h5 className="mb-3">📝 Form Lamaran</h5>

              <input type="text" className="form-control mb-2" value={user.name} disabled />
              <input type="email" className="form-control mb-2" value={user.email} disabled />
              <input type="text" className="form-control mb-2" placeholder="Link CV (Google Drive)" value={cv} onChange={(e) => setCv(e.target.value)} />
              <textarea className="form-control mb-3" rows="3" placeholder="Pesan untuk perusahaan (opsional)" value={pesan} onChange={(e) => setPesan(e.target.value)} />

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <button type="submit" className="btn btn-primary w-100">
                Kirim Lamaran
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default Detail
