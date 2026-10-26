# Penjelasan Kode Aplikasi AnimeKu

AnimeKu adalah aplikasi daftar anime yang dibuat dengan **Ionic React**. Pengguna login, melihat daftar anime, mencari dan memfilter berdasarkan genre, membuka detail anime, mengelola profil, lalu logout.

Dokumen ini dibagi per materi. Setiap materi berisi penjelasan konsep, letaknya di kode, dan potongan kode yang bisa ditunjukkan ke dosen.

---

## Daftar Isi

1. Teknologi yang Digunakan
2. Struktur Folder Project
3. Titik Awal Aplikasi (Entry Point)
4. Komponen dan JSX
5. Props (Mengirim Data ke Komponen)
6. State dengan `useState`
7. Event Handling
8. Form dan Controlled Component
9. Conditional Rendering
10. List Rendering dengan `map()` dan `key`
11. Method Array: `filter()` dan `find()`
12. Routing (Perpindahan Halaman)
13. Mengirim Data Antar Halaman
14. Side Effect dengan `useEffect`
15. Login, Akun Test, dan Validasi
16. Menyimpan Data dengan `localStorage`
17. Protected Route (Halaman yang Wajib Login)
18. Logout
19. Halaman Profil dan Edit Profil
20. Styling: Ionic dan Bootstrap
21. Alur Lengkap Aplikasi
22. Keterbatasan dan Pengembangan Selanjutnya
23. Contoh Pertanyaan Dosen dan Jawabannya

---

## 1. Teknologi yang Digunakan

| Teknologi | Fungsi di aplikasi |
|---|---|
| **React 19** | Library JavaScript untuk membuat tampilan berbasis komponen. |
| **Ionic React 9** | Framework UI mobile. Dipakai untuk `IonApp`, `IonPage`, `IonContent`, `IonRouterOutlet`. |
| **React Router 6** | Mengatur perpindahan halaman (routing). |
| **Bootstrap 5** | Library CSS untuk styling cepat (warna, layout, tombol, card, grid). |
| **Vite** | Tool untuk menjalankan server development dan mem-build aplikasi. |
| **Capacitor** | Mengubah aplikasi web menjadi aplikasi Android/iOS. |

Daftar library bisa dilihat di `package.json` bagian `dependencies`.

**Perintah penting:**

```bash
npm install      # memasang semua library
npm run dev      # menjalankan aplikasi di browser (mode development)
npx vite build   # membuat versi siap pakai di folder dist/
```

---

## 2. Struktur Folder Project

```
myApp/
├── index.html              → halaman HTML utama, berisi <div id="root">
├── package.json            → daftar library dan script
└── src/
    ├── main.tsx            → titik awal, memasang <App /> ke HTML
    ├── App.jsx             → pengaturan route (daftar halaman)
    ├── components/         → komponen kecil yang dipakai ulang
    │   ├── TopBar.jsx      → navbar atas (judul, tombol Profil, Logout)
    │   └── CardAnime.jsx   → kartu 1 anime di daftar
    ├── pages/              → komponen halaman penuh
    │   ├── Login.jsx       → halaman login
    │   ├── Dashboard.jsx   → daftar anime + pencarian + filter genre
    │   ├── Detail.jsx      → detail 1 anime
    │   ├── Profile.jsx     → profil pengguna + edit profil
    │   └── NotFound.jsx    → halaman 404
    ├── data/               → data dan logika pendukung
    │   ├── animeList.js    → data anime (pengganti database)
    │   ├── accounts.js     → akun test untuk login
    │   └── auth.js         → fungsi login, logout, getUser, updateProfile
    └── theme/
        └── variables.css   → variabel warna Ionic
```

**Alasan pembagian folder:**
- `pages` berisi halaman yang punya alamat (URL) sendiri.
- `components` berisi bagian tampilan yang dipakai di lebih dari satu halaman, misalnya `TopBar`.
- `data` memisahkan data dan logika dari tampilan, sehingga kode lebih rapi dan mudah diubah.

> Catatan: di folder `src` juga ada file `.tsx` bawaan template Ionic (`App.tsx`, `Home.tsx`, `Tab1.tsx`). Vite memilih file `.jsx` lebih dulu daripada `.tsx`, sehingga yang dipakai aplikasi adalah file `.jsx`.

---

## 3. Titik Awal Aplikasi (Entry Point)

**File:** `src/main.tsx`

```jsx
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Penjelasan:**
1. Browser membuka `index.html`, yang berisi `<div id="root"></div>`.
2. `main.tsx` mencari elemen `root` tersebut.
3. `createRoot(...).render(<App />)` memasang seluruh aplikasi React ke dalam elemen itu.
4. `React.StrictMode` membantu menemukan kesalahan saat development (tidak berpengaruh di versi build).

Jadi seluruh tampilan aplikasi berasal dari komponen `App`.

---

## 4. Komponen dan JSX

**Komponen** adalah fungsi JavaScript yang mengembalikan tampilan. Setiap halaman dan bagian tampilan di aplikasi ini adalah komponen.

**JSX** adalah sintaks mirip HTML yang ditulis di dalam JavaScript.

**Contoh:** `src/pages/NotFound.jsx`

```jsx
const NotFound = () => {
  const navigate = useNavigate();

  const buttonEnter = () => {
    navigate("/", { replace: true });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <p>Halaman tidak ditemukan</p>
          <button className="btn btn-danger" onClick={buttonEnter}>
            Kembali ke Home
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
```

**Poin penting JSX:**
- Atribut `class` di HTML ditulis `className` di JSX, karena `class` adalah kata kunci JavaScript.
- Kode JavaScript di dalam JSX ditulis di dalam kurung kurawal `{ }`, contoh `{props.title}`.
- Style inline ditulis sebagai objek: `style={{ height: "250px" }}`.
- Komponen harus mengembalikan satu elemen pembungkus (di sini `<IonPage>`).
- `export default` membuat komponen bisa di-`import` di file lain.

---

## 5. Props (Mengirim Data ke Komponen)

**Props** adalah cara mengirim data dari komponen induk (parent) ke komponen anak (child). Props bersifat **read-only**: anak tidak boleh mengubahnya.

**Pengirim:** `src/pages/Dashboard.jsx`

```jsx
<CardAnime
  id={anime.id}
  title={anime.title}
  image={anime.image}
  genre={anime.genre}
  episodes={anime.episodes}
  rating={anime.rating}
/>
```

**Penerima:** `src/components/CardAnime.jsx`

```jsx
const CardAnime = (props) => {
  ...
  <img src={props.image} alt={props.title} />
  <span className="badge ...">⭐ {props.rating}</span>
  <h6 className="card-title mb-1">{props.title}</h6>
  <small>{props.genre} • {props.episodes} eps</small>
};
```

**Contoh lain:** `TopBar` menerima judul lewat props.

```jsx
<TopBar Title="Detail Anime" />           // di Detail.jsx
<span className="text-white">{props.Title}</span>   // di TopBar.jsx
```

**Keuntungan:** satu komponen `CardAnime` bisa dipakai untuk semua anime. Yang berbeda hanya datanya.

---

## 6. State dengan `useState`

**State** adalah data yang bisa berubah di dalam komponen. Saat state berubah, React otomatis menampilkan ulang (re-render) komponen tersebut.

**Bentuk umum:**

```jsx
const [nilai, setNilai] = useState(nilaiAwal);
```

- `nilai` adalah isi state saat ini.
- `setNilai` adalah fungsi untuk mengubah state.
- `nilaiAwal` adalah isi awal state.

**Contoh di aplikasi:**

| File | State | Kegunaan |
|---|---|---|
| `Login.jsx` | `username`, `password` | Isi kolom login |
| `Login.jsx` | `showPassword` | Menampilkan/menyembunyikan password |
| `Login.jsx` | `error` | Pesan error login |
| `Dashboard.jsx` | `search` | Kata kunci pencarian |
| `Dashboard.jsx` | `genre` | Genre yang dipilih |
| `Dashboard.jsx` | `name` | Nama pengguna untuk sapaan |
| `Profile.jsx` | `editing` | Mode lihat atau mode edit |
| `Profile.jsx` | `user`, `name`, `email`, `bio` | Data profil |

**Contoh:** tombol lihat password di `Login.jsx`

```jsx
const [showPassword, setShowPassword] = useState(false);

<input type={showPassword ? "text" : "password"} ... />
<button type="button" onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? "Sembunyikan" : "Lihat"}
</button>
```

Saat tombol ditekan, `showPassword` berubah dari `false` ke `true` (atau sebaliknya). React menampilkan ulang komponen, sehingga tipe input dan teks tombol ikut berubah.

---

## 7. Event Handling

**Event** adalah aksi pengguna, misalnya klik, mengetik, atau submit form. React menangani event dengan atribut seperti `onClick`, `onChange`, dan `onSubmit`.

| Event | Contoh di aplikasi |
|---|---|
| `onClick` | Klik kartu anime untuk membuka detail (`CardAnime.jsx`), klik tombol genre, Logout, Profil |
| `onChange` | Mengetik di kolom username, password, pencarian, dan edit profil |
| `onSubmit` | Menekan tombol Masuk atau Enter di form login, tombol Simpan di edit profil |
| `onError` | Mengganti gambar yang gagal dimuat dengan gambar placeholder |

**Contoh `onClick`:** `CardAnime.jsx`

```jsx
const bukaDetail = () => {
  navigate("/detail/" + props.id);
};

<div className="card ..." onClick={bukaDetail}>
```

**Contoh `onError`:** jika gambar gagal dimuat, gambar diganti placeholder.

```jsx
onError={(e) => (e.target.src = "https://placehold.co/300x420?text=No+Image")}
```

**Contoh `alert`:** tombol "Tonton Sekarang" dan tombol episode di `Detail.jsx` menampilkan pesan simulasi.

```jsx
onClick={() => alert("Memutar " + anime.title + " Episode 1")}
```

---

## 8. Form dan Controlled Component

**Controlled component** adalah input yang nilainya dikendalikan oleh state React. Isi input selalu sama dengan isi state.

**Contoh:** `Login.jsx`

```jsx
<input
  type="text"
  value={username}                                // nilai diambil dari state
  onChange={(e) => setUsername(e.target.value)}   // setiap ketikan menyimpan ke state
/>
```

**Alurnya:**
1. Pengguna mengetik huruf.
2. `onChange` berjalan, dan `e.target.value` berisi teks terbaru.
3. `setUsername` menyimpan teks itu ke state.
4. React menampilkan ulang input dengan nilai baru.

**Submit form:**

```jsx
const buttonEnter = (e) => {
  e.preventDefault();   // mencegah browser me-reload halaman
  ...
};

<form onSubmit={buttonEnter}>
  ...
  <button type="submit">Masuk</button>
</form>
```

- `e.preventDefault()` penting karena perilaku bawaan form HTML adalah me-reload halaman saat disubmit.
- Dengan `<form>`, pengguna bisa login dengan menekan **Enter**.
- Tombol "Lihat" password memakai `type="button"` agar tidak ikut men-submit form.

---

## 9. Conditional Rendering

**Conditional rendering** berarti menampilkan sesuatu hanya jika kondisi tertentu terpenuhi.

**a. Operator `&&`**: tampil hanya jika kondisi bernilai true.

```jsx
{error && <p className="text-danger small mb-3">{error}</p>}
```

Pesan error hanya muncul jika `error` tidak kosong.

```jsx
{hasilFilter.length === 0 && <p>Anime tidak ditemukan</p>}
```

**b. Operator ternary `? :`**: memilih salah satu dari dua tampilan.

```jsx
<TopBar Title={name ? "Halo, " + name : "Daftar Anime"} />
```

```jsx
className={genre === g ? "btn btn-sm btn-danger" : "btn btn-sm btn-outline-light"}
```

Tombol genre yang sedang dipilih berwarna merah, sedangkan yang lain bergaris putih.

**c. `if` dengan `return` lebih awal**: `Detail.jsx`

```jsx
if (!anime) {
  return ( ... <h3>Anime tidak ditemukan</h3> ... );
}
```

Jika id di URL tidak ada di data, halaman menampilkan pesan, bukan error.

**d. Mode lihat atau edit:** `Profile.jsx`

```jsx
{!editing ? ( /* tampilan info profil */ ) : ( /* form edit profil */ )}
```

**e. Tombol hanya untuk pengguna yang login:** `TopBar.jsx`

```jsx
{user && ( <> <button>Profil</button> <button>Logout</button> </> )}
```

`<> ... </>` adalah **Fragment**, pembungkus yang tidak menghasilkan elemen HTML tambahan.

---

## 10. List Rendering dengan `map()` dan `key`

Untuk menampilkan banyak data, array diubah menjadi daftar elemen JSX dengan `map()`.

**Daftar kartu anime:** `Dashboard.jsx`

```jsx
{hasilFilter.map((anime) => (
  <div className="col-6 col-md-4 col-lg-3" key={anime.id}>
    <CardAnime id={anime.id} title={anime.title} ... />
  </div>
))}
```

**Daftar tombol genre:**

```jsx
const genres = ["Semua", "Action", "Adventure", "Fantasy", "Comedy", "Mystery", "Romance"];

{genres.map((g) => (
  <button key={g} onClick={() => setGenre(g)}>{g}</button>
))}
```

**Daftar episode:** `Detail.jsx`

```jsx
const daftarEpisode = [];
for (let i = 1; i <= Math.min(anime.episodes, 12); i++) {
  daftarEpisode.push(i);
}
```

Episode dibuat dengan perulangan `for`, dibatasi maksimal 12 dengan `Math.min` agar tampilan tidak terlalu panjang. Hasilnya kemudian ditampilkan dengan `map()`.

**Kenapa perlu `key`?** `key` adalah penanda unik setiap item. React memakainya untuk mengetahui item mana yang berubah, bertambah, atau terhapus, sehingga proses update tampilan lebih efisien. `key` sebaiknya memakai id unik, seperti `anime.id`.

---

## 11. Method Array: `filter()` dan `find()`

**`filter()`** menghasilkan array baru yang berisi item yang memenuhi syarat. Dipakai untuk pencarian dan filter genre di `Dashboard.jsx`:

```jsx
const hasilFilter = animeList.filter((anime) => {
  const cocokJudul = anime.title.toLowerCase().includes(search.toLowerCase());
  const cocokGenre = genre === "Semua" || anime.genre === genre;
  return cocokJudul && cocokGenre;
});
```

**Penjelasan:**
- `toLowerCase()` membuat pencarian tidak membedakan huruf besar dan kecil.
- `includes()` mengecek apakah judul mengandung kata kunci.
- Anime ditampilkan jika judul cocok **dan** genre cocok.
- `hasilFilter` dihitung ulang setiap kali `search` atau `genre` berubah, karena perubahan state membuat komponen di-render ulang.

**`find()`** menghasilkan satu item pertama yang memenuhi syarat, atau `undefined` jika tidak ada.

Dipakai di `Detail.jsx` untuk mencari anime berdasarkan id:

```jsx
const anime = animeList.find((a) => a.id === Number(id));
```

`id` dari URL berbentuk string, misalnya `"3"`, jadi diubah dulu ke angka dengan `Number(id)` agar bisa dibandingkan dengan `===`.

Dipakai juga di `Login.jsx` untuk mencocokkan akun:

```jsx
const user = accounts.find((acc) => acc.username === username.trim() && acc.password === password);
```

---

## 12. Routing (Perpindahan Halaman)

**Routing** mengatur halaman mana yang tampil berdasarkan URL. Aplikasi ini adalah **SPA (Single Page Application)**: hanya ada satu file HTML, dan perpindahan halaman dilakukan oleh JavaScript tanpa reload.

**File:** `src/App.jsx`

```jsx
<IonApp>
  <IonReactRouter>
    <IonRouterOutlet>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/dashboard" element={<RequireLogin><Dashboard /></RequireLogin>} />
      <Route path="/detail/:id" element={<RequireLogin><Detail /></RequireLogin>} />
      <Route path="/profile" element={<RequireLogin><Profile /></RequireLogin>} />
      <Route path="*" element={<NotFound />} />
    </IonRouterOutlet>
  </IonReactRouter>
</IonApp>
```

**Daftar route:**

| URL | Halaman | Keterangan |
|---|---|---|
| `/` | (redirect) | Langsung diarahkan ke `/login` |
| `/login` | `Login` | Halaman login |
| `/dashboard` | `Dashboard` | Daftar anime |
| `/detail/:id` | `Detail` | Detail anime, `:id` adalah parameter dinamis |
| `/profile` | `Profile` | Profil pengguna |
| `*` | `NotFound` | Semua URL yang tidak dikenal (404) |

**Komponen dan hook routing:**

| Nama | Fungsi |
|---|---|
| `IonReactRouter` | Router versi Ionic, menyediakan animasi perpindahan halaman ala mobile |
| `IonRouterOutlet` | Tempat halaman aktif ditampilkan |
| `Route` | Menghubungkan URL dengan komponen |
| `Navigate` | Mengalihkan (redirect) ke URL lain |
| `useNavigate()` | Pindah halaman lewat kode, misalnya setelah tombol diklik |
| `useParams()` | Mengambil parameter dari URL, seperti `:id` |
| `useLocation()` | Mengambil informasi URL saat ini, termasuk `state` |

**Pindah halaman lewat kode:**

```jsx
const navigate = useNavigate();
navigate("/detail/" + props.id);          // ke halaman detail
navigate(-1);                            // kembali ke halaman sebelumnya
navigate("/login", { replace: true });    // pindah tanpa menyimpan riwayat
```

`replace: true` mengganti riwayat halaman, sehingga tombol Back browser tidak kembali ke halaman sebelumnya. Contohnya setelah logout, pengguna tidak bisa kembali ke daftar anime dengan tombol Back.

**Parameter URL:** `Detail.jsx`

```jsx
const { id } = useParams();   // URL /detail/3 menghasilkan id = "3"
```

---

## 13. Mengirim Data Antar Halaman

Ada tiga cara pengiriman data antar halaman yang dipakai di aplikasi ini:

| Cara | Contoh | Kegunaan |
|---|---|---|
| **Parameter URL** | `/detail/3` dibaca dengan `useParams()` | Id anime untuk halaman detail |
| **Navigate state** | `navigate("/dashboard", { state: { name: user.name } })` dibaca dengan `useLocation().state` | Mengirim nama setelah login |
| **localStorage** | `getUser()` | Data login yang dipakai di semua halaman, tetap ada setelah refresh |

**Navigate state:** `Login.jsx` mengirim, `Dashboard.jsx` menerima.

```jsx
// Login.jsx
navigate("/dashboard", { replace: true, state: { name: user.name } });

// Dashboard.jsx
const location = useLocation();
location.state.name
```

Kelemahan navigate state adalah datanya hilang saat halaman di-refresh. Karena itu `Dashboard.jsx` mengutamakan data dari `localStorage` (lihat materi 16).

---

## 14. Side Effect dengan `useEffect`

**`useEffect`** menjalankan kode setelah komponen ditampilkan. Biasanya dipakai untuk mengambil data, membaca storage, atau memanggil API.

**Contoh:** `Dashboard.jsx`

```jsx
useEffect(() => {
  const user = getUser();
  if (user) {
    setName(user.name);
  } else if (location.state && location.state.name) {
    setName(location.state.name);
  }
}, [location]);
```

**Penjelasan:**
- Kode di dalamnya berjalan setelah halaman tampil.
- `[location]` adalah **dependency array**: efek dijalankan ulang setiap kali `location` berubah.
- Jika dependency array kosong `[]`, efek hanya berjalan sekali saat komponen pertama kali tampil.
- Nama diambil dari data login yang tersimpan, sehingga sapaan tetap benar setelah refresh atau setelah nama diubah di profil.

---

## 15. Login, Akun Test, dan Validasi

**Data akun:** `src/data/accounts.js`

```js
const accounts = [
  { username: "admin",  password: "admin123", name: "Admin",  email: "admin@animeku.com",  bio: "Pengelola AnimeKu." },
  { username: "anggia", password: "anime123", name: "Anggia", email: "anggia@animeku.com", bio: "Suka anime action dan fantasy." },
];
```

Akun test ini menggantikan database pengguna.

**Proses login:** `src/pages/Login.jsx`

```jsx
const buttonEnter = (e) => {
  e.preventDefault();

  // 1. Validasi: tidak boleh kosong
  if (username.trim() === "" || password === "") {
    setError("Username dan password wajib diisi");
    return;
  }

  // 2. Cocokkan dengan daftar akun
  const user = accounts.find((acc) => acc.username === username.trim() && acc.password === password);

  // 3. Jika tidak cocok, tampilkan error
  if (!user) {
    setError("Username atau password salah");
    setPassword("");
    return;
  }

  // 4. Jika cocok, simpan login lalu pindah halaman
  setError("");
  setUsername("");
  setPassword("");
  login(user);
  navigate("/dashboard", { replace: true, state: { name: user.name } });
};
```

**Penjelasan langkah:**
1. **Validasi input kosong.** `trim()` menghapus spasi di awal dan akhir, sehingga input berisi spasi saja tetap dianggap kosong.
2. **Pencocokan akun** dengan `find()`. Username **dan** password harus sama.
3. **Login gagal:** pesan error ditampilkan dan kolom password dikosongkan. `return` menghentikan fungsi agar tidak lanjut ke langkah berikutnya.
4. **Login berhasil:** data disimpan dengan `login(user)`, form dikosongkan, lalu pindah ke daftar anime.

**Catatan akun test** ditampilkan di bawah form login:

```jsx
<small className="text-secondary mt-4">
  Akun test: <b>admin</b> / <b>admin123</b> atau <b>anggia</b> / <b>anime123</b>
</small>
```

**Atribut `autoComplete`** (`username` dan `current-password`) membantu browser dan password manager mengenali kolom login.

---

## 16. Menyimpan Data dengan `localStorage`

**`localStorage`** adalah penyimpanan bawaan browser dalam bentuk pasangan key-value. Datanya tetap ada walaupun halaman di-refresh atau browser ditutup.

`localStorage` hanya bisa menyimpan **string**, sehingga objek harus diubah dulu:
- `JSON.stringify(objek)` mengubah objek menjadi string sebelum disimpan.
- `JSON.parse(string)` mengubah string kembali menjadi objek saat dibaca.

**File:** `src/data/auth.js`

```js
const KEY = "loggedUser";
const profileKey = (username) => "profile_" + username;

export const login = (user) => {
  const saved = JSON.parse(localStorage.getItem(profileKey(user.username)) || "{}");
  const data = {
    username: user.username,
    name: user.name,
    email: user.email,
    bio: user.bio,
    ...saved,
  };
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const logout = () => {
  localStorage.removeItem(KEY);
};

export const getUser = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const updateProfile = (changes) => {
  const user = getUser();
  if (!user) return null;
  const updated = { ...user, ...changes };
  localStorage.setItem(KEY, JSON.stringify(updated));
  localStorage.setItem(profileKey(user.username), JSON.stringify(changes));
  return updated;
};
```

**Fungsi-fungsinya:**

| Fungsi | Kegunaan |
|---|---|
| `login(user)` | Menyimpan data pengguna yang sedang login ke key `loggedUser`. Jika profil pernah diedit, data editan ikut dimuat. |
| `logout()` | Menghapus key `loggedUser`. |
| `getUser()` | Membaca pengguna yang sedang login. Mengembalikan `null` jika belum login. |
| `updateProfile(changes)` | Menyimpan perubahan profil. |

**Dua key yang dipakai:**
- `loggedUser` berisi pengguna yang sedang login (sesi). Dihapus saat logout.
- `profile_<username>`, misalnya `profile_admin`, berisi hasil edit profil. **Tidak** dihapus saat logout, sehingga perubahan profil tetap ada ketika login lagi.

**Spread operator `...`** menggabungkan objek. Pada `{ ...user, ...changes }`, properti di `changes` menimpa properti yang sama di `user`.

**Kenapa logika ini dipisah ke `auth.js`?** Agar logika login tidak tersebar di banyak file. Halaman cukup memanggil `login()`, `logout()`, atau `getUser()`.

Data `localStorage` bisa dilihat di browser: **DevTools (F12) → Application → Local Storage**.

---

## 17. Protected Route (Halaman yang Wajib Login)

Halaman daftar anime, detail, dan profil hanya boleh dibuka oleh pengguna yang sudah login.

**File:** `src/App.jsx`

```jsx
// Halaman yang hanya bisa dibuka setelah login
const RequireLogin = ({ children }) => (getUser() ? children : <Navigate to="/login" replace />);

// Halaman login, jika sudah login langsung diarahkan ke /dashboard
const GuestOnly = ({ children }) => (getUser() ? <Navigate to="/dashboard" replace /> : children);
```

**Cara pakai:**

```jsx
<Route path="/dashboard" element={<RequireLogin><Dashboard /></RequireLogin>} />
```

**Penjelasan:**
- `children` adalah komponen yang dibungkus, misalnya `<Dashboard />`.
- `RequireLogin`: jika sudah login, halaman ditampilkan. Jika belum, pengguna diarahkan ke halaman login.
- `GuestOnly`: kebalikannya. Pengguna yang sudah login tidak perlu melihat form login lagi.
- Ini contoh **komponen pembungkus (wrapper component)** yang memakai conditional rendering.

**Contoh kasus:** pengguna belum login lalu mengetik `/detail/3` di address bar. `RequireLogin` mendeteksi `getUser()` bernilai `null`, sehingga pengguna diarahkan ke `/login`.

---

## 18. Logout

Logout bisa dilakukan dari dua tempat: navbar (`TopBar.jsx`) dan halaman profil (`Profile.jsx`).

```jsx
const buttonLogout = () => {
  if (!window.confirm("Yakin ingin logout?")) return;
  logout();
  navigate("/login", { replace: true });
};
```

**Langkah:**
1. `window.confirm` menampilkan dialog konfirmasi. Jika pengguna memilih **Batal**, fungsi berhenti.
2. `logout()` menghapus data login dari `localStorage`.
3. Pengguna diarahkan ke halaman login. `replace: true` mencegah pengguna kembali ke halaman sebelumnya dengan tombol Back.

Tombol Logout di navbar hanya tampil jika pengguna sudah login (`{user && ...}`).

---

## 19. Halaman Profil dan Edit Profil

**File:** `src/pages/Profile.jsx`, dibuka lewat tombol **Profil** di navbar atau URL `/profile`.

**Fitur:**
- Avatar berupa huruf pertama nama: `user.name.charAt(0).toUpperCase()`.
- Menampilkan nama, `@username`, email, dan bio. Jika email atau bio kosong, ditampilkan `-` (`user.email || "-"`).
- Tombol **Edit Profil** mengubah tampilan menjadi form.
- Tombol **Simpan** menyimpan perubahan, dan tombol **Batal** mengembalikan isi form ke data semula.
- Tombol **Logout** dan **← Kembali**.

**Mode lihat dan mode edit** diatur dengan state `editing`:

```jsx
const [editing, setEditing] = useState(false);

{!editing ? ( /* info profil + tombol Edit Profil */ ) : ( /* form edit */ )}
```

**Menyimpan perubahan:**

```jsx
const buttonSave = (e) => {
  e.preventDefault();
  if (name.trim() === "") {
    setError("Nama tidak boleh kosong");
    return;
  }
  setError("");
  setUser(updateProfile({ name: name.trim(), email: email.trim(), bio: bio.trim() }));
  setEditing(false);
};
```

- Validasi: nama tidak boleh kosong.
- `updateProfile()` menyimpan ke `localStorage` dan mengembalikan data terbaru.
- `setUser(...)` memperbarui tampilan, lalu `setEditing(false)` kembali ke mode lihat.

**Membatalkan edit:**

```jsx
const buttonCancel = () => {
  setName(user.name);
  setEmail(user.email || "");
  setBio(user.bio || "");
  setError("");
  setEditing(false);
};
```

Isi form dikembalikan ke data yang tersimpan, jadi perubahan yang belum disimpan dibuang.

---

## 20. Styling: Ionic dan Bootstrap

**Komponen Ionic** yang dipakai:

| Komponen | Fungsi |
|---|---|
| `IonApp` | Pembungkus utama aplikasi Ionic |
| `IonPage` | Pembungkus setiap halaman, diperlukan untuk animasi perpindahan halaman |
| `IonContent` | Area isi halaman yang bisa di-scroll. `fullscreen` membuatnya memenuhi layar |
| `IonRouterOutlet` | Tempat halaman aktif ditampilkan |

`setupIonicReact()` di `App.jsx` wajib dipanggil sekali untuk menginisialisasi Ionic. File CSS Ionic (`core.css`, `normalize.css`, dan lainnya) di-import agar komponen Ionic tampil dengan benar.

**Bootstrap** di-import di `App.jsx`:

```jsx
import "bootstrap/dist/css/bootstrap.min.css";
```

**Class Bootstrap yang sering dipakai:**

| Class | Fungsi |
|---|---|
| `bg-dark`, `bg-danger`, `text-white`, `text-secondary` | Warna latar dan teks (tema gelap dan merah) |
| `min-vh-100` | Tinggi minimal setinggi layar |
| `d-flex`, `flex-column`, `justify-content-center`, `align-items-center`, `gap-2` | Layout flexbox |
| `container`, `row`, `col-6 col-md-4 col-lg-3` | Sistem grid responsif |
| `btn`, `btn-danger`, `btn-outline-light`, `btn-sm` | Tombol |
| `form-control`, `input-group` | Input form |
| `card`, `card-body`, `card-img-top` | Kartu anime |
| `badge` | Label rating, genre, dan tahun |
| `navbar`, `sticky-top` | Navbar yang tetap di atas saat scroll |
| `rounded-circle` | Avatar bulat di profil |
| `p-4`, `mb-3`, `mt-4`, `px-5` | Padding dan margin |

**Grid responsif** di daftar anime:

```jsx
<div className="col-6 col-md-4 col-lg-3">
```

- Layar HP: 2 kartu per baris (`col-6` = 6 dari 12 kolom).
- Layar tablet (`md`): 3 kartu per baris.
- Layar laptop (`lg`): 4 kartu per baris.

Dengan begitu tampilan menyesuaikan ukuran layar tanpa CSS tambahan.

---

## 21. Alur Lengkap Aplikasi

1. Pengguna membuka aplikasi di `/`, lalu diarahkan ke `/login` (halaman login).
2. Pengguna mengisi username dan password, lalu menekan **Masuk**.
   - Jika ada kolom yang kosong, muncul pesan "Username dan password wajib diisi".
   - Jika akun salah, muncul pesan "Username atau password salah".
   - Jika akun benar, data disimpan ke `localStorage` dan pengguna masuk ke `/dashboard`.
3. Di `/dashboard`, pengguna melihat sapaan "Halo, [nama]" dan daftar kartu anime.
   - Mengetik di kolom pencarian memfilter berdasarkan judul.
   - Menekan tombol genre memfilter berdasarkan genre.
   - Jika tidak ada hasil, muncul pesan "Anime tidak ditemukan".
4. Pengguna mengklik kartu anime, lalu masuk ke `/detail/:id` (detail).
   - Tampil gambar, judul, rating, genre, tahun, jumlah episode, sinopsis, dan daftar episode.
   - Tombol **← Kembali** kembali ke halaman sebelumnya.
5. Pengguna menekan **Profil** di navbar, lalu masuk ke `/profile`.
   - Pengguna bisa melihat dan mengedit nama, email, dan bio.
6. Pengguna menekan **Logout** dan mengonfirmasi. Data login dihapus, lalu pengguna kembali ke `/login`.
7. Jika pengguna membuka URL yang tidak ada, halaman **404** tampil dengan tombol kembali.

---

## 22. Keterbatasan dan Pengembangan Selanjutnya

**Keterbatasan saat ini:**
- Data anime dan akun disimpan di file JavaScript, bukan database, sehingga tidak bisa ditambah dari aplikasi.
- Password tersimpan sebagai teks biasa di kode, dan sesi login di `localStorage` bisa diubah lewat DevTools. Cara ini **tidak aman** untuk aplikasi sungguhan dan hanya cocok untuk latihan.
- Tombol tonton dan episode masih berupa simulasi (`alert`).
- Gambar diambil dari internet, sehingga perlu koneksi.

**Ide pengembangan:**
- Menggunakan **backend dan database** (misalnya Firebase, Laravel, atau Node.js) untuk akun dan data anime.
- Memakai **API anime publik** (misalnya Jikan API) dengan `fetch` di dalam `useEffect`.
- Menyimpan password dalam bentuk **hash** dan memakai **token** (misalnya JWT) untuk sesi login.
- Menambah fitur **registrasi**, **anime favorit**, dan **riwayat tontonan**.
- Membuat aplikasi Android dengan Capacitor (`npx cap add android`).

---

## 23. Contoh Pertanyaan Dosen dan Jawabannya

**Apa bedanya props dan state?**
Props adalah data yang dikirim dari komponen induk dan tidak boleh diubah oleh komponen penerima. State adalah data milik komponen itu sendiri dan bisa diubah dengan fungsi setter. Perubahan state membuat komponen di-render ulang.

**Kenapa memakai `key` di `map()`?**
Agar React bisa mengenali setiap item secara unik, sehingga update tampilan lebih efisien dan tidak salah urutan.

**Kenapa memakai `e.preventDefault()` di form?**
Karena form HTML secara bawaan me-reload halaman saat disubmit. Di SPA hal ini tidak diinginkan karena state akan hilang.

**Kenapa id dari URL diubah dengan `Number(id)`?**
Parameter URL selalu berbentuk string, sedangkan id di data berbentuk angka. Perbandingan `===` mengecek tipe data juga, jadi `"3" === 3` bernilai `false`.

**Kenapa data login disimpan di `localStorage`, bukan hanya di state?**
State hilang saat halaman di-refresh. `localStorage` tetap tersimpan di browser, sehingga pengguna tetap login setelah refresh.

**Bagaimana cara mencegah pengguna membuka halaman tanpa login?**
Dengan komponen `RequireLogin` di `App.jsx`. Komponen ini mengecek `getUser()`. Jika hasilnya `null`, pengguna dialihkan ke `/login` dengan `<Navigate />`.

**Kenapa memakai `replace: true` saat login dan logout?**
Agar halaman sebelumnya tidak tersimpan di riwayat. Setelah logout, tombol Back tidak bisa kembali ke halaman yang membutuhkan login.

**Apa fungsi `useEffect` di `Dashboard`?**
Membaca nama pengguna dari data login setelah halaman tampil, lalu menyimpannya ke state `name` untuk sapaan. Efek dijalankan ulang setiap kali `location` berubah.

**Apa itu SPA?**
Single Page Application, yaitu aplikasi yang hanya memuat satu halaman HTML. Perpindahan halaman diatur oleh JavaScript (React Router) tanpa reload, sehingga terasa cepat seperti aplikasi mobile.

**Apa peran Ionic jika styling sudah memakai Bootstrap?**
Ionic menyediakan struktur aplikasi mobile: router dengan animasi perpindahan halaman, `IonPage` dan `IonContent` yang menyesuaikan layar HP, serta integrasi Capacitor untuk dijadikan aplikasi Android/iOS. Bootstrap dipakai untuk mempercepat styling tampilan.
