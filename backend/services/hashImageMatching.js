const sharp = require('sharp');
const axios = require('axios');

class HashImageMatchingService {
  constructor() {
    this.enabled = true;
  }

  async generateImageHash(imageUrl) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      
      // Generate perceptual hash using sharp
      const { data, info } = await sharp(buffer)
        .resize(8, 8)
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      // Convert to binary hash
      const pixels = Array.from(data);
      const avg = pixels.reduce((a, b) => a + b) / pixels.length;
      const hash = pixels.map(p => p > avg ? 1 : 0).join('');
      
      return hash;
    } catch (error) {
      console.error('Hash generation error:', error);
      return null;
    }
  }

  calculateHammingDistance(hash1, hash2) {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64;
    
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) distance++;
    }
    return distance;
  }

  calculateSimilarity(hash1, hash2) {
    const distance = this.calculateHammingDistance(hash1, hash2);
    return Math.max(0, (64 - distance) / 64);
  }

  getConfidenceLevel(similarity) {
    if (similarity >= 0.8) return 'High';
    if (similarity >= 0.6) return 'Medium';
    if (similarity >= 0.4) return 'Low';
    return null;
  }

  async extractFeatures(imageUrl) {
    return await this.generateImageHash(imageUrl);
  }

  async findMatches(newItem, existingItems) {
    const matches = [];
    
    if (!newItem.imageFeatures) return matches;

    for (const item of existingItems) {
      if (!item.imageFeatures) continue;
      
      const similarity = this.calculateSimilarity(newItem.imageFeatures, item.imageFeatures);
      const confidence = this.getConfidenceLevel(similarity);
      
      if (confidence) {
        matches.push({ item, similarity, confidence });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }
}

module.exports = new HashImageMatchingService();