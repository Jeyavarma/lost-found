const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');

// Public AI search endpoint (no auth required)
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters long' });
    }
    
    console.log('🔍 AI Search query:', query);
    
    // Get all items for search
    const allItems = await Item.find({})
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    
    // Simple text-based search with scoring
    const queryText = query.toLowerCase();
    const scoredItems = allItems.map(item => {
      let score = 0;
      const itemText = `${item.title} ${item.description} ${item.category} ${item.location}`.toLowerCase();
      
      // Exact matches get highest score
      if (itemText.includes(queryText)) {
        score += 50;
      }
      
      // Word-by-word matching
      const queryWords = queryText.split(/\s+/).filter(w => w.length > 2);
      queryWords.forEach(word => {
        if (itemText.includes(word)) {
          score += 10;
        }
      });
      
      return {
        ...item.toObject(),
        searchScore: score
      };
    });
    
    // Filter and sort results
    const results = scoredItems
      .filter(item => item.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 20);
    
    console.log(`✅ AI Search found ${results.length} results`);
    
    res.json({
      query,
      results,
      total: results.length
    });
    
  } catch (error) {
    console.error('❌ AI Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// AI-powered similar item search
router.post('/similar-items', auth, async (req, res) => {
  try {
    const { query, category, location, status } = req.body;
    
    console.log('🤖 AI Search initiated:', { query, category, location, status });
    
    // Get all items with opposite status for matching
    const targetStatus = status === 'lost' ? 'found' : 'lost';
    const allItems = await Item.find({ 
      status: targetStatus,
      reportedBy: { $ne: req.user.id }
    }).populate('reportedBy', 'name email');
    
    console.log(`📊 Found ${allItems.length} items to analyze`);
    
    // Advanced ML-like scoring algorithm
    const scoredItems = allItems.map(item => {
      let score = 0;
      const itemText = `${item.title} ${item.description}`.toLowerCase();
      const queryText = query.toLowerCase();
      
      // 1. Exact category match (40 points)
      if (category && item.category && item.category.toLowerCase() === category.toLowerCase()) {
        score += 40;
      }
      
      // 2. Location proximity (30 points)
      if (location && item.location) {
        const queryLoc = location.toLowerCase();
        const itemLoc = item.location.toLowerCase();
        if (queryLoc === itemLoc) score += 30;
        else if (queryLoc.includes(itemLoc) || itemLoc.includes(queryLoc)) score += 20;
      }
      
      // 3. Semantic text similarity (50 points max)
      const queryWords = queryText.split(/\\s+/).filter(w => w.length > 2);
      const itemWords = itemText.split(/\\s+/).filter(w => w.length > 2);
      
      // Exact word matches
      let wordMatches = 0;
      queryWords.forEach(qWord => {
        if (itemWords.includes(qWord)) {
          wordMatches++;
          score += 5;
        }
      });
      
      // Partial word matches (fuzzy matching)
      queryWords.forEach(qWord => {
        itemWords.forEach(iWord => {
          if (qWord.length > 3 && iWord.length > 3) {\n            const similarity = calculateStringSimilarity(qWord, iWord);\n            if (similarity > 0.7) {\n              score += 3;\n            }\n          }\n        });\n      });\n      \n      // 4. Brand/Model detection (25 points)\n      const brands = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'hp', 'dell', 'lenovo', 'canon', 'nikon', 'iphone', 'macbook', 'airpods'];\n      brands.forEach(brand => {\n        if (queryText.includes(brand) && itemText.includes(brand)) {\n          score += 25;\n        }\n      });\n      \n      // 5. Color matching (20 points)\n      const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'pink', 'purple', 'orange', 'gray', 'grey', 'silver', 'gold'];\n      colors.forEach(color => {\n        if (queryText.includes(color) && itemText.includes(color)) {\n          score += 20;\n        }\n      });\n      \n      // 6. Size indicators (15 points)\n      const sizes = ['small', 'medium', 'large', 'big', 'tiny', 'huge', 'mini', 'compact'];\n      sizes.forEach(size => {\n        if (queryText.includes(size) && itemText.includes(size)) {\n          score += 15;\n        }\n      });\n      \n      // 7. Condition keywords (10 points)\n      const conditions = ['new', 'old', 'damaged', 'broken', 'cracked', 'scratched', 'worn'];\n      conditions.forEach(condition => {\n        if (queryText.includes(condition) && itemText.includes(condition)) {\n          score += 10;\n        }\n      });\n      \n      // 8. Time proximity bonus (10 points)\n      const daysDiff = Math.abs((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24));\n      if (daysDiff <= 7) score += 10;\n      else if (daysDiff <= 30) score += 5;\n      \n      // 9. Confidence boost for multiple matches\n      const confidence = Math.min(95, Math.max(10, score + (wordMatches * 5)));\n      \n      return {\n        ...item.toObject(),\n        aiScore: Math.min(100, score),\n        confidence: confidence,\n        matchReason: generateMatchReason(score, wordMatches, category, location)\n      };\n    });\n    \n    // Filter and sort by AI score\n    const relevantItems = scoredItems\n      .filter(item => item.aiScore >= 15) // Minimum threshold\n      .sort((a, b) => b.aiScore - a.aiScore)\n      .slice(0, 10); // Top 10 matches\n    \n    console.log(`🎯 AI found ${relevantItems.length} relevant matches`);\n    \n    res.json({\n      query,\n      totalAnalyzed: allItems.length,\n      matches: relevantItems,\n      algorithm: 'Advanced ML-like Scoring',\n      timestamp: new Date()\n    });\n    \n  } catch (error) {\n    console.error('🚨 AI Search error:', error);\n    res.status(500).json({ error: error.message });\n  }\n});\n\n// String similarity calculation (Levenshtein-like)\nfunction calculateStringSimilarity(str1, str2) {\n  const longer = str1.length > str2.length ? str1 : str2;\n  const shorter = str1.length > str2.length ? str2 : str1;\n  \n  if (longer.length === 0) return 1.0;\n  \n  const editDistance = levenshteinDistance(longer, shorter);\n  return (longer.length - editDistance) / longer.length;\n}\n\nfunction levenshteinDistance(str1, str2) {\n  const matrix = [];\n  \n  for (let i = 0; i <= str2.length; i++) {\n    matrix[i] = [i];\n  }\n  \n  for (let j = 0; j <= str1.length; j++) {\n    matrix[0][j] = j;\n  }\n  \n  for (let i = 1; i <= str2.length; i++) {\n    for (let j = 1; j <= str1.length; j++) {\n      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {\n        matrix[i][j] = matrix[i - 1][j - 1];\n      } else {\n        matrix[i][j] = Math.min(\n          matrix[i - 1][j - 1] + 1,\n          matrix[i][j - 1] + 1,\n          matrix[i - 1][j] + 1\n        );\n      }\n    }\n  }\n  \n  return matrix[str2.length][str1.length];\n}\n\nfunction generateMatchReason(score, wordMatches, category, location) {\n  const reasons = [];\n  \n  if (score >= 40) reasons.push('Strong category match');\n  if (wordMatches >= 3) reasons.push('Multiple keyword matches');\n  if (category) reasons.push('Category similarity');\n  if (location) reasons.push('Location proximity');\n  if (score >= 70) reasons.push('High confidence match');\n  \n  return reasons.length > 0 ? reasons.join(', ') : 'Basic similarity detected';\n}\n\nmodule.exports = router;