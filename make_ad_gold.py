#!/usr/bin/env python3
"""Black / gray / gold ad creative for Mason Weaver Car Detailing (minimal)."""
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

GOLD = (200, 162, 84)
GOLD_HI = (230, 198, 120)
WHITE = (240, 240, 242)
GRAY = (170, 172, 178)

# ---------- background: subtle vertical charcoal gradient ----------
top = (26, 27, 30)
bot = (8, 8, 10)
px = img.load()
for y in range(CH):
    t = y / (CH - 1)
    c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
    for x in range(CW):
        px[x, y] = c
draw = ImageDraw.Draw(img, "RGBA")

cx = CW // 2

# ---------- thin gold frame ----------
m = s(46)
draw.rectangle([m, m, CW - m, CH - m], outline=GOLD, width=s(3))

# ---------- text helper ----------
def centered(cx, y, txt, fnt, fill, tracking=0):
    if tracking == 0:
        b = draw.textbbox((0, 0), txt, font=fnt)
        draw.text((cx - (b[2] - b[0]) / 2, y - b[1]), txt, font=fnt, fill=fill)
        return
    widths = []
    for ch in txt:
        b = draw.textbbox((0, 0), ch, font=fnt)
        widths.append(b[2] - b[0])
    total = sum(widths) + tracking * (len(txt) - 1)
    x = cx - total / 2
    btop = draw.textbbox((0, 0), txt, font=fnt)[1]
    for ch, w in zip(txt, widths):
        draw.text((x, y - btop), ch, font=fnt, fill=fill)
        x += w + tracking

# ---------- eyebrow ----------
centered(cx, s(120), "PREMIUM AUTO DETAILING", font(26), GOLD, tracking=s(8))

# ---------- name ----------
centered(cx, s(170), "MASON WEAVER", font(90), WHITE)
centered(cx, s(272), "CAR DETAILING", font(52), GOLD, tracking=s(10))

# divider
draw.line([cx - s(120), s(360), cx + s(120), s(360)], fill=GOLD, width=s(2))

# ---------- simple gold line-art car ----------
def car(d, ox, oy, scale, color, w):
    def p(x, y):
        return (ox + x * scale, oy + y * scale)
    body = [p(-300, 60), p(-270, 18), p(-210, 2), p(-120, -8),
            p(-70, -64), p(20, -86), p(110, -82), p(180, -50),
            p(232, -8), p(296, 6), p(312, 30), p(312, 60)]
    d.line(body, fill=color, width=w, joint="curve")
    d.line([p(-312, 60), p(312, 60)], fill=color, width=w)
    # windows
    d.line([p(-58, -60), p(18, -80), p(100, -78), p(150, -50)], fill=color, width=w, joint="curve")
    d.line([p(40, -80), p(48, -50)], fill=color, width=w)
    # wheels
    for wxp in (-180, 192):
        d.ellipse([p(wxp - 56, 26)[0], p(wxp - 56, 26)[1], p(wxp + 56, 26)[0], p(wxp + 56, 138)[1]],
                  outline=color, width=w)
        d.ellipse([p(wxp - 22, 60)[0], p(wxp - 22, 60)[1], p(wxp + 22, 60)[0], p(wxp + 22, 104)[1]],
                  outline=color, width=max(1, int(w * 0.7)))

def sparkle(d, x, y, r, color):
    d.polygon([(x, y - r), (x + r * 0.15, y - r * 0.15), (x + r, y),
               (x + r * 0.15, y + r * 0.15), (x, y + r), (x - r * 0.15, y + r * 0.15),
               (x - r, y), (x - r * 0.15, y - r * 0.15)], fill=color)

car_cy = s(560)
car(draw, cx, car_cy, SS, GOLD_HI, s(5))
sparkle(draw, cx + s(150), car_cy - s(70), s(20), GOLD_HI)
sparkle(draw, cx - s(220), car_cy - s(40), s(14), GOLD_HI)
sparkle(draw, cx + s(250), car_cy - s(30), s(11), WHITE)

# divider
draw.line([cx - s(120), s(720), cx + s(120), s(720)], fill=GOLD, width=s(2))

# ---------- tagline ----------
centered(cx, s(770), "SHOWROOM SHINE,", font(48), WHITE)
centered(cx, s(826), "AT YOUR DOOR", font(48), WHITE)

# ---------- services (simple, gray) ----------
centered(cx, s(910), "Interior & Exterior  •  Paint Correction  •  Ceramic & Wax",
         font(26), GRAY)

# ---------- location ----------
centered(cx, s(972), "Serving Bloomington-Normal, IL", font(34), GOLD)

# ---------- CTA ----------
cta_w, cta_h = s(720), s(150)
cta_x = cx - cta_w / 2
cta_y = s(1058)
draw.rounded_rectangle([cta_x, cta_y, cta_x + cta_w, cta_y + cta_h],
                       radius=s(16), fill=GOLD)
centered(cx, cta_y + s(26), "CALL OR TEXT", font(28), (20, 20, 20))
centered(cx, cta_y + s(64), "309-200-9509", font(62), (15, 15, 15))

out = img.resize((W, H), Image.LANCZOS)
out.save("/home/user/Kellan/mason_weaver_ad_gold.png")
out.save("/home/user/Kellan/mason_weaver_ad_gold.jpg", quality=92)
print("saved", out.size)
