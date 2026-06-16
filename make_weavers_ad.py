#!/usr/bin/env python3
"""Conversion-optimized before/after ad for Weaver's Luxury Detailing.
Realistic rendered luxury sedan (no cartoon silhouettes)."""
import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1080, 1350
SS = 2
CW, CH = W * SS, H * SS

img = Image.new("RGB", (CW, CH), (10, 10, 12))

def s(v):
    return int(round(v * SS))

FB = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
def font(size):
    return ImageFont.truetype(FB, s(size))

GOLD = (201, 162, 84)
GOLD_HI = (235, 203, 122)
WHITE = (242, 242, 244)
GRAY = (165, 167, 173)

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

# =================================================================
#  REALISTIC CAR RENDERER
# =================================================================
def vgrad(w, h, c0, c1):
    g = Image.new("RGB", (1, h))
    gp = g.load()
    for y in range(h):
        t = y / max(1, h - 1)
        gp[0, y] = tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))
    return g.resize((w, h))

def render_car(variant):
    """Return an RGBA image (880x560 display) of a sleek luxury fastback sedan."""
    HW, HH = 1760, 1120          # hi-res working canvas
    sx, sy = HW / 1000.0, HH / 580.0
    def P(x, y):
        return (x * sx, y * sy)
    def PL(pts):
        return [P(*p) for p in pts]

    car = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))

    # contact shadow
    sh = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse([P(120, 470)[0], P(0, 478)[1], P(900, 470)[0], P(0, 512)[1]],
                               fill=(0, 0, 0, 150))
    sh = sh.filter(ImageFilter.GaussianBlur(int(14 * sx)))
    car = Image.alpha_composite(car, sh)

    # ----- body outline (fastback luxury sedan, facing right) -----
    body = [
        (95, 452), (78, 392), (88, 356), (150, 322), (300, 300),
        (372, 230), (468, 188), (600, 182), (690, 210), (742, 262),
        (792, 286), (905, 300), (948, 320), (962, 352), (956, 404),
        (946, 452),
    ]
    bmask = Image.new("L", (HW, HH), 0)
    ImageDraw.Draw(bmask).polygon(PL(body), fill=255)

    # base paint gradient
    if variant == "after":
        paint = vgrad(HW, HH, (66, 72, 84), (4, 5, 8))      # deep glossy black
    else:
        paint = vgrad(HW, HH, (124, 125, 130), (70, 70, 74))  # dull gray
    car.paste(paint.convert("RGBA"), (0, 0), bmask)

    cd = ImageDraw.Draw(car, "RGBA")

    # body character line (subtle crease along the doors)
    cd.line(PL([(150, 360), (905, 338)]), fill=(255, 255, 255, 28), width=int(3 * sx))
    cd.line(PL([(150, 366), (905, 344)]), fill=(0, 0, 0, 60), width=int(4 * sx))

    # rocker / lower shadow
    low = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))
    ImageDraw.Draw(low).polygon(PL([(95, 452), (946, 452), (956, 404), (88, 412)]),
                                fill=(0, 0, 0, 150))
    low.putalpha(ImageChops.multiply(low.split()[3], bmask))
    car = Image.alpha_composite(car, low)
    cd = ImageDraw.Draw(car, "RGBA")

    # ----- greenhouse / windows -----
    glass_poly = [(392, 224), (470, 196), (598, 192), (676, 214), (706, 262), (372, 286)]
    gmask = Image.new("L", (HW, HH), 0)
    ImageDraw.Draw(gmask).polygon(PL(glass_poly), fill=255)
    if variant == "after":
        glass = vgrad(HW, HH, (150, 198, 226), (28, 44, 66))
    else:
        glass = vgrad(HW, HH, (108, 120, 132), (60, 68, 78))
    car.paste(glass.convert("RGBA"), (0, 0), gmask)
    cd = ImageDraw.Draw(car, "RGBA")
    # window frame
    cd.line(PL(glass_poly + [glass_poly[0]]), fill=(0, 0, 0, 200), width=int(4 * sx))
    # B-pillar
    cd.line(PL([(536, 192), (540, 286)]), fill=(10, 10, 12, 255), width=int(7 * sx))
    if variant == "after":
        cd.polygon(PL([(410, 222), (452, 204), (470, 250), (404, 268)]),
                   fill=(220, 240, 255, 150))   # windshield reflection

    # ----- specular gloss highlights (after) -----
    if variant == "after":
        spec = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))
        sd = ImageDraw.Draw(spec, "RGBA")
        # broad soft top reflection on roof/hood
        sd.polygon(PL([(380, 232), (700, 208), (905, 300), (905, 318), (300, 312)]),
                   fill=(255, 255, 255, 60))
        # warm environment reflection band across doors (gold horizon)
        sd.polygon(PL([(150, 372), (905, 350), (905, 392), (120, 412)]),
                   fill=(235, 203, 122, 90))
        # crisp top edge highlight
        sd.line(PL([(372, 232), (690, 210)]), fill=(255, 255, 255, 150), width=int(4 * sx))
        spec = spec.filter(ImageFilter.GaussianBlur(int(5 * sx)))
        spec.putalpha(ImageChops.multiply(spec.split()[3], bmask))
        car = Image.alpha_composite(car, spec)
        cd = ImageDraw.Draw(car, "RGBA")
    else:
        # dust / grime overlay for before
        dust = Image.new("RGBA", (HW, HH), (0, 0, 0, 0))
        dd = ImageDraw.Draw(dust, "RGBA")
        random.seed(11)
        for _ in range(900):
            dx = random.uniform(90, 950) * sx
            dy = random.uniform(300, 450) * sy
            r = random.uniform(1, 4) * sx
            dd.ellipse([dx, dy, dx + r, dy + r], fill=(150, 138, 112, random.randint(40, 110)))
        # a couple of grime streaks
        for sxp in (300, 520, 720):
            dd.line([P(sxp, 320)[0], P(sxp, 320)[1], P(sxp - 18, 440)[0], P(sxp - 18, 440)[1]],
                    fill=(120, 110, 92, 70), width=int(10 * sx))
        dust.putalpha(ImageChops.multiply(dust.split()[3], bmask))
        car = Image.alpha_composite(car, dust)
        cd = ImageDraw.Draw(car, "RGBA")

    # headlight & taillight
    cd.polygon(PL([(905, 306), (948, 320), (950, 342), (905, 332)]),
               fill=(255, 246, 214, 235) if variant == "after" else (200, 196, 180, 200))
    cd.polygon(PL([(80, 360), (110, 352), (112, 384), (84, 392)]),
               fill=(220, 60, 50, 230) if variant == "after" else (150, 70, 66, 200))

    # ----- wheels with alloy spokes -----
    def wheel(cxw, cyw, r, variant):
        # tire
        cd.ellipse([P(cxw - r, cyw - r)[0], P(cxw - r, cyw - r)[1],
                    P(cxw + r, cyw + r)[0], P(cxw + r, cyw + r)[1]], fill=(12, 12, 14))
        # sidewall sheen
        cd.ellipse([P(cxw - r * .92, cyw - r * .92)[0], P(cxw - r * .92, cyw - r * .92)[1],
                    P(cxw + r * .92, cyw + r * .92)[0], P(cxw + r * .92, cyw + r * .92)[1]],
                   outline=(40, 40, 44), width=int(4 * sx))
        rr = r * 0.60
        rim_c = (208, 178, 116) if variant == "after" else (120, 120, 124)
        cd.ellipse([P(cxw - rr, cyw - rr)[0], P(cxw - rr, cyw - rr)[1],
                    P(cxw + rr, cyw + rr)[0], P(cxw + rr, cyw + rr)[1]],
                   fill=(60, 62, 68) if variant == "after" else (78, 78, 82))
        # spokes
        cxp, cyp = P(cxw, cyw)
        for i in range(10):
            a = i * (2 * math.pi / 10)
            x1 = cxp + (rr * 0.18 * sx) * math.cos(a)
            y1 = cyp + (rr * 0.18 * sy) * math.sin(a)
            x2 = cxp + (rr * 0.92 * sx) * math.cos(a)
            y2 = cyp + (rr * 0.92 * sy) * math.sin(a)
            cd.line([x1, y1, x2, y2], fill=rim_c, width=int(6 * sx))
        # hub
        hc = (235, 203, 122) if variant == "after" else (95, 95, 99)
        cd.ellipse([P(cxw - r * .14, cyw - r * .14)[0], P(cxw - r * .14, cyw - r * .14)[1],
                    P(cxw + r * .14, cyw + r * .14)[0], P(cxw + r * .14, cyw + r * .14)[1]], fill=hc)

    wheel(232, 452, 86, variant)
    wheel(806, 452, 86, variant)

    return car.resize((880, 560), Image.LANCZOS)

# =================================================================
#  LAYOUT
# =================================================================
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
midx = cx
draw.rounded_rectangle([pad, ptop, CW - pad, pbot], radius=s(20), fill=(0, 0, 0, 255))
draw.rounded_rectangle([pad, ptop, midx, pbot], radius=s(20), fill=(48, 49, 53, 255))
draw.rectangle([midx - s(20), ptop, midx, pbot], fill=(48, 49, 53, 255))
# right radial gold glow
for rr in range(s(380), 0, -s(8)):
    a = int(40 * (1 - rr / s(380)))
    gx, gy = midx + (CW - pad - midx) // 2, (ptop + pbot) // 2
    draw.ellipse([gx - rr, gy - rr * 0.7, gx + rr, gy + rr * 0.7], fill=(201, 162, 84, a))

# paste cars
car_before = render_car("before")
car_after = render_car("after")
cary = s(320)
img.paste(car_before, (int((pad + midx) / 2 - 440), cary), car_before)
img.paste(car_after, (int((midx + CW - pad) / 2 - 440), cary), car_after)
draw = ImageDraw.Draw(img, "RGBA")

# after sparkles (gloss accents)
acx = (midx + CW - pad) // 2
sparkle(draw, acx - s(80), cary // SS * 0 + s(360), s(20), GOLD_HI)
sparkle(draw, acx + s(120), s(400), s(14), WHITE)

# labels
def tag(xc, y, txt, bg, fg):
    f = font(22)
    b = draw.textbbox((0, 0), txt, font=f)
    tw = b[2] - b[0]
    pw, ph = tw + s(28), s(40)
    draw.rounded_rectangle([xc - pw / 2, y, xc + pw / 2, y + ph], radius=s(20), fill=bg)
    draw.text((xc - tw / 2, y + (ph - (b[3] - b[1])) / 2 - b[1]), txt, font=f, fill=fg)

tag((pad + midx) // 2, ptop + s(26), "BEFORE", (18, 18, 20, 240), GRAY)
tag(acx, ptop + s(26), "AFTER", GOLD, (20, 20, 20))

# center divider + arrow
draw.line([midx, ptop + s(8), midx, pbot - s(8)], fill=GOLD, width=s(4))
acr = s(46)
arry = (ptop + pbot) // 2
draw.ellipse([midx - acr, arry - acr, midx + acr, arry + acr], fill=GOLD)
draw.polygon([(midx - s(14), arry - s(18)), (midx + s(20), arry),
              (midx - s(14), arry + s(18))], fill=(20, 20, 20))

# ---------- OFFER BADGE ----------
bx, by, br = CW - pad - s(40), ptop + s(20), s(96)
burst = []
for i in range(32):
    ang = i * math.pi / 16
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
sy_ = s(928); gap = s(50)
startx = cx - (gap * 4) / 2
for i in range(5):
    star5(draw, startx + i * gap, sy_, s(20), GOLD_HI)
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
