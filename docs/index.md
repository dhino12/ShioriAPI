# Documentation

- [Documentation API](./openapi.html)
- [Detail Documentation API](https://github.com/dhino12/shioriapi)
- [Tutorial Deploy Documentation, GithubPages, Postman Mock, dll](./tutorial.md)

## 📖 Panduan Kontribusi Scraper

Sebelum mulai berkontribusi, pahami dulu struktur proyek ini. Tujuannya agar kode tetap reusable dan clean.

```sh
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
│   │   ├───db
│   │   │   ├───bookmark
│   │   │   └───user
│   │   └───scraper
│   │       └───strategies # fokus ke folder ini
│   │       └───factory-scraper.ts # fokus ke file ini
│   ├───service
│   │   ├───auth
│   │   └───bookmark
│   └───validation
└───tests
```

- 👉 Fokus kontribusi kamu hanya di folder `repository/scraper/strategies`

## 🛠️ Cara Menambahkan File Scraper Baru
- Buat file baru di folder `repository/scraper/strategies/` dengan format:

```sh
namawebsite-scraper.ts

# contoh
hayuk-scraper.ts
```

- Implementasikan interface `IComicScraper` __(wajib)__. Kamu bisa extend dari RootScraper (opsional).

```ts
export class HayukScraper extends RootScraper implements IComicScraper {
    async getTextListComics(page: string): Promise<ComicModel[]> {}
    async getComicsByGenreSlug(slug: string, page: string): Promise<GenreModel> {}
    async getGenres(): Promise<GenreModel[]> {}
    async getComicBySlug(slug: string): Promise<ComicModel> {}
    async getComicLatest(pages: string): Promise<ComicModel[]> {}
}
```
- Setiap method harus return sesuai tipe data. Misalnya, `getTextListComics` wajib `return Promise<ComicModel[]>`.

```ts
export class HayukScraper extends RootScraper implements IComicScraper {
    async getTextListComics(page: string): Promise<ComicModel[]> {}
    async getComicsByGenreSlug(slug: string, page: string): Promise<GenreModel> {}
    async getGenres(): Promise<GenreModel[]> {}
    async getComicBySlug(slug: string): Promise<ComicModel> {}
    async getComicLatest(pages: string): Promise<ComicModel[]> {}
}
```

- Kamu dapat mengembalikan hasil `(return)` sesuai dengan type pada setiap function contohnya pada method `getTextListComics` dia meminta return wajiblah Promise dengan type ComicModel Array, maka hasil dari return akan menjadi seperti ini

```ts
// contoh 1
async getTextListComics(page: string): Promise<ComicModel[]> {
    const htmlStrng = await httpClient.get("https://kiryuu02.com/manga/list-mode")
    const $ = parseHTMLCheerIO(htmlStrng.data);
    const comics: ComicProperties[] = []; // ComicProperties sudah mewakili isi dari ComicModel

    $(".soralist .blix").each((_, container) => {
        const groupName = $(container).find("span a").text().trim();
        $(container).find("li a").each((_, el) => {
            const $a = $(el);
            comics.push({ // lalu push semua text dari web scraper, kedalam sebuah array.
                id: $a.attr("rel") ?? "", // sesuaikan dengan ComicProperties
                title: $a.text().trim(), // sesuaikan dengan ComicProperties
                title_alternative: `Group by ${groupName}`, // sesuaikan dengan ComicProperties
                slug: $a.attr("href")?.split("/")[4] ?? "", // sesuaikan dengan ComicProperties
            });
        });
    });

    return comics as ComicModel[]; // lalu konversikan saja ke ComicModel[] bahwa isi dari variable ini adalah sama seperti ComicModel[]
}
```

```ts
// contoh 2
async getComicsByGenreSlug(slug: string, page: string): Promise<GenreModel> {
    const htmlStrng = await httpClient.get(`https://kiryuu02.com/genres/${slug}/page/${page}`)
    const document = parseHTML(await htmlStrng.data);
    const comicContainers = document.querySelectorAll(".listupd .bs")
    const limit = pLimit(10); // rate-limit 5 request per detik
    const comicsData: ComicProperties[] = await Promise.all(Array.from(comicContainers).map(container =>
            limit(async () => { // kita akan map, variable comicContainers yang berisi array, dan otomatis ktika return akan push kedalam array ComicProperties
                const title = container.querySelector(".tt")?.textContent.trim();
                const slugComic = container.querySelector(".bsx a")?.getAttribute("href")?.split("/")[4];
                const thumbnailURL = container.querySelector(".limit img")?.getAttribute("src");
                const status = container.querySelector(".limit span.status")?.getAttribute("class")?.replace("status ", "").toLowerCase() ?? "ongoing";
                const type = container.querySelector(".limit span.type")?.getAttribute("class")?.split(" ")[1] ?? "";
                const rating = container.querySelector(".rating .numscore")?.textContent;
                const chapter = container.querySelector(".adds .epxs")?.textContent
                return { // return / push otomatis,
                    title, // sesuaikan dengan ComicProperties
                    slug: slugComic, // sesuaikan dengan ComicProperties
                    status, // sesuaikan dengan ComicProperties
                    chapters: [{ // sesuaikan dengan ComicProperties
                        slug: chapter?.toLowerCase()?.replace(" ", "-") ?? "", // sesuaikan dengan ComicProperties
                        title: chapter ?? "", // sesuaikan dengan ComicProperties
                        created_at: chapter ?? "", // sesuaikan dengan ComicProperties
                        link: `https://kiryuu02.com/${slugComic}-${chapter?.toLowerCase()?.replace(" ", "-")}/` // sesuaikan dengan ComicProperties
                    }], // sesuaikan dengan ComicProperties
                    thumbnail_url: thumbnailURL ?? "", // sesuaikan dengan ComicProperties
                    type: type ?? "", // sesuaikan dengan ComicProperties
                    rating: rating ?? "", // sesuaikan dengan ComicProperties
                } as ComicProperties;
            })
        )
    );
    
    // Jika ada yang kosong, maka gunakan saja mapper, contohnya toGenreModel, semua mapper ada di folder helpers/mapper.ts
    // tinggal di sesuaikan hingga mirip seperti dokumentasi openapi.json.
    // gunakan saja function toGenreModel({}), dan kamu tinggal menyesuaikan apa yang diminta
    // function ini kamu bisa melihat di folder helpers/mappers.ts
    return toGenreModel({
        data: {
            id: "",
            slug,
            name: capitalize(slug),
            comics: comicsData
        }
    }) as GenreModel
}
```

> Note ℹ️ : Jika ada field yang kosong gunakan saja mapper, jika tidak ada maka convert saja seperti ini  <br>
> `{id:"1", slug:"2", name:"3", comics: []} as GenreModel` seperti contoh 1 <br>
> hal ini untuk memastikan agar semua data sesuai dengan endpoint [openapi.json](https://dhino12.github.io/shioriapi/openapi.html)

## 🔗 Daftarkan Scraper Baru di `factory-scraper.ts`

Jika sudah selesai pada webscraping, kamu harus menambahkan web apa yang ingin kamu scrape di file `repository/scraper/factory-scraper.ts`

```ts
export function getScraper(domain: string): IComicScraper {
    switch (true) {
        case domain.includes("kiryuu"):
            return new KiryuuScraper();
        case domain.includes("tambahkan saja disini nama website apa yang kamu scrape"):
            return new HayukScraper(); // lalu inisiasi Class yang baru kamu buat tadi, dsini
        default:
            throw new ResponseError(404,"No scraper available for this domain");
    }
}
```

## 🧪 Test
Ada 2 cara untuk melakukan test, __pertama__, kamu bisa test langsung di endpoint [openapi.json](https://dhino12.github.io/shioriapi/openapi.html) dan ikuti instruksi pada dokumentasi disana, lalu cara __kedua__ dengan folder test / unittest, seperti pada file `comic.test.ts`, contoh code ini.

```ts
describe('GET /comics/latest', () => {
    it("should able to get chapters by chapter slug if request domain valid", async() => {
        const response = await supertest(web)
            .get("/api/v1/kiryuu/comics/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken/chapters/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken-chapter-26-3/") // endpoint yang sesuai dengan openapi.json
        logger.debug(response.body, null, 2)
        expect(response.status).toBe(200)
    })
})
```

✅ Ringkasan Step Kontribusi

1. Buat file scraper baru di repository/scraper/strategies/.
2. Implementasikan IComicScraper + seluruh method.
3. Return hasil sesuai tipe data (gunakan ComicModel, GenreModel, dll).
4. Daftarkan scraper barumu di factory-scraper.ts.

Selesai 🎉