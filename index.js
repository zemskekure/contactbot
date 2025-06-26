const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Load contacts from file
const contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Test route for Replit root URL
app.get('/', (req, res) => {
  res.send('✅ ContactBot is running!');
});

// ✅ Slack Slash Command endpoint
app.post('/contact', (req, res) => {
  console.log("🔔 Slack request received!");
  console.log("🔍 Query:", req.body.text);

  const query = req.body.text.toLowerCase();

  const matches = contacts.filter(c =>
    c.name.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    return res.json({
      response_type: 'ephemeral',
      text: `🙁 No contact found for *${req.body.text}*.`
    });
  }

  const response = matches.map(c =>
    `*${c.name}*\n_Position:_ ${c.position}\n📞 <tel:${c.phone.replace(/\s+/g, '')}|${c.phone}>\n✉️ ${c.email}`
  ).join('\n\n');

  return res.json({
    response_type: 'in_channel',
    text: response
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
