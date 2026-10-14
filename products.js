// Ventstore ikki tilli (UZ / RU) mahsulotlar bazasi
module.exports = {
  rekuperatorlar: {
    id: "rekuperatorlar",
    title_uz: "🔄 REKUPERATORLAR (HAVO ALMASHGICHLAR)",
    title_ru: "🔄 РЕКУПЕРАТОРЫ (ПРИТОЧНО-ВЫТЯЖНЫЕ УСТАНОВКИ)",
    desc_uz: "Issiqlik va energiyani tejovchi toza havo almashtirish tizimlari. Xonadagi iliqlik yoki salqinlikni yo‘qotmasdan havoni doimiy tozalab turadi.",
    desc_ru: "Системы вентиляции с рекуперацией тепла. Сохраняют тепло зимой и прохладу летом, обеспечивая постоянный приток свежего и чистого воздуха.",
    items: [
      {
        name_uz: "DHR Rekuperatorlari",
        name_ru: "Рекуператоры DHR",
        desc_uz: "Kirish-chiqish tizimlari uchun issiqlikni qayta tiklash qurilmasi. Toksiz ishlaydi (havo oqimi hisobiga).",
        desc_ru: "Устройства рекуперации тепла для приточно-вытяжных систем. Работают без электричества (за счет воздушного потока).",
        models: [
          { model: "DHR 10", flow: "1 000 m³/soat", price: "270 $" },
          { model: "DHR 20", flow: "2 000 m³/soat", price: "348 $" },
          { model: "DHR 30", flow: "2 700 m³/soat", price: "498 $" },
          { model: "DHR 40", flow: "4 000 m³/soat", price: "612 $" },
          { model: "DHR 50", flow: "6 000 m³/soat", price: "1 068 $" }
        ]
      },
      {
        name_uz: "Uvents UVS-IGK (230V, Turkiya 🇹🇷)",
        name_ru: "Uvents UVS-IGK (230V, Турция 🇹🇷)",
        desc_uz: "Sanoat va yirik binolar uchun professional rekuperator tizimi.",
        desc_ru: "Профессиональные рекуператоры для промышленных и коммерческих объектов.",
        models: [
          { model: "UVS-IGK 100", flow: "1 800 m³/soat | 710 Pa", price: "1 020 $" },
          { model: "UVS-IGK 200", flow: "2 500 m³/soat | 380 Pa", price: "1 260 $" },
          { model: "UVS-IGK 300", flow: "3 000 m³/soat | 430 Pa", price: "1 500 $" },
          { model: "UVS-IGK 400", flow: "4 000 m³/soat | 610 Pa", price: "1 680 $" },
          { model: "UVS-IGK 500", flow: "6 000 m³/soat | 530 Pa", price: "2 154 $" }
        ]
      },
      {
        name_uz: "IGKP (220V) Rekuperator (Turkiya 🇹🇷)",
        name_ru: "Рекуператор IGKP (220V, Турция 🇹🇷)",
        desc_uz: "1000 dan 7000 m³/soatgacha havo almashinuvi, 270W – 2200W, 1400 ayl/min. Narxi: 700$ dan 3000$ gacha.",
        desc_ru: "Воздухообмен от 1000 до 7000 м³/час, мощность 270W – 2200W, 1400 об/мин. Цена: от 700$ до 3000$.",
        models: []
      },
      {
        name_uz: "AIROX FEM seriyasi (Yangi avlod)",
        name_ru: "Серия AIROX FEM (Новое поколение)",
        desc_uz: "Uy va ofislar uchun toza havo rekuperatori. Shovqinsiz ishlaydi, energiyani tejaydi. Narxi: 425$ dan boshlanadi.",
        desc_ru: "Бытовые рекуператоры для домов и офисов. Бесшумная работа, экономия энергии. Цена: от 425$.",
        models: []
      },
      {
        name_uz: "AIROX HRV-S va HRV-C",
        name_ru: "AIROX HRV-S и HRV-C",
        desc_uz: "Kanalli rekuperatorlar. EC/AC motor, tezlikni uzluksiz boshqarish, ko‘p bosqichli filtrlash.",
        desc_ru: "Канальные рекуператоры с EC/AC мотором, плавной регулировкой скорости и фильтрацией.",
        models: []
      },
      {
        name_uz: "BE Series Rekuperator",
        name_ru: "Рекуператоры BE Series",
        desc_uz: "Nanometr qoplamali HTR yadro, yuviladigan filtr, mis motor. Shifoxona, maktab, ofis va mehmonxonalar uchun.",
        desc_ru: "Энергосберегающий теплообменник HTR с нанопокрытием, моющийся фильтр. Для больниц, школ, офисов и гостиниц.",
        models: []
      }
    ]
  },

  kanal_ventilyatorlari: {
    id: "kanal_ventilyatorlari",
    title_uz: "🌀 KANAL VENTILYATORLARI",
    title_ru: "🌀 КАНАЛЬНЫЕ ВЕНТИЛЯТОРЫ",
    desc_uz: "Kanal va quvurlar ichiga o‘rnatiladigan yuqori samarali dumaloq va to‘rtburchak ventilyatorlar.",
    desc_ru: "Высокоэффективные круглые и прямоугольные вентиляторы для монтажа в вентиляционные каналы.",
    items: [
      {
        name_uz: "Kalvent KWX / KVX (Turkiya 🇹🇷)",
        name_ru: "Kalvent KWX / KVX (Турция 🇹🇷)",
        desc_uz: "Yuqori aylanish quvvati, shovqinsiz va energiya tejamkor.",
        desc_ru: "Высокая производительность, низкий уровень шума и энергоэффективность.",
        models: [
          { model: "KVX-100", flow: "290 m³/soat", price: "45 $" },
          { model: "KVX-125", flow: "410 m³/soat", price: "52 $" },
          { model: "KVX-150", flow: "600 m³/soat", price: "56 $" },
          { model: "KVX-160", flow: "620 m³/soat", price: "58 $" },
          { model: "KVX-200", flow: "1000 m³/soat", price: "77 $" },
          { model: "KVX-250", flow: "1120 m³/soat", price: "80 $" },
          { model: "KVX-315", flow: "1800 m³/soat", price: "90 $" }
        ]
      },
      {
        name_uz: "Kalvent KMX seriyasi (Turkiya 🇹🇷)",
        name_ru: "Серия Kalvent KMX (Турция 🇹🇷)",
        desc_uz: "Kanal tizimlari uchun ixcham va mustahkam ventilyatorlar.",
        desc_ru: "Компактные и надежные канальные вентиляторы в прочном корпусе.",
        models: [
          { model: "KMX-100", flow: "Standart", price: "35 $" },
          { model: "KMX-125", flow: "Standart", price: "37 $" },
          { model: "KMX-150", flow: "Standart", price: "47 $" },
          { model: "KMX-200", flow: "Standart", price: "68 $" },
          { model: "KMX-250", flow: "Standart", price: "157 $" },
          { model: "KMX-315", flow: "Standart", price: "187 $" }
        ]
      },
      {
        name_uz: "Kalvent DKF (To‘g‘ri burchakli kanal, 230V, Turkiya 🇹🇷)",
        name_ru: "Kalvent DKF (Прямоугольный канал, 230V, Турция 🇹🇷)",
        desc_uz: "Katta obyektlar va sanoat kanallari uchun kuchli metall ventilyatorlar.",
        desc_ru: "Мощные вентиляторы в металлическом корпусе для промышленных прямоугольных каналов.",
        models: [
          { model: "DKF 40-20B", flow: "1 250 m³/soat", price: "142 $" },
          { model: "DKF 50-25", flow: "1 700 m³/soat", price: "182 $" },
          { model: "DKF 60-30", flow: "1 950 m³/soat", price: "275 $" },
          { model: "DKF 60-35B", flow: "3 400 m³/soat", price: "349 $" },
          { model: "DKF 70-40B", flow: "4 900 m³/soat", price: "522 $" },
          { model: "DKF 80-50", flow: "7 800 m³/soat", price: "782 $" },
          { model: "DKF 100-50", flow: "9 800 m³/soat", price: "1 008 $" }
        ]
      },
      {
        name_uz: "Pultli HZ kanal ventilyatorlari (220V)",
        name_ru: "Канальные вентиляторы HZ с пультом (220V)",
        desc_uz: "Masofadan pult orqali tezlikni boshqarish imkoniyatiga ega.",
        desc_ru: "Дистанционное управление скоростью с помощью пульта управления.",
        models: [
          { model: "HZ-100", flow: "390 m³/soat | 30W", price: "47 $" },
          { model: "HZ-150", flow: "600 m³/soat | 40W", price: "56 $" },
          { model: "HZ-200", flow: "1300 m³/soat | 80W", price: "60 $" }
        ]
      },
      {
        name_uz: "KAYI REC va RAD seriyalari (Turkiya 🇹🇷)",
        name_ru: "Серии KAYI REC и RAD (Турция 🇹🇷)",
        desc_uz: "To‘g‘ri burchakli va dumaloq korpus. REC narxi: 120$ dan, RAD narxi: 50$ dan boshlanadi.",
        desc_ru: "Прямоугольный и круглый корпус. Цена REC: от 120$, цена RAD: от 50$.",
        models: []
      },
      {
        name_uz: "HF Sokin kanal ventilyatorlari (Xitoy 🇨🇳)",
        name_ru: "Бесшумные канальные вентиляторы HF (Китай 🇨🇳)",
        desc_uz: "Shovqinsiz ishlash rejimi. Uy, kafe va ofislar uchun. Narxlar: 21$ dan boshlanadi.",
        desc_ru: "Низкий уровень шума. Идеально для дома, кафе и офиса. Цены: от 21$.",
        models: []
      },
      {
        name_uz: "CDR2E va DPT seriyalari",
        name_ru: "Серии CDR2E и DPT",
        desc_uz: "220V kuchlanish, 310–2900 m³/soat havo unumdorligi, yuqori bosim.",
        desc_ru: "Напряжение 220V, производительность 310–2900 м³/час, высокое давление.",
        models: []
      }
    ]
  },

  markazdan_qochma_ulitka: {
    id: "markazdan_qochma_ulitka",
    title_uz: "🌪 MARKAZDAN QOCHMA (ULITKA) VENTILYATORLARI",
    title_ru: "🌪 ЦЕНТРОБЕЖНЫЕ ВЕНТИЛЯТОРЫ (УЛИТКА)",
    desc_uz: "Sanoat sexlari, omborlar va yuqori bosimli tizimlar uchun kuchli ventilyatorlar.",
    desc_ru: "Мощные вентиляторы для цехов, складов и систем с повышенным сопротивлением воздуха.",
    items: [
      {
        name_uz: "AIROX 9-19 Yuqori bosimli sanoat ventilyatori (380V)",
        name_ru: "AIROX 9-19 Высокого давления (380V)",
        desc_uz: "Juda kuchli bosimli sanoat ventilyatori.",
        desc_ru: "Промышленный центробежный вентилятор высокого давления.",
        models: [
          { model: "9-19 (7.5 kW)", flow: "1610–2844 m³/s | Bosim 5517–5697 Pa", price: "702 $" },
          { model: "9-19 (11 kW)", flow: "3166–3488 m³/s | Bosim 5080–5323 Pa", price: "852 $" }
        ]
      },
      {
        name_uz: "AIROX CF-11 Sentrifugal Ulitka (220V / 380V)",
        name_ru: "AIROX CF-11 Центробежная улитка (220V / 380V)",
        desc_uz: "370W – 2200W quvvat, 700 – 12 300 m³/soat havo aylanishi. Narxi: 94$ dan 332$ gacha.",
        desc_ru: "Мощность 370W – 2200W, расход воздуха 700 – 12 300 м³/час. Цена: от 94$ до 332$.",
        models: []
      },
      {
        name_uz: "YWL4E Kvadrat Ulitka (220V)",
        name_ru: "Квадратная улитка YWL4E (220V)",
        desc_uz: "Kvadrat korpusli qulay o‘rnatiladigan ventilyator. 1500 – 9000 m³/soat. Narxi: 98$ dan 332$ gacha.",
        desc_ru: "Удобный монтаж в квадратном корпусе. 1500 – 9000 м³/час. Цена: от 98$ до 332$.",
        models: []
      },
      {
        name_uz: "200°C issiqqa chidamli sanoat ventilyatorlari",
        name_ru: "Жаростойкие вентиляторы до 200°C",
        desc_uz: "Issiq sexlar, nonvoyxonalar va yuqori haroratli joylar uchun maxsus.",
        desc_ru: "Специальное исполнение для пекарен, горячих цехов и сушильных камер.",
        models: []
      }
    ]
  },

  oshxona: {
    id: "oshxona",
    title_uz: "🍳 OSHXONA VENTILYATORLARI (AIROX PCF)",
    title_ru: "🍳 КУХОННЫЕ ВЕНТИЛЯТОРЫ (AIROX PCF)",
    desc_uz: "Kafe, restoran va oshxonalar uchun maxsus yog‘li havo, issiq bug‘ va hidlarni chiqaruvchi kuchli ventilyatorlar.",
    desc_ru: "Профессиональные вытяжные вентиляторы для кухонь кафе и ресторанов от жира, пара и запахов.",
    items: [
      {
        name_uz: "AIROX PCF (380V, Professional oshxona ventilyatori)",
        name_ru: "AIROX PCF (380V, Профессиональный кухонный вентилятор)",
        desc_uz: "Yog‘li havo va bug‘ga chidamli motor, yuqori tortish bosimi.",
        desc_ru: "Устойчивый к жиру и пару двигатель с высоким давлением всасывания.",
        models: [
          { model: "PCF 240A (0.75 kW)", flow: "3 851 m³/soat", price: "342 $" },
          { model: "PCF 260A (1.1 kW)", flow: "4 161 m³/soat", price: "360 $" },
          { model: "PCF 280A (1.5 kW)", flow: "6 457 m³/soat", price: "411 $" },
          { model: "PCF 300A (2.2 kW)", flow: "6 982 m³/soat", price: "482 $" },
          { model: "PCF 300B (3.0 kW)", flow: "7 527 m³/soat", price: "510 $" },
          { model: "PCF 320A (4.0 kW)", flow: "10 010 m³/soat", price: "564 $" }
        ]
      }
    ]
  },

  osevoy_ventilyatorlar: {
    id: "osevoy_ventilyatorlar",
    title_uz: "💨 OSEVOY (O‘QLI) VENTILYATORLAR",
    title_ru: "💨 ОСЕВЫЕ ВЕНТИЛЯТОРЫ",
    desc_uz: "Devorga va derazaga o‘rnatiladigan, katta havo oqimini haydovchi o‘qli ventilyatorlar.",
    desc_ru: "Настенные и оконные вентиляторы для перемещения больших объемов воздуха.",
    items: [
      {
        name_uz: "Stronbull EB seriyasi (Xitoy 🇨🇳)",
        name_ru: "Серия Stronbull EB (Китай 🇨🇳)",
        desc_uz: "Sifatli va hamyonbop o‘qli ventilyatorlar.",
        desc_ru: "Надежные и доступные осевые вентиляторы.",
        models: [
          { model: "EB 2.5A-4-0.75 (380V)", flow: "1 105 m³/soat", price: "52 $" },
          { model: "EB 3A-4-0.9 (380V)", flow: "1 530 m³/soat", price: "60 $" },
          { model: "EB 3A-4-0.9 (220V)", flow: "1 530 m³/soat", price: "71 $" },
          { model: "EB 3.5A-4-0.15 (380V)", flow: "2 448 m³/soat", price: "80 $" },
          { model: "EB 4A-4-0.2 (220V)", flow: "3 751 m³/soat", price: "80 $" },
          { model: "EB 5A-4-0.3 (220V)", flow: "5 140 m³/soat", price: "96 $" },
          { model: "EB 6A-4-0.46 (220V)", flow: "7 502 m³/soat", price: "124 $" }
        ]
      },
      {
        name_uz: "AIROX KTB Osevoy (220V va 380V)",
        name_ru: "Осевые вентиляторы AIROX KTB (220V / 380V)",
        desc_uz: "Katta havo sarfi: 7 000 dan 55 000 m³/soatgacha. Issiqxona, ferma va sexlar uchun. Narxi: 125$ – 135$ dan boshlanadi.",
        desc_ru: "Производительность от 7 000 до 55 000 м³/ч. Для теплиц, ферм и складов. Цена: от 125$ – 135$.",
        models: []
      },
      {
        name_uz: "POG seriyasi Osevoy ventilyatorlar",
        name_ru: "Осевые вентиляторы серии POG",
        desc_uz: "Zavod va katta angarlar uchun kuchli o‘qli ventilyatorlar. Narxi: 135$ dan boshlanadi.",
        desc_ru: "Для заводов и ангаров большой площади. Цена: от 135$.",
        models: []
      }
    ]
  },

  suvli_sovutgichlar: {
    id: "suvli_sovutgichlar",
    title_uz: "❄️ SUVLI SOVUTGICHLAR VA TOM VENTILYATORLARI",
    title_ru: "❄️ ВОДЯНЫЕ ОХЛАДИТЕЛИ И КРЫШНЫЕ ВЕНТИЛЯТОРЫ",
    desc_uz: "Issiq yoz kunlarida sex, do‘kon, kafe va ochiq maydonlarni salqinlatuvchi ekologik toza uskunalar.",
    desc_ru: "Экологичные охладители воздуха испарительного типа для цехов, складов, ресторанов и террас.",
    items: [
      {
        name_uz: "KTS seriyali suvli sovutgichlar",
        name_ru: "Водяные охладители серии KTS",
        desc_uz: "Suv bug‘lanishi hisobiga havoni toza va tabiiy sovutadi.",
        desc_ru: "Эффективное охлаждение за счет испарения воды без фреона.",
        models: [
          { model: "KTS-760", flow: "5 000 m³/soat", price: "53 $ dan" },
          { model: "KTS-840", flow: "7 000 m³/soat", price: "Mavjud" },
          { model: "KTS-965", flow: "9 000 m³/soat", price: "Mavjud" },
          { model: "KTS-1145", flow: "11 000 m³/soat", price: "Mavjud" },
          { model: "KTS-1300 / 1250", flow: "13 000 m³/soat", price: "Mavjud" },
          { model: "KTS-1800 (1000W, 220V)", flow: "Katta hajm", price: "372$ – 456$" }
        ]
      },
      {
        name_uz: "CRAD tom ventilyatorlari",
        name_ru: "Крышные вентиляторы CRAD",
        desc_uz: "520 dan 9 300 m³/soatgacha. Tomga o‘rnatiladi, issiq havoni yuqoridan so‘rib chiqaradi.",
        desc_ru: "От 520 до 9 300 м³/ч. Устанавливаются на крыше для удаления горячего воздуха.",
        models: []
      }
    ]
  },

  aksessuarlar: {
    id: "aksessuarlar",
    title_uz: "🚪 RESHETKA VA AKSESSUARLAR",
    title_ru: "🚪 РЕШЕТКИ И АКСЕССУАРЫ",
    desc_uz: "Ventilyatsiya tizimlari uchun qo‘shimcha zaruriy qismlar.",
    desc_ru: "Дополнительные комплектующие для систем вентиляции.",
    items: [
      {
        name_uz: "Ventilyatsiya panjaralari (Reshetka)",
        name_ru: "Вентиляционные решетки",
        desc_uz: "Barcha rang va o‘lchamlarda oldindan buyurtma asosida tayyorlab beriladi.",
        desc_ru: "Изготовление любых цветов и размеров под заказ.",
        models: [
          { model: "Reshetka 30 x 30 sm", flow: "O‘lcham / Размер", price: "Buyurtma asosida / Под заказ" },
          { model: "Reshetka 45 x 45 sm", flow: "O‘lcham / Размер", price: "Buyurtma asosida / Под заказ" },
          { model: "Reshetka 60 x 60 sm", flow: "O‘lcham / Размер", price: "Buyurtma asosida / Под заказ" },
          { model: "Reshetka 75 x 75 sm", flow: "O‘lcham / Размер", price: "Buyurtma asosida / Под заказ" }
        ]
      },
      {
        name_uz: "Ventilyatsion peremichkalar",
        name_ru: "Вентиляционные перемычки",
        desc_uz: "Havo yo‘nalishini boshqarish va ajratish uchun maxsus klapanlar.",
        desc_ru: "Клапаны и перемычки для перераспределения воздушных потоков.",
        models: []
      }
    ]
  }
};
