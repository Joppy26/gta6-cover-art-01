# GTA 6 Cover Art Maker

[![Bounty](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![Rank](https://make.fun/badge/gta6-cover-art-01/Joppy26/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![Reward](https://make.fun/badge/gta6-cover-art-01/Joppy26/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

A fully-featured, offline-first web application that turns personal photos and custom captions into striking GTA 6-style multi-panel cover art.

## Features
- **Multi-Panel Poster Layout**: One large hero panel and two smaller stacked panels, each fillable with your own local photos (via file picker or drag-and-drop).
- **Interactive Positioning & Zoom**: Drag photos directly on the canvas to pan them within their panels, with individual zoom sliders per panel and a reset button.
- **Custom Bold Lettering**: Editable caption rendered with the Anton font, thick contrasting outlines, drop shadows, and gradient fills.
- **Vice City Color Grades**: Toggle between Sunset, Neon, and None color grading presets.
- **Multiple Post Sizes**: Instant PNG export for Square (1080x1080), Portrait (1080x1350), and Landscape (1920x1080) dimensions.
- **Zero Runtime Network Requests**: Completely static web app running entirely offline with local FileReader API.

## Running Locally

1. Install dependencies or serve with Node.js 22+:
   ```bash
   node serve.ts
   ```
2. Open your browser at `http://localhost:8080`.
3. Build output dossier:
   ```bash
   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
   ```
