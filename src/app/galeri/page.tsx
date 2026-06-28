"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";

interface GalleryItem {
  id: string;
  folderKey: string;
  num: string;
  title: string;
  image: string;
  titleDetail: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: "1", folderKey: "01_Motif_Dasar", num: "01", title: "Motif Dasar", image: "/assets/galeri/folder/folder_1.png", titleDetail: "Motif Dasar" },
  { id: "2", folderKey: "02_Motif_Modern", num: "02", title: "Motif Modern", image: "/assets/galeri/folder/folder_2.png", titleDetail: "Motif Modern" },
  { id: "3", folderKey: "03_Motif_Khas_Kota_Banjarmasin", num: "03", title: "Khas Banjarmasin", image: "/assets/galeri/folder/folder_3.png", titleDetail: "Khas Kota Banjarmasin" },
  { id: "4", folderKey: "04_Motif_Khas_Kota_Banjarbaru", num: "04", title: "Khas Banjarbaru", image: "/assets/galeri/folder/folder_4.png", titleDetail: "Khas Kota Banjarbaru" },
  { id: "5", folderKey: "05_Motif_Khas_Kabupaten_Banjar", num: "05", title: "Khas Banjar", image: "/assets/galeri/folder/folder_5.png", titleDetail: "Khas Kabupaten Banjar" },
  { id: "6", folderKey: "06_Motif_Khas_Kabupaten_Tanah_Laut", num: "06", title: "Khas Tanah Laut", image: "/assets/galeri/folder/folder_6.png", titleDetail: "Khas Kabupaten Tanah Laut" },
  { id: "7", folderKey: "07_Motif_Khas_Kabupaten_Tanah_Bumbu", num: "07", title: "Khas Tanah Bumbu", image: "/assets/galeri/folder/folder_7.png", titleDetail: "Khas Kabupaten Tanah Bumbu" },
  { id: "8", folderKey: "08_Motif_Khas_Kabupaten_Kotabaru", num: "08", title: "Khas Kotabaru", image: "/assets/galeri/folder/folder_8.png", titleDetail: "Khas Kabupaten Kotabaru" },
  { id: "9", folderKey: "09_Motif_Khas_Kabupaten_Tapin", num: "09", title: "Khas Tapin", image: "/assets/galeri/folder/folder_9.png", titleDetail: "Khas Kabupaten Tapin" },
  { id: "10", folderKey: "10_Motif_Khas_Kabupaten_Hulu_Sungai", num: "10", title: "Khas Hulu Sungai", image: "/assets/galeri/folder/folder_10.png", titleDetail: "Khas Kabupaten Hulu Sungai" },
  { id: "11", folderKey: "11_Motif_Khas_Kabupaten_Tabalong", num: "11", title: "Khas Tabalong", image: "/assets/galeri/folder/folder_11.png", titleDetail: "Khas Kabupaten Tabalong" },
  { id: "12", folderKey: "12_Motif_Khas_Kabupaten_Balangan", num: "12", title: "Khas Balangan", image: "/assets/galeri/folder/folder_12.png", titleDetail: "Khas Kabupaten Balangan" },
  { id: "13", folderKey: "13_Motif_Khas_Kabupaten_Barito_Kuala", num: "13", title: "Khas Barito Kuala", image: "/assets/galeri/folder/folder_13.png", titleDetail: "Khas Kabupaten Barito Kuala" }
];

interface MotifDetail {
  name: string;
  path: string;
}

const MOTIF_MAPPING: Record<string, MotifDetail[]> = {
  "01_Motif_Dasar": [
    { "name": "Hiris Pudak", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/01_Hiris_Pudak.png" },
    { "name": "Kembang Kacang", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/02_Kembang_Kacang.png" },
    { "name": "Bayam Raja", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/03_Bayam_Raja.png" },
    { "name": "Kulat Karikit", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/04_Kulat_Karikit.png" },
    { "name": "Ombak Sinapur Karang", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/05_Ombak_Sinapur_Karang.png" },
    { "name": "Bintang Behambur", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/06_Bintang_Behambur.png" },
    { "name": "Naga Balimbur", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/07_Naga_Balimbur.png" },
    { "name": "Jajumputan", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/08_Jajumputan.png" },
    { "name": "Turun Dayang", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/09_Turun_Dayang.png" },
    { "name": "Kembang Tampuk Manggis", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/10_Kembang_Tampuk_Manggis.png" },
    { "name": "Daun Jaruju", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/11_Daun_Jaruju.png" },
    { "name": "Kangkung Kaombakan", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/12_Kangkung_Kaombakan.png" },
    { "name": "Gigi Haruan", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/13_Gigi_Haruan.png" },
    { "name": "Kambang Sakaki", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/14_Kambang_Sakaki.png" },
    { "name": "Ular Lidi", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/15_Ular_Lidi.png" },
    { "name": "Mayang Maurai", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/16_Mayang_Maurai.png" },
    { "name": "Ramak Sahang", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/17_Ramak_Sahang.png" },
    { "name": "Gelombang", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/18_Gelombang.png" },
    { "name": "Daun Katu", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/19_Daun_Katu.png" },
    { "name": "Hiris Gagatas", "path": "/assets/motif_sasirangan/folder/01_Motif_Dasar/20_Hiris_Gagatas.png" }
  ],
  "02_Motif_Modern": [
    { "name": "Motif Intan", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/01_Motif_Intan.png" },
    { "name": "Motif Ketupat", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/02_Motif_Ketupat.png" },
    { "name": "Motif Gradasi", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/03_Motif_Gradasi.png" },
    { "name": "Motif Sarigading", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/04_Motif_Sarigading.png" },
    { "name": "Motif Pelangi", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/05_Motif_Pelangi.png" },
    { "name": "Kombinasi Bordir 01", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/06_Sasirangan_Kombinasi_Bordir_01.png" },
    { "name": "Kombinasi Bordir 02", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/07_Sasirangan_Kombinasi_Bordir_02.png" },
    { "name": "Kombinasi Bordir 03", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/08_Sasirangan_Kombinasi_Bordir_03.png" },
    { "name": "Jagung Saringkel Pandan", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/09_Saringkel_Pandan_Kombinasi_Motif_Jagung.png" },
    { "name": "Kijang Saringkel Pandan", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/10_Saringkel_Pandan_Kombinasi_Motif_Kijang.png" },
    { "name": "Anggrek Saringkel Pandan", "path": "/assets/motif_sasirangan/folder/02_Motif_Modern/11_Saringkel_Pandan_Kombinasi_Motif_Anggrek.png" }
  ],
  "03_Motif_Khas_Kota_Banjarmasin": [
    { "name": "Kalakai di Pahumaan", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/01_Kalakai_di_Pahumaan.png" },
    { "name": "Rainbow River", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/02_Rainbow_River.png" },
    { "name": "Daun Pakis di Belukar", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/03_Daun_Pakis_di_Belukar.png" },
    { "name": "Kembang Tigarun", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/04_Kembang_Tigarun.png" },
    { "name": "Sahang Bajuntai di Bantaran Sungai", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/05_Sahang_Bajuntai_di_Bantaran_Sungai.png" },
    { "name": "Sahang dan Jalur Rempah", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/06_Sahang_dan_Jalur_Rempah.png" },
    { "name": "Kurikit Kandang", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/07_Kurikit_Kandang_Rasi.png" },
    { "name": "Ukiran Kalakai di Rumah Banjar", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/08_Ukiran_Kalakai_di_Rumah_Banjar.png" },
    { "name": "Indonesia Jaya", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/09_Indonesia_Jaya.png" },
    { "name": "Langkarnya Padu Padan si Kambang Kacang", "path": "/assets/motif_sasirangan/folder/03_Motif_Khas_Kota_Banjarmasin/10_Langkarnya_Padu_Padan_si_Kambang_Kacang.png" }
  ],
  "04_Motif_Khas_Kota_Banjarbaru": [
    { "name": "Daun Bangkal", "path": "/assets/motif_sasirangan/folder/04_Motif_Khas_Kota_Banjarbaru/01_Daun_Bangkal.png" },
    { "name": "Variatif Bordir", "path": "/assets/motif_sasirangan/folder/04_Motif_Khas_Kota_Banjarbaru/02_Variatif_Bordir.png" }
  ],
  "05_Motif_Khas_Kabupaten_Banjar": [
    { "name": "Intan", "path": "/assets/motif_sasirangan/folder/05_Motif_Khas_Kabupaten_Banjar/01_Intan.png" },
    { "name": "Anggrek dan Daun Jaruju", "path": "/assets/motif_sasirangan/folder/05_Motif_Khas_Kabupaten_Banjar/02_Anggrek_dan_Daun_Jaruju.png" },
    { "name": "Kembang Melati Berlian dan Kantung Semar", "path": "/assets/motif_sasirangan/folder/05_Motif_Khas_Kabupaten_Banjar/03_Kembang_Melati_Berlian_dan_Kantung_Semar.png" },
    { "name": "Pintu Gerbang Bumi Selamat dan Bubungan Atap", "path": "/assets/motif_sasirangan/folder/05_Motif_Khas_Kabupaten_Banjar/04_Pintu_Gerbang_Bumi_Selamat_dan_Bubungan_Atap_Rumah_Banjar.png" },
    { "name": "Tanaman Pakis Kalakai", "path": "/assets/motif_sasirangan/folder/05_Motif_Khas_Kabupaten_Banjar/05_Tanaman_Pakis_Kalakai.png" }
  ],
  "06_Motif_Khas_Kabupaten_Tanah_Laut": [
    { "name": "Kijang", "path": "/assets/motif_sasirangan/folder/06_Motif_Khas_Kabupaten_Tanah_Laut/01_Kijang.png" },
    { "name": "Anggrek", "path": "/assets/motif_sasirangan/folder/06_Motif_Khas_Kabupaten_Tanah_Laut/02_Anggrek.png" },
    { "name": "Jagung", "path": "/assets/motif_sasirangan/folder/06_Motif_Khas_Kabupaten_Tanah_Laut/03_Jagung.png" }
  ],
  "07_Motif_Khas_Kabupaten_Tanah_Bumbu": [
    { "name": "Biota Laut", "path": "/assets/motif_sasirangan/folder/07_Motif_Khas_Kabupaten_Tanah_Bumbu/01_Biota_Laut.png" },
    { "name": "Kapal Ombak dan Rumput Laut", "path": "/assets/motif_sasirangan/folder/07_Motif_Khas_Kabupaten_Tanah_Bumbu/02_Kapal_Ombak_dan_Rumput_Laut.png" }
  ],
  "08_Motif_Khas_Kabupaten_Kotabaru": [
    { "name": "Ikan Todak", "path": "/assets/motif_sasirangan/folder/08_Motif_Khas_Kabupaten_Kotabaru/01_Ikan_Todak.png" }
  ],
  "09_Motif_Khas_Kabupaten_Tapin": [
    { "name": "Naga Balahendang", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/01_Naga_Balahendang.png" },
    { "name": "Halang Menyaung", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/02_Halang_Menyaung.png" },
    { "name": "Anak Bajang Bagandeng Tangan", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/03_Anak_Bajang_Bagandeng_Tangan.png" },
    { "name": "Gasing Kemuning", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/04_Gasing_Kemuning.png" },
    { "name": "Daun Salam", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/05_Daun_Salam.png" },
    { "name": "Ayunan Raja Datu Ujung", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/06_Ayunan_Raja_Datu_Ujung.png" },
    { "name": "Bawang Tunggal", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/07_Bawang_Tunggal.png" },
    { "name": "Panting Polantan", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/08_Panting_Polantan.png" },
    { "name": "Buhan Tikup", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/09_Buhan_Tikup.png" },
    { "name": "Papan Surui", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/10_Papan_Surui.png" },
    { "name": "Layang Layang Bakacak Pinggang", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/11_Layang_Layang_Bakacak_Pinggang.png" },
    { "name": "Tugu Sirang Pitu", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/12_Tugu_Sirang_Pitu.png" },
    { "name": "Dandang Badangung", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/13_Dandang_Badangung.png" },
    { "name": "Daun Sirih", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/14_Daun_Sirih.png" },
    { "name": "Wayang Topeng", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/15_Wayang_Topeng.png" },
    { "name": "Parang Balingan", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/16_Parang_Balingan.png" },
    { "name": "Papakuan", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/17_Papakuan.png" },
    { "name": "Purun", "path": "/assets/motif_sasirangan/folder/09_Motif_Khas_Kabupaten_Tapin/18_Purun.png" }
  ],
  "10_Motif_Khas_Kabupaten_Hulu_Sungai": [
    { "name": "Ketupat (Hulu Sungai Selatan)", "path": "/assets/motif_sasirangan/folder/10_Motif_Khas_Kabupaten_Hulu_Sungai/Hulu_Sungai_Selatan/01_Ketupat.png" },
    { "name": "Perisai (Hulu Sungai Tengah)", "path": "/assets/motif_sasirangan/folder/10_Motif_Khas_Kabupaten_Hulu_Sungai/Hulu_Sungai_Tengah/01_Perisai.png" },
    { "name": "Mega Mendung (Hulu Sungai Tengah)", "path": "/assets/motif_sasirangan/folder/10_Motif_Khas_Kabupaten_Hulu_Sungai/Hulu_Sungai_Tengah/02_Mega_Mendung.png" },
    { "name": "Talabang Halus (Hulu Sungai Tengah)", "path": "/assets/motif_sasirangan/folder/10_Motif_Khas_Kabupaten_Hulu_Sungai/Hulu_Sungai_Tengah/03_Talabang_Halus.png" },
    { "name": "Nyiur di Pulau Sambujur (Hulu Sungai Utara)", "path": "/assets/motif_sasirangan/folder/10_Motif_Khas_Kabupaten_Hulu_Sungai/Hulu_Sungai_Utara/01_Nyiur_di_Pulau_Sambujur.png" },
    { "name": "Anyaman Purun (Hulu Sungai Utara)", "path": "/assets/motif_sasirangan/folder/10_Motif_Khas_Kabupaten_Hulu_Sungai/Hulu_Sungai_Utara/02_Anyaman_Purun.png" }
  ],
  "11_Motif_Khas_Kabupaten_Tabalong": [
    { "name": "Buah Langsat", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/01_Buah_Langsat.png" },
    { "name": "Telabang Dayak", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/02_Telabang_Dayak.png" },
    { "name": "Obor", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/03_Obor.png" },
    { "name": "Tangkai Daun Bunga Tanjung", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/04_Tangkai_Daun_Bunga_Tanjung.png" },
    { "name": "Pakis", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/05_Pakis.png" },
    { "name": "Bunga Pengantin", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/06_Bunga_Pengantin.png" },
    { "name": "Lukut Anggrek Hutan", "path": "/assets/motif_sasirangan/folder/11_Motif_Khas_Kabupaten_Tabalong/07_Lukut_Anggrek_Hutan.png" }
  ],
  "12_Motif_Khas_Kabupaten_Balangan": [
    { "name": "Cempedak Kupas", "path": "/assets/motif_sasirangan/folder/12_Motif_Khas_Kabupaten_Balangan/01_Cempedak_Kupas.png" },
    { "name": "Paring", "path": "/assets/motif_sasirangan/folder/12_Motif_Khas_Kabupaten_Balangan/02_Paring.png" },
    { "name": "Anyaman", "path": "/assets/motif_sasirangan/folder/12_Motif_Khas_Kabupaten_Balangan/03_Anyaman.png" },
    { "name": "Anyaman Tirik Besambut", "path": "/assets/motif_sasirangan/folder/12_Motif_Khas_Kabupaten_Balangan/04_Anyaman_Tirik_Besambut.png" }
  ],
  "13_Motif_Khas_Kabupaten_Barito_Kuala": [
    { "name": "Padi dan Purun", "path": "/assets/motif_sasirangan/folder/13_Motif_Khas_Kabupaten_Barito_Kuala/01_Padi_dan_Purun.png" }
  ]
};

export default function GaleriPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<MotifDetail | null>(null);

  const activeFolder = GALLERY_ITEMS.find((item) => item.id === selectedFolderId);
  const activeMotifs = activeFolder ? MOTIF_MAPPING[activeFolder.folderKey] || [] : [];

  // Splitting items for the staggered layout on desktop:
  // Row 1: items 01-03 (indices 0 to 2)
  // Row 2: items 04-08 (indices 3 to 7)
  // Row 3: items 09-13 (indices 8 to 12)
  const row1 = GALLERY_ITEMS.slice(0, 3);
  const row2 = GALLERY_ITEMS.slice(3, 8);
  const row3 = GALLERY_ITEMS.slice(8, 13);

  return (
    <div 
      className="h-screen flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/assets/background/background_7.png')",
      }}
    >
      <Navbar />


      {/* Main Container */}
      <main className="flex-1 flex flex-col pt-24 pb-4 px-6 relative z-20 max-w-7xl mx-auto w-full overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!selectedFolderId ? (
            /* ==================== VIEW 1: GALLERY MAIN GRID ==================== */
            <motion.div
              key="main-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center w-full overflow-hidden"
            >
              {/* Title and Subtitle */}
              <div className="text-center flex flex-col items-center gap-2 mb-6 select-none shrink-0">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest text-secondary flex items-center justify-center gap-4 md:gap-8">
                  <span className="w-16 md:w-28 h-[1.5px] bg-linear-to-r from-transparent to-secondary" /> 
                  GALERI 
                  <span className="w-16 md:w-28 h-[1.5px] bg-linear-to-l from-transparent to-secondary" />
                </h1>
                <p className="font-sans text-xs md:text-sm lg:text-base text-text-light/95 tracking-wide max-w-2xl font-light leading-relaxed">
                  Jelajahi ragam motif Sasirangan dari berbagai daerah di{" "}
                  <span className="text-secondary font-semibold">Kalimantan Selatan</span>
                </p>
              </div>

              {/* Scrollable grid container for folders */}
              <div className="flex-1 w-full overflow-y-auto pr-2 scrollbar-gallery pb-6 flex flex-col items-center justify-start">
                {/* Staggered Desktop Layout (Row 1: 3 cards, Row 2: 5 cards, Row 3: 5 cards) */}
                <div className="hidden lg:flex flex-col gap-8 items-center w-full">
                  {/* Row 1: 3 cards */}
                  <div className="flex flex-row justify-center gap-8 w-full">
                    {row1.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        onClick={() => setSelectedFolderId(item.id)}
                        className="w-full max-w-[225px] aspect-[1.52] relative cursor-pointer"
                      >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(197,150,12,0.45)] transition-all duration-300">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="230px"
                            className="object-contain"
                            priority
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Row 2: 5 cards */}
                  <div className="flex flex-row justify-center gap-6 w-full">
                    {row2.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: (idx + 3) * 0.08 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        onClick={() => setSelectedFolderId(item.id)}
                        className="w-full max-w-[225px] aspect-[1.52] relative cursor-pointer"
                      >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(197,150,12,0.45)] transition-all duration-300">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="210px"
                            className="object-contain"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Row 3: 5 cards */}
                  <div className="flex flex-row justify-center gap-6 w-full">
                    {row3.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: (idx + 8) * 0.08 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        onClick={() => setSelectedFolderId(item.id)}
                        className="w-full max-w-[225px] aspect-[1.52] relative cursor-pointer"
                      >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(197,150,12,0.45)] transition-all duration-300">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="210px"
                            className="object-contain"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Responsive Layout for Mobile & Tablet (Grid flow) */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-4xl px-4">
                  {GALLERY_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedFolderId(item.id)}
                      className="w-full aspect-[1.52] relative mx-auto max-w-60 cursor-pointer"
                    >
                      <div className="relative w-full h-full rounded-2xl overflow-hidden hover:shadow-[0_0_20px_rgba(197,150,12,0.4)] transition-all duration-300">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="240px"
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ==================== VIEW 2: SPLIT DETAIL SIDEBAR VIEW ==================== */
            <motion.div
              key="detail-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col md:flex-row gap-4 lg:gap-8 items-start overflow-hidden md:h-full"
            >
              
              {/* Left Sidebar - Folder Stack */}
              <div className="w-full md:w-50 lg:w-60 flex flex-col shrink-0 md:h-full z-30 overflow-hidden">
                {/* Back button */}
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className="flex items-center gap-2 text-text-light/80 hover:text-secondary font-semibold text-xs tracking-wider uppercase mb-6 cursor-pointer self-start transition-colors duration-300 shrink-0"
                >
                  ← Kembali ke Galeri
                </button>

                {/* Sidebar Scroll Container */}
                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:flex-1 w-full pb-4 md:pb-0 pr-0 md:pr-2 scrollbar-gallery select-none">
                  {GALLERY_ITEMS.map((item) => {
                    const isActive = item.id === selectedFolderId;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedFolderId(item.id)}
                        className={`w-32 md:w-full max-w-42.5 lg:max-w-47.5 aspect-[1.52] relative transition-all duration-300 block shrink-0 cursor-pointer ${
                          isActive 
                            ? "opacity-100 scale-100 drop-shadow-[0_4px_12px_rgba(197,150,12,0.25)]" 
                             : "opacity-25 hover:opacity-55 scale-95"
                        }`}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 144px, 220px"
                          className="object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical divider line */}
              <div className="w-[1.5px] bg-white/10 self-stretch hidden md:block mx-2 lg:mx-6" />

              {/* Right Content - Title & Motifs Grid */}
              <div className="flex-1 w-full flex flex-col items-start h-full overflow-hidden">
                
                {/* Title */}
                <div className="flex flex-col gap-1 w-full mb-8 shrink-0">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-wide">
                    {activeFolder?.titleDetail}
                  </h2>
                  <div className="w-28 h-0.5 bg-secondary mt-2.5" />
                </div>

                {/* Scrollable motifs grid container */}
                <div className="flex-1 w-full overflow-y-auto pr-2 scrollbar-gallery pb-6">
                  {activeMotifs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
                      {activeMotifs.map((motif, idx) => (
                        <motion.div
                          key={motif.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className="flex flex-col items-center group cursor-pointer"
                          onClick={() => setLightboxImage(motif)}
                        >
                          {/* Image Container with Yellow/Gold Border */}
                          <div className="w-full aspect-4/3 relative rounded-2xl border-[3px] border-secondary bg-white/5 overflow-hidden shadow-md group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(197,150,12,0.4)] transition-all duration-300 flex items-center justify-center p-0.5">
                            <Image
                              src={motif.path}
                              alt={motif.name}
                              fill
                              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10">
                              <ZoomIn className="text-white h-7 w-7 drop-shadow" />
                            </div>
                          </div>

                          {/* Motif Name */}
                          <p className="text-center font-serif text-xs md:text-sm text-white/95 font-medium mt-3.5 group-hover:text-secondary transition-colors leading-tight px-1 select-none">
                            {motif.name}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    /* Empty state for Hulu Sungai (or folders with no images) */
                    <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4 border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-xs select-none">
                      <p className="font-serif text-lg text-text-light/60">
                        Koleksi motif untuk daerah ini belum tersedia.
                      </p>
                      <p className="text-xs text-text-light/40 mt-1">
                        Kembali lagi nanti untuk melihat pembaruan koleksi kami!
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Lightbox / Large Image Preview Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF9] rounded-3xl border-4 border-secondary shadow-2xl p-4 md:p-6 max-w-3xl w-full flex flex-col gap-4 relative cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 text-text-dark/40 hover:text-red-600 transition-colors p-1.5 bg-white/70 hover:bg-white rounded-full shadow-md z-30 cursor-pointer"
                aria-label="Tutup pratinjau"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Large Image */}
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-secondary/15 bg-stone-100 flex items-center justify-center shadow-inner">
                <Image
                  src={lightboxImage.path}
                  alt={lightboxImage.name}
                  fill
                  sizes="(max-width: 1024px) 95vw, 800px"
                  className="object-contain p-1"
                  priority
                />
              </div>

              {/* Title & Info */}
              <div className="text-left px-2 select-text">
                <h3 className="font-serif font-extrabold text-2xl text-secondary-dark mb-1">
                  {lightboxImage.name}
                </h3>
                <p className="text-xs text-text-dark/60 font-sans tracking-wide uppercase font-semibold">
                  Koleksi Galeri Motif {activeFolder?.titleDetail}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
