from PIL import Image, ImageDraw, ImageFont
import zipfile
import shutil
import os
import uuid


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), os.path.relpath(
                os.path.join(root, file), os.path.join(path, '..')))

# Return: Return a path to the PDF/ZIP file in the assets/certs folder


def generate(path, name_list, coordinates):
    base_path = 'assets/certs'

    COLOR = (0, 0, 0)

    OUTPUT_PATH = f'{base_path}/{str(uuid.uuid4().hex)}.zip'

    if not os.path.exists(f'{base_path}/results'):
        os.makedirs(f'{base_path}/results')

    for name in name_list:
        font = ImageFont.truetype('arial.ttf', 24)
        pil_image = Image.open(path)
        pil_image = pil_image.convert("RGB")
        draw = ImageDraw.Draw(pil_image)
        draw.text(coordinates, name, COLOR, font=font)
        pil_image.save(f'{base_path}/results/{name}.pdf')

    zipf = zipfile.ZipFile(OUTPUT_PATH, 'w', zipfile.ZIP_DEFLATED)
    zipdir(f'{base_path}/results', zipf)
    zipf.close()

    shutil.rmtree(f'{base_path}/results', ignore_errors=True)

    return {"message": "success", "output_path": OUTPUT_PATH}, 200
