import os
import pydicom
from PIL import Image

# Function to convert DICOM files to JPG
def convert_dicom_to_jpg(dicom_path, jpg_path):
    try:
        print(f"dicom_path: {dicom_path}")
        print(f"jpg_path: {jpg_path}")
        # Read the DICOM file
        dicom_data = pydicom.dcmread(dicom_path)
        
        # Get the pixel array from the DICOM file
        pixel_array = dicom_data.pixel_array
        
        # Convert the pixel array to an image
        image = Image.fromarray(pixel_array)
        
        # Convert the image to RGB mode if it's not already
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Save the image as a JPG file
        image.save(jpg_path)
        print(f"Converted {dicom_path} to {jpg_path}")
    except Exception as e:
        print(f"Failed to convert {dicom_path}: {e}")

# Specify the paths
main_folder = '/home/vishva/Downloads/ANONYMOUS'  
output_main_folder = '/home/vishva/Downloads/jpg_images'

# Create the output main directory if it doesn't exist
os.makedirs(output_main_folder, exist_ok=True)
print(f"Created output directory: {output_main_folder}")

# Traverse the directory structure
for root, dirs, files in os.walk(main_folder):
    print(f"Traversing directory: {root}")
    for file in files:
        # print(f"Found file: {file}")
        if file.lower().endswith('.dcm'):
            dicom_path = os.path.join(root, file)
            # print(f"Found DICOM file: {dicom_path}")
            
            # Construct the corresponding output path
            relative_path = os.path.relpath(dicom_path, main_folder)
            jpg_folder = os.path.join(output_main_folder, os.path.dirname(relative_path))
            os.makedirs(jpg_folder, exist_ok=True)
            print(f"jpg_folder: {jpg_folder}")
            jpg_file = os.path.splitext(os.path.basename(dicom_path))[0] + '.jpg'
            jpg_path = os.path.join(jpg_folder, jpg_file)
            
            # Convert the DICOM file to JPG
            convert_dicom_to_jpg(dicom_path, jpg_path)

print("All DICOM files have been converted to JPG.")
