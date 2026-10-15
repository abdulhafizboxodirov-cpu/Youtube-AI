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

function generateAutonomousTwinReply(query) {
  const q = query.toLowerCase().trim();

  // 1. Greeting
  if (/^(salom|assalomu|qalaysiz|assalom|qalesiz|salomaleykum)/i.test(q)) {
    return "Assalomu alaykum! Men Umid Abdullayevning Sun'iy Intellekt Egizagiman. «Pepito» bolalar do'konlari tarmog'imiz, faoliyatim, filiallarimiz yoki mahsulotlarimiz bo'yicha har qanday savolingizga javob berishga tayyorman.";
  }

  // 2. Who is Umid / Who are you / Leader
  if (q.includes("kim") || q.includes("rahbar") || q.includes("asoschi") || q.includes("shaxs") || q.includes("egizak") || q.includes("haqingizda") || q.includes("haqida")) {
    if (q.includes("pepito haqida") || (q.includes("pepito") && !q.includes("kim"))) {
      return "«Pepito» — 2024-yilda tashkil etilgan, Toshkent shahrida 21 ta filialga ega bolalar mahsulotlari do'konlari tarmog'i. Kompaniyamiz ota-onalar kundalik yumushlarini yengillashtirish uchun bolalar ozuqasi, tagliklar, gigiyena vositalari va aksessuarlarni bitta do'konda jamlagan.";
    }
    return "Men — Umid Abdullayev, Toshkent shahrida 21 ta filialga ega bo'lgan «Pepito» bolalar mahsulotlari do'konlari tarmog'i rahbari va asoschisiman.";
  }

  // 3. Company History / Foundation
  if (q.includes("tashkil") || q.includes("ochilgan") || q.includes("tarix") || q.includes("boshlangan") || (q.includes("qachon") && q.includes("pepito"))) {
    return "Pepito tarmog'imizga 2024-yilda asos solganman. Qisqa vaqt ichida — 2 yildan kam muddatda — poytaxtimiz bo'ylab 21 ta filialgacha kengayishga erishdik va 100 nafargacha xodimni birlashtirdik.";
  }

  // 4. Branches count / locations
  if (q.includes("filial") || q.includes("do'kon") || q.includes("dokon") || q.includes("qayerda") || q.includes("manzil") || q.includes("lokatsiya") || q.includes("joylash")) {
    if (q.includes("yunusobod")) {
      return "Yunusobod tumanidagi filialimiz: Yunusobod-11, Yangishahar ko'chasi, 16-uyda joylashgan (mo'ljal: Mega Planet savdo markazi). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("chilonzor")) {
      return "Chilonzor tumanidagi filialimiz: Chilonzor-11, Qatortol ko'chasida joylashgan (mo'ljal: Shuhrat chorrahasi). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("shayxontohur") || q.includes("kokcha") || q.includes("ko'kcha")) {
      return "Shayxontohur tumanidagi filialimiz: Ko'kcha Darvoza ko'chasi, 337-uyda joylashgan (mo'ljal: 40-maktab, Ko'kcha masjidi). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("olmazor") || q.includes("keles")) {
      return "Olmazor tumanidagi filialimiz: Keles yo'li ko'chasida joylashgan (mo'ljal: Mevazor supermarketi). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("sergeli")) {
      return "Sergeli tumanidagi filialimiz: Sergeli-7, Shokirariq ko'chasida joylashgan (mo'ljal: Mudarris xususiy maktabi). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("yangihayot")) {
      return "Yangihayot tumanidagi filialimiz: Uzar ko'chasi, 84-uyda joylashgan (mo'ljal: 124-bolalar bog'chasi). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("uchtepa") || q.includes("farhod")) {
      return "Uchtepa tumanidagi filialimiz: Farhod chorrahasi hududida joylashgan. Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    if (q.includes("mirzo ulug") || q.includes("gorkiy") || q.includes("media park")) {
      return "Mirzo Ulug'bek tumanidagi filialimiz: Xirmontepa ko'chasi, 34B-uyda joylashgan (mo'ljal: Media Park Gorkiy). Ish vaqti: 09:00 dan 00:00 gacha.";
    }
    return "Bugungi kunda Toshkent shahrining deyarli barcha tumanlarida 21 ta filialimiz faoliyat yuritmoqda (Shayxontohur, Yunusobod, Olmazor, Chilonzor, Mirzo Ulug'bek, Sergeli, Yangihayot, Uchtepa va h.k.). Barcha filiallarimiz har kuni soat 09:00 dan 00:00 gacha ishlaydi.";
  }

  // 5. Working Hours
  if (q.includes("vaqt") || q.includes("ish vaqti") || q.includes("soat") || q.includes("ochiq")) {
    return "Bizning barcha 21 ta filialimiz har kuni soat 09:00 dan 00:00 gacha dam olish kunlarisiz ishlaydi. Hatto kechqurun to'satdan taglik yoki ozuqa tugab qolganda ham Pepitoga bemalol tashrif buyurishingiz mumkin.";
  }

  // 6. Products & Assortment
  if (q.includes("mahsulot") || q.includes("tovar") || q.includes("sotil") || q.includes("assortiment") || q.includes("ovqat") || q.includes("ozuq") || q.includes("taglik") || q.includes("pampers") || q.includes("gigiyen") || q.includes("aksesuar")) {
    return "Pepitoda bola hayotining dastlabki yillarida kerak bo'ladigan barcha mahsulotlar 4 ta asosiy toifada taqdim etiladi: 1) Bolalar ozuqasi (sut aralashmalari, bo'tqalar, pyurelar, sharbatlar), 2) Tagliklar (oddiy tagliklar, taglik-trusiklar, yangi tug'ilganlar uchun), 3) Gigiyena vositalari (nam salfetkalar, kremlar, bolalar shampunlari), 4) Aksessuarlar (butilkalar, so'rg'ichlar, idishlar). Assortimentimiz har qanday oila byudjetiga mos kelishi uchun premium, o'rta va hamyonbop narx toifalarida mavjud.";
  }

  // 7. Team & Staff
  if (q.includes("jamoa") || q.includes("xodim") || q.includes("ishchi") || q.includes("kadr") || q.includes("odam")) {
    return "Bizning professional jamoamizda 100 nafargacha xodim faoliyat yuritadi (sotuvchi-kassirlar, konsultantlar, ombor xodimlari, kuryerlar, moliya va logistika mutaxassislari). Kompaniyamizda xodimlarning ichki karyera o'sishi yo'lga qo'yilgan bo'lib, omborda ish boshlagan mutaxassis kassir, moliya xodimi va keyinchalik rahbarlikkacha ko'tarilishi mumkin.";
  }

  // 8. Delivery Service
  if (q.includes("yetkaz") || q.includes("dastavka") || q.includes("dostavka") || q.includes("uyga")) {
    return "Ha, chaqaloq bilan uydan chiqishi qiyin bo'lgan yosh onalarimiz uchun uyga pullik yetkazib berish (dastavka) xizmatimiz yo'lga qo'yilgan.";
  }

  // 9. Consultant Service
  if (q.includes("konsultant") || q.includes("maslahat") || q.includes("yordam")) {
    return "Ha, har bir filialimizda ona va bola parvarishi bo'yicha maslahat beradigan professional konsultantlar ishlaydi. Ular yosh ota-onalarga to'g'ri ozuqa, gigiyena va parvarish vositalarini tanlash bo'yicha bepul tavsiyalar beradi.";
  }

  // 10. Bonus & Cashback Card
  if (q.includes("bonus") || q.includes("keshbek") || q.includes("karta") || q.includes("skidka") || q.includes("chegirma")) {
    return "Ha, bizda doimiy mijozlar uchun maxsus bonus va keshbek kartasi dasturi mavjud. Muntazam xarid qilinadigan taglik va ozuqalardan yig'ilgan bonuslar keyingi xaridlarda chegirma sifatida sarflanadi va oila byudjetini tejashga xizmat qiladi.";
  }

  // 11. Phone & Contact
  if (q.includes("telefon") || q.includes("raqam") || q.includes("aloqa") || q.includes("bog'lan") || q.includes("nomer") || q.includes("call")) {
    return "Barcha filiallarimiz uchun yagona koll-markaz raqamimiz: 78 555 04 00. Shuningdek, biz bilan rasmiy Instagram sahifamiz hamda Telegram kanal va botimiz orqali ham bog'lanishingiz mumkin.";
  }

  // 12. Online Channels / Telegram / Instagram
  if (q.includes("telegram") || q.includes("instagram") || q.includes("bot") || q.includes("ijtimoiy") || q.includes("kanal")) {
    return "Mijozlarimiz Pepito bilan rasmiy Instagram sahifasi hamda Telegram bot va kanal orqali bog'lanishlari, yangi tovarlar va aksiyalar bilan tanishib, buyurtma berishlari mumkin.";
  }

  // 13. Values & Mission
  if (q.includes("qadriyat") || q.includes("maqsad") || q.includes("falsafa") || q.includes("ustun") || q.includes("vazifa")) {
    return "Bizning 3 ta asosiy qadriyatimiz: 1) Qulaylik (har bir tumanda yaqin filial, uzoq ish vaqti, yetkazib berish), 2) Tanlov (har bir byudjetga mos brendlar), 3) G'amxo'rlik (malakali konsultantlar xizmati).";
  }

  // 14. Market & Strategy
  if (q.includes("bozor") || q.includes("kelajak") || q.includes("reja") || q.includes("strategiya") || q.includes("talab")) {
    return "O'zbekistonda tug'ilish darajasi yuqori bo'lgani tufayli bolalar mahsulotlari bozori tez sur'atlar bilan o'smoqda. Pepito uchun asosiy maqsad: yangi filiallar ochish, onlayn buyurtma va yetkazib berishni kengaytirish hamda bonus dasturi orqali oilalarga ko'maklashishdir.";
  }

  // Fallback rule
  return "Kiritilgan savol bo'yicha CV'da ma'lumot mavjud emas";
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Faqat POST so'rovlari qabul qilinadi." });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: "Savol matni kiritilmadi." });
    }

    const cleanMsg = message.trim();

    // 1. Try DeepSeek API first if valid key exists
    if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.startsWith('sk-') && process.env.DEEPSEEK_API_KEY.length > 20) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: 'https://api.deepseek.com'
        });

        const completion = await openai.chat.completions.create({
          model: "deepseek-v4-pro",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: cleanMsg }
          ],
          temperature: 0.3
        });

        const reply = completion.choices?.[0]?.message?.content;
        if (reply) {
          return res.status(200).json({ reply });
        }
      } catch (apiErr) {
        console.warn('[VERCEL DEEPSEEK WARNING]:', apiErr.message, '-> Autonomous Twin faollashtirildi.');
      }
    }

    // 2. Autonomous Twin fallback (ensures 100% uptime, zero 500 errors)
    const reply = generateAutonomousTwinReply(cleanMsg);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('[VERCEL CHAT FUNCTION ERROR]:', error);
    return res.status(500).json({
      error: "Sun'iy intellekt xizmatida xatolik yuz berdi.",
      details: error.message
    });
  }
};
