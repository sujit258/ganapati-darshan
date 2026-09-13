const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '../public/images/ganpati');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const imagesToDownload = [
  {
    id: 'kasba-ganpati',
    filename: 'kasba-ganpati.webp',
    title: 'श्री कसबा गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Kasba_Ganpati_Mandir_03.JPG',
    source: 'Wikimedia Commons: File:Kasba Ganpati Mandir 03.JPG',
    license: 'CC BY-SA 3.0',
    author: 'Niraj Suryawanshi'
  },
  {
    id: 'tambdi-jogeshwari',
    filename: 'tambdi-jogeshwari.webp',
    title: 'श्री तांबडी जोगेश्वरी गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Tambdi_Jogeshwari_Sarvajanik_Ganeshotsav_Mandal_2024.jpg',
    source: 'Wikimedia Commons: File:Tambdi Jogeshwari Sarvajanik Ganeshotsav Mandal 2024.jpg',
    license: 'CC BY-SA 4.0',
    author: 'Shlok'
  },
  {
    id: 'guruji-talim',
    filename: 'guruji-talim.webp',
    title: 'श्री गुरुजी तालीम गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Manacha_teesra_ganpati-Guruji_Talim.jpg',
    source: 'Wikimedia Commons: File:Manacha teesra ganpati-Guruji Talim.jpg',
    license: 'CC BY-SA 3.0',
    author: 'Preeti-Parashar'
  },
  {
    id: 'tulshibaug-ganpati',
    filename: 'tulshibaug-ganpati.webp',
    title: 'श्री तुळशीबाग गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Ganesh_idol_of_Tulshibaug_Sarvajanik_Ganeshotsav_Mandal_in_2024.jpg',
    source: 'Wikimedia Commons: File:Ganesh idol of Tulshibaug Sarvajanik Ganeshotsav Mandal in 2024.jpg',
    license: 'CC BY-SA 4.0',
    author: 'Shlok'
  },
  {
    id: 'kesariwada-ganpati',
    filename: 'kesariwada-ganpati.webp',
    title: 'श्री केसरीवाडा गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Kesari_Wada_Sarvajanik_Ganeshotsav_Mandal.jpg',
    source: 'Wikimedia Commons: File:Kesari Wada Sarvajanik Ganeshotsav Mandal.jpg',
    license: 'CC BY-SA 4.0',
    author: 'Suyash.dwivedi'
  },
  {
    id: 'dagdusheth-ganpati',
    filename: 'dagdusheth-ganpati.webp',
    title: 'श्रीमंत दगडूशेठ हलवाई गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Ganesha_idol_closeup_of_Dagadusheth_Halwai_Sarvajanik_Ganeshotsav_Mandal_in_2024.jpg',
    source: 'Wikimedia Commons: File:Ganesha idol closeup of Dagadusheth Halwai Sarvajanik Ganeshotsav Mandal in 2024.jpg',
    license: 'CC BY-SA 4.0',
    author: 'Shlok'
  },
  {
    id: 'bhau-rangari-ganpati',
    filename: 'bhau-rangari-ganpati.webp',
    title: 'श्रीमंत भाऊसाहेब रंगारी गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Shrimant_Bhausaheb_Rangari_Ganpati%2CPune.jpg',
    source: 'Wikimedia Commons: File:Shrimant Bhausaheb Rangari Ganpati,Pune.jpg',
    license: 'CC0 (Public Domain)',
    author: 'Suyash.dwivedi'
  },
  {
    id: 'babu-genu-ganpati',
    filename: 'babu-genu-ganpati.webp',
    title: 'श्री बाबू गेणू गणपती',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Ganesha_idol_of_Hutatma_Babu_Genu_Mandal_in_2024.jpg',
    source: 'Wikimedia Commons: File:Ganesha idol of Hutatma Babu Genu Mandal in 2024.jpg',
    license: 'CC BY-SA 4.0',
    author: 'Shlok'
  },
  {
    id: 'mandai-ganpati',
    filename: 'mandai-ganpati.webp',
    title: 'श्री मंडई गणपती (अखिल मंडई मंडळ)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Ganesha_idol_of_Akhil_Mandai_Mandal_in_2024.jpg',
    source: 'Wikimedia Commons: File:Ganesha idol of Akhil Mandai Mandal in 2024.jpg',
    license: 'CC BY-SA 4.0',
    author: 'Shlok'
  }
];

async function downloadAndOptimize() {
  for (const item of imagesToDownload) {
    console.log(`\nFetching ${item.title} (${item.filename})...`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'PuneGanpatiDarshanApp/1.0 (educational & cultural guide: admin@puneganpatidarshan.in)'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const destPath = path.join(targetDir, item.filename);

      // Optimize with sharp: max width 1200, high quality WebP
      await sharp(buffer)
        .resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(destPath);

      const stats = fs.statSync(destPath);
      console.log(`Successfully saved ${item.filename} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`Failed to process ${item.filename}:`, err.message);
    }
  }
}

downloadAndOptimize();
