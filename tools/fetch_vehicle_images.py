from io import BytesIO
from pathlib import Path
import time

import requests
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "fleet"
OUT.mkdir(parents=True, exist_ok=True)

VEHICLES = {
    "sedan": ["Maruti_Suzuki_Dzire", "Suzuki_Dzire", "Maruti_Suzuki_Swift"],
    "muv": ["Maruti_Suzuki_Ertiga", "Ertiga", "Maruti_Suzuki_Carens"],
    "crysta": ["Toyota_Innova_Crysta", "Toyota_Innova"],
    "hycross": ["Toyota_Innova_Hycross", "Toyota_Innova"],
    "tempo": ["Force_Motors_Traveller", "Tempo_Traveller", "Force_Motors"],
    "urbania": ["Force_Urbania", "Force_Motors_Urbania", "Force_Motors"],
    "eclass": ["Mercedes-Benz_E-Class_(W214)", "Mercedes-Benz_E-Class"],
    "sclass": ["Mercedes-Benz_S-Class_(W223)", "Mercedes-Benz_S-Class"],
    "vellfire": ["Toyota_Vellfire"],
}

headers = {"User-Agent": "RVS-Tours-Site/1.0 (vehicle image preparation)"}

for vehicle_id, titles in VEHICLES.items():
    for title in titles:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            image_url = response.json().get("originalimage", {}).get("source") or response.json().get("thumbnail", {}).get("source")
            if not image_url:
                raise RuntimeError("No page image")

            image_response = requests.get(image_url, headers=headers, timeout=30)
            image_response.raise_for_status()
            image = Image.open(BytesIO(image_response.content)).convert("RGB")
            image.thumbnail((1600, 1200), Image.Resampling.LANCZOS)
            image.save(OUT / f"{vehicle_id}.webp", "WEBP", quality=88, method=6)
            print(f"Saved {vehicle_id}.webp ({image.width}x{image.height})")
            break  # Exit the loop if successful
        except Exception as exc:
            print(f"FAILED {vehicle_id} with title '{title}': {exc}")
    time.sleep(1)
