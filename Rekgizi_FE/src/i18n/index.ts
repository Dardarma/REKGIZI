import { computed, ref } from 'vue'

export type Locale = 'id' | 'en'

const STORAGE_KEY = 'rekgizi-locale'
const savedLocale = localStorage.getItem(STORAGE_KEY)

export const locale = ref<Locale>(savedLocale === 'en' ? 'en' : 'id')

// Hanya frasa antarmuka yang didaftarkan di sini. Data dari API tidak diterjemahkan.
const idToEn: Record<string, string> = {
  Menu: 'Menu',
  Beranda: 'Home',
  Home: 'Home',
  Dashboard: 'Dashboard',
  'Dashboard Ahli Gizi': 'Nutritionist Dashboard',
  Tentang: 'About',
  'Tentang Kami': 'About Us',
  Fitur: 'Features',
  'Fitur Kami': 'Our Features',
  Artikel: 'Articles',
  Article: 'Articles',
  'Artikel Kami': 'Our Articles',
  Daftar: 'Register',
  Masuk: 'Login',
  Keluar: 'Sign out',
  'Sign out': 'Sign out',
  'Rekam Medis': 'Medical Records',
  'Rekam medis': 'Medical Records',
  'Rekam Pasien': 'Patient Records',
  'Jadwal Temu': 'Appointments',
  'Janji Temu': 'Appointments',
  'Riwayat Janji Temu': 'Appointment History',
  'Buat Janji Temu': 'Create Appointment',
  'Buat Janji temu': 'Create Appointment',
  'Buat Jadwal': 'Create Schedule',
  Kalender: 'Calendar',
  Calender: 'Calendar',
  Asuhan: 'Nutrition Care',
  'Asuhan Baru': 'New Nutrition Care',
  'Cari Asuhan Lama': 'Find Previous Care',
  'Review Asuhan': 'Review Nutrition Care',
  'Master Data': 'Master Data',
  Parameter: 'Parameters',
  'Nama Parameter': 'Parameter Name',
  Diagnosa: 'Diagnosis',
  Intervensi: 'Intervention',
  intervensi: 'Intervention',
  Summary: 'Summary',
  Biodata: 'Personal Data',
  Nama: 'Name',
  'Name:': 'Name:',
  'Nama Pasien': 'Patient Name',
  Email: 'Email',
  Gender: 'Gender',
  'Gender:': 'Gender:',
  'Jenis Kelamin': 'Gender',
  Pria: 'Male',
  Wanita: 'Female',
  Tanggal: 'Date',
  'Tanggal Lahir': 'Date of Birth',
  'Tanggal Lahir:': 'Date of Birth:',
  'Tanggal Assessment': 'Assessment Date',
  'Tanggal Assesment': 'Assessment Date',
  'Tanggal Asesment': 'Assessment Date',
  Usia: 'Age',
  Alamat: 'Address',
  'Alamat:': 'Address:',
  'Alamat lengkap': 'Full address',
  Desa: 'Village',
  Kecamatan: 'District',
  Kota: 'City',
  'Kota/Kabupaten': 'City/Regency',
  Provinsi: 'Province',
  Role: 'Role',
  User: 'User',
  Pengguna: 'User',
  'Ahli Gizi': 'Nutritionist',
  Pasien: 'Patient',
  'Tenaga Kesehatan': 'Health Worker',
  Password: 'Password',
  'Konfirmasi Password': 'Confirm Password',
  'Password Confirm': 'Confirm Password',
  'Ingat saya': 'Remember me',
  'Remember me': 'Remember me',
  'Lupa password?': 'Forgot password?',
  'Forgot password?': 'Forgot password?',
  'Belum punya akun? Daftar': "Don't have an account? Register",
  "Don't have an account? Register": "Don't have an account? Register",
  'Sudah punya akun? Masuk': 'Already have an account? Login',
  'Already have an account? Login': 'Already have an account? Login',
  'Mendaftar...': 'Registering...',
  'Registering...': 'Registering...',
  Register: 'Register',
  Login: 'Login',
  Pilih: 'Select',
  Select: 'Select',
  'Pilih status': 'Select status',
  'Select Option': 'Select Option',
  Cari: 'Search',
  'Cari...': 'Search...',
  'Cari data...': 'Search data...',
  Tambah: 'Add',
  'Tambah Data': 'Add Data',
  Ubah: 'Edit',
  Edit: 'Edit',
  Hapus: 'Delete',
  Simpan: 'Save',
  Save: 'Save',
  'Save Changes': 'Save Changes',
  Batal: 'Cancel',
  Kembali: 'Back',
  Selanjutnya: 'Next',
  Sebelumnya: 'Previous',
  Aksi: 'Actions',
  Action: 'Actions',
  Nomor: 'No.',
  No: 'No.',
  Detail: 'Details',
  Status: 'Status',
  Pending: 'Pending',
  Diterima: 'Accepted',
  Ditolak: 'Rejected',
  Catatan: 'Notes',
  Hari: 'Day',
  Jam: 'Time',
  Bulan: 'Month',
  Tahun: 'Year',
  Januari: 'January',
  Februari: 'February',
  Maret: 'March',
  April: 'April',
  Mei: 'May',
  Juni: 'June',
  Juli: 'July',
  Agustus: 'August',
  September: 'September',
  Oktober: 'October',
  November: 'November',
  Desember: 'December',
  Senin: 'Monday',
  Selasa: 'Tuesday',
  Rabu: 'Wednesday',
  Kamis: 'Thursday',
  Jumat: 'Friday',
  Sabtu: 'Saturday',
  Minggu: 'Sunday',
  'Jadwal Tersedia': 'Available Schedule',
  'Belum ada jadwal tersedia': 'No schedule available yet',
  'Belum ada jadwal libur': 'No holiday schedule yet',
  'Start Time': 'Start Time',
  'End Time': 'End Time',
  'Day of Week': 'Day of Week',
  'Notifikasi Janji Temu': 'Appointment Notifications',
  'Detail Janji Temu': 'Appointment Details',
  'Tidak ada notifikasi': 'No notifications',
  'Lokasi:': 'Location:',
  'Location:': 'Location:',
  Judul: 'Title',
  Thumbnail: 'Thumbnail',
  Konten: 'Content',
  'Publish artikel': 'Publish article',
  'Jika tidak dicentang, artikel disimpan sebagai draft.':
    'If unchecked, the article will be saved as a draft.',
  'Drag & drop gambar di sini atau klik': 'Drag and drop an image here or click',
  'Uploading...': 'Uploading...',
  'Saving...': 'Saving...',
  'Artikel tidak ditemukan': 'No articles found',
  'Jenis Diet': 'Diet Type',
  'Jenis Diet:': 'Diet Type:',
  Tujuan: 'Goal',
  'Tujuan Diet': 'Diet Goal',
  'Tujuan Diet:': 'Diet Goal:',
  Prinsip: 'Principles',
  'Prinsip Diet': 'Diet Principles',
  'Prinsip Diet:': 'Diet Principles:',
  'Rencana Diet': 'Diet Plan',
  'Rencana Diet:': 'Diet Plan:',
  'Rencan Diet': 'Diet Plan',
  Energi: 'Energy',
  'Energi :': 'Energy:',
  Protein: 'Protein',
  'Protein :': 'Protein:',
  Karbohidrat: 'Carbohydrates',
  'Karbohidrat :': 'Carbohydrates:',
  Edukasi: 'Education',
  'Intervensi Edukasi:': 'Education Intervention:',
  Antropometri: 'Anthropometry',
  Biokimia: 'Biochemistry',
  'Fisik Klinis': 'Clinical Examination',
  Riwayat: 'History',
  Kategori: 'Category',
  'Tipe Input': 'Input Type',
  'Teks Bebas': 'Free Text',
  Angka: 'Number',
  Pilihan: 'Options',
  'Text Area': 'Text Area',
  'Benar/Salah': 'True/False',
  Important: 'Required',
  Benar: 'True',
  Salah: 'False',
  Ya: 'Yes',
  Tidak: 'No',
  Satuan: 'Unit',
  Jawaban: 'Answer',
  Kode: 'Code',
  'Hapus pilihan': 'Remove option',
  'Rekomendasi Diet Otomatis': 'Automatic Diet Recommendations',
  'Pemantauan Kesehatan': 'Health Monitoring',
  'Penyuluhan Edukasi': 'Nutrition Education',
  'Bantu tentukan rekomendasi diet pasien ginjal Secara Otomatis dengan sistem Kami':
    'Automatically determine diet recommendations for kidney patients with our system',
  'Selamat datang di Rekgizi AI, platform cerdas yang dirancang untuk membantu pasien penyakit ginjal mengatur pola makan dengan lebih mudah, aman, dan personal. Dengan teknologi kecerdasan buatan .':
    'Welcome to Rekgizi AI, an intelligent platform designed to help kidney patients manage their diet more easily, safely, and personally using artificial intelligence.',
  Berhasil: 'Success',
  'Berhasil!': 'Success!',
  Gagal: 'Failed',
  Peringatan: 'Warning',
  Konfirmasi: 'Confirmation',
  Error: 'Error',
  'Login berhasil': 'Login successful',
  'Login gagal': 'Login failed',
  'Ada masalah saat login': 'There was a problem logging in',
  'Register berhasil': 'Registration successful',
  'Register gagal': 'Registration failed',
  'Silakan login menggunakan akun kamu': 'Please log in using your account',
  'Ada masalah saat register': 'There was a problem registering',
  'Password dan konfirmasi password tidak sama': 'Password and confirmation do not match',
  'Data tidak ditemukan': 'No data found',
  'Tidak ada data': 'No data available',
  'Gagal mengambil data article': 'Failed to load articles',
  'Gagal mengambil data artikel': 'Failed to load the article',
  'Gagal mengambil summary': 'Failed to load the summary',
  'Gagal memuat artikel': 'Failed to load the article',
  'Gagal menyimpan artikel': 'Failed to save the article',
  'Gagal menghapus artikel': 'Failed to delete the article',
  'Gagal mengunggah gambar': 'Failed to upload the image',
  'Gagal mengupload gambar': 'Failed to upload the image',
  'Silahkan coba lagi': 'Please try again',
  'Terjadi kesalahan': 'An error occurred',
  'Terjadi kesalahan saat memuat artikel': 'An error occurred while loading the article',
  'Terjadi kesalahan saat mengupload gambar': 'An error occurred while uploading the image',
  'File tidak valid': 'Invalid file',
  'File harus berupa gambar': 'The file must be an image',
  'Data berhasil disimpan': 'Data saved successfully',
  'Data berhasil diubah': 'Data updated successfully',
  'Data gagal diubah': 'Failed to update data',
  'Data berhasil dihapus': 'Data deleted successfully',
  'Data berhasil disetujui': 'Data approved successfully',
  'Data gagal disetujui': 'Failed to approve data',
  'Prediksi intervensi berhasil dilakukan': 'Intervention prediction completed successfully',
  'Data belum lengkap': 'Incomplete data',
  'Data Belum Lengkap': 'Incomplete Data',
  'Pastikan semua data sudah terisi.': 'Make sure all fields are filled in.',
  'Simpan data?': 'Save data?',
  'Pastikan data sudah benar sebelum disimpan.': 'Make sure the data is correct before saving.',
  'Ya, Simpan': 'Yes, Save',
  'Ya, hapus': 'Yes, delete',
  'Yes, delete it!': 'Yes, delete it!',
  Tutup: 'Close',
  'Apakah Anda yakin?': 'Are you sure?',
  'Data akan dihapus secara permanen': 'The data will be permanently deleted',
  'Hapus Janji Temu': 'Delete Appointment',
  'Janji temu berhasil dihapus': 'Appointment deleted successfully',
  'Janji temu gagal dihapus': 'Failed to delete appointment',
  'Ajukan Jadwal': 'Request Schedule',
  'Berhasil mengajukan jadwal': 'Schedule requested successfully',
  'Gagal mengajukan jadwal': 'Failed to request schedule',
  'Pilih intervensi dulu': 'Select an intervention first',
  'Gagal mengambil detail janji temu': 'Failed to load appointment details',
  'Status janji temu berhasil diperbarui': 'Appointment status updated successfully',
  'Status janji temu gagal diperbarui': 'Failed to update appointment status',
  'Janji temu baru': 'New appointment',
  'Gagal mengambil data dashboard': 'Failed to load dashboard data',
  'Data untuk periode yang dipilih tidak dapat dimuat.':
    'Data for the selected period could not be loaded.',
  'Masukkan nama User': 'Enter user name',
  'Masukkan desa': 'Enter village',
  'Masukkan kecamatan': 'Enter district',
  'Masukkan kota': 'Enter city',
  'Masukkan provinsi': 'Enter province',
  'Alamat Lengkap': 'Full Address',
  'Tambahkan catatan': 'Add notes',
  'Masukkan judul artikel': 'Enter article title',
  'Masukan nama, alamat, email, tanggal lahir, atau alamat':
    'Enter a name, address, email, date of birth, or location',
  'Pilih Tanggal': 'Select Date',
  'Masukkan nama parameter': 'Enter parameter name',
  'Masukkan nilai normal': 'Enter normal value',
  'Select start time': 'Select start time',
  'Select end time': 'Select end time',
  'Belum ada jadwal tersedia.': 'There are no schedules available yet.',
  'Hari Senin': 'Monday',
  'Hari Selasa': 'Tuesday',
  'Hari Rabu': 'Wednesday',
  'Hari kamis': 'Thursday',
  'Hari Jumat': 'Friday',
  'Hari Sabtu': 'Saturday',
  'Hari Minggu': 'Sunday',
}

const enToId = Object.entries(idToEn).reduce<Record<string, string>>((translations, [id, en]) => {
  // Pertahankan terjemahan Indonesia pertama ketika beberapa label mempunyai padanan EN sama.
  translations[en] ??= id
  return translations
}, {})

Object.assign(enToId, {
  Home: 'Beranda',
  About: 'Tentang',
  Features: 'Fitur',
  Article: 'Artikel',
  Articles: 'Artikel',
  User: 'Pengguna',
  Summary: 'Ringkasan',
  Gender: 'Jenis Kelamin',
  Select: 'Pilih',
  'Select Option': 'Pilih Opsi',
  Action: 'Aksi',
  Actions: 'Aksi',
  'Sign out': 'Keluar',
  'Remember me': 'Ingat saya',
  'Forgot password?': 'Lupa password?',
  "Don't have an account? Register": 'Belum punya akun? Daftar',
  'Already have an account? Login': 'Sudah punya akun? Masuk',
  Register: 'Daftar',
  'Registering...': 'Mendaftar...',
  Login: 'Masuk',
  login: 'Masuk',
  'Sign up': 'Daftar',
  'Search...': 'Cari...',
  Save: 'Simpan',
  'Save Changes': 'Simpan Perubahan',
  'Start Time': 'Jam Mulai',
  'End Time': 'Jam Selesai',
  'Day of Week': 'Hari',
  'Location:': 'Lokasi:',
  'Name:': 'Nama:',
  'Date of Birth:': 'Tanggal Lahir:',
  'Full address': 'Alamat lengkap',
  'Confirm Password': 'Konfirmasi Password',
  Calender: 'Kalender',
  'Yes, delete it!': 'Ya, hapus',
  'Select start time': 'Pilih jam mulai',
  'Select end time': 'Pilih jam selesai',
  'Failed to fetch janji temu data.': 'Gagal mengambil data janji temu.',
  'Edit profile': 'Ubah profil',
})

const dynamicRules = [
  {
    id: /^Halaman (\d+) dari (\d+)$/,
    en: /^Page (\d+) of (\d+)$/,
    toEn: (match: RegExpMatchArray) => `Page ${match[1]} of ${match[2]}`,
    toId: (match: RegExpMatchArray) => `Halaman ${match[1]} dari ${match[2]}`,
  },
  {
    id: /^(.+) akan dihapus!$/,
    en: /^(.+) will be deleted!$/,
    toEn: (match: RegExpMatchArray) => `${match[1]} will be deleted!`,
    toId: (match: RegExpMatchArray) => `${match[1]} akan dihapus!`,
  },
  {
    id: /^Apakah kamu yakin ingin menghapus janji temu pada (.+)\?$/,
    en: /^Are you sure you want to delete the appointment on (.+)\?$/,
    toEn: (match: RegExpMatchArray) =>
      `Are you sure you want to delete the appointment on ${match[1]}?`,
    toId: (match: RegExpMatchArray) =>
      `Apakah kamu yakin ingin menghapus janji temu pada ${match[1]}?`,
  },
]

export function translateUiText(value: string, target: Locale = locale.value): string {
  const trimmed = value.trim()
  if (!trimmed) return value

  const exact = target === 'en' ? idToEn[trimmed] : enToId[trimmed]
  let translated = exact

  if (!translated) {
    for (const rule of dynamicRules) {
      const match = trimmed.match(target === 'en' ? rule.id : rule.en)
      if (match) {
        translated = target === 'en' ? rule.toEn(match) : rule.toId(match)
        break
      }
    }
  }

  if (!translated || translated === trimmed) return value
  return value.replace(trimmed, translated)
}

export function setLocale(nextLocale: Locale) {
  locale.value = nextLocale
  localStorage.setItem(STORAGE_KEY, nextLocale)
  document.documentElement.lang = nextLocale
  translateTree(document.body)
}

export function toggleLocale() {
  setLocale(locale.value === 'id' ? 'en' : 'id')
}

export const localeName = computed(() => (locale.value === 'id' ? 'Indonesia' : 'English'))

const translatedAttributes = ['placeholder', 'title', 'aria-label'] as const

function shouldSkip(node: Node): boolean {
  const parent = node instanceof Element ? node : node.parentElement
  return Boolean(
    parent?.closest('script, style, [data-no-translate], [contenteditable="true"], .ql-editor'),
  )
}

function translateNode(node: Node) {
  if (shouldSkip(node)) return

  if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
    const translated = translateUiText(node.nodeValue)
    if (translated !== node.nodeValue) node.nodeValue = translated
    return
  }

  if (!(node instanceof Element)) return

  for (const attribute of translatedAttributes) {
    const value = node.getAttribute(attribute)
    if (!value) continue
    const translated = translateUiText(value)
    if (translated !== value) node.setAttribute(attribute, translated)
  }
}

function translateTree(root: Node) {
  translateNode(root)
  if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment))
    return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    translateNode(node)
    node = walker.nextNode()
  }
}

let observer: MutationObserver | undefined

export function startUiTranslation() {
  document.documentElement.lang = locale.value
  translateTree(document.body)

  observer?.disconnect()
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateNode(mutation.target)
      if (mutation.type === 'attributes') translateNode(mutation.target)
      mutation.addedNodes.forEach(translateTree)
    }
  })
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...translatedAttributes],
  })
}
