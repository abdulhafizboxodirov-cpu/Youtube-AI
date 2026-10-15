# Umid Abdullayev — Portfolio & Interactive AI Twin 🤖💼

> **Pepito** bolalar mahsulotlari do'konlari tarmog'i asoschisi va rahbari **Umid Abdullayevning** shaxsiy portfolio va interaktiv Sun'iy Intellekt Egizagi (AI Twin) veb-platformasi.

Ushbu loyiha **Dual-Target** arxitekturasi asosida yaratilgan:
1. **Lokal rejim**: Node.js & Express serveri orqali to'liq ishlaydi.
2. **Serverless rejim**: Netlify Functions (AWS Lambda) orqali Netlify platformasiga 100% serverless tarzda deploy qilinadi.

---

## 🌟 Asosiy Xususiyatlar

- **🤖 AI Twin (Sun'iy Intellekt Egizagi)**: DeepSeek v4 Pro modeli orqali Umid Abdullayev nomidan birinchi shaxsda ("men", "bizning jamoa") savollarga to'g'ri va xolis javob beruvchi intellektual tizim.
- **🛡️ Qat'iy Ma'lumotlar Bazasi & Fallback Qoidasi**: Faqat tasdiqlangan CV bazasiga tayanadi. Noma'lum yoki begona savollarga avtomatik xolis javob qaytaradi.
- **🎨 Premium Dark UI & Glassmorphism**: Neon aksentlar (Indigo `#6366F1` & Emerald `#10B981`), Outfit va Inter shriftlari, silliq animatsiyalar.
- **📍 Toshkent Bo'ylab 21 Filial**: Tumanlar bo'yicha saralash, aniq mo'ljallar, yagona koll-markaz va ish vaqtlari.
- **⚡ Dual Deployment Ready**: `netlify.toml` va `netlify/functions/chat.js` orqali Netlify'da to'g'ridan-to'g'ri ishga tushirish imkoniyati.

---

## 🛠️ Texnologiyalar Steki

- **Backend**: Node.js, Express.js, `dotenv`
- **AI SDK**: OpenAI SDK (`baseURL: https://api.deepseek.com`, model: `deepseek-v4-pro`)
- **Serverless**: Netlify Functions (`netlify/functions/chat.js`)
- **Frontend**: Vanilla HTML5, CSS3 (Modern Glassmorphism & Custom Properties), JavaScript (ES6+)

---

## 🚀 O'rnatish va Lokal Ishga Tushirish

### 1. Repozitoriyni klonlash:
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Bog'liqliklarni o'rnatish:
```bash
npm install
```

### 3. Muhit o'zgaruvchilarini sozlash:
`.env.example` faylidan nusxa olib, `.env` faylini yarating va DeepSeek API kalitingizni kiriting:
```bash
cp .env.example .env
```
`.env` fayl tarkibi:
```env
DEEPSEEK_API_KEY=sk-your_api_key_here
PORT=3000
```

### 4. Serverni ishga tushirish:
```bash
npm start
```
Brauzerda oching: `http://localhost:3000`

---

## ⚡ Vercel'ga Deploy Qilish (Tavsiya etiladi)

Loyiha Vercel Serverless arxitekturasiga 100% moslashtirilgan (`api/chat.js` va `vercel.json` mavjud).

### 1-usul: Vercel Dashboard (GitHub orqali):
1. Repozitoriyni GitHub'ga yuklang (`git push origin main`).
2. [Vercel Dashboard](https://vercel.com/) ga kiring va **"Add New Project"** tugmasini bosing.
3. GitHub repozitoriyingizni tanlang (**Import**).
4. **Environment Variables** bo'limida:
   - **Key**: `DEEPSEEK_API_KEY`
   - **Value**: O'zingizning DeepSeek API kalitingiz (`sk-...`)
5. **Deploy** tugmasini bosing! Bir necha soniyada saytingiz jonli efirga chiqadi.

### 2-usul: Vercel CLI orqali:
```bash
# Vercel'ga login qilish va deploy qilish
vercel
# Prodakshen deploy qilish
vercel --prod
```

---

## ☁️ Netlify'ga Deploy Qilish

1. Repozitoriyni GitHub'ga yuklang (`git push origin main`).
2. [Netlify](https://app.netlify.com/) tizimiga kiring va ushbu GitHub repozitoriyni ulang.
3. Build sozlamalari avtomatik `netlify.toml` orqali o'qiladi:
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
4. Netlify Dashboard -> **Site configuration** -> **Environment variables** bo'limida:
   - Kalit: `DEEPSEEK_API_KEY`
   - Qiymat: O'zingizning haqiqiy DeepSeek API kalitingiz
5. **Deploy Site** tugmasini bosing!

---

## 📁 Loyiha Tuzilmasi

```
├── .env.example                 # Muhit o'zgaruvchilari namunasi
├── .gitignore                   # Maxfiy fayllar va node_modules himoyasi
├── package.json                 # Loyiha konfiguratsiyasi va dependensiyalar
├── server.js                    # Express lokal serveri & AI API endpointi
├── vercel.json                  # Vercel routing va static fayllar sozlamasi
├── api/
│   └── chat.js                  # Vercel Serverless Function (/api/chat)
├── netlify.toml                 # Netlify routing va build konfiguratsiyasi
├── netlify/
│   └── functions/
│       └── chat.js              # Netlify Serverless Lambda funksiyasi
├── public/
│   └── index.html               # Asosiy responsive UI dashboard va AI Twin
└── README.md                    # Loyiha qo'llanmasi
```

---

## 📄 Litsenziya
Ushbu loyiha shaxsiy portfolio va AI Twin sifatida yaratilgan.
Barcha huquqlar himoyalangan © 2026 Umid Abdullayev.
