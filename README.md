# Rekgizi

Rekgizi terdiri dari dua aplikasi:

- `Rekgizi_BE`: REST API FastAPI, SQLAlchemy, PostgreSQL, dan layanan Firebase Cloud Messaging (FCM).
- `Rekgizi_FE`: aplikasi Vue 3 + TypeScript yang dibangun dengan Vite dan Tailwind CSS.

## Prasyarat

- Python 3.11 atau 3.12 (direkomendasikan)
- Node.js 20 LTS atau 22 LTS beserta npm
- PostgreSQL 14 atau versi yang lebih baru
- Git
- Kredensial Firebase, hanya jika fitur push notification digunakan

## 1. Menyiapkan database PostgreSQL

Create database dengan nama `rekgizi`  atau jika ditulis dengan sql sebagai berikut: 

```sql
CREATE DATABASE rekgizi;
```

Format koneksi yang digunakan backend:

```text
postgresql+psycopg2://<username>:<password>@<host>:<port>/<database>
```

Contoh lokal: `postgresql+psycopg2://postgres:postgres@localhost:5432/rekgizi`. Jika username atau password memuat karakter khusus seperti `@`, `:`, `/`, atau `#`, encode karakter tersebut dalam format URL.

## 2. Menyiapkan backend

### ⚠️ Catatan Penting: Kompatibilitas Terminal (Khusus Windows)

**Jangan gunakan Git Bash, MinGW, atau MSYS** untuk mengelola *virtual environment* (`venv`) atau menjalankan proyek ini di Windows. Lingkungan tersebut sering kali menyebabkan error pembacaan *path*, masalah pada instalasi beberapa *library* Python, atau terminal menjadi tidak responsif (*hang*).

* **Rekomendasi Windows:** Gunakan **Command Prompt (CMD)** atau **PowerShell** bawaan.
* **Pengguna macOS / Linux:** Abaikan peringatan ini. Anda bisa menggunakan terminal bawaan (*Bash/Zsh*) seperti biasa tanpa kendala tersebut.

```powershell
cd Rekgizi_BE
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Untuk Linux/macOS, aktivasi virtual environment dengan `source .venv/bin/activate`.

Isi `.env` backend:

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | Ya | URL koneksi PostgreSQL untuk SQLAlchemy. |
| `SECRET_KEY` | Ya | Secret untuk menandatangani JWT. Gunakan nilai acak yang panjang. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Ya | Masa berlaku access token dalam menit. |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Tidak | Path ke JSON service account Firebase. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Tidak | Isi service account dalam satu string JSON; alternatif untuk deployment. |

Gunakan salah satu variabel Firebase, jangan keduanya. Tanpa Firebase, fitur push notification dinonaktifkan tetapi API lainnya tetap dapat berjalan.

Jalankan migrasi dari direktori `Rekgizi_BE`:

```powershell
python migrate.py
```

Seeder bersifat opsional. Jalankan setelah migrasi.

Untuk data dummy production minimal:

```powershell
python -m app.seeder.production_dummy_seed
```

Seeder ini mengisi master parameter beserta opsi, master intervensi, 1 akun admin, dan 1 akun ahli gizi. Password default akun dummy adalah `password`.

Untuk data preview/demo fitur yang lebih lengkap:

```powershell
python -m app.seeder.preview_dummy_seed
```

Seeder preview menjalankan data production dummy, menambah user preview, diagnosis, artikel, pasien dataset, dan rekam medis simulasi.

### Akun demo hasil seeder

Gunakan akun berikut untuk login setelah menjalankan seeder:

| Seeder | Role | Email | Password |
| --- | --- | --- | --- |
| `production_dummy_seed` atau `preview_dummy_seed` | Admin | `admin@example.com` | `password` |
| `production_dummy_seed` atau `preview_dummy_seed` | Ahli gizi | `ahligizi@example.com` | `password` |
| `preview_dummy_seed` atau `user_seed` | Pasien | `user@example.com` | `password` |
| `dataset_pasien_seed` atau `preview_dummy_seed` | Pasien dataset | `pasien.dataset.001@example.com` sampai `pasien.dataset.020@example.com` | `password` |

File `Rekgizi_BE/data user.txt` berisi contoh payload registrasi manual untuk pasien dan ahli gizi jika ingin mencoba endpoint register/create user.

Jika ingin menjalankan seeder satu per satu, `parameter_seed` harus dijalankan sebelum `opsi_parameter_seed`:

```powershell
python -m app.seeder.parameter_seed
python -m app.seeder.opsi_parameter_seed
python -m app.seeder.Diagnosa_seed
python -m app.seeder.user_seed
python -m app.seeder.intervensi_seed
python -m app.seeder.article
python -m app.seeder.dataset_pasien_seed
```

Untuk mengisi master parameter, opsi, diagnosis, serta 20 pasien beserta rekam medisnya dalam satu langkah:

```powershell
python -m app.seeder.dataset_pasien_seed
```

`dataset_pasien_seed` membaca dataset klinis yang disertakan di backend dan otomatis menjalankan seeder parameter, opsi parameter, serta diagnosis terlebih dahulu. Seeder membuat akun `pasien.dataset.001@example.com` sampai `pasien.dataset.020@example.com` dengan password development `password`. Saat dijalankan ulang, akun lama berdomain `@rekgizi.test` otomatis diperbarui tanpa membuat user duplikat. Tanggal lahir dibuat bervariasi sesuai kelompok usia, jenis kelamin dibuat bergantian karena kedua nilai tersebut tidak tersedia di CSV, nilai parameter null dilewati, dan usia yang tidak tersedia diasumsikan 45 tahun.

Jalankan API:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API tersedia di `http://127.0.0.1:8000/api/v1` dan dokumentasi OpenAPI di `http://127.0.0.1:8000/docs`.

### Library Python

Versi kompatibel dicatat di `Rekgizi_BE/requirements.txt`.

| Library | Fungsi |
| --- | --- |
| FastAPI, Uvicorn, Starlette | API HTTP dan development server. |
| SQLAlchemy, psycopg2-binary | ORM dan koneksi PostgreSQL. |
| Pydantic, email-validator | Validasi request/response dan alamat email. |
| python-dotenv | Membaca konfigurasi `.env`. |
| python-jose, PyJWT, Passlib, bcrypt, argon2-cffi | JWT dan hashing password. |
| python-multipart | Upload file melalui form multipart. |
| firebase-admin | Mengirim push notification FCM dari backend. |
| NumPy, pandas, scikit-learn, joblib | Memuat dan menjalankan pipeline machine learning. |
| Requests | HTTP client dan tipe session yang digunakan aplikasi. |

## 3. Menyiapkan frontend

Buka terminal baru:

```powershell
cd Rekgizi_FE
npm ci
Copy-Item .env.example .env
```

Isi `.env` frontend:

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `VITE_API_URL` | Ya | Origin backend lengkap dengan port, contoh `http://localhost:8000` atau `http://127.0.0.1:8000`. |
| `VITE_FIREBASE_API_KEY` | Untuk FCM | Firebase Web API key. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Untuk FCM | Firebase auth domain. |
| `VITE_FIREBASE_PROJECT_ID` | Untuk FCM | Firebase project ID. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Untuk FCM | Firebase storage bucket. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Untuk FCM | Firebase sender ID. |
| `VITE_FIREBASE_APP_ID` | Untuk FCM | Firebase web app ID. |
| `VITE_FIREBASE_VAPID_KEY` | Untuk FCM | Public VAPID key untuk Web Push. |

Penting: backend default dijalankan pada port `8000`, jadi `.env` frontend harus mengarah ke `VITE_API_URL=http://localhost:8000` jika mengikuti perintah Uvicorn di README ini. Jangan hanya mengisi `http://localhost`, `http://127.0.0.1`, atau port frontend `5173`, karena request API dari frontend akan gagal menuju backend.

Semua variabel berawalan `VITE_` dikirim ke browser. Jangan menaruh service account, private key, atau secret backend di frontend.

```powershell
npm run dev
```

Frontend tersedia di `http://localhost:5173`. Origin ini juga merupakan origin yang saat ini diizinkan oleh CORS backend.

Perintah lainnya:

```powershell
npm run type-check
npm run build
npm run preview
npm run lint
```

### Library npm runtime

- Vue 3, Vue Router, Axios, js-cookie
- Tailwind CSS Forms dan Typography
- FullCalendar (core, day grid, time grid, list, interaction, dan adapter Vue 3)
- ApexCharts dan vue3-apexcharts
- Firebase
- Flatpickr dan vue-flatpickr-component
- Quill, SweetAlert2, Swiper, vuedraggable
- Lucide Vue Next, lodash.debounce
- Dropzone, JSVectorMap, vuevectormap

### Library npm development

- Vite, plugin Vue, plugin Vue JSX, dan Vue DevTools
- TypeScript, vue-tsc, dan konfigurasi tipe Vue/Node
- ESLint beserta konfigurasi Vue, TypeScript, dan Prettier
- Prettier
- Tailwind CSS, PostCSS, dan Sass Embedded
- npm-run-all2

Versi lengkap berada di `Rekgizi_FE/package.json` dan dikunci oleh `package-lock.json`.

## 4. Urutan menjalankan aplikasi

1. Pastikan PostgreSQL aktif.
2. Jalankan backend dengan Uvicorn pada port `8000`.
3. Jalankan frontend dengan Vite pada port `5173`.
4. Buka `http://localhost:5173`.

## Catatan keamanan

- Jangan commit `.env` atau JSON service account Firebase.
- Simpan service account di luar repository dan arahkan `FIREBASE_SERVICE_ACCOUNT_PATH` ke lokasi tersebut.
- Jika kredensial pernah masuk ke Git, cabut/rotasi key lalu bersihkan riwayat repository sesuai prosedur tim.
- Ganti password akun hasil seeder sebelum digunakan di luar lingkungan development.
