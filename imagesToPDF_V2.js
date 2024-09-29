const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Function to sort file names numerically
function sortNumerically(files) {
  return files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB;
  });
}

// Function to combine images into a PDF
async function imagesToPDF(folderPath, fileName) {
  const imagesFolder = path.resolve(__dirname, 'images', folderPath);

  // Get all JPG files from the folder
  let imageFiles = fs.readdirSync(imagesFolder).filter(file => file.endsWith('.jpg'));

  if (imageFiles.length === 0) {
    console.log('No images found in the folder.');
    return;
  }

  // Sort files numerically by the numbers in their filenames
  imageFiles = sortNumerically(imageFiles);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  for (const imageFile of imageFiles) {
    const imagePath = path.join(imagesFolder, imageFile);

    // Read the image file
    const imageBytes = fs.readFileSync(imagePath);

    // Embed the image in the PDF
    const image = await pdfDoc.embedJpg(imageBytes);

    // Get the dimensions of the image
    const { width, height } = image.scale(1);

    // Add a blank page to the PDF with the same dimensions as the image
    const page = pdfDoc.addPage([width, height]);

    // Draw the image on the page
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });

    console.log(`Added ${imageFile} to PDF.`);
  }

  // Write the PDF to a file
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(`${fileName}.pdf`, pdfBytes);

  console.log(`PDF created successfully as ${fileName}.pdf at ${__dirname}`);
}

function imagesToPDF_ALL(subject) {
  const imagesFolder = path.resolve(__dirname, 'images', subject);
  const dirImages = fs.readdirSync(imagesFolder);
  console.log(dirImages);
  for (const lesson of dirImages) {
    const folderPath = path.join(subject, lesson);
    const fileName = lesson;
    imagesToPDF(folderPath, fileName);
  }
}

const subject = '32210 - องค์การและการจัดการและการจัดการเชิงกลยุทธ์';
imagesToPDF_ALL(subject);
