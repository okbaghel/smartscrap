// Simulating AI classification (to be replaced with real API)
export function classifyWaste(imageData) {
    const categories = ['biodegradable', 'non-biodegradable', 'mixture'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return randomCategory;
  }
  