# Tutorial

## Github Pages
Penggunaan github pages kebutuhan openapi.json agar lebih mudah diakses dan dapat menghindari `cors` https dari mockapi `postman mock`

- Masuk ke Settings repo → Pages
- Source → Deploy from branch
- Pilih main branch, lalu folder /docs
- Klik Save
- Tunggu 1 sampai 2 menit dan akses [shioriapi](https://dhino12.github.io/ahioriapi/)

## Postman Mock
### 1️⃣ Siapkan Collection
- Buka Postman → Collections
- Buat Collection baru → misalnya: ShioriAPI Mock
- Tambahkan semua request yang mau kamu mock (bisa import dari openapi.json):
  - Menu Import
  - Pilih file openapi.json
  - Postman akan otomatis generate collection dari spec itu.

### 2️⃣ Buat Mock Server
- Klik Collection → tombol ... (More actions) → Mock collection
- Pilih Create new mock server
- Tentukan:
  - Environment: (optional, bisa kosong)
  - Save responses from requests: ✅ centang kalau mau simpan contoh response
  - Make this mock server public: ✅ kalau mau diakses siapa saja
- Klik Create Mock Server

### 3️⃣ Dapatkan URL Mock
```sh
https://<random-id>.mock.pstmn.io
```

### 4️⃣ Tambahkan Example Response
Jika kamu punya example response sendiri kamu bisa menambahkannya sendiri dengan cara: 
- Buka salah satu request di collection, tepatnya klik `anak panah bawah (pada nama request)` atau `klik titik (:) tiga samping nama request`
- Klik tab `Examples` → `Add Example`
- Isi contoh body JSON sesuai schema (bisa dari openapi.json yang kamu punya)
- Simpan
- Kalau request itu dipanggil ke mock server URL, Postman akan balikin example yang sudah kamu set.