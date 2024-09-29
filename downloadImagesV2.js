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
    if (error.status === 404)
      console.log("Donwload All Done");
    else
      console.error(`Error downloading ${url}:`, error);

    throw error;
  }
}

// Download images from start.jpg to end.jpg
async function downloadImages(subPath, code, start, end = "ALL") {
  const baseUrl = `http://readonline.ebookstou.org/flipbook/${code}/files/mobile/`;

  if (end === "ALL") end = 1000;

  for (let i = start; i <= end; i++) {
    const imageUrl = `${baseUrl}${i}.jpg`;
    const filePath = path.resolve(__dirname, 'images', subPath, `${i}.jpg`);

    // Create 'images' directory if it doesn't exist
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    console.log(`Downloading ${imageUrl}`);
    const isSuccess = await downloadImage(imageUrl, filePath)
      .then(() => true).catch(() => false);
    if (isSuccess === false) break;

    console.log(`Downloaded ${filePath}`);
  }

  console.log('All images downloaded.');
}

const subject = '32210 - องค์การและการจัดการและการจัดการเชิงกลยุทธ์';
const lesson = 'บทที่15';
const folderPath = path.join(subject, lesson); // Update the folder path
const code = '43529';
const start = 1;
const end = "ALL";
downloadImages(folderPath, code, start, end);
