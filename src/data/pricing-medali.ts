export interface PriceOption {
  label: string
  price: number
}

export interface MaterialSize {
  thickness: string
  size: string
  key: string
  price: number
}

export interface MarkupTier {
  minQty: number
  label: string
  percent: number
}

// Semua ukuran bahan dari sheet "Ukuran Bahan"
export const materialPrices: MaterialSize[] = [
  // 0.4mm
  { thickness: "0.4mm", size: "3cm", key: "0.4mm - 3cm", price: 600 },
  { thickness: "0.4mm", size: "4cm", key: "0.4mm - 4cm", price: 1100 },
  { thickness: "0.4mm", size: "5cm", key: "0.4mm - 5cm", price: 1400 },
  { thickness: "0.4mm", size: "5.5cm", key: "0.4mm - 5.5cm", price: 1800 },
  { thickness: "0.4mm", size: "5.9cm", key: "0.4mm - 5.9cm", price: 2000 },
  { thickness: "0.4mm", size: "6.5cm", key: "0.4mm - 6.5cm", price: 2700 },
  { thickness: "0.4mm", size: "7cm", key: "0.4mm - 7cm", price: 2900 },
  { thickness: "0.4mm", size: "7.5cm", key: "0.4mm - 7.5cm", price: 3750 },
  { thickness: "0.4mm", size: "8cm", key: "0.4mm - 8cm", price: 4100 },
  { thickness: "0.4mm", size: "8.5cm", key: "0.4mm - 8.5cm", price: 4400 },
  { thickness: "0.4mm", size: "9cm", key: "0.4mm - 9cm", price: 4400 },
  { thickness: "0.4mm", size: "9.5cm", key: "0.4mm - 9.5cm", price: 6300 },
  { thickness: "0.4mm", size: "10cm", key: "0.4mm - 10cm", price: 7000 },
  { thickness: "0.4mm", size: "11cm", key: "0.4mm - 11cm", price: 7500 },
  { thickness: "0.4mm", size: "12cm", key: "0.4mm - 12cm", price: 8500 },
  { thickness: "0.4mm", size: "13cm", key: "0.4mm - 13cm", price: 12500 },
  { thickness: "0.4mm", size: "14cm", key: "0.4mm - 14cm", price: 15000 },
  { thickness: "0.4mm", size: "15cm", key: "0.4mm - 15cm", price: 17000 },
  { thickness: "0.4mm", size: "16cm", key: "0.4mm - 16cm", price: 17000 },
  { thickness: "0.4mm", size: "17cm", key: "0.4mm - 17cm", price: 19000 },
  { thickness: "0.4mm", size: "18cm", key: "0.4mm - 18cm", price: 19000 },
  { thickness: "0.4mm", size: "19cm", key: "0.4mm - 19cm", price: 37500 },
  { thickness: "0.4mm", size: "20cm", key: "0.4mm - 20cm", price: 45000 },
  // 0.5mm
  { thickness: "0.5mm", size: "3cm", key: "0.5mm - 3cm", price: 800 },
  { thickness: "0.5mm", size: "4cm", key: "0.5mm - 4cm", price: 1300 },
  { thickness: "0.5mm", size: "5cm", key: "0.5mm - 5cm", price: 1900 },
  { thickness: "0.5mm", size: "5.5cm", key: "0.5mm - 5.5cm", price: 2400 },
  { thickness: "0.5mm", size: "5.9cm", key: "0.5mm - 5.9cm", price: 2600 },
  { thickness: "0.5mm", size: "6.5cm", key: "0.5mm - 6.5cm", price: 3500 },
  { thickness: "0.5mm", size: "7cm", key: "0.5mm - 7cm", price: 3700 },
  { thickness: "0.5mm", size: "7.5cm", key: "0.5mm - 7.5cm", price: 4900 },
  { thickness: "0.5mm", size: "8cm", key: "0.5mm - 8cm", price: 5200 },
  { thickness: "0.5mm", size: "8.5cm", key: "0.5mm - 8.5cm", price: 5600 },
  { thickness: "0.5mm", size: "9cm", key: "0.5mm - 9cm", price: 5600 },
  { thickness: "0.5mm", size: "9.5cm", key: "0.5mm - 9.5cm", price: 8100 },
  { thickness: "0.5mm", size: "10cm", key: "0.5mm - 10cm", price: 8900 },
  { thickness: "0.5mm", size: "11cm", key: "0.5mm - 11cm", price: 9700 },
  { thickness: "0.5mm", size: "12cm", key: "0.5mm - 12cm", price: 10800 },
  { thickness: "0.5mm", size: "13cm", key: "0.5mm - 13cm", price: 16200 },
  { thickness: "0.5mm", size: "14cm", key: "0.5mm - 14cm", price: 18200 },
  { thickness: "0.5mm", size: "15cm", key: "0.5mm - 15cm", price: 21000 },
  { thickness: "0.5mm", size: "16cm", key: "0.5mm - 16cm", price: 21000 },
  { thickness: "0.5mm", size: "17cm", key: "0.5mm - 17cm", price: 24200 },
  { thickness: "0.5mm", size: "18cm", key: "0.5mm - 18cm", price: 24200 },
  { thickness: "0.5mm", size: "19cm", key: "0.5mm - 19cm", price: 48500 },
  { thickness: "0.5mm", size: "20cm", key: "0.5mm - 20cm", price: 58000 },
  // 0.6mm
  { thickness: "0.6mm", size: "3cm", key: "0.6mm - 3cm", price: 900 },
  { thickness: "0.6mm", size: "4cm", key: "0.6mm - 4cm", price: 1700 },
  { thickness: "0.6mm", size: "5cm", key: "0.6mm - 5cm", price: 2300 },
  { thickness: "0.6mm", size: "5.5cm", key: "0.6mm - 5.5cm", price: 2900 },
  { thickness: "0.6mm", size: "5.9cm", key: "0.6mm - 5.9cm", price: 3200 },
  { thickness: "0.6mm", size: "6.5cm", key: "0.6mm - 6.5cm", price: 4300 },
  { thickness: "0.6mm", size: "7cm", key: "0.6mm - 7cm", price: 5200 },
  { thickness: "0.6mm", size: "7.5cm", key: "0.6mm - 7.5cm", price: 6000 },
  { thickness: "0.6mm", size: "8cm", key: "0.6mm - 8cm", price: 6500 },
  { thickness: "0.6mm", size: "8.5cm", key: "0.6mm - 8.5cm", price: 7000 },
  { thickness: "0.6mm", size: "9cm", key: "0.6mm - 9cm", price: 7000 },
  { thickness: "0.6mm", size: "9.5cm", key: "0.6mm - 9.5cm", price: 10000 },
  { thickness: "0.6mm", size: "10cm", key: "0.6mm - 10cm", price: 11000 },
  { thickness: "0.6mm", size: "11cm", key: "0.6mm - 11cm", price: 12000 },
  { thickness: "0.6mm", size: "12cm", key: "0.6mm - 12cm", price: 13400 },
  { thickness: "0.6mm", size: "13cm", key: "0.6mm - 13cm", price: 20000 },
  { thickness: "0.6mm", size: "14cm", key: "0.6mm - 14cm", price: 22500 },
  { thickness: "0.6mm", size: "15cm", key: "0.6mm - 15cm", price: 25800 },
  { thickness: "0.6mm", size: "16cm", key: "0.6mm - 16cm", price: 25800 },
  { thickness: "0.6mm", size: "17cm", key: "0.6mm - 17cm", price: 30000 },
  { thickness: "0.6mm", size: "18cm", key: "0.6mm - 18cm", price: 30000 },
  { thickness: "0.6mm", size: "19cm", key: "0.6mm - 19cm", price: 60000 },
  { thickness: "0.6mm", size: "20cm", key: "0.6mm - 20cm", price: 72000 },
  // 0.7mm
  { thickness: "0.7mm", size: "3cm", key: "0.7mm - 3cm", price: 1100 },
  { thickness: "0.7mm", size: "4cm", key: "0.7mm - 4cm", price: 2000 },
  { thickness: "0.7mm", size: "5cm", key: "0.7mm - 5cm", price: 2800 },
  { thickness: "0.7mm", size: "5.5cm", key: "0.7mm - 5.5cm", price: 3500 },
  { thickness: "0.7mm", size: "5.9cm", key: "0.7mm - 5.9cm", price: 3900 },
  { thickness: "0.7mm", size: "6.5cm", key: "0.7mm - 6.5cm", price: 5200 },
  { thickness: "0.7mm", size: "7cm", key: "0.7mm - 7cm", price: 5500 },
  { thickness: "0.7mm", size: "7.5cm", key: "0.7mm - 7.5cm", price: 7400 },
  { thickness: "0.7mm", size: "8cm", key: "0.7mm - 8cm", price: 7900 },
  { thickness: "0.7mm", size: "8.5cm", key: "0.7mm - 8.5cm", price: 8500 },
  { thickness: "0.7mm", size: "9cm", key: "0.7mm - 9cm", price: 8500 },
  { thickness: "0.7mm", size: "9.5cm", key: "0.7mm - 9.5cm", price: 12300 },
  { thickness: "0.7mm", size: "10cm", key: "0.7mm - 10cm", price: 13400 },
  { thickness: "0.7mm", size: "11cm", key: "0.7mm - 11cm", price: 14700 },
  { thickness: "0.7mm", size: "12cm", key: "0.7mm - 12cm", price: 16300 },
  { thickness: "0.7mm", size: "13cm", key: "0.7mm - 13cm", price: 24500 },
  { thickness: "0.7mm", size: "14cm", key: "0.7mm - 14cm", price: 27500 },
  { thickness: "0.7mm", size: "15cm", key: "0.7mm - 15cm", price: 31500 },
  { thickness: "0.7mm", size: "16cm", key: "0.7mm - 16cm", price: 31500 },
  { thickness: "0.7mm", size: "17cm", key: "0.7mm - 17cm", price: 36700 },
  { thickness: "0.7mm", size: "18cm", key: "0.7mm - 18cm", price: 36700 },
  { thickness: "0.7mm", size: "19cm", key: "0.7mm - 19cm", price: 73500 },
  { thickness: "0.7mm", size: "20cm", key: "0.7mm - 20cm", price: 88000 },
  // 0.8mm
  { thickness: "0.8mm", size: "3cm", key: "0.8mm - 3cm", price: 1300 },
  { thickness: "0.8mm", size: "4cm", key: "0.8mm - 4cm", price: 2300 },
  { thickness: "0.8mm", size: "5cm", key: "0.8mm - 5cm", price: 3200 },
  { thickness: "0.8mm", size: "5.5cm", key: "0.8mm - 5.5cm", price: 4100 },
  { thickness: "0.8mm", size: "5.9cm", key: "0.8mm - 5.9cm", price: 4500 },
  { thickness: "0.8mm", size: "6.5cm", key: "0.8mm - 6.5cm", price: 6000 },
  { thickness: "0.8mm", size: "7cm", key: "0.8mm - 7cm", price: 6400 },
  { thickness: "0.8mm", size: "7.5cm", key: "0.8mm - 7.5cm", price: 8500 },
  { thickness: "0.8mm", size: "8cm", key: "0.8mm - 8cm", price: 9200 },
  { thickness: "0.8mm", size: "8.5cm", key: "0.8mm - 8.5cm", price: 9900 },
  { thickness: "0.8mm", size: "9cm", key: "0.8mm - 9cm", price: 9900 },
  { thickness: "0.8mm", size: "9.5cm", key: "0.8mm - 9.5cm", price: 14200 },
  { thickness: "0.8mm", size: "10cm", key: "0.8mm - 10cm", price: 15500 },
  { thickness: "0.8mm", size: "11cm", key: "0.8mm - 11cm", price: 17000 },
  { thickness: "0.8mm", size: "12cm", key: "0.8mm - 12cm", price: 18900 },
  { thickness: "0.8mm", size: "13cm", key: "0.8mm - 13cm", price: 28500 },
  { thickness: "0.8mm", size: "14cm", key: "0.8mm - 14cm", price: 31900 },
  { thickness: "0.8mm", size: "15cm", key: "0.8mm - 15cm", price: 36500 },
  { thickness: "0.8mm", size: "16cm", key: "0.8mm - 16cm", price: 36500 },
  { thickness: "0.8mm", size: "17cm", key: "0.8mm - 17cm", price: 42500 },
  { thickness: "0.8mm", size: "18cm", key: "0.8mm - 18cm", price: 42500 },
  { thickness: "0.8mm", size: "19cm", key: "0.8mm - 19cm", price: 85000 },
  { thickness: "0.8mm", size: "20cm", key: "0.8mm - 20cm", price: 102000 },
  // 1mm
  { thickness: "1mm", size: "3cm", key: "1mm - 3cm", price: 1600 },
  { thickness: "1mm", size: "4cm", key: "1mm - 4cm", price: 3000 },
  { thickness: "1mm", size: "5cm", key: "1mm - 5cm", price: 4100 },
  { thickness: "1mm", size: "5.5cm", key: "1mm - 5.5cm", price: 5200 },
  { thickness: "1mm", size: "5.9cm", key: "1mm - 5.9cm", price: 5800 },
  { thickness: "1mm", size: "6.5cm", key: "1mm - 6.5cm", price: 7700 },
  { thickness: "1mm", size: "7cm", key: "1mm - 7cm", price: 8200 },
  { thickness: "1mm", size: "7.5cm", key: "1mm - 7.5cm", price: 10900 },
  { thickness: "1mm", size: "8cm", key: "1mm - 8cm", price: 11700 },
  { thickness: "1mm", size: "8.5cm", key: "1mm - 8.5cm", price: 12500 },
  { thickness: "1mm", size: "9cm", key: "1mm - 9cm", price: 12500 },
  { thickness: "1mm", size: "9.5cm", key: "1mm - 9.5cm", price: 18100 },
  { thickness: "1mm", size: "10cm", key: "1mm - 10cm", price: 19700 },
  { thickness: "1mm", size: "11cm", key: "1mm - 11cm", price: 21700 },
  { thickness: "1mm", size: "12cm", key: "1mm - 12cm", price: 24100 },
  { thickness: "1mm", size: "13cm", key: "1mm - 13cm", price: 36200 },
  { thickness: "1mm", size: "14cm", key: "1mm - 14cm", price: 40700 },
  { thickness: "1mm", size: "15cm", key: "1mm - 15cm", price: 46500 },
  { thickness: "1mm", size: "16cm", key: "1mm - 16cm", price: 46500 },
  { thickness: "1mm", size: "17cm", key: "1mm - 17cm", price: 54200 },
  { thickness: "1mm", size: "18cm", key: "1mm - 18cm", price: 54200 },
  { thickness: "1mm", size: "19cm", key: "1mm - 19cm", price: 108400 },
  { thickness: "1mm", size: "20cm", key: "1mm - 20cm", price: 130000 },
  // 1.5mm
  { thickness: "1.5mm", size: "3cm", key: "1.5mm - 3cm", price: 2500 },
  { thickness: "1.5mm", size: "4cm", key: "1.5mm - 4cm", price: 4400 },
  { thickness: "1.5mm", size: "5cm", key: "1.5mm - 5cm", price: 6100 },
  { thickness: "1.5mm", size: "5.5cm", key: "1.5mm - 5.5cm", price: 7800 },
  { thickness: "1.5mm", size: "5.9cm", key: "1.5mm - 5.9cm", price: 8600 },
  { thickness: "1.5mm", size: "6.5cm", key: "1.5mm - 6.5cm", price: 11600 },
  { thickness: "1.5mm", size: "7cm", key: "1.5mm - 7cm", price: 12300 },
  { thickness: "1.5mm", size: "7.5cm", key: "1.5mm - 7.5cm", price: 16500 },
  { thickness: "1.5mm", size: "8cm", key: "1.5mm - 8cm", price: 17500 },
  { thickness: "1.5mm", size: "8.5cm", key: "1.5mm - 8.5cm", price: 18900 },
  { thickness: "1.5mm", size: "9cm", key: "1.5mm - 9cm", price: 18900 },
  { thickness: "1.5mm", size: "9.5cm", key: "1.5mm - 9.5cm", price: 27300 },
  { thickness: "1.5mm", size: "10cm", key: "1.5mm - 10cm", price: 29700 },
  { thickness: "1.5mm", size: "11cm", key: "1.5mm - 11cm", price: 32700 },
  { thickness: "1.5mm", size: "12cm", key: "1.5mm - 12cm", price: 36300 },
  { thickness: "1.5mm", size: "13cm", key: "1.5mm - 13cm", price: 54500 },
  { thickness: "1.5mm", size: "14cm", key: "1.5mm - 14cm", price: 61300 },
  { thickness: "1.5mm", size: "15cm", key: "1.5mm - 15cm", price: 70000 },
  { thickness: "1.5mm", size: "16cm", key: "1.5mm - 16cm", price: 70000 },
  { thickness: "1.5mm", size: "17cm", key: "1.5mm - 17cm", price: 81700 },
  { thickness: "1.5mm", size: "18cm", key: "1.5mm - 18cm", price: 81700 },
  { thickness: "1.5mm", size: "19cm", key: "1.5mm - 19cm", price: 164000 },
  { thickness: "1.5mm", size: "20cm", key: "1.5mm - 20cm", price: 196000 },
  // 2mm
  { thickness: "2mm", size: "3cm", key: "2mm - 3cm", price: 3000 },
  { thickness: "2mm", size: "4cm", key: "2mm - 4cm", price: 5500 },
  { thickness: "2mm", size: "5cm", key: "2mm - 5cm", price: 7500 },
  { thickness: "2mm", size: "5.5cm", key: "2mm - 5.5cm", price: 9600 },
  { thickness: "2mm", size: "5.9cm", key: "2mm - 5.9cm", price: 10600 },
  { thickness: "2mm", size: "6.5cm", key: "2mm - 6.5cm", price: 14200 },
  { thickness: "2mm", size: "7cm", key: "2mm - 7cm", price: 15000 },
  { thickness: "2mm", size: "7.5cm", key: "2mm - 7.5cm", price: 20000 },
  { thickness: "2mm", size: "8cm", key: "2mm - 8cm", price: 21500 },
  { thickness: "2mm", size: "8.5cm", key: "2mm - 8.5cm", price: 23100 },
  { thickness: "2mm", size: "9cm", key: "2mm - 9cm", price: 23100 },
  { thickness: "2mm", size: "9.5cm", key: "2mm - 9.5cm", price: 33400 },
  { thickness: "2mm", size: "10cm", key: "2mm - 10cm", price: 36500 },
  { thickness: "2mm", size: "11cm", key: "2mm - 11cm", price: 40000 },
  { thickness: "2mm", size: "12cm", key: "2mm - 12cm", price: 44500 },
  { thickness: "2mm", size: "13cm", key: "2mm - 13cm", price: 67000 },
  { thickness: "2mm", size: "14cm", key: "2mm - 14cm", price: 75000 },
  { thickness: "2mm", size: "15cm", key: "2mm - 15cm", price: 86000 },
  { thickness: "2mm", size: "16cm", key: "2mm - 16cm", price: 86000 },
  { thickness: "2mm", size: "17cm", key: "2mm - 17cm", price: 100000 },
  { thickness: "2mm", size: "18cm", key: "2mm - 18cm", price: 100000 },
  { thickness: "2mm", size: "19cm", key: "2mm - 19cm", price: 200000 },
  { thickness: "2mm", size: "20cm", key: "2mm - 20cm", price: 240000 },
  // 3mm
  { thickness: "3mm", size: "3cm", key: "3mm - 3cm", price: 4800 },
  { thickness: "3mm", size: "4cm", key: "3mm - 4cm", price: 8600 },
  { thickness: "3mm", size: "5cm", key: "3mm - 5cm", price: 12000 },
  { thickness: "3mm", size: "5.5cm", key: "3mm - 5.5cm", price: 15500 },
  { thickness: "3mm", size: "5.9cm", key: "3mm - 5.9cm", price: 16900 },
  { thickness: "3mm", size: "6.5cm", key: "3mm - 6.5cm", price: 22600 },
  { thickness: "3mm", size: "7cm", key: "3mm - 7cm", price: 24000 },
  { thickness: "3mm", size: "7.5cm", key: "3mm - 7.5cm", price: 32000 },
  { thickness: "3mm", size: "8cm", key: "3mm - 8cm", price: 35000 },
  { thickness: "3mm", size: "8.5cm", key: "3mm - 8.5cm", price: 37000 },
  { thickness: "3mm", size: "9cm", key: "3mm - 9cm", price: 37000 },
  { thickness: "3mm", size: "9.5cm", key: "3mm - 9.5cm", price: 53500 },
  { thickness: "3mm", size: "10cm", key: "3mm - 10cm", price: 58500 },
  { thickness: "3mm", size: "11cm", key: "3mm - 11cm", price: 64000 },
  { thickness: "3mm", size: "12cm", key: "3mm - 12cm", price: 71500 },
  { thickness: "3mm", size: "13cm", key: "3mm - 13cm", price: 107000 },
  { thickness: "3mm", size: "14cm", key: "3mm - 14cm", price: 120000 },
  { thickness: "3mm", size: "15cm", key: "3mm - 15cm", price: 137500 },
  { thickness: "3mm", size: "16cm", key: "3mm - 16cm", price: 137500 },
  { thickness: "3mm", size: "17cm", key: "3mm - 17cm", price: 160000 },
  { thickness: "3mm", size: "18cm", key: "3mm - 18cm", price: 160000 },
  { thickness: "3mm", size: "19cm", key: "3mm - 19cm", price: 320000 },
  { thickness: "3mm", size: "20cm", key: "3mm - 20cm", price: 384000 },
]

export function getMaterialPrice(thickness: string, size: string): number | null {
  const key = `${thickness} - ${size}` as const
  const found = materialPrices.find(m => m.key === key)
  return found?.price ?? null
}

// Biaya Etsa
export const etchingPrices: PriceOption[] = [
  { label: "> 4cm 1 Muka", price: 2000 },
  { label: "1 Muka", price: 4000 },
  { label: "2 Muka", price: 5000 },
  { label: "1 Muka Masir", price: 5000 },
  { label: "2 Muka Masir", price: 6000 },
  { label: "> 9 cm", price: 8000 },
  { label: "> 15 cm", price: 20000 },
  { label: "> 20 cm", price: 30000 },
  { label: "> 30 cm", price: 50000 },
]

// Biaya Crome / Poles (size-based for crome, fixed for poles)
export const chromePolesPrices: PriceOption[] = [
  { label: "Poles Pin", price: 1000 },
  { label: "Poles Medali", price: 2000 },
  { label: "Poles Plakat", price: 4000 },
  { label: "Crome 4 cm", price: 4000 },
  { label: "Crome 6 cm", price: 6000 },
  { label: "Crome 7 cm", price: 7000 },
  { label: "Crome 8 cm", price: 8000 },
  { label: "Crome 9 cm", price: 9000 },
  { label: "Crome 10 cm", price: 10000 },
  { label: "Crome 12 cm", price: 15000 },
  { label: "Crome 20 cm", price: 20000 },
]

export function getChromePriceBySize(sizeCm: number): number | null {
  const sizes = [
    { max: 5, price: 4000 },    // Crome 4 cm
    { max: 6.5, price: 6000 },  // Crome 6 cm
    { max: 7.5, price: 7000 },  // Crome 7 cm
    { max: 8.5, price: 8000 },  // Crome 8 cm
    { max: 9.5, price: 9000 },  // Crome 9 cm
    { max: 11, price: 10000 },  // Crome 10 cm
    { max: 14, price: 15000 },  // Crome 12 cm
    { max: 99, price: 20000 },  // Crome 20 cm
  ]
  const found = sizes.find(s => sizeCm <= s.max)
  return found?.price ?? null
}

export function getPolesPrice(type: "Pin" | "Medali" | "Plakat"): number {
  const map = { Pin: 1000, Medali: 2000, Plakat: 4000 }
  return map[type]
}

// Pemotongan Bahan (size-based)
export const cuttingPrices: PriceOption[] = [
  { label: "Gunting", price: 1000 },
  { label: "Gunting Mesin", price: 2000 },
  { label: "Gunting Pin", price: 1500 },
  { label: "Laser Cut 4 cm", price: 1500 },
  { label: "Laser Cut 6 cm", price: 3000 },
  { label: "Laser Cut 7 cm", price: 4000 },
  { label: "Laser Cut 8 cm", price: 5000 },
  { label: "Laser Cut 10 cm", price: 10000 },
  { label: "Laser Cut 12 cm", price: 12000 },
  { label: "Laser Cut 14 cm", price: 14000 },
  { label: "Laser Cut 16 cm", price: 16000 },
  { label: "Laser Cut 20 cm", price: 20000 },
]

// Flat / Cekung
export const shapePrices: PriceOption[] = [
  { label: "Flat (datar)", price: 0 },
  { label: "Tipis < 0.6mm", price: 1000 },
  { label: "Tebal > 0.8mm", price: 2000 },
  { label: "Tebal > 2mm", price: 3000 },
]

// Lapisan Lycal (size-based)
export const layerPrices: PriceOption[] = [
  { label: "Tanpa Lapisan", price: 0 },
  { label: "Lycal 4 cm", price: 2000 },
  { label: "Lycal 6 cm", price: 4000 },
  { label: "Lycal 7 cm", price: 5000 },
  { label: "Lycal 8 cm", price: 7000 },
  { label: "Lycal 9 cm", price: 9000 },
  { label: "Lycal 10 cm", price: 11000 },
  { label: "Lycal 12 cm", price: 14000 },
  { label: "Lycal 15 cm", price: 20000 },
]

// Biaya Pewarnaan
export const colorPrices: PriceOption[] = [
  { label: "1 Warna", price: 1000 },
  { label: "2 Warna", price: 2000 },
  { label: "3 Warna", price: 3000 },
  { label: "4 Warna", price: 4000 },
  { label: "5 Warna", price: 5000 },
  { label: "Stiker 1 Muka", price: 3000 },
  { label: "Stiker 2 Muka", price: 5000 },
  { label: "Warna Crome", price: 4000 },
  { label: "Warna Logam", price: 3000 },
]

// Kain / Pengait Pin
export const attachmentPrices: PriceOption[] = [
  { label: "Tanpa Tali", price: 0 },
  { label: "Pita Sablon", price: 5000 },
  { label: "Satin", price: 6000 },
  { label: "Satin Besar", price: 8000 },
  { label: "Poliester", price: 4000 },
  { label: "Lanyard Sublim 3cm", price: 7000 },
  { label: "Lanyard Sublim 2.5cm", price: 6500 },
  { label: "Lanyard Sublim 2cm", price: 6000 },
  { label: "Lanyard Sublim 1.5cm", price: 5500 },
  { label: "Bludru", price: 7000 },
  { label: "Peniti", price: 1000 },
  { label: "Jarum 1 Mata", price: 1500 },
  { label: "Jarum 2 Mata", price: 2000 },
  { label: "Magnet", price: 3000 },
  { label: "1 Paku Jambu Manset", price: 2000 },
  { label: "2 Paku Jambu Manset", price: 3000 },
]

// Markup berdasarkan quantity
export const markupTiers: MarkupTier[] = [
  { minQty: 500, label: "> 500", percent: 10 },
  { minQty: 200, label: "> 200", percent: 15 },
  { minQty: 100, label: "> 100", percent: 20 },
  { minQty: 50, label: "> 50", percent: 30 },
  { minQty: 25, label: "> 25", percent: 40 },
  { minQty: 10, label: "> 10", percent: 50 },
  { minQty: 0, label: "Satuan", percent: 100 },
]

export function getMarkup(qty: number): MarkupTier {
  for (const tier of markupTiers) {
    if (qty >= tier.minQty && tier.minQty > 0) return tier
    if (tier.minQty === 0) return tier
  }
  return markupTiers[markupTiers.length - 1]
}

export function formatPrice(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`
}

export interface KalkulasiInput {
  thickness: string
  size: string
  etching: string
  finishType: "chrome" | "poles"
  finishOption: string
  shape: string
  layer: string
  coloring: string
  cutting: string
  attachment: string
  quantity: number
}

export interface KalkulasiOutput {
  materialPrice: number
  etchingPrice: number
  finishPrice: number
  shapePrice: number
  layerPrice: number
  coloringPrice: number
  cuttingPrice: number
  attachmentPrice: number
  totalHPP: number
  markupPercent: number
  markupLabel: string
  finalPrice: number
  totalPrice: number
}

export function kalkulasi(input: KalkulasiInput): KalkulasiOutput | null {
  const matPrice = getMaterialPrice(input.thickness, input.size)
  if (matPrice === null) return null

  const etchingPrice = etchingPrices.find(e => e.label === input.etching)?.price ?? 0
  const finishPrice = input.finishType === "chrome"
    ? chromePolesPrices.find(c => c.label === input.finishOption)?.price ?? 0
    : chromePolesPrices.find(c => c.label === input.finishOption)?.price ?? 0
  const shapePrice = shapePrices.find(s => s.label === input.shape)?.price ?? 0
  const layerPrice = layerPrices.find(l => l.label === input.layer)?.price ?? 0
  const coloringPrice = colorPrices.find(c => c.label === input.coloring)?.price ?? 0
  const cuttingPrice = cuttingPrices.find(c => c.label === input.cutting)?.price ?? 0
  const attachmentPrice = attachmentPrices.find(a => a.label === input.attachment)?.price ?? 0

  const totalHPP = matPrice + etchingPrice + finishPrice + shapePrice + layerPrice + coloringPrice + cuttingPrice + attachmentPrice
  const markup = getMarkup(input.quantity)
  const finalPrice = Math.round(totalHPP * (1 + markup.percent / 100))
  const totalPrice = finalPrice * input.quantity

  return {
    materialPrice: matPrice,
    etchingPrice,
    finishPrice,
    shapePrice,
    layerPrice,
    coloringPrice,
    cuttingPrice,
    attachmentPrice,
    totalHPP,
    markupPercent: markup.percent,
    markupLabel: markup.label,
    finalPrice,
    totalPrice,
  }
}
