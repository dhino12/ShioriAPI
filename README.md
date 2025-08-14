# ShioriAPI [Development] 🛠️

## Getting Started

```sh
npm init -y
```

```sh
npm install zod
npm install express
npm install --save-dev @types/express # autocomplete
npm install --save-dev prisma 
npm install winston
npm install bcrypt
npm install --save-dev @types/bcrypt # autocomplete
npm install --save-dev jest @types/jest # autocomplete
npm install --save-dev babel-jest @babel/preset-env
npm install --save-dev @babel/preset-typescript
npm install --save-dev @jest/globals
npm install --save-dev supertest @types/supertest # autocomplete
npm install --save-dev typescript
npm install uuid
npm install --save-dev @types/uuid # autocomplete
npm install jsonwebtoken 
npm install @types/jsonwebtoken # autocomplete

npx tsc --init
```

## Prisma 
Jalankan prisma sembari membuat model pada `schema.prisma` agar prisma generate secara otomatis model menjadi file migration, dengan perintah: 
```sh
$ npx prisma init # inisiasi prisma

# output =========
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Run prisma dev to start a local Prisma Postgres server.
2. Define models in the schema.prisma file.
3. Run prisma migrate dev to migrate your local Prisma Postgres database.
4. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and a managed serverless Postgres database. Read: https://pris.ly/cli/beyond-orm

More information in our documentatio

$ npx prisma migrate dev # jalankan prisma sembari membuat model di `schema.prisma`
```

Jika kita sudah memiliki file migration atau model di `schema.prisma`, lakukan perintah ini agar prisma generate file model / migration menjadi code prisma dengan perintah:

```sh
npx prisma generate
```
### Project Structure

```sh
├───dist
│   ├───app
│   ├───controller
│   │   └───auth
│   ├───dto
│   │   ├───request
│   │   └───response
│   ├───error
│   ├───helpers
│   ├───middlewares
│   ├───model
│   ├───repository
│   │   └───user
│   ├───service
│   │   └───auth
│   └───validation
├───docs
├───faker
├───prisma
│   └───migrations
│       ├───20250809081909_create_users_table
│       ├───20250809110551_create_all_table
│       └───20250811054707_remove_constraint_bookmark_comic
├───src
│   ├───app
│   ├───controller
│   │   ├───auth
│   │   └───bookmark
│   ├───dto
│   │   ├───request
│   │   └───response
│   ├───error
│   ├───helpers
│   ├───middlewares
│   ├───model
│   ├───repository
│   │   ├───bookmark
│   │   └───user
│   ├───service
│   │   ├───auth
│   │   └───bookmark
│   └───validation
└───tests
```

## CommonJS vs ESNEXT
Saat development (misal `ts-node` atau `editor`) kamu bisa import dengan `.ts` atau tanpa ekstensi <br>
TypeScript dan `ts-node` memahami ekstensi `.ts` dan akan resolve modul secara otomatis. Jadi, ini bisa jalan:

```ts
import { logger } from "./app/logging";

// atau
import { logger } from "./app/logging.ts";
```
dan ini masih oke karena tooling (`tsc`, `ts-node`) bisa resolve file `.ts` dengan mudah, dengan catatan pada tsconfig.json, kita harus menambahkan code ini. __Tapi ini hanya ⚠️ versi Typescript 5.0, keatas__
```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true, // ini
  }
}
```

Kalau target module adalah ES Module ("module": "esnext" atau "es6"), kamu harus pastikan di runtime import pakai ekstensi .js.
Jadi setelah build, kamu harus mengganti import jadi pakai `.js` — ini bisa dilakukan dengan:
- Bundler (`webpack`, `esbuild`, `rollup`) yang otomatis ubah ekstensi
- Atau tool transformasi post-build (contoh `tsc-alias`)
- Atau menggunakan plugin babel transformasi extensi dari .ts ke .js
- Atau manual import `.js` (tapi susah maintain)

Contoh konfigurasi di .bablerc:
```sh
npm i babel-plugin-transform-import-extension
```
```json
{
  "plugins": [
    ["transform-import-extension", { "extensions": [".ts", ".tsx"], "replace": ".js" }]
  ]
}
```
lalu jalankan build.
```sh
npm run build:tsc
```

Kalau mau praktis, __opsi populer__:
- Pakai `"module": "commonjs"` di `tsconfig` → di runtime Node.js cukup import tanpa ekstensi, karena commonjs resolve otomatis.
- Di development dan build, `import { ... } from './app/logging'` bisa jalan tanpa masalah.