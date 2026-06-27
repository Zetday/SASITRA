export interface SVGPath {
  d: string;
  role: 'background' | 'main' | 'accent' | 'jelujur';
  strokeWidth?: number;
  strokeDasharray?: string;
  fillRule?: "nonzero" | "evenodd";
}

export interface Motif {
  id: string;
  nama_motif: string;
  kategori: 'FLORA' | 'FAUNA' | 'GEOMETRIS' | 'ALAM' | 'LAINNYA';
  deskripsi: string;
  makna_filosofi: string;
  sejarah?: string;
  warna_tradisional: string[]; // hex codes
  status: 'PUBLISHED' | 'DRAFT';
  paths: SVGPath[];
  viewBox?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoryChapter {
  id: string;
  chapter_order: number;
  judul: string;
  konten: string;
  speech: string; // Speech bubble text for Sira Galuh
  media_type: 'image' | 'video' | 'interactive' | 'timeline' | 'quiz' | 'slider';
  media_url?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

// 1. Initial Motifs with semantic SVG paths
export const initialMotifs: Motif[] = [
  {
    id: "hiris-gagatas",
    nama_motif: "Hiris Gagatas",
    kategori: "GEOMETRIS",
    deskripsi: "Motif Hiris Gagatas merupakan motif berbentuk belah ketupat yang sangat populer dalam kain Sasirangan. Pola ini teratur dan saling bertautan, mencerminkan harmoni dalam tatanan kehidupan masyarakat Banjar.",
    makna_filosofi: "Belah ketupat (gagatas) melambangkan keteguhan iman, kekuatan karakter, kejujuran, serta kebulatan tekad dalam menjalani kehidupan. Bentuknya yang seimbang melambangkan keadilan.",
    sejarah: "Sejak zaman Kesultanan Banjar, motif ini sering digunakan oleh kaum bangsawan maupun masyarakat umum sebagai simbol perlindungan diri dan kehormatan keluarga.",
    warna_tradisional: ["#8B1A1A", "#C5960C", "#FAF3E0", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      // Base background square
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Large Diamond
      { d: "M 50 10 L 90 50 L 50 90 L 10 50 Z", role: "main" },
      // Inner Diamond
      { d: "M 50 25 L 75 50 L 50 75 L 25 50 Z", role: "accent" },
      // Center small diamond
      { d: "M 50 40 L 60 50 L 50 60 L 40 50 Z", role: "main" },
      // Jelujur (stitch lines) running along the outer diamond border
      { d: "M 50 6 L 94 50 L 50 94 L 6 50 Z", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "3,3" },
      // Inner Jelujur lines
      { d: "M 50 18 L 82 50 L 50 82 L 18 50 Z", role: "jelujur", strokeWidth: 1.2, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-01").toISOString(),
    updated_at: new Date("2026-06-01").toISOString()
  },
  {
    id: "hiris-pudak",
    nama_motif: "Hiris Pudak",
    kategori: "FLORA",
    deskripsi: "Motif Hiris Pudak menggambarkan irisan daun pandan (pudak) yang wangi. Daun pudak sangat dihormati dalam tradisi Banjar dan sering digunakan dalam wewangian upacara adat maupun hiasan pengantin.",
    makna_filosofi: "Melambangkan keharuman nama baik, kemuliaan akhlak, pengabdian, serta kebaikan yang disebarkan kepada lingkungan sekitar seperti wangi pandan yang menyejukkan.",
    sejarah: "Pudak adalah tanaman lokal Kalimantan Selatan. Visualisasinya pada kain Sasirangan merupakan wujud apresiasi masyarakat Banjar terhadap kekayaan alam sekitar.",
    warna_tradisional: ["#16A34A", "#C5960C", "#FAF3E0", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Leaf 1 (Left)
      { d: "M 50 90 C 20 80, 15 50, 30 20 C 40 40, 45 70, 50 90 Z", role: "main" },
      // Leaf 2 (Right)
      { d: "M 50 90 C 80 80, 85 50, 70 20 C 60 40, 55 70, 50 90 Z", role: "main" },
      // Center leaf bud
      { d: "M 50 90 C 40 60, 45 30, 50 10 C 55 30, 60 60, 50 90 Z", role: "accent" },
      // Stitch accents on the leaves
      { d: "M 32 30 C 38 48, 42 68, 46 82", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "3,2" },
      { d: "M 68 30 C 62 48, 58 68, 54 82", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "3,2" },
      { d: "M 50 15 L 50 85", role: "jelujur", strokeWidth: 1.2, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-02").toISOString(),
    updated_at: new Date("2026-06-02").toISOString()
  },
  {
    id: "kangkung-kaombakan",
    nama_motif: "Kangkung Kaombakan",
    kategori: "FLORA",
    deskripsi: "Motif Kangkung Kaombakan menggambarkan tanaman kangkung air yang bergoyang diterpa ombak sungai. Sungai merupakan urat nadi kehidupan utama bagi masyarakat Banjar (pasar terapung, transportasi).",
    makna_filosofi: "Melambangkan kelenturan, ketahanan dalam menghadapi cobaan hidup (resiliensi), kemampuan beradaptasi di lingkungan mana pun, serta kerendahan hati.",
    sejarah: "Terinspirasi langsung dari tanaman kangkung yang tumbuh liar di sepanjang daerah aliran sungai (DAS) Barito dan Martapura.",
    warna_tradisional: ["#0284C7", "#16A34A", "#FAF3E0", "#8B1A1A"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Waves (bottom to top flow)
      { d: "M 10 80 Q 30 70, 50 80 T 90 80 Q 95 85, 90 90 Q 50 95, 10 90 Z", role: "main" },
      { d: "M 10 50 Q 30 40, 50 50 T 90 50 Q 95 55, 90 60 Q 50 65, 10 60 Z", role: "main" },
      // Kangkung leaves rising from waves
      { d: "M 30 65 C 20 50, 25 35, 35 25 C 40 35, 35 55, 30 65 Z", role: "accent" },
      { d: "M 70 65 C 60 50, 65 35, 75 25 C 80 35, 75 55, 70 65 Z", role: "accent" },
      // Jelujur stitches outlining waves and leaves
      { d: "M 10 45 Q 30 35, 50 45 T 90 45", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "4,3" },
      { d: "M 32 20 C 37 32, 33 50, 28 60", role: "jelujur", strokeWidth: 1.2, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-03").toISOString(),
    updated_at: new Date("2026-06-03").toISOString()
  },
  {
    id: "kambang-kacang",
    nama_motif: "Kambang Kacang",
    kategori: "FLORA",
    deskripsi: "Motif Kambang Kacang menggambarkan tunas atau kuncup bunga kacang yang melengkung indah. Motif ini sangat disukai karena keluwesan lekukannya.",
    makna_filosofi: "Melambangkan harapan yang tumbuh, awal baru, kelembutan tutur kata, serta keramahan masyarakat Banjar dalam menyambut tamu.",
    sejarah: "Motif ini merupakan salah satu motif tertua yang sering dipadukan dengan motif lain seperti Bayam Raja atau Hiris Gagatas untuk mempercantik tepian kain.",
    warna_tradisional: ["#C5960C", "#8B1A1A", "#FAF3E0", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Main spiral stalk 1
      { d: "M 20 80 C 20 50, 40 30, 60 30 C 75 30, 80 45, 70 55 C 60 65, 50 50, 55 40", role: "main", strokeWidth: 4, strokeDasharray: "none" },
      // Main spiral stalk 2
      { d: "M 80 80 C 80 60, 70 50, 60 50 C 50 50, 45 60, 50 70 C 55 80, 65 75, 65 65", role: "accent", strokeWidth: 3, strokeDasharray: "none" },
      // Jelujur trace inside the spiral
      { d: "M 20 78 C 20 48, 40 28, 60 28 C 77 28, 83 45, 71 57 C 58 68, 47 50, 53 38", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "3,3" }
    ],
    created_at: new Date("2026-06-04").toISOString(),
    updated_at: new Date("2026-06-04").toISOString()
  },
  {
    id: "bayam-raja",
    nama_motif: "Bayam Raja",
    kategori: "FLORA",
    deskripsi: "Motif Bayam Raja menggambarkan tanaman bayam berduri yang diagungkan. Bayam Raja memiliki kedudukan penting dan seringkali menjadi motif utama di tengah-tengah lembaran kain Sasirangan.",
    makna_filosofi: "Melambangkan martabat yang tinggi, kemakmuran, kepemimpinan yang berwibawa namun tetap mengayomi dan melindungi rakyat (diwakili oleh duri pelindung).",
    sejarah: "Secara tradisional, pakaian bermotif Bayam Raja hanya boleh dipakai oleh kaum raja, pangeran, dan keturunan bangsawan tinggi kerajaan Banjar.",
    warna_tradisional: ["#8B1A1A", "#C5960C", "#FAF3E0", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Central vertical stalk
      { d: "M 50 95 L 50 20", role: "main", strokeWidth: 4 },
      // Crown at the top
      { d: "M 50 10 L 62 25 L 50 20 L 38 25 Z", role: "accent" },
      // Leaves branch left
      { d: "M 50 70 C 35 65, 25 50, 20 40 C 35 40, 45 55, 50 70 Z", role: "main" },
      { d: "M 50 45 C 38 40, 30 30, 28 20 C 38 20, 45 32, 50 45 Z", role: "main" },
      // Leaves branch right
      { d: "M 50 70 C 65 65, 75 50, 80 40 C 65 40, 55 55, 50 70 Z", role: "main" },
      { d: "M 50 45 C 62 40, 70 30, 72 20 C 62 20, 55 32, 50 45 Z", role: "main" },
      // Jelujur stitches along the center and leaf veins
      { d: "M 50 90 L 50 22", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "3,3" },
      { d: "M 22 41 C 34 42, 42 53, 47 65", role: "jelujur", strokeWidth: 1.2, strokeDasharray: "2,2" },
      { d: "M 78 41 C 66 42, 58 53, 53 65", role: "jelujur", strokeWidth: 1.2, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-05").toISOString(),
    updated_at: new Date("2026-06-05").toISOString()
  },
  {
    id: "ular-lidi",
    nama_motif: "Ular Lidi",
    kategori: "FAUNA",
    deskripsi: "Motif Ular Lidi menggambarkan ular kecil yang gesit dan cerdik. Dalam kebudayaan Banjar, ular lidi dianggap sebagai hewan yang tidak berbahaya namun lincah bertahan hidup.",
    makna_filosofi: "Melambangkan kecerdikan, kelenturan dalam bertindak, kearifan lokal, serta kemampuan bertahan hidup (survival) dalam situasi sesulit apa pun.",
    sejarah: "Motif ini menggambarkan kedekatan masyarakat dengan ekosistem hutan dan rawa Kalimantan.",
    warna_tradisional: ["#3D1C0B", "#C5960C", "#FAF3E0", "#16A34A"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Winding snake line (S-curve)
      { d: "M 50 5 Q 75 20, 50 40 T 50 75 Q 25 90, 50 95", role: "main", strokeWidth: 5, strokeDasharray: "none" },
      // Head
      { d: "M 50 5 C 55 5, 58 10, 50 15 C 42 10, 45 5, 50 5 Z", role: "accent" },
      // Dots along the path
      { d: "M 62 25 A 3 3 0 1 1 61.9 25 Z M 38 55 A 3 3 0 1 1 37.9 55 Z M 62 70 A 3 3 0 1 1 61.9 70 Z", role: "accent" },
      // Jelujur line inside the snake body
      { d: "M 50 8 Q 73 22, 50 40 T 50 75 Q 27 88, 50 93", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-06").toISOString(),
    updated_at: new Date("2026-06-06").toISOString()
  },
  {
    id: "gigi-haruan",
    nama_motif: "Gigi Haruan",
    kategori: "FAUNA",
    deskripsi: "Motif Gigi Haruan meniru barisan gigi tajam ikan Haruan (gabus). Ikan Haruan adalah ikan air tawar legendaris di Kalimantan Selatan yang digemari sebagai makanan pokok khas Banjar (misalnya dengan Nasi Kuning).",
    makna_filosofi: "Melambangkan ketajaman berpikir, kekuatan, ketangkasan, keberanian, kewaspadaan, serta kejujuran dalam mengambil keputusan.",
    sejarah: "Gigi Haruan sering menghiasi pinggiran kain Sasirangan karena bentuk geometris segitiga bergerigi yang simetris dan memberikan kesan tegas.",
    warna_tradisional: ["#8B1A1A", "#C5960C", "#FAF3E0", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Left border zig-zag
      { d: "M 15 0 L 30 15 L 15 30 L 30 45 L 15 60 L 30 75 L 15 90 L 30 100 H 10 L 10 0 Z", role: "main" },
      // Right border zig-zag
      { d: "M 85 0 L 70 15 L 85 30 L 70 45 L 85 60 L 70 75 L 85 90 L 70 100 H 90 L 90 0 Z", role: "main" },
      // Center diamonds representing fish scales or matching pattern
      { d: "M 50 15 L 60 25 L 50 35 L 40 25 Z M 50 45 L 60 55 L 50 65 L 40 55 Z M 50 75 L 60 85 L 50 95 L 40 85 Z", role: "accent" },
      // Stitch line along the zig-zag
      { d: "M 22 0 L 27 5 L 22 10 L 27 15 L 22 20 L 27 25 L 22 30 L 27 35 L 22 40 L 27 45 L 22 50 L 27 55 L 22 60 L 27 65 L 22 70 L 27 75 L 22 80 L 27 85 L 22 90 L 27 95 L 22 100", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2" },
      { d: "M 78 0 L 73 5 L 78 10 L 73 15 L 78 20 L 73 25 L 78 30 L 73 35 L 78 40 L 73 45 L 78 50 L 73 55 L 78 60 L 73 65 L 78 70 L 73 75 L 78 80 L 73 85 L 78 90 L 73 95 L 78 100", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-07").toISOString(),
    updated_at: new Date("2026-06-07").toISOString()
  },
  {
    id: "kulat-kurikit",
    nama_motif: "Kulat Kurikit",
    kategori: "ALAM",
    deskripsi: "Motif Kulat Kurikit menggambarkan sejenis jamur kecil (kulat) yang tumbuh menempel pada batang pohon ulin yang keras. Jamur ini kokoh bertahan meskipun cuaca ekstrem.",
    makna_filosofi: "Melambangkan kemandirian, kekompakan hidup bermasyarakat (kolektivitas), keindahan alam, serta ketabahan dalam menghadapi cobaan.",
    sejarah: "Terinspirasi dari jamur kurikit liar yang banyak ditemui di pedalaman hutan tropis Kalimantan.",
    warna_tradisional: ["#3D1C0B", "#C5960C", "#FAF3E0", "#8B1A1A"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Branch / wood trunk
      { d: "M 20 90 C 30 70, 30 30, 20 10 L 30 10 C 40 30, 40 70, 30 90 Z", role: "main" },
      // Mushrooms growing on the trunk
      { d: "M 28 35 C 35 30, 45 30, 50 38 C 42 42, 35 40, 28 35 Z", role: "accent" },
      { d: "M 28 55 C 38 50, 48 50, 55 58 C 45 62, 38 60, 28 55 Z", role: "accent" },
      { d: "M 28 75 C 35 70, 45 70, 50 78 C 42 82, 35 80, 28 75 Z", role: "accent" },
      // Stitches along mushroom caps
      { d: "M 32 34 C 38 32, 44 33, 48 37", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2" },
      { d: "M 32 54 C 40 52, 47 53, 52 57", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2" },
      { d: "M 32 74 C 38 72, 44 73, 48 77", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2" }
    ],
    created_at: new Date("2026-06-08").toISOString(),
    updated_at: new Date("2026-06-08").toISOString()
  },
  {
    id: "tampuk-manggis",
    nama_motif: "Tampuk Manggis",
    kategori: "FLORA",
    deskripsi: "Motif Tampuk Manggis terinspirasi dari bagian bawah buah manggis (tampuk/kelopak). Motif ini melambangkan kejujuran karena jumlah kelopak di luar selalu sama dengan jumlah isi buah di dalam.",
    makna_filosofi: "Melambangkan kejujuran, keselarasan antara perkataan dan perbuatan (integritas), keadilan, serta kesatuan dalam keluarga.",
    sejarah: "Masyarakat Banjar sangat menjunjung tinggi kejujuran, sehingga motif ini sering dihadiahkan kepada pasangan pengantin baru agar membina rumah tangga yang jujur dan harmonis.",
    warna_tradisional: ["#8B1A1A", "#FAF3E0", "#C5960C", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Outer ring
      { d: "M 50 15 A 35 35 0 1 1 49.9 15 Z", role: "main", strokeWidth: 2, fillRule: "evenodd" },
      // Star petals
      { d: "M 50 25 L 56 42 L 74 42 L 60 52 L 65 70 L 50 60 L 35 70 L 40 52 L 26 42 L 44 42 Z", role: "accent" },
      // Center circle
      { d: "M 50 43 A 7 7 0 1 1 49.9 43 Z", role: "main" },
      // Stitches along petals
      { d: "M 50 20 L 58 39 L 79 39 L 63 50 L 68 72 L 50 61 L 32 72 L 37 50 L 21 39 L 42 39 Z", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "3,3" }
    ],
    created_at: new Date("2026-06-09").toISOString(),
    updated_at: new Date("2026-06-09").toISOString()
  },
  {
    id: "daun-jaruju",
    nama_motif: "Daun Jaruju",
    kategori: "FLORA",
    deskripsi: "Motif Daun Jaruju menggambarkan daun tanaman Jaruju yang berujung tajam dan berduri. Tanaman ini banyak tumbuh di pesisir rawa dan sungai Kalimantan Selatan dan sering digunakan sebagai obat tradisional.",
    makna_filosofi: "Melambangkan perlindungan diri dari segala marabahaya, ketabahan mental dalam menghadapi rintangan, serta kesehatan fisik dan batin.",
    sejarah: "Pada zaman dahulu, motif Daun Jaruju sering dipakai sebagai jimat penangkal penyakit dan pengusir roh jahat oleh masyarakat Banjar.",
    warna_tradisional: ["#16A34A", "#FAF3E0", "#C5960C", "#3D1C0B"],
    status: "PUBLISHED",
    viewBox: "0 0 100 100",
    paths: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" },
      // Spiky leaf body
      { d: "M 50 10 C 65 30, 80 25, 70 45 C 85 55, 65 65, 55 90 C 45 65, 25 55, 30 45 C 20 25, 35 30, 50 10 Z", role: "main" },
      // Inner detailed veins
      { d: "M 50 15 L 50 85 M 50 35 L 68 30 M 50 35 L 32 30 M 50 50 L 72 48 M 50 50 L 28 48 M 50 65 L 62 68 M 50 65 L 38 68", role: "accent", strokeWidth: 2 },
      // Stitch line along outer edge
      { d: "M 50 7 C 68 28, 83 23, 73 44 C 88 54, 68 64, 57 88 C 43 64, 23 54, 27 44 C 17 23, 32 28, 50 7 Z", role: "jelujur", strokeWidth: 1.5, strokeDasharray: "2,2", fillRule: "evenodd" }
    ],
    created_at: new Date("2026-06-10").toISOString(),
    updated_at: new Date("2026-06-10").toISOString()
  }
];

// 2. Initial History Chapters (Scrollytelling)
export const initialHistoryChapters: HistoryChapter[] = [
  {
    id: "chapter-1",
    chapter_order: 1,
    judul: "Asal-usul Sasirangan",
    konten: "Menurut legenda, kain Sasirangan pertama kali dibuat pada abad ke-14 di masa Kerajaan Negara Dipa (cikal bakal Kerajaan Banjar). Kain ini awalnya dikenal sebagai kain Calapan yang dibuat atas permintaan Patih Lambung Mangkurat untuk menyembuhkan Putri Junjung Buih yang muncul dari buih sungai. Putri meminta syarat dibuatkan selembar kain yang ditenun dan dicelup (dicalap) oleh 40 orang perawan dengan motif khusus dalam waktu satu hari. Kain penyembuh inilah yang menjadi awal mula tradisi kain Sasirangan.",
    speech: "Selamat datang! Aku Sira Galuh. Mari kita mulai perjalanan sejarah kita dari abad ke-14! Tahukah kamu bahwa kain Sasirangan awalnya adalah kain penyembuh bagi Putri Junjung Buih?",
    media_type: "timeline"
  },
  {
    id: "chapter-2",
    chapter_order: 2,
    judul: "Makna & Filosofi Budaya",
    konten: "Bagi masyarakat suku Banjar, kain Sasirangan bukan sekadar pakaian pelindung tubuh. Setiap goresan garis, lekukan, dan warna mengandung doa, harapan, dan status sosial. Warna kuning melambangkan kemuliaan (khusus raja/bangsawan), warna merah melambangkan keberanian, warna hijau melambangkan kesuburan dan ketaatan beragama, sedangkan warna biru melambangkan kedamaian. Hubungannya yang erat dengan upacara adat (seperti Batapung Tawar atau perkawinan) menunjukkan nilai sakral kain ini.",
    speech: "Lihatlah warna-warna ini! Setiap warna kain memiliki makna magis dan spiritualnya sendiri bagi masyarakat Banjar. Klik pada kartu di samping untuk menjelajahi arti warna dan fungsinya dalam upacara adat ya!",
    media_type: "interactive"
  },
  {
    id: "chapter-3",
    chapter_order: 3,
    judul: "Keragaman Ragam Motif",
    konten: "Masyarakat Banjar mengekspresikan kedekatannya dengan alam melalui motif Sasirangan. Motif flora menggambarkan tanaman obat (Daun Jaruju) dan sayuran (Kangkung Kaombakan). Motif fauna menggambarkan ikan Haruan yang penting bagi ketahanan pangan, sedangkan motif geometris seperti Hiris Gagatas melambangkan keteguhan jiwa. Ensiklopedia Sasirangan mendokumentasikan puluhan motif tradisional yang diwariskan turun-temurun.",
    speech: "Cantik sekali kan motif-motif ini? Semuanya diambil dari keindahan alam dan kearifan lokal banua Kalimantan Selatan. Geser daftarnya untuk mengintip beberapa motif populer!",
    media_type: "slider"
  },
  {
    id: "chapter-4",
    chapter_order: 4,
    judul: "Proses Pembuatan Tradisional",
    konten: "Pembuatan Sasirangan membutuhkan ketekunan tinggi. Prosesnya meliputi: 1) Menyirang (menggambar pola/jelujur di kain putih), 2) Menjelujur (menjahit jelujur sepanjang garis pola menggunakan benang tebal), 3) Mengikat (menarik benang erat-erat hingga kain mengerut rapat agar tidak terkena warna), 4) Mewarnai (mencelupkan kain ke larutan pewarna alami/kimia), dan 5) Membuka Jahitan (membuka jahitan jelujur setelah kain kering untuk memunculkan motif putih bersih).",
    speech: "Nah, sekarang giliranmu menguji pengetahuan tentang proses menjahit jelujur (menyirang) yang legendaris ini! Ikuti kuis singkat di bawah ini dan buktikan kamu sudah memahaminya!",
    media_type: "quiz"
  },
  {
    id: "chapter-5",
    chapter_order: 5,
    judul: "Sasirangan Kini & Esok",
    konten: "Kini, kain Sasirangan telah bertransformasi dari kain sakral pengobatan menjadi ikon fashion modern. Para desainer lokal maupun nasional memadukan motif tradisional Sasirangan dengan pakaian kasual, blazer formal, gaun malam mewah, tas, hingga produk dekorasi rumah kontemporer. Inovasi teknologi AI seperti Virtual Try-On di platform SASITRA menjembatani generasi muda untuk bereksperimen melestarikan budaya di era digital.",
    speech: "Wah, kita sudah sampai di era modern! Lihat bagaimana Sasirangan bertransformasi menjadi busana kontemporer yang trendy. Kamu juga bisa lho mencoba memakai pakaian Sasirangan secara virtual di tab Try-On!",
    media_type: "interactive"
  }
];

// 3. Quiz Questions for Chapter 4
export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Apa arti harfiah dari nama 'Sasirangan' yang berasal dari kata 'sirang'?",
    options: [
      "Dicelup atau direndam",
      "Dijahit jelujur atau diikat",
      "Dilipat secara berlapis",
      "Digambar dengan canting"
    ],
    correctAnswer: 1,
    explanation: "Nama Sasirangan berasal dari kata 'sa' (satu/bersama) dan 'sirang' (jelujur/dijahit jelujur). Ini merujuk pada teknik pembuatan khas di mana kain dijahit jelujur sebelum diikat erat dan dicelup."
  },
  {
    id: "q2",
    question: "Mengapa benang jelujur harus diikat dengan sangat erat sebelum proses pencelupan warna?",
    options: [
      "Agar kain tidak sobek saat dicuci",
      "Agar warna tidak merembes ke area yang diikat, membentuk motif motif putih",
      "Agar kain menjadi wangi tanaman lokal",
      "Agar proses pengeringan kain menjadi lebih cepat"
    ],
    correctAnswer: 1,
    explanation: "Ikatan benang yang sangat erat berfungsi sebagai perintang warna (dye-resist). Daerah yang berkerut rapat dan terikat kencang tidak akan terkena zat pewarna saat dicelup, sehingga setelah benang dilepas akan terbentuk pola motif putih alami."
  },
  {
    id: "q3",
    question: "Pewarna tradisional kuning pada kain Sasirangan tempo dulu terbuat dari bahan alami apa?",
    options: [
      "Kayu ulin",
      "Daun pandan",
      "Kunyit (temulawak)",
      "Biji kesumba"
    ],
    correctAnswer: 2,
    explanation: "Secara tradisional, pewarna kuning didapatkan dari parutan rimpang kunyit (curcuma), merah dari buah kesumba, hijau dari daun jahe/pandan, dan ungu/coklat dari kulit kayu ulin atau kayu bakau."
  }
];
