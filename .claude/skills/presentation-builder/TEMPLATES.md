# Slide Templates

Copy and adapt these templates for new slides. All use 1920x1080 dimensions.

**Note:** Font sizes and icons are optimized for PowerPoint display (50% larger than typical web).

## Base Template (Start Here)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <!-- Content here -->
</body>
</html>
```

---

## Title Slide (Dark)

Full-screen title with gradient background and decorative elements.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .container {
      text-align: center;
      color: white;
      padding: 80px;
    }

    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 18px 36px;
      border-radius: 50px;
      font-size: 27px;
      font-weight: 500;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 48px;
      color: #e94560;
    }

    h1 {
      font-size: 144px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 40px;
      background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 48px;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.7);
      max-width: 1200px;
      margin: 0 auto;
      line-height: 1.5;
    }

    .decoration {
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, transparent 70%);
      top: -200px;
      right: -200px;
    }
  </style>
</head>
<body>
  <div class="decoration"></div>
  <div class="container">
    <div class="badge">Introducing</div>
    <h1>Main Title Here</h1>
    <p class="subtitle">Subtitle or tagline goes here</p>
  </div>
</body>
</html>
```

---

## Agenda / List Slide

Numbered list with sidebar accent.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
      display: flex;
      overflow: hidden;
    }

    .sidebar {
      width: 100px;
      background: linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%);
    }

    .content {
      flex: 1;
      padding: 80px 100px;
    }

    .section-label {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #e94560;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 96px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 60px;
    }

    .agenda-list {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    .agenda-item {
      display: flex;
      align-items: center;
      gap: 48px;
      padding: 40px 48px;
      background: #f8f9fa;
      border-radius: 20px;
      border-left: 8px solid #e94560;
    }

    .agenda-number {
      font-size: 72px;
      font-weight: 800;
      color: #e94560;
      min-width: 100px;
    }

    .agenda-text h3 {
      font-size: 42px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .agenda-text p {
      font-size: 27px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="sidebar"></div>
  <div class="content">
    <div class="section-label">Overview</div>
    <h1>Agenda</h1>
    <div class="agenda-list">
      <div class="agenda-item">
        <div class="agenda-number">01</div>
        <div class="agenda-text">
          <h3>First Topic</h3>
          <p>Brief description</p>
        </div>
      </div>
      <div class="agenda-item">
        <div class="agenda-number">02</div>
        <div class="agenda-text">
          <h3>Second Topic</h3>
          <p>Brief description</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## Stats / Metrics Grid

Four key numbers with gradient background.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 80px 100px;
      overflow: hidden;
    }

    .section-label {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 20px;
    }

    h1 {
      font-size: 84px;
      font-weight: 700;
      color: white;
      margin-bottom: 80px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 28px;
      padding: 56px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-value {
      font-size: 120px;
      font-weight: 800;
      color: white;
      line-height: 1;
      margin-bottom: 20px;
    }

    .stat-label {
      font-size: 33px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }

    .stat-card:nth-child(1) .stat-value { color: #ffd93d; }
    .stat-card:nth-child(2) .stat-value { color: #6bcb77; }
    .stat-card:nth-child(3) .stat-value { color: #4d96ff; }
    .stat-card:nth-child(4) .stat-value { color: #ff6b6b; }
  </style>
</head>
<body>
  <div class="section-label">By The Numbers</div>
  <h1>Key Metrics</h1>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">10x</div>
      <div class="stat-label">First metric description</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">100%</div>
      <div class="stat-label">Second metric description</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">50K</div>
      <div class="stat-label">Third metric description</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">24/7</div>
      <div class="stat-label">Fourth metric description</div>
    </div>
  </div>
</body>
</html>
```

---

## Two-Column Split

Left text, right content (pain points, features, etc.)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0f0f0f;
      display: grid;
      grid-template-columns: 1fr 1fr;
      overflow: hidden;
    }

    .left {
      padding: 100px 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .section-label {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #e94560;
      margin-bottom: 28px;
    }

    h1 {
      font-size: 84px;
      font-weight: 700;
      color: white;
      line-height: 1.2;
      margin-bottom: 36px;
    }

    .description {
      font-size: 33px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
    }

    .right {
      background: #1a1a1a;
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 28px;
    }

    .item {
      display: flex;
      align-items: flex-start;
      gap: 28px;
      padding: 36px 40px;
      background: rgba(233, 69, 96, 0.1);
      border-radius: 20px;
      border: 1px solid rgba(233, 69, 96, 0.3);
    }

    .item-icon {
      width: 72px;
      height: 72px;
      background: #e94560;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: white;
      flex-shrink: 0;
    }

    .item-text h3 {
      font-size: 33px;
      font-weight: 600;
      color: white;
      margin-bottom: 10px;
    }

    .item-text p {
      font-size: 24px;
      color: rgba(255, 255, 255, 0.5);
    }
  </style>
</head>
<body>
  <div class="left">
    <div class="section-label">Section Label</div>
    <h1>Main Heading Goes Here</h1>
    <p class="description">Supporting description text that provides context.</p>
  </div>
  <div class="right">
    <div class="item">
      <div class="item-icon">1</div>
      <div class="item-text">
        <h3>First Point</h3>
        <p>Description of this point</p>
      </div>
    </div>
    <div class="item">
      <div class="item-icon">2</div>
      <div class="item-text">
        <h3>Second Point</h3>
        <p>Description of this point</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## Quote Slide

Large quote with attribution.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #fafafa;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .quote-mark {
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-size: 900px;
      color: rgba(233, 69, 96, 0.08);
      top: -150px;
      left: 60px;
      line-height: 1;
    }

    .container {
      max-width: 1500px;
      text-align: center;
      padding: 80px;
      position: relative;
      z-index: 1;
    }

    blockquote {
      font-family: 'Playfair Display', serif;
      font-size: 96px;
      font-weight: 700;
      font-style: italic;
      color: #1a1a2e;
      line-height: 1.4;
      margin-bottom: 72px;
    }

    .attribution {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
    }

    .avatar {
      width: 108px;
      height: 108px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      font-weight: 700;
      color: white;
    }

    .author-info { text-align: left; }
    .author-name { font-size: 36px; font-weight: 600; color: #1a1a2e; }
    .author-title { font-size: 27px; color: #666; }
  </style>
</head>
<body>
  <div class="quote-mark">"</div>
  <div class="container">
    <blockquote>"Your quote text goes here."</blockquote>
    <div class="attribution">
      <div class="avatar">AB</div>
      <div class="author-info">
        <div class="author-name">Author Name</div>
        <div class="author-title">Title or Role</div>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## Comparison (VS) Slide

Side-by-side comparison with checkmarks/X marks.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: white;
      padding: 80px 100px;
      overflow: hidden;
    }

    .section-label {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #667eea;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 84px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 60px;
    }

    .comparison {
      display: grid;
      grid-template-columns: 1fr 120px 1fr;
      gap: 48px;
    }

    .column h2 {
      font-size: 42px;
      font-weight: 600;
      margin-bottom: 36px;
      padding-bottom: 20px;
      border-bottom: 4px solid;
    }

    .old h2 { color: #999; border-color: #ddd; }
    .new h2 { color: #667eea; border-color: #667eea; }

    .feature-list { display: flex; flex-direction: column; gap: 24px; }

    .feature {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      font-size: 30px;
    }

    .old .feature { color: #666; }
    .new .feature { color: #333; }

    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .old .icon { background: #f5f5f5; color: #999; }
    .new .icon { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }

    .vs {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 120px;
    }

    .vs-badge {
      width: 120px;
      height: 120px;
      background: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="section-label">Comparison</div>
  <h1>Old Way vs New Way</h1>
  <div class="comparison">
    <div class="column old">
      <h2>Before</h2>
      <div class="feature-list">
        <div class="feature"><div class="icon">X</div><span>Old approach item</span></div>
        <div class="feature"><div class="icon">X</div><span>Another old item</span></div>
      </div>
    </div>
    <div class="vs"><div class="vs-badge">VS</div></div>
    <div class="column new">
      <h2>After</h2>
      <div class="feature-list">
        <div class="feature"><div class="icon">+</div><span>New approach item</span></div>
        <div class="feature"><div class="icon">+</div><span>Another new item</span></div>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## Feature Grid (2x3)

Six features in a grid layout.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 80px 100px;
      overflow: hidden;
    }

    .header { text-align: center; margin-bottom: 60px; }

    .section-label {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #667eea;
      margin-bottom: 20px;
    }

    h1 { font-size: 84px; font-weight: 700; color: #1a1a2e; }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 36px;
    }

    .card {
      background: white;
      border-radius: 28px;
      padding: 48px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    }

    .card-icon {
      width: 96px;
      height: 96px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      margin-bottom: 28px;
      background: #f3f8ff;
    }

    .card h3 {
      font-size: 36px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 14px;
    }

    .card p {
      font-size: 27px;
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="section-label">Features</div>
    <h1>What We Offer</h1>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-icon">Icon</div>
      <h3>Feature One</h3>
      <p>Description of feature one</p>
    </div>
    <!-- Repeat for other cards -->
  </div>
</body>
</html>
```

---

## Timeline / Roadmap

Horizontal timeline with phases.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: white;
      padding: 80px 100px;
      overflow: hidden;
    }

    .section-label {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #667eea;
      margin-bottom: 20px;
    }

    h1 { font-size: 84px; font-weight: 700; color: #1a1a2e; margin-bottom: 60px; }

    .timeline {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding-top: 40px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      top: 76px;
      left: 120px;
      right: 120px;
      height: 6px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
    }

    .phase {
      flex: 1;
      text-align: center;
      position: relative;
    }

    .phase-dot {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: white;
      border: 6px solid #667eea;
      margin: 0 auto 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 30px;
      color: #667eea;
      position: relative;
      z-index: 1;
    }

    .phase:first-child .phase-dot {
      background: #667eea;
      color: white;
    }

    .phase-content {
      background: #f8f9fa;
      border-radius: 20px;
      padding: 40px;
      margin: 0 20px;
    }

    .phase-content h3 { font-size: 33px; font-weight: 600; color: #1a1a2e; margin-bottom: 20px; }
    .phase-content ul { list-style: none; text-align: left; }
    .phase-content li { font-size: 24px; color: #666; padding: 10px 0; }
    .phase-label { font-size: 18px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 28px; }
  </style>
</head>
<body>
  <div class="section-label">Roadmap</div>
  <h1>Timeline</h1>
  <div class="timeline">
    <div class="phase">
      <div class="phase-dot">1</div>
      <div class="phase-content">
        <h3>Phase One</h3>
        <ul>
          <li>Item one</li>
          <li>Item two</li>
        </ul>
      </div>
      <div class="phase-label">Current</div>
    </div>
    <!-- Repeat for other phases -->
  </div>
</body>
</html>
```

---

## Closing / Thank You Slide

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body {
      width: 1920px;
      height: 1080px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .container {
      text-align: center;
      color: white;
    }

    h1 {
      font-size: 144px;
      font-weight: 800;
      margin-bottom: 40px;
      background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 48px;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 72px;
    }

    .cta {
      display: inline-flex;
      align-items: center;
      gap: 20px;
      background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
      padding: 32px 64px;
      border-radius: 20px;
      font-size: 36px;
      font-weight: 600;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Thank You</h1>
    <p class="subtitle">Any questions?</p>
    <div class="cta">Get Started</div>
  </div>
</body>
</html>
```
