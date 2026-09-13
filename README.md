# 🪔 पुणे गणपती दर्शन (Pune Ganpati Darshan)

> पुण्याच्या मानाच्या आणि प्रमुख गणपतींचे दर्शन सोप्या क्रमाने घेण्यासाठी आधुनिक, वेगवान व मोबाईल-फर्स्ट मराठी डिजिटल मार्गदर्शक.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?style=flat)](https://web.dev/progressive-web-apps/)

---

## 🌟 प्रमुख वैशिष्ट्ये (Key Features)

- **१००% नैसर्गिक मराठी संवाद**: युझर-फेसिंग सर्व लेबल्स आणि माहिती शुद्ध व आदरयुक्त मराठीत.
- **स्थान-आधारित गतिमान दर्शन क्रम (Dynamic Route Optimizer)**: युझरच्या सध्याच्या स्थानापासून (GPS Geolocation) सर्वात जवळचा आणि चालण्यासाठी सोपा दर्शन मार्ग (Nearest-Neighbor TSP Heuristic) तयार करतो.
- **५ मानाचे गणपती + ४ प्रमुख गणपती**:
  1. **श्री कसबा गणपती** (१ला मानाचा गणपती, पुण्याचे ग्रामदैवत)
  2. **श्री तांबडी जोगेश्वरी गणपती** (२रा मानाचा गणपती, कुलस्वामिनी परिसर)
  3. **श्री गुरुजी तालीम गणपती** (३रा मानाचा गणपती, ऐक्य प्रतीक)
  4. **श्री तुळशीबाग गणपती** (४था मानाचा गणपती, १४ फूट भव्य मूर्ती)
  5. **श्री केसरीवाडा गणपती** (५वा मानाचा गणपती, लोकमान्य टिळक विचार वारसा)
  6. **श्रीमंत दगडूशेठ हलवाई गणपती** (प्रमुख गणपती, नवसाचा राजा)
  7. **श्रीमंत भाऊसाहेब रंगारी गणपती** (भारतातील पहिला सार्वजनिक गणपती, १८९२)
  8. **श्री बाबू गेणू गणपती** (नवसाचा गणपती, हुतात्मा स्मृती)
  9. **श्री मंडई गणपती** (अखिल मंडई मंडळ, शारदा-गजानन अद्वितीय रूप)
- **पारंपरिक क्रम पर्याय (Traditional Fallback)**: १ ते ५ मानाच्या गणपतींचा ऐतिहासिक क्रम निवडण्याचीही सुविधा.
- **सुलभ फॉलबॅक पर्याय (Fallback Locations)**: स्थान परवानगी नाकारली गेल्यास किंवा पुण्याबाहेरून आल्यास शनिवार वाडा, पुणे स्टेशन किंवा स्वारगेट येथून मार्ग सुरू करण्याचे पर्याय.
- **थेट Google Maps दिशा (Directions)**: प्रत्येक गणपतीसाठी एका क्लिकवर चालण्याचा अचूक मार्ग.
- **स्थानिक प्रगती ट्रॅकिंग (Offline LocalStorage Persistence)**: लॉगिन नको; दर्शन प्रगती (उदा. `२ / ९ पूर्ण`) रिफ्रेश झाल्यावरही सुरक्षित राहते.
- **परस्परसंवादी नकाशा (Interactive Leaflet Map)**: १ ते ९ क्रमांकांचे पिन आणि चालण्याच्या मार्गासह नकाशा.
- **सत्यापित ऐतिहासिक छायाचित्रे (Authentic Photos)**: विकिमीडिया कॉमन्सवरून (Creative Commons परवान्यांतर्गत) घेतलेली सर्व ९ गणपतींची अस्सल, उच्च दर्जाची WebP छायाचित्रे.
- **प्रोग्रेसिव्ह वेब ॲप (PWA)**: इन्स्टॉल करण्यायोग्य आणि ऑफलाइन शेल सपोर्ट.

---

## 🏗️ तांत्रिक रचना (Tech Stack)

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS
- **Language**: TypeScript
- **Font**: Google Fonts `Noto Sans Devanagari`
- **Mapping**: Leaflet / OpenStreetMap
- **Icons**: Lucide React + Marathi Devotional Iconography
- **Image Optimization**: Sharp, WebP Format

---

## 📁 फोल्डर रचना (Project Structure)

```text
├── docs/
│   └── PHOTO_SOURCES.md         # छायाचित्रांचे मूळ स्रोत व CC परवाने
├── public/
│   └── images/
│       └── ganpati/             # सर्व ९ गणपतींचे अस्सल WebP फोटो
├── src/
│   ├── app/                     # Next.js App Router पेजेस
│   │   ├── darshan/page.tsx     # दर्शन क्रम व प्रगती ट्रॅकर
│   │   ├── ganpati/             # गणपती सूची व सविस्तर पृष्ठे
│   │   ├── nakasha/page.tsx     # परस्परसंवादी नकाशा
│   │   └── mahiti/page.tsx      # गणेशोत्सव इतिहास व FAQs
│   ├── components/              # मॉड्यूलर UI घटक
│   ├── context/                 # DarshanContext (State + LocalStorage)
│   ├── data/
│   │   └── ganpatis.ts          # ९ गणपतींचा संपूर्ण सत्यापित डेटा
│   ├── lib/
│   │   ├── distance.ts          # Haversine अंतर गणना व मराठी फॉरमॅटिंग
│   │   ├── marathiNumbers.ts    # मराठी अंक व क्रमवाचक रूपे (१ले, २रे...)
│   │   ├── routeOptimizer.ts    # Nearest-Neighbor TSP राऊट अल्गोरिदम
│   │   └── maps.ts              # Google Maps नेव्हिगेशन लिंक्स
│   └── types/                   # TypeScript interfaces
```

---

## 🚀 स्थानिक पातळीवर चालवणे (Getting Started)

### १. प्रोजेक्ट क्लोन करा
```bash
git clone https://github.com/sujit258/ganapati-darshan.git
cd ganapati-darshan
```

### २. डिपेंडन्सीज इन्स्टॉल करा
```bash
npm install
```

### ३. डेव्हलपमेंट सर्व्हर सुरू करा
```bash
npm run dev
```
ब्राउझरमध्ये `http://localhost:3000` उघडा.

### ४. प्रॉडक्शन बिल्ड
```bash
npm run build
npm run start
```

---

## 📜 छायाचित्रे व परवाना (Photo Credits)

सर्व गणपतींच्या मूळ प्रतिमा विकिमीडिया कॉमन्सवरील मुक्त परवान्यांतर्गत (CC BY-SA 3.0, CC BY-SA 4.0, CC0) वापरल्या आहेत. सविस्तर माहितीसाठी [docs/PHOTO_SOURCES.md](docs/PHOTO_SOURCES.md) पहा.

---

## 🪔 नम्रतापूर्वक समर्पण

पुण्याच्या गणेशोत्सवातील लाखो भाविकांना सुलभ दर्शन घडवण्यासाठी हे ॲप्लिकेशन श्रद्धेने तयार करण्यात आले आहे.

**गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!**
