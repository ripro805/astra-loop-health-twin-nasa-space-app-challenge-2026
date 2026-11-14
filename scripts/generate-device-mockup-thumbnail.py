"""
Generates a professional 1920x1080 multi-device mockup thumbnail for ASTRA-LOOP.
Features Laptop, iPad/Tablet, and Mobile Phone displaying real project screenshots.
"""
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_thumbnail():
    W, H = 1920, 1080
    canvas = Image.new("RGBA", (W, H), (6, 10, 24, 255))
    draw = ImageDraw.Draw(canvas)

    # 1. Background Gradient & Glow
    for y in range(H):
        ratio = y / H
        r = int(6 + 8 * math.sin(ratio * math.pi))
        g = int(10 + 12 * (1 - ratio))
        b = int(24 + 20 * (1 - ratio))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Glow spots (Behind devices)
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)

    glow_draw.ellipse([300, 300, 1100, 950], fill=(0, 180, 255, 35))
    glow_draw.ellipse([1100, 350, 1750, 950], fill=(138, 43, 226, 30))
    glow_draw.ellipse([700, 550, 1200, 1050], fill=(0, 240, 255, 25))

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
    canvas = Image.alpha_composite(canvas, glow_layer)
    draw = ImageDraw.Draw(canvas)

    # Space grid / particles
    random.seed(42)
    for _ in range(120):
        sx = random.randint(0, W)
        sy = random.randint(0, H)
        s_rad = random.choice([1, 1, 1, 2, 2, 3])
        s_alpha = random.randint(40, 180)
        draw.ellipse([sx, sy, sx + s_rad, sy + s_rad], fill=(200, 230, 255, s_alpha))

    # Load Fonts
    font_dir = "C:/Windows/Fonts"
    font_bold = os.path.join(font_dir, "segoeuib.ttf")
    font_reg = os.path.join(font_dir, "segoeui.ttf")

    title_font = ImageFont.truetype(font_bold, 54)
    subtitle_font = ImageFont.truetype(font_reg, 24)
    badge_font = ImageFont.truetype(font_bold, 18)
    pill_font = ImageFont.truetype(font_bold, 16)
    device_label_font = ImageFont.truetype(font_bold, 14)

    # 2. Header Section
    badge_text = "🚀  NASA INTERNATIONAL SPACE APPS CHALLENGE 2026"
    badge_bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
    badge_w = badge_bbox[2] - badge_bbox[0]
    badge_h = badge_bbox[3] - badge_bbox[1]
    bx = (W - badge_w) // 2
    by = 45

    draw.rounded_rectangle([bx - 24, by - 8, bx + badge_w + 24, by + badge_h + 10], radius=16, fill=(10, 35, 65, 230), outline=(0, 210, 255, 180), width=2)
    draw.text((bx, by), badge_text, font=badge_font, fill=(0, 230, 255, 255))

    title_text = "ASTRA-LOOP"
    t_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    tw = t_bbox[2] - t_bbox[0]
    draw.text(((W - tw) // 2, 95), title_text, font=title_font, fill=(255, 255, 255, 255))

    sub_text = "Autonomous Closed-Loop Astronaut Health Twin  •  Multi-Device Responsive Ecosystem"
    s_bbox = draw.textbbox((0, 0), sub_text, font=subtitle_font)
    sw = s_bbox[2] - s_bbox[0]
    draw.text(((W - sw) // 2, 165), sub_text, font=subtitle_font, fill=(156, 188, 220, 240))

    def get_round_mask(size, radius):
        mask = Image.new("L", size, 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.rounded_rectangle([(0, 0), (size[0]-1, size[1]-1)], radius=radius, fill=255)
        return mask

    # 3. DEVICE 1: LAPTOP (Left - Center)
    laptop_x = 100
    laptop_y = 260
    screen_w, screen_h = 840, 525
    bezel = 14
    lid_w = screen_w + bezel * 2
    lid_h = screen_h + bezel + 24

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([laptop_x - 10, laptop_y + 10, laptop_x + lid_w + 10, laptop_y + lid_h + 40], radius=24, fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    canvas = Image.alpha_composite(canvas, shadow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([laptop_x, laptop_y, laptop_x + lid_w, laptop_y + lid_h], radius=16, fill=(24, 27, 34, 255), outline=(55, 65, 80, 255), width=2)

    cam_x = laptop_x + lid_w // 2
    cam_y = laptop_y + 10
    draw.ellipse([cam_x - 3, cam_y - 3, cam_x + 3, cam_y + 3], fill=(8, 12, 16, 255), outline=(0, 180, 255, 120), width=1)

    dash_img_path = "docs/screenshots/dashboard-v2.png"
    if os.path.exists(dash_img_path):
        dash_img = Image.open(dash_img_path).convert("RGBA")
        dash_resized = dash_img.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
        mask = get_round_mask((screen_w, screen_h), 6)
        canvas.paste(dash_resized, (laptop_x + bezel, laptop_y + bezel + 8), mask)

    base_w = lid_w + 100
    base_h = 18
    base_x = laptop_x - 50
    base_y = laptop_y + lid_h
    draw.rounded_rectangle([base_x, base_y, base_x + base_w, base_y + base_h], radius=8, fill=(35, 40, 50, 255), outline=(70, 80, 95, 255), width=1)
    draw.rounded_rectangle([base_x + base_w // 2 - 50, base_y, base_x + base_w // 2 + 50, base_y + 5], radius=3, fill=(18, 22, 28, 255))

    draw.text((laptop_x + 20, laptop_y - 28), "💻  MISSION CONTROL DESKTOP (1280x900)", font=device_label_font, fill=(0, 210, 255, 230))

    # 4. DEVICE 2: TABLET / iPAD (Right)
    tablet_x = 1040
    tablet_y = 240
    tab_screen_w, tab_screen_h = 560, 680
    tab_bezel = 18
    tab_w = tab_screen_w + tab_bezel * 2
    tab_h = tab_screen_h + tab_bezel * 2

    shadow_tab = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    st_draw = ImageDraw.Draw(shadow_tab)
    st_draw.rounded_rectangle([tablet_x - 10, tablet_y + 10, tablet_x + tab_w + 10, tablet_y + tab_h + 20], radius=32, fill=(0, 0, 0, 170))
    shadow_tab = shadow_tab.filter(ImageFilter.GaussianBlur(32))
    canvas = Image.alpha_composite(canvas, shadow_tab)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([tablet_x, tablet_y, tablet_x + tab_w, tablet_y + tab_h], radius=28, fill=(20, 24, 30, 255), outline=(0, 180, 255, 100), width=2)
    draw.ellipse([tablet_x + tab_w // 2 - 3, tablet_y + 8, tablet_x + tab_w // 2 + 3, tablet_y + 14], fill=(8, 12, 16, 255))

    body_img_path = "docs/screenshots/body-view.png"
    if os.path.exists(body_img_path):
        body_img = Image.open(body_img_path).convert("RGBA")
        body_resized = body_img.resize((tab_screen_w, tab_screen_h), Image.Resampling.LANCZOS)
        t_mask = get_round_mask((tab_screen_w, tab_screen_h), 14)
        canvas.paste(body_resized, (tablet_x + tab_bezel, tablet_y + tab_bezel), t_mask)

    draw.text((tablet_x + 20, tablet_y - 28), "📱  TABLET / iPAD TWIN VIEW", font=device_label_font, fill=(180, 140, 255, 230))

    # 5. DEVICE 3: SMARTPHONE (Foreground)
    phone_x = 810
    phone_y = 440
    ph_screen_w, ph_screen_h = 270, 520
    ph_bezel = 12
    ph_w = ph_screen_w + ph_bezel * 2
    ph_h = ph_screen_h + ph_bezel * 2

    shadow_ph = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sph_draw = ImageDraw.Draw(shadow_ph)
    sph_draw.rounded_rectangle([phone_x - 15, phone_y + 15, phone_x + ph_w + 15, phone_y + ph_h + 30], radius=40, fill=(0, 0, 0, 210))
    shadow_ph = shadow_ph.filter(ImageFilter.GaussianBlur(28))
    canvas = Image.alpha_composite(canvas, shadow_ph)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([phone_x, phone_y, phone_x + ph_w, phone_y + ph_h], radius=34, fill=(15, 18, 24, 255), outline=(0, 240, 255, 220), width=3)

    mob_img_path = "docs/screenshots/dashboard-mobile.png"
    if os.path.exists(mob_img_path):
        mob_img = Image.open(mob_img_path).convert("RGBA")
        mob_resized = mob_img.resize((ph_screen_w, ph_screen_h), Image.Resampling.LANCZOS)
        p_mask = get_round_mask((ph_screen_w, ph_screen_h), 22)
        canvas.paste(mob_resized, (phone_x + ph_bezel, phone_y + ph_bezel), p_mask)

    di_w, di_h = 70, 16
    di_x = phone_x + (ph_w - di_w) // 2
    di_y = phone_y + ph_bezel + 6
    draw.rounded_rectangle([di_x, di_y, di_x + di_w, di_y + di_h], radius=8, fill=(0, 0, 0, 255))
    draw.ellipse([di_x + di_w - 18, di_y + 4, di_x + di_w - 10, di_y + 12], fill=(15, 25, 45, 255))

    draw.text((phone_x + 35, phone_y + ph_h + 12), "📲  MOBILE DAILY CHECK-IN", font=device_label_font, fill=(0, 240, 255, 240))

    # 6. Bottom Badges
    pills = [
        "🩺 7 Physiological Domains",
        "🛰️ NASA-STD-3001 Compliance",
        "📡 100% Offline-First (IndexedDB)",
        "🔬 Closed-Loop Countermeasures",
        "⚡ Next.js 14 • TypeScript • Prisma"
    ]

    total_pills_w = 0
    pill_bboxes = []
    for p in pills:
        pb = draw.textbbox((0, 0), p, font=pill_font)
        pw = pb[2] - pb[0] + 32
        pill_bboxes.append((pw, pb[3] - pb[1]))
        total_pills_w += pw + 16
    total_pills_w -= 16

    px = (W - total_pills_w) // 2
    py = 1010
    for i, p in enumerate(pills):
        pw, ph = pill_bboxes[i]
        draw.rounded_rectangle([px, py, px + pw, py + 42], radius=12, fill=(14, 22, 38, 220), outline=(0, 160, 230, 100), width=1)
        draw.text((px + 16, py + 11), p, font=pill_font, fill=(210, 235, 255, 240))
        px += pw + 16

    out_dir = "docs"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "ASTRA_LOOP_MULTI_DEVICE_THUMBNAIL.png")
    canvas.convert("RGB").save(out_path, "PNG", quality=95)
    print(f"Generated: {out_path}")
    return out_path

if __name__ == "__main__":
    create_thumbnail()
