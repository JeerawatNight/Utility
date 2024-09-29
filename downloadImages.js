const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to download an image
async function downloadImage(url, filePath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
  }
}

// Download images from start.jpg to end.jpg
async function downloadImages(code, start, end) {
  const baseUrl = `http://readonline.ebookstou.org/flipbook/${code}/files/mobile/`;

  for (let i = start; i <= end; i++) {
    const imageUrl = `${baseUrl}${i}.jpg`;
    const filePath = path.resolve(__dirname, 'images', `${i}.jpg`);

    // Create 'images' directory if it doesn't exist
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    console.log(`Downloading ${imageUrl}`);
    await downloadImage(imageUrl, filePath);
    console.log(`Downloaded ${filePath}`);
  }

  console.log('All images downloaded.');
}

const code = '61183';
const start = 1;
const end = 92;
downloadImages(code, start, end);
