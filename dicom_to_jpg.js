const fs = require('fs');
const path = require('path');
const dicomParser = require('dicom-parser');
const { createCanvas } = require('canvas');

// Function to convert DICOM files to JPG
async function convertDicomToJpg(dicomPath, jpgPath) {
    try {
        // Read the DICOM file
        const dicomBuffer = fs.readFileSync(dicomPath);
        const dataSet = dicomParser.parseDicom(dicomBuffer);

        // Get pixel data from DICOM
        const pixelDataElement = dataSet.elements.x7fe00010;
        const pixelData = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);

        // Create canvas and context
        const canvas = createCanvas(dataSet.uint16('x00280011'), dataSet.uint16('x00280010'));
        const context = canvas.getContext('2d');

        // Create ImageData from pixel data
        const imageData = new ImageData(new Uint8ClampedArray(pixelData), canvas.width, canvas.height);

        // Put ImageData onto canvas
        context.putImageData(imageData, 0, 0);

        // Convert canvas to JPG
        const jpgStream = fs.createWriteStream(jpgPath);
        const jpgStreamData = canvas.createJPEGStream();
        jpgStreamData.pipe(jpgStream);

        console.log(`Converted ${dicomPath} to ${jpgPath}`);
    } catch (error) {
        console.error(`Failed to convert ${dicomPath}: ${error}`);
    }
}

// Specify the paths
const mainFolder = '/home/vishva/Downloads/ANONYMOUS';
const outputMainFolder = '/home/vishva/Downloads/jpg_images';

// Create the output main directory if it doesn't exist
fs.mkdirSync(outputMainFolder, { recursive: true });
console.log(`Created output directory: ${outputMainFolder}`);

// Traverse the directory structure
fs.readdirSync(mainFolder, { withFileTypes: true }).forEach(item => {
    const itemPath = path.join(mainFolder, item.name);
    if (item.isDirectory()) {
        const outputSubFolder = path.join(outputMainFolder, item.name);
        fs.mkdirSync(outputSubFolder, { recursive: true });

        // Traverse subfolder
        fs.readdirSync(itemPath, { withFileTypes: true }).forEach(subItem => {
            const subItemPath = path.join(itemPath, subItem.name);
            if (subItem.isDirectory()) {
                const outputSubSubFolder = path.join(outputSubFolder, subItem.name);
                fs.mkdirSync(outputSubSubFolder, { recursive: true });

                // Convert DICOM files
                fs.readdirSync(subItemPath).forEach(file => {
                    if (file.toLowerCase().endsWith('.dcm')) {
                        const dicomPath = path.join(subItemPath, file);
                        const jpgFile = file.replace('.dcm', '.jpg');
                        const jpgPath = path.join(outputSubSubFolder, jpgFile);

                        convertDicomToJpg(dicomPath, jpgPath);
                    }
                });
            }
        });
    }
});

console.log("All DICOM files have been converted to JPG.");
