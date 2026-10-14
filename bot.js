require('dotenv').config();
const { Telegraf, Markup, Input } = require('telegraf');
const fs = require('fs');
const path = require('path');
const productsData = require('./products.json');

console.log('====================================================');
console.log('⏳ Ventstore boti ishga tushirilmoqda, iltimos kuting...');
console.log('====================================================');

// Bot tokenini tekshirish
const token = process.env.BOT_TOKEN;
if (!token || token === 'SIZNING_BOT_TOKENINGIZ') {
  console.error("❌ XATOLIK: .env faylida BOT_TOKEN ko'rsatilmagan!");
  console.log("Iltimos, .env faylini ochib, @BotFather dan olingan bot tokeningizni kiriting.");
  process.exit(1);
}

const bot = new Telegraf(token);
const ADMIN_ID = process.env.ADMIN_ID; // Xabarlar (kontaktlar) boradigan admin ID si

// Fayl yo'llari
const USERS_FILE = path.join(__dirname, 'users.json');
const FILE_IDS_FILE = path.join(__dirname, 'file_ids.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data || '{}');
    }
  } catch (err) {
    console.error('Users yuklashda xatolik:', err.message);
  }
  return {};
}

function saveUser(userId, userData) {
  try {
    const users = loadUsers();
    users[userId] = Object.assign(users[userId] || {}, userData);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('User saqlashda xatolik:', err.message);
  }
}

function getUserLang(userId) {
  const users = loadUsers();
  return (users[userId] && users[userId].lang) || 'uz';
}

// Telegram file_id keshini yuklash va saqlash (Tezlikni bir necha barobar oshiradi)
function loadFileIds() {
  try {
    if (fs.existsSync(FILE_IDS_FILE)) {
      return JSON.parse(fs.readFileSync(FILE_IDS_FILE, 'utf8') || '{}');
    }
  } catch (err) {}
  return {};
}

function saveFileId(productId, fileId) {
  try {
    const fileIds = loadFileIds();
    fileIds[productId] = fileId;
    fs.writeFileSync(FILE_IDS_FILE, JSON.stringify(fileIds, null, 2), 'utf8');
  } catch (err) {}
}

// Matnlar va tarjimalar (UZ / RU)
const i18n = {
  uz: {
    choose_lang: "🌐 Iltimos, tilni tanlang / Пожалуйста, выберите язык:",
    welcome: (name) =>
      `Assalomu alaykum, ${name || 'qadrli mijoz'}! 👋\n\n` +
      `Ventstore rasmiy Telegram botiga xush kelibsiz! 🌬🏢\n\n` +
      `Bizda Turkiya 🇹🇷 va Xitoy 🇨🇳dan to‘g‘ridan-to‘g‘ri keltirilgan sifatli ventilyatsiya uskunalari (rekuperatorlar, kanalli, ulitka va o‘qli ventilyatorlar) birinchi qo‘l ulgurji narxlarda mavjud!\n\n` +
      `❗️ Bot imkoniyatlaridan to‘liq foydalanish va mahsulotlar katalogini ko‘rish uchun, iltimos, pastdagi «📲 Telefon raqamni yuborish» tugmasini bosing.`,
    btn_send_contact: "📲 Telefon raqamni yuborish",
    must_send_contact: "⚠️ Botdan to‘liq foydalanish uchun telefon raqamingizni yuborishingiz shart!\n\nIltimos, pastdagi «📲 Telefon raqamni yuborish» tugmasini bosing:",
    contact_received: (name, phone) =>
      `✅ Rahmat, ${name || 'hurmatli mijoz'}!\n` +
      `Telefon raqamingiz (${phone}) muvaffaqiyatli qabul qilindi.\n\n` +
      `Endi siz mahsulotlar katalogini ko‘rishingiz va mutaxassislarimiz bilan bog‘lanishingiz mumkin!`,
    main_menu_title: "Quyidagi menyu orqali kerakli bo‘limni tanlang:",
    btn_catalog: "🛍 Mahsulotlar katalogi",
    btn_contact: "📞 Biz bilan aloqa",
    btn_address: "📍 Do‘kon manzili",
    btn_about: "ℹ️ Ventstore haqida",
    btn_change_lang: "🌐 Tilni o‘zgartirish",
    catalog_title: "📦 VENTSTORE MAHSULOTLAR KATALOGI 🌬🏢\n\nQuyidagi kategoriyalardan birini tanlang:",
    btn_prev: "⬅️ Oldingi",
    btn_next: "Keyingi ➡️",
    btn_back_models: "🔙 Modellar ro‘yxatiga qaytish",
    btn_back_categories: "🔙 Boshqa kategoriyalar",
    btn_all_category_models: "➡️ Barcha modellarni ketma-ket ko‘rish",
    btn_order_admin: "💬 Buyurtma berish (Admin)",
    btn_channel: "📢 Rasmiy kanal",
    contact_text:
      `📞 VENTSTORE BILAN ALOQA:\n\n` +
      `Biz bilan bog‘lanish uchun telefon raqamlar:\n` +
      `☎️ +998 88 010 33 00\n` +
      `☎️ +998 97 407 33 00\n` +
      `☎️ +998 99 307 61 74\n` +
      `☎️ +998 33 016 33 00\n` +
      `☎️ +998 33 010 33 00\n\n` +
      `💬 Telegram admin: @Ventstore_Admin\n` +
      `📢 Rasmiy kanalimiz: @ventstore_uz\n` +
      `🌐 Veb-sayt: www.ventstore.uz\n` +
      `🛒 Uzum Market: https://go.uzum.uz/l/YsWcE6qx\n\n` +
      `📍 Manzil: Jome bozor, EvroAsia 2-blok, 30-do‘kon`,
    address_text:
      `📍 DO‘KON MANZILI:\n\n` +
      `Toshkent shahri, Sergili Index bozor , E01 blok, 1056 do'kon\n\n` +
      `Mo‘ljal: Sergili Index bozor.\n` +
      `Ish vaqti: Har kuni 09:00 dan 18:00 gacha.\n\n` +
      `📞 Telefonlar:\n` +
      `+998 97 407 33 00\n` +
      `+998 88 010 33 00`
      ,
    about_text:
      `ℹ️ VENTSTORE HAQIDA:\n\n` +
      `Ventstore — O‘zbekistonda Turkiya va Xitoyning yetakchi ishlab chiqaruvchilaridan shamollatish va ventilyatsiya uskunalarini to‘g‘ridan-to‘g‘ri yetkazib beruvchi birinchi qo‘l do‘koni.\n\n` +
      `Bizning afzalliklarimiz:\n` +
      `🔺 Ishlab chiqaruvchilardan bevosita qulay va ulgurji narxlar\n` +
      `🔺 Yuqori sifatli mahsulotlar va 1 yillik rasmiy kafolat\n` +
      `🔺 Keng assortiment: Rekuperatorlar, kanal, ulitka va o‘qli ventilyatorlar\n` +
      `🔺 Butun O‘zbekiston bo‘ylab tez yetkazib berish va o‘rnatish xizmatlari\n` +
      `🔺 Ustalar va montajchilar uchun maxsus chegirma dasturlari!`,
    lang_changed: "Til muvaffaqiyatli o‘zbekchaga o‘zgartirildi! 🇺🇿"
  },
  ru: {
    choose_lang: "🌐 Пожалуйста, выберите язык / Iltimos, tilni tanlang:",
    welcome: (name) =>
      `Здравствуйте, ${name || 'уважаемый клиент'}! 👋\n\n` +
      `Добро пожаловать в официальный Telegram-бот Ventstore! 🌬🏢\n\n` +
      `Мы являемся прямым поставщиком вентиляционного оборудования из Турции 🇹🇷 и Китая 🇨🇳 (рекуператоры, канальные, центробежные и осевые вентиляторы) по выгодным оптовым ценам из первых рук!\n\n` +
      `❗️ Для полного доступа к боту и просмотра каталога цен, пожалуйста, нажмите кнопку «📲 Отправить номер телефона» ниже.`,
    btn_send_contact: "📲 Отправить номер телефона",
    must_send_contact: "⚠️ Для использования бота необходимо отправить номер телефона!\n\nПожалуйста, нажмите кнопку «📲 Отправить номер телефона» ниже:",
    contact_received: (name, phone) =>
      `✅ Спасибо, ${name || 'уважаемый клиент'}!\n` +
      `Ваш номер телефона (${phone}) успешно принят.\n\n` +
      `Теперь вы можете просматривать каталог товаров и связаться с нашими специалистами!`,
    main_menu_title: "Выберите нужный раздел из меню ниже:",
    btn_catalog: "🛍 Каталог товаров",
    btn_contact: "📞 Связаться с нами",
    btn_address: "📍 Адрес магазина",
    btn_about: "ℹ️ О компании Ventstore",
    btn_change_lang: "🌐 Сменить язык",
    catalog_title: "📦 КАТАЛОГ ТОВАРОВ VENTSTORE 🌬🏢\n\nВыберите одну из категорий ниже:",
    btn_prev: "⬅️ Назад",
    btn_next: "Вперед ➡️",
    btn_back_models: "🔙 К списку моделей",
    btn_back_categories: "🔙 Другие категории",
    btn_all_category_models: "➡️ Смотреть все модели подряд",
    btn_order_admin: "💬 Заказать (Администратор)",
    btn_channel: "📢 Официальный канал",
    contact_text:
      `📞 СВЯЗЬ С VENTSTORE:\n\n` +
      `Телефоны для консультаций и заказов:\n` +
      `☎️ +998 88 010 33 00\n` +
      `☎️ +998 33 018 33 00\n` +
      `☎️ +998 33 017 33 00\n` +
      `☎️ +998 33 016 33 00\n` +
      `☎️ +998 33 010 33 00\n\n` +
      `💬 Администратор: @Ventstore_Admin\n` +
      `📢 Наш канал: @ventstore_uz\n` +
      `🌐 Веб-сайт: www.ventstore.uz\n` +
      `🛒 Магазин в Uzum: https://go.uzum.uz/l/YsWcE6qx\n\n` +
      `📍 Адрес: г. Ташкент, базар Джами (Джоме), EvroAsia 2-блок, магазин №30`,
    address_text:
      `📍 АДРЕС НАШЕГО МАГАЗИНА:\n\n` +
      `г. Ташкент, ул. Уста Ширин, строительный базар Джами (Джоме), блок EvroAsia 2, магазин №30.\n\n` +
      `Режим работы: Ежедневно с 08:30 до 18:00.\n\n` +
      `📞 Телефоны:\n` +
      `+998 88 010 33 00\n` +
      `+998 33 018 33 00`,
    about_text:
      `ℹ️ О КОМПАНИИ VENTSTORE:\n\n` +
      `Ventstore — крупнейший поставщик систем вентиляции от ведущих заводов Турции и Китая в Узбекистане.\n\n` +
      `Наши преимущества:\n` +
      `🔺 Прямые поставки от производителей — цены из первых рук\n` +
      `🔺 Официальная гарантия 1 год и контроль качества\n` +
      `🔺 Широкий ассортимент: рекуператоры, канальные, улитки и осевые вентиляторы\n` +
      `🔺 Быстрая доставка по всему Узбекистану и услуги монтажа\n` +
      `🔺 Специальные выгодные условия для мастеров и монтажников!`,
    lang_changed: "Язык успешно изменен на русский! 🇷🇺"
  }
};

// Til tanlash klaviaturasi (Inline)
function getLangSelectionKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🇺🇿 O‘zbekcha', 'set_lang_uz'),
      Markup.button.callback('🇷🇺 Русский', 'set_lang_ru')
    ]
  ]);
}

// Asosiy menyu klaviaturasi
function getMainMenuKeyboard(lang = 'uz') {
  const dict = i18n[lang];
  return Markup.keyboard([
    [dict.btn_catalog],
    [dict.btn_contact, dict.btn_address],
    [dict.btn_about, dict.btn_change_lang]
  ]).resize();
}

// Kontakt so‘rash tugmasi
function getContactKeyboard(lang = 'uz') {
  const dict = i18n[lang];
  return Markup.keyboard([
    [Markup.button.contactRequest(dict.btn_send_contact)]
  ]).resize();
}

// Texnik parametr kalitlarini chiroyli ko'rsatish
function formatSpecKey(key, lang) {
  const map = {
    voltage: { uz: 'Kuchlanish', ru: 'Напряжение' },
    power: { uz: 'Quvvat', ru: 'Мощность' },
    airflow: { uz: 'Havo sarfi', ru: 'Расход воздуха' },
    pressure: { uz: 'Bosim', ru: 'Давление' },
    rpm: { uz: 'Aylanish tezligi', ru: 'Скорость вращения' },
    diameters: { uz: 'Diametrlar', ru: 'Диаметры' },
    sizes: { uz: 'O‘lchamlar', ru: 'Размеры' }
  };
  return (map[key] && map[key][lang]) || key;
}

// 1-bosqich: Asosiy 6 ta Kategoriya menyusi (Aynan foydalanuvchi skrinshotidagi tugmalar)
function getCategoriesKeyboard(lang = 'uz') {
  const isRu = lang === 'ru';
  return Markup.inlineKeyboard([
    [Markup.button.callback(isRu ? '🔄 Рекуператоры' : '🔄 Rekuperatorlar', 'cat_pick_rekuperator')],
    [Markup.button.callback(isRu ? '🌀 Канальные вентиляторы' : '🌀 Kanal ventilyatorlari', 'cat_pick_kanal')],
    [Markup.button.callback(isRu ? '🌪 Центробежные (Улитка)' : '🌪 Markazdan qochma (Ulitka)', 'cat_pick_sentrifugal')],
    [Markup.button.callback(isRu ? '💨 Осевые вентиляторы' : '💨 Osevoy (O‘qli) ventilyatorlar', 'cat_pick_osevoy')],
    [Markup.button.callback(isRu ? '❄️ Водяные охладители (KTS)' : '❄️ Suvli sovutgichlar (KTS)', 'cat_pick_sovutgich')],
    [Markup.button.callback(isRu ? '🚪 Решетки и аксессуары' : '🚪 Reshetka va aksessuarlar', 'cat_pick_aksessuarlar')]
  ]);
}

// Kategoriya tavsif matnlari
const categoryInfoTexts = {
  kanal: {
    uz: `🌀 <b>KANAL VENTILYATORLARI</b>\n\nKanal ventilyatorlarining 2 xil asosiy turi mavjud:\n🔩 <b>Temir (metall po‘lat)</b> — kuchli bosim va yuqori chidamlilik uchun (Turkiya va Xitoy)\n🧴 <b>Plastik (shovqinsiz)</b> — xonadonlar, kafelar uchun va 🎮 <b>Masofaviy pultli</b>\n\nKerakli modelni tanlang yoki barchasini ko‘ring:`,
    ru: `🌀 <b>КАНАЛЬНЫЕ ВЕНТИЛЯТОРЫ</b>\n\nКанальные вентиляторы делятся на 2 основных типа по материалу корпуса:\n🔩 <b>В металлическом корпусе</b> — высокое давление и долговечность (Турция и Китай)\n🧴 <b>В пластиковом корпусе</b> — бесшумные для жилых зон и 🎮 <b>С пультом ДУ</b>\n\nВыберите нужную модель или просмотрите все подряд:`
  },
  rekuperator: {
    uz: `🔄 <b>REKUPERATORLAR (HAVO ALMASHGICHLAR)</b>\n\nXonadagi issiqlik yoki salqinlikni saqlab qolgan holda toza havo olib kiruvchi zamonaviy energiya tejovchi qurilmalar (Turkiya va Xitoy).\n\nKerakli modelni tanlang:`,
    ru: `🔄 <b>РЕКУПЕРАТОРЫ (ПРИТОЧНО-ВЫТЯЖНЫЕ УСТАНОВКИ)</b>\n\nСистемы вентиляции с рекуперацией тепла для сохранения энергии и притока чистого свежего воздуха (Турция и Китай).\n\nВыберите модель:`
  },
  sentrifugal: {
    uz: `🌪 <b>MARKAZDAN QOCHMA (ULITKA) VENTILYATORLARI</b>\n\nSanoat sexlari, omborlar va 🍳 <b>Restoran/kafe oshxonalari (yog‘ va issiq bug‘ga chidamli)</b> uchun kuchli tizimlar.\n\nKerakli modelni tanlang:`,
    ru: `🌪 <b>ЦЕНТРОБЕЖНЫЕ ВЕНТИЛЯТОРЫ (УЛИТКА)</b>\n\nМощные улитки для промышленных цехов, складов и 🍳 <b>Кухонь кафе и ресторанов (жиро- и жаростойкие)</b>.\n\nВыберите модель:`
  },
  osevoy: {
    uz: `💨 <b>OSEVOY (O‘QLI) VENTILYATORLAR</b>\n\nIssiqxona, ferma, ombor va zavodlar uchun katta havo oqimini haydovchi o‘qli ventilyatorlar.\n\nKerakli modelni tanlang:`,
    ru: `💨 <b>ОСЕВЫЕ ВЕНТИЛЯТОРЫ</b>\n\nВысокопроизводительные осевые вентиляторы для теплиц, ферм, складов и цехов.\n\nВыберите модель:`
  },
  sovutgich: {
    uz: `❄️ <b>SUVLI SOVUTGICHLAR (KTS)</b>\n\nIssiq yoz kunlarida sex, do‘kon, kafe va binolarni suv hisobiga freonsiz tabiiy salqinlatuvchi sanoat sovutgichlari.\n\nModelni ko‘rish uchun pastdagi tugmani bosing:`,
    ru: `❄️ <b>ВОДЯНЫЕ ОХЛАДИТЕЛИ (KTS)</b>\n\nЭкологичные промышленные охладители воздуха испарительного типа (работают на воде без фреона).\n\nНажмите кнопку ниже:`
  },
  aksessuarlar: {
    uz: `🚪 <b>RESHETKA VA AKSESSUARLAR</b>\n\nVentilyatsiya panjaralari (barcha rang va o‘lchamlarda buyurtma asosida tayyorlab beriladi).\n\nModelni ko‘rish uchun pastdagi tugmani bosing:`,
    ru: `🚪 <b>РЕШЕТКИ И АКСЕССУАРЫ</b>\n\nВентиляционные решетки и жалюзи любых цветов и размеров под заказ.\n\nНажмите кнопку ниже:`
  }
};

// 2-bosqich: Tanlangan kategoriya ichidagi modellar ro'yxati menyusi (Tugmalar ro'yxati)
function getCategorySubmenuKeyboard(categoryId, lang = 'uz') {
  const isRu = lang === 'ru';
  const dict = i18n[lang];
  const prods = productsData.products.filter(p => p.categoryId === categoryId);

  const buttons = [];

  // Har bir model uchun alohida inline tugma
  prods.forEach((p, idx) => {
    const label = isRu ? (p.btn_ru || p.title_ru) : (p.btn_uz || p.title_uz);
    buttons.push([Markup.button.callback(label, `item_view_${categoryId}_${idx}`)]);
  });

  // Barcha modellarni ketma-ket ko'rish tugmasi (agar 1 dan ortiq bo'lsa)
  if (prods.length > 1) {
    buttons.push([Markup.button.callback(dict.btn_all_category_models, `item_view_${categoryId}_0`)]);
  }

  // Asosiy 6 ta kategoriyaga qaytish tugmasi
  buttons.push([Markup.button.callback(dict.btn_back_categories, 'catalog_categories_back')]);

  return Markup.inlineKeyboard(buttons);
}

// Mahsulot matnini (Caption) to'liq tayyorlash
function buildProductCaption(product, index, total, lang) {
  const isRu = lang === 'ru';
  const title = isRu ? product.title_ru : product.title_uz;
  const origin = isRu ? product.origin_ru : product.origin_uz;
  const body = isRu ? product.body_ru : product.body_uz;
  const control = isRu ? product.control_ru : product.control_uz;
  const desc = isRu ? product.desc_ru : product.desc_uz;

  let caption = `📌 <b>${title} (${index + 1} / ${total})</b>\n\n`;

  if (origin) {
    caption += `${isRu ? '🏭 Производитель:' : '🏭 Ishlab chiqaruvchi:'} <b>${origin}</b>\n`;
  }
  if (body) {
    caption += `${isRu ? '🛡 Корпус:' : '🛡 Korpus turi:'} <b>${body}</b>\n`;
  }
  if (control) {
    caption += `${isRu ? '🎮 Управление:' : '🎮 Boshqaruv:'} <b>${control}</b>\n`;
  }
  if (desc) {
    caption += `\nℹ️ <i>${desc}</i>\n`;
  }

  // Texnik parametrlar
  if (product.specs && Object.keys(product.specs).length > 0) {
    caption += `\n⚙️ <b>${isRu ? 'Характеристики:' : 'Xususiyatlari:'}</b>\n`;
    for (const [key, val] of Object.entries(product.specs)) {
      const label = formatSpecKey(key, lang);
      let formattedVal = val;
      if (isRu) {
        formattedVal = String(formattedVal)
          .replace(/m³\/soat/g, 'м³/час')
          .replace(/ayl\/min/g, 'об/мин');
      }
      caption += `• ${label}: <b>${formattedVal}</b>\n`;
    }
  }

  // Modellar va narxlar
  if (product.models && product.models.length > 0) {
    caption += `\n📊 <b>${isRu ? 'Модели и цены:' : 'Modellar va narxlar:'}</b>\n`;
    product.models.forEach(m => {
      let flow = m.airflow || '';
      if (isRu && flow) {
        flow = flow.replace(/m³\/soat/g, 'м³/час');
      }
      const extra = flow ? ` (${flow})` : '';
      const priceText = typeof m.price === 'number' ? `${m.price} $` : m.price;
      caption += `• ${m.model}${extra} — 💰 <b>${priceText}</b>\n`;
    });
  }

  if (caption.length > 1020) {
    caption = caption.slice(0, 1017) + '...';
  }

  return caption;
}

// 3-bosqich: Mahsulot kartochkasi (Rasm + Paginate) ko'rsatish
async function sendProductCard(ctx, categoryId, index, isEdit = false) {
  const lang = getUserLang(ctx.from.id);
  const dict = i18n[lang];

  // Tanlangan kategoriyadagi mahsulotlar ro'yxati
  const list = productsData.products.filter(p => p.categoryId === categoryId);

  if (!list || list.length === 0) {
    const emptyMsg = lang === 'ru' ? 'В этой категории пока нет товаров.' : 'Bu bo‘limda hozircha mahsulotlar yo‘q.';
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery(emptyMsg, { show_alert: true });
    } else {
      await ctx.reply(emptyMsg);
    }
    return;
  }

  const total = list.length;
  let idx = parseInt(index, 10) || 0;
  if (idx < 0) idx = total - 1;
  if (idx >= total) idx = 0;

  const product = list[idx];
  const prevIdx = (idx - 1 + total) % total;
  const nextIdx = (idx + 1) % total;

  const captionText = buildProductCaption(product, idx, total, lang);

  // Rasm yo'li
  const photoPath = path.isAbsolute(product.photo)
    ? product.photo
    : path.join(__dirname, product.photo);

  // Keshdan file_id tekshirish
  const fileIds = loadFileIds();
  const cachedFileId = fileIds[product.id];

  // Klaviaturani shakllantirish
  const buttons = [];

  // Agar 1 dan ortiq model bo'lsa, oldingi/keyingi tugmalari chiqadi
  if (total > 1) {
    buttons.push([
      Markup.button.callback(dict.btn_prev, `item_view_${categoryId}_${prevIdx}`),
      Markup.button.callback(`${idx + 1} / ${total}`, 'noop'),
      Markup.button.callback(dict.btn_next, `item_view_${categoryId}_${nextIdx}`)
    ]);
  }

  // Buyurtma berish tugmasi
  buttons.push([
    Markup.button.url(dict.btn_order_admin, 'https://t.me/Ventstore_Admin')
  ]);

  // Bo'lim modellariga qaytish tugmasi
  buttons.push([
    Markup.button.callback(dict.btn_back_models, `subcat_${categoryId}`)
  ]);

  // Boshqa asosiy kategoriyalarga qaytish tugmasi
  buttons.push([
    Markup.button.callback(dict.btn_back_categories, 'catalog_categories_back')
  ]);

  const keyboard = Markup.inlineKeyboard(buttons);

  if (isEdit && ctx.callbackQuery) {
    await ctx.answerCbQuery();

    // Agar cachedFileId bo'lsa, Telegram serveridan bir zumda (100ms) almashtiradi!
    if (cachedFileId) {
      try {
        await ctx.editMessageMedia(
          {
            type: 'photo',
            media: cachedFileId,
            caption: captionText,
            parse_mode: 'HTML'
          },
          { reply_markup: keyboard.reply_markup }
        );
        return;
      } catch (err) {
        if (err.message && err.message.includes('message is not modified')) {
          return;
        }
      }
    }

    // Mahalliy fayl bilan edit qilib ko'ramiz
    if (fs.existsSync(photoPath)) {
      try {
        const res = await ctx.editMessageMedia(
          {
            type: 'photo',
            media: Input.fromLocalFile(photoPath),
            caption: captionText,
            parse_mode: 'HTML'
          },
          { reply_markup: keyboard.reply_markup }
        );
        if (res && res.photo && res.photo.length > 0) {
          saveFileId(product.id, res.photo[res.photo.length - 1].file_id);
        }
        return;
      } catch (err) {
        if (err.message && err.message.includes('message is not modified')) {
          return;
        }
        try { await ctx.deleteMessage(); } catch (_) {}
      }
    }
  }

  // Yangi rasm yuborish
  if (ctx.callbackQuery) {
    await ctx.answerCbQuery();
    try { await ctx.deleteMessage(); } catch (_) {}
  }

  if (cachedFileId) {
    await ctx.replyWithPhoto(cachedFileId, {
      caption: captionText,
      parse_mode: 'HTML',
      reply_markup: keyboard.reply_markup
    });
  } else if (fs.existsSync(photoPath)) {
    const sentMsg = await ctx.replyWithPhoto(Input.fromLocalFile(photoPath), {
      caption: captionText,
      parse_mode: 'HTML',
      reply_markup: keyboard.reply_markup
    });
    if (sentMsg && sentMsg.photo && sentMsg.photo.length > 0) {
      saveFileId(product.id, sentMsg.photo[sentMsg.photo.length - 1].file_id);
    }
  } else {
    await ctx.reply(captionText, {
      parse_mode: 'HTML',
      reply_markup: keyboard.reply_markup
    });
  }
}

// START buyrug'i: Avval til tanlash chiqadi!
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const users = loadUsers();

  if (users[userId] && users[userId].phone && users[userId].lang) {
    const lang = users[userId].lang;
    return ctx.reply(
      `${i18n[lang].welcome(ctx.from.first_name)}\n\n${i18n[lang].main_menu_title}`,
      getMainMenuKeyboard(lang)
    );
  }

  await ctx.reply(
    `Assalomu alaykum! Ventstore botiga xush kelibsiz! 👋\n` +
    `Здравствуйте! Добро пожаловать в бот Ventstore! 🌬🏢\n\n` +
    `Iltimos, qulay muloqot uchun tilni tanlang:\n` +
    `Пожалуйста, выберите удобный для вас язык:`,
    getLangSelectionKeyboard()
  );
});

// Tilni tanlash callback handlerlari
bot.action(['set_lang_uz', 'set_lang_ru'], async (ctx) => {
  const userId = ctx.from.id.toString();
  const chosenLang = ctx.match[0] === 'set_lang_ru' ? 'ru' : 'uz';

  saveUser(userId, { lang: chosenLang });
  const users = loadUsers();
  const dict = i18n[chosenLang];

  await ctx.answerCbQuery();

  if (users[userId] && users[userId].phone) {
    return ctx.reply(dict.lang_changed, getMainMenuKeyboard(chosenLang));
  }

  await ctx.reply(
    dict.welcome(ctx.from.first_name),
    getContactKeyboard(chosenLang)
  );
});

// Kontakt qabul qilish
bot.on('contact', async (ctx) => {
  const contact = ctx.message.contact;
  const userId = ctx.from.id.toString();
  const lang = getUserLang(userId);
  const dict = i18n[lang];

  const userData = {
    userId,
    phone: contact.phone_number,
    firstName: contact.first_name || ctx.from.first_name,
    lastName: contact.last_name || ctx.from.last_name || '',
    username: ctx.from.username ? `@${ctx.from.username}` : 'Mavjud emas',
    lang: lang,
    registeredAt: new Date().toISOString()
  };
  saveUser(userId, userData);

  await ctx.reply(
    dict.contact_received(contact.first_name, contact.phone_number),
    getMainMenuKeyboard(lang)
  );

  if (ADMIN_ID) {
    try {
      const adminMsg =
        `🔔 YANGI MIJOZ RO‘YXATDAN O‘TDI!\n\n` +
        `🌐 Tanlangan til: ${lang === 'ru' ? '🇷🇺 Русский' : '🇺🇿 O‘zbekcha'}\n` +
        `👤 Ism: ${userData.firstName} ${userData.lastName}\n` +
        `📞 Telefon: ${userData.phone}\n` +
        `🔗 Username: ${userData.username}\n` +
        `🆔 ID: ${userData.userId}\n` +
        `⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}`;

      await ctx.telegram.sendMessage(ADMIN_ID, adminMsg);
    } catch (adminErr) {
      console.error('Adminga xabarnoma yuborishda xatolik:', adminErr.message);
    }
  }
});

// Filtr middleware
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  const userId = ctx.from.id.toString();
  const users = loadUsers();

  if (ctx.callbackQuery && (ctx.callbackQuery.data === 'set_lang_uz' || ctx.callbackQuery.data === 'set_lang_ru')) {
    return next();
  }

  if (ctx.message && (ctx.message.text === '/start' || ctx.message.contact)) {
    return next();
  }

  if (!users[userId] || !users[userId].lang) {
    if (ctx.callbackQuery) {
      return ctx.answerCbQuery('Iltimos, avval tilni tanlang!', { show_alert: true });
    }
    return ctx.reply(
      `Iltimos, avval muloqot tilini tanlang:\nПожалуйста, сначала выберите язык:`,
      getLangSelectionKeyboard()
    );
  }

  const lang = users[userId].lang;
  const dict = i18n[lang];

  if (!users[userId].phone) {
    if (ctx.callbackQuery) {
      return ctx.answerCbQuery(dict.must_send_contact, { show_alert: true });
    }
    return ctx.reply(
      dict.must_send_contact,
      getContactKeyboard(lang)
    );
  }

  return next();
});

// 🛍 Mahsulotlar katalogi (UZ / RU) — Aynan foydalanuvchi skrinshotidagi 6 ta asosiy kategoriya tugmasi chiqadi!
bot.hears(['🛍 Mahsulotlar katalogi', '🛍 Каталог товаров'], async (ctx) => {
  const lang = getUserLang(ctx.from.id);
  const dict = i18n[lang];
  await ctx.reply(dict.catalog_title, {
    parse_mode: 'HTML',
    reply_markup: getCategoriesKeyboard(lang).reply_markup
  });
});

// 1-bosqich -> 2-bosqich: Kategoriya bosilganda shu bo'limdagi modellar ro'yxati (Sub-menu) tugmalari chiqadi
bot.action(/cat_pick_([a-zA-Z0-9_]+)/, async (ctx) => {
  const categoryId = ctx.match[1];
  const lang = getUserLang(ctx.from.id);
  await ctx.answerCbQuery();

  const infoObj = categoryInfoTexts[categoryId] || {};
  const headerText = infoObj[lang] || i18n[lang].catalog_title;
  const keyboard = getCategorySubmenuKeyboard(categoryId, lang);

  try {
    await ctx.editMessageText(headerText, {
      parse_mode: 'HTML',
      reply_markup: keyboard.reply_markup
    });
  } catch (err) {
    try { await ctx.deleteMessage(); } catch (_) {}
    await ctx.reply(headerText, {
      parse_mode: 'HTML',
      reply_markup: keyboard.reply_markup
    });
  }
});

// 2-bosqich: Bo'lim modellariga qaytish tugmasi bosilganda
bot.action(/subcat_([a-zA-Z0-9_]+)/, async (ctx) => {
  const categoryId = ctx.match[1];
  const lang = getUserLang(ctx.from.id);
  await ctx.answerCbQuery();

  const infoObj = categoryInfoTexts[categoryId] || {};
  const headerText = infoObj[lang] || i18n[lang].catalog_title;
  const keyboard = getCategorySubmenuKeyboard(categoryId, lang);

  try {
    await ctx.deleteMessage();
  } catch (_) {}
  await ctx.reply(headerText, {
    parse_mode: 'HTML',
    reply_markup: keyboard.reply_markup
  });
});

// 3-bosqich: Aniq bir model bosilganda (yoki sahifa o'zgartirilganda) uning RASMI va to'liq ma'lumotlari chiqadi
bot.action(/item_view_([a-zA-Z0-9_]+)_(\d+)/, async (ctx) => {
  const categoryId = ctx.match[1];
  const pageIndex = parseInt(ctx.match[2], 10);
  await sendProductCard(ctx, categoryId, pageIndex, true);
});

// Asosiy 6 ta kategoriyaga qaytish (Skrinshotdagi asosiy 6 ta tugmali menyu)
bot.action('catalog_categories_back', async (ctx) => {
  const lang = getUserLang(ctx.from.id);
  const dict = i18n[lang];
  await ctx.answerCbQuery();

  const keyboard = getCategoriesKeyboard(lang);
  try {
    await ctx.deleteMessage();
  } catch (_) {}
  await ctx.reply(dict.catalog_title, {
    parse_mode: 'HTML',
    reply_markup: keyboard.reply_markup
  });
});

// No-op tugma (o'rtadagi 1/6 sahifa ko'rsatkichi)
bot.action('noop', async (ctx) => {
  await ctx.answerCbQuery();
});

// 📞 Biz bilan aloqa (UZ / RU)
bot.hears(['📞 Biz bilan aloqa', '📞 Связаться с нами'], async (ctx) => {
  const lang = getUserLang(ctx.from.id);
  const dict = i18n[lang];

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url(dict.btn_order_admin, 'https://t.me/Ventstore_Admin')],
    [Markup.button.url(dict.btn_channel, 'https://t.me/ventstore_uz')]
  ]);

  await ctx.reply(dict.contact_text, {
    parse_mode: 'HTML',
    reply_markup: keyboard.reply_markup
  });
});

// 📍 Do‘kon manzili (UZ / RU)
bot.hears(['📍 Do‘kon manzili', '📍 Адрес магазина'], async (ctx) => {
  const lang = getUserLang(ctx.from.id);
  const dict = i18n[lang];

  await ctx.reply(dict.address_text);
  try {
    await ctx.replyWithLocation(41.3532, 69.2483);
  } catch (err) {
    console.error('Lokatsiya yuborishda xatolik:', err.message);
  }
});

// ℹ️ Ventstore haqida (UZ / RU)
bot.hears(['ℹ️ Ventstore haqida', 'ℹ️ О компании Ventstore'], async (ctx) => {
  const lang = getUserLang(ctx.from.id);
  const dict = i18n[lang];
  await ctx.reply(dict.about_text);
});

// 🌐 Tilni o‘zgartirish (UZ / RU)
bot.hears(['🌐 Tilni o‘zgartirish', '🌐 Сменить язык'], async (ctx) => {
  await ctx.reply(
    `Iltimos, tilni tanlang:\nПожалуйста, выберите язык:`,
    getLangSelectionKeyboard()
  );
});

// Botni ishga tushirish va tekshirish
bot.telegram.getMe().then((botInfo) => {
  console.log('----------------------------------------------------');
  console.log(`✅ Ventstore boti muvaffaqiyatli ulandi!`);
  console.log(`🤖 Bot username: @${botInfo.username}`);
  console.log(`🏷 Bot nomi: ${botInfo.first_name}`);
  console.log(`🌐 Tillar: O‘zbekcha (UZ) va Русский (RU)`);
  console.log(`⚡️ Tezlik: file_id kesh tizimi faol!`);
  console.log(`🔘 Tugmalar: To‘g‘ridan-to‘g‘ri matn ostida chiqadi!`);
  console.log(`🚀 Bot xabarlarni qabul qilmoqda!`);
  console.log(`(Botni to'xtatish uchun terminalda Ctrl + C bosing)`);
  console.log('----------------------------------------------------');
}).catch((err) => {
  console.error('❌ Bot tokenini tekshirishda xatolik:', err.message);
});

bot.launch({ dropPendingUpdates: true }).catch((err) => {
  if (err.message && err.message.includes('409')) {
    console.error('❌ XATOLIK: 409 Conflict. Ushbu bot boshqa joyda yoki boshqa terminal oynasida allaqachon ishlayapti!');
    console.log('Iltimos, avvalgi ishlayotgan terminalni yoping yoki Ctrl+C bosing.');
  } else {
    console.error('❌ Bot polling xatoligi:', err.message);
  }
});

// To'xtatish signallari
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Bulutli serverlar (Render / Koyeb / UptimeRobot) uchun port tinglash
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Ventstore Telegram boti faol ishlamoqda! 🚀');
}).listen(PORT, () => {
  console.log(`🌐 Web server ${PORT}-portda ishga tushdi.`);
});

