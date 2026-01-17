# PowerPointGen

Generate high-fidelity PowerPoint presentations from HTML slides using Puppeteer and pptxgenjs.

## How It Works

1. Write your slides as standalone HTML files with full CSS styling
2. Puppeteer renders each HTML file to a high-resolution PNG (1920x1080 @ 2x)
3. pptxgenjs assembles the images into a `.pptx` file

This approach gives you complete design freedom — any CSS that works in Chrome will render perfectly in your presentation.

## Installation

```bash
npm install
```

Requires Node.js 18+ and a Chromium-compatible environment for Puppeteer.

## Usage

### Generate a deck

```bash
npm run generate <deck-name>
```

### Run the demo

```bash
npm run demo
```

This generates a 10-slide demo presentation showcasing various slide layouts.

## Creating a Deck

1. Create a folder in `decks/` with your deck name
2. Add HTML slides in a `slides/` subfolder, numbered for ordering (e.g., `01-title.html`, `02-intro.html`)
3. Optionally add a `config.json` with metadata:

```json
{
  "title": "My Presentation",
  "author": "Your Name",
  "subject": "Presentation topic"
}
```

### Slide HTML Template

Each slide should be a complete HTML document sized to 1920x1080:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', sans-serif;
      /* Your styles here */
    }
  </style>
</head>
<body>
  <!-- Your slide content -->
</body>
</html>
```

## Project Structure

```
powerpoint-gen/
├── src/
│   ├── index.js        # CLI and orchestration
│   ├── renderer.js     # Puppeteer HTML-to-PNG rendering
│   └── pptxBuilder.js  # PPTX assembly with pptxgenjs
├── decks/
│   └── demo/           # Example deck
│       ├── config.json
│       ├── slides/     # HTML slide files
│       └── output/     # Generated PPTX and PNGs
└── package.json
```

## License

MIT
