import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_LOGOS_DIR = path.resolve(process.cwd(), 'data/raw-logos');

export const VERIFIED_BD_UNIVERSITIES = [
  // 1. DU
  {
    name: 'University of Dhaka',
    slug: 'university-of-dhaka',
    acronym: 'DU UD',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Dhaka_University_logo.svg/800px-Dhaka_University_logo.svg.png',
    domain: 'du.ac.bd'
  },
  // 2. BUET
  {
    name: 'Bangladesh University of Engineering and Technology',
    slug: 'bangladesh-university-of-engineering-and-technology',
    acronym: 'BUET',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/BUET_LOGO.svg/800px-BUET_LOGO.svg.png',
    domain: 'buet.ac.bd'
  },
  // 3. Khulna University (AUTHENTIC KU SEAL, NOT KUET!)
  {
    name: 'Khulna University',
    slug: 'khulna-university',
    acronym: 'KU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Khulna_University_Logo.svg/800px-Khulna_University_Logo.svg.png',
    domain: 'ku.ac.bd'
  },
  // 4. KUET
  {
    name: 'Khulna University of Engineering & Technology',
    slug: 'khulna-university-of-engineering-and-technology',
    acronym: 'KUET',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Khulna_University_of_Engineering_and_Technology.png',
    domain: 'kuet.ac.bd'
  },
  // 5. National University, Bangladesh (MASSIVE ENROLLMENT)
  {
    name: 'National University, Bangladesh',
    slug: 'national-university-bangladesh',
    acronym: 'NU NUBD NUB',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/National_University%2C_Bangladesh_crest.svg/800px-National_University%2C_Bangladesh_crest.svg.png',
    domain: 'nu.ac.bd'
  },
  // 6. BAU
  {
    name: 'Bangladesh Agricultural University',
    slug: 'bangladesh-agricultural-university',
    acronym: 'BAU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Bangladesh_Agriculture_University_logo.svg/800px-Bangladesh_Agriculture_University_logo.svg.png',
    domain: 'bau.edu.bd'
  },
  // 7. BUTEX
  {
    name: 'Bangladesh University of Textiles',
    slug: 'bangladesh-university-of-textiles',
    acronym: 'BUTEX',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Bangladesh_University_of_Textiles_logo.svg/800px-Bangladesh_University_of_Textiles_logo.svg.png',
    domain: 'butex.edu.bd'
  },
  // 8. BOU
  {
    name: 'Bangladesh Open University',
    slug: 'bangladesh-open-university',
    acronym: 'BOU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Seal_of_the_Bangladesh_Open_University_%28BOU%29.svg/800px-Seal_of_the_Bangladesh_Open_University_%28BOU%29.svg.png',
    domain: 'bou.ac.bd'
  },
  // 9. Jahangirnagar University
  {
    name: 'Jahangirnagar University',
    slug: 'jahangirnagar-university',
    acronym: 'JU',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Jahangirnagar_University_logo.svg/800px-Jahangirnagar_University_logo.svg.png',
    domain: 'juniv.edu'
  },
  // 10. University of Rajshahi
  {
    name: 'University of Rajshahi',
    slug: 'university-of-rajshahi',
    acronym: 'RU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/University_of_Rajshahi.png',
    domain: 'ru.ac.bd'
  },
  // 11. University of Chittagong
  {
    name: 'University of Chittagong',
    slug: 'university-of-chittagong',
    acronym: 'CU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/University_of_Chittagong.png',
    domain: 'cu.ac.bd'
  },
  // 12. SUST
  {
    name: 'Shahjalal University of Science and Technology',
    slug: 'shahjalal-university-of-science-and-technology',
    acronym: 'SUST',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Shahjalal_University_of_Science_and_Technology.png',
    domain: 'sust.edu'
  },
  // 13. Islamic University (Kushtia)
  {
    name: 'Islamic University, Bangladesh',
    slug: 'islamic-university-kushtia',
    acronym: 'IU IUK',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Islamic_University%2C_Bangladesh_logo.svg/800px-Islamic_University%2C_Bangladesh_logo.svg.png',
    domain: 'iu.ac.bd'
  },
  // 14. CUET
  {
    name: 'Chittagong University of Engineering and Technology',
    slug: 'chittagong-university-of-engineering-and-technology',
    acronym: 'CUET',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Chittagong_University_of_Engineering_and_Technology.png',
    domain: 'cuet.ac.bd'
  },
  // 15. RUET
  {
    name: 'Rajshahi University of Engineering and Technology',
    slug: 'rajshahi-university-of-engineering-and-technology',
    acronym: 'RUET',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Rajshahi_University_of_Engineering_and_Technology.png',
    domain: 'ruet.ac.bd'
  },
  // 16. DUET
  {
    name: 'Dhaka University of Engineering and Technology',
    slug: 'dhaka-university-of-engineering-and-technology',
    acronym: 'DUET',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Dhaka_University_of_Engineering_and_Technology.png',
    domain: 'duet.ac.bd'
  },
  // 17. Jagannath University
  {
    name: 'Jagannath University',
    slug: 'jagannath-university',
    acronym: 'JnU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Jagannath_University.png',
    domain: 'jnu.ac.bd'
  },
  // 18. Comilla University
  {
    name: 'Comilla University',
    slug: 'comilla-university',
    acronym: 'CoU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/65/Logo_of_Comilla_University.png',
    domain: 'cou.ac.bd'
  },
  // 19. JKKNIU
  {
    name: 'Jatiya Kabi Kazi Nazrul Islam University',
    slug: 'jatiya-kabi-kazi-nazrul-islam-university',
    acronym: 'JKKNIU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Jatiya_Kabi_Kazi_Nazrul_Islam_University.png',
    domain: 'jkkniu.edu.bd'
  },
  // 20. BUP
  {
    name: 'Bangladesh University of Professionals',
    slug: 'bangladesh-university-of-professionals',
    acronym: 'BUP',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Bangladesh_University_of_Professionals_%28BUP%29_Logo.svg/800px-Bangladesh_University_of_Professionals_%28BUP%29_Logo.svg.png',
    domain: 'bup.edu.bd'
  },
  // 21. Begum Rokeya University
  {
    name: 'Begum Rokeya University, Rangpur',
    slug: 'begum-rokeya-university-rangpur',
    acronym: 'BRUR',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Begum_Rokeya_University_Rangpur.png',
    domain: 'brur.ac.bd'
  },
  // 22. NSTU
  {
    name: 'Noakhali Science and Technology University',
    slug: 'noakhali-science-and-technology-university',
    acronym: 'NSTU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Noakhali_Science_and_Technology_University.png',
    domain: 'nstu.edu.bd'
  },
  // 23. MBSTU
  {
    name: 'Mawlana Bhashani Science And Technology University',
    slug: 'mawlana-bhashani-science-and-technology-university',
    acronym: 'MBSTU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Mawlana_Bhashani_Science_and_Technology_University.png',
    domain: 'mbstu.ac.bd'
  },
  // 24. HSTU
  {
    name: 'Hajee Mohammad Danesh Science and Technology University',
    slug: 'hajee-mohammad-danesh-science-and-technology-university',
    acronym: 'HSTU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Hajee_Mohammad_Danesh_Science_and_Technology_University.png',
    domain: 'hstu.ac.bd'
  },
  // 25. PUST
  {
    name: 'Pabna University of Science and Technology',
    slug: 'pabna-university-of-science-and-technology',
    acronym: 'PUST',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Pabna_University_of_Science_and_Technology.png',
    domain: 'pust.ac.bd'
  },
  // 26. JUST
  {
    name: 'Jashore University of Science and Technology',
    slug: 'jashore-university-of-science-and-technology',
    acronym: 'JUST',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Jashore_University_of_Science_and_Technology.png',
    domain: 'just.edu.bd'
  },
  // 27. PSTU
  {
    name: 'Patuakhali Science and Technology University',
    slug: 'patuakhali-science-and-technology-university',
    acronym: 'PSTU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Patuakhali_Science_and_Technology_University_logo.png',
    domain: 'pstu.ac.bd'
  },
  // 28. BSMRAU
  {
    name: 'Bangabandhu Sheikh Mujibur Rahman Agricultural University',
    slug: 'bangabandhu-sheikh-mujibur-rahman-agricultural-university',
    acronym: 'BSMRAU',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/BSMRAU.png',
    domain: 'bsmrau.edu.bd'
  },
  // 29. BSMMU
  {
    name: 'Bangabandhu Sheikh Mujib Medical University',
    slug: 'bangabandhu-sheikh-mujibur-rahman-medical-university',
    acronym: 'BSMMU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Bangladesh_Medical_University_Logo.png',
    domain: 'bsmmu.ac.bd'
  },
  // 30. BSMRMU
  {
    name: 'Bangabandhu Sheikh Mujibur Rahman Maritime University',
    slug: 'bangladesh-maritime-university',
    acronym: 'BSMRMU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/e9/Logo_of_Bangladesh_Maritime_University.png',
    domain: 'bsmrmu.edu.bd'
  },
  // 31. BSMRSTU
  {
    name: 'Bangabandhu Sheikh Mujibur Rahman Science and Technology University',
    slug: 'bangabandhu-sheikh-mujibur-rahman-science-and-technology-university',
    acronym: 'BSMRSTU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Gopalganj_Science_and_Technology_University.png',
    domain: 'bsmrstu.edu.bd'
  },
  // 32. Sylhet Agricultural University
  {
    name: 'Sylhet Agricultural University',
    slug: 'sylhet-agricultural-university',
    acronym: 'SAU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/2/23/StAU_logo_main.jpeg',
    domain: 'sau.ac.bd'
  },
  // 33. University of Barishal
  {
    name: 'University of Barishal',
    slug: 'university-of-barishal',
    acronym: 'BU BUBarishal',
    source: 'official',
    url: 'https://bu.ac.bd/assets/img/main-logo.png',
    domain: 'bu.ac.bd'
  },
  // 34. Rabindra University
  {
    name: 'Rabindra University, Bangladesh',
    slug: 'rabindra-university-bangladesh',
    acronym: 'RUB',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Rabindra_University_Bangladesh.png',
    domain: 'rub.ac.bd'
  },
  // 35. Islamic Arabic University
  {
    name: 'Islamic Arabic University',
    slug: 'islamic-arabic-university',
    acronym: 'IAU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/ec/Islamic_Arabic_University.png',
    domain: 'iau.edu.bd'
  },
  // 36. MIST
  {
    name: 'Military Institute of Science and Technology',
    slug: 'military-institute-of-science-and-technology',
    acronym: 'MIST',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Military_Institute_of_Science_and_Technology.png',
    domain: 'mist.ac.bd'
  },
  // 37. IUT
  {
    name: 'Islamic University of Technology',
    slug: 'islamic-university-of-technology',
    acronym: 'IUT OIC',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Islamic_University_of_Technology.png',
    domain: 'iutoic-dhaka.edu'
  },
  // 38. North South University
  {
    name: 'North South University',
    slug: 'north-south-university',
    acronym: 'NSU',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/77/North_South_University_seal.svg/800px-North_South_University_seal.svg.png',
    domain: 'northsouth.edu'
  },
  // 39. BRAC University
  {
    name: 'Brac University',
    slug: 'brac-university',
    acronym: 'BRAC BRACU',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BRAC_University_logo.svg/800px-BRAC_University_logo.svg.png',
    domain: 'bracu.ac.bd'
  },
  // 40. IUB
  {
    name: 'Independent University, Bangladesh',
    slug: 'independent-university-bangladesh',
    acronym: 'IUB',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Independent_University_Bangladesh.png',
    domain: 'iub.edu.bd'
  },
  // 41. AUST
  {
    name: 'Ahsanullah University of Science & Technology',
    slug: 'ahsanullah-university-of-science-technology',
    acronym: 'AUST',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Ahsanullah_University_of_Science_and_Technology.png',
    domain: 'aust.edu'
  },
  // 42. AIUB
  {
    name: 'American International University - Bangladesh',
    slug: 'american-international-university-bangladesh',
    acronym: 'AIUB',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/American_International_University-Bangladesh.png',
    domain: 'aiub.edu'
  },
  // 43. EWU
  {
    name: 'East West University',
    slug: 'east-west-university',
    acronym: 'EWU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/East_West_University.png',
    domain: 'ewubd.edu'
  },
  // 44. UIU
  {
    name: 'United International University',
    slug: 'united-international-university',
    acronym: 'UIU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/United_International_University.png',
    domain: 'uiu.ac.bd'
  },
  // 45. DIU
  {
    name: 'Daffodil International University',
    slug: 'daffodil-international-university',
    acronym: 'DIU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Daffodil_International_University.png',
    domain: 'daffodilvarsity.edu.bd'
  },
  // 46. UAP
  {
    name: 'University of Asia Pacific, Dhanmondi',
    slug: 'university-of-asia-pacific-dhanmondi',
    acronym: 'UAP',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/University_of_Asia_Pacific.png',
    domain: 'uap-bd.edu'
  },
  // 47. ULAB
  {
    name: 'University of Liberal Arts',
    slug: 'university-of-liberal-arts',
    acronym: 'ULAB',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/University_of_Liberal_Arts_Bangladesh.png',
    domain: 'ulab.edu.bd'
  },
  // 48. Green University of Bangladesh
  {
    name: 'Green University of Bangladesh',
    slug: 'green-university-of-bangladesh',
    acronym: 'GUB',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Green_University_of_Bangladesh.png',
    domain: 'green.edu.bd'
  },
  // 49. Southeast University (AUTHENTIC BANGLADESH LOGO, NOT CHINA!)
  {
    name: 'Southeast University',
    slug: 'southeast-university',
    acronym: 'SEU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Southeast_University_%28Bangladesh%29_%28logo%29.png',
    domain: 'seu.edu.bd'
  },
  // 50. BUBT
  {
    name: 'Bangladesh University of Business & Technology',
    slug: 'bangladesh-university-of-business-technology',
    acronym: 'BUBT',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Bangladesh_University_of_Business_and_Technology.png',
    domain: 'bubt.edu.bd'
  },
  // 51. Bangladesh University (AUTHENTIC BU BANNER/SEAL, NOT BUBT!)
  {
    name: 'Bangladesh University',
    slug: 'bangladesh-university',
    acronym: 'BU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/1/14/BU_logo_banner.png',
    domain: 'bu.edu.bd'
  },
  // 52. Dhaka International University
  {
    name: 'Dhaka International University',
    slug: 'dhaka-international-university',
    acronym: 'DIU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Dhaka_International_University.png',
    domain: 'diu.ac'
  },
  // 53. East Delta University
  {
    name: 'East Delta University',
    slug: 'east-delta-university',
    acronym: 'EDU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/East_Delta_University.png',
    domain: 'eastdelta.edu.bd'
  },
  // 54. IIUC
  {
    name: 'International Islamic University Chittagong',
    slug: 'international-islamic-university-chittagong',
    acronym: 'IIUC',
    source: 'official',
    url: 'https://www.iiuc.ac.bd/assets/logo-Bkv-wivQ.webp',
    domain: 'iiuc.ac.bd'
  },
  // 55. IUBAT
  {
    name: 'International University of Business Agriculture and Technology',
    slug: 'international-university-of-business-agriculture-and-technology',
    acronym: 'IUBAT',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f0/IUBAT2.png',
    domain: 'iubat.edu'
  },
  // 56. Stamford University Bangladesh
  {
    name: 'Stamford University',
    slug: 'stamford-university',
    acronym: 'SUB Stamford',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Stamford_University_Bangladesh_Logo.svg/800px-Stamford_University_Bangladesh_Logo.svg.png',
    domain: 'stamforduniversity.edu.bd'
  },
  // 57. State University of Bangladesh
  {
    name: 'State University of Bangladesh',
    slug: 'state-university-of-bangladesh',
    acronym: 'SUB',
    source: 'wikimedia-commons',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Updated_SUB_Logo.jpg',
    domain: 'sub.edu.bd'
  },
  // 58. Primeasia University
  {
    name: 'Primeasia University',
    slug: 'primeasia-university',
    acronym: 'PAU Primeasia',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/90/Primeasia_University_logo.png',
    domain: 'primeasia.edu.bd'
  },
  // 59. Eastern University
  {
    name: 'Eastern University',
    slug: 'eastern-university',
    acronym: 'EU Eastern',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/EU_SEAL.svg/800px-EU_SEAL.svg.png',
    domain: 'easternuni.edu.bd'
  },
  // 60. Northern University Bangladesh
  {
    name: 'Northern University Bangladesh',
    slug: 'northern-university-bangladesh',
    acronym: 'NUB Northern',
    source: 'amaruni',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/northern_university_bangladesh.svg',
    domain: 'nub.ac.bd'
  },
  // 61. Premier University (Chittagong)
  {
    name: 'Premier University',
    slug: 'premier-university',
    acronym: 'PU Premier',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/78/Logo_of_Premier_University_%28PU%29.png',
    domain: 'puc.ac.bd'
  },
  // 62. Presidency University
  {
    name: 'Presidency University',
    slug: 'presidency-university',
    acronym: 'PU Presidency',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Presidency_University%2C_Bangladesh_Logo.svg/800px-Presidency_University%2C_Bangladesh_Logo.svg.png',
    domain: 'presidency.edu.bd'
  },
  // 63. City University
  {
    name: 'City University',
    slug: 'city-university',
    acronym: 'CU City',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/ff/City_University_%28Bangladesh%29_logo.png',
    domain: 'cityuniversity.edu.bd'
  },
  // 64. BGC Trust University Bangladesh
  {
    name: 'BGC Trust University, Bangladesh',
    slug: 'bgc-trust-university-bangladesh',
    acronym: 'BGCTUB BGC',
    source: 'bn-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/bn/0/03/%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A6%BF%E0%A6%B8%E0%A6%BF_%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%9F_%E0%A6%AC%E0%A6%BF%E0%A6%B6%E0%A7%8D%E0%A6%AC%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png',
    domain: 'bgctub.ac.bd'
  },
  // 65. World University of Bangladesh
  {
    name: 'World University of Bangladesh',
    slug: 'world-university-of-bangladesh',
    acronym: 'WUB',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/91/World_University_of_Bangladesh_logo.jpg',
    domain: 'wub.edu.bd'
  },
  // 66. BUFT
  {
    name: 'BGMEA University of Fashion & Technology',
    slug: 'bgmea-university-of-fashion-technology',
    acronym: 'BUFT',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/e0/BGMEA_University_of_Fashion_%26_Technology_logo.png',
    domain: 'buft.edu.bd'
  },
  // 67. Port City International University
  {
    name: 'Port City International University',
    slug: 'port-city-international-university',
    acronym: 'PCIU',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Port_City_International_University.png',
    domain: 'portcity.edu.bd'
  },
  // 68. Sonargaon University
  {
    name: 'Sonargaon University',
    slug: 'sonargaon-university',
    acronym: 'SU Sonargaon',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Sonargaon_University.png',
    domain: 'su.edu.bd'
  },
  // 69. Uttara University
  {
    name: 'Uttara University',
    slug: 'uttara-university',
    acronym: 'UU Uttara',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Uttara_University.png',
    domain: 'uttarauniversity.edu.bd'
  },
  // 70. Canadian University of Bangladesh
  {
    name: 'Canadian University of Bangladesh',
    slug: 'canadian-university-of-bangladesh',
    acronym: 'CUB Canadian',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Canadian_University_of_Bangladesh.png',
    domain: 'cub.edu.bd'
  },
  // 71. BAIUST
  {
    name: 'Bangladesh Army International University of Science and Technology',
    slug: 'bangladesh-army-international-university-of-science-and-technology',
    acronym: 'BAIUST',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/Bangladesh_Army_International_University_of_Science_and_Technology.png',
    domain: 'baiust.edu.bd'
  },
  // 72. UITS
  {
    name: 'University of Information Technology & Sciences',
    slug: 'university-of-information-technology-sciences',
    acronym: 'UITS',
    source: 'mrmajharul',
    url: 'https://raw.githubusercontent.com/MrMajharul/bangladeshi-university-logos/master/logos/University_of_Information_Technology_and_Sciences.png',
    domain: 'uits.edu.bd'
  },
  // 73. USTC
  {
    name: 'University of Science & Technology Chittagong',
    slug: 'university-of-science-technology-chittagong',
    acronym: 'USTC',
    source: 'amaruni',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/university_of_science_and_technology_chittagong.svg',
    domain: 'ustc.ac.bd'
  },
  // 74. Notre Dame University Bangladesh
  {
    name: 'Notre Dame University Bangladesh',
    slug: 'notre-dame-university-bangladesh',
    acronym: 'NDUB ND',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Notre_Dame_University_Bangladesh_Monogram.svg/800px-Notre_Dame_University_Bangladesh_Monogram.svg.png',
    domain: 'ndub.edu.bd'
  },
  // 75. Asian University of Bangladesh
  {
    name: 'Asian University of Bangladesh',
    slug: 'asian-university-of-bangladesh',
    acronym: 'AUB Asian',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Asian_University_of_Bangladesh_Logo.jpg',
    domain: 'aub.edu.bd'
  },
  // 76. People's University of Bangladesh
  {
    name: "People's University of Bangladesh",
    slug: 'people-s-university-of-bangladesh',
    acronym: 'PUB Peoples',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/94/People%27s_University_of_Bangladesh_logo.jpg',
    domain: 'pub.ac.bd'
  },
  // 77. Victoria University of Bangladesh
  {
    name: 'Victoria University of Bangladesh',
    slug: 'victoria-university-of-bangladesh',
    acronym: 'VUB Victoria',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Victoria_University_of_Bangladesh_%28logo%29.png',
    domain: 'vub.edu.bd'
  },
  // 78. Queens University
  {
    name: 'Queens University',
    slug: 'queens-university',
    acronym: 'QU Queens',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/4/41/Queens_University_%28Bangladesh%29_%28logo%29.jpg',
    domain: 'queensuniversity.edu.bd'
  },
  // 79. Bangladesh Islami University
  {
    name: 'Bangladesh Islami University',
    slug: 'bangladesh-islami-university',
    acronym: 'BIU',
    source: 'en-wikipedia',
    url: 'https://upload.wikimedia.org/wikipedia/en/1/15/Bangladesh_Islami_University_%28crest%29.png',
    domain: 'biu.ac.bd'
  }
];

async function downloadLogo(item) {
  const extMatch = item.url.match(/\.(png|svg|jpg|jpeg|webp)/i);
  let ext = extMatch ? extMatch[1].toLowerCase() : 'png';
  if (item.url.includes('.svg/')) {
    ext = 'png';
  }

  const outPath = path.join(RAW_LOGOS_DIR, `${item.slug}.${ext}`);

  try {
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AssignmentCoverMaker/1.0'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) {
      throw new Error(`Downloaded file too small (${buffer.length} bytes)`);
    }

    // Clean up any old files with different extensions
    const exts = ['png', 'svg', 'jpg', 'jpeg', 'webp'];
    for (const oldExt of exts) {
      const oldFile = path.join(RAW_LOGOS_DIR, `${item.slug}.${oldExt}`);
      if (oldFile !== outPath) {
        try { await fs.unlink(oldFile); } catch {}
      }
    }

    await fs.writeFile(outPath, buffer);
    console.log(`✅ [${item.slug}] Saved ${ext.toUpperCase()} (${(buffer.length / 1024).toFixed(1)} KB) from ${item.source}`);
    return true;
  } catch (err) {
    console.error(`❌ [${item.slug}] Failed to download from ${item.url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('🇧🇩 Curating Verified Bangladeshi University Logos...');
  console.log('==================================================');
  await fs.mkdir(RAW_LOGOS_DIR, { recursive: true });

  let success = 0;
  let failed = 0;

  for (const item of VERIFIED_BD_UNIVERSITIES) {
    const ok = await downloadLogo(item);
    if (ok) success++;
    else failed++;
  }

  console.log('\n==================================================');
  console.log(`🎉 Finished: ${success} downloaded successfully, ${failed} failed.`);
}

if (process.argv[1] && process.argv[1].endsWith('curate-bd-logos.mjs')) {
  run();
}

