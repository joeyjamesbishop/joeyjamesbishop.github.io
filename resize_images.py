import os, re
from PIL import Image

input_folder = "images"
output_folder = "images"
small_width = 1200
large_width = 2400

def clean_filename(name):
    # lowercase
    name = name.lower()
    # replace spaces and brackets with dashes
    name = re.sub(r"[ ()+]", "-", name)
    # remove duplicate dashes
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
        print(f"Saved {save_path}")

for filename in os.listdir(input_folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")) and "small" not in filename and "large" not in filename:
        filepath = os.path.join(input_folder, filename)
        base, _ = os.path.splitext(filename)
        clean_base = clean_filename(base)
        # rename original
        new_original = os.path.join(output_folder, f"{clean_base}.jpg")
        os.rename(filepath, new_original)
        print(f"Renamed {filename} → {clean_base}.jpg")
        # resize
        resize_and_save(new_original, clean_base)

print("✅ All files cleaned + resized!")