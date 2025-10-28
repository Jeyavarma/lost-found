const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const { createCanvas, loadImage } = require('canvas');

class ImageMatchingService {
  constructor() {
    this.model = null;
  }

  async initialize() {
    if (!this.model) {
      console.log('Loading MobileNet model...');
      this.model = await mobilenet.load();
      console.log('MobileNet model loaded successfully');
    }
  }

  async extractFeatures(imageUrl) {
    try {
      await this.initialize();
      
      // Load image from URL
      const image = await loadImage(imageUrl);
      
      // Create canvas and resize image to 224x224 (MobileNet input size)
      const canvas = createCanvas(224, 224);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, 224, 224);
      
      // Convert to tensor
      const tensor = tf.browser.fromPixels(canvas);
      const resized = tf.cast(tensor, 'float32');
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);
      
      // Extract features using MobileNet
      const features = await this.model.infer(batched, true);
      const featureArray = await features.data();
      
      // Cleanup tensors
      tensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();
      features.dispose();
      
      return Array.from(featureArray);
    } catch (error) {
      console.error('Feature extraction error:', error);
      return null;
    }
  }

  calculateSimilarity(features1, features2) {
    if (!features1 || !features2 || features1.length !== features2.length) {
      return 0;
    }

    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < features1.length; i++) {
      dotProduct += features1[i] * features2[i];
      norm1 += features1[i] * features1[i];
      norm2 += features2[i] * features2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0, similarity); // Ensure non-negative
  }

  getConfidenceLevel(similarity) {
    if (similarity >= 0.8) return 'High';
    if (similarity >= 0.7) return 'Medium';
    if (similarity >= 0.6) return 'Low';
    return null; // Below threshold
  }

  async findMatches(newItem, existingItems) {
    const matches = [];
    
    if (!newItem.imageFeatures) {
      return matches;
    }

    for (const item of existingItems) {
      if (!item.imageFeatures || item._id.toString() === newItem._id.toString()) {
        continue;
      }

      const similarity = this.calculateSimilarity(newItem.imageFeatures, item.imageFeatures);
      const confidence = this.getConfidenceLevel(similarity);
      
      if (confidence) {
        matches.push({
          item,
          similarity,
          confidence
        });
      }
    }

    // Sort by similarity (highest first)
    return matches.sort((a, b) => b.similarity - a.similarity);
  }
}

module.exports = new ImageMatchingService();