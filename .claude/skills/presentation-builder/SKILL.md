---
name: presentation-builder
description: Creates professional PowerPoint presentations from content using HTML/CSS slides. Can also read and analyze existing PPTX files. Use when the user asks to create slides, build a presentation, generate a deck, make a PowerPoint, convert content to slides, read a pptx, or analyze an existing presentation.
allowed-tools: Read, Write, Bash(npm run:*), Bash(npm install:*), Glob, Grep, AskUserQuestion
---

# Presentation Builder Skill

Build high-fidelity PowerPoint presentations using HTML/CSS slides rendered to images. Can also read and analyze existing PPTX files.

---

## Reading Existing PPTX Files

To analyze or use an existing presentation as reference:

```bash
npm run read-pptx <file.pptx> [options]
```

**Options:**
- `--no-images` - Skip rendering slides as images (faster)
- `--output-dir <dir>` - Where to save slide images
- `--json` - Output as JSON instead of markdown

**What it extracts:**
- Slide text content and structure
- Metadata (title, author, created date)
- Slide images (rendered via LibreOffice)

**Use cases:**
1. **Analyze structure** - Understand how an existing deck is organized
2. **Extract content** - Pull text to repurpose in a new presentation
3. **Style reference** - View slide images to match visual style
4. **Update existing** - Read old deck, create improved version

**Example workflow - updating an existing presentation:**
```bash
# 1. Read the existing presentation
npm run read-pptx old-deck.pptx --output-dir decks/updated/reference

# 2. The slide images are now in decks/updated/reference/
# 3. Use them as visual reference when creating new slides
```

You can also add .pptx files directly to a deck's `context/` folder. The skill will read them during planning.

## Workflow: Two-Phase Approach

### Phase 1: Preparation (BEFORE plan mode)

When a user asks to create a presentation:

1. **Determine the deck name** from the topic (kebab-case, e.g., "q4-results", "product-launch")

2. **Create the folder structure:**
   ```bash
   mkdir -p decks/<deck-name>/slides decks/<deck-name>/context
   ```

3. **Ask if user has context documents** using AskUserQuestion:
   ```
   I've created a context folder for your presentation at:
   decks/<deck-name>/context/

   You can add any reference materials here (briefs, data, notes, etc.)
   and I'll incorporate them into the presentation.

   Do you want to add context documents before I plan the slides?
   - "Yes, let me add some files" → Wait for user, then proceed
   - "No, let's continue" → Proceed to plan mode
   ```

4. **If user adds documents**, read them all before planning.

### Phase 2: Planning (IN plan mode)

5. **Enter plan mode** with EnterPlanMode tool

6. **Read any context documents:**
   ```bash
   ls decks/<deck-name>/context/
   ```
   Read each file found and incorporate into your plan.

7. **Create a detailed slide outline** (see Example Plan Format below)

8. **Exit plan mode** for user approval via ExitPlanMode

### Phase 3: Building (AFTER approval)

9. **Create HTML slides** following the approved plan

10. **Generate any AI images** needed

11. **Run the generator:**
    ```bash
    npm run generate <deck-name>
    ```

12. **Deliver the output** path to the user

---

## Project Structure

```
decks/
  <deck-name>/
    config.json        # Title, author metadata
    context/           # Reference documents (created in Phase 1)
      brief.md         # Project brief, requirements
      data.csv         # Data to visualize
      notes.txt        # Additional context
      *.pdf, *.md, etc # Any reference materials
    slides/
      01-title.html    # Slides numbered for ordering
      02-agenda.html
      ...
    output/            # Generated PNGs and .pptx
```

## Context Documents

Supported context types:
- **Markdown files** (.md) - Briefs, outlines, content drafts
- **Text files** (.txt) - Notes, transcripts, raw content
- **CSV/JSON** (.csv, .json) - Data for charts and statistics
- **PDFs** (.pdf) - Reference documents, reports
- **PowerPoint files** (.pptx) - Existing presentations to reference or update

When context exists, incorporate it into your plan:
- Extract key messages and themes
- Pull specific data points for stats slides
- Follow any structural requirements in briefs
- Match the tone/style specified in notes

---

## How This Project Works

1. **HTML Slides** → Each slide is a standalone HTML file with embedded CSS (1920x1080)
2. **Puppeteer** → Renders HTML to high-res PNG images (2x for crisp display)
3. **PptxGenJS** → Packages images into a .pptx file
4. **Nano Banana Pro** → Optional AI image generation for diagrams/illustrations

## Creating HTML Slides

Each slide is a complete HTML document. See [TEMPLATES.md](TEMPLATES.md) for all slide types.

**Critical slide requirements:**
- Fixed dimensions: `width: 1920px; height: 1080px` on body
- Use Google Fonts via `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap')`
- Self-contained: all styles inline in `<style>` tag
- No external assets unless absolutely necessary

## Generating AI Images

For diagrams, illustrations, or graphics:

```bash
npm run generate-image "description of image" decks/<deck-name>/slides/assets/image.png
```

Then reference in HTML:
```html
<img src="assets/image.png" style="..." />
```

**Image prompt guidelines:**
- Be specific and descriptive
- Specify style: isometric, flat, photorealistic, etc.
- Text is minimized by default; specify if you need labels

---

## Design Principles

1. **Consistent styling** - Use the same color palette, fonts, spacing across all slides
2. **Visual hierarchy** - Clear section labels, prominent headings, readable body text
3. **Minimal text** - Let visuals communicate; slides are visual aids, not documents
4. **High contrast** - Ensure readability in various lighting conditions

## Common Color Palettes

**Dark Professional:**
- Background: `#1a1a2e`, `#16213e`, `#0f3460`
- Accent: `#e94560`
- Text: `#ffffff`, `rgba(255,255,255,0.7)`

**Light Clean:**
- Background: `#ffffff`, `#f8f9fa`
- Accent: `#667eea`, `#764ba2`
- Text: `#1a1a2e`, `#666666`

**Gradient:**
- `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`

---

## Example Plan Format

When in plan mode, structure your plan like this:

```markdown
# Presentation Plan: [Title]

## Overview
- Topic: [main subject]
- Audience: [who is this for]
- Tone: [professional/casual/technical]
- Slide count: [number]

## Context Documents Reviewed
- [list any documents read from context/ folder, or "None provided"]

## Slide Outline

### Slide 1: Title
- Template: Title slide (dark)
- Headline: "..."
- Subtitle: "..."

### Slide 2: Agenda
- Template: Agenda list
- Items: [list 3-5 agenda items]

### Slide 3: [Topic]
- Template: Stats grid / Two-column / etc.
- Key points: [bullet points]
- Visual: [description of any needed imagery]

[continue for all slides...]

## AI Images Needed
- [ ] Slide 5: "isometric illustration of..."
- [ ] Slide 8: "abstract background showing..."

## Color Palette
- Primary: #...
- Accent: #...
- Background: #...
```

---

## Quick Reference: Available Templates

From [TEMPLATES.md](TEMPLATES.md):
- **Title Slide** - Full-screen title with gradient background
- **Agenda/List** - Numbered list with sidebar accent
- **Stats Grid** - Four key metrics with colored values
- **Two-Column Split** - Left text, right content cards
- **Quote Slide** - Large quote with attribution
- **Comparison (VS)** - Side-by-side with checkmarks
- **Feature Grid** - 2x3 grid of feature cards
- **Timeline/Roadmap** - Horizontal timeline with phases
- **Closing** - Thank you with CTA

## For detailed HTML templates, see [TEMPLATES.md](TEMPLATES.md)
