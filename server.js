const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Diagnostic log on startup
const apiKey = process.env.DEEPSEEK_API_KEY;
if (apiKey && apiKey !== 'your_deepseek_api_key_here') {
  console.log(`[DIAGNOSTIC] DEEPSEEK_API_KEY muvaffaqiyatli aniqlandi: ${apiKey.substring(0, 6)}...`);
} else {
  console.log('[DIAGNOSTIC] DIQQAT: DEEPSEEK_API_KEY sozlanmagan yoki standart holatda qolgan (.env faylini tekshiring)!');
}

// Initialize OpenAI client for DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'missing-key',
  baseURL: 'https://api.deepseek.com'
});

// Middleware
app.use(express.json());

// Dynamic discovery of root portrait image
function findRootPortraitImage() {
  try {
    const files = fs.readdirSync(__dirname);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    // 1. Check for specific portrait/cv image names
    const preferredPattern = /(cv[-_ ]?image|portrait|profile|avatar|umid)/i;
    let match = files.find(f => preferredPattern.test(f) && validExtensions.includes(path.extname(f).toLowerCase()));
    
    // 2. Check for any image that is not logo
    if (!match) {
      match = files.find(f => validExtensions.includes(path.extname(f).toLowerCase()) && !f.toLowerCase().includes('logo'));
    }

    // 3. Any image in root
    if (!match) {
      match = files.find(f => validExtensions.includes(path.extname(f).toLowerCase()));
    }

    return match ? path.join(__dirname, match) : null;
  } catch (err) {
    return null;
  }
}

// Serve root portrait image at /cv-image.jpg
app.get('/cv-image.jpg', (req, res) => {
  const rootImg = findRootPortraitImage();
  if (rootImg && fs.existsSync(rootImg)) {
    return res.sendFile(rootImg);
  }
  const publicFallback = path.join(__dirname, 'public', 'cv-image.jpg');
  if (fs.existsSync(publicFallback)) {
    return res.sendFile(publicFallback);
  }
  res.status(404).send('Rasm topilmadi');
});

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Extracted CV Database content
const CV_DATABASE_TEXT = `
HUJJAT: Pepito — kompaniya haqida (Rahbar: Umid Abdullayev)

ASOSIY MA'LUMOTLAR:
- Shaxs / Nomzod: Umid Abdullayev
- Lavozim / Kasb: Pepito bolalar mahsulotlari do'konlari tarmog'i rahbari va asoschisi (Founder & CEO)
- Tashkil topgan yili: 2024-yil
- Filiallar tarmog'i: Toshkent shahrida 21 ta filial (barcha asosiy tumanlarda faoliyat yuritadi)
- Ish vaqti: Har kuni 09:00 dan 00:00 gacha uzluksiz
- Kompaniya jamoasi: 100 nafargacha xodim (sotuvchi-kassirlar, konsultantlar, ombor xodimlari, kuryerlar, moliya va logistika bo'limi mutaxassislari). Xodimlarning ichki karyera o'sishi qo'llab-quvvatlanadi (ombordan boshlab rahbarlikkacha).

KOMPANIYA FALSAFASI VA ASOSIY QADRIYATLARI:
1. Qulaylik: Shahar bo'ylab har bir tuman va mahallaga yaqin filiallar, 09:00 dan 00:00 gacha uzoq ish vaqti, uyga tezkor yetkazib berish xizmati.
2. Tanlov: Har bir oilaning byudjetiga mos uch toifadagi (premium, o'rta va arzon/hamyonbop) brendlar assortimenti.
3. G'amxo'rlik: Yosh ota-onalarga ona va bola parvarishi bo'yicha bepul va tushunarli maslahat beruvchi malakali konsultantlar xizmati.

ASOSIY MAHSULOT TOIFALARI (4 TA GURUH):
1. Bolalar ozuqasi: Sut aralashmalari, bo'tqalar, pyurelar, sharbatlar.
2. Tagliklar: Oddiy tagliklar, taglik-trusiklar, yangi tug'ilgan chaqaloqlar uchun maxsus tagliklar.
3. Gigiyena vositalari: Nam salfetkalar, bolalar kremlari, shampun va cho'milish vositalari.
4. Aksessuarlar: Butilkalar, so'rg'ichlar, bolalar idishlari va parvarish buyumlari.

XIZMATLAR VA INNOVATSIYALAR:
- Konsultant mutaxassislar: Birinchi farzandini tarbiyalayotgan yosh ota-onalarga to'g'ri mahsulot va gigiyena buyumlarini tanlashda ko'maklashadi.
- Yetkazib berish (Dastavka): Uyga pullik yetkazib berish xizmati chaqaloq bilan uydan chiqishga qiynaladigan onalarga qulaylik yaratadi.
- Onlayn buyurtma va aloqa: Instagram rasmiy sahifasi, Telegram bot va Telegram kanali.
- Bonus va keshbek kartasi: Doimiy xaridorlar uchun har bir xariddan bonus jamg'arish va sarflash imkoniyati.

FILIALLAR (OCHIQ MA'LUMOTLARDAGI MANZILLAR):
- Shayxontohur tumani: Ko'kcha Darvoza ko'chasi, 337 (Mo'ljal: 40-maktab, Ko'kcha masjidi)
- Yunusobod tumani: Yunusobod-11, Yangishahar ko'chasi, 16 (Mo'ljal: Mega Planet savdo markazi)
- Olmazor tumani: Keles yo'li ko'chasi (Mo'ljal: Mevazor supermarketi)
- Chilonzor tumani: Chilonzor-11, Qatortol ko'chasi (Mo'ljal: Shuhrat chorrahasi)
- Mirzo Ulug'bek tumani: Xirmontepa ko'chasi, 34B (Mo'ljal: Media Park Gorkiy)
- Sergeli tumani: Sergeli-7, Shokirariq ko'chasi (Mo'ljal: Mudarris xususiy maktabi)
- Yangihayot tumani: Uzar ko'chasi, 84 (Mo'ljal: 124-bolalar bog'chasi)
- Uchtepa tumani: Farhod chorrahasi hududi (Mo'ljal: Farhod chorrahasi)

ALOQA VA BIZNES KO'RSATKICHLARI:
- Yagona koll-markaz telefoni: 78 555 04 00
- Bozor tahlili: O'zbekistonda tug'ilish ko'rsatkichining yuqoriligi, yirik shaharlarda talabning barqaror o'sishi, narxga sezgir xaridorlar uchun moslashuvchan narx siyosati.
- Rejalar: Filiallar sonini yanada ko'paytirish, onlayn buyurtma va logistika qamrovini kengaytirish.
`;

const SYSTEM_PROMPT = `Siz Umid Abdullayevning rasmiy Sun'iy Intellekt Egizagisiz (AI Twin).
Siz faqat va faqat birinchi shaxs nomidan ("men", "mening", "bizning kompaniyamiz", "tajribam", "jamoam") javob berasiz.
Sizning shaxsingiz: Umid Abdullayev — "Pepito" bolalar mahsulotlari do'konlari tarmog'i rahbari va asoschisi.

Qat'iy qoidalar:
1. FAQAT quyidagi taqdim etilgan CV/kompaniya ma'lumotlar bazasiga tayangan holda javob bering.
2. QAT'IY FALLBACK QOIDASI: Agar so'ralgan savolning javobi quyidagi CV ma'lumotlarida mavjud bo'lmasa yoki savol sizning (Umid Abdullayev va uning kompaniyasi Pepito) faoliyatingizga aloqador bo'lmasa, HECH QANDAY izoh, uzr yoki qo'shimcha so'z qo'shmasdan, AYNAN quyidagi jumlani qaytaring:
"Kiritilgan savol bo'yicha CV'da ma'lumot mavjud emas"
3. Barcha javoblarni o'zbek tilida, professional, xushmuomala va ishonchli ohangda bering.

CV VA MA'LUMOTLAR BAZASI:
${CV_DATABASE_TEXT}
`;

// POST /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: "Savol matni kiritilmadi." });
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() }
      ],
      temperature: 0.3
    });

    const reply = completion.choices?.[0]?.message?.content || "Kiritilgan savol bo'yicha CV'da ma'lumot mavjud emas";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('[API/CHAT ERROR]:', error);
    return res.status(500).json({
      error: "Sun'iy intellekt xizmatida xatolik yuz berdi.",
      details: error.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Umid Abdullayev Portfolio & AI Twin Server ishga tushdi!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📁 Static files: ${path.join(__dirname, 'public')}`);
  console.log(`====================================================`);
});
