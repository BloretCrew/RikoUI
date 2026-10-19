"""修复字体轮廓方向（用于 ZCOOL XiaoWei）。

问题：ZCOOL XiaoWei 的部分字形按「奇偶填充」设计，嵌套轮廓方向相同；浏览器按 TrueType 的非零环绕规则
填充时，"回""圄""林"等字的内部空洞会被填满成实心块。
修复：对每个字形计算各轮廓的嵌套深度（被几个其他轮廓完整包含），按深度奇偶交替设定方向
（偶数层为实体、顺时针；奇数层为空洞、逆时针）。只处理完整嵌套的轮廓，笔画交叠不受影响。

用法：python3 fix_contours.py <woff2 文件…>   （需要 pip install fonttools brotli）
"""
import sys
from fontTools.ttLib import TTFont


def area(pts):
    return sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts))) / 2


def inside(pt, poly):
    x, y = pt
    c = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


def fix_glyph(glyph, glyf):
    if glyph.isComposite() or glyph.numberOfContours < 2:
        return False
    coords, ends, flags = glyph.getCoordinates(glyf)
    contours, start = [], 0
    for e in ends:
        contours.append(list(range(start, e + 1)))
        start = e + 1
    polys = [[tuple(coords[i]) for i in c] for c in contours]
    changed = False
    new_order = []
    for k, poly in enumerate(polys):
        depth = 0
        for m, other in enumerate(polys):
            if m != k and len(other) > 2 and all(inside(p, other) for p in poly):
                depth += 1
        want_negative = depth % 2 == 0  # TrueType：外轮廓顺时针（面积为负）
        a = area(poly)
        idx = contours[k]
        if a != 0 and (a < 0) != want_negative:
            idx = list(reversed(idx))
            changed = True
        new_order.extend(idx)
    if changed:
        glyph.coordinates = type(coords)([coords[i] for i in new_order])
        glyph.flags = bytearray(flags[i] for i in new_order)
        glyph.program = glyph.program  # 保留指令
    return changed


def main(files):
    total = 0
    for f in files:
        font = TTFont(f)
        glyf = font['glyf']
        n = sum(fix_glyph(glyf[name], glyf) for name in font.getGlyphOrder() if name in glyf.glyphs)
        if n:
            font.flavor = 'woff2'
            font.save(f)
        total += n
    print(f'修复了 {total} 个字形的轮廓方向（{len(files)} 个文件）')


if __name__ == '__main__':
    main(sys.argv[1:])
