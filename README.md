# Ventstore — Rasmiy Telegram Boti 🌬🏢

Ushbu bot **Ventstore** do'koni uchun yaratilgan bo'lib, barcha rekuperatorlar, kanal ventilyatorlari, ulitka va o'qli ventilyatorlar katalogi, narxlari va kontaktlarini o'z ichiga oladi.

## 🚀 Asosiy imkoniyatlari:
1. **Salomlashish va majburiy telefon raqami:**
   - Foydalanuvchi `/start` bosganda unga xush kelibsiz xabari chiqadi.
   - Telefon raqamini yubormaguncha menyuni ko'ra olmaydi (`📲 Telefon raqamni yuborish` tugmasi).
2. **Xat / Xabarnoma tizimi:**
   - Har bir yangi mijoz telefon raqamini yuborganda, ma'lumotlar `users.json` bazasiga yoziladi.
   - Adminga darhol mijozning ismi, telefon raqami va profili xat (xabarnoma) bo'lib boradi.
3. **To'liq katalog va narxlar:**
   - 🔄 Rekuperatorlar (DHR, UVS-IGK, IGKP, Airox FEM, HRV-S/C, BE Series)
   - 🌀 Kanal ventilyatorlari (Kalvent KWX/KVX, KMX, DKF, HZ pultli, KAYI REC/RAD, HF)
   - 🌪 Markazdan qochma (Ulitka) ventilyatorlari (Airox PCF, 9-19, CF-11, YWL4E)
   - 💨 Osevoy (O'qli) ventilyatorlar (Stronbull EB, Airox KTB, POG)
   - ❄️ Suvli sovutgichlar (KTS-760...1800, CRAD)
   - 🚪 Reshetkalar va aksessuarlar
4. **Do'kon lokatsiyasi va kontaktlar:**
   - Jom'e bozori, EvroAsia 2-blok, 30-do'kon.
   - Lokatsiya xaritasi va to'g'ridan-to'g'ri aloqa telefonlari.

---

## 🛠 Ishga tushirish (Node.js / JavaScript):

Kompyuteringizda Node.js o'rnatilgan, shuning uchun darhol ishga tushirishingiz mumkin:

1. `.env` faylini oching va `@BotFather` dan olgan bot tokeningizni yozing:
   ```env
   BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ADMIN_ID=SIZNING_TELEGRAM_ID_INGIZ
   ```
2. Botni ishga tushiring:
   ```bash
   node bot.js
   ```

---

## 🐍 Python (aiogram 3) orqali ishga tushirish (Muqobil):

Agar Python orqali ishlatmoqchi bo'lsangiz:
```bash
pip install -r requirements.txt
python bot_python.py
```
