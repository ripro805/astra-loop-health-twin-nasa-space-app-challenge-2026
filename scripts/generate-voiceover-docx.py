import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Page Margins: 0.75 in
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Styles
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("ASTRA-LOOP: Official 30-Second Final Submission Voiceover")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(11, 79, 138) # Deep Space Blue

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(16)
    run_sub = sub_p.add_run("NASA Space Apps Challenge 2026 | Team: ARTHERCORE | Video: 1112.mp4 (00:00 – 00:29)")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = RGBColor(100, 116, 139)

    # Section 1: Clean Script Box
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(10)
    h1.paragraph_format.space_after = Pt(6)
    r_h1 = h1.add_run("🎙️ Master Voiceover Script (Clean Copy-Paste Version)")
    r_h1.font.name = "Calibri"
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True
    r_h1.font.color.rgb = RGBColor(15, 23, 42)

    script_table = doc.add_table(rows=1, cols=1)
    script_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    script_cell = script_table.rows[0].cells[0]
    script_cell.width = Inches(7.0)
    set_cell_background(script_cell, "F1F5F9")
    set_cell_margins(script_cell, top=200, bottom=200, left=240, right=240)

    script_lines = [
        "In deep space, Earth is out of reach. When medical emergencies strike, who protects the crew?",
        "",
        "Meet ASTRA-LOOP: an autonomous, closed-loop health digital twin grounded in real NASA standards.",
        "",
        "It senses vitals offline, predicts hidden risks, and guides non-physician astronauts through life-saving clinical treatments.",
        "",
        "From solar radiation storms to planetary landings, keeping humanity safe all the way to Mars.",
        "",
        "We are Team Arthercore. Pioneering autonomous medicine for deep space."
    ]

    p_box = script_cell.paragraphs[0]
    p_box.paragraph_format.space_after = Pt(0)
    p_box.paragraph_format.line_spacing = 1.25

    for line in script_lines:
        if line == "":
            p_box.add_run("\n\n")
        else:
            r = p_box.add_run(line)
            r.font.name = "Calibri"
            r.font.size = Pt(11.5)
            r.font.color.rgb = RGBColor(15, 23, 42)
            if "ASTRA-LOOP" in line or "Team Arthercore" in line:
                r.font.bold = True

    stats_p = doc.add_paragraph()
    stats_p.paragraph_format.space_before = Pt(6)
    stats_p.paragraph_format.space_after = Pt(16)
    r_stats = stats_p.add_run("📊 Word Count: 71 words | Target Pace: ~140 words/min | Estimated Duration: 28.5 – 30.0 seconds")
    r_stats.font.name = "Calibri"
    r_stats.font.size = Pt(9.5)
    r_stats.font.italic = True
    r_stats.font.color.rgb = RGBColor(71, 85, 105)

    # Section 2: Timestamp Breakdown Table
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(8)
    r_h2 = h2.add_run("⏱️ Frame-by-Frame Video Alignment & Delivery Guide")
    r_h2.font.name = "Calibri"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True
    r_h2.font.color.rgb = RGBColor(15, 23, 42)

    table_data = [
        ("Timestamp", "Visual on Screen", "Voiceover Dialogue", "Delivery Tone & Notes"),
        ("00:00 – 00:06", "Spacecraft window overlooking Earth → Astronaut with holographic vital HUD → Glowing ASTRA-LOOP logo reveal.", '"In deep space, Earth is out of reach. When medical emergencies strike... who protects the crew?"', "Cinematic, deep, gripping. Build suspense as the logo flashes."),
        ("00:07 – 00:12", "Landing page architecture → Mission Day 61 Dashboard → Interactive 9-Organ Vector Human Body with Hazard Lens.", '"Meet ASTRA-LOOP: an autonomous, closed-loop health digital twin grounded in real NASA standards."', "Confident, visionary, authoritative. Clear pause after 'ASTRA-LOOP'."),
        ("00:13 – 00:18", "Clinical Guidance decision tree → Daily routine checklist & ultrasound scanner → Gamification XP & badges.", '"It senses vitals offline, predicts hidden risks, and guides non-physician astronauts through life-saving clinical treatments."', "Dynamic, crisp, solution-focused. Emphasize 'offline' and 'life-saving'."),
        ("00:19 – 00:23", "72-Hour Radiation Watch (Storm shelter water bay engaged) → Flight Surgeon clinical report dossier.", '"From solar radiation storms to planetary landings... keeping humanity safe all the way to Mars."', "Inspiring, impactful, heroic. Highlight 'all the way to Mars'."),
        ("00:24 – 00:29", "Team ARTHERCORE slide (Rizvi, SAFI, ASZAD, Nahid) → Starfield Thank You! outro.", '"We are Team Arthercore. Pioneering autonomous medicine for deep space."', "Proud, clear, memorable team sign-off. Smooth fade-out.")
    ]

    table = doc.add_table(rows=len(table_data), cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(1.1), Inches(2.1), Inches(2.5), Inches(1.3)]

    for row_idx, row in enumerate(table.rows):
        is_header = (row_idx == 0)
        for col_idx, cell in enumerate(row.cells):
            cell.width = col_widths[col_idx]
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
            text = table_data[row_idx][col_idx]
            cell.text = text
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(0)
            
            if is_header:
                set_cell_background(cell, "0F172A")
                for r in p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(10)
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(255, 255, 255)
            else:
                bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                for r in p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(9.5)
                    r.font.color.rgb = RGBColor(30, 41, 59)
                    if col_idx == 0:
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(11, 79, 138)
                    elif col_idx == 2:
                        r.font.italic = True

    # Section 3: Bengali Translation & Subtitles
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(18)
    h3.paragraph_format.space_after = Pt(6)
    r_h3 = h3.add_run("🇧🇩 বাংলা সাবটাইটেল ও অনুবাদ (Bengali Subtitle & Reference)")
    r_h3.font.name = "Calibri"
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True
    r_h3.font.color.rgb = RGBColor(15, 23, 42)

    bn_lines = [
        ("00:00 – 00:06", "দূর মহাকাশে পৃথিবী নাগালের বাইরে। চিকিৎসা সংকটের মুহূর্তে কে রক্ষা করবে ক্রুদের?"),
        ("00:07 – 00:12", "উপস্থাপন করছি ASTRA-LOOP: নাসার প্রমাণ্য স্ট্যান্ডার্ডে নির্মিত একটি স্বয়ংক্রিয় ক্লোজড-লুপ ডিজিটাল টুইন।"),
        ("00:13 – 00:18", "ইন্টারনেট ছাড়াই এটি ভাইটালস ট্র্যাক করে, অদৃশ্য ঝুঁকি পূর্বাভাস দেয় এবং ক্রুদের সঠিক চিকিৎসার নির্দেশ বাতলে দেয়।"),
        ("00:19 – 00:23", "সৌর বিকিরণ ঝড় থেকে শুরু করে গ্রহ অবতরণ—মঙ্গল অভিযানের প্রতিটি মুহূর্তে মহাকাশচারীদের জীবন সুরক্ষায়।"),
        ("00:24 – 00:29", "আমরা টিম Arthercore। দূর মহাকাশের স্বয়ংক্রিয় চিকিৎসায় এক নতুন দিগন্ত।")
    ]

    for time_tag, bn_text in bn_lines:
        p_bn = doc.add_paragraph()
        p_bn.paragraph_format.space_after = Pt(4)
        r_tag = p_bn.add_run(f"[{time_tag}] ")
        r_tag.font.name = "Calibri"
        r_tag.font.size = Pt(10)
        r_tag.font.bold = True
        r_tag.font.color.rgb = RGBColor(11, 79, 138)

        r_text = p_bn.add_run(bn_text)
        r_text.font.name = "Calibri"
        r_text.font.size = Pt(10)
        r_text.font.color.rgb = RGBColor(51, 65, 85)

    # Section 4: Sound Design Tips
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(6)
    r_h4 = h4.add_run("💡 সাউন্ড ডিজাইন ও অডিও মিক্সিং পরামর্শ (Audio Mixing Tips)")
    r_h4.font.name = "Calibri"
    r_h4.font.size = Pt(12)
    r_h4.font.bold = True
    r_h4.font.color.rgb = RGBColor(15, 23, 42)

    tips = [
        "ভয়েস ক্ল্যারিটি: ব্যাকগ্রাউন্ড মিউজিকের ভলিউম কিছুটা কমিয়ে ভয়েসকে প্রধান রাখুন (+3dB to +4dB above BGM)।",
        "ব্যাকগ্রাউন্ড মিউজিক (BGM): শুরুতে ডিপ স্পেস অ্যাম্বিয়েন্স, 00:06-এ লোগো ফ্ল্যাশের সাথে একটি সিন্থ-রাইজ (Riser / Whoosh) এবং তারপর ইনস্পায়ারিং টেকনো-অর্কেস্ট্রাল বিট।",
        "ডেলিভারি টোন: হলিউড ট্রেলার স্টাইল—শান্ত, গম্ভীর, তবে অত্যন্ত আত্মবিশ্বাসী ও স্পষ্ট।"
    ]

    for tip in tips:
        p_tip = doc.add_paragraph(style='List Bullet')
        p_tip.paragraph_format.space_after = Pt(3)
        r_tip = p_tip.add_run(tip)
        r_tip.font.name = "Calibri"
        r_tip.font.size = Pt(9.5)
        r_tip.font.color.rgb = RGBColor(71, 85, 105)

    out_path = os.path.join(os.path.dirname(__file__), '..', 'docs', '30_SECOND_VOICEOVER_SCRIPT.docx')
    doc.save(out_path)
    print("Document successfully created at:", out_path)

if __name__ == '__main__':
    create_document()
