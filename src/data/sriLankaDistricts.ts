/**
 * Sri Lanka Administrative & Disaster Management Geographic Data
 * 9 Provinces and 25 Districts with Sinhala & English names and major localities / DS divisions.
 */

export interface DistrictInfo {
  id: string;
  name: string;
  nameSi: string;
  provinceId: string;
  provinceName: string;
  provinceNameSi: string;
  keyLocalities: string[];
}

export interface ProvinceInfo {
  id: string;
  name: string;
  nameSi: string;
  districts: string[];
}

export const SRI_LANKA_PROVINCES: ProvinceInfo[] = [
  {
    id: 'WP',
    name: 'Western Province',
    nameSi: 'බස්නාහිර පළාත',
    districts: ['Colombo', 'Gampaha', 'Kalutara'],
  },
  {
    id: 'SP',
    name: 'Southern Province',
    nameSi: 'දකුණු පළාත',
    districts: ['Galle', 'Matara', 'Hambantota'],
  },
  {
    id: 'SABP',
    name: 'Sabaragamuwa Province',
    nameSi: 'සබරගමුව පළාත',
    districts: ['Ratnapura', 'Kegalle'],
  },
  {
    id: 'CP',
    name: 'Central Province',
    nameSi: 'මධ්‍යම පළාත',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya'],
  },
  {
    id: 'NWP',
    name: 'North Western Province',
    nameSi: 'වයඹ පළාත',
    districts: ['Kurunegala', 'Puttalam'],
  },
  {
    id: 'NCP',
    name: 'North Central Province',
    nameSi: 'උතුරු මැද පළාත',
    districts: ['Anuradhapura', 'Polonnaruwa'],
  },
  {
    id: 'UP',
    name: 'Uva Province',
    nameSi: 'ඌව පළාත',
    districts: ['Badulla', 'Monaragala'],
  },
  {
    id: 'EP',
    name: 'Eastern Province',
    nameSi: 'නැගෙනහිර පළාත',
    districts: ['Ampara', 'Batticaloa', 'Trincomalee'],
  },
  {
    id: 'NP',
    name: 'Northern Province',
    nameSi: 'උතුරු පළාත',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  },
];

export const SRI_LANKA_DISTRICTS: DistrictInfo[] = [
  // Western
  {
    id: 'colombo',
    name: 'Colombo',
    nameSi: 'කොළඹ',
    provinceId: 'WP',
    provinceName: 'Western',
    provinceNameSi: 'බස්නාහිර',
    keyLocalities: ['Colombo', 'Kaduwela', 'Kolonnawa', 'Dehiwala', 'Moratuwa', 'Maharagama', 'Homagama', 'Kesbewa', 'Hanwella', 'Padukka'],
  },
  {
    id: 'gampaha',
    name: 'Gampaha',
    nameSi: 'ගම්පහ',
    provinceId: 'WP',
    provinceName: 'Western',
    provinceNameSi: 'බස්නාහිර',
    keyLocalities: ['Gampaha', 'Kelaniya', 'Biyagama', 'Peliyagoda', 'Wattala', 'Ja-Ela', 'Negombo', 'Katunayake', 'Minuwangoda', 'Mirigama', 'Dompe'],
  },
  {
    id: 'kalutara',
    name: 'Kalutara',
    nameSi: 'කළුතර',
    provinceId: 'WP',
    provinceName: 'Western',
    provinceNameSi: 'බස්නාහිර',
    keyLocalities: ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Matugama', 'Bandaragama', 'Bulathsinhala', 'Ingiriya', 'Millaniya', 'Agalawatta'],
  },

  // Sabaragamuwa
  {
    id: 'ratnapura',
    name: 'Ratnapura',
    nameSi: 'රත්නපුර',
    provinceId: 'SABP',
    provinceName: 'Sabaragamuwa',
    provinceNameSi: 'සබරගමුව',
    keyLocalities: ['Ratnapura', 'Kuruwita', 'Pelmadulla', 'Balangoda', 'Eheliyagoda', 'Embilipitiya', 'Kalawana', 'Ayagama', 'Nivitigala', 'Kahawatta'],
  },
  {
    id: 'kegalle',
    name: 'Kegalle',
    nameSi: 'කෑගල්ල',
    provinceId: 'SABP',
    provinceName: 'Sabaragamuwa',
    provinceNameSi: 'සබරගමුව',
    keyLocalities: ['Kegalle', 'Mawanella', 'Warakapola', 'Ruwanwella', 'Yatiyantota', 'Dehiowita', 'Deraniyagala', 'Galigamuwa'],
  },

  // Southern
  {
    id: 'galle',
    name: 'Galle',
    nameSi: 'ගාල්ල',
    provinceId: 'SP',
    provinceName: 'Southern',
    provinceNameSi: 'දකුණ',
    keyLocalities: ['Galle', 'Karapitiya', 'Hikkaduwa', 'Baddegama', 'Ambalangoda', 'Elpitiya', 'Nagoda', 'Bentota', 'Yakkalamulla', 'Imaduwa'],
  },
  {
    id: 'matara',
    name: 'Matara',
    nameSi: 'මාතර',
    provinceId: 'SP',
    provinceName: 'Southern',
    provinceNameSi: 'දකුණ',
    keyLocalities: ['Matara', 'Weligama', 'Akuressa', 'Dikwella', 'Deniyaya', 'Hakmana', 'Kamburupitiya', 'Devinuwara', 'Morawaka', 'Kotapola'],
  },
  {
    id: 'hambantota',
    name: 'Hambantota',
    nameSi: 'හම්බන්තොට',
    provinceId: 'SP',
    provinceName: 'Southern',
    provinceNameSi: 'දකුණ',
    keyLocalities: ['Hambantota', 'Tangalle', 'Beliatta', 'Ambalantota', 'Tissamaharama', 'Walasmulla', 'Weeraketiya', 'Suriyawewa'],
  },

  // Central
  {
    id: 'kandy',
    name: 'Kandy',
    nameSi: 'මහනුවර',
    provinceId: 'CP',
    provinceName: 'Central',
    provinceNameSi: 'මධ්‍යම',
    keyLocalities: ['Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Katugastota', 'Kundasale', 'Akurana', 'Teldeniya'],
  },
  {
    id: 'matale',
    name: 'Matale',
    nameSi: 'මාතලේ',
    provinceId: 'CP',
    provinceName: 'Central',
    provinceNameSi: 'මධ්‍යම',
    keyLocalities: ['Matale', 'Dambulla', 'Sigiriya', 'Galewela', 'Rattota', 'Ukuwela', 'Naula'],
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    nameSi: 'නුවරඑළිය',
    provinceId: 'CP',
    provinceName: 'Central',
    provinceNameSi: 'මධ්‍යම',
    keyLocalities: ['Nuwara Eliya', 'Hatton', 'Talawakelle', 'Ginigathena', 'Walapane', 'Kotmale', 'Hanguranketha', 'Maskeliya'],
  },

  // North Western
  {
    id: 'kurunegala',
    name: 'Kurunegala',
    nameSi: 'කුරුණෑගල',
    provinceId: 'NWP',
    provinceName: 'North Western',
    provinceNameSi: 'වයඹ',
    keyLocalities: ['Kurunegala', 'Kuliyapitiya', 'Narammala', 'Polgahawela', 'Wariyapola', 'Mawathagama', 'Pannala', 'Ibbagamuwa'],
  },
  {
    id: 'puttalam',
    name: 'Puttalam',
    nameSi: 'පුත්තලම',
    provinceId: 'NWP',
    provinceName: 'North Western',
    provinceNameSi: 'වයඹ',
    keyLocalities: ['Puttalam', 'Chilaw', 'Marawila', 'Wennappuwa', 'Anamaduwa', 'Dankotuwa', 'Kalpitiya', 'Nattandiya'],
  },

  // North Central
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    nameSi: 'අනුරාධපුර',
    provinceId: 'NCP',
    provinceName: 'North Central',
    provinceNameSi: 'උතුරු මැද',
    keyLocalities: ['Anuradhapura', 'Medawachchiya', 'Tambuttegama', 'Kekirawa', 'Eppawala', 'Galnewa', 'Nochchiyagama', 'Horowpathana'],
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa',
    nameSi: 'පොළොන්නරුව',
    provinceId: 'NCP',
    provinceName: 'North Central',
    provinceNameSi: 'උතුරු මැද',
    keyLocalities: ['Polonnaruwa', 'Hingurakgoda', 'Kaduruwela', 'Medirigiriya', 'Minneriya', 'Dimbulagala', 'Bakamuna'],
  },

  // Uva
  {
    id: 'badulla',
    name: 'Badulla',
    nameSi: 'බදුල්ල',
    provinceId: 'UP',
    provinceName: 'Uva',
    provinceNameSi: 'ඌව',
    keyLocalities: ['Badulla', 'Bandarawela', 'Haputale', 'Welimada', 'Mahiyanganaya', 'Diyatalawa', 'Ella', 'Passara'],
  },
  {
    id: 'monaragala',
    name: 'Monaragala',
    nameSi: 'මොනරාගල',
    provinceId: 'UP',
    provinceName: 'Uva',
    provinceNameSi: 'ඌව',
    keyLocalities: ['Monaragala', 'Wellawaya', 'Buttala', 'Bibile', 'Kataragama', 'Medagama', 'Siyambalanduwa'],
  },

  // Eastern
  {
    id: 'ampara',
    name: 'Ampara',
    nameSi: 'අම්පාර',
    provinceId: 'EP',
    provinceName: 'Eastern',
    provinceNameSi: 'නැගෙනහිර',
    keyLocalities: ['Ampara', 'Kalmunai', 'Sammanthurai', 'Akkaraipattu', 'Pottuvil', 'Sainthamaruthu', 'Dehiattakandiya'],
  },
  {
    id: 'batticaloa',
    name: 'Batticaloa',
    nameSi: 'මඩකලපුව',
    provinceId: 'EP',
    provinceName: 'Eastern',
    provinceNameSi: 'නැගෙනහිර',
    keyLocalities: ['Batticaloa', 'Kattankudy', 'Eravur', 'Valachchenai', 'Kaluwanchikudy', 'Vakarai'],
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    nameSi: 'ත්‍රිකුණාමලය',
    provinceId: 'EP',
    provinceName: 'Eastern',
    provinceNameSi: 'නැගෙනහිර',
    keyLocalities: ['Trincomalee', 'Kinniya', 'Kantale', 'Muttur', 'Kuchchaveli', 'Serunuwara'],
  },

  // Northern
  {
    id: 'jaffna',
    name: 'Jaffna',
    nameSi: 'යාපනය',
    provinceId: 'NP',
    provinceName: 'Northern',
    provinceNameSi: 'උතුරු',
    keyLocalities: ['Jaffna', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Karainagar', 'Kopay', 'Vaddukoddai'],
  },
  {
    id: 'kilinochchi',
    name: 'Kilinochchi',
    nameSi: 'කිලිනොච්චිය',
    provinceId: 'NP',
    provinceName: 'Northern',
    provinceNameSi: 'උතුරු',
    keyLocalities: ['Kilinochchi', 'Paranthan', 'Poonakary', 'Karachchi', 'Pallai'],
  },
  {
    id: 'mannar',
    name: 'Mannar',
    nameSi: 'මන්නාරම',
    provinceId: 'NP',
    provinceName: 'Northern',
    provinceNameSi: 'උතුරු',
    keyLocalities: ['Mannar', 'Madhu', 'Nanaddan', 'Musali', 'Pesalai'],
  },
  {
    id: 'mullaitivu',
    name: 'Mullaitivu',
    nameSi: 'මුලතිව්',
    provinceId: 'NP',
    provinceName: 'Northern',
    provinceNameSi: 'උතුරු',
    keyLocalities: ['Mullaitivu', 'Puthukkudiyiruppu', 'Oddusuddan', 'Maritimepattu', 'Manthai East'],
  },
  {
    id: 'vavuniya',
    name: 'Vavuniya',
    nameSi: 'වවුනියාව',
    provinceId: 'NP',
    provinceName: 'Northern',
    provinceNameSi: 'උතුරු',
    keyLocalities: ['Vavuniya', 'Cheddikulam', 'Nedunkeni', 'Vavuniya South'],
  },
];

/**
 * High-priority flood/landslide prone hotspot districts for quick pill selection
 */
export const HIGH_ALERT_DISTRICTS = ['Gampaha', 'Colombo', 'Ratnapura', 'Kalutara', 'Galle', 'Matara'];

/**
 * Checks whether an address, warehouse location, or incident string matches the selected province and district.
 */
export function matchesLocationFilter(
  addressOrLocation: string | undefined | null,
  selectedProvince: string,
  selectedDistrict: string
): boolean {
  if (!addressOrLocation) return true;
  const target = addressOrLocation.toLowerCase();

  // If both are 'All', match everything
  if (selectedProvince === 'All' && selectedDistrict === 'All') {
    return true;
  }

  // If a specific district is selected
  if (selectedDistrict !== 'All') {
    const distInfo = SRI_LANKA_DISTRICTS.find(
      (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase() || d.id === selectedDistrict.toLowerCase()
    );

    if (distInfo) {
      // Check district name itself
      if (target.includes(distInfo.name.toLowerCase())) return true;
      if (target.includes(distInfo.nameSi.toLowerCase())) return true;

      // Check key towns / localities in that district
      const matchesTown = distInfo.keyLocalities.some((town) => target.includes(town.toLowerCase()));
      if (matchesTown) return true;
    } else {
      if (target.includes(selectedDistrict.toLowerCase())) return true;
    }
    return false;
  }

  // If only a province is selected
  if (selectedProvince !== 'All') {
    const provInfo = SRI_LANKA_PROVINCES.find(
      (p) => p.name.toLowerCase().includes(selectedProvince.toLowerCase()) || p.id === selectedProvince
    );

    if (provInfo) {
      if (target.includes(provInfo.name.toLowerCase())) return true;
      if (target.includes(provInfo.nameSi.toLowerCase())) return true;

      // Check all districts belonging to this province
      const provinceDistricts = SRI_LANKA_DISTRICTS.filter((d) => d.provinceId === provInfo.id);
      for (const dist of provinceDistricts) {
        if (target.includes(dist.name.toLowerCase())) return true;
        if (target.includes(dist.nameSi.toLowerCase())) return true;
        if (dist.keyLocalities.some((town) => target.includes(town.toLowerCase()))) return true;
      }
    } else {
      if (target.includes(selectedProvince.toLowerCase())) return true;
    }
    return false;
  }

  return true;
}
