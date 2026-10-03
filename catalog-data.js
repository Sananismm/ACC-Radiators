/* Existing catalog specifications; confirm with ACC before publication. */
(function (root) {
  "use strict";
  var products = [
  {
    "make": "Suzuki",
    "model": "Alto",
    "name": "Suzuki Alto 660cc (2019-2024)",
    "slug": "suzuki-alto",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Manual / AGS",
    "part": "ACC-SZ-0660",
    "thickness": 16
  },
  {
    "make": "Suzuki",
    "model": "Cultus",
    "name": "Suzuki Cultus (2017-2024)",
    "slug": "suzuki-cultus",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Manual / AGS",
    "part": "ACC-SZ-0998",
    "thickness": 16
  },
  {
    "make": "Suzuki",
    "model": "Bolan",
    "name": "Suzuki Bolan (2000-2024)",
    "slug": "suzuki-bolan",
    "material": "Copper-Brass",
    "core": "Copper-Brass Core | Brass Tanks",
    "transmission": "Manual",
    "part": "ACC-SZ-0796",
    "thickness": 26
  },
  {
    "make": "Toyota",
    "model": "Corolla",
    "name": "Toyota Corolla Altis (2014-2024)",
    "slug": "toyota-corolla",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Automatic (CVT) with Oil Cooler / Manual",
    "part": "ACC-TY-0824",
    "thickness": 16
  },
  {
    "make": "Toyota",
    "model": "Yaris",
    "name": "Toyota Yaris (2020-2024)",
    "slug": "toyota-yaris",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Automatic (CVT) with Oil Cooler / Manual",
    "part": "ACC-TY-0920",
    "thickness": 16
  },
  {
    "make": "Toyota",
    "model": "Hilux",
    "name": "Toyota Hilux / Revo (2016-2024)",
    "slug": "toyota-hilux",
    "material": "All-Aluminum",
    "core": "TIG-Welded All-Aluminum Core",
    "transmission": "Automatic with Oil Cooler / Manual",
    "part": "ACC-TY-1635",
    "thickness": 32
  },
  {
    "make": "Honda",
    "model": "Civic",
    "name": "Honda Civic Oriel / Turbo (2016-2024)",
    "slug": "honda-civic",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Automatic (CVT) with Oil Cooler",
    "part": "ACC-HN-1630",
    "thickness": 16
  },
  {
    "make": "Honda",
    "model": "City",
    "name": "Honda City 1.2 / 1.5 (2009-2024)",
    "slug": "honda-city",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Automatic (CVT) with Oil Cooler / Manual",
    "part": "ACC-HN-1225",
    "thickness": 16
  },
  {
    "make": "Hyundai",
    "model": "Tucson",
    "name": "Hyundai Tucson (2020-2024)",
    "slug": "hyundai-tucson",
    "material": "All-Aluminum",
    "core": "TIG-Welded All-Aluminum Core",
    "transmission": "Automatic with Oil Cooler",
    "part": "ACC-HY-2036",
    "thickness": 34
  },
  {
    "make": "KIA",
    "model": "Sportage",
    "name": "KIA Sportage (2019-2024)",
    "slug": "kia-sportage",
    "material": "All-Aluminum",
    "core": "TIG-Welded All-Aluminum Core",
    "transmission": "Automatic with Oil Cooler",
    "part": "ACC-KI-1934",
    "thickness": 34
  },
  {
    "make": "Changan",
    "model": "Alsvin",
    "name": "Changan Alsvin (2021-2024)",
    "slug": "changan-alsvin",
    "material": "Plastic-Aluminum",
    "core": "Brazed Aluminum Core | Plastic Tanks",
    "transmission": "Automatic (DCT) with Oil Cooler / Manual",
    "part": "ACC-CH-2116",
    "thickness": 16
  },
  {
    "make": "Haval",
    "model": "H6",
    "name": "Haval H6 / H6 HEV (2021-2024)",
    "slug": "haval-h6",
    "material": "All-Aluminum",
    "core": "TIG-Welded All-Aluminum Core",
    "transmission": "Automatic (DCT) with Oil Cooler",
    "part": "ACC-HV-2136",
    "thickness": 34
  }
];
  var catalog = { products: products };
  if (typeof module === "object" && module.exports) module.exports = catalog;
  else root.ACCCatalog = catalog;
})(typeof globalThis !== "undefined" ? globalThis : this);
