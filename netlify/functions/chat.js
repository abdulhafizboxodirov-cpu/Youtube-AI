const { OpenAI } = require('openai');

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

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Faqat POST so\'rovlari qabul qilinadi.' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const message = body.message;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Savol matni kiritilmadi." })
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || 'missing-key',
      baseURL: 'https://api.deepseek.com'
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() }
      ],
      temperature: 0.3
    });

    const reply = completion.choices?.[0]?.message?.content || "Kiritilgan savol bo'yicha CV'da ma'lumot mavjud emas";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('[NETLIFY CHAT FUNCTION ERROR]:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Sun'iy intellekt xizmatida xatolik yuz berdi.",
        details: error.message
      })
    };
  }
};
