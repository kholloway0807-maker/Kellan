#!/usr/bin/env python3
"""Weaver's Luxury Detailing ad — layout adapted from the 'Urban Car Care' reference.
Square 1080x1080. No reviews/claims, just brand + service + contact."""
import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1080, 1080
SS = 2
CW, CH = W * SS, H * SS

def s(v):
    return int(round(v * SS))

FB = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
DJ = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def font(size, dj=False):
    return ImageFont.truetype(DJ if dj else FB, s(size))

GOLD = (192, 152, 74)
GOLD_HI = (224, 188, 108)
INK = (24, 26, 30)
GRAY = (110, 112, 118)
WHITE = (248, 248, 250)

# ---------- background: clean light studio ----------
img = Image.new("RGB", (CW, CH), (250, 250, 252))
px = img.load()
top, bot = (252, 252, 254), (230, 232, 236)
for y in range(CH):
    t = y / (CH - 1)
    c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
    for x in range(CW):
        px[x, y] = c
draw = ImageDraw.Draw(img, "RGBA")

# soft radial glow behind hero area (right side)
glow = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gcx, gcy = int(CW * 0.62), int(CH * 0.52)
for rr in range(s(520), 0, -s(8)):
    a = int(26 * (1 - rr / s(520)))
    gd.ellipse([gcx - rr, gcy - rr, gcx + rr, gcy + rr], fill=(224, 188, 108, a))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(img, "RGBA")

# =================================================================
#  REALISTIC CAR RENDERER (glossy luxury fastback)
# =================================================================
def vgrad(w, h, c0, c1):
    g = Image.new("RGB", (1, h)); gp = g.load()
    for y in range(h):
        t = y / max(1, h - 1)
        gp[0, y] = tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))
    return g.resize((w, h))

def render_car():
    HW, HH = 1760, 1120
    sx, sy = HW / 1000.0, HH / 580.0
    def P(x, y): return (x * sx, y * sy)
    def PL(pts): return [P(*p) for p in pts]
    car = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))

    body = [(95, 452), (78, 392), (88, 356), (150, 322), (300, 300),
            (372, 230), (468, 188), (600, 182), (690, 210), (742, 262),
            (792, 286), (905, 300), (948, 320), (962, 352), (956, 404), (946, 452)]
    bmask = Image.new("L", (HW, HH), 0)
    ImageDraw.Draw(bmask).polygon(PL(body), fill=255)
    paint = vgrad(HW, HH, (70, 76, 90), (4, 5, 8))      # deep glossy black
    car.paste(paint.convert("RGBA"), (0, 0), bmask)
    cd = ImageDraw.Draw(car, "RGBA")

    cd.line(PL([(150, 360), (905, 338)]), fill=(255, 255, 255, 30), width=int(3 * sx))
    cd.line(PL([(150, 366), (905, 344)]), fill=(0, 0, 0, 60), width=int(4 * sx))

    low = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))
    ImageDraw.Draw(low).polygon(PL([(95, 452), (946, 452), (956, 404), (88, 412)]), fill=(0, 0, 0, 150))
    low.putalpha(ImageChops.multiply(low.split()[3], bmask))
    car = Image.alpha_composite(car, low)
    cd = ImageDraw.Draw(car, "RGBA")

    glass_poly = [(392, 224), (470, 196), (598, 192), (676, 214), (706, 262), (372, 286)]
    gmask = Image.new("L", (HW, HH), 0)
    ImageDraw.Draw(gmask).polygon(PL(glass_poly), fill=255)
    glass = vgrad(HW, HH, (158, 204, 230), (26, 42, 64))
    car.paste(glass.convert("RGBA"), (0, 0), gmask)
    cd = ImageDraw.Draw(car, "RGBA")
    cd.line(PL(glass_poly + [glass_poly[0]]), fill=(0, 0, 0, 200), width=int(4 * sx))
    cd.line(PL([(536, 192), (540, 286)]), fill=(10, 10, 12, 255), width=int(7 * sx))
    cd.polygon(PL([(410, 222), (452, 204), (470, 250), (404, 268)]), fill=(225, 242, 255, 150))

    spec = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))
    sd = ImageDraw.Draw(spec, "RGBA")
    sd.polygon(PL([(380, 232), (700, 208), (905, 300), (905, 318), (300, 312)]), fill=(255, 255, 255, 70))
    sd.polygon(PL([(150, 372), (905, 350), (905, 392), (120, 412)]), fill=(224, 188, 108, 95))
    sd.line(PL([(372, 232), (690, 210)]), fill=(255, 255, 255, 170), width=int(4 * sx))
    spec = spec.filter(ImageFilter.GaussianBlur(int(5 * sx)))
    spec.putalpha(ImageChops.multiply(spec.split()[3], bmask))
    car = Image.alpha_composite(car, spec)
    cd = ImageDraw.Draw(car, "RGBA")

    cd.polygon(PL([(905, 306), (948, 320), (950, 342), (905, 332)]), fill=(255, 246, 214, 240))
    cd.polygon(PL([(80, 360), (110, 352), (112, 384), (84, 392)]), fill=(225, 60, 50, 235))

    def wheel(cxw, cyw, r):
        cd.ellipse([P(cxw - r, cyw - r)[0], P(cxw - r, cyw - r)[1], P(cxw + r, cyw + r)[0], P(cxw + r, cyw + r)[1]], fill=(12, 12, 14))
        cd.ellipse([P(cxw - r*.92, cyw - r*.92)[0], P(cxw - r*.92, cyw - r*.92)[1], P(cxw + r*.92, cyw + r*.92)[0], P(cxw + r*.92, cyw + r*.92)[1]], outline=(40, 40, 44), width=int(4 * sx))
        rr = r * 0.60
        cd.ellipse([P(cxw - rr, cyw - rr)[0], P(cxw - rr, cyw - rr)[1], P(cxw + rr, cyw + rr)[0], P(cxw + rr, cyw + rr)[1]], fill=(58, 60, 66))
        cxp, cyp = P(cxw, cyw)
        for i in range(10):
            a = i * (2 * math.pi / 10)
            cd.line([cxp + (rr*0.18*sx)*math.cos(a), cyp + (rr*0.18*sy)*math.sin(a),
                     cxp + (rr*0.92*sx)*math.cos(a), cyp + (rr*0.92*sy)*math.sin(a)],
                    fill=(210, 180, 118), width=int(6 * sx))
        cd.ellipse([P(cxw - r*.14, cyw - r*.14)[0], P(cxw - r*.14, cyw - r*.14)[1], P(cxw + r*.14, cyw + r*.14)[0], P(cxw + r*.14, cyw + r*.14)[1]], fill=(235, 203, 122))
    wheel(232, 452, 86)
    wheel(806, 452, 86)
    return car

car = Image.open("/home/user/Kellan/_suv_cut.png").convert("RGBA")
CARW = s(560)
car = car.resize((CARW, int(CARW * car.height / car.width)), Image.LANCZOS)

# floor reflection
refl = car.transpose(Image.FLIP_TOP_BOTTOM)
fade = Image.new("L", refl.size, 0)
fp = fade.load()
for y in range(refl.height):
    a = int(70 * (1 - y / refl.height))
    for x in range(refl.width):
        fp[x, y] = a
refl.putalpha(ImageChops.multiply(refl.split()[3], fade))

car_x = CW - CARW - s(20)
car_y = s(430)
img.paste(refl, (car_x, car_y + car.height - s(14)), refl)
img.paste(car, (car_x, car_y), car)
draw = ImageDraw.Draw(img, "RGBA")

# =================================================================
#  TEXT / LAYOUT
# =================================================================
def text(x, y, txt, fnt, fill):
    b = draw.textbbox((0, 0), txt, font=fnt)
    draw.text((x, y - b[1]), txt, font=fnt, fill=fill)
    return b[2] - b[0], b[3] - b[1]

def rtext(xr, y, txt, fnt, fill, tracking=0):
    if tracking == 0:
        b = draw.textbbox((0, 0), txt, font=fnt)
        draw.text((xr - (b[2]-b[0]), y - b[1]), txt, font=fnt, fill=fill)
        return b[2]-b[0]
    widths = [draw.textbbox((0,0),ch,font=fnt)[2]-draw.textbbox((0,0),ch,font=fnt)[0] for ch in txt]
    total = sum(widths) + tracking*(len(txt)-1)
    x = xr - total
    btop = draw.textbbox((0,0),txt,font=fnt)[1]
    for ch,w in zip(txt,widths):
        draw.text((x, y-btop), ch, font=fnt, fill=fill); x += w+tracking
    return total

# ---- top-left stacked highlight words ----
words = ["NEW", "SHINY", "GLOSSY"]
wf = font(58)
wy = s(80)
for wd in words:
    b = draw.textbbox((0, 0), wd, font=wf)
    tw, th = b[2]-b[0], b[3]-b[1]
    bx0, by0 = s(70), wy
    draw.rounded_rectangle([bx0 - s(14), by0 - s(8), bx0 + tw + s(20), by0 + th + s(18)],
                           radius=s(10), fill=(GOLD[0], GOLD[1], GOLD[2], 235))
    draw.text((bx0, by0 - b[1] + s(6)), wd, font=wf, fill=WHITE)
    wy += th + s(34)

# ---- top-right brand lockup ----
rx = CW - s(60)
# emblem
em_r = s(30)
em_cx = rx - s(2)
# name
nm = "WEAVER'S"
nf = font(38)
nb = draw.textbbox((0, 0), nm, font=nf)
rtext(rx, s(82), nm, nf, INK)
rtext(rx, s(130), "LUXURY DETAILING", font(18), GOLD, tracking=s(4))
rtext(rx, s(160), "We protect. We perfect.", font(17), GRAY)
# small emblem to the left of the name
ecx = rx - (nb[2]-nb[0]) - s(34)
ecy = s(104)
draw.ellipse([ecx - em_r, ecy - em_r, ecx + em_r, ecy + em_r], outline=GOLD, width=s(3))
mf = font(30)
mb = draw.textbbox((0, 0), "W", font=mf)
draw.text((ecx - (mb[2]-mb[0])/2, ecy - (mb[3]-mb[1])/2 - mb[1]), "W", font=mf, fill=GOLD)

# ---- service headline (mid-left) ----
text(s(72), s(452), "Give your vehicle the", font(26), GRAY)
text(s(70), s(494), "CERAMIC", font(86), INK)
text(s(70), s(582), "COATING", font(86), INK)
draw.rounded_rectangle([s(74), s(682), s(360), s(692)], radius=s(5), fill=GOLD)
text(s(72), s(712), "Paint Protection  •  Interior  •  Exterior", font(22), GRAY)

# ---- contact footer bar ----
fy0, fy1 = s(944), s(1040)
draw.rounded_rectangle([s(40), fy0, CW - s(40), fy1], radius=s(20), fill=(20, 21, 24, 255))
draw.rounded_rectangle([s(40), fy0, CW - s(40), fy0 + s(6)], radius=s(3), fill=GOLD)
fcy = (fy0 + fy1) // 2

def badge(cxb, cyb, r):
    draw.ellipse([cxb - r, cyb - r, cxb + r, cyb + r], fill=GOLD)

# phone (left)
pbx = s(90)
badge(pbx, fcy, s(26))
pf = font(22, dj=True)
pb = draw.textbbox((0, 0), "☎", font=pf)
draw.text((pbx - (pb[2]-pb[0])/2 - pb[0], fcy - (pb[3]-pb[1])/2 - pb[1]), "☎", font=pf, fill=(20, 21, 24))
text(pbx + s(40), fcy - s(16), "309-200-9509", font(30), WHITE)

# location (right)
def pin(cxp, cyp, r, color):
    draw.ellipse([cxp - r, cyp - r, cxp + r, cyp + r*0.4], fill=color)
    draw.polygon([(cxp - r*0.7, cyp + r*0.05), (cxp + r*0.7, cyp + r*0.05), (cxp, cyp + r*1.15)], fill=color)
    draw.ellipse([cxp - r*0.34, cyp - r*0.5, cxp + r*0.34, cyp + r*0.18], fill=(20, 21, 24))

loc_txt = "Bloomington-Normal, IL"
lf = font(26)
lw = draw.textbbox((0, 0), loc_txt, font=lf)[2]
lbx = CW - s(90)
rtext(lbx, fcy - s(14), loc_txt, lf, WHITE)
pin(lbx - lw - s(28), fcy, s(22), GOLD)

out = img.convert("RGB").resize((W, H), Image.LANCZOS)
out.save("/home/user/Kellan/weavers_ceramic_ad.png")
out.save("/home/user/Kellan/weavers_ceramic_ad.jpg", quality=92)
print("saved", out.size)
