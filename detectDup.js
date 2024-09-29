const express = require('express');

const app = express();
const userResponses = new Map();


const preventDuplicateRequest = (req, res, next) => {

  // Continue with the API logic
  next();
};

app.use((req, res, next) => {
  const userId = req.query.userId; // You should have a way to identify users (e.g., session, JWT, or API key)
  const resourceId = 'pms/1'; // The resource identifier

  // Create a unique request key for the user and resource
  const requestKey = `${userId}:${resourceId}`;

  // Check if the user has a response in progress
  if (userResponses.has(requestKey)) {
    return res.status(429).json({ error: 'Duplicate request detected' });
  }

  // Set a flag for this user and resource to indicate that a response is in progress
  userResponses.set(requestKey, res);

  res.on('finish', () => {
    const userId = req.query.userId;
    const resourceId = 'pms/1';
    const requestKey = `${userId}:${resourceId}`;

    // Remove the flag indicating that the response is in progress
    userResponses.delete(requestKey);
    console.log('Cleanup middleware executed.');
  });

  next();
});

app.get('/pms/1', async (req, res) => {
  try {
    console.log('API route handler started.');

    // Simulate some asynchronous work for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay as needed

    // Add a custom event listener to the response object


    // Send the API response
    res.json({ message: 'API response' });
    console.log('API route handler completed.');

    // Emit the custom event after the response is sent

  } catch (error) {
    console.error('API route handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
