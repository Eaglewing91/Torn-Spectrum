# Torn Spectrum

**Sensory-friendly colour layers for [Torn](https://www.torn.com), built with autism, ADHD and visual needs in mind.**

Torn's Dark Mode helps some players, but one dark theme doesn't suit everyone's eyes or brain. Torn Spectrum gives each player a set of optional, adjustable layers to mix until Torn feels comfortable to *them*: calm and low-stimulation themes, coloured reading overlays, colour-blind assist, a reading ruler, reduced motion and more readable text.

It is **visual only**: it needs no API key, makes no network requests and never clicks anything for you.

**[⬇️ Install Torn Spectrum](https://github.com/Eaglewing91/Torn-Spectrum/raw/main/Torn-Spectrum.user.js)**

---

## Why this exists

Torn is a busy, text-heavy game: bright status colours, dense tables, timers, animated banners and lots of red/green "good/bad" signals. For many players that's just part of the game. For others it's genuinely hard work.

Sensory needs vary a lot from person to person, so instead of a single theme Torn Spectrum lets each player choose what works for them. Everything is switched off by default. Nobody should have to struggle with how the game looks in order to enjoy playing it.

## Features

| Feature | What it does |
|---|---|
| **Colour layers** | Calm, Low stimulation, Paper (sepia), Night warm, Greyscale, High contrast |
| **Colour-blind assist** | Protan (red-weak), Deutan (green-weak) and Tritan (blue-yellow) correction filters |
| **Coloured overlays** | Reading-overlay tints in blue, aqua, green, yellow, peach, rose, lilac and grey, plus a Dark overlay that dims the whole screen, with adjustable strength; automatically matches Torn's light or dark mode |
| **Fine-tune** | Brightness, contrast and colour sliders on top of any layer |
| **Reading ruler** | Dims the screen except a band that follows your mouse or finger |
| **Reduce motion** | Stops animations and transitions |
| **Pause animated images** | Freezes animated profile pictures, signatures and honor bars, on profile pages or everywhere on Torn. Tap a paused image to play it |
| **Readable font** | Atkinson Hyperlegible, Lexend or OpenDyslexic if installed on your device, otherwise Verdana |
| **Extra text spacing** | Wider letter and word spacing |
| **Underline links** | So links don't rely on colour alone |
| **Strong focus outline** | Bright outline for keyboard navigation |

Layers work alongside Torn's own Dark Mode, so you can use either Torn theme underneath.

## Who it may help

Everyone is different, so these are features worth trying, not guaranteed fixes. Torn Spectrum is not a medical tool and does not treat any condition.

**Neurodivergence**
- May help players with **autism or sensory processing differences**: Calm, Low stimulation, Greyscale, Reduce motion, Pause animated images, coloured overlays.
- May help players with **ADHD**: Reading ruler, Reduce motion, Pause animated images, Low stimulation, Greyscale.
- May help players with **sensory processing disorder (SPD)**: Low stimulation, Reduce motion, Night warm.
- May help players with **dyspraxia (DCD)**: Reading ruler, extra text spacing, strong focus outline.

**Reading and visual processing**
- May help players with **dyslexia**: coloured overlays, readable font, extra text spacing, Paper, reading ruler.
- May help players with **visual stress (Meares-Irlen syndrome)**: coloured overlays, Paper, Calm, lower contrast.
- May help players with **visual processing disorder**: reading ruler, extra spacing, High contrast or Low stimulation.

**Light sensitivity and headaches**
- May help players with **migraine**, especially light-triggered: Night warm, Low stimulation, lower brightness, Reduce motion.
- May help players with **photophobia (light sensitivity)**: Night warm, lower brightness and contrast, grey or peach overlays.
- May help players with **post-concussion syndrome**: Low stimulation, Reduce motion, Night warm.
- May help players with **eye strain** from long sessions: Night warm, Paper, Calm.
- May help players with **photosensitive epilepsy**: Reduce motion and Pause animated images cut animated movement, but they **cannot guarantee** protection from flashing content.

**Vision**
- May help players with **low vision**: High contrast, brightness/contrast sliders, strong focus outline, underline links.
- May help players with **protanopia / protanomaly**: Protan assist, underline links.
- May help players with **deuteranopia / deuteranomaly**: Deutan assist, underline links.
- May help players with **tritanopia / tritanomaly**: Tritan assist.
- May help players with **cataracts or glare sensitivity**: lower brightness, Night warm, High contrast.
- May help players with **nystagmus**: reading ruler, extra spacing, Reduce motion.
- May help players with **age-related vision changes**: High contrast, readable font, extra spacing, underline links.

**Other**
- May help players with **anxiety or sensory overload**: Calm, Low stimulation, Reduce motion.
- May help players with **vestibular disorders or motion sensitivity**: Reduce motion, Pause animated images.
- May help players with **chronic fatigue (ME/CFS) or long COVID**: Low stimulation, Night warm.

## Installation

### Desktop (Tampermonkey / Violentmonkey)
1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) for your browser.
2. Click **[Install Torn Spectrum](https://github.com/Eaglewing91/Torn-Spectrum/raw/main/Torn-Spectrum.user.js)** and confirm.
3. Updates are picked up automatically from this repository.

### Mobile (Torn PDA, Android & iOS)
1. Open the [script file](https://github.com/Eaglewing91/Torn-Spectrum/blob/main/Torn-Spectrum.user.js) and copy its full contents.
2. In Torn PDA's userscripts settings, add a new script and paste the code in.
3. Save, then reload Torn.

## How to use

- Open your **avatar menu** (top right) and tap **Torn Spectrum**, just under Dark Mode.
- **Torn PDA:** tap the round **palette button** at the bottom left of the screen. (It also appears on phone browsers where the avatar-menu entry isn't available.) You can move it to the right in the panel.
- Pick a colour layer, add an overlay if you like, and switch on any reading or focus options.
- The switch at the top of the panel turns every layer on or off at once.
- Keyboard shortcuts: **Alt+Shift+C** opens the panel, **Alt+Shift+X** turns layers on/off.
- Settings are saved in your browser and shared across your open Torn tabs.

## Torn scripting rules

Torn Spectrum follows Torn's scripting rules. It:

- only changes how the page you are currently viewing **looks** (CSS and visual overlays);
- makes **no requests** of any kind: no Torn page requests, no API calls, no external sites, no websockets;
- never clicks, submits or triggers anything on the page;
- pauses animated images by copying a still frame from images the page has **already loaded**, so it never downloads anything;
- adds a "Torn Spectrum" row to the avatar menu, and a floating button in Torn PDA, that only open the script's own panel.

## Terms of Service

| | |
|---|---|
| **Data Storage** | Only locally (your visual settings, in your browser's localStorage) |
| **Data Sharing** | Nobody |
| **Purpose of Use** | Other: accessibility and visual comfort |
| **Key Storage & Sharing** | Not stored / Not shared (no API key is used) |
| **Key Access Level** | None required: no API key needed |

## Known limitations

- Filter layers apply to the whole page, so very large pages may scroll slightly less smoothly on older devices.
- Greyscale removes Torn's red/green status colours.
- The colour-blind assist filters can be less reliable in some iOS WebViews.
- Torn may change its menu layout in future; if the menu row disappears, use Alt+Shift+C or the Tampermonkey menu and please [open an issue](https://github.com/Eaglewing91/Torn-Spectrum/issues).

## Feedback

Suggestions are very welcome, especially from players who use it day to day. Open an [issue](https://github.com/Eaglewing91/Torn-Spectrum/issues) or message [Eaglewing [571041]](https://www.torn.com/profiles.php?XID=571041) in game.

Torn staff are welcome to contact me with any concerns about this script.

## License

[MIT](LICENSE) © 2026 Eaglewing [571041]

*Torn Spectrum is a fan-made script and is not affiliated with or endorsed by Torn.*
