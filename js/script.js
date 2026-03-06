// =========================================
// 🌙 عداد الإفطار الديناميكي
// =========================================

const el = document.querySelector("#iftar-countdown");
let alerted = false;
let halfAlerted = false;
let iftarHour = null;
let iftarMinute = null;

async function fetchIftarTime(city, country) {
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`,
    );
    const data = await res.json();
    const maghrib = data.data.timings.Maghrib;
    [iftarHour, iftarMinute] = maghrib.split(":").map(Number);
  } catch (err) {
    console.error("تعذّر جلب وقت الإفطار:", err);
    iftarHour = 17;
    iftarMinute = 40;
  }
}

async function fetchIftarTimeByCoords(lat, lng) {
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`,
    );
    const data = await res.json();
    const maghrib = data.data.timings.Maghrib;
    [iftarHour, iftarMinute] = maghrib.split(":").map(Number);
  } catch (err) {
    console.error("تعذّر جلب وقت الإفطار:", err);
    iftarHour = 17;
    iftarMinute = 40;
  }
}

function getIftarDate() {
  const iftar = new Date();
  iftar.setHours(iftarHour, iftarMinute, 0, 0);
  return iftar;
}

function startCountdown() {
  setInterval(() => {
    if (iftarHour === null) return;

    const now = new Date();
    let iftar = getIftarDate();
    const diff = iftar - now;
    const diffAbs = Math.abs(diff);

    if (diff <= 0 && diffAbs <= 30 * 60 * 1000) {
      const minsAgo = Math.floor(diffAbs / 60000);
      const secsAgo = Math.floor((diffAbs % 60000) / 1000);
      el.innerHTML = `
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">🍽️ أفطرتَ منذ</div>
          <div class="text-xl font-bold mt-1 text-green-700">
            ${String(minsAgo).padStart(2, "0")} دقيقة : ${String(secsAgo).padStart(2, "0")} ثانية
          </div>
          <div class="text-purple-600 font-bold mt-2 text-sm">
            ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ 🤲
          </div>
        </div>`;
      if (!alerted) {
        alerted = true;
        Swal.fire({
          title: "🌙 إفطار مبارك",
          html: `
            <div class="text-lg font-bold text-gray-700 mb-3">تقبّل الله صيامكم وقيامكم</div>
            <div class="bg-purple-50 rounded-xl p-4 text-center text-gray-800 font-bold leading-8">
              ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ<br/>وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
            </div>`,
          confirmButtonText: "اللهم آمين",
          confirmButtonColor: "#7c3aed",
          background: "#fdf4ff",
        });
      }
      return;
    }

    if (diff <= 0 && diffAbs > 30 * 60 * 1000) {
      iftar.setDate(iftar.getDate() + 1);
      alerted = false;
      halfAlerted = false;
    }

    const timeLeft = iftar - now;
    const h = String(Math.floor(timeLeft / 3600000)).padStart(2, "0");
    const m = String(Math.floor((timeLeft % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0");

    el.innerHTML = `
      <div class="text-center">
        <div class="text-xl font-bold text-gray-800">
          ${h} ساعة : ${m} دقيقة : ${s} ثانية
        </div>
        <div class="text-purple-600 font-bold mt-2">
          حتى الإفطار القادم 🌙
        </div>
      </div>`;

    if (timeLeft <= 30 * 60 * 1000 && timeLeft > 0 && !halfAlerted) {
      halfAlerted = true;
      const minsLeft = Math.ceil(timeLeft / 60000);
      Swal.fire({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 8000,
        timerProgressBar: true,
        background: "#fdf4ff",
        html: `
          <div class="flex items-center gap-3 text-right py-1">
            <span class="text-3xl">🌅</span>
            <div>
              <div class="font-bold text-purple-700 text-base">تبقّى ${minsLeft} دقيقة على الإفطار!</div>
              <div class="text-gray-600 text-sm mt-0.5">استعدّ وادعُ فإن دعوة الصائم لا تُرد</div>
            </div>
          </div>`,
        showClass: { popup: "animate__animated animate__fadeInDown" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
      });
    }
  }, 1000);
}

// =========================================
// 🌍 اختيار الموقع — GPS + Dropdown
// =========================================

const ARAB_CITIES = [
  { country: "Palestine", city: "Gaza", label: "🇵🇸 فلسطين — غزة" },
  { country: "Palestine", city: "Jerusalem", label: "🇵🇸 فلسطين — القدس" },
  { country: "Palestine", city: "Ramallah", label: "🇵🇸 فلسطين — رام الله" },
  { country: "Palestine", city: "Nablus", label: "🇵🇸 فلسطين — نابلس" },
  { country: "Palestine", city: "Hebron", label: "🇵🇸 فلسطين — الخليل" },
  { country: "Jordan", city: "Amman", label: "🇯🇴 الأردن — عمّان" },
  { country: "Jordan", city: "Zarqa", label: "🇯🇴 الأردن — الزرقاء" },
  { country: "Egypt", city: "Cairo", label: "🇪🇬 مصر — القاهرة" },
  { country: "Egypt", city: "Alexandria", label: "🇪🇬 مصر — الإسكندرية" },
  { country: "Saudi Arabia", city: "Riyadh", label: "🇸🇦 السعودية — الرياض" },
  { country: "Saudi Arabia", city: "Jeddah", label: "🇸🇦 السعودية — جدة" },
  {
    country: "Saudi Arabia",
    city: "Mecca",
    label: "🇸🇦 السعودية — مكة المكرمة",
  },
  {
    country: "Saudi Arabia",
    city: "Medina",
    label: "🇸🇦 السعودية — المدينة المنورة",
  },
  { country: "UAE", city: "Dubai", label: "🇦🇪 الإمارات — دبي" },
  { country: "UAE", city: "Abu Dhabi", label: "🇦🇪 الإمارات — أبوظبي" },
  { country: "Kuwait", city: "Kuwait City", label: "🇰🇼 الكويت" },
  { country: "Qatar", city: "Doha", label: "🇶🇦 قطر — الدوحة" },
  { country: "Bahrain", city: "Manama", label: "🇧🇭 البحرين — المنامة" },
  { country: "Oman", city: "Muscat", label: "🇴🇲 عُمان — مسقط" },
  { country: "Yemen", city: "Sanaa", label: "🇾🇪 اليمن — صنعاء" },
  { country: "Yemen", city: "Aden", label: "🇾🇪 اليمن — عدن" },
  { country: "Iraq", city: "Baghdad", label: "🇮🇶 العراق — بغداد" },
  { country: "Iraq", city: "Basra", label: "🇮🇶 العراق — البصرة" },
  { country: "Syria", city: "Damascus", label: "🇸🇾 سوريا — دمشق" },
  { country: "Syria", city: "Aleppo", label: "🇸🇾 سوريا — حلب" },
  { country: "Lebanon", city: "Beirut", label: "🇱🇧 لبنان — بيروت" },
  { country: "Libya", city: "Tripoli", label: "🇱🇾 ليبيا — طرابلس" },
  { country: "Tunisia", city: "Tunis", label: "🇹🇳 تونس" },
  { country: "Algeria", city: "Algiers", label: "🇩🇿 الجزائر" },
  { country: "Morocco", city: "Rabat", label: "🇲🇦 المغرب — الرباط" },
  {
    country: "Morocco",
    city: "Casablanca",
    label: "🇲🇦 المغرب — الدار البيضاء",
  },
  { country: "Sudan", city: "Khartoum", label: "🇸🇩 السودان — الخرطوم" },
  { country: "Somalia", city: "Mogadishu", label: "🇸🇴 الصومال — مقديشو" },
  {
    country: "Mauritania",
    city: "Nouakchott",
    label: "🇲🇷 موريتانيا — نواكشوط",
  },
];

const container = document.querySelector("#prayer-times");
const locBadge = document.getElementById("loc-badge");
const citySelect = document.getElementById("city-select");

// ── ملء الـ Dropdown ──
ARAB_CITIES.forEach((c, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = c.label;
  if (c.city === "Gaza") opt.selected = true;
  citySelect.appendChild(opt);
});

// ── Skeleton Loading ──
function showSkeleton() {
  container.innerHTML = Array(5)
    .fill(
      `
    <div class="bg-gray-100 rounded-lg p-4 shadow text-center animate-pulse">
      <div class="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
      <div class="h-3 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>`,
    )
    .join("");
}

// ── رسم بطاقات الصلوات ──
function renderPrayerCards(t) {
  const prayers = [
    { name: "الفجر", time: t.Fajr, icon: "fa-moon" },
    { name: "الظهر", time: t.Dhuhr, icon: "fa-sun" },
    { name: "العصر", time: t.Asr, icon: "fa-cloud-sun" },
    { name: "المغرب", time: t.Maghrib, icon: "fa-star-and-crescent" },
    { name: "العشاء", time: t.Isha, icon: "fa-mosque" },
  ];
  container.innerHTML = "";
  prayers.forEach((p) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="bg-gray-100 rounded-lg p-4 shadow text-center transition-all duration-300">
        <i class="fas ${p.icon} text-purple-600 text-2xl mb-2"></i>
        <h3 class="font-semibold">${p.name}</h3>
        <p class="text-gray-700 mt-1">${p.time}</p>
      </div>`,
    );
  });
  highlightCurrentPrayer(t);
  setInterval(() => highlightCurrentPrayer(t), 60 * 1000);
}

// ── جلب المواقيت بالاسم ──
async function loadPrayerTimes(city, country) {
  showSkeleton();
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`,
    );
    const data = await res.json();
    renderPrayerCards(data.data.timings);
    // تحديث وقت الإفطار للمدينة الجديدة
    const mag = data.data.timings.Maghrib;
    [iftarHour, iftarMinute] = mag.split(":").map(Number);
    alerted = false;
    halfAlerted = false;
  } catch {
    container.innerHTML = `<p class="text-red-500 col-span-5 text-center py-4">❌ تعذّر جلب المواقيت</p>`;
  }
}

// ── جلب المواقيت بالإحداثيات ──
async function loadPrayerTimesByCoords(lat, lng) {
  showSkeleton();
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`,
    );
    const data = await res.json();
    renderPrayerCards(data.data.timings);
    const mag = data.data.timings.Maghrib;
    [iftarHour, iftarMinute] = mag.split(":").map(Number);
    alerted = false;
    halfAlerted = false;
  } catch {
    container.innerHTML = `<p class="text-red-500 col-span-5 text-center py-4">❌ تعذّر جلب المواقيت</p>`;
  }
}

// ── GPS ──
document.getElementById("gps-btn").addEventListener("click", () => {
  const btn = document.getElementById("gps-btn");
  const lbl = document.getElementById("gps-label");

  if (!navigator.geolocation) {
    Swal.fire({
      toast: true,
      position: "top",
      icon: "error",
      title: "المتصفح لا يدعم GPS",
      timer: 3000,
      showConfirmButton: false,
    });
    return;
  }

  lbl.textContent = "⏳ جاري التحديد...";
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      lbl.textContent = "📍 موقعي تلقائياً";
      btn.disabled = false;

      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
        );
        const d = await r.json();
        const city =
          d.address.city || d.address.town || d.address.village || "موقعك";
        const country = d.address.country || "";
        locBadge.textContent = `📍 ${city}، ${country}`;
        // إلغاء اختيار الـ dropdown
        citySelect.value = "";
        // حفظ
        localStorage.removeItem("savedCityIndex");
      } catch {
        locBadge.textContent = "📍 موقعك الحالي";
      }

      loadPrayerTimesByCoords(lat, lng);
    },
    (err) => {
      lbl.textContent = "📍 موقعي تلقائياً";
      btn.disabled = false;
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        timer: 4000,
        showConfirmButton: false,
        title:
          err.code === 1 ? "❌ تم رفض الوصول للموقع" : "⚠️ تعذّر تحديد الموقع",
      });
    },
    { timeout: 10000 },
  );
});

// ── Dropdown تغيير المدينة ──
citySelect.addEventListener("change", () => {
  const c = ARAB_CITIES[citySelect.value];
  const shortLabel = c.label.replace(/\p{Emoji_Presentation}+/gu, "").trim();
  locBadge.textContent = `📌 ${shortLabel}`;
  localStorage.setItem("savedCityIndex", citySelect.value);
  loadPrayerTimes(c.city, c.country);
});

// ── تحميل مبدئي ──
const savedIndex = localStorage.getItem("savedCityIndex");
if (savedIndex !== null && ARAB_CITIES[savedIndex]) {
  citySelect.value = savedIndex;
  const c = ARAB_CITIES[savedIndex];
  const shortLabel = c.label.replace(/\p{Emoji_Presentation}+/gu, "").trim();
  locBadge.textContent = `📌 ${shortLabel}`;
  loadPrayerTimes(c.city, c.country);
} else {
  loadPrayerTimes("Gaza", "Palestine");
}

// تشغيل العداد
fetchIftarTime("Gaza", "Palestine").then(() => {
  startCountdown();
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  setTimeout(() => {
    const saved = localStorage.getItem("savedCityIndex");
    const c = saved
      ? ARAB_CITIES[saved]
      : { city: "Gaza", country: "Palestine" };
    fetchIftarTime(c.city, c.country);
    setInterval(() => fetchIftarTime(c.city, c.country), 24 * 60 * 60 * 1000);
  }, midnight - now);
});

// =========================================
// تحديد الصلاة الحالية تلقائياً ✨
// =========================================
function highlightCurrentPrayer(timings) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  function toMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  const prayerOrder = [
    { key: "Fajr" },
    { key: "Dhuhr" },
    { key: "Asr" },
    { key: "Maghrib" },
    { key: "Isha" },
  ];

  let currentIndex = 0;
  for (let i = 0; i < prayerOrder.length; i++) {
    if (currentMinutes >= toMinutes(timings[prayerOrder[i].key])) {
      currentIndex = i;
    }
  }

  const cards = document.querySelectorAll("#prayer-times > div");
  cards.forEach((card, index) => {
    card.classList.remove(
      "ring-2",
      "ring-purple-500",
      "bg-purple-50",
      "scale-105",
      "shadow-lg",
      "shadow-purple-200",
    );
    const badge = card.querySelector(".current-badge");
    if (badge) badge.remove();

    if (index === currentIndex) {
      card.classList.add(
        "ring-2",
        "ring-purple-500",
        "bg-purple-50",
        "scale-105",
        "shadow-lg",
        "shadow-purple-200",
      );
      card.style.transition = "all 0.4s ease";
      const badge = document.createElement("div");
      badge.className =
        "current-badge mt-2 text-xs font-bold text-purple-600 bg-purple-100 rounded-full px-2 py-0.5 inline-block";
      badge.textContent = "🕌 الصلاة الحالية";
      card.appendChild(badge);
    }
  });
}

// -------------------------
// أذكار عشوائية (Azkar)
// -------------------------
const BtnAzkar = document.querySelector(".showRandomZikr");
const azkar = [
  "اللهم اجعل صيامي فيه صيام الصائمين، وقيامي فيه قيام القائمين، ونبّهني فيه عن نومة الغافلين، وهب لي فيه الرفق والعطف يا أرحم الراحمين.",
  "اللهم اجعلني فيه من المتوكلين عليك، واجعلني فيه من الفائزين لديك، واجعلني فيه من المقربين إليك بإحسانك يا غاية الطالبين.",
  "اللهم اجعلني فيه من الذين يستغفرونك كثيراً، ويذكرونك كثيراً، واجعلني فيه من الذين ترحمهم وتغفر لهم وتعتق رقابهم من النار.",
  "اللهم اجعلني فيه من الذين يتلون كتابك حق تلاوته، ويقيمون حدودك، ويعملون بأوامرك، ويجتنبون نواهيك، برحمتك يا أرحم الراحمين.",
  "اللهم اجعلني فيه من الذين يكثرون الصلاة على نبيك محمد صلى الله عليه وسلم، واغفر لي ذنوبي، واغسل قلبي بماء اليقين، ونور بصيرتي بنور الإيمان.",
  "اللهم اجعلني فيه من الذين يبرّون والديهم، ويصلون أرحامهم، ويؤدون الأمانة، ويصدقون الحديث، ويؤدون الحقوق، ويجتنبون الفواحش والمنكرات.",
  "اللهم اجعلني فيه من الذين يكثرون الدعاء، ويستجاب لهم، ويغفر لهم، ويعتقون من النار، ويكتبون في ديوان السعداء.",
  "اللهم اجعلني فيه من الذين يكثرون الصدقة، ويطعمون الطعام، ويؤوون اليتامى، ويواسون الفقراء، ويحنّون على الأرامل والمساكين.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر الموت، ويستعدون للقاءك، ويعملون للآخرة، ويزهدون في الدنيا، ويجعلون رضاك غايتهم.",
  "اللهم اجعلني فيه من الذين يكثرون الاستغفار، ويغفر لهم، ويبدّل سيئاتهم حسنات، ويجعلون لسانهم رطباً بذكرك.",
  "اللهم اغفر لي ذنوبي كلها، ما علمت منها وما لم أعلم، إنك أنت الغفور الرحيم.",
  "اللهم إنك عفو تحب العفو فاعفُ عني، واكتب لي مغفرةً تمحو بها خطاياي.",
  "ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين.",
  "اللهم وسّع علينا رحمتك، واغمر قلوبنا بسكينتك ورضاك.",
  "لا اله الا أنت سبحانك إني كنتُ من الظالمين",
  "اللهم ارزقنا رزقًا حلالًا طيبًا مباركًا فيه، واغننا بفضلك عمّن سواك.",
  "اللهم بارك لنا في أعمارنا وأوقاتنا وأعمالنا، واكتب لنا التوفيق والسداد.",
  "اللهم افتح لنا أبواب الخير من حيث لا نحتسب، ويسّر لنا أمورنا كلها.",
  "اللهم أجرنا من النار واعتق رقابنا منها، وأدخلنا الجنة بغير حساب.",
  "اللهم أصلح لنا ديننا الذي هو عصمة أمرنا، وأصلح لنا دنيانا وآخرتنا.",
  "اللهم اجعل القرآن الكريم نور قلوبنا وشفاء صدورنا وذهاب همومنا.",
  "اللهم اختم لنا بخاتمة السعادة، واجعل آخر كلامنا لا إله إلا الله.",
  "اللهم اغفر لوالدينا وارحمهما كما ربّيانا صغارًا، اللهم ارفع درجاتهما في الجنة، واجزهما عنا خير الجزاء.",
  "اللهم اغفر لموتانا وموتى المسلمين، ونوّر قبورهم برحمتك واجعلها روضةً من رياض الجنة.",
  "اللهم تقبّل منا صالح الأعمال، وبلّغنا أعلى الدرجات برحمتك.",
];

BtnAzkar.onclick = () => {
  let randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
  Swal.fire({
    title: "وذكِّـــــــــــر",
    text: randomZikr,
    imageUrl: "images/lantern.png",
    width: window.innerWidth < 640 ? "78vw" : 500,
    imageWidth: window.innerWidth < 640 ? 55 : 120,
    padding: window.innerWidth < 640 ? "12px" : "32px",
    background: "#ffffff",
    color: "#000000",
    customClass: {
      title: "text-purple-600 font-extrabold text-3xl mb-4 text-center",
    },
    footer: `
      <button id="copy-btn" onclick="copyZikr()" class="flex items-center gap-2 bg-purple-100 border border-purple-600 rounded-lg px-2 py-1.5 text-purple-600 text-sm cursor-pointer transition-all duration-700 hover:border-purple-900 hover:text-purple-900 hover:bg-purple-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
        نسخ
      </button>`,
    didOpen: () => {
      window.copyZikr = () => {
        navigator.clipboard.writeText(randomZikr).then(() => {
          const btn = document.getElementById("copy-btn");
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" /></svg>`;
          btn.style.color = "#16a34a";
          btn.style.borderColor = "#16a34a";
          btn.style.background = "#dcfce7";
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg> نسخ`;
            btn.style.color = "#7c3aed";
            btn.style.borderColor = "#7c3aed";
            btn.style.background = "#f3e8ff";
          }, 2000);
        });
      };
    },
  });
};

// ---------------------------------
// حديث نبوي عشوائي
// ---------------------------------
const BtnHadith = document.querySelector(".showRandomHadith");
const spinnerIcon = document.querySelector(".LoadingIndicator");
let HadithUrl = "https://api.hadith.gading.dev/books/muslim?range=1-300";
BtnHadith.onclick = () => {
  getRandomHadith();
};

async function getRandomHadith() {
  spinnerIcon.classList.remove("!hidden");
  spinnerIcon.classList.add("fa-spin");
  try {
    let response = await fetch(HadithUrl);
    response = await response.json();
    let hadiths = response.data.hadiths;
    spinnerIcon.classList.add("!hidden");
    spinnerIcon.classList.remove("fa-spin");
    let randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)];
    Swal.fire({
      title: "حديث نبوي ﷺ",
      html: `<div class="font-['serif'] text-sm sm:text-lg leading-7 sm:leading-8 text-gray-700 text-right max-h-[300px] overflow-y-auto px-2">${randomHadith.arab}</div>`,
      confirmButtonText: "حسناً",
      customClass: {
        title:
          "text-amber-600 font-extrabold text-xl sm:text-3xl text-center font-serif",
        confirmButton:
          "bg-amber-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-amber-600 transition text-sm sm:text-base w-full",
        popup:
          "bg-white text-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-[280px] sm:w-[420px] md:w-[500px]",
      },
    });
  } catch (error) {
    console.error("Error fetching hadith:", error);
  }
}

// -------------------------
// حالة الطقس
// -------------------------
fetch(
  "https://api.open-meteo.com/v1/forecast?latitude=31.5&longitude=34.47&current_weather=true",
)
  .then((res) => res.json())
  .then((data) => {
    let weather = data.current_weather;
    document.getElementById("weather").textContent =
      `درجة الحرارة: ${weather.temperature}°C | الرياح: ${weather.windspeed} km/h`;
  });

// -------------------------
// التاريخ الهجري
// -------------------------
let today = new Date();
fetch(
  `https://api.aladhan.com/v1/gToH?date=${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`,
)
  .then((res) => res.json())
  .then((data) => {
    let hijri = data.data.hijri;
    document.getElementById("hijri-date").textContent =
      `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
  });

// -------------------------
// عداد التسبيح
// -------------------------
const showCount = document.querySelector("#counter");
const resetBtn = document.querySelector(".resetCounter");
const incrementBtn = document.querySelector(".incrementCounter");
let counter = 0;
incrementBtn.onclick = () => {
  counter++;
  showCount.textContent = counter;
};
resetBtn.onclick = () => {
  counter = 0;
  showCount.textContent = counter;
};

// -------------------------
// عداد ختم القرآن
// -------------------------
const totalPages = 604;
const input = document.getElementById("pages-read");
const button = document.querySelector(".submitProgress");
const bar = document.getElementById("progress-bar");
const text = document.getElementById("progress-text");

window.onload = () => {
  const saved = localStorage.getItem("pagesRead");
  if (saved) updateProgress(+saved);
};

button.onclick = () => {
  const pages = parseInt(input.value);
  if (!pages || pages < 0) return;
  localStorage.setItem("pagesRead", pages);
  updateProgress(pages);
  input.value = "";
};

function updateProgress(pages) {
  const percent = Math.min((pages / totalPages) * 100, 100);
  bar.style.width = percent + "%";
  bar.style.backgroundColor =
    percent < 33 ? "red" : percent < 66 ? "orange" : "green";
  text.textContent = `أنجزت ${percent.toFixed(2)}% من الختمة`;
}

// -------------------------
// Accordion
// -------------------------
document.querySelectorAll(".accordion-btn").forEach((button) => {
  button.onclick = () => {
    const icon = button.querySelector("span:last-child");
    icon.classList.toggle("rotate-45");
    const content = button.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };
});

// -------------------------
// Back to Top
// -------------------------
const btn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    btn.classList.remove("opacity-0", "invisible", "--bottom-40");
    btn.classList.add("opacity-100", "visible", "bottom-10");
  } else {
    btn.classList.remove("opacity-100", "visible", "bottom-10");
    btn.classList.add("opacity-0", "invisible", "--bottom-40");
  }
});
btn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// -------------------------
// Scroll Progress Bar
// -------------------------
const progressBarr = document.querySelector("#progress-barr");
window.onscroll = () => {
  progressBarr.style.width =
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      window.innerWidth +
    "px";
};

// -------------------------
// آية قرآنية Toast
// -------------------------
const RANDOM_AYAH_URL =
  "https://api.quran.com/api/v4/verses/random?language=ar&fields=text_uthmani,chapter_id,verse_key";
const CHAPTER_URL = (id) =>
  `https://api.quran.com/api/v4/chapters/${id}?language=ar`;

async function showElegantAyahToast() {
  try {
    const resAyah = await fetch(RANDOM_AYAH_URL);
    const { text_uthmani: ayahText, verse_key } = (await resAyah.json()).verse;
    const [surahNumber, ayahNumber] = verse_key.split(":");
    const resSurah = await fetch(CHAPTER_URL(surahNumber));
    const surahName = (await resSurah.json()).chapter.name_arabic;
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 12000,
      timerProgressBar: true,
      background: "rgba(255,255,255,0.95)",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
      customClass: {
        popup:
          "shadow-2xl rounded-xl p-4 sm:p-6 w-[280px] sm:w-[400px] cursor-pointer",
      },
      html: `
        <div class="flex items-start gap-2 sm:gap-3 text-right">
          <img src="images/lantern.png" class="w-8 sm:w-10 mt-1"/>
          <div class="flex-1">
            <div class="font-bold text-sm sm:text-base mb-1">آية قرآنية 📖</div>
            <div class="font-['Amiri'] text-xs sm:text-sm leading-6 sm:leading-7 font-bold">${ayahText}</div>
            <div class="font-['Amiri'] text-[10px] sm:text-xs text-gray-500 mt-1">سورة ${surahName} - آية ${ayahNumber}</div>
          </div>
        </div>`,
      didOpen: (toastEl) => {
        toastEl.onclick = () => Swal.close();
      },
    });
  } catch (error) {
    console.error("Ayah API Error:", error);
  }
}
showElegantAyahToast();
setInterval(showElegantAyahToast, 5 * 60 * 1000);

// -------------------------
// Copy Accordion
// -------------------------
const accEl = document.querySelectorAll(".copy-accordion svg");
accEl.forEach((el) => {
  el.onclick = () => {
    let txt = el.parentElement.childNodes[0].textContent.trim();
    navigator.clipboard.writeText(txt);
    const parent = el.parentElement;
    parent.querySelector("svg").innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-green-500 cursor-pointer duration-700"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" /></svg>`;
    setTimeout(() => {
      parent.querySelector("svg").innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-gray-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer"><path fill-rule="evenodd" d="M13.887 3.182c.396.037.79.08 1.183.128C16.194 3.45 17 4.414 17 5.517V16.75A2.25 2.25 0 0 1 14.75 19h-9.5A2.25 2.25 0 0 1 3 16.75V5.517c0-1.103.806-2.068 1.93-2.207.393-.048.787-.09 1.183-.128A3.001 3.001 0 0 1 9 1h2c1.373 0 2.531.923 2.887 2.182ZM7.5 4A1.5 1.5 0 0 1 9 2.5h2A1.5 1.5 0 0 1 12.5 4v.5h-5V4Z" clip-rule="evenodd" /></svg>`;
    }, 2000);
  };
});
