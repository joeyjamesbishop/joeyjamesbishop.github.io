import os, re, shutil
from PIL import Image

input_folder = "images"
output_folder = "images"
small_width = 1200
large_width = 2400

def clean_filename(name):
    # lowercase
    name = name.lower()
    # replace spaces, brackets, plus with dash
    name = re.sub(r"[ ()+]", "-", name)
    # collapse multiple dashes
    name = re.sub(r"-+", "-", name)
    # strip trailing dashes
    name = name.strip("-")
    return name

def resize_and_save(path, base_name):
    img = Image.open(path)
    w, h = img.size

    for width, suffix in [(small_width, "small"), (large_width, "large")]:
        new_h = int(h * (width / w)) if w > width else h
        resized = img.resize((min(w, width), new_h), Image.LANCZOS)
        new_name = f"{base_name}-{suffix}.jpg"
        save_path = os.path.join(output_folder, new_name)
        resized.convert("RGB").save(save_path, "JPEG", quality=85, optimize=True)
        print(f"✅ Created {save_path}")

def process_images():
    for filename in os.listdir(input_folder):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")) and "small" not in filename and "large" not in filename:
            filepath = os.path.join(input_folder, filename)
            base, _ = os.path.splitext(filename)
            clean_base = clean_filename(base)
            clean_original = f"{clean_base}.jpg"
            clean_path = os.path.join(output_folder, clean_original)

            # Move and rename original file
            shutil.move(filepath, clean_path)
            print(f"🔄 Moved & renamed {filename} → {clean_original}")

            # Resize to small & large
            resize_and_save(clean_path, clean_base)

process_images()
print("\n🎉 All messy filenames cleaned, originals renamed, and small/large versions created!")
