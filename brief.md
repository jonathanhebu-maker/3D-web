# BRIEF — VENA TECH
Path: C   Stack: static `index.html` + `style.css` + `main.js`, three.js (import map), GSAP 3.13 + ScrollTrigger + Lenis 1.3 from CDN   Language of copy: Hebrew (RTL)

## Concept
Pitch: סוכנות אוטומציות AI ישראלית — ליבת בינה אחת שמחברת את כל מערכות העסק ועובדת בשבילו 24/7.
Signature mechanic: **3D automation grid** (three.js) — ליבת AI זוהרת במרכז, צמתים של מערכות (וואטסאפ, CRM, יומן, אימייל…) מחוברים אליה במסלולי מעגלים; פולסים של דאטה זורמים אל הליבה; פרלקסת סמן; גלילה דוחפת את המצלמה פנימה ומעצימה את הליבה.
First 3 seconds: מסך כהה → הליבה "נדלקת" (boot), פולסים מתחילים לזרום, שורות הכותרת עולות במסכות, התוויות של הצמתים נרשמות סביב הסצנה.
Secondary: split-text reveals על כותרות בלבד.

## Art direction
Background: DARK   Density: MEDIUM-HIGH   Header: transparent → glass on scroll
Palette: #030511 bg, #070C1F surface, #EDF1FF text, #4D7CFE accent-blue, #3BE0F8 cyan, #8A63FF violet, #94A0C6 secondary text
Design system: own; UI surface: glass (over the 3D/gradients only), per 01-rules §2b numbers
Display font: Heebo 900, clamp(2.75rem, 7.5vw, 6rem), line-height 1.04, tracking -0.01em
Body font: Heebo 400/500, 17px, line-height 1.65
Texture/visual language (max 3): circuit paths with traveling light pulses, glass panels over glow, fine particle field
Motion: expo.out reveals (0.9–1.2s, stagger 0.06), scrub on hero camera + section connective line; transform/opacity only

## References → 3 signature moves
1. ליבת AI מרכזית שכרטיסי מערכות מתחברים אליה במסלולים זוהרים (from Video_Project_4 — Vena Tech hero mockup)
2. תוויות אנוטציה דקות סביב האובייקט התלת־ממדי, קווי חיבור עדינים (from Nexora brain video)
3. גריד כרטיסי זכוכית כהים עם מדדים והדגשת צבע אחת (from Nexora dashboard image)

## Sections
1. Hero — קנבס 3D (הליבה + צמתים + פולסים + תוויות DOM מוקרנות), H1 "העסק שלך על טייס אוטומטי", CTA "קבעו שיחת אסטרטגיה" + "איך זה עובד"
2. הבעיה — "העבודה הידנית אוכלת לכם את היום": 3 כאבים
3. איך זה עובד — 3 שלבים עם קו SVG שמצייר את עצמו בגלילה
4. פתרונות — 4 כרטיסי זכוכית: לידים ומכירות / שירות לקוחות / תיאום ויומן / תפעול ודוחות
5. הדגמה — לופ צ'אט וואטסאפ מתוסרט (מסומן כסימולציה)
6. המנוע — תמונת הצ'יפ של Vena Tech (img-chip) + הסבר תהליך/אמינות
7. אינטגרציות — גריד אריחי מערכות אמיתיות
8. FAQ — אקורדיון + schema
9. CTA סופי — טופס קצר (שם/טלפון/הודעה) שנפתח לוואטסאפ; בלי backend מזויף

## Visual world
Register: dark tech product render — deep navy void, electric blue/cyan rim light, violet secondary glow, physical glass and emissive circuitry; capture feel: slow push-in, 35mm, shallow ambient particles; grade: cold blacks, no purple blob wash; never: gradient-blob hero, emoji icons, fake client logos/testimonials.

## Assets
Hero-critical (P4): built in code (three.js geometry — no model download needed)
In repo: assets/images/vena-chip.webp (user-supplied brand render), assets/og-image.jpg
Placeholders for P7: none required — remaining media generated in code

## Allowed exceptions
- Boot/power-on intro (tech/AI niche): short core "ignition", 1.6s, skippable — not a percentage counter.
- Integrations grid of named tools — content, not decorative chip row.

## Log
2026-11-02 — Initial build from user assets (Vena Tech hero mockup video, chip render, Nexora refs). Autonomous session: ambiguity between Nexora/Vena Tech resolved to VENA TECH (Hebrew assets + chip branding). Contact details (phone/WhatsApp/email/domain) are placeholders marked TODO.
