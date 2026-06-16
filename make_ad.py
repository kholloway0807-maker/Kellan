#!/usr/bin/env python3
"""Still-image ad creative for Mason Weaver Car Detailing."""
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1350
SS = 2                      # supersample factor for crisp edges
CW, CH = W * SS, H * SS

img = Image.new("RGB", (CW, CH), (0, 0, 0))
draw = ImageDraw.Draw(img, "RGBA")

def s(v):
    return int(round(v * SS))

# ---------- fonts ----------
FB = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
DB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def font(path, size):
    return ImageFont.truetype(path, s(size))

# ---------- background: candy gradient cyan -> blue -> red -> magenta -> purple ----------
stops = [
    (0.00, (24, 205, 240)),   # bright cyan
    (0.20, (30, 120, 235)),   # blue
    (0.48, (226, 52, 44)),    # vivid red
    (0.74, (200, 30, 125)),   # magenta
    (1.00, (118, 30, 165)),   # purple
]
def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def grad_color(p):
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        if p0 <= p <= p1:
            return lerp(c0, c1, (p - p0) / (p1 - p0))
    return stops[-1][1]

px = img.load()
for y in range(CH):
    c = grad_color(y / (CH - 1))
    for x in range(CW):
        px[x, y] = c

draw = ImageDraw.Draw(img, "RGBA")

# ---------- decorative bubbles / sparkles ----------
import random
random.seed(7)
for _ in range(70):
    bx = random.randint(0, CW)
    by = random.randint(0, CH)
    r = random.randint(s(4), s(26))
    a = random.randint(20, 60)
    draw.ellipse([bx - r, by - r, bx + r, by + r],
                 outline=(255, 255, 255, a), width=max(1, s(2)))
    if random.random() < 0.5:
        draw.ellipse([bx - r // 3, by - r // 3, bx + r // 3, by + r // 3],
                     fill=(255, 255, 255, a + 20))

# ---------- text helpers ----------
def text_size(d, txt, fnt, tracking=0):
    if tracking == 0:
        b = d.textbbox((0, 0), txt, font=fnt)
        return b[2] - b[0], b[3] - b[1], b[1]
    w = 0
    for ch in txt:
        b = d.textbbox((0, 0), ch, font=fnt)
        w += (b[2] - b[0]) + tracking
    w -= tracking
    b = d.textbbox((0, 0), txt, font=fnt)
    return w, b[3] - b[1], b[1]

def draw_centered(cx, y, txt, fnt, fill, tracking=0, shadow=(0, 0, 0, 130), shadow_off=4, outline=None, ow=0):
    tw, th, top = text_size(draw, txt, fnt, tracking)
    x = cx - tw / 2
    so = s(shadow_off)
    if tracking == 0:
        if shadow:
            if outline:
                for dx in range(-ow, ow + 1):
                    for dy in range(-ow, ow + 1):
                        draw.text((x + dx, y - top + dy), txt, font=fnt, fill=outline)
            draw.text((x + so, y - top + so), txt, font=fnt, fill=shadow)
        if outline:
            for dx in range(-ow, ow + 1):
                for dy in range(-ow, ow + 1):
                    if dx or dy:
                        draw.text((x + dx, y - top + dy), txt, font=fnt, fill=outline)
        draw.text((x, y - top), txt, font=fnt, fill=fill)
    else:
        cxp = x
        for ch in txt:
            b = draw.textbbox((0, 0), ch, font=fnt)
            cw = b[2] - b[0]
            if shadow:
                draw.text((cxp + so, y - top + so), ch, font=fnt, fill=shadow)
            if outline:
                for dx in range(-ow, ow + 1):
                    for dy in range(-ow, ow + 1):
                        if dx or dy:
                            draw.text((cxp + dx, y - top + dy), ch, font=fnt, fill=outline)
            draw.text((cxp, y - top), ch, font=fnt, fill=fill)
            cxp += cw + tracking
    return th

cx = CW // 2

# ---------- top eyebrow ----------
draw_centered(cx, s(70), "PREMIUM MOBILE AUTO DETAILING", font(FB, 26),
              (255, 255, 255, 235), tracking=s(6), shadow_off=2)

# ---------- business name ----------
draw_centered(cx, s(108), "MASON WEAVER", font(FB, 96), (255, 255, 255),
              shadow=(0, 0, 0, 150), shadow_off=6)
# CAR DETAILING in a yellow accent band feel
draw_centered(cx, s(214), "CAR DETAILING", font(FB, 60), (255, 222, 60),
              tracking=s(8), shadow=(0, 0, 0, 150), shadow_off=5)

# ---------- the glossy car ----------
def draw_car(d, ox, oy, scale):
    """Sleek glossy coupe silhouette centered around (ox, oy)."""
    def p(x, y):
        return (ox + x * scale, oy + y * scale)
    # shadow under car
    d.ellipse([p(-330, 120)[0], p(0, 150)[1], p(330, 120)[0], p(0, 205)[1]],
              fill=(0, 0, 0, 90))
    # body outline (coupe profile)
    body = [
        p(-320, 70), p(-300, 25), p(-250, 5), p(-150, -10),
        p(-90, -70), p(-10, -95), p(90, -92), p(170, -58),
        p(230, -12), p(300, 5), p(322, 35), p(322, 78),
        p(-320, 78),
    ]
    # base body gradient: dark navy to lighter (gloss)
    d.polygon(body, fill=(15, 20, 40, 255))
    # roof/greenhouse (windows) lighter glass with reflection
    glass = [p(-78, -62), p(-12, -84), p(85, -82), p(150, -54), p(120, -18), p(-60, -18)]
    d.polygon(glass, fill=(120, 200, 235, 255))
    # window reflection streak
    d.polygon([p(-50, -60), p(-20, -70), p(0, -22), p(-40, -22)], fill=(220, 245, 255, 180))
    # pillar
    d.line([p(28, -82), p(36, -20)], fill=(15, 20, 40, 255), width=int(8 * scale))
    # glossy highlight streak across the hood/door
    d.polygon([p(-300, 30), p(300, 8), p(300, 26), p(-300, 50)], fill=(255, 255, 255, 70))
    d.polygon([p(-300, 52), p(310, 30), p(312, 40), p(-300, 64)], fill=(120, 215, 255, 110))
    # lower body shading
    d.polygon([p(-320, 60), p(322, 60), p(322, 78), p(-320, 78)], fill=(5, 8, 20, 255))
    # wheels
    for wx in (-200, 200):
        d.ellipse([p(wx - 62, 30)[0], p(wx - 62, 30)[1], p(wx + 62, 30)[0] + 0, p(wx + 62, 154)[1]],
                  fill=(8, 8, 12, 255))
        d.ellipse([p(wx - 34, 60)[0], p(wx - 34, 60)[1], p(wx + 34, 60)[0], p(wx + 34, 128)[1]],
                  fill=(180, 188, 200, 255))
        d.ellipse([p(wx - 14, 80)[0], p(wx - 14, 80)[1], p(wx + 14, 80)[0], p(wx + 14, 108)[1]],
                  fill=(60, 65, 78, 255))
    # headlight
    d.ellipse([p(298, 8)[0], p(298, 8)[1], p(322, 8)[0], p(322, 30)[1]], fill=(255, 245, 200, 230))

def sparkle(d, x, y, r, color=(255, 255, 255, 255)):
    d.polygon([(x, y - r), (x + r * 0.16, y - r * 0.16),
               (x + r, y), (x + r * 0.16, y + r * 0.16),
               (x, y + r), (x - r * 0.16, y + r * 0.16),
               (x - r, y), (x - r * 0.16, y - r * 0.16)], fill=color)

car_cy = s(560)
draw_car(draw, cx, car_cy, SS)
# shine sparkles on the car
sparkle(draw, cx - s(120), car_cy - s(40), s(34))
sparkle(draw, cx + s(70), car_cy - s(30), s(22))
sparkle(draw, cx + s(210), car_cy - s(10), s(16))
sparkle(draw, cx - s(250), car_cy + s(2), s(14))

# ---------- tagline ----------
draw_centered(cx, s(760), "SHOWROOM SHINE, AT YOUR DOOR", font(FB, 46),
              (255, 255, 255), shadow_off=4)

# ---------- feature pills ----------
features = ["INTERIOR & EXTERIOR", "PAINT CORRECTION", "CERAMIC & WAX"]
pf = font(FB, 28)
gap = s(24)
widths = []
for ft in features:
    b = draw.textbbox((0, 0), ft, font=pf)
    widths.append(b[2] - b[0] + s(48))
total = sum(widths) + gap * (len(features) - 1)
startx = cx - total / 2
py = s(840)
ph = s(58)
for ft, wpill in zip(features, widths):
    draw.rounded_rectangle([startx, py, startx + wpill, py + ph], radius=s(29),
                           fill=(255, 255, 255, 235))
    b = draw.textbbox((0, 0), ft, font=pf)
    tw = b[2] - b[0]
    draw.text((startx + (wpill - tw) / 2, py + (ph - (b[3] - b[1])) / 2 - b[1]),
              ft, font=pf, fill=(190, 25, 60))
    startx += wpill + gap

# ---------- location ----------
draw_centered(cx, s(950), "Serving Bloomington-Normal, IL", font(FB, 38),
              (255, 255, 255), shadow_off=3)

# ---------- CTA phone button ----------
cta_w, cta_h = s(760), s(140)
cta_x = cx - cta_w / 2
cta_y = s(1040)
draw.rounded_rectangle([cta_x + s(6), cta_y + s(8), cta_x + cta_w + s(6), cta_y + cta_h + s(8)],
                       radius=s(70), fill=(0, 0, 0, 110))
draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h],
                       radius=s(70), fill=(255, 222, 60, 255))
draw_centered(cx, cta_y + s(20), "CALL OR TEXT TO BOOK", font(FB, 30),
              (30, 30, 30), shadow=None)
draw_centered(cx, cta_y + s(58), "309-200-9509", font(FB, 64),
              (15, 20, 40), shadow=None)

# ---------- bottom line ----------
draw_centered(cx, s(1265), "BOOK YOUR DETAIL TODAY", font(FB, 26),
              (255, 255, 255, 235), tracking=s(8), shadow_off=2)

# ---------- finish ----------
out = img.resize((W, H), Image.LANCZOS)
out.save("/home/user/Kellan/mason_weaver_ad.png")
out.save("/home/user/Kellan/mason_weaver_ad.jpg", quality=92)
print("saved", out.size)
