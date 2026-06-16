#!/usr/bin/env python3
"""Conversion-optimized before/after ad creative for Weaver's Luxury Detailing."""
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
SS = 2
CW, CH = W * SS, H * SS

img = Image.new("RGB", (CW, CH), (10, 10, 12))
draw = ImageDraw.Draw(img, "RGBA")

def s(v):
    return int(round(v * SS))

FB = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
def font(size):
    return ImageFont.truetype(FB, s(size))

GOLD = (201, 162, 84)
GOLD_HI = (235, 203, 122)
WHITE = (242, 242, 244)
GRAY = (165, 167, 173)
DARK = (16, 16, 18)

# ---------- background charcoal gradient ----------
top, bot = (30, 30, 34), (8, 8, 10)
px = img.load()
for y in range(CH):
    t = y / (CH - 1)
    c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
    for x in range(CW):
        px[x, y] = c
draw = ImageDraw.Draw(img, "RGBA")
cx = CW // 2

# ---------- text helpers ----------
def centered(cx, y, txt, fnt, fill, tracking=0, shadow=None, soff=4):
    if tracking == 0:
        b = draw.textbbox((0, 0), txt, font=fnt)
        x = cx - (b[2] - b[0]) / 2
        if shadow:
            draw.text((x + s(soff), y - b[1] + s(soff)), txt, font=fnt, fill=shadow)
        draw.text((x, y - b[1]), txt, font=fnt, fill=fill)
        return
    widths = [draw.textbbox((0, 0), ch, font=fnt)[2] - draw.textbbox((0, 0), ch, font=fnt)[0] for ch in txt]
    total = sum(widths) + tracking * (len(txt) - 1)
    x = cx - total / 2
    btop = draw.textbbox((0, 0), txt, font=fnt)[1]
    for ch, w in zip(txt, widths):
        if shadow:
            draw.text((x + s(soff), y - btop + s(soff)), ch, font=fnt, fill=shadow)
        draw.text((x, y - btop), ch, font=fnt, fill=fill)
        x += w + tracking

def left_text(x, y, txt, fnt, fill):
    b = draw.textbbox((0, 0), txt, font=fnt)
    draw.text((x, y - b[1]), txt, font=fnt, fill=fill)
    return b[2] - b[0]

def star5(d, ox, oy, r, fill):
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.42
        pts.append((ox + rr * math.cos(ang), oy + rr * math.sin(ang)))
    d.polygon(pts, fill=fill)

def sparkle(d, x, y, r, color):
    d.polygon([(x, y - r), (x + r * 0.15, y - r * 0.15), (x + r, y),
               (x + r * 0.15, y + r * 0.15), (x, y + r), (x - r * 0.15, y + r * 0.15),
               (x - r, y), (x - r * 0.15, y - r * 0.15)], fill=color)

# ---------- HEADER ----------
centered(cx, s(60), "PREMIUM MOBILE AUTO DETAILING", font(24), GOLD, tracking=s(7))
centered(cx, s(98), "WEAVER'S", font(96), WHITE, shadow=(0, 0, 0, 160), soff=5)
centered(cx, s(206), "LUXURY DETAILING", font(46), GOLD, tracking=s(10))

# ---------- BEFORE / AFTER PANEL ----------
pad = s(50)
ptop, pbot = s(300), s(812)
draw.rounded_rectangle([pad, ptop, CW - pad, pbot], radius=s(20), fill=(0, 0, 0, 255))
midx = cx

# left (before) background
draw.rounded_rectangle([pad, ptop, midx, pbot], radius=s(20), fill=(58, 58, 62, 255))
draw.rectangle([midx - s(20), ptop, midx, pbot], fill=(58, 58, 62, 255))
# right (after) background with radial gold glow
for rr in range(s(360), 0, -s(8)):
    a = int(36 * (1 - rr / s(360)))
    gx, gy = midx + (CW - pad - midx) // 2, (ptop + pbot) // 2
    draw.ellipse([gx - rr, gy - rr * 0.7, gx + rr, gy + rr * 0.7], fill=(201, 162, 84, a))

# ---------- car drawing ----------
def car(d, ox, oy, scale, body, gloss=False, dusty=False, rim=(120, 122, 130)):
    def p(x, y):
        return (ox + x * scale, oy + y * scale)
    # shadow
    d.ellipse([p(-300, 118)[0], p(0, 150)[1], p(300, 118)[0], p(0, 196)[1]], fill=(0, 0, 0, 110))
    body_poly = [p(-300, 70), p(-282, 26), p(-235, 6), p(-140, -8),
                 p(-82, -66), p(0, -90), p(95, -86), p(168, -54),
                 p(224, -10), p(292, 6), p(310, 34), p(310, 76), p(-300, 76)]
    d.polygon(body_poly, fill=body)
    glass = [p(-70, -58), p(-2, -80), p(88, -78), p(140, -52), p(112, -20), p(-54, -20)]
    d.polygon(glass, fill=(95, 120, 140) if not gloss else (150, 205, 235))
    if gloss:
        d.polygon([p(-44, -56), p(-16, -66), p(2, -22), p(-36, -22)], fill=(225, 245, 255, 180))
        # gold gloss streak
        d.polygon([p(-280, 30), p(300, 10), p(300, 26), p(-280, 48)], fill=(235, 203, 122, 150))
        d.polygon([p(-280, 50), p(300, 30), p(300, 38), p(-280, 62)], fill=(255, 255, 255, 70))
    if dusty:
        import random
        random.seed(3)
        for _ in range(60):
            dx = random.uniform(-280, 290); dy = random.uniform(-50, 70)
            d.ellipse([p(dx, dy)[0], p(dx, dy)[1], p(dx, dy)[0] + s(3), p(dx, dy)[1] + s(3)],
                      fill=(120, 116, 105, 150))
    # lower shade
    d.polygon([p(-300, 60), p(310, 60), p(310, 76), p(-300, 76)], fill=(0, 0, 0, 120))
    # wheels
    for wxp in (-178, 190):
        d.ellipse([p(wxp - 56, 28)[0], p(wxp - 56, 28)[1], p(wxp + 56, 28)[0], p(wxp + 56, 140)[1]],
                  fill=(8, 8, 10))
        d.ellipse([p(wxp - 26, 58)[0], p(wxp - 26, 58)[1], p(wxp + 26, 58)[0], p(wxp + 26, 110)[1]],
                  fill=rim)
        d.ellipse([p(wxp - 9, 76)[0], p(wxp - 9, 76)[1], p(wxp + 9, 76)[0], p(wxp + 9, 92)[1]],
                  fill=(40, 40, 44))

car_y = ptop + s(250)
# BEFORE car (dull gray, dusty)
car(draw, (pad + midx) // 2, car_y, SS * 0.78, (92, 92, 96), gloss=False, dusty=True, rim=(96, 96, 100))
# AFTER car (black glossy + gold shine)
acx = (midx + CW - pad) // 2
car(draw, acx, car_y, SS * 0.78, (14, 16, 22), gloss=True, rim=(205, 175, 110))
sparkle(draw, acx - s(70), car_y - s(70), s(22), GOLD_HI)
sparkle(draw, acx + s(90), car_y - s(50), s(15), WHITE)
sparkle(draw, acx + s(150), car_y - s(8), s(12), GOLD_HI)

# labels
def tag(xc, y, txt, bg, fg):
    f = font(22)
    b = draw.textbbox((0, 0), txt, font=f)
    tw = b[2] - b[0]
    pw, ph = tw + s(28), s(40)
    draw.rounded_rectangle([xc - pw / 2, y, xc + pw / 2, y + ph], radius=s(20), fill=bg)
    draw.text((xc - tw / 2, y + (ph - (b[3] - b[1])) / 2 - b[1]), txt, font=f, fill=fg)

tag((pad + midx) // 2, ptop + s(28), "BEFORE", (20, 20, 22, 235), GRAY)
tag(acx, ptop + s(28), "AFTER", GOLD, (20, 20, 20))

# center divider + arrow circle
draw.line([midx, ptop + s(8), midx, pbot - s(8)], fill=GOLD, width=s(4))
acr = s(46)
draw.ellipse([midx - acr, car_y - acr, midx + acr, car_y + acr], fill=GOLD)
draw.polygon([(midx - s(14), car_y - s(18)), (midx + s(20), car_y),
              (midx - s(14), car_y + s(18))], fill=(20, 20, 20))

# ---------- OFFER BADGE (starburst) ----------
bx, by, br = CW - pad - s(40), ptop + s(20), s(96)
burst = []
spikes = 16
for i in range(spikes * 2):
    ang = i * math.pi / spikes
    rr = br if i % 2 == 0 else br * 0.82
    burst.append((bx + rr * math.cos(ang), by + rr * math.sin(ang)))
draw.polygon(burst, fill=(190, 40, 48))
draw.ellipse([bx - br * 0.8, by - br * 0.8, bx + br * 0.8, by + br * 0.8], outline=GOLD_HI, width=s(3))
centered(bx, by - s(34), "$50", font(46), WHITE)
centered(bx, by + s(8), "OFF", font(30), GOLD_HI)
centered(bx, by + s(40), "1ST DETAIL", font(17), WHITE)

# ---------- HEADLINE ----------
centered(cx, s(852), "SHOWROOM SHINE, AT YOUR DOOR", font(40), WHITE, shadow=(0, 0, 0, 140), soff=3)

# ---------- STARS + social proof ----------
sy = s(928)
star_r = s(20)
gap = s(50)
startx = cx - (gap * 4) / 2
for i in range(5):
    star5(draw, startx + i * gap, sy, star_r, GOLD_HI)
centered(cx, s(958), "Rated 5.0  •  200+ Five-Star Local Reviews", font(26), GRAY)

# ---------- location ----------
centered(cx, s(1008), "Serving Bloomington-Normal, IL", font(30), GOLD)

# ---------- CTA ----------
cta_w, cta_h = s(760), s(150)
cta_x = cx - cta_w / 2
cta_y = s(1066)
draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h], radius=s(18), fill=GOLD)
centered(cx, cta_y + s(24), "CALL OR TEXT TO BOOK", font(26), (25, 25, 25))
centered(cx, cta_y + s(60), "309-200-9509", font(64), (15, 15, 15))

# ---------- urgency footer ----------
centered(cx, s(1268), "BOOK THIS WEEK  —  LIMITED SPOTS AVAILABLE", font(24), GOLD_HI, tracking=s(4))

out = img.resize((W, H), Image.LANCZOS)
out.save("/home/user/Kellan/weavers_luxury_ad.png")
out.save("/home/user/Kellan/weavers_luxury_ad.jpg", quality=92)
print("saved", out.size)
