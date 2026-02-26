const el = document.querySelector("#iftar-countdown");
const IFTAR = { hour: 17, minute: 40 };
let alerted = false;
setInterval(() => {
  const now = new Date();
  const iftar = new Date();

  iftar.setHours(IFTAR.hour, IFTAR.minute, 0, 0);
  if (now >= iftar) iftar.setDate(iftar.getDate() + 1);

  const diff = iftar - now;

  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

  el.innerHTML = `
    <div class="text-center">
      <div class="text-xl font-bold">
        ${h} ساعة : ${m} دقيقة : ${s} ثانية
      </div>
      <div class="text-purple-600 font-bold mt-2">
        حتى الإفطار القادم 🌙
      </div>
    </div>
  `;

  if (diff <= 0 && !alerted) {
    alerted = true;

    Swal.fire({
      title: "🌙 إفطار مبارك",
      text: "تقبل الله صيامكم",
      icon: "success",
    });
  }
}, 1000);
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
  "اللهم اجعلني فيه من الذين يكثرون القيام، ويخشعون في صلاتهم، ويطيلون السجود، ويستشعرون قربك في دعائهم.",
  "اللهم اجعلني فيه من الذين يكثرون البكاء من خشيتك، ويخشعون عند سماع القرآن، ويجدون لذة الإيمان في قلوبهم.",
  "اللهم اجعلني فيه من الذين يكثرون العمل الصالح، ويجعلون نيتهم خالصة لك، ويبتعدون عن الرياء والسمعة.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر اسمك العظيم، ويستحضرون عظمة جلالك، ويخشعون عند ذكرك.",
  "اللهم اجعلني فيه من الذين يكثرون الصبر على البلاء، ويحتسبون الأجر عندك، ويثقون بحكمتك وعدلك.",
  "اللهم اجعلني فيه من الذين يكثرون الشكر على نعمك، ويعترفون بفضلك، ويستعملون نعمك في طاعتك.",
  "اللهم اجعلني فيه من الذين يكثرون التوبة، ويعودون إليك بعد الذنب، ويستغفرونك بصدق وإخلاص.",
  "اللهم اجعلني فيه من الذين يكثرون حسن الظن بك، ويثقون برحمتك، ويأملون في عفوك ومغفرتك.",
  "اللهم اجعلني فيه من الذين يكثرون قراءة القرآن، ويتدبرون آياته، ويعملون بما فيه من أوامر ونواهي.",
  "اللهم اجعلني فيه من الذين يكثرون الدعاء لأهلهم وأحبابهم، ويصلون أرحامهم، ويبرّون والديهم.",
  "اللهم اجعلني فيه من الذين يكثرون العمل الجماعي، ويحبون الخير للناس، ويعاونون على البر والتقوى.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر نعمك، ويستحضرون فضلك، ويشكرونك في السر والعلن.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر الجنة، ويعملون لها، ويشتاقون إليها، ويبتعدون عن النار.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر الأنبياء والصالحين، ويقتدون بهم، ويعملون بسننهم.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر رحمتك، ويستشعرون لطفك، ويعيشون في ظل عفوك.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر فضائل رمضان، ويغتنمون أيامه ولياليه، ويستثمرون وقته في الطاعة.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر ليلة القدر، ويستعدون لها، ويكثرون الدعاء فيها، ويغتنمون فضلها العظيم.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر الصالحين، ويحبون صحبتهم، ويقتدون بأعمالهم، ويستفيدون من علمهم.",
  "اللهم اجعلني فيه من الذين يكثرون ذكرك في كل حال، ويجعلون حياتهم كلها طاعة لك، ويبتعدون عن معصيتك.",
  "اللهم اجعلني فيه من الذين يكثرون ذكر يوم القيامة، ويستعدون له، ويعملون لما بعد الموت، ويجعلون رضاك غايتهم.",
  "اللهم اغفر لي ذنوبي كلها، ما علمت منها وما لم أعلم، إنك أنت الغفور الرحيم.",
  "اللهم إنك عفو تحب العفو فاعفُ عني، واكتب لي مغفرةً تمحو بها خطاياي.",
  "ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين.",
  "اللهم وسّع علينا رحمتك، واغمر قلوبنا بسكينتك ورضاك.",
  "اللهم تب علينا توبةً نصوحًا، واغسل قلوبنا من الذنوب والزلل.",
  "اللهم لا تخرجنا من هذا اليوم إلا وقد غفرت لنا ذنوبنا كلها.",
  "لا اله الا أنت سبحانك إني كنتُ من الظالمين",
  "اللهم ارزقنا رزقًا حلالًا طيبًا مباركًا فيه، واغننا بفضلك عمّن سواك.",
  "اللهم بارك لنا في أعمارنا وأوقاتنا وأعمالنا، واكتب لنا التوفيق والسداد.",
  "اللهم افتح لنا أبواب الخير من حيث لا نحتسب، ويسّر لنا أمورنا كلها.",
  "اللهم اجعل حياتنا زيادةً لنا في كل خير، واصرف عنا كل شر.",
  "اللهم ارزقنا علمًا نافعًا، وقلبًا خاشعًا، وعملاً متقبلاً.",
  "اللهم اجعل البركة تملأ بيوتنا وأعمالنا وأرزاقنا.",
  "اللهم أجرنا من النار واعتق رقابنا منها، وأدخلنا الجنة بغير حساب.",
  "اللهم أصلح لنا ديننا الذي هو عصمة أمرنا، وأصلح لنا دنيانا وآخرتنا.",
  "اللهم اجعل القرآن الكريم نور قلوبنا وشفاء صدورنا وذهاب همومنا.",
  "اللهم اختم لنا بخاتمة السعادة، واجعل آخر كلامنا لا إله إلا الله.",
  "اللهم اجعلنا من المقبولين، ولا تجعلنا من المحرومين.",
  "اللهم باعد بيننا وبين خطايانا كما باعدت بين المشرق والمغرب.",
  "اللهم اشرح صدورنا ويسّر أمورنا، واصرف عنا القلق والهم.",
  "اللهم أنزل علينا سكينتك، واملأ قلوبنا رضا وطمأنينة.",
  "اللهم اكفنا ما أهمّنا، ووفّقنا لما تحب وترضى.",
  "اللهم اجعل لنا من كل ضيق مخرجًا، ومن كل هم فرجًا.",
  "اللهم اغفر لوالدينا وارحمهما كما ربّيانا صغارًا, اللهم ارفع درجاتهما في الجنة، واجزهما عنا خير الجزاء.",
  "اللهم اغفر لموتانا وموتى المسلمين، ونوّر قبورهم برحمتك واجعلها روضةً من رياض الجنة، وآنس وحشتهم واجمعنا بهم في جناتك جنات النعيم.",
  "اللهم اكتب لنا الخير حيث كان، ثم رضّنا به وبارك لنا فيه.",
  "اللهم اجعلنا من أهل الذكر والشكر، ومن المقبولين عندك.",
  "اللهم تقبّل منا صالح الأعمال، وبلّغنا أعلى الدرجات برحمتك.",
];
// BtnAzkar.onclick = () => {
//   let randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
//   Swal.fire({
//     title: "وذكِّــــــــــــــــــر",
//     text: randomZikr,
//     imageUrl: "images/lantern.png",
//     imageWidth: 120,

//     width: window.innerWidth < 640 ? 280 : 500, // أصغر على الجوال

//     background: "#ffffff",
//     color: "#000000",

//     customClass: {
//       title: "text-purple-600 font-extrabold text-3xl mb-4 text-center",
//     },
//   });
// };
BtnAzkar.onclick = () => {
  let randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
  Swal.fire({
    title: "وذكِّــــــــــــــــــر",
    text: randomZikr,
    imageUrl: "images/lantern.png",
    imageWidth: 120,
    width: window.innerWidth < 640 ? "78vw" : 500,
    imageWidth: window.innerWidth < 640 ? 55 : 120,
    padding: window.innerWidth < 640 ? "12px" : "32px",
    background: "#ffffff",
    color: "#000000",
    customClass: {
      title: "text-purple-600 font-extrabold text-3xl mb-4 text-center",
    },
    footer: `
  <button id="copy-btn" onclick="copyZikr()" class="flex items-center gap-2 bg-purple-100 border border-purple-600 rounded-lg px-4 py-1.5 text-purple-600 text-sm cursor-pointer transition-all duration-300">
    <svg id="copy-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" />
    </svg>
    نسخ
  </button>
`,

    didOpen: () => {
      window.copyZikr = () => {
        navigator.clipboard.writeText(randomZikr).then(() => {
          const btn = document.getElementById("copy-btn");
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>

          `;
          btn.style.color = "#16a34a";
          btn.style.borderColor = "#16a34a";
          btn.style.background = "#dcfce7";

          setTimeout(() => {
            btn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" />
              </svg>
              نسخ
            `;
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
// حديث نبوي عشوائي (Random Hadith API)
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

      html: `
<div class="
font-['serif']
text-sm sm:text-lg
leading-7 sm:leading-8
text-gray-700
text-right
max-h-[300px]
overflow-y-auto
px-2
">
    ${randomHadith.arab}
    </div>
    `,

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
// مواقيت الصلاة (Prayer Times API)
// -------------------------

const container = document.querySelector("#prayer-times");

const prayerTimesUrl =
  "https://api.aladhan.com/v1/timingsByCity?city=Gaza&country=Palestine&method=4";

async function PrayerTime() {
  try {
    const res = await fetch(prayerTimesUrl);
    const data = await res.json();
    const t = data.data.timings;

    const prayers = [
      { name: "الفجر", time: t.Fajr, icon: "fa-moon" },
      { name: "الظهر", time: t.Dhuhr, icon: "fa-sun" },
      { name: "العصر", time: t.Asr, icon: "fa-cloud-sun" },
      { name: "المغرب", time: t.Maghrib, icon: "fa-star-and-crescent" },
      { name: "العشاء", time: t.Isha, icon: "fa-mosque" },
    ];

    // مسح المحتوى القديم
    container.innerHTML = "";

    prayers.forEach((prayer) => {
      let item = `
      <div class="bg-gray-100 rounded-lg p-4 shadow text-center">

        <i class="fas ${prayer.icon} text-purple-600 text-2xl mb-2"></i>

        <h3 class="font-semibold">${prayer.name}</h3>

        <p class="text-gray-700 mt-1">${prayer.time}</p>

      </div>
      `;
      container.insertAdjacentHTML("beforeend", item);
    });
  } catch (error) {
    console.log("Error fetching prayer times:", error);
  }
}
PrayerTime();
// -------------------------
// حالة الطقس (Weather API)
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
// التاريخ الهجري (Hijri Date API)
// -------------------------
let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`)
  .then((res) => res.json())
  .then((data) => {
    let hijri = data.data.hijri;
    document.getElementById("hijri-date").textContent =
      `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
  });

// -------------------------
// مسبحة إلكترونية (Tasbeeh Counter)
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
// عداد ختم القرآن (Progress Bar)
// -------------------------
const totalPages = 604;
const input = document.getElementById("pages-read");
const button = document.querySelector(".submitProgress");
const bar = document.getElementById("progress-bar");
const text = document.getElementById("progress-text");

// استرجاع القيمة عند التحميل
window.onload = () => {
  const saved = localStorage.getItem("pagesRead");
  if (saved) updateProgress(+saved);
};

// حفظ وتحديث عند الضغط
button.onclick = () => {
  const pages = parseInt(input.value);
  if (!pages || pages < 0) return;

  localStorage.setItem("pagesRead", pages);
  updateProgress(pages);
  input.value = "";
};

// تحديث الشريط والنسبة
function updateProgress(pages) {
  const percent = Math.min((pages / totalPages) * 100, 100);
  bar.style.width = percent + "%";

  bar.style.backgroundColor =
    percent < 33 ? "red" : percent < 66 ? "orange" : "green";

  text.textContent = `أنجزت ${percent.toFixed(2)}% من الختمة`;
}

//--------------------
//Accordion
//--------------------
document.querySelectorAll(".accordion-btn").forEach((button) => {
  button.onclick = () => {
    // Toggle icon
    const icon = button.querySelector("span:last-child");
    icon.classList.toggle("rotate-45");

    // Show/hide content
    const content = button.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };
});

// -------------------------
// Back to Top Button
// -------------------------
const btn = document.getElementById("backToTop");
// إظهار الزر بعد التمرير 300px
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
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
// -------------------------
// Progress Bar للتمرير (Scroll Progress)
// -------------------------
const progressBarr = document.querySelector("#progress-barr");
window.onscroll = () => {
  progressBarr.style.width =
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      window.innerWidth +
    "px";
};

// =============================
// آية قرآنية Toast كل 15 دقيقة
// =============================
// ==========================
// آية قرآنية Toast أنيقة
// ==========================
const RANDOM_AYAH_URL =
  "https://api.quran.com/api/v4/verses/random?language=ar&fields=text_uthmani,chapter_id,verse_key";
const CHAPTER_URL = (chapterId) =>
  `https://api.quran.com/api/v4/chapters/${chapterId}?language=ar`;

async function showElegantAyahToast() {
  try {
    // جلب الآية
    const resAyah = await fetch(RANDOM_AYAH_URL);
    const { text_uthmani: ayahText, verse_key } = (await resAyah.json()).verse;
    const [surahNumber, ayahNumber] = verse_key.split(":");

    // جلب اسم السورة
    const resSurah = await fetch(CHAPTER_URL(surahNumber));
    const surahName = (await resSurah.json()).chapter.name_arabic;

    // إنشاء Toast أنيق
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 7000,
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
        </div>
      `,
      didOpen: (toastEl) => {
        // إغلاق عند الضغط
        toastEl.onclick = () => Swal.close();
      },
    });
  } catch (error) {
    console.error("Ayah API Error:", error);
  }
}

// أول مرة عند التحميل
showElegantAyahToast();

// كل 5 دقائق
setInterval(showElegantAyahToast, 5 * 60 * 1000);

//-----------------------
// copyAccourdion
//-----------------------
const accEl = document.querySelectorAll(".copy-accordion svg");

accEl.forEach((el) => {
  el.onclick = () => {
    // const txt = el.previousElementSibling.textContent;
    let txt = el.parentElement.childNodes[0].textContent.trim();
    navigator.clipboard.writeText(txt);

    el.outerHTML; // مش هنا
    // بدل innerHTML استخدم الـ parent
    const parent = el.parentElement;

    parent.querySelector("svg").outerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-green-500 cursor-pointer">
      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
    </svg>`;

    setTimeout(() => {
      parent.querySelector("svg").outerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-gray-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer">
        <path fill-rule="evenodd" d="M13.887 3.182c.396.037.79.08 1.183.128C16.194 3.45 17 4.414 17 5.517V16.75A2.25 2.25 0 0 1 14.75 19h-9.5A2.25 2.25 0 0 1 3 16.75V5.517c0-1.103.806-2.068 1.93-2.207.393-.048.787-.09 1.183-.128A3.001 3.001 0 0 1 9 1h2c1.373 0 2.531.923 2.887 2.182ZM7.5 4A1.5 1.5 0 0 1 9 2.5h2A1.5 1.5 0 0 1 12.5 4v.5h-5V4Z" clip-rule="evenodd" />
      </svg>`;
    }, 2000);
  };
});
