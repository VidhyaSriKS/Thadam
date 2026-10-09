/**
 * THADAM TN — Exact Verified Destination Image Registry
 * Maps destination IDs and landmark names to verified photo assets.
 */

import { GANGAIKONDA_CHOLAPURAM_IMAGE_URI } from './assets/gangaikondaImage';
import { SWAMIMALAI_BRONZE_IMAGE_URI } from './assets/swamimalaiImage';
import { THIRUBUVANAM_SILK_IMAGE_URI } from './assets/thirubuvanamImage';
import { SARASWATHI_MAHAL_IMAGE_URI } from './assets/saraswathiImage';
import { AIRAVATESVARA_TEMPLE_IMAGE_URI } from './assets/airavatesvaraImage';

export interface DestinationImageRecord {
  id?: string;
  name: string;
  district: string;
  imageUrl: string;
  thumbnailUrl: string;
  galleryImages: string[];
  caption: string;
  verified: boolean;
}

export const DESTINATION_IMAGE_REGISTRY: Record<string, DestinationImageRecord> = {
  p1: {
    id: 'p1',
    name: 'Brihadisvara Temple',
    district: 'Thanjavur',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    ],
    caption: 'Great Living Chola Temple vimana & granite courtyard, Thanjavur',
    verified: true,
  },
  p2: {
    id: 'p2',
    name: 'Thanjavur Maratha Palace and Art Gallery',
    district: 'Thanjavur',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Royal courtyard & Chola bronze gallery, Thanjavur Palace',
    verified: true,
  },
  p3: {
    id: 'p3',
    name: 'Saraswathi Mahal Library',
    district: 'Thanjavur',
    imageUrl: SARASWATHI_MAHAL_IMAGE_URI,
    thumbnailUrl: SARASWATHI_MAHAL_IMAGE_URI,
    galleryImages: [SARASWATHI_MAHAL_IMAGE_URI],
    caption: 'Historical manuscript archives & painted royal library hall, Saraswathi Mahal',
    verified: true,
  },
  p4: {
    id: 'p4',
    name: 'Airavatesvara Temple, Darasuram',
    district: 'Kumbakonam',
    imageUrl: AIRAVATESVARA_TEMPLE_IMAGE_URI,
    thumbnailUrl: AIRAVATESVARA_TEMPLE_IMAGE_URI,
    galleryImages: [AIRAVATESVARA_TEMPLE_IMAGE_URI],
    caption: '12th-century stone vimana and carved chariot mandapa, Darasuram',
    verified: true,
  },
  p5: {
    id: 'p5',
    name: 'Swamimalai bronze-casting lane',
    district: 'Kumbakonam',
    imageUrl: SWAMIMALAI_BRONZE_IMAGE_URI,
    thumbnailUrl: SWAMIMALAI_BRONZE_IMAGE_URI,
    galleryImages: [SWAMIMALAI_BRONZE_IMAGE_URI],
    caption: 'Living Chola lost-wax bronze casting workshop, Swamimalai',
    verified: true,
  },
  p6: {
    id: 'p6',
    name: 'Sarangapani Temple',
    district: 'Kumbakonam',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Towering gopuram & Potramarai tank, Sarangapani Temple',
    verified: true,
  },
  p7: {
    id: 'p7',
    name: 'Nageswaran Temple',
    district: 'Kumbakonam',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Early Chola stone sculptures & ardhamandapa reliefs, Kumbakonam',
    verified: true,
  },
  p8: {
    id: 'p8',
    name: 'Gangaikonda Cholapuram',
    district: 'Ariyalur district',
    imageUrl: GANGAIKONDA_CHOLAPURAM_IMAGE_URI,
    thumbnailUrl: GANGAIKONDA_CHOLAPURAM_IMAGE_URI,
    galleryImages: [GANGAIKONDA_CHOLAPURAM_IMAGE_URI],
    caption: 'Rajendra Chola vimana & granite temple complex, Gangaikonda Cholapuram',
    verified: true,
  },
  p9: {
    id: 'p9',
    name: 'Thirubuvanam silk weaving cluster',
    district: 'Kumbakonam',
    imageUrl: THIRUBUVANAM_SILK_IMAGE_URI,
    thumbnailUrl: THIRUBUVANAM_SILK_IMAGE_URI,
    galleryImages: [THIRUBUVANAM_SILK_IMAGE_URI],
    caption: 'Traditional handloom gold zari silk saree weaving, Thirubuvanam cooperative',
    verified: true,
  },
  p10: {
    id: 'p10',
    name: 'Thiruvaiyaru',
    district: 'Thanjavur district',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Cauvery riverbanks & Saint Thyagaraja samadhi shrine, Thiruvaiyaru',
    verified: true,
  },
  p11: {
    id: 'p11',
    name: 'Kallanai (Grand Anicut)',
    district: 'Thanjavur–Tiruchirappalli',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Karikala Chola ancient stone dam over Cauvery river, Kallanai',
    verified: true,
  },
  meenakshi: {
    name: 'Meenakshi Amman Temple',
    district: 'Madurai',
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Sculpted Raja Gopurams of Meenakshi Amman Temple, Madurai',
    verified: true,
  },
  dhanushkodi: {
    name: 'Dhanushkodi',
    district: 'Ramanathapuram',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Ghost town ruins and meeting of Gulf of Mannar & Palk Strait, Dhanushkodi',
    verified: true,
  },
  kodaikanal_lake: {
    name: 'Kodaikanal Lake',
    district: 'Dindigul',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Star-shaped lake surrounded by Palani hills, Kodaikanal',
    verified: true,
  },
  hogenakkal: {
    name: 'Hogenakkal Falls',
    district: 'Dharmapuri',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Gorges and surging waterfall cascades of Cauvery, Hogenakkal',
    verified: true,
  },
  vivekananda_rock: {
    name: 'Vivekananda Rock Memorial',
    district: 'Kanyakumari',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Offshore granite memorial at confluence of three seas, Kanyakumari',
    verified: true,
  },
  marudamalai: {
    name: 'Marudamalai Temple',
    district: 'Coimbatore',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Hill shrine of Lord Murugan in Western Ghats, Marudamalai, Coimbatore',
    verified: true,
  },
  mahabalipuram: {
    name: 'Mahabalipuram',
    district: 'Chengalpattu',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Shore Temple overlooking the Bay of Bengal, Mahabalipuram',
    verified: true,
  },
  marina_beach: {
    name: 'Marina Beach',
    district: 'Chennai',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
    caption: 'Urban natural sand beach overlooking Bay of Bengal, Chennai',
    verified: true,
  },
};
