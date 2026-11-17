export type Language = 'en' | 'si';

export interface BilingualText {
  en: string;
  si: string;
}

export interface BilingualList {
  en: string[];
  si: string[];
}

export interface VisualStep {
  stepNumber: number;
  title: BilingualText;
  description: BilingualText;
  badge: BilingualText;
}

export interface ChecklistItem {
  id: string;
  text: BilingualText;
  tip: BilingualText;
}

export interface OfficialHotline {
  name: BilingualText;
  number: string;
  description: BilingualText;
}

export interface DisasterGuide {
  id: string;
  categoryType: 'water' | 'geological' | 'weather' | 'fire' | 'preparedness' | 'health';
  image: string;
  imageAlt: BilingualText;
  title: BilingualText;
  shortDescription: BilingualText;
  introduction: BilingualText;
  urgencyLevel: 'Critical' | 'High' | 'Medium' | 'Routine';
  tags: {
    en: string[];
    si: string[];
  };
  beforeStage?: {
    heading: BilingualText;
    steps: BilingualText[];
  };
  duringStage: {
    heading: BilingualText;
    steps: BilingualText[];
  };
  afterStage?: {
    heading: BilingualText;
    steps: BilingualText[];
  };
  dos: BilingualText[];
  donts: BilingualText[];
  visualSteps: VisualStep[];
  checklist: ChecklistItem[];
  whenToSeekHelp: BilingualText;
  officialHotlines: OfficialHotline[];
}

export const DISASTER_GUIDES: DisasterGuide[] = [
  {
    id: 'flood-safety',
    categoryType: 'water',
    image: '/illustrations/flood-safety.webp',
    imageAlt: {
      en: 'Sri Lankan family safely evacuating on high ground along a flood-safe path with emergency supplies',
      si: 'හදිසි ද්‍රව්‍ය සහිත බෑගයක් රැගෙන ගංවතුරින් ආරක්ෂිත උස් මාර්ගයක් ඔස්සේ ඉවත් වන ශ්‍රී ලාංකික පවුලක්'
    },
    title: {
      en: 'Flood Safety',
      si: 'ගංවතුර ආරක්ෂාව'
    },
    shortDescription: {
      en: 'What to do before, during, and after a flood. Move to safe high ground, avoid walking or driving through floodwater, and stay away from downed power lines.',
      si: 'ගංවතුරකට පෙර, අතරතුර සහ පසුව කළ යුතු දේ. අවස්ථානුකූලව ආරක්ෂිත උස් ස්ථාන කරා යාම, ගංවතුර ජලය හරහා ඇවිදීම හෝ වාහන ධාවනයෙන් වැළකීම සහ විදුලි රැහැන්වලින් ඈත්ව සිටීම.'
    },
    introduction: {
      en: 'Flooding is Sri Lanka’s most frequent natural hazard during monsoons. Fast-moving floodwaters can rise rapidly and conceal hazardous debris, open drains, and submerged electrical lines. Following these verified steps protects your life and your family.',
      si: 'මෝසම් වැසි සමයේ ශ්‍රී ලංකාවේ බහුලව සිදුවන ආපදාව ගංවතුරයි. වේගයෙන් ගලායන ජල පහරවල් ඉතා ඉක්මනින් ඉහළ යන අතර සැඟවුණු කානු, අපද්‍රව්‍ය සහ අනතුරුදායක විදුලි රැහැන් රැගෙන යා හැකිය. මෙම උපදෙස් පිළිපැදීම ඔබේත් පවුලේත් ආරක්ෂාවට අත්‍යවශ්‍ය වේ.'
    },
    urgencyLevel: 'Critical',
    tags: {
      en: ['flood', 'water', 'monsoon', 'rain', 'river', 'inundation', 'high ground', 'evacuation'],
      si: ['ගංවතුර', 'ජලය', 'වැසි', 'මෝසම්', 'ගංගා', 'උස්බිම්', 'ඉවත් වීම', 'ආරක්ෂාව']
    },
    beforeStage: {
      heading: {
        en: 'Before the Flood (Preparedness)',
        si: 'ගංවතුරට පෙර (පූර්ව සූදානම)'
      },
      steps: [
        {
          en: 'Monitor water levels of nearby rivers (e.g. Kelani, Kalu, Gin, Nilwala) via official Disaster Management Centre (DMC) alerts.',
          si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානයේ (DMC) නිල නිවේදන හරහා කැලණි, කළු, ගිං, නිල්වලා වැනි ආසන්න ගංගාවල ජල මට්ටම් පිළිබඳ අවධානයෙන් සිටින්න.'
        },
        {
          en: 'Elevate furniture, electrical appliances, and valuable documents above anticipated flood levels.',
          si: 'නිවසේ ගෘහ භාණ්ඩ, විදුලි උපකරණ සහ වටිනා ලියකියවිලි ගංවතුර මට්ටමට වඩා ඉහළ ස්ථානවල තබන්න.'
        },
        {
          en: 'Pack your Emergency Go-Bag with drinking water, dry rations, torch, spare batteries, and prescription medications.',
          si: 'පානීය ජලය, වියළි ආහාර, විදුලි පන්දම්, අමතර බැටරි සහ අත්‍යවශ්‍ය ඖෂධ සහිත හදිසි බෑගය සූදානම් කරගන්න.'
        },
        {
          en: 'Identify the safest, highest evacuation path to verified community shelters in advance.',
          si: 'ආරක්ෂිත ප්‍රජා නවාතැන් වෙත ළඟා විය හැකි උස් සහ ආරක්ෂිත මාර්ගය කලින්ම හඳුනාගන්න.'
        }
      ]
    },
    duringStage: {
      heading: {
        en: 'During the Flood (Immediate Action)',
        si: 'ගංවතුර පවතින අවස්ථාවේ (ක්ෂණික ක්‍රියාමාර්ග)'
      },
      steps: [
        {
          en: 'Move immediately to higher ground or upper floors if water enters your home. Do not delay evacuation.',
          si: 'නිවස තුළට ජලය ගලා ඒමට පටන් ගන්නේ නම් වහාම උස් ස්ථානයකට හෝ උඩුමහලට යන්න. ඉවත් වීම ප්‍රමාද නොකරන්න.'
        },
        {
          en: 'Turn off the main electricity switch and LPG gas cylinder valve before evacuating if it is safe to reach them.',
          si: 'ආරක්ෂිතව ළඟා විය හැකි නම්, නිවසින් පිටවීමට පෙර ප්‍රධාන විදුලි ස්විචය සහ ගෑස් සිලින්ඩරයේ කපාටය වසා දමන්න.'
        },
        {
          en: 'Never attempt to walk, swim, or drive through flowing floodwaters. Just 15 cm of moving water can knock an adult down.',
          si: 'ගලායන ගංවතුර ජලය හරහා ඇවිදීමට, පිහිනීමට හෝ වාහන ධාවනයට උත්සාහ නොකරන්න. සෙන්ටිමීටර 15ක ජල පහරකට පවා වැඩිහිටියෙකු බිම හෙළිය හැකිය.'
        },
        {
          en: 'Stay away from submerged drains, culverts, riverbanks, and fallen utility cables.',
          si: 'ජලයෙන් යටවූ කානු, බෝක්කු, ගං ඉවුරු සහ වැටී ඇති විදුලි රැහැන්වලින් ඈත්ව සිටින්න.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'After the Flood (Recovery & Health)',
        si: 'ගංවතුර බැස ගිය පසු (ප්‍රකෘතිමත් වීම සහ සෞඛ්‍යය)'
      },
      steps: [
        {
          en: 'Return home only after local authorities confirm the area is structurally safe and free of live electrical hazards.',
          si: 'ප්‍රදේශය ආරක්ෂිත බවත් විදුලි අනතුරු නොමැති බවත් ප්‍රාදේශීය බලධාරීන් තහවුරු කළ පසු පමණක් නිවසට පැමිණෙන්න.'
        },
        {
          en: 'Do not drink tap or well water until it has been boiled vigorously or officially tested and chlorinated.',
          si: 'නටවා නිවාගත් ජලය හෝ ක්ලෝරීනීකරණය කළ ජලය පමණක් පානය කරන්න. අපිරිසිදු ළිං ජලය පානය නොකරන්න.'
        },
        {
          en: 'Have a qualified electrician inspect home wiring before switching on main electricity breakers.',
          si: 'ප්‍රධාන විදුලි ස්විච ක්‍රියාත්මක කිරීමට පෙර සුදුසුකම් ලත් විදුලි කාර්මිකයෙකු ලවා වයරින් පරීක්ෂා කරගන්න.'
        },
        {
          en: 'Beware of snakes and harmful pests that take refuge in flooded houses and dry indoor spaces.',
          si: 'ගංවතුරින් බේරීමට නිවෙස් තුළ වියළි ස්ථානවල සැඟවී සිටින සර්පයන් සහ විෂ සහිත සතුන් පිළිබඳ විමසිලිමත් වන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Move elderly family members, children, and pets to safety early.',
        si: 'වැඩිහිටියන්, කුඩා දරුවන් සහ සුරතල් සතුන් කල්තියාම ආරක්ෂිත ස්ථාන කරා යොමු කරන්න.'
      },
      {
        en: 'Keep your mobile phone charged and carry an external power bank in a waterproof pouch.',
        si: 'ජංගම දුරකථනය ආරෝපණය කර තබාගෙන එය ජලයට ඔරොත්තු දෙන කවරයක දමා ළඟ තබාගන්න.'
      },
      {
        en: 'Boil all drinking water for at least 1 minute before consumption.',
        si: 'පානීය ජලය භාවිතයට පෙර අවම වශයෙන් විනාඩියක්වත් හොඳින් නටවා ගන්න.'
      },
      {
        en: 'Follow official evacuation alerts broadcasted on Radio / TV and DMC hotline 117.',
        si: 'ගුවන්විදුලිය, රූපවාහිනිය සහ DMC 117 ක්ෂණික ඇමතුම් මගින් දෙන නිල උපදෙස් පිළිපදින්න.'
      }
    ],
    donts: [
      {
        en: 'Do not drive through flooded roads or submerged bridges.',
        si: 'ජලයෙන් යටවූ මාර්ග හෝ පාලම් මතින් වාහන ධාවනය නොකරන්න.'
      },
      {
        en: 'Do not touch electric switches or appliances with wet hands or while standing in water.',
        si: 'තෙත දෑතින් හෝ ජලයේ සිටගෙන සිටියදී විදුලි ස්විච හෝ උපකරණ ස්පර්ශ නොකරන්න.'
      },
      {
        en: 'Do not let children play in floodwater due to severe leptospirosis (rat fever) and infection risks.',
        si: 'මී උණ (Leptospirosis) සහ බැක්ටීරියා ආසාදන අවදානම් හේතුවෙන් දරුවන්ට ගංවතුරේ සෙල්ලම් කිරීමට ඉඩ නොදෙන්න.'
      },
      {
        en: 'Do not spread unverified rumours on social media during disaster situations.',
        si: 'හදිසි ආපදා අවස්ථාවලදී සමාජ මාධ්‍ය හරහා තහවුරු නොකළ අසත්‍ය තොරතුරු පතුරුවන්න එපා.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Secure Clean Water & Meds', si: 'පිරිසිදු ජලය හා බෙහෙත් සුරක්ෂිත කරන්න' },
        description: {
          en: 'Seal drinking water containers and place daily prescription medicines into a waterproof ziplock bag.',
          si: 'පානීය ජල බහාලුම් හොඳින් වසා, දෛනික ඖෂධ ජලයට ඔරොත්තු දෙන බෑගයක බහාලන්න.'
        },
        badge: { en: 'Prep', si: 'සූදානම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Cut Main Electrical Power', si: 'ප්‍රධාන විදුලි විසන්ධිය සිදුකරන්න' },
        description: {
          en: 'If safe to do so before water reaches waist level, switch off the home electrical distribution board.',
          si: 'ජලය නිවස තුළට පැමිණීමට පෙර ආරක්ෂිත නම් ප්‍රධාන විදුලි ස්විචය (Main Switch) ක්‍රියා විරහිත කරන්න.'
        },
        badge: { en: 'Safety', si: 'ආරක්ෂාව' }
      },
      {
        stepNumber: 3,
        title: { en: 'Evacuate via High Ground', si: 'උස් බිම් ඔස්සේ ඉවත් වන්න' },
        description: {
          en: 'Walk only on firm, designated higher routes. Avoid entering moving streams or drainage canals.',
          si: 'ස්ථාවර උස් මාර්ගවල පමණක් ගමන් කරන්න. ඇළ දොළ හෝ කානු අසලින් ගමන් කිරීමෙන් වළකින්න.'
        },
        badge: { en: 'Action', si: 'ක්‍රියාමාර්ගය' }
      },
      {
        stepNumber: 4,
        title: { en: 'Register at Relief Center', si: 'සහන මධ්‍යස්ථානයේ ලියාපදිංචි වන්න' },
        description: {
          en: 'Report to the Grama Niladhari or designated disaster relief camp officer to receive supplies and support.',
          si: 'ආහාර, නවාතැන් සහ සෞඛ්‍ය පහසුකම් ලබාගැනීමට ග්‍රාම නිලධාරී හෝ සහන කඳවුරු නිලධාරියා වෙත ලියාපදිංචි වන්න.'
        },
        badge: { en: 'Support', si: 'සහය' }
      }
    ],
    checklist: [
      {
        id: 'fl-1',
        text: { en: 'Minimum 3 liters of sealed drinking water per person', si: 'පුද්ගලයෙකුට අවම වශයෙන් ලීටර් 3ක මුද්‍රා තැබූ පානීය ජලය' },
        tip: { en: 'Crucial because flood water contaminates open dug wells', si: 'ගංවතුරෙන් සාමාන්‍ය ළිං අපවිත්‍ර වන බැවින් අත්‍යවශ්‍ය වේ' }
      },
      {
        id: 'fl-2',
        text: { en: 'Waterproof pouch with National Identity Card, deeds, bank books', si: 'ජාතික හැඳුනුම්පත, ඔප්පු සහ බැංකු පොත් සහිත ජල ආරක්ෂිත බෑගය' },
        tip: { en: 'Protects vital proof of identity for relief verification', si: 'රජයේ සහනාධාර ලබාගැනීමේදී අනන්‍යතාව තහවුරු කිරීමට අවශ්‍ය වේ' }
      },
      {
        id: 'fl-3',
        text: { en: 'Flashlight / Torch with extra dry cells', si: 'විදුලි පන්දම සහ අමතර වියළි බැටරි' },
        tip: { en: 'Grid power is systematically disconnected in flooded zones', si: 'ගංවතුර අවදානම් කලාපවල විදුලිය විසන්ධි කරන බැවින් අවශ්‍ය වේ' }
      },
      {
        id: 'fl-4',
        text: { en: 'Essential prescription medicines for at least 5 days', si: 'අවම වශයෙන් දින 5කට සෑහෙන දෛනික ඖෂධ' },
        tip: { en: 'Includes blood pressure, diabetes, and asthma inhalers', si: 'දියවැඩියාව, අධික රුධිර පීඩනය සහ ඇදුම රෝගීන් සඳහා' }
      }
    ],
    whenToSeekHelp: {
      en: 'Call emergency authorities immediately if water levels are rising rapidly around your home, if elderly/infants/pregnant individuals are trapped, or if someone is injured or bitten by a snake. Dial 117 for DMC or 1990 for medical evacuation.',
      si: 'ඔබේ නිවස වටා ජල මට්ටම වේගයෙන් ඉහළ යන්නේ නම්, වැඩිහිටියන්, කුඩා දරුවන් හෝ ගර්භනී මව්වරුන් සිරවී ඇත්නම්, නැතහොත් සර්ප දෂ්ටනයක් හෝ තුවාලයක් සිදුවුවහොත් වහාම 117 (DMC) හෝ 1990 (සුවසැරිය) අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Disaster Management Centre (DMC)', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: '24/7 National Disaster Emergency Hotline', si: 'පැය 24 පුරා ක්‍රියාත්මක ජාතික ආපදා හදිසි ඇමතුම් සේවාව' }
      },
      {
        name: { en: '1990 Suwa Seriya Ambulance', si: '1990 සුවසැරිය ගිලන්රථ සේවාව' },
        number: '1990',
        description: { en: 'Toll-free pre-hospital medical emergency care', si: 'නොමිලේ ක්‍රියාත්මක රෝහල් පූර්ව හදිසි වෛද්‍ය ප්‍රතිකාර සේවාව' }
      }
    ]
  },
  {
    id: 'landslide-safety',
    categoryType: 'geological',
    image: '/illustrations/landslide-safety.webp',
    imageAlt: {
      en: 'Sri Lankan hill-country villagers observing slope cracks and evacuating safely to designated safe assembly point',
      si: 'කඳු බෑවුම්වල පැලුම් නිරීක්ෂණය කරමින් ආරක්ෂිත රැස්වීම් ස්ථාන කරා ඉවත් වන ශ්‍රී ලාංකික ගැමියන්'
    },
    title: {
      en: 'Landslide Safety',
      si: 'නායයෑම් ආරක්ෂාව'
    },
    shortDescription: {
      en: 'Recognize early warning signs on slopes, respect NBRO evacuation alerts, avoid unstable cuts, and safely move to designated safe grounds.',
      si: 'බෑවුම්වල මතු වන පූර්ව අනතුරු ඇඟවීමේ ලක්ෂණ හඳුනාගැනීම, ජාතික ගොඩනැගිලි පර්යේෂණ සංවිධානයේ (NBRO) උපදෙස් පිළිපැදීම සහ ආරක්ෂිත ස්ථාන කරා ඉවත් වීම.'
    },
    introduction: {
      en: 'Heavy rainfall in mountainous districts (Ratnapura, Kegalle, Kandy, Nuwara Eliya, Badulla, Kalutara, Matara, Galle) can saturate soil and trigger catastrophic landslides. Recognizing ground movement signs and obeying NBRO red alerts saves lives.',
      si: 'කඳුකර දිස්ත්‍රික්කවල (රත්නපුර, කෑගල්ල, මහනුවර, නුවරඑළිය, බදුල්ල, කළුතර ආදී) අධික වර්ෂාව පස බුරුල් කර මහා නායයෑම් ඇති කළ හැකිය. බිම් සලකුණු හඳුනාගැනීම සහ NBRO රතු නිවේදන පිළිපැදීම ජීවිත බේරාගැනීමට තීරණාත්මක වේ.'
    },
    urgencyLevel: 'Critical',
    tags: {
      en: ['landslide', 'slope', 'nbro', 'hill country', 'earth slip', 'cracks', 'mudflow', 'mountain'],
      si: ['නායයෑම්', 'බෑවුම්', 'කඳුකරය', 'පස් කඳු කඩාවැටීම', 'පැළීම්', 'ජාතික ගොඩනැගිලි පර්යේෂණ', 'ඉවත් වීම']
    },
    beforeStage: {
      heading: {
        en: 'Before a Landslide (Warning Signs & Preparation)',
        si: 'නායයෑමට පෙර (පූර්ව අනතුරු ඇඟවීම් සහ සූදානම)'
      },
      steps: [
        {
          en: 'Inspect your property for new cracks appearing in floors, walls, retaining walls, or on the ground.',
          si: 'නිවසේ බිත්ති, බිම, ආධාරක බැමි හෝ මිදුලේ අලුතින් ඇතිවන පැලුම් නිරීක්ෂණය කරන්න.'
        },
        {
          en: 'Notice tilting of utility poles, trees, or fences on sloping land.',
          si: 'බෑවුම්වල පිහිටි ගස්, විදුලි කණු හෝ වැටවල් එක පැත්තකට ඇලවීම කෙරෙහි අවධානය යොමු කරන්න.'
        },
        {
          en: 'Watch for sudden muddy water bubbling up from the ground or springs drying up abruptly.',
          si: 'පොළවෙන් හදිසියේ මඩ සහිත ජල උල්පත් මතුවීම හෝ සාමාන්‍ය දිය උල්පත් එකවර සිඳී යාම නිරීක්ෂණය කරන්න.'
        },
        {
          en: 'Prepare to evacuate immediately whenever rainfall in 24 hours exceeds 100mm–150mm in slope hazard zones.',
          si: 'නායයෑම් අවදානම් ප්‍රදේශවල පැය 24ක් තුළ මිලිමීටර් 100-150 ඉක්මවූ වර්ෂාවක් පවතින විට වහාම ඉවත් වීමට සූදානම් වන්න.'
        }
      ]
    },
    duringStage: {
      heading: {
        en: 'During a Landslide (Immediate Action)',
        si: 'නායයෑමක් සිදුවන අවස්ථාවේ (ක්ෂණික ක්‍රියාමාර්ග)'
      },
      steps: [
        {
          en: 'Evacuate immediately upon hearing rumbling sounds, cracking trees, or when an NBRO Red Alert is issued.',
          si: 'පොළව යටින් ගොරවන ශබ්ද, ගස් කැඩී යන ශබ්ද ඇසෙන විට හෝ NBRO රතු අනතුරු ඇඟවීමක් ලැබුණු වහාම ඉවත් වන්න.'
        },
        {
          en: 'Move across or away from the path of the slide toward stable, flat, or ridgeline ground. Never run downhill ahead of the debris.',
          si: 'නායයන මාර්ගයට හරස් අතට හෝ ස්ථාවර කඳු මුදුනක් දෙසට යන්න. කිසිවිටෙකත් නායයන පස් තට්ටුව ඉදිරියෙන් පහළට නොදුවන්න.'
        },
        {
          en: 'Alert immediate neighbours as you evacuate without delaying your own safe exit.',
          si: 'ඔබේ ආරක්ෂිත ගමන ප්‍රමාද නොකරමින්, හැකි පමණ අසල්වාසීන්ටද අනතුරු අඟවා ඉවත් වන්න.'
        },
        {
          en: 'Curl into a tight ball and protect your head if escape is impossible before impact.',
          si: 'පිටවීමට නොහැකි හදිසි අවස්ථාවකදී හිස දෑතින් ආවරණය කරගෙන හැකි තරම් ගුලි වී ආරක්ෂා වන්න.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'After a Landslide (Safety Verification)',
        si: 'නායයෑමෙන් පසු (ආරක්ෂාව තහවුරු කරගැනීම)'
      },
      steps: [
        {
          en: 'Do not return to affected homes. Secondary landslides often occur after the main slip while rain continues.',
          si: 'බලපෑමට ලක්වූ නිවෙස්වලට ආපසු නොයන්න. වර්ෂාව පවතින විට දෙවන හා තෙවන නායයෑම් සිදුවීමේ දැඩි අවදානමක් ඇත.'
        },
        {
          en: 'Stay away from slide boundaries and steep soil cut slopes.',
          si: 'නායගිය ප්‍රදේශයේ සීමාවලින් සහ කැපූ බෑවුම්වලින් ආරක්ෂිතව ඈත්ව සිටින්න.'
        },
        {
          en: 'Report trapped or missing community members to the Disaster Management Centre and local police immediately.',
          si: 'පස්වලට යටවූ හෝ අතුරුදහන් වූ පුද්ගලයන් පිළිබඳව වහාම DMC සහ පොලිසිය වෙත දන්වන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Obey NBRO evacuation advisories without waiting for visible slope failure.',
        si: 'නායයෑම පියවි ඇසට පෙනෙන තුරු නොසිට, NBRO ඉවත් වීමේ නිවේදන වහාම පිළිපදින්න.'
      },
      {
        en: 'Relocate to safe community centers or relatives on flat terrain during heavy rain.',
        si: 'අධික වැසි ඇති විට තැනිතලා ප්‍රදේශවල පිහිටි ආරක්ෂිත මධ්‍යස්ථාන හෝ ඥාති නිවෙස් වෙත යන්න.'
      },
      {
        en: 'Clear roof gutters and surface drainage channels before monsoon seasons.',
        si: 'මෝසම් වැසි ආරම්භයට පෙර නිවසේ කාණු සහ ජලය බැස යන මාර්ග පිරිසිදු කර තබන්න.'
      }
    ],
    donts: [
      {
        en: 'Do not excavate steep hill slopes without geotechnical clearance from NBRO.',
        si: 'NBRO ආයතනයේ පූර්ව අනුමැතියකින් තොරව කඳු බෑවුම් කැපීම සිදු නොකරන්න.'
      },
      {
        en: 'Do not block natural water gullies or divert heavy runoff into unstable soil banks.',
        si: 'ස්වාභාවික ජල මාර්ග අවහිර කිරීම හෝ ජල ධාරා ලිහිල් පස් බැමි දෙසට හරවා යැවීම නොකරන්න.'
      },
      {
        en: 'Do not sleep in rooms facing the uphill cut slope during continuous torrential rainfall.',
        si: 'අඛණ්ඩ ධාරානිපාත වැසි ඇති රාත්‍රී කාලයේදී කඳු බෑවුමට මුහුණලා ඇති කාමරවල නිදා නොගන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Inspect Slope Cracks', si: 'පැළීම් පරීක්ෂා කරන්න' },
        description: {
          en: 'Look for widening ground fissures, tilting boundary posts, or water seepage along slopes.',
          si: 'පොළවේ ඉරිතැලීම්, වැට කණු ඇලවීම් හෝ පසෙන් ජලය කාන්දු වීම් නිරීක්ෂණය කරන්න.'
        },
        badge: { en: 'Inspect', si: 'නිරීක්ෂණය' }
      },
      {
        stepNumber: 2,
        title: { en: 'Heed NBRO Red Alerts', si: 'NBRO රතු නිවේදන පිළිපදින්න' },
        description: {
          en: 'Level 3 Red Alerts signify imminent danger. Evacuate immediately without hesitating.',
          si: 'තෙවන මට්ටමේ (Level 3) රතු අනතුරු ඇඟවීම යනු ක්ෂණික ඉවත් වීමයි. කිසිදු ප්‍රමාදයකින් තොරව පිටවන්න.'
        },
        badge: { en: 'Alert', si: 'අනතුරු ඇඟවීම' }
      },
      {
        stepNumber: 3,
        title: { en: 'Evacuate Laterally', si: 'හරස් අතට ඉවත් වන්න' },
        description: {
          en: 'Move sideways away from the debris chute to stable ridges rather than downhill.',
          si: 'පහළට දිවීම වෙනුවට නායයන මාර්ගයෙන් ඉවතට හරස් අතට ස්ථාවර බිමකට යන්න.'
        },
        badge: { en: 'Evacuate', si: 'ඉවත් වීම' }
      }
    ],
    checklist: [
      {
        id: 'ls-1',
        text: { en: 'NBRO emergency contact details saved on phone', si: 'NBRO සහ ආපදා කළමනාකරණ අංක දුරකථනයේ සටහන් කරගැනීම' },
        tip: { en: 'Dial 011 258 8946 for National Building Research Organisation', si: 'ජාතික ගොඩනැගිලි පර්යේෂණ සංවිධානය: 011 258 8946' }
      },
      {
        id: 'ls-2',
        text: { en: 'Safe pre-identified shelter location outside landslide hazard map zone', si: 'නායයෑම් සිතියම් කලාපයෙන් පිටත පෙර හඳුනාගත් ආරක්ෂිත නවාතැනක්' },
        tip: { en: 'Check your village hazard mapping with Grama Niladhari', si: 'ඔබේ ගමේ නායයෑම් අවදානම් සිතියම ග්‍රාම නිලධාරීගෙන් විමසන්න' }
      }
    ],
    whenToSeekHelp: {
      en: 'Contact the National Building Research Organisation (NBRO) or DMC 117 immediately if you observe new ground cracks exceeding 1 inch, sudden ground subsidence, or water gushing from dry embankments.',
      si: 'අඟලකට වඩා පළල් බිම් පැලුම්, පොළව ගිලාබැසීම් හෝ වියළි පස් බැමිවලින් හදිසියේ ජලය කාන්දු වීම් දුටුවහොත් වහාම NBRO (011 258 8946) හෝ DMC 117 අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'NBRO Landslide Disaster Division', si: 'ජාතික ගොඩනැගිලි පර්යේෂණ සංවිධානය (NBRO)' },
        number: '011 258 8946',
        description: { en: 'Official Landslide Early Warning and Risk Assessment', si: 'නිල නායයෑම් පූර්ව අනතුරු ඇඟවීම් සහ අවදානම් තක්සේරු අංශය' }
      },
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: 'National Emergency Response Line', si: 'ජාතික හදිසි ආපදා ඇමතුම් සේවාව' }
      }
    ]
  },
  {
    id: 'cyclone-safety',
    categoryType: 'weather',
    image: '/illustrations/cyclone-safety.webp',
    imageAlt: {
      en: 'Family sheltering safely inside an interior room away from windows during a severe cyclone',
      si: 'දැඩි සුළි කුණාටුවක් පවතින අවස්ථාවේ ජනෙල්වලින් ඈත්ව නිවසේ ඇතුළත ආරක්ෂිත කාමරයක රැඳී සිටින පවුලක්'
    },
    title: {
      en: 'Cyclone & Strong Winds',
      si: 'සුළි කුණාටු සහ තද සුළං'
    },
    shortDescription: {
      en: 'Stay in a sturdy enclosed building away from windows, secure loose outdoor objects beforehand, and follow official meteorological alerts.',
      si: 'වීදුරු ජනෙල්වලින් ඈත්ව ශක්තිමත් ගොඩනැගිල්ලක් තුළ රැඳී සිටින්න, එළිමහන් බඩුබාහිරාදිය කල්තියා සුරක්ෂිත කරන්න සහ නිල කාලගුණ වාර්තාවන්ට සවන් දෙන්න.'
    },
    introduction: {
      en: 'Cyclones in the Bay of Bengal can bring destructive gale-force winds exceeding 100 km/h, torrential rains, and dangerous storm surges. Protecting your home and remaining safely indoors during the peak of the storm is essential.',
      si: 'බෙංගාල බොක්ක ආශ්‍රිතව හටගන්නා සුළි කුණාටු මගින් පැයට කිලෝමීටර් 100 ඉක්මවන ප්‍රචණ්ඩ සුළං, ධාරානිපාත වැසි සහ රළ ඇතිවිය හැකිය. කුණාටුව පවතින විට නිවෙස් සුරක්ෂිත කරමින් ඇතුළත රැඳී සිටීම අතිශය වැදගත් වේ.'
    },
    urgencyLevel: 'High',
    tags: {
      en: ['cyclone', 'storm', 'wind', 'gale', 'weather', 'meteorology', 'roof', 'coastal'],
      si: ['සුළි කුණාටු', 'තද සුළං', 'කාලගුණය', 'කුණාටුව', 'වෙරළබඩ', 'වහල', 'සුළං අවදානම']
    },
    beforeStage: {
      heading: {
        en: 'Before the Cyclone (Securing Your Home)',
        si: 'සුළි කුණාටුවට පෙර (නිවස සුරක්ෂිත කිරීම)'
      },
      steps: [
        {
          en: 'Fasten loose roof sheets with tie-wire or sandbags, and trim weak branches hovering over your house.',
          si: 'ලිහිල් වහල තහඩු කම්බි හෝ වැලි කොට්ට මගින් සවිමත් කරන්න; නිවසට ඉහළින් ඇති අනතුරුදායක ගස් අතු කපා ඉවත් කරන්න.'
        },
        {
          en: 'Bring outdoor items inside (potted plants, metal sheets, outdoor furniture) that can turn into flying projectiles in heavy winds.',
          si: 'තද සුළඟට ගසාගෙන ගොස් අනතුරු ඇති කළ හැකි මල් පෝච්චි, ටකරන් සහ එළිමහන් පුටු මේස නිවස තුළට ගන්න.'
        },
        {
          en: 'Securely close and latch all exterior shutters, doors, and windows.',
          si: 'සියලුම ජනෙල්, දොරවල් සහ ජනේල පියන් හොඳින් වසා අගුළු දමන්න.'
        },
        {
          en: 'Fill bathtubs and clean buckets with clean water in case municipal water mains are compromised.',
          si: 'ප්‍රධාන ජල සැපයුම් බිඳවැටීමට ඉඩ ඇති බැවින් පිරිසිදු භාජනවලට ජලය පුරවා තබාගන්න.'
        }
      ]
    },
    duringStage: {
      heading: {
        en: 'During the Cyclone (Sheltering Safely)',
        si: 'කුණාටුව පවතින අවස්ථාවේ (ආරක්ෂිතව රැඳී සිටීම)'
      },
      steps: [
        {
          en: 'Stay in the strongest, central room of the house (such as an interior hallway or bathroom) away from external windows.',
          si: 'පිටත ජනෙල්වලින් ඈත්ව, නිවසේ වඩාත්ම ශක්තිමත් මැද කාමරයක හෝ කොරිඩෝවක රැඳී සිටින්න.'
        },
        {
          en: 'Do not go outside during the "eye" of the cyclone when winds calm temporarily; winds will reverse violently shortly after.',
          si: 'සුළඟ තාවකාලිකව නැවතෙන කුණාටුවේ මධ්‍ය ලක්ෂ්‍යයේදී (Eye of the storm) කිසිවිටෙකත් එළියට නොයන්න; සුළු මොහොතකින් විරුද්ධ දිශාවෙන් ප්‍රචණ්ඩ සුළං හමනු ඇත.'
        },
        {
          en: 'Listen continuously to weather reports on a battery-powered radio for official updates.',
          si: 'නිල උපදෙස් ලබාගැනීම සඳහා බැටරි මගින් ක්‍රියාකරන රේඩියෝවකට සවන් දෙන්න.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'After the Cyclone (Post-Storm Caution)',
        si: 'කුණාටුව පහව ගිය පසු (පශ්චාත් විමසිලිමත් බව)'
      },
      steps: [
        {
          en: 'Beware of fallen power lines on roads and puddles. Treat all downed wires as live and deadly.',
          si: 'මාර්ගවල වැටී ඇති විදුලි රැහැන්වලින් ඈත්ව සිටින්න. සියලුම බිම වැටුණු රැහැන් සක්‍රීය විදුලිය සහිත යැයි සලකන්න.'
        },
        {
          en: 'Check for gas leaks and electrical damages before lighting lamps or turning on breakers.',
          si: 'පහන් දැල්වීමට හෝ ස්විච ක්‍රියාත්මක කිරීමට පෙර ගෑස් කාන්දුවීම් හෝ විදුලි රැහැන් හානි තිබේදැයි පරීක්ෂා කරන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Board up or tape large glass windows in crisscross fashion to reduce flying shards.',
        si: 'වීදුරු ජනෙල්වලට ආරක්ෂිත ටේප් අලවා හෝ ලෑලි ගසා වීදුරු කැබලි විසිරී යාම වළක්වන්න.'
      },
      {
        en: 'Keep emergency torches and power banks fully charged in advance.',
        si: 'විදුලි පන්දම් සහ පවර් බෑන්ක් කල්තියාම සම්පූර්ණයෙන් ආරෝපණය කර තබාගන්න.'
      }
    ],
    donts: [
      {
        en: 'Do not go to the beach or harbor to watch high waves or storm surge.',
        si: 'මුහුදු රළ හෝ කුණාටුව නැරඹීමට කිසිවිටෙකත් වෙරළට හෝ වරායට නොයන්න.'
      },
      {
        en: 'Do not seek shelter under metal sheds, zinc roof awnings, or solitary large trees.',
        si: 'ටකරන් මඩු, ලෑලි මඩු හෝ හුදකලා විශාල ගස් යට ආරක්ෂාව නොපතන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Fasten Roofing', si: 'වහලය සවිමත් කරන්න' },
        description: {
          en: 'Anchor roofing sheets tightly and trim dangerous overhanging tree branches.',
          si: 'වහල තහඩු තදින් සවි කර, අනතුරුදායක ගස් අතු කපා ඉවත් කරන්න.'
        },
        badge: { en: 'Secure', si: 'සුරක්ෂිත කිරීම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Retreat to Center Room', si: 'මැද කාමරයට යන්න' },
        description: {
          en: 'Gather the whole family in an interior room shielded from window glass.',
          si: 'වීදුරු ජනෙල් නොමැති නිවසේ ඇතුළත ආරක්ෂිත කාමරයකට පවුලේ සැම එක්රැස් වන්න.'
        },
        badge: { en: 'Shelter', si: 'නවාතැන' }
      },
      {
        stepNumber: 3,
        title: { en: 'Listen to Alerts', si: 'නිවේදනවලට සවන් දෙන්න' },
        description: {
          en: 'Keep tuned to local radio until the Department of Meteorology signals all clear.',
          si: 'කාලගුණ විද්‍යා දෙපාර්තමේන්තුව නිල වශයෙන් අවදානම පහව ගිය බව දන්වන තුරු රේඩියෝවට සවන් දෙන්න.'
        },
        badge: { en: 'Monitor', si: 'අවධානය' }
      }
    ],
    checklist: [
      {
        id: 'cy-1',
        text: { en: 'Portable AM/FM radio with spare dry cell batteries', si: 'අමතර බැටරි සහිත අතේ ගෙන යා හැකි රේඩියෝවක්' },
        tip: { en: 'Essential when cellular towers and power grids fail', si: 'දුරකථන කුළුණු සහ විදුලිය බිඳවැටෙන විට ඉතා වැදගත් වේ' }
      },
      {
        id: 'cy-2',
        text: { en: 'Sturdy ropes, nails, and hammer to secure shutters', si: 'දොර ජනෙල් සවි කිරීමට ශක්තිමත් ලණු, ඇණ සහ මිටියක්' },
        tip: { en: 'For emergency repairs before high winds arrive', si: 'කුණාටුවට පෙර හදිසි අලුත්වැඩියාවන් සඳහා' }
      }
    ],
    whenToSeekHelp: {
      en: 'If your roof is compromised or walls are threatened, stay low under sturdy furniture and call 117 for rescue coordination as soon as safe transmission is possible.',
      si: 'වහලය ගැලවී ගියහොත් හෝ බිත්ති කඩාවැටීමේ අවදානමක් ඇත්නම්, ශක්තිමත් මේසයක් යටට වී ආරක්ෂා වන අතරතුර 117 ආපදා සේවාව අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Department of Meteorology', si: 'කාලගුණ විද්‍යා දෙපාර්තමේන්තුව' },
        number: '011 268 6499',
        description: { en: 'Severe weather forecasts and tropical cyclone bulletins', si: 'දැඩි කාලගුණ අනතුරු ඇඟවීම් සහ සුළි කුණාටු නිවේදන' }
      },
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: '24/7 National Emergency Hotline', si: 'පැය 24 පුරා ජාතික හදිසි ඇමතුම් සේවාව' }
      }
    ]
  },
  {
    id: 'earthquake-safety',
    categoryType: 'geological',
    image: '/illustrations/earthquake-safety.webp',
    imageAlt: {
      en: 'Father and child demonstrating Drop, Cover, and Hold On beneath a sturdy table during an earthquake',
      si: 'භූමිකම්පාවක් අතරතුර ශක්තිමත් මේසයක් යට හිස ආවරණය කරමින් ආරක්ෂා වන පියෙකු සහ දරුවෙකු'
    },
    title: {
      en: 'Earthquake Safety',
      si: 'භූමිකම්පා ආරක්ෂාව'
    },
    shortDescription: {
      en: 'Drop, Cover, and Hold On beneath sturdy furniture, protect head and neck, avoid exterior walls and glass windows.',
      si: 'ශක්තිමත් මේසයක් යටට බිම වැතිරී (Drop), ආවරණය වී (Cover), අල්ලාගෙන සිටින්න (Hold On). හිස සහ බෙල්ල ආරක්ෂා කරගනිමින් ජනෙල්වලින් ඈත්ව සිටින්න.'
    },
    introduction: {
      en: 'While major earthquakes are rare in Sri Lanka, intra-plate tremors and regional seismic activity in the Indian Ocean can cause shaking. Knowing the universal "Drop, Cover, and Hold On" drill prevents injuries from falling objects and glass.',
      si: 'ශ්‍රී ලංකාව තුළ ප්‍රබල භූමිකම්පා දුර්ලභ වුවද, ඉන්දියන් සාගර කලාපයේ භූ කම්පන නිසා ඇතිවන කම්පන අත්විඳිය හැකිය. විශ්වීය "Drop, Cover, Hold On" ක්‍රමය පුරුදු වීමෙන් වැටෙන සුන්බුන් හා වීදුරුවලින් සිදුවන තුවාල වළක්වා ගත හැකිය.'
    },
    urgencyLevel: 'Medium',
    tags: {
      en: ['earthquake', 'tremor', 'drop cover hold', 'seismic', 'shaking', 'structural'],
      si: ['භූමිකම්පා', 'කම්පන', 'ආරක්ෂාව', 'හිස ආරක්ෂා කිරීම', 'මේසය යටට යාම']
    },
    duringStage: {
      heading: {
        en: 'During Shaking (Drop, Cover, Hold On)',
        si: 'කම්පනය සිදුවන අවස්ථාවේ (Drop, Cover, Hold On)'
      },
      steps: [
        {
          en: 'DROP down onto your hands and knees immediately before the tremor knocks you down.',
          si: 'කම්පනයෙන් ඔබව බිම ඇදවැටීමට පෙර වහාම බිමට පාත් වී දණගසා ගන්න (DROP).'
        },
        {
          en: 'COVER your head and neck beneath a sturdy table or desk. If no shelter is nearby, cover head with your arms against an interior wall.',
          si: 'ශක්තිමත් මේසයක් යටට ගොස් ඔබේ හිස සහ බෙල්ල ආවරණය කරගන්න (COVER). මේසයක් නොමැති නම් ඇතුළත බිත්තියකට හේත්තු වී දෑතින් හිස ආවරණය කරගන්න.'
        },
        {
          en: 'HOLD ON to your shelter until the shaking completely stops. Be prepared to move with the table if it shifts.',
          si: 'කම්පනය සම්පූර්ණයෙන්ම නතර වන තුරු මේස කකුලක් තදින් අල්ලාගෙන සිටින්න (HOLD ON).'
        },
        {
          en: 'If outdoors, move into an open area away from power lines, buildings, glass facades, and streetlights.',
          si: 'ඔබ එළිමහනේ සිටී නම්, ගොඩනැගිලි, විදුලි කණු සහ වීදුරු ජනෙල්වලින් ඈත්ව විවෘත බිමකට යන්න.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'After the Shaking Stops (Evacuation & Checks)',
        si: 'කම්පනය නතර වූ පසු (පරීක්ෂා කිරීම් සහ ඉවත් වීම)'
      },
      steps: [
        {
          en: 'Check yourself and others for injuries. Administer basic first-aid if trained.',
          si: 'ඔබට හෝ අන් අයට තුවාල සිදුවී ඇත්දැයි පරීක්ෂා කර මූලික ප්‍රථමාධාර ලබාදෙන්න.'
        },
        {
          en: 'Exit the building using stairs. NEVER use elevators during or following seismic events.',
          si: 'පඩිපෙළ භාවිතා කරමින් සෙමෙන් එළිමහනට යන්න. කිසිවිටෙකත් විදුලි සෝපාන (Lifts) භාවිතා නොකරන්න.'
        },
        {
          en: 'Be prepared for aftershocks which can follow initial tremors.',
          si: 'ප්‍රධාන කම්පනයෙන් පසු ඇතිවිය හැකි පසුකම්පන (Aftershocks) පිළිබඳ සූදානමින් සිටින්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Anchor tall bookcases, heavy mirrors, and overhead ceiling fans securely in your home.',
        si: 'නිවසේ උස් පොත් රාක්ක, විශාල කණ්ණාඩි සහ සිවිලිං පංකා බිත්තිවලට තදින් සවි කර තබන්න.'
      },
      {
        en: 'Protect your face and head with a pillow or book if caught in bed.',
        si: 'ඇඳ මත සිටින විට කම්පනයක් දැනුනහොත් කොට්ටයකින් හිස සහ මුහුණ ආවරණය කරගන්න.'
      }
    ],
    donts: [
      {
        en: 'Do not rush outside while shaking is actively occurring due to falling brickwork and glass.',
        si: 'කම්පනය සිදුවන අතරතුර කලබලයෙන් පිටතට නොදුවන්න; ගොඩනැගිලි කොටස් සහ වීදුරු හිස මතට පතිත විය හැකිය.'
      },
      {
        en: 'Do not stand beneath doorways; modern doorways are not reinforced and do not provide protection.',
        si: 'දොර උළුවහු යට නොසිටින්න; නවීන දොරවල් මේසයක් තරම් ආරක්ෂාවක් ලබා නොදේ.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'DROP', si: 'බිමට පාත් වන්න (DROP)' },
        description: {
          en: 'Get down on hands and knees to avoid being knocked down.',
          si: 'කම්පනයෙන් ඇදවැටීම වැළැක්වීමට දෑත් සහ දණහිස් මත බිමට පාත් වන්න.'
        },
        badge: { en: 'Step 1', si: 'පියවර 1' }
      },
      {
        stepNumber: 2,
        title: { en: 'COVER', si: 'හිස ආවරණය කරන්න (COVER)' },
        description: {
          en: 'Crawl beneath a sturdy wooden table to protect your head, neck, and torso.',
          si: 'හිස, බෙල්ල සහ සිරුර ආරක්ෂා වන පරිදි ශක්තිමත් මේසයක් යටට යන්න.'
        },
        badge: { en: 'Step 2', si: 'පියවර 2' }
      },
      {
        stepNumber: 3,
        title: { en: 'HOLD ON', si: 'තදින් අල්ලාගන්න (HOLD ON)' },
        description: {
          en: 'Hold onto the table legs firmly with one hand while shielding eyes.',
          si: 'කම්පනය අවසන් වන තුරු මේස කකුලක් තදින් අල්ලාගෙන සිටින්න.'
        },
        badge: { en: 'Step 3', si: 'පියවර 3' }
      }
    ],
    checklist: [
      {
        id: 'eq-1',
        text: { en: 'Heavy wall hangings anchored away from beds and sofas', si: 'ඇඳන් හා සෝෆාවලට ඉහළින් බර පින්තූර රාමු නොතැබීම' },
        tip: { en: 'Prevents direct injury during sleep tremors', si: 'නිදා සිටින විට ඇතිවන කම්පනවලදී අනතුරු වළක්වයි' }
      }
    ],
    whenToSeekHelp: {
      en: 'If structural cracks appear across load-bearing pillars or beams, evacuate immediately and contact local municipal engineers or DMC 117 before re-entry.',
      si: 'ගොඩනැගිල්ලේ කොන්ක්‍රීට් කණු හෝ බාල්කවල බරපතල පැලුම් ඇතිවුවහොත්, වහාම එළිමහනට පැමිණ DMC 117 හෝ නාගරික ඉංජිනේරුවන් අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Geological Survey and Mines Bureau (GSMB)', si: 'භූ විද්‍යා සමීක්ෂණ සහ පතල් කාර්යාංශය' },
        number: '011 288 6289',
        description: { en: 'National Seismic Data and Earthquake Monitoring Center', si: 'ජාතික භූ කම්පන දත්ත සහ නිරීක්ෂණ මධ්‍යස්ථානය' },
      },
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: '24/7 National Emergency Hotline', si: 'පැය 24 පුරා ජාතික හදිසි ඇමතුම් සේවාව' }
      }
    ]
  },
  {
    id: 'fire-safety',
    categoryType: 'fire',
    image: '/illustrations/fire-safety.webp',
    imageAlt: {
      en: 'Family crawling low under smoke to exit safely outdoors while one adult calls fire emergency 110',
      si: 'දුමෙන් බේරීමට බිම දිගේ බඩගා යමින් නිවසින් පිටවන පවුලක් සහ 110 ගිනි නිවීමේ සේවාව අමතන පුද්ගලයෙක්'
    },
    title: {
      en: 'Fire Safety',
      si: 'ගිනි අනතුරු ආරක්ෂාව'
    },
    shortDescription: {
      en: 'Crawl low under smoke to exit immediately, never re-enter a burning building, assemble at a safe point and call 110 immediately.',
      si: 'දුමෙන් බේරීමට බිම දිගේ බඩගා යමින් වහාම පිටවන්න, කිසිවිටෙකත් නැවත දැවෙන ගොඩනැගිල්ල තුළට නොයන්න. වහාම 110 ගිනි නිවීමේ සේවාව අමතන්න.'
    },
    introduction: {
      en: 'Domestic fires can engulf a room within two to three minutes. Toxic smoke and gases kill far more people than flames. Reacting swiftly, staying below the smoke layer, and knowing when to call the fire brigade ensures household survival.',
      si: 'ගෘහස්ථ ගිනි අනතුරක් විනාඩි දෙක තුනක් ඇතුළත මුළු කාමරය පුරා පැතිර යා හැකිය. ගින්නට වඩා විෂ දුම ආශ්වාස වීමෙන් ජීවිත හානි සිදුවේ. දුමෙන් බේරී බිම දිගේ පිටවීම සහ වහාම ගිනි නිවන හමුදාව ඇමතීම අත්‍යවශ්‍ය වේ.'
    },
    urgencyLevel: 'Critical',
    tags: {
      en: ['fire', 'smoke', 'evacuation', '110', 'burns', 'crawl low', 'extinguisher', 'flame'],
      si: ['ගිනි අනතුරු', 'දුම', 'ඉවත් වීම', '110', 'ගිනි නිවීම', 'පිළිස්සුම්', 'ගින්න']
    },
    duringStage: {
      heading: {
        en: 'During a Fire (Immediate Escape)',
        si: 'ගින්නක් හටගත් අවස්ථාවේ (ක්ෂණික පිටවීම)'
      },
      steps: [
        {
          en: 'Alert everyone in the house by shouting "Fire! Fire!" and exit immediately. Do not stop to collect belongings.',
          si: '"ගින්නක්! ගින්නක්!" යැයි කෑගසා නිවසේ සැම දැනුවත් කර වහාම පිටවන්න. බඩු බාහිරාදිය ගැනීමට ප්‍රමාද නොවන්න.'
        },
        {
          en: 'Crawl low on hands and knees beneath the rising smoke layer. Cleaner, cooler air is found near the floor.',
          si: 'ඉහළට නගින දුමෙන් බේරීමට බිම දිගේ දණගාමින් යන්න. බිමට ආසන්නයේ පිරිසිදු වාතය පවතී.'
        },
        {
          en: 'Feel door handles with the back of your hand before opening. If hot, do NOT open; find an alternative window or exit.',
          si: 'දොරක් විවෘත කිරීමට පෙර දොර අගුල පිට අල්ලෙන් අල්ලා බලන්න. එය රත්වී ඇත්නම් දොර නොඅරින්න; වෙනත් මාර්ගයක් තෝරාගන්න.'
        },
        {
          en: 'Close doors behind you as you escape to slow the spread of oxygen and fire.',
          si: 'ඔබ පිටවන විට කාමර දොරවල් වසා දමන්න; එය ගින්නට ඔක්සිජන් ලැබීම සහ පැතිරීම පාලනය කරයි.'
        },
        {
          en: 'Once outside, stay outside. NEVER re-enter a burning building for pets or possessions.',
          si: 'පිටතට පැමිණි පසු කිසිවිටෙකත් නැවත නිවස තුළට නොයන්න. සුරතල් සතුන් හෝ දේපළ සඳහා නැවත ඇතුළු වීම මාරාන්තිකයි.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'Outside Safety & Calling for Help',
        si: 'පිටතට පැමිණි පසු සහ සහය ලබාගැනීම'
      },
      steps: [
        {
          en: 'Gather at your designated family assembly point away from the building.',
          si: 'ගොඩනැගිල්ලෙන් ඈත්ව කලින් තීරණය කරගත් පවුලේ රැස්වීම් ස්ථානයට යන්න.'
        },
        {
          en: 'Dial 110 immediately for Municipal Fire & Rescue, and 1990 for medical burn emergencies.',
          si: 'වහාම 110 ගිනි නිවීමේ සේවාව සහ 1990 සුවසැරිය ගිලන්රථ සේවාව අමතන්න.'
        },
        {
          en: 'Cool any minor burns with clean, running cool tap water for 10–20 minutes. Do not apply toothpaste, butter, or ice.',
          si: 'සුළු පිළිස්සුම් සඳහා විනාඩි 10-20ක් පිරිසිදු සිසිල් ජලය වක්කරන්න. දන්තාලේප (Toothpaste), බටර් හෝ අයිස් නොතවන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'If clothing catches fire, Stop, Drop to the ground, and Roll back and forth until flames are smothered.',
        si: 'ඇඳුම්වල ගිනි ඇවිළුනහොත්, නතර වන්න (Stop), බිම පෙරළෙන්න (Drop & Roll) - ගින්න නිවෙන තුරු එහා මෙහා පෙරළෙන්න.'
      },
      {
        en: 'Install a certified dry-chemical powder fire extinguisher near the kitchen and know how to operate it (PASS: Pull, Aim, Squeeze, Sweep).',
        si: 'මුළුතැන්ගෙය අසල ගිනි නිවන උපකරණයක් (Fire Extinguisher) තබාගෙන එය ක්‍රියාත්මක කරන අයුරු (PASS ක්‍රමය) දැන සිටින්න.'
      }
    ],
    donts: [
      {
        en: 'Never throw water on an oil or grease cooking fire; water vaporizes explosively and scatters burning oil.',
        si: 'තෙල් හෝ ගෑස් ලිපක ගින්නකට කිසිවිටෙකත් ජලය නොගසන්න; එයින් ගින්න පිපිරී විසිරී යයි. ලිප වසා තෙත රෙද්දකින් හෝ පියනකින් ආවරණය කරන්න.'
      },
      {
        en: 'Do not overload multiple electrical extension sockets with heavy appliances.',
        si: 'එක් විදුලි පේනුවකට අධික විදුලි උපකරණ ප්‍රමාණයක් සවි කර අධිභාර නොකරන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Crawl Low Below Smoke', si: 'දුමට යටින් බඩගා යන්න' },
        description: {
          en: 'Keep your nose and mouth within 30–50 cm of the floor to breathe clean oxygen.',
          si: 'පිරිසිදු වාතය ආශ්වාස කිරීම සඳහා බිමට ආසන්නව හිස තබාගෙන බඩගා යන්න.'
        },
        badge: { en: 'Escape', si: 'පිටවීම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Exit & Close Doors', si: 'පිටවී දොරවල් වසන්න' },
        description: {
          en: 'Shut interior doors behind your path to starve the fire of incoming fresh air.',
          si: 'ගින්න පැතිරීම වැළැක්වීමට පිටවන අතරතුර දොරවල් වසා දමන්න.'
        },
        badge: { en: 'Contain', si: 'පාලනය' }
      },
      {
        stepNumber: 3,
        title: { en: 'Call 110 Outside', si: 'පිටතදී 110 අමතන්න' },
        description: {
          en: 'Never pause inside to search for a phone; call from a safe neighbour or street location.',
          si: 'නිවස ඇතුළත දුරකථන සොයමින් නොසිට, ආරක්ෂිතව පිටතට පැමිණ 110 අමතන්න.'
        },
        badge: { en: 'Report', si: 'දැනුම් දීම' }
      }
    ],
    checklist: [
      {
        id: 'fr-1',
        text: { en: 'Kitchen fire blanket or certified ABC dry chemical extinguisher', si: 'මුළුතැන්ගෙයි ගිනි නිවන රෙදි කඩක් හෝ ABC ගිනි නිවන සිලින්ඩරයක්' },
        tip: { en: 'Effective for smothering small pan and electrical sparks early', si: 'මුල් අවස්ථාවේදීම කුඩා ගිනි නිවා දැමීමට උපකාරී වේ' }
      },
      {
        id: 'fr-2',
        text: { en: 'Two unblocked escape routes planned from every bedroom', si: 'සෑම නිදන කාමරයකින්ම පිටවිය හැකි අවහිර නොවූ මාර්ග දෙකක්' },
        tip: { en: 'Ensure window grilles have an operable emergency latch', si: 'ජනේල ග්‍රිල්වල හදිසි අගුලක් තිබීම තහවුරු කරගන්න' }
      }
    ],
    whenToSeekHelp: {
      en: 'Always call 110 immediately for any uncontained structure fire. Untrained citizens must never attempt to fight fires larger than a small dustbin.',
      si: 'පාලනය කළ නොහැකි ඕනෑම ගින්නකදී වහාම 110 අමතන්න. සුළු කුණු බක්කියක ගින්නකට වඩා විශාල ගිනි නිවීමට පුහුණුවක් නොමැතිව උත්සාහ නොකරන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Fire & Rescue Service (Sri Lanka)', si: 'ගිනි නිවීමේ සහ මුදාගැනීමේ සේවාව' },
        number: '110',
        description: { en: 'Toll-free emergency fire department dispatch', si: 'නොමිලේ ක්‍රියාත්මක හදිසි ගිනි නිවන සේවා අංකය' }
      },
      {
        name: { en: '1990 Suwa Seriya Ambulance', si: '1990 සුවසැරිය ගිලන්රථ සේවාව' },
        number: '1990',
        description: { en: 'Emergency care for smoke inhalation and burns', si: 'පිළිස්සුම් තුවාල සහ දුම් ආශ්වාස රෝගීන් සඳහා හදිසි සත්කාර' }
      }
    ]
  },
  {
    id: 'lightning-safety',
    categoryType: 'weather',
    image: '/illustrations/lightning-safety.webp',
    imageAlt: {
      en: 'Person leaving an exposed open field to seek shelter inside a solid enclosed building away from tall isolated trees',
      si: 'අකුණු අවදානම ඇති විවෘත එළිමහනින් ඉවත්ව ශක්තිමත් ගොඩනැගිල්ලක් තුළ රැකවරණය ලබන පුද්ගලයෙකු'
    },
    title: {
      en: 'Lightning & Thunderstorms',
      si: 'අකුණු සහ ගිගුරුම් සහිත වැසි'
    },
    shortDescription: {
      en: 'Seek immediate shelter in an enclosed concrete building, avoid open fields, solitary trees, wire fences, and water bodies.',
      si: 'වහාම ශක්තිමත් සංවෘත ගොඩනැගිල්ලක් තුළට යන්න. විවෘත එළිමහන් භූමි, හුදකලා ගස්, කම්බි වැටවල් සහ ජලාශ්‍රිත ස්ථානවලින් වහාම ඉවත් වන්න.'
    },
    introduction: {
      en: 'Sri Lanka experiences intense lightning activity during inter-monsoon periods (March–April and October–November). Lightning strikes cause fatal cardiac arrest and severe nerve damage. Following the "30/30 rule" and finding adequate shelter prevents strikes.',
      si: 'අන්තර් මෝසම් කාලවලදී (මාර්තු-අප්‍රේල් සහ ඔක්තෝබර්-නොවැම්බර්) ශ්‍රී ලංකාවේ දැඩි අකුණු අනතුරු බහුලව වාර්තා වේ. අකුණු සැර වැදීමෙන් හෘදයාබාධ හා ස්නායු හානි සිදුවිය හැකිය. නිසි ගොඩනැගිල්ලක රැකවරණය ලබාගැනීමෙන් මෙම අනතුරු වළක්වා ගත හැකිය.'
    },
    urgencyLevel: 'High',
    tags: {
      en: ['lightning', 'thunder', 'thunderstorm', 'inter-monsoon', 'strike', 'shelter', 'weather'],
      si: ['අකුණු', 'ගිගුරුම්', 'වැසි', 'අන්තර් මෝසම්', 'අකුණු සැර', 'ආරක්ෂිත නවාතැන්']
    },
    duringStage: {
      heading: {
        en: 'During Lightning (When Thunder Roars, Go Indoors)',
        si: 'අකුණු පවතින අවස්ථාවේ (ගිගුරුම් හඬ ඇසෙන විට ගෙට වදින්න)'
      },
      steps: [
        {
          en: 'Immediately seek shelter in a substantial, fully enclosed building with permanent electrical wiring and plumbing.',
          si: 'වහාම කොන්ක්‍රීට් හෝ ස්ථිර වහලක් සහිත, විදුලි හා ජල නල පද්ධති සහිත සංවෘත ගොඩනැගිල්ලකට යන්න.'
        },
        {
          en: 'If driving, stay inside your hard-topped metal vehicle with windows rolled up tightly.',
          si: 'ඔබ වාහනයක් පදවන්නේ නම්, වීදුරු හොඳින් වසා වාහනය තුළම රැඳී සිටින්න.'
        },
        {
          en: 'Unplug television antennas, computer cords, and major electrical appliances to avoid power surge damages.',
          si: 'රූපවාහිනී ඇන්ටෙනා, පරිගණක සහ විදුලි උපකරණ පේනුවලින් ගලවා දමන්න.'
        },
        {
          en: 'Stay away from corded phones, running taps, shower baths, and metal window frames.',
          si: 'ස්ථාවර දුරකථන, ජල කරාම, ස්නානය කිරීම් සහ ලෝහ ජනෙල් රාමුවලින් ඈත්ව සිටින්න.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'After the Storm (The 30-Minute Rule)',
        si: 'කුණාටුවෙන් පසු (මිනිත්තු 30 නීතිය)'
      },
      steps: [
        {
          en: 'Remain inside for at least 30 minutes after hearing the last sound of thunder before resuming outdoor activities.',
          si: 'අවසාන ගිගුරුම් හඬ ඇසී අවම වශයෙන් මිනිත්තු 30ක් ගතවන තුරු එළිමහන් කටයුතුවලට නොයන්න.'
        },
        {
          en: 'Lightning victims carry NO electrical charge; you can safely touch them and perform immediate CPR while calling 1990.',
          si: 'අකුණු සැර වැදුණු පුද්ගලයෙකුගේ සිරුරේ විදුලිය රැඳී නොපවතී; වහාම 1990 අමතා හෘද සම්බාහනය (CPR) ලබාදෙන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'If caught in an open paddy field with no shelter nearby, crouch low on the balls of your feet with heels touching and hands over ears (minimize ground contact).',
        si: 'නවාතැනක් නොමැති විවෘත කුඹුරක සිරවුවහොත්, විලුඹ එකට තබා පා ඇඟිලි මත හිඳගෙන හිස දෑතින් ආවරණය කරගන්න (බිම හා ස්පර්ශය අවම කරන්න).'
      },
      {
        en: 'Ensure your home has a properly grounded surge arrester and lightning protection rod.',
        si: 'නිවසේ නිසි භූගත කිරීමක් (Earth) සහිත අකුණු සන්නායක පද්ධතියක් සවි කර තබාගන්න.'
      }
    ],
    donts: [
      {
        en: 'NEVER shelter beneath an isolated tall tree, metal bus halt, or umbrella with a metal tip in open ground.',
        si: 'හුදකලා උස් ගස් යට, ලෝහ බස් නැවතුම් යට හෝ ලෝහ කූරු සහිත කුඩ ඉහළාගෙන විවෘත බිම්වල නොසිටින්න.'
      },
      {
        en: 'Avoid lakes, rivers, swimming pools, and metal wire fences during thunder activity.',
        si: 'ගිගුරුම් සහිත වැසි ඇති විට වැව්, ගංගා, පිහිනුම් තටාක සහ කම්බි වැටවල් ආසන්නයට නොයන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Leave Open Fields', si: 'එළිමහනෙන් ඉවත් වන්න' },
        description: {
          en: 'Stop sports, farming, and outdoor work immediately at the first thunder rumble.',
          si: 'පළමු ගිගුරුම් හඬ ඇසුණු විගස ක්‍රීඩා, ගොවිතැන් සහ එළිමහන් වැඩ නවත්වා ඉවත් වන්න.'
        },
        badge: { en: 'Evacuate', si: 'ඉවත් වීම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Enter Solid Building', si: 'ස්ථිර ගොඩනැගිල්ලකට යන්න' },
        description: {
          en: 'Shelter inside a substantial brick or concrete building with doors and windows closed.',
          si: 'දොර ජනෙල් වසා දැමූ ස්ථිර කොන්ක්‍රීට් හෝ ගඩොල් ගොඩනැගිල්ලක් තුළ රැකවරණය ලබන්න.'
        },
        badge: { en: 'Shelter', si: 'ආරක්ෂාව' }
      },
      {
        stepNumber: 3,
        title: { en: 'Wait 30 Minutes', si: 'මිනිත්තු 30ක් රැඳෙන්න' },
        description: {
          en: 'Do not venture out until 30 minutes after the very last thunderclap has ceased.',
          si: 'අවසන් ගිගුරුම් ශබ්දය අවසන් වී විනාඩි 30ක් යන තුරු එළිමහනට නොයන්න.'
        },
        badge: { en: 'Clear', si: 'සහතිකය' }
      }
    ],
    checklist: [
      {
        id: 'lt-1',
        text: { en: 'Surge protector power strips for sensitive computers and electronics', si: 'සංවේදී පරිගණක සහ විදුලි උපකරණ සඳහා Surge Protector සවි කිරීම' },
        tip: { en: 'Protects from indirect voltage spikes traveling via utility grids', si: 'විදුලි රැහැන් ඔස්සේ එන අධි වෝල්ටීයතා කම්පනවලින් උපකරණ ආරක්ෂා කරයි' }
      }
    ],
    whenToSeekHelp: {
      en: 'If a person is struck by lightning, call 1990 immediately. If they are unresponsive and not breathing, begin chest compressions (CPR) without delay.',
      si: 'යමෙකුට අකුණු සැර වැදුනහොත් වහාම 1990 අමතන්න. රෝගියා සිහිසුන්ව හුස්ම නොගන්නේ නම් වහාම පපුව තෙරපීමේ ප්‍රථමාධාරය (CPR) අරඹන්න.'
    },
    officialHotlines: [
      {
        name: { en: '1990 Suwa Seriya Ambulance', si: '1990 සුවසැරිය ගිලන්රථ සේවාව' },
        number: '1990',
        description: { en: 'Free national medical emergency response', si: 'නොමිලේ ජාතික හදිසි වෛද්‍ය ගිලන්රථ සේවාව' }
      },
      {
        name: { en: 'Department of Meteorology', si: 'කාලගුණ විද්‍යා දෙපාර්තමේන්තුව' },
        number: '011 268 6499',
        description: { en: 'Thunderstorm and lightning advisory bulletins', si: 'අකුණු සහ ගිගුරුම් සහිත කාලගුණ අනතුරු ඇඟවීමේ නිවේදන' }
      }
    ]
  },
  {
    id: 'tsunami-safety',
    categoryType: 'water',
    image: '/illustrations/tsunami-safety.webp',
    imageAlt: {
      en: 'Coastal community walking briskly inland towards high ground hillside following official tsunami sirens',
      si: 'සුනාමි අනතුරු ඇඟවීමේ නලා ශබ්දයත් සමඟ වෙරළෙන් ඉවත්ව උස් කඳුකර බිම් දෙසට ගමන් කරන වෙරළබඩ ජනතාව'
    },
    title: {
      en: 'Tsunami Safety',
      si: 'සුනාමි ආරක්ෂාව'
    },
    shortDescription: {
      en: 'Recognize natural warning signs and official siren alerts, immediately move inland to high ground, and do not return until official all-clear is given.',
      si: 'මුහුදු ජලය වේගයෙන් පසුබැසීම සහ අනතුරු ඇඟවීමේ නලා ශබ්ද හඳුනාගන්න. වහාම මුහුදු වෙරළෙන් ඉවත්ව උස් බිම් කරා යන්න; නිල අවසරය ලැබෙන තුරු ආපසු නොඑන්න.'
    },
    introduction: {
      en: 'Following undersea earthquakes in the Sumatra or Makran subduction zones, tsunamis can reach Sri Lankan coasts within 90 to 120 minutes. Recognizing natural signs—unusual ground shaking, a loud ocean roar, or abnormal coastal water recession—demands immediate evacuation.',
      si: 'සුමාත්‍රා හෝ මැක්‍රාන් කලාපවල මුහුදු පත්ලේ ඇතිවන ප්‍රබල භූමිකම්පාවලින් හටගන්නා සුනාමි රළ පැය එකහමාරක් හෝ දෙකක් ඇතුළත ශ්‍රී ලංකා වෙරළට ළඟා විය හැකිය. වෙරළබඩ කම්පන, සාගර ඝෝෂාව හෝ මුහුදු ජලය වේගයෙන් පසුබැසීම දුටු විගස උස් බිම් කරා ඉවත් වීම අත්‍යවශ්‍ය වේ.'
    },
    urgencyLevel: 'Critical',
    tags: {
      en: ['tsunami', 'ocean', 'coastal', 'wave', 'siren', 'high ground', 'sumatra', 'evacuation'],
      si: ['සුනාමි', 'මුහුද', 'වෙරළබඩ', 'සුනාමි රළ', 'උස්බිම්', 'නලා ශබ්දය', 'ඉවත් වීම']
    },
    duringStage: {
      heading: {
        en: 'Recognizing Signs & Immediate Evacuation',
        si: 'ලක්ෂණ හඳුනාගැනීම සහ ක්ෂණික ඉවත් වීම'
      },
      steps: [
        {
          en: 'Natural Warning Signs: If you feel strong coastal earthquake shaking, or notice the sea receding dramatically exposing coral beds, EVACUATE IMMEDIATELY.',
          si: 'ස්වාභාවික අනතුරු ඇඟවීම්: වෙරළබඩ ප්‍රදේශයේදී කම්පනයක් දැනුනහොත්, හෝ මුහුදු ජලය අසාමාන්‍ය ලෙස ඈතට පසුබැස ගල්පර නිරාවරණය වුවහොත්, කිසිවක් නොසිතා වහාම ඉවත් වන්න.'
        },
        {
          en: 'Head inland on foot to high ground (at least 15–20 meters above sea level) or at least 1.5–2 kilometers inland.',
          si: 'මුහුදු මට්ටමේ සිට අවම වශයෙන් මීටර් 15-20ක් උස කන්දකට හෝ වෙරළෙන් කිලෝමීටර් 1.5-2ක් රට අභ්‍යන්තරයට පයින් ගමන් කරන්න.'
        },
        {
          en: 'Do not use cars if traffic congestion blocks roads; abandon vehicles and continue on foot to higher ground.',
          si: 'මාර්ග තදබදය පවතී නම් වාහන අතහැර පයින්ම උස් බිම් කරා දිව යන්න.'
        },
        {
          en: 'A tsunami is a series of multiple waves, not just one. The second or third wave is frequently the largest.',
          si: 'සුනාමියක් යනු එක් රළ පහරක් පමණක් නොව රළ මාලාවකි. බොහෝවිට දෙවන හෝ තෙවන රළ පහර විශාලතම එක විය හැකිය.'
        }
      ]
    },
    afterStage: {
      heading: {
        en: 'After the Waves (Staying Safe)',
        si: 'රළ පහරින් පසු (ආරක්ෂාව තහවුරු කරගැනීම)'
      },
      steps: [
        {
          en: 'Never return to the coast until the Disaster Management Centre officially issues the ALL-CLEAR bulletin.',
          si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය නිල වශයෙන් අවදානම පහව ගිය බව ප්‍රකාශ කරන තුරු වෙරළට ආපසු නොඑන්න.'
        },
        {
          en: 'Stay away from debris-filled coastal floodwater and damaged bridges.',
          si: 'සුන්බුන් පිරුණු වෙරළබඩ ජලයෙන් සහ හානි වූ පාලම්වලින් ඈත්ව සිටින්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Know your local coastal tsunami evacuation route and designated high-ground assembly point.',
        si: 'ඔබේ ප්‍රදේශයේ සුනාමි ඉවත් වීමේ මාර්ගය සහ උස් ආරක්ෂිත රැස්වීම් ස්ථානය කලින් දැන සිටින්න.'
      },
      {
        en: 'Heed early warning tower sirens along Sri Lankan coasts immediately.',
        si: 'වෙරළ තීරයේ පිහිටි සුනාමි පූර්ව අනතුරු ඇඟවීමේ කුළුණුවල නලා ශබ්දය ඇසුණු විගස ඉවත් වන්න.'
      }
    ],
    donts: [
      {
        en: 'NEVER go down to the shore to collect exposed fish or inspect receding water.',
        si: 'පසුබැස ගිය මුහුදු වෙරළේ මාළු අහුලන්නට හෝ රළ නැරඹීමට කිසිවිටෙකත් වෙරළට නොයන්න.'
      },
      {
        en: 'Do not assume a small initial surge means the danger has passed.',
        si: 'පළමු රළ පහර කුඩා වූ පමණින් අනතුර පහව ගියේ යැයි නොසිතන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Spot Sea Recession', si: 'මුහුද පසුබැසීම හඳුනාගන්න' },
        description: {
          en: 'An ocean pulling away abnormally is nature’s loudest tsunami warning.',
          si: 'මුහුදු ජලය අසාමාන්‍ය ලෙස ඈතට ඇදී යාම සොබාදහමේ ප්‍රබලතම සුනාමි අනතුරු ඇඟවීමයි.'
        },
        badge: { en: 'Notice', si: 'දැනුවත් වීම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Run to High Ground', si: 'උස් බිම් කරා යන්න' },
        description: {
          en: 'Climb hills, high ground, or designated concrete tsunami evacuation towers.',
          si: 'උස් කඳු, ස්ථිර උස් බිම් හෝ සුනාමි ආරක්ෂිත කුළුණු කරා කඩිනමින් ළඟා වන්න.'
        },
        badge: { en: 'Evacuate', si: 'ඉවත් වීම' }
      },
      {
        stepNumber: 3,
        title: { en: 'Wait for All-Clear', si: 'නිල නිවේදනය තෙක් රැඳෙන්න' },
        description: {
          en: 'Remain in safety until official radio / TV broadcasts confirm safe re-entry.',
          si: 'රජයේ නිල මාධ්‍ය මගින් තහවුරු කරන තුරු ආරක්ෂිත ස්ථානයේම රැඳී සිටින්න.'
        },
        badge: { en: 'Safety', si: 'ආරක්ෂාව' }
      }
    ],
    checklist: [
      {
        id: 'ts-1',
        text: { en: 'Nearest hill or multi-story designated tsunami shelter memorized', si: 'ළඟම පිහිටි කන්ද හෝ තහවුරු කළ බහුමහල් සුනාමි නවාතැන හඳුනාගැනීම' },
        tip: { en: 'Sri Lanka has 77 coastal early warning towers connected to DMC', si: 'ශ්‍රී ලංකා වෙරළ තීරයේ DMC මගින් පාලනය වන පූර්ව අනතුරු කුළුණු 77ක් ඇත' }
      }
    ],
    whenToSeekHelp: {
      en: 'Listen to DMC announcements on 117. Do not call emergency phone lines merely to ask if a tsunami has happened; keep lines open for actual coastal evacuation rescue.',
      si: 'DMC නිල නිවේදනවලට සවන් දෙන්න. නිකරුනේ දුරකථන මාර්ග අවහිර නොකර, හදිසි අවස්ථාවලදී පමණක් 117 හෝ 1990 අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Disaster Management Centre (Tsunami Warning)', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: 'Official coastal early warning center', si: 'වෙරළබඩ නිල පූර්ව අනතුරු ඇඟවීමේ මධ්‍යස්ථානය' }
      }
    ]
  },
  {
    id: 'drought-preparedness',
    categoryType: 'weather',
    image: '/illustrations/drought-preparedness.webp',
    imageAlt: {
      en: 'Household safely storing clean drinking water in covered containers and practicing hygienic water conservation',
      si: 'පිරිසිදු පානීය ජලය ආවරණය සහිත භාජනවල සුරක්ෂිතව ගබඩා කරමින් ජල සංරක්ෂණය පුරුදු කරන පවුලක්'
    },
    title: {
      en: 'Drought & Water Shortages',
      si: 'නියඟය සහ ජල හිඟය'
    },
    shortDescription: {
      en: 'Store drinking water safely in clean covered containers, practice hygienic water conservation, protect food supplies, and prevent heat illnesses.',
      si: 'පිරිසිදු පානීය ජලය ආවරණය සහිත පිරිසිදු භාජනවල සුරක්ෂිතව ගබඩා කරන්න, ජලය අරපිරිමැස්මෙන් භාවිතා කරන්න, අධික උෂ්ණත්වයෙන් වැළකී සෞඛ්‍යාරක්ෂිතව සිටින්න.'
    },
    introduction: {
      en: 'Prolonged dry spells in the dry zone (Anuradhapura, Polonnaruwa, Hambantota, Kurunegala, Jaffna, Monaragala) lead to severe drinking water depletion, crop failure, and heat-related illnesses. Safe water storage and preventive health practices protect families.',
      si: 'වියළි කලාපීය දිස්ත්‍රික්කවල (අනුරාධපුරය, පොළොන්නරුව, හම්බන්තොට, කුරුණෑගල, යාපනය ආදී) දිගුකාලීන නියඟය පානීය ජල හිඟය, වගා හානි සහ අධික උෂ්ණත්ව රෝග ඇති කරයි. ආරක්ෂිතව ජලය ගබඩා කිරීම හා අරපිරිමැස්මෙන් පරිභෝජනය ජීවිත සුරක්ෂිත කරයි.'
    },
    urgencyLevel: 'Medium',
    tags: {
      en: ['drought', 'water', 'shortage', 'heatwave', 'conservation', 'storage', 'dry zone'],
      si: ['නියඟය', 'ජල හිඟය', 'ජලය සුරැකීම', 'වියළි කලාපය', 'පානීය ජලය', 'උෂ්ණත්වය']
    },
    duringStage: {
      heading: {
        en: 'Safe Water Storage & Health Preservation',
        si: 'ආරක්ෂිත ජල ගබඩාකරණය සහ සෞඛ්‍ය ආරක්ෂාව'
      },
      steps: [
        {
          en: 'Store drinking water only in food-grade, thoroughly cleaned containers fitted with tight lids to prevent mosquito breeding and contamination.',
          si: 'පානීය ජලය ගබඩා කිරීම සඳහා පිරිසිදු, ආහාර ශ්‍රේණියේ (Food-grade) සහ මදුරුවන් බෝ නොවන පරිදි හොඳින් පියන් වැසිය හැකි භාජන පමණක් භාවිතා කරන්න.'
        },
        {
          en: 'Boil or treat all unknown water sources before drinking. Never consume stagnant or agricultural runoff water.',
          si: 'ප්‍රභවය පැහැදිලි නැති ජලය පානයට පෙර හොඳින් නටවා නිවාගන්න. කෘෂිකාර්මික අපජලය කිසිවිටෙකත් පානය නොකරන්න.'
        },
        {
          en: 'Prioritize water strictly: drinking and hygienic cooking come first, followed by personal sanitation.',
          si: 'ජල භාවිතය ප්‍රමුඛතා අනුව සකසන්න: පළමුව පානීය ජලය සහ ආහාර පිසීම, දෙවනුව පෞද්ගලික සනීපාරක්ෂාව.'
        },
        {
          en: 'Drink adequate water throughout the day to avoid dehydration and heatstroke, especially children and the elderly.',
          si: 'විජලනය සහ හිරු රශ්මියෙන් ඇතිවන ආඝාතය (Heatstroke) වළක්වා ගැනීමට දවස පුරා ප්‍රමාණවත් ලෙස ජලය පානය කරන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Cover all household water storage barrels with fine mesh to prevent dengue mosquito breeding.',
        si: 'ඩෙංගු මදුරුවන් බෝවීම වැළැක්වීම සඳහා සියලුම ජල ටැංකි සහ බැරල් මදුරු දැල් යොදා ආවරණය කරන්න.'
      },
      {
        en: 'Reuse clean greywater (from vegetable washing) to sustain home garden vegetables.',
        si: 'එළවළු සේදූ ජලය ගෙවතු වගාවට යොදමින් ජලය අපතේ යාම වළක්වන්න.'
      }
    ],
    donts: [
      {
        en: 'Do not use chemical fertilizer containers or pesticide barrels to store drinking water.',
        si: 'රසායනික පොහොර හෝ කෘමිනාශක අඩංගු වූ බැරල් පානීය ජලය ගබඩා කිරීමට කිසිවිටෙකත් භාවිතා නොකරන්න.'
      },
      {
        en: 'Do not stay exposed to direct noon sun (11 AM to 3 PM) during severe heatwaves.',
        si: 'දැඩි උෂ්ණත්වයක් පවතින දිනවල පෙරවරු 11 සිට පස්වරු 3 දක්වා ඍජු හිරු එළියට නිරාවරණය වීමෙන් වළකින්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Clean Containers', si: 'භාජන පිරිසිදු කරන්න' },
        description: {
          en: 'Scrub water storage tanks and seal securely with food-grade covers.',
          si: 'ජල ටැංකි හොඳින් සෝදා පිරිසිදු කර ආරක්ෂිත පියන්වලින් ආවරණය කරන්න.'
        },
        badge: { en: 'Storage', si: 'ගබඩා කිරීම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Boil Drinking Water', si: 'ජලය නටවා නිවාගන්න' },
        description: {
          en: 'Bring water to a rolling boil for 1 minute before drinking.',
          si: 'පානය කිරීමට පෙර ජලය අවම වශයෙන් විනාඩියක්වත් නටවා ගන්න.'
        },
        badge: { en: 'Health', si: 'සෞඛ්‍යය' }
      },
      {
        stepNumber: 3,
        title: { en: 'Conserve Every Drop', si: 'ජලය අරපිරිමැස්මෙන් ගන්න' },
        description: {
          en: 'Fix leaking taps promptly and practice drip irrigation in gardens.',
          si: 'කාන්දු වන කරාම අලුත්වැඩියා කර ජලය අරපිරිමැස්මෙන් පරිහරණය කරන්න.'
        },
        badge: { en: 'Conserve', si: 'සුරැකීම' }
      }
    ],
    checklist: [
      {
        id: 'dr-1',
        text: { en: 'Covered, clean drinking water tanks holding at least 3 days supply', si: 'දින 3කට ප්‍රමාණවත් ආවරණය සහිත පිරිසිදු පානීය ජල සංචිතයක්' },
        tip: { en: 'Plan for approximately 3 liters per person daily for basic survival', si: 'පුද්ගලයෙකුට දිනකට අවම ලීටර් 3ක් බැගින් ගණනය කරන්න' }
      }
    ],
    whenToSeekHelp: {
      en: 'If community drinking water wells run completely dry or water bowser deliveries are disrupted, contact your Divisional Secretariat or Grama Niladhari immediately to request water bowser dispatch.',
      si: 'ප්‍රදේශයේ පොදු පානීය ළිං සිඳී ගියහොත් හෝ ජල බවුසර් බෙදාහැරීම් අඩාල වුවහොත්, වහාම ප්‍රාදේශීය ලේකම් කාර්යාලය හෝ ග්‍රාම නිලධාරී අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'National Water Supply and Drainage Board (NWSDB)', si: 'ජාතික ජලසම්පාදන හා ජලාපවහන මණ්ඩලය' },
        number: '1939',
        description: { en: 'Water supply breakdown, bowser requests, and leak reporting', si: 'ජල සැපයුම් බිඳවැටීම් සහ හදිසි ජල බවුසර් ඉල්ලීම්' }
      },
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: 'Drought relief coordination', si: 'නියඟ සහන සම්බන්ධීකරණ සේවාව' }
      }
    ]
  },
  {
    id: 'general-preparedness',
    categoryType: 'preparedness',
    image: '/illustrations/general-preparedness.webp',
    imageAlt: {
      en: 'Prepared household with battery radio, stocked emergency shelf, first aid kit, and family contact plan',
      si: 'හදිසි ආපදාවකට සූදානම්ව රේඩියෝවක්, ප්‍රථමාධාර පෙට්ටියක් සහ අත්‍යවශ්‍ය ද්‍රව්‍ය සූදානම් කරගත් පවුලක්'
    },
    title: {
      en: 'General Emergency Preparedness',
      si: 'සාමාන්‍ය හදිසි සූදානම'
    },
    shortDescription: {
      en: 'Keep essential emergency supplies organized, stay tuned to official government alerts, and maintain updated household contact lists.',
      si: 'අත්‍යවශ්‍ය හදිසි ද්‍රව්‍ය සූදානම්ව තබාගන්න, රජයේ නිල පණිවිඩවලට නිරතුරුව සවන් දෙන්න සහ පවුලේ හදිසි දුරකථන අංක සටහන් කර ළඟ තබාගන්න.'
    },
    introduction: {
      en: 'Being prepared before a crisis strikes turns panic into prompt, calm action. Having basic household supplies, an understood family plan, and knowledge of verified information sources significantly reduces danger during any disaster.',
      si: 'ආපදාවක් සිදුවීමට පෙර සූදානම්ව සිටීම බිය සහ කලබලය වෙනුවට සන්සුන්ව ක්‍රියාකිරීමට මගපාදයි. මූලික ගෘහස්ථ ද්‍රව්‍ය, පවුලේ සැලැස්මක් සහ නිල තොරතුරු මූලාශ්‍ර පිළිබඳ දැනුවත්භාවය ඕනෑම ආපදාවකදී ඔබව ආරක්ෂා කරයි.'
    },
    urgencyLevel: 'Routine',
    tags: {
      en: ['preparedness', 'plan', 'emergency', 'radio', 'alerts', 'readiness', 'safety'],
      si: ['සූදානම', 'හදිසි සැලැස්ම', 'ආරක්ෂාව', 'නිවේදන', 'පූර්ව සූදානම']
    },
    duringStage: {
      heading: {
        en: 'Core Household Preparedness Pillars',
        si: 'මූලික ගෘහස්ථ සූදානම් වීමේ පියවර'
      },
      steps: [
        {
          en: 'Stay Informed: Rely on official broadcasts from the Disaster Management Centre, Met Dept, and official news instead of social media rumours.',
          si: 'තොරතුරු දැනගන්න: සමාජ මාධ්‍ය කටකතා වෙනුවට ආපදා කළමනාකරණ මධ්‍යස්ථානය සහ කාලගුණ විද්‍යා දෙපාර්තමේන්තුවේ නිල නිවේදන කෙරෙහි විශ්වාසය තබන්න.'
        },
        {
          en: 'Keep an Emergency Supply Shelf: Store non-perishable canned food, biscuits, bottled water, batteries, and candles in an accessible place.',
          si: 'හදිසි ද්‍රව්‍ය රාක්කයක් තබාගන්න: කල්තබාගත හැකි ආහාර, බිස්කට්, ජල බෝතල්, බැටරි සහ ඉටිපන්දම් පහසුවෙන් ළඟාවිය හැකි තැනක තබන්න.'
        },
        {
          en: 'Know Utility Cut-Offs: Ensure every adult in the house knows how to switch off electricity at the main board and disconnect the LPG gas cylinder.',
          si: 'විදුලිය හා ගෑස් විසන්ධි කිරීම: ප්‍රධාන විදුලි ස්විචය සහ ගෑස් සිලින්ඩරය විසන්ධි කරන ආකාරය නිවසේ සියලු වැඩිහිටියන් දැන සිටිය යුතුය.'
        }
      ]
    },
    dos: [
      {
        en: 'Write emergency telephone numbers on a laminated paper card kept in your wallet or fridge door.',
        si: 'හදිසි දුරකථන අංක කොළයක ලියා ලැමිනේට් කර පසුම්බියේ හෝ ශීතකරණ දොරේ අලවා තබන්න.'
      },
      {
        en: 'Conduct a quick 5-minute household drill twice a year to review exit routes.',
        si: 'වසරකට දෙවරක් නිවසින් පිටවීමේ මාර්ග පිළිබඳව පවුලේ සැම එක්ව කුඩා පෙරහුරුවක් කරන්න.'
      }
    ],
    donts: [
      {
        en: 'Do not wait until the electricity goes out to search for flashlights and dry cells.',
        si: 'විදුලිය ඇනහිටින තුරු විදුලි පන්දම් සහ බැටරි සෙවීම කල් නොදමන්න.'
      },
      {
        en: 'Do not block exits, staircases, or doors with storage boxes.',
        si: 'පිටවීමේ දොරවල්, පඩිපෙළ හෝ කොරිඩෝ පෙට්ටි දමා අවහිර නොකරන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Make a Plan', si: 'සැලැස්මක් හදන්න' },
        description: {
          en: 'Agree on where to meet and who to call if separated.',
          si: 'වෙන් වුවහොත් හමුවන තැනක් සහ අමතන ඥාතියෙකු තීරණය කරන්න.'
        },
        badge: { en: 'Plan', si: 'සැලසුම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Pack Supplies', si: 'ද්‍රව්‍ය සූදානම් කරන්න' },
        description: {
          en: 'Gather emergency go-bag essentials in an easy-to-grab backpack.',
          si: 'අත්‍යවශ්‍ය ද්‍රව්‍ය පහසුවෙන් රැගෙන යා හැකි බෑගයක අසුරන්න.'
        },
        badge: { en: 'Pack', si: 'ඇසිරීම' }
      },
      {
        stepNumber: 3,
        title: { en: 'Stay Informed', si: 'අවධානයෙන් සිටින්න' },
        description: {
          en: 'Follow official alerts on local radio, television, and verified apps.',
          si: 'ගුවන්විදුලිය සහ නිල යෙදවුම් හරහා රජයේ පණිවිඩ ලබාගන්න.'
        },
        badge: { en: 'Alert', si: 'දැනුවත් වීම' }
      }
    ],
    checklist: [
      {
        id: 'gp-1',
        text: { en: 'Emergency contact card with DMC 117, Suwa Seriya 1990, Police 119', si: 'DMC 117, සුවසැරිය 1990 සහ පොලිසිය 119 සහිත හදිසි ඇමතුම් කාඩ්පතක්' },
        tip: { en: 'Laminate or enclose in plastic against water damage', si: 'ජලයෙන් ආරක්ෂා වන සේ ලැමිනේට් කර තබාගන්න' }
      }
    ],
    whenToSeekHelp: {
      en: 'For national disaster advisories or coordination assistance, call the Disaster Management Centre at 117.',
      si: 'ජාතික ආපදා උපදෙස් හෝ සම්බන්ධීකරණ සහය සඳහා ආපදා කළමනාකරණ මධ්‍යස්ථානයේ 117 ක්ෂණික ඇමතුම් අංකය අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: 'National 24/7 disaster preparedness line', si: 'පැය 24 පුරා ක්‍රියාත්මක ජාතික ආපදා සූදානම්තා සේවාව' }
      }
    ]
  },
  {
    id: 'emergency-go-bag',
    categoryType: 'preparedness',
    image: '/illustrations/emergency-go-bag.webp',
    imageAlt: {
      en: 'Organized flat-lay layout of emergency go-bag contents including water, food bars, first aid, documents, and flashlight',
      si: 'පානීය ජලය, වියළි ආහාර, ප්‍රථමාධාර, ලියකියවිලි සහ විදුලි පන්දමක් සහිත හදිසි බෑගයක අන්තර්ගතය'
    },
    title: {
      en: 'Emergency Go-Bag',
      si: 'හදිසි අවස්ථාවක රැගෙන යා යුතු බෑගය'
    },
    shortDescription: {
      en: 'Pack bottled water, shelf-stable food, prescription medicines, waterproofed ID documents, flashlight, spare batteries, and first-aid supplies.',
      si: 'පානීය ජල බෝතල්, කල්තබාගත හැකි ආහාර, අත්‍යවශ්‍ය ඖෂධ, ජලයෙන් ආරක්ෂිත හැඳුනුම්පත් ලේඛන, විදුලි පන්දමක් සහ ප්‍රථමාධාර උපකරණ බෑගයක සූදානම් කරගන්න.'
    },
    introduction: {
      en: 'An Emergency Go-Bag (evacuation backpack) contains the absolute essentials you need to survive for 72 hours if you must evacuate immediately. Keep it in an accessible location known to all family members.',
      si: 'හදිසි ඉවත් වීමේ බෑගයක් (Go-Bag) යනු හදිසියේ නිවසින් පිටවීමට සිදුවුවහොත් පැය 72ක් ජීවත්වීමට අවශ්‍ය මූලික ද්‍රව්‍ය අඩංගු බෑගයකි. මෙය නිවසේ සැමට පහසුවෙන් ගත හැකි තැනක තබාගන්න.'
    },
    urgencyLevel: 'High',
    tags: {
      en: ['go-bag', 'backpack', 'kit', 'supplies', 'survival', 'evacuation', 'checklist'],
      si: ['හදිසි බෑගය', 'අත්‍යවශ්‍ය ද්‍රව්‍ය', 'ඉවත් වීම', 'සූදානම', 'ඖෂධ', 'ජලය']
    },
    duringStage: {
      heading: {
        en: 'Essential Go-Bag Packing List',
        si: 'හදිසි බෑගයේ අඩංගු විය යුතු අත්‍යවශ්‍ය ද්‍රව්‍ය'
      },
      steps: [
        {
          en: 'Drinking Water: At least 2–3 liters of bottled water per person in sealed plastic bottles.',
          si: 'පානීය ජලය: පුද්ගලයෙකුට අවම වශයෙන් ලීටර් 2-3ක මුද්‍රා තැබූ පානීය ජල බෝතල්.'
        },
        {
          en: 'Ready-to-Eat Food: High-energy biscuits, canned food with pull-tabs, dried fruits, energy bars.',
          si: 'කල්තබාගත හැකි ආහාර: බිස්කට්, ටින් කළ ආහාර, රටඉඳි වැනි වියළි පලතුරු.'
        },
        {
          en: 'Prescription Medications: At least 7 days supply of essential daily medicines and prescription copies.',
          si: 'අත්‍යවශ්‍ය ඖෂධ: දින 7කට සෑහෙන දෛනික බෙහෙත් සහ බෙහෙත් වට්ටෝරුවේ පිටපතක්.'
        },
        {
          en: 'Important Documents: National ID cards, birth certificates, deeds, insurance, bank books sealed in a waterproof pouch.',
          si: 'වැදගත් ලියකියවිලි: ජාතික හැඳුනුම්පත්, උප්පැන්න සහතික, ඔප්පු සහ බැංකු පොත් ජලයට ඔරොත්තු දෙන කවරයක බහාලන්න.'
        },
        {
          en: 'Tools & Lighting: Compact LED torch, spare alkaline batteries, whistle for signaling, multi-tool, and power bank.',
          si: 'උපකරණ: කුඩා LED විදුලි පන්දම, අමතර බැටරි, සංඥා නළාව (Whistle) සහ දුරකථන පවර් බෑන්ක්.'
        }
      ]
    },
    dos: [
      {
        en: 'Check the bag every 6 months to replace expired medicines, food, and water bottles.',
        si: 'සෑම මාස 6කට වරක් බෑගය පරීක්ෂා කර කල් ඉකුත්වූ ඖෂධ සහ ආහාර අලුත් කරන්න.'
      },
      {
        en: 'Use a comfortable, water-resistant backpack that leaves your hands completely free.',
        si: 'දෑත් නිදහසේ තබාගත හැකි, ජලයට ඔරොත්තු දෙන කරේ දමන බෑගයක් (Backpack) භාවිතා කරන්න.'
      }
    ],
    donts: [
      {
        en: 'Do not overload the bag; keep the total weight under 10–12 kg so you can walk long distances without fatigue.',
        si: 'බෑගය අධික බරින් පුරවන්න එපා; දිගු දුරක් පහසුවෙන් ගමන් කළ හැකි වන සේ එහි බර කිලෝග්‍රෑම් 10-12ට අඩුවෙන් තබාගන්න.'
      },
      {
        en: 'Do not pack glass jars or breakable containers that could shatter during transit.',
        si: 'ගමනේදී බිඳී යා හැකි වීදුරු බෝතල් හෝ භාජන බෑගයට නොදමන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Water & Sustenance', si: 'ජලය සහ ආහාර' },
        description: {
          en: 'Pack 3 sealed water bottles and energy-dense non-perishable food.',
          si: 'මුද්‍රා තැබූ ජල බෝතල් 3ක් සහ කල්තබාගත හැකි ශක්තිජනක ආහාර අසුරන්න.'
        },
        badge: { en: 'Survival', si: 'පැවැත්ම' }
      },
      {
        stepNumber: 2,
        title: { en: 'Meds & First-Aid', si: 'ඖෂධ සහ ප්‍රථමාධාර' },
        description: {
          en: 'Include sterile gauze, antiseptic wipes, and personal prescription pills.',
          si: 'විෂබීජ නාශක, වෙළුම් පටි සහ පෞද්ගලික ඖෂධ එකතු කරන්න.'
        },
        badge: { en: 'Health', si: 'සෞඛ්‍යය' }
      },
      {
        stepNumber: 3,
        title: { en: 'Waterproof Documents', si: 'ලේඛන ජලයෙන් ආරක්ෂා කරන්න' },
        description: {
          en: 'Store NICs, passbooks, and property deeds in a sealed ziplock.',
          si: 'හැඳුනුම්පත් සහ ඔප්පු සිප්ලොක් බෑගයක බහා ජලයෙන් ආරක්ෂා කරන්න.'
        },
        badge: { en: 'Identity', si: 'ලේඛන' }
      }
    ],
    checklist: [
      {
        id: 'gb-1',
        text: { en: 'Waterproof zip-lock bag for National Identity Cards and birth certificates', si: 'ජාතික හැඳුනුම්පත් හා උප්පැන්න සහතික සඳහා ජල ආරක්ෂිත සිප්ලොක් බෑගයක්' },
        tip: { en: 'Essential for relief verification at state evacuation centers', si: 'සහනාධාර ලබාගැනීමේදී අනන්‍යතාව තහවුරු කිරීමට අවශ්‍ය වේ' }
      },
      {
        id: 'gb-2',
        text: { en: 'Emergency signaling whistle', si: 'හදිසි සංඥා නළාවක් (Whistle)' },
        tip: { en: 'A whistle carries sound 3 times farther than human shouting and saves vocal energy', si: 'කෑගැසීමට වඩා 3 ගුණයක් දුරට ශබ්දය ඇසෙන අතර ශක්තිය ඉතිරි කරයි' }
      }
    ],
    whenToSeekHelp: {
      en: 'Grab your bag and proceed to designated relief shelters immediately when official evacuation orders are issued by the Grama Niladhari or DMC 117.',
      si: 'ග්‍රාම නිලධාරී හෝ DMC 117 මගින් ඉවත් වීමේ නිවේදන නිකුත් කළ වහාම මෙම බෑගය රැගෙන ආරක්ෂිත නවාතැන් කරා යන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: 'Emergency Shelter and Evacuation Information', si: 'හදිසි නවාතැන් සහ ඉවත් වීමේ තොරතුරු සේවාව' }
      }
    ]
  },
  {
    id: 'family-emergency-plan',
    categoryType: 'preparedness',
    image: '/illustrations/family-emergency-plan.webp',
    imageAlt: {
      en: 'Multi-generational family sitting together discussing a neighbourhood map with marked meeting spots and contact list',
      si: 'හමුවන ආරක්ෂිත ස්ථාන සලකුණු කළ සිතියමක් සාකච්ඡා කරමින් පවුලේ හදිසි සැලැස්ම සකසන පවුලක්'
    },
    title: {
      en: 'Family Emergency Plan',
      si: 'පවුලේ හදිසි සැලැස්ම'
    },
    shortDescription: {
      en: 'Agree on two safe meeting points, designate an out-of-area contact person, prepare for elderly or children’s needs, and follow official evacuation orders.',
      si: 'පවුලේ සාමාජිකයන් හමුවන ආරක්ෂිත ස්ථාන දෙකක් තීරණය කරන්න, පිටස්තර හදිසි සම්බන්ධකයෙකු නම් කරන්න, වැඩිහිටි හා දරුවන්ගේ අවශ්‍යතා සැලසුම් කරන්න.'
    },
    introduction: {
      en: 'Disasters can strike when family members are apart at work, school, or running errands. A written, rehearsed Family Emergency Plan guarantees everyone knows where to assemble and who to call if local communications fail.',
      si: 'ආපදාවක් සිදුවන විට පවුලේ සාමාජිකයන් පාසලේ, රැකියාවේ හෝ වෙනත් ස්ථානවල විසිරී සිටිය හැකිය. කලින් සකස් කළ පවුලේ හදිසි සැලැස්මක් මගින් සැවොම හමුවන ස්ථානය සහ සම්බන්ධ වන ආකාරය පැහැදිලිව දැන සිටීම තහවුරු කරයි.'
    },
    urgencyLevel: 'Routine',
    tags: {
      en: ['family', 'plan', 'meeting spot', 'contacts', 'children', 'elderly', 'communication'],
      si: ['පවුලේ සැලැස්ම', 'හමුවන ස්ථානය', 'දරුවන්', 'වැඩිහිටියන්', 'සන්නිවේදනය', 'සැලසුම']
    },
    duringStage: {
      heading: {
        en: 'Key Steps to Build Your Family Plan',
        si: 'පවුලේ සැලැස්ම සකස් කිරීමේ ප්‍රධාන පියවර'
      },
      steps: [
        {
          en: 'Identify Two Meeting Spots: One right outside your home (e.g. a specific tree or gate for fire), and one outside your neighborhood (e.g. a town hall, temple, or relative’s home for floods).',
          si: 'හමුවන ස්ථාන දෙකක් තීරණය කරන්න: එකක් නිවස අසල (ගිනි අනතුරකදී) සහ අනෙක ගමෙන් පිටත පන්සලක්, ප්‍රජා ශාලාවක් හෝ ඥාති නිවසක් (ගංවතුරකදී).'
        },
        {
          en: 'Designate an Out-of-Area Contact: Choose a relative living in another district. During disasters, long-distance calls often connect when local networks are jammed.',
          si: 'වෙනත් ප්‍රදේශයක ඥාතියෙකු නම් කරන්න: ආපදා අවස්ථාවල ප්‍රාදේශීය දුරකථන මාර්ග අවහිර වන විට වෙනත් දිස්ත්‍රික්කයක සිටින ඥාතියෙකු හා සම්බන්ධ වීම පහසුය.'
        },
        {
          en: 'Plan for Vulnerable Family Members: Assign designated tasks for assisting infants, toddlers, elderly grandparents, or disabled relatives.',
          si: 'විශේෂ අවශ්‍යතා සහිත අය සැලසුම් කරන්න: කුඩා දරුවන්, ආබාධිත හෝ වැඩිහිටි ඥාතීන්ට උදව් කිරීමට පවුලේ සාමාජිකයන්ට වගකීම් පවරන්න.'
        },
        {
          en: 'Ensure Children Know Essential Details: Teach children their full name, parents’ mobile numbers, and safe meeting rules.',
          si: 'දරුවන්ට අවශ්‍ය තොරතුරු උගන්වන්න: දරුවන්ට තම සම්පූර්ණ නම, දෙමාපියන්ගේ දුරකථන අංක සහ ආරක්ෂිතව හැසිරෙන අයුරු කියාදෙන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Send SMS text messages instead of voice calls during crisis hours; SMS uses less bandwidth and delivers even in weak signals.',
        si: 'හදිසි අවස්ථාවල දුරකථන ඇමතුම් වෙනුවට SMS පණිවිඩ යවන්න; දුර්වල සංඥා ඇතිවිටද SMS පණිවිඩ පහසුවෙන් හුවමාරු වේ.'
      },
      {
        en: 'Keep school evacuation policies and daycare contact details in your emergency folder.',
        si: 'දරුවන්ගේ පාසල්වල හදිසි ආපදා ප්‍රතිපත්ති සහ දුරකථන අංක ළඟ තබාගන්න.'
      }
    ],
    donts: [
      {
        en: 'NEVER travel into dangerous flooded or landslide-prone zones to search for family members without official rescue coordination.',
        si: 'නිල සහන කණ්ඩායම්වල උපදෙස් නොමැතිව පවුලේ අය සෙවීමට අනතුරුදායක ගංවතුර හෝ නායයෑම් කලාප තුළට කිසිවිටෙකත් නොයන්න.'
      },
      {
        en: 'Do not assume verbal agreements are remembered; write the plan down clearly.',
        si: 'කටවචනයෙන් කී පමණින් සියල්ල මතක ඇතැයි නොසිතන්න; සැලැස්ම පැහැදිලිව සටහන් කර තබන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Pick Meeting Points', si: 'හමුවන තැන් තෝරන්න' },
        description: {
          en: 'Designate safe spot 1 (near home) and safe spot 2 (regional temple/school).',
          si: 'නිවස අසල ආරක්ෂිත ස්ථානයක් සහ ගමේ පන්සල හෝ පාසල දෙවන ස්ථානය ලෙස තෝරන්න.'
        },
        badge: { en: 'Locations', si: 'ස්ථාන' }
      },
      {
        stepNumber: 2,
        title: { en: 'Assign Care Roles', si: 'වගකීම් පවරන්න' },
        description: {
          en: 'Agree who carries the Go-Bag, who escorts elders, and who secures pets.',
          si: 'බෑගය ගන්නේ කවුද, වැඩිහිටියන් රැගෙන යන්නේ කවුදැයි කල්තියා තීරණය කරන්න.'
        },
        badge: { en: 'Roles', si: 'වගකීම්' }
      },
      {
        stepNumber: 3,
        title: { en: 'Practice Drill', si: 'පෙරහුරුව කරන්න' },
        description: {
          en: 'Walk the evacuation route together as a family at least once a year.',
          si: 'වසරකට වරක්වත් පවුලක් ලෙස ආරක්ෂිත මාර්ගයේ ගමන් කර පුරුදු වන්න.'
        },
        badge: { en: 'Rehearse', si: 'පුහුණුව' }
      }
    ],
    checklist: [
      {
        id: 'fp-1',
        text: { en: 'Out-of-town contact person phone number memorized by all children', si: 'වෙනත් ප්‍රදේශයක ඥාතියෙකුගේ දුරකථන අංකය දරුවන්ට කටපාඩම් කරවීම' },
        tip: { en: 'Helps reconnect separated family members via one central coordinator', si: 'වෙන්වූ පවුලේ සාමාජිකයන් එකිනෙකා හා සම්බන්ධ කරවීමට උපකාරී වේ' }
      }
    ],
    whenToSeekHelp: {
      en: 'If a family member is missing in a disaster area, immediately report their name, photo, and last known location to the nearest Police Station (119) and DMC (117).',
      si: 'ආපදා ප්‍රදේශයකදී පවුලේ සාමාජිකයෙකු අතුරුදහන් වුවහොත්, ඔවුන්ගේ නම, ඡායාරූපය සහ අවසන් වරට සිටි ස්ථානය වහාම පොලිසියට (119) සහ DMC (117) වෙත දැනුම් දෙන්න.'
    },
    officialHotlines: [
      {
        name: { en: 'Sri Lanka Police Emergency Call Centre', si: 'ශ්‍රී ලංකා පොලිස් හදිසි ඇමතුම් අංශය' },
        number: '119',
        description: { en: 'Missing persons reporting and public safety', si: 'අතුරුදහන් වූවන් වාර්තා කිරීම සහ මහජන ආරක්ෂාව' }
      },
      {
        name: { en: 'Disaster Management Centre', si: 'ආපදා කළමනාකරණ මධ්‍යස්ථානය' },
        number: '117',
        description: { en: 'Family relief coordination', si: 'පවුල් සහන සම්බන්ධීකරණ සේවාව' }
      }
    ]
  },
  {
    id: 'first-aid-awareness',
    categoryType: 'health',
    image: '/illustrations/first-aid-awareness.webp',
    imageAlt: {
      en: 'Trained caregiver applying clean sterile bandage while family member calls 1990 Suwa Seriya ambulance',
      si: 'තුවාලයකට පිරිසිදු වෙළුම් පටියක් යොදමින් 1990 සුවසැරිය ගිලන්රථ සේවාව අමතන ආකාරය'
    },
    title: {
      en: 'Basic First-Aid Awareness',
      si: 'ප්‍රථමාධාර පිළිබඳ මූලික දැනුවත් කිරීම'
    },
    shortDescription: {
      en: 'Basic initial safety steps for bleeding, burns, and fainting while promptly calling the 1990 Suwa Seriya free medical ambulance service.',
      si: 'සුළු කැපුම් තුවාල, පිළිස්සුම් සහ ක්ලාන්තවීම් සඳහා මූලික ආරක්ෂක පියවර ගන්නා අතරතුර, නොමිලේ ක්‍රියාත්මක 1990 සුවසැරිය ගිලන්රථ සේවාව වහාම අමතන්න.'
    },
    introduction: {
      en: 'First aid provides initial, temporary care to preserve life and prevent condition worsening until qualified medical professionals arrive. It is NOT a replacement for hospital treatment. For any life-threatening situation in Sri Lanka, immediately dial 1990 for Suwa Seriya ambulance care.',
      si: 'ප්‍රථමාධාර යනු වෘත්තීය වෛද්‍ය ප්‍රතිකාර ලැබෙන තුරු ජීවිතය ආරක්ෂා කරගැනීමට සහ තත්ත්වය අයහපත් වීම වැළැක්වීමට දෙන මූලික සත්කාරයයි. එය රෝහල් ප්‍රතිකාර සඳහා ආදේශකයක් නොවේ. බරපතල ඕනෑම අවස්ථාවකදී වහාම නොමිලේ ක්‍රියාත්මක 1990 සුවසැරිය ගිලන්රථ සේවාව අමතන්න.'
    },
    urgencyLevel: 'High',
    tags: {
      en: ['first aid', '1990', 'bleeding', 'burns', 'suwa seriya', 'cpr', 'medical', 'bandage'],
      si: ['ප්‍රථමාධාර', '1990', 'සුවසැරිය', 'තුවාල', 'ලේ ගැලීම', 'පිළිස්සුම්', 'ගිලන්රථය']
    },
    duringStage: {
      heading: {
        en: 'Initial Care for Common Emergency Conditions',
        si: 'පොදු හදිසි අවස්ථාවන් සඳහා මූලික සත්කාර'
      },
      steps: [
        {
          en: 'Severe Bleeding: Apply firm, direct pressure over the wound using a clean sterile cloth or pad. Keep pressure maintained and elevate the limb if no fracture is suspected. Call 1990 immediately.',
          si: 'දැඩි ලේ ගැලීම්: පිරිසිදු වෙළුම් රෙදිකඩක් තුවාලය මත තබා තදින් අල්ලාගෙන සිටින්න. අස්ථි බිඳීමක් නැත්නම් තුවාල වූ අත හෝ පාදය හෘද මට්ටමට වඩා ඉහළින් තබන්න. වහාම 1990 අමතන්න.'
        },
        {
          en: 'Heat or Fire Burns: Hold the burned area under cool running tap water for 10 to 20 minutes. Cover loosely with clean plastic cling wrap or sterile gauze. Do NOT apply ointments, oil, or toothpastes.',
          si: 'පිළිස්සුම් තුවාල: විනාඩි 10-20ක් සිසිල් නළ ජලයට අල්ලාගෙන සිටින්න. පිරිසිදු වෙළුම් පටියකින් ලිහිල්ව ආවරණය කරන්න. තෙල්, දන්තාලේප හෝ වෙනත් දෑ නොතවන්න.'
        },
        {
          en: 'Fainting / Unresponsiveness: Lay the person flat on their back and elevate legs 30 cm if breathing normally. If not breathing, call 1990 and initiate chest compressions.',
          si: 'ක්ලාන්තවීම්: රෝගියා උඩුබැලි අතට බිම තබා, සාමාන්‍ය ලෙස හුස්ම ගන්නේ නම් දෙපා සෙන්ටිමීටර 30ක් ඉහළට ඔසවන්න. හුස්ම නොගන්නේ නම් වහාම 1990 අමතා පපුව තෙරපීමේ ප්‍රථමාධාරය (CPR) අරඹන්න.'
        },
        {
          en: 'Snake Bite: Keep the victim calm and strictly still. Immobilize the bitten limb with a broad splint. Do NOT cut, suck, wash, or apply tight tourniquets. Transport immediately to the nearest hospital via 1990.',
          si: 'සර්ප දෂ්ටනය: රෝගියා කලබල නොවී නිශ්චලව තබන්න. දෂ්ට කළ අත හෝ පාදය නොසෙල්වෙන සේ ලෑල්ලක් තබා බඳින්න. තුවාලය කැපීම, ලේ ඉරීම හෝ තදින් ගැටගැසීම (Tourniquet) කිසිවිටෙකත් නොකරන්න. වහාම 1990 ගිලන්රථයෙන් රෝහලට ගෙන යන්න.'
        }
      ]
    },
    dos: [
      {
        en: 'Keep an organized first-aid kit at home with sterile pads, adhesive bandages, antiseptic, triangular bandage, and medical scissors.',
        si: 'විෂබීජ නාශක, වෙළුම් පටි, ප්ලාස්ටර් සහ කතුරක් සහිත ප්‍රථමාධාර පෙට්ටියක් නිවසේ පිළිවෙලට තබාගන්න.'
      },
      {
        en: 'Wash hands thoroughly before and after dressing any open skin wound.',
        si: 'ඕනෑම තුවාලයකට ප්‍රතිකාර කිරීමට පෙර සහ පසු දෑත් සබන් යොදා හොඳින් සෝදන්න.'
      }
    ],
    donts: [
      {
        en: 'NEVER give food or drink to an unconscious or drowsy person as it can block airways.',
        si: 'සිහිසුන් හෝ මත්ගතියෙන් සිටින පුද්ගලයෙකුට කිසිවිටෙකත් ආහාර හෝ පාන වර්ග නොදෙන්න; එයින් ශ්වසන මාර්ගය අවහිර විය හැකිය.'
      },
      {
        en: 'Do not remove large embedded objects (such as glass shards or metal sticks) from wounds; stabilize them in place and let hospital surgeons extract them.',
        si: 'තුවාල තුළට කිඳාබැස ඇති වීදුරු හෝ ලෝහ කැබලි බලහත්කාරයෙන් නොගලවන්න; ඒවා වටා ආවරණය කර වහාම රෝහලට රැගෙන යන්න.'
      }
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: { en: 'Assess Safety', si: 'ආරක්ෂාව තහවුරු කරන්න' },
        description: {
          en: 'Check if the surrounding area is safe for you before approaching the patient.',
          si: 'රෝගියා අසලට යාමට පෙර එම ස්ථානය ඔබට ආරක්ෂිතදැයි තහවුරු කරගන්න.'
        },
        badge: { en: 'Survey', si: 'පරීක්ෂාව' }
      },
      {
        stepNumber: 2,
        title: { en: 'Apply Direct Pressure', si: 'තදින් අල්ලා සිටින්න' },
        description: {
          en: 'Press a clean cloth firmly against bleeding points without lifting.',
          si: 'ලේ ගලන ස්ථානය මත පිරිසිදු රෙදිකඩක් තබා නොනවත්වා තද කරන්න.'
        },
        badge: { en: 'Treat', si: 'ප්‍රතිකාරය' }
      },
      {
        stepNumber: 3,
        title: { en: 'Call 1990 Ambulance', si: '1990 ගිලන්රථය අමතන්න' },
        description: {
          en: 'Provide your accurate address, patient condition, and stay on the line.',
          si: 'නිවැරදි ලිපිනය සහ රෝගියාගේ තත්ත්වය පවසා සුවසැරිය උපදෙස් ලබාගන්න.'
        },
        badge: { en: 'Dispatch', si: 'ඇමතුම' }
      }
    ],
    checklist: [
      {
        id: 'fa-1',
        text: { en: 'Rolls of sterile conforming bandages and non-stick gauze pads', si: 'පිරිසිදු වෙළුම් පටි සහ විෂබීජ නාශක ගෝස් පැකට්' },
        tip: { en: 'Essential for controlling sudden bleeding and covering cuts', si: 'හදිසි ලේ ගැලීම් පාලනයට සහ තුවාල ආවරණයට අත්‍යවශ්‍ය වේ' }
      },
      {
        id: 'fa-2',
        text: { en: 'Suwa Seriya 1990 app or speed dial saved', si: 'සුවසැරිය 1990 අංකය ස්පීඩ් ඩයල් ලෙස සටහන් කරගැනීම' },
        tip: { en: 'Sri Lanka’s free 24/7 pre-hospital emergency medical service with GPS dispatch', si: 'GPS තාක්ෂණයෙන් ක්‍රියාත්මක ශ්‍රී ලංකාවේ නොමිලේ හදිසි ගිලන්රථ සේවාව' }
      }
    ],
    whenToSeekHelp: {
      en: 'Immediately call 1990 for any chest pain, severe difficulty breathing, unresponsiveness, suspected poisoning, severe trauma, or venomous snakebite.',
      si: 'පපුවේ දැඩි වේදනාව, හුස්ම ගැනීමේ අපහසුව, සිහිසුන් වීම්, විෂ ශරීරගත වීම් හෝ විෂ සහිත සර්ප දෂ්ටනයන් සඳහා වහාම 1990 අමතන්න.'
    },
    officialHotlines: [
      {
        name: { en: '1990 Suwa Seriya Emergency Ambulance', si: '1990 සුවසැරිය හදිසි ගිලන්රථ සේවාව' },
        number: '1990',
        description: { en: 'Free national medical emergency response', si: 'නොමිලේ ක්‍රියාත්මක ජාතික හදිසි වෛද්‍ය ගිලන්රථ සේවාව' }
      },
      {
        name: { en: 'National Poisons Information Centre (Colombo)', si: 'ජාතික විෂ තොරතුරු මධ්‍යස්ථානය (කොළඹ)' },
        number: '011 268 6143',
        description: { en: '24/7 Expert emergency toxicology guidance', si: 'පැය 24 පුරා ක්‍රියාත්මක විශේෂඥ විෂ තොරතුරු සේවාව' }
      }
    ]
  }
];

export const UI_TRANSLATIONS = {
  portalBadge: {
    en: 'Emergency Preparedness Guide',
    si: 'හදිසි ආපදා ආරක්ෂක මාර්ගෝපදේශය'
  },
  pageTitle: {
    en: 'Emergency Help & Safety Guide',
    si: 'හදිසි ආපදා සහ ආරක්ෂක මාර්ගෝපදේශය'
  },
  pageSubtitle: {
    en: 'Learn what to do during emergencies through simple pictures and step-by-step safety instructions.',
    si: 'හදිසි අවස්ථාවලදී ආරක්ෂිතව ක්‍රියා කළ යුතු ආකාරය සරල පින්තූර සහ පියවරෙන් පියවර උපදෙස් මඟින් ඉගෙන ගන්න.'
  },
  citizenDashboardBannerTitle: {
    en: 'Emergency Help & Safety Guide',
    si: 'හදිසි ආපදා සහ ආරක්ෂක මාර්ගෝපදේශය'
  },
  citizenDashboardBannerDesc: {
    en: 'Learn what to do during emergencies through simple pictures and step-by-step safety instructions.',
    si: 'හදිසි අවස්ථාවලදී ආරක්ෂිතව ක්‍රියා කළ යුතු ආකාරය සරල පින්තූර සහ පියවරෙන් පියවර උපදෙස් මඟින් ඉගෙන ගන්න.'
  },
  viewGuideBtn: {
    en: 'View Safety Guide',
    si: 'ආරක්ෂක උපදෙස් බලන්න'
  },
  exploreAllGuides: {
    en: 'Explore All Guides',
    si: 'සියලුම මාර්ගෝපදේශ බලන්න'
  },
  searchPlaceholder: {
    en: 'Search by disaster name (e.g., Flood, Landslide, ගංවතුර, නායයෑම්)...',
    si: 'ආපදා නම අනුව සොයන්න (උදා: ගංවතුර, නායයෑම්, Flood, Cyclone)...'
  },
  filterAll: {
    en: 'All Topics',
    si: 'සියලු මාතෘකා'
  },
  filterWater: {
    en: 'Flood & Tsunami',
    si: 'ගංවතුර සහ සුනාමි'
  },
  filterGeological: {
    en: 'Landslide & Tremor',
    si: 'නායයෑම් සහ කම්පන'
  },
  filterWeather: {
    en: 'Cyclone, Lightning & Drought',
    si: 'සුළි කුණාටු, අකුණු සහ නියඟය'
  },
  filterPreparedness: {
    en: 'Go-Bag & Family Plans',
    si: 'හදිසි බෑගය සහ පවුලේ සැලැස්ම'
  },
  filterHealth: {
    en: 'First-Aid Awareness',
    si: 'ප්‍රථමාධාර දැනුවත් කිරීම'
  },
  resultsCount: {
    en: 'Showing',
    si: 'පෙන්වන්නේ'
  },
  guidesWord: {
    en: 'disaster guides',
    si: 'ආරක්ෂක මාර්ගෝපදේශ'
  },
  noResultsTitle: {
    en: 'No disaster guide found',
    si: 'සොයන ලද මාර්ගෝපදේශය හමු නොවීය'
  },
  noResultsDesc: {
    en: 'Try searching with different keywords in English or Sinhala.',
    si: 'සිංහල හෝ ඉංග්‍රීසි වෙනත් වචන යොදා නැවත සොයා බලන්න.'
  },
  resetSearch: {
    en: 'Reset Search',
    si: 'සෙවීම මුල සිට කරන්න'
  },
  backToGuides: {
    en: 'Back to Safety Guide Directory',
    si: 'ආරක්ෂක මාර්ගෝපදේශ නාමාවලිය වෙත'
  },
  backToDashboard: {
    en: 'Citizen Dashboard',
    si: 'පුරවැසි පුවරුව'
  },
  emergencyHotlinesSection: {
    en: 'Verified Emergency Hotlines',
    si: 'තහවුරු කළ හදිසි ඇමතුම් සේවාවන්'
  },
  educationalDisclaimerTitle: {
    en: 'Educational & Public Safety Information',
    si: 'අධ්‍යාපනික සහ මහජන ආරක්ෂක තොරතුරු'
  },
  educationalDisclaimerDesc: {
    en: 'This guide provides general preparedness knowledge verified against official Sri Lankan disaster management standards. It is not a replacement for live emergency response. In immediate life danger, dial 117 or 1990 directly.',
    si: 'මෙම මාර්ගෝපදේශය ශ්‍රී ලංකා ආපදා කළමනාකරණ ප්‍රමිතීන්ට අනුකූලව සකසන ලද සාමාන්‍ය පූර්ව සූදානම්තා අධ්‍යාපනයකි. මෙය සජීවී ආපදා මෙහෙයුම් සඳහා ආදේශකයක් නොවේ. ජීවිත අවදානමකදී වහාම 117 හෝ 1990 අමතන්න.'
  },
  requestAidCardTitle: {
    en: 'Need Immediate Humanitarian Aid?',
    si: 'ඔබට ක්ෂණික මානුෂීය ආධාර අවශ්‍යද?'
  },
  requestAidCardDesc: {
    en: 'If you or your family require rescue, emergency food rations, safe shelter, or clean drinking water, submit a formal assistance request to our response coordinators.',
    si: 'ඔබට හෝ ඔබේ පවුලට මුදාගැනීම්, හදිසි වියළි ආහාර, ආරක්ෂිත නවාතැන් හෝ පිරිසිදු පානීය ජලය අවශ්‍ය නම්, අපගේ සහන සම්බන්ධීකාරකවරුන් වෙත හදිසි ඉල්ලීමක් යොමු කරන්න.'
  },
  submitRequestBtn: {
    en: 'Submit Emergency Aid Request',
    si: 'හදිසි ආධාර ඉල්ලීමක් යොමු කරන්න'
  },
  stepByStepVisualTitle: {
    en: 'Step-by-Step Visual Action Guide',
    si: 'පියවරෙන් පියවර රූපමය උපදෙස් මාලාව'
  },
  dosAndDontsTitle: {
    en: 'What to Do & What to Avoid',
    si: 'කළ යුතු සහ නොකළ යුතු දේ'
  },
  dosHeading: {
    en: 'Recommended Actions (Do’s)',
    si: 'නිර්දේශිත ක්‍රියාමාර්ග (කළ යුතු දේ)'
  },
  dontsHeading: {
    en: 'Dangerous Actions to Avoid (Don’ts)',
    si: 'වළක්වා ගත යුතු අනතුරුදායක ක්‍රියා (නොකළ යුතු දේ)'
  },
  checklistTitle: {
    en: 'Preparedness Checklist',
    si: 'සූදානම්තා පිරික්සුම් ලැයිස්තුව'
  },
  whenToSeekHelpTitle: {
    en: 'When and How to Seek Help',
    si: 'හදිසි සහය පැතිය යුත්තේ කවදාද සහ කෙසේද'
  },
  langSelectorLabel: {
    en: 'Language / භාෂාව',
    si: 'භාෂාව / Language'
  }
};
