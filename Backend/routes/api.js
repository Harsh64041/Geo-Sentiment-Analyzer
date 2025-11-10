const express = require('express');
const router = express.Router();
const axios = require('axios');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Sentiment = require('sentiment'); // <-- 1. Import new library

// Configure AWS SDK (for DynamoDB)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create client for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();
// const comprehend = new AWS.Comprehend(); // <-- 2. REMOVED AWS COMPREHEND
const sentiment = new Sentiment(); // <-- 3. Create sentiment analyzer

const DYNAMO_TABLE_NAME = 'NewsTrends'; // Make sure this matches your table

// --- Main Route to Search and Analyze ---
// POST /api/analyze
router.post('/analyze', async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ msg: 'Search term is required' });
  }

  try {
    // --- Step 1: Fetch data from GDELT API ---
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(searchTerm)}&mode=artlist&format=json&maxrecords=10&sourcelang=english`;
    const gdeltResponse = await axios.get(gdeltUrl);
    const articles = gdeltResponse.data.articles;

    if (!articles || articles.length === 0) {
      return res.status(404).json({ msg: 'No articles found for this topic.' });
    }

    let analysisResults = [];
    
    // --- Step 2: Analyze each article with NEW library ---
    for (const article of articles) {
      const textToAnalyze = article.title;
      
      // 4. THIS IS THE NEW NLP ANALYSIS
      const analysis = sentiment.analyze(textToAnalyze);

      // 5. Convert score to a label
      let sentimentLabel = 'NEUTRAL';
      if (analysis.score > 0) sentimentLabel = 'POSITIVE';
      if (analysis.score < 0) sentimentLabel = 'NEGATIVE';

      // --- Step 3: Format and Save to DynamoDB ---
      const item = {
        searchTerm: searchTerm, // Partition key
        date: new Date().toISOString() + "_" + uuidv4(), // Sort key
        articleId: uuidv4(),
        title: article.title,
        sourceUrl: article.url,
        sentiment: sentimentLabel, // From our new library
        rawSentimentScore: analysis.score,
        sentimentScore: { // Approximated score
            Positive: analysis.positive.length,
            Negative: analysis.negative.length,
            Neutral: analysis.tokens.length - (analysis.positive.length + analysis.negative.length),
            Mixed: 0
        },
        keyPhrases: [...analysis.positive, ...analysis.negative], // Get keywords
        domain: article.domain, // <-- ⭐️ ADD THIS LINE
        sourcecountry: article.sourcecountry, // <-- ⭐️ ADD THIS LINE
        entities: [], // We'll leave entities blank
      };

      // Put the item into our DynamoDB table
      await dynamoDB.put({
        TableName: DYNAMO_TABLE_NAME,
        Item: item
      }).promise();

      analysisResults.push(item);
    }

    res.status(201).json(analysisResults);

  } catch (err) {
    console.error("Error in /analyze:", err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

// --- Route to GET analyzed data for the dashboard ---
// This route does not change at all.
router.get('/topics/:searchTerm', async (req, res) => {
  try {
    const params = {
      TableName: DYNAMO_TABLE_NAME,
      KeyConditionExpression: "searchTerm = :st",
      ExpressionAttributeValues: {
        ":st": req.params.searchTerm
      }
    };

    const data = await dynamoDB.query(params).promise();
    res.json(data.Items);

  } catch (err) {
    console.error("Error in /topics:", err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

module.exports = router;