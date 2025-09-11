import os
from PIL import Image

# Path to your images folder
input_folder = "images"
output_folder = "images"  # saves back into the same folder

# Max widths for resized versions
small_width = 1200   # for carousel
large_width = 2400   # for fullscreen lightbox

def resize_image(path, max_width, suffix):
    img = Image.open(path)
    w, h = img.size
    if w > max_width:  # only shrink if bigger
        new_h = int(h * (max_width / w))
        img = img.resize((max_width, new_h), Image.LANCZOS)
    base, _ = os.path.splitext(os.path.basename(path))
    new_name = f"{base}-{suffix}.jpg"  # always save as lowercase .jpg
    save_path = os.path.join(output_folder, new_name)
    img.convert("RGB").save(save_path, "JPEG", quality=85, optimize=True)
    print(f"Saved {save_path}")

# Loop through all files in the images folder
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")) and "-small" not in filename and "-large" not in filename:
        filepath = os.path.join(input_folder, filename)
        resize_image(filepath, small_width, "small")
        resize_image(filepath, large_width, "large")

print("✅ All images resized as .jpg (lowercase)!")