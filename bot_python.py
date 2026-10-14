import asyncio
import os
import json
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import CommandStart
from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    CallbackQuery,
    FSInputFile,
    InputMediaPhoto
)

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = os.getenv("ADMIN_ID")
USERS_FILE = "users.json"
PRODUCTS_FILE = "products.json"
FILE_IDS_FILE = "file_ids.json"

def load_products():
    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

products_data = load_products()

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_user(user_id, data):
    users = load_users()
    if str(user_id) not in users:
        users[str(user_id)] = {}
    users[str(user_id)].update(data)
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

def load_file_ids():
    if os.path.exists(FILE_IDS_FILE):
        try:
            with open(FILE_IDS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_file_id(product_id, file_id):
    fids = load_file_ids()
    fids[product_id] = file_id
    with open(FILE_IDS_FILE, "w", encoding="utf-8") as f:
        json.dump(fids, f, ensure_ascii=False, indent=2)

def get_user_lang(user_id):
    users = load_users()
    return users.get(str(user_id), {}).get("lang", "uz")

def get_lang_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🇺🇿 O‘zbekcha", callback_data="set_lang_uz"),
                InlineKeyboardButton(text="🇷🇺 Русский", callback_data="set_lang_ru")
            ]
        ]
    )

def get_contact_keyboard(lang="uz"):
    text = "📲 Telefon raqamni yuborish" if lang == "uz" else "📲 Отправить номер телефона"
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text=text, request_contact=True)]],
        resize_keyboard=True
    )

def get_main_menu(lang="uz"):
    if lang == "ru":
        return ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="🛍 Каталог товаров")],
                [KeyboardButton(text="📞 Связаться с нами"), KeyboardButton(text="📍 Адрес магазина")],
                [KeyboardButton(text="ℹ️ О компании Ventstore"), KeyboardButton(text="🌐 Сменить язык")]
            ],
            resize_keyboard=True
        )
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🛍 Mahsulotlar katalogi")],
            [KeyboardButton(text="📞 Biz bilan aloqa"), KeyboardButton(text="📍 Do‘kon manzili")],
            [KeyboardButton(text="ℹ️ Ventstore haqida"), KeyboardButton(text="🌐 Tilni o‘zgartirish")]
        ],
        resize_keyboard=True
    )

def format_spec_key(key, lang):
    spec_map = {
        "voltage": {"uz": "Kuchlanish", "ru": "Напряжение"},
        "power": {"uz": "Quvvat", "ru": "Мощность"},
        "airflow": {"uz": "Havo sarfi", "ru": "Расход воздуха"},
        "pressure": {"uz": "Bosim", "ru": "Давление"},
        "rpm": {"uz": "Aylanish tezligi", "ru": "Скорость вращения"},
        "diameters": {"uz": "Diametrlar", "ru": "Диаметры"},
        "sizes": {"uz": "O‘lchamlar", "ru": "Размеры"}
    }
    return spec_map.get(key, {}).get(lang, key)

def get_categories_menu(lang="uz"):
    is_ru = lang == "ru"
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔄 Рекуператоры" if is_ru else "🔄 Rekuperatorlar", callback_data="cat_pick_rekuperator")],
            [InlineKeyboardButton(text="🌀 Канальные вентиляторы" if is_ru else "🌀 Kanal ventilyatorlari", callback_data="cat_pick_kanal")],
            [InlineKeyboardButton(text="🌪 Центробежные (Улитка)" if is_ru else "🌪 Markazdan qochma (Ulitka)", callback_data="cat_pick_sentrifugal")],
            [InlineKeyboardButton(text="💨 Осевые вентиляторы" if is_ru else "💨 Osevoy (O‘qli) ventilyatorlar", callback_data="cat_pick_osevoy")],
            [InlineKeyboardButton(text="❄️ Водяные охладители (KTS)" if is_ru else "❄️ Suvli sovutgichlar (KTS)", callback_data="cat_pick_sovutgich")],
            [InlineKeyboardButton(text="🚪 Решетки и аксессуары" if is_ru else "🚪 Reshetka va aksessuarlar", callback_data="cat_pick_aksessuarlar")]
        ]
    )

category_info_texts = {
    "kanal": {
        "uz": "🌀 <b>KANAL VENTILYATORLARI</b>\n\nKanal ventilyatorlarining 2 xil asosiy turi mavjud:\n🔩 <b>Temir (metall po‘lat)</b> — kuchli bosim va yuqori chidamlilik uchun (Turkiya va Xitoy)\n🧴 <b>Plastik (shovqinsiz)</b> — xonadonlar, kafelar uchun va 🎮 <b>Masofaviy pultli</b>\n\nKerakli modelni tanlang yoki barchasini ko‘ring:",
        "ru": "🌀 <b>КАНАЛЬНЫЕ ВЕНТИЛЯТОРЫ</b>\n\nКанальные вентиляторы делятся на 2 основных типа по материалу корпуса:\n🔩 <b>В металлическом корпусе</b> — высокое давление и долговечность (Турция и Китай)\n🧴 <b>В пластиковом корпусе</b> — бесшумные для жилых зон и 🎮 <b>С пультом ДУ</b>\n\nВыберите нужную модель или просмотрите все подряд:"
    },
    "rekuperator": {
        "uz": "🔄 <b>REKUPERATORLAR (HAVO ALMASHGICHLAR)</b>\n\nXonadagi issiqlik yoki salqinlikni saqlab qolgan holda toza havo olib kiruvchi zamonaviy energiya tejovchi qurilmalar (Turkiya va Xitoy).\n\nKerakli modelni tanlang:",
        "ru": "🔄 <b>РЕКУПЕРАТОРЫ (ПРИТОЧНО-ВЫТЯЖНЫЕ УСТАНОВКИ)</b>\n\nСистемы вентиляции с рекуперацией тепла для сохранения энергии и притока чистого свежего воздуха (Турция и Китай).\n\nВыберите модель:"
    },
    "sentrifugal": {
        "uz": "🌪 <b>MARKAZDAN QOCHMA (ULITKA) VENTILYATORLARI</b>\n\nSanoat sexlari, omborlar va 🍳 <b>Restoran/kafe oshxonalari (yog‘ va issiq bug‘ga chidamli)</b> uchun kuchli tizimlar.\n\nKerakli modelni tanlang:",
        "ru": "🌪 <b>ЦЕНТРОБЕЖНЫЕ ВЕНТИЛЯТОРЫ (УЛИТКА)</b>\n\nМощные улитки для промышленных цехов, складов и 🍳 <b>Кухонь кафе и ресторанов (жиро- и жаростойкие)</b>.\n\nВыберите модель:"
    },
    "osevoy": {
        "uz": "💨 <b>OSEVOY (O‘QLI) VENTILYATORLAR</b>\n\nIssiqxona, ferma, ombor va zavodlar uchun katta havo oqimini haydovchi o‘qli ventilyatorlar.\n\nKerakli modelni tanlang:",
        "ru": "💨 <b>ОСЕВЫЕ ВЕНТИЛЯТОРЫ</b>\n\nВысокопроизводительные осевые вентиляторы для теплиц, ферм, складов и цехов.\n\nВыберите модель:"
    },
    "sovutgich": {
        "uz": "❄️ <b>SUVLI SOVUTGICHLAR (KTS)</b>\n\nIssiq yoz kunlarida sex, do‘kon, kafe va binolarni suv hisobiga freonsiz tabiiy salqinlatuvchi sanoat sovutgichlari.\n\nModelni ko‘rish uchun pastdagi tugmani bosing:",
        "ru": "❄️ <b>ВОДЯНЫЕ ОХЛАДИТЕЛИ (KTS)</b>\n\nЭкологичные промышленные охладители воздуха испарительного типа (работают на воде без фреона).\n\nНажмите кнопку ниже:"
    },
    "aksessuarlar": {
        "uz": "🚪 <b>RESHETKA VA AKSESSUARLAR</b>\n\nVentilyatsiya panjaralari (barcha rang va o‘lchamlarda buyurtma asosida tayyorlab beriladi).\n\nModelni ko‘rish uchun pastdagi tugmani bosing:",
        "ru": "🚪 <b>РЕШЕТКИ И АКСЕССУАРЫ</b>\n\nВентиляционные решетки и жалюзи любых цветов и размеров под заказ.\n\nНажмите кнопку ниже:"
    }
}

def get_category_submenu(category_id, lang="uz"):
    is_ru = lang == "ru"
    prods = [p for p in products_data["products"] if p["categoryId"] == category_id]
    buttons = []

    for idx, p in enumerate(prods):
        label = p.get("btn_ru", p["title_ru"]) if is_ru else p.get("btn_uz", p["title_uz"])
        buttons.append([InlineKeyboardButton(text=label, callback_data=f"item_view_{category_id}_{idx}")])

    if len(prods) > 1:
        all_text = "➡️ Смотреть все модели подряд" if is_ru else "➡️ Barcha modellarni ketma-ket ko‘rish"
        buttons.append([InlineKeyboardButton(text=all_text, callback_data=f"item_view_{category_id}_0")])

    back_text = "🔙 Другие категории" if is_ru else "🔙 Boshqa kategoriyalar"
    buttons.append([InlineKeyboardButton(text=back_text, callback_data="catalog_categories_back")])

    return InlineKeyboardMarkup(inline_keyboard=buttons)

def build_product_caption(product, index, total, lang):
    is_ru = lang == "ru"
    title = product["title_ru"] if is_ru else product["title_uz"]
    origin = product["origin_ru"] if is_ru else product["origin_uz"]
    body = product.get("body_ru" if is_ru else "body_uz")
    control = product.get("control_ru" if is_ru else "control_uz")
    desc = product["desc_ru"] if is_ru else product["desc_uz"]

    caption = f"📌 <b>{title} ({index + 1} / {total})</b>\n\n"
    if origin:
        caption += f"{'🏭 Производитель:' if is_ru else '🏭 Ishlab chiqaruvchi:'} <b>{origin}</b>\n"
    if body:
        caption += f"{'🛡 Корпус:' if is_ru else '🛡 Korpus turi:'} <b>{body}</b>\n"
    if control:
        caption += f"{'🎮 Управление:' if is_ru else '🎮 Boshqaruv:'} <b>{control}</b>\n"
    if desc:
        caption += f"\nℹ️ <i>{desc}</i>\n"

    if product.get("specs"):
        caption += f"\n⚙️ <b>{'Характеристики:' if is_ru else 'Xususiyatlari:'}</b>\n"
        for k, v in product["specs"].items():
            label = format_spec_key(k, lang)
            val = str(v)
            if is_ru:
                val = val.replace("m³/soat", "м³/час").replace("ayl/min", "об/мин")
            caption += f"• {label}: <b>{val}</b>\n"

    if product.get("models"):
        caption += f"\n📊 <b>{'Модели и цены:' if is_ru else 'Modellar va narxlar:'}</b>\n"
        for m in product["models"]:
            flow = m.get("airflow", "")
            if is_ru and flow:
                flow = flow.replace("m³/soat", "м³/час")
            extra = f" ({flow})" if flow else ""
            price_text = f"{m['price']} $" if isinstance(m['price'], (int, float)) else str(m['price'])
            caption += f"• {m['model']}{extra} — 💰 <b>{price_text}</b>\n"

    if len(caption) > 1020:
        caption = caption[:1017] + "..."

    return caption

def get_product_keyboard(category_id, index, total, lang):
    is_ru = lang == "ru"
    prev_idx = (index - 1 + total) % total
    next_idx = (index + 1) % total

    buttons = []
    if total > 1:
        prev_text = "⬅️ Назад" if is_ru else "⬅️ Oldingi"
        next_text = "Вперед ➡️" if is_ru else "Keyingi ➡️"
        buttons.append([
            InlineKeyboardButton(text=prev_text, callback_data=f"item_view_{category_id}_{prev_idx}"),
            InlineKeyboardButton(text=f"{index + 1} / {total}", callback_data="noop"),
            InlineKeyboardButton(text=next_text, callback_data=f"item_view_{category_id}_{next_idx}")
        ])

    order_text = "💬 Заказать (Администратор)" if is_ru else "💬 Buyurtma berish (Admin)"
    buttons.append([InlineKeyboardButton(text=order_text, url="https://t.me/Ventstore_Admin")])

    back_models = "🔙 К списку моделей" if is_ru else "🔙 Modellar ro‘yxatiga qaytish"
    buttons.append([InlineKeyboardButton(text=back_models, callback_data=f"subcat_{category_id}")])

    cats_text = "🔙 Другие категории" if is_ru else "🔙 Boshqa kategoriyalar"
    buttons.append([InlineKeyboardButton(text=cats_text, callback_data="catalog_categories_back")])

    return InlineKeyboardMarkup(inline_keyboard=buttons)

dp = Dispatcher()

@dp.message(CommandStart())
async def start_handler(message: types.Message):
    user_id = str(message.from_user.id)
    users = load_users()

    if user_id in users and users[user_id].get("phone") and users[user_id].get("lang"):
        lang = users[user_id]["lang"]
        msg = f"Assalomu alaykum, {message.from_user.first_name}! 👋" if lang == "uz" else f"Здравствуйте, {message.from_user.first_name}! 👋"
        await message.answer(msg, reply_markup=get_main_menu(lang))
        return

    await message.answer(
        "Assalomu alaykum! Ventstore botiga xush kelibsiz! 👋\n"
        "Здравствуйте! Добро пожаловать в бот Ventstore! 🌬🏢\n\n"
        "Iltimos, tilni tanlang:\nПожалуйста, выберите язык:",
        reply_markup=get_lang_keyboard()
    )

@dp.callback_query(F.data.in_(["set_lang_uz", "set_lang_ru"]))
async def lang_callback(callback: CallbackQuery):
    user_id = str(callback.from_user.id)
    chosen_lang = "ru" if callback.data == "set_lang_ru" else "uz"
    save_user(user_id, {"lang": chosen_lang})
    users = load_users()

    await callback.answer()

    if user_id in users and users[user_id].get("phone"):
        msg = "Til o‘zgartirildi! 🇺🇿" if chosen_lang == "uz" else "Язык изменен! 🇷🇺"
        await callback.message.answer(msg, reply_markup=get_main_menu(chosen_lang))
        return

    welcome = (
        f"Здравствуйте, {callback.from_user.first_name}! 👋\n\n"
        "Добро пожаловать в официальный бот Ventstore! 🌬🏢\n"
        "Для просмотра каталога и цен, пожалуйста, отправьте ваш номер телефона ниже."
        if chosen_lang == "ru" else
        f"Assalomu alaykum, {callback.from_user.first_name}! 👋\n\n"
        "Ventstore rasmiy Telegram botiga xush kelibsiz! 🌬🏢\n"
        "Narxlar katalogini ko‘rish uchun, iltimos, pastdagi tugma orqali telefon raqamingizni yuboring."
    )
    await callback.message.answer(welcome, reply_markup=get_contact_keyboard(chosen_lang))

@dp.message(F.contact)
async def contact_handler(message: types.Message, bot: Bot):
    user_id = str(message.from_user.id)
    lang = get_user_lang(user_id)
    contact = message.contact

    save_user(user_id, {
        "userId": user_id,
        "phone": contact.phone_number,
        "firstName": contact.first_name or message.from_user.first_name,
        "lastName": contact.last_name or "",
        "username": f"@{message.from_user.username}" if message.from_user.username else "Mavjud emas",
        "lang": lang
    })

    conf = (
        f"✅ Rahmat, {contact.first_name}!\nTelefon raqamingiz qabul qilindi."
        if lang == "uz"
        else f"✅ Спасибо, {contact.first_name}!\nВаш номер принят."
    )
    await message.answer(conf, reply_markup=get_main_menu(lang))

@dp.message(F.text.in_(["🛍 Mahsulotlar katalogi", "🛍 Каталог товаров"]))
async def catalog_open_handler(message: types.Message):
    lang = get_user_lang(message.from_user.id)
    title = (
        "📦 КАТАЛОГ ТОВАРОВ VENTSTORE 🌬🏢\n\nВыберите одну из категорий ниже:"
        if lang == "ru"
        else "📦 VENTSTORE MAHSULOTLAR KATALOGI 🌬🏢\n\nQuyidagi kategoriyalardan birini tanlang:"
    )
    await message.answer(title, reply_markup=get_categories_menu(lang))

@dp.callback_query(F.data.startswith("cat_pick_"))
async def category_picked_handler(callback: CallbackQuery):
    cat_id = callback.data.replace("cat_pick_", "")
    lang = get_user_lang(callback.from_user.id)

    info = category_info_texts.get(cat_id, {})
    text = info.get(lang, "Kategoriya:")
    kb = get_category_submenu(cat_id, lang)

    await callback.answer()
    try:
        await callback.message.edit_text(text, parse_mode="HTML", reply_markup=kb)
    except Exception:
        try:
            await callback.message.delete()
        except Exception:
            pass
        await callback.message.answer(text, parse_mode="HTML", reply_markup=kb)

@dp.callback_query(F.data.startswith("subcat_"))
async def subcat_back_handler(callback: CallbackQuery):
    cat_id = callback.data.replace("subcat_", "")
    lang = get_user_lang(callback.from_user.id)

    info = category_info_texts.get(cat_id, {})
    text = info.get(lang, "Kategoriya:")
    kb = get_category_submenu(cat_id, lang)

    await callback.answer()
    try:
        await callback.message.delete()
    except Exception:
        pass
    await callback.message.answer(text, parse_mode="HTML", reply_markup=kb)

@dp.callback_query(F.data.startswith("item_view_"))
async def item_view_handler(callback: CallbackQuery):
    parts = callback.data.split("_")
    cat_id = parts[2]
    idx = int(parts[3])
    lang = get_user_lang(callback.from_user.id)

    prods = [p for p in products_data["products"] if p["categoryId"] == cat_id]
    if not prods:
        await callback.answer("Bo‘sh / Пусто")
        return

    total = len(prods)
    idx = max(0, min(idx, total - 1))
    p = prods[idx]

    caption = build_product_caption(p, idx, total, lang)
    kb = get_product_keyboard(cat_id, idx, total, lang)

    file_ids = load_file_ids()
    cached_fid = file_ids.get(p["id"])

    await callback.answer()

    if cached_fid:
        try:
            media = InputMediaPhoto(media=cached_fid, caption=caption, parse_mode="HTML")
            await callback.message.edit_media(media=media, reply_markup=kb)
            return
        except Exception:
            pass

    photo_file = FSInputFile(p["photo"])
    try:
        await callback.message.delete()
    except Exception:
        pass
    sent_msg = await callback.message.answer_photo(photo=photo_file, caption=caption, parse_mode="HTML", reply_markup=kb)
    if sent_msg.photo:
        save_file_id(p["id"], sent_msg.photo[-1].file_id)

@dp.callback_query(F.data == "catalog_categories_back")
async def back_to_categories_handler(callback: CallbackQuery):
    lang = get_user_lang(callback.from_user.id)
    title = (
        "📦 КАТАЛОГ ТОВАРОВ VENTSTORE 🌬🏢\n\nВыберите одну из категорий ниже:"
        if lang == "ru"
        else "📦 VENTSTORE MAHSULOTLAR KATALOGI 🌬🏢\n\nQuyidagi kategoriyalardan birini tanlang:"
    )
    await callback.answer()
    try:
        await callback.message.delete()
    except Exception:
        pass
    await callback.message.answer(title, reply_markup=get_categories_menu(lang))

@dp.callback_query(F.data == "noop")
async def noop_handler(callback: CallbackQuery):
    await callback.answer()

@dp.message(F.text.in_(["🌐 Tilni o‘zgartirish", "🌐 Сменить язык"]))
async def change_lang_handler(message: types.Message):
    await message.answer("Iltimos, tilni tanlang:\nВыберите язык:", reply_markup=get_lang_keyboard())

async def main():
    if not BOT_TOKEN or BOT_TOKEN == "SIZNING_BOT_TOKENINGIZ":
        print("XATOLIK: .env faylida BOT_TOKEN yo'q!")
        return
    bot = Bot(token=BOT_TOKEN)
    print("✅ Ventstore boti ishga tushdi!")
    await dp.start_polling(bot, drop_pending_updates=True)

if __name__ == "__main__":
    asyncio.run(main())
