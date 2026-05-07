export type FormData = {
  name: string;
  location: string;
  price: string;
  capacity: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  discount: string;
  image: string;
  status: "available" | "booked";
  amenities: {
    Kitchen: boolean;
    Parking: boolean;
    Pool: boolean;
    WiFi: boolean;
  };
};

export const DEFAULT_FORM: FormData = {
  name: "",
  location: "",
  price: "",
  capacity: "",
  description: "",
  bedrooms: "",
  bathrooms: "",
  discount: "",
  image: "",
  status: "available",
  amenities: {
    Kitchen: false,
    Parking: false,
    Pool: false,
    WiFi: false,
  },
};

export const CITIES = [
  "رام الله",
  "الخليل",
  "بيت لحم",
  "نابلس",
  "أريحا",
  "قلقيلية",
  "سلفيت",
  "جنين",
  "طولكرم",
];

export const AMENITY_LABELS: Record<keyof FormData["amenities"], string> = {
  Kitchen: "مطبخ",
  Parking: "موقف سيارات",
  Pool: "مسبح",
  WiFi: "واي فاي",
};

