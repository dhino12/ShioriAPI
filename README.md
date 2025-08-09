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