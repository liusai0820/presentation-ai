# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup & Installation
```bash
# Install dependencies (pnpm is required)
pnpm install

# Initialize database
pnpm db:push

# Open Prisma Studio (database GUI)
pnpm db:studio
```

### Development
```bash
# Start dev server with Turbo
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type

# Linting
pnpm lint
pnpm lint:fix

# Code formatting & checking (uses Biome)
pnpm check
pnpm check:fix
```

### Testing Individual Features
- **Generate outline**: Navigate to dashboard, enter topic, configure settings, click "Generate Outline"
- **Generate presentation**: After outline generation, select theme and click "Generate Presentation"
- **Test Reveal.js mode**: Set `generationMode` to "revealjs" in dashboard settings
- **Test rich editor mode**: Set `generationMode` to "xml" in dashboard settings

## Architecture Overview

### Core Concept: Dual Generation Modes
This project supports **two distinct presentation generation modes**:

1. **Reveal.js Mode (HTML)**: Fast, lightweight HTML presentations using Reveal.js framework
   - Generated via `/api/presentation/generate_revealjs`
   - Assembled by `src/lib/presentation/html-assembler-revealjs.ts`
   - Themes in `src/lib/presentation/html-themes/`
   
2. **Rich Editor Mode (XML)**: Full-featured Plate.js editor with drag-and-drop
   - Generated via `/api/presentation/generate`
   - Uses Plate.js editor components in `src/components/presentation/editor/`
   - Supports live editing, image generation, and complex layouts

The mode is controlled by the `generationMode` state in `presentation-state.ts`.

### AI Content Generation Pipeline

**Outline Generation**:
```
User Input → /api/presentation/outline → AI generates structured outline → Review/Edit → Confirm
```

**Presentation Generation (Reveal.js)**:
```
Outline + Theme → /api/presentation/generate_revealjs → 
AI generates HTML content (via revealjs-content-generator.ts) → 
html-assembler-revealjs.ts assembles full HTML → 
Display in presentation-page
```

**Key Files**:
- `src/lib/prompts/revealjs-content-generator.ts`: The system prompt that instructs AI on how to generate Reveal.js content (includes component library, layout rules, content density guidelines)
- `src/lib/presentation/html-assembler-revealjs.ts`: Splits AI-generated HTML into slides and wraps them in Reveal.js structure
- `src/lib/presentation/html-themes/revealjs-adapter.ts`: Wraps content with Reveal.js boilerplate and theme CSS

### State Management
Uses **Zustand** for global state (`src/states/presentation-state.ts`):
- Manages generation flow (`isGeneratingOutline`, `shouldStartPresentationGeneration`)
- Tracks outline, slides, theme selection, image generation
- Controls UI states (sidebar collapsed, presentation mode, saving status)

### Database Schema (Prisma)
Key models:
- `User`: Authentication via NextAuth.js (Google OAuth)
- `BaseDocument`: Base class for all documents
- `Presentation`: Stores presentation content as JSON, references theme, outline, searchResults
- `CustomTheme`: User-created themes with themeData JSON blob
- `GeneratedImage`: Tracks AI-generated images

### Theme System
**Built-in Themes**: McKinsey, BCG, Bain (consulting-style minimalist designs)
- Theme CSS files in `src/lib/presentation/html-themes/` (e.g., `mckinsey.css`)
- Theme definitions in `src/lib/presentation/themes.ts`
- Custom theme creator UI in `src/components/presentation/theme/`

**Key Design Principles** (per MCKINSEY_STYLE_GUIDE.md):
- Extreme minimalism: no gradients, clean lines
- 16:9 aspect ratio (960x700px slides)
- 4% margin for safe display area
- Primary color: #0066CC (blue)
- Typography: Helvetica Neue, system fonts

### AI Prompt Engineering
**Critical**: The quality of generated presentations depends heavily on the prompt in `revealjs-content-generator.ts`.

**Key Content Rules** (must preserve when editing prompts):
1. **Content Density**: 200-300 words per slide, 3-5 information blocks
2. **Space Management**: Balance content richness with visual space (avoid overflow)
3. **Component Library**: Only use predefined CSS classes (`.two-columns`, `.data-card`, `.timeline`, etc.)
4. **Output Format**: Each slide starts with `<h1>` or `<h2>`, separated by two blank lines, NO `<section>` tags

## Project-Specific Patterns

### API Route Structure
- `/api/presentation/outline`: Generate outline (with optional web search via Tavily)
- `/api/presentation/generate`: Generate rich editor presentation
- `/api/presentation/generate_revealjs`: Generate Reveal.js HTML presentation
- `/api/presentation/generate_html`: Legacy HTML generation
- `/api/presentation/generate_powerpoint`: PowerPoint export (partially implemented)

### File Upload & Images
- **UploadThing**: File uploads (configured in `/api/uploadthing`)
- **AI Image Generation**: Together AI (`black-forest-labs/FLUX.1-schnell-Free` by default)
- **Stock Images**: Unsplash API integration
- Image source controlled by `imageSource` state ("ai" or "stock")

### Environment Variables
Required API keys (see `.env.example`):
- `OPENAI_API_KEY`: OpenAI for content generation
- `OPENROUTER_API_KEY`: Alternative AI provider
- `TOGETHER_AI_API_KEY`: Image generation
- `TAVILY_API_KEY`: Web search
- `UPLOADTHING_TOKEN`: File uploads
- `UNSPLASH_ACCESS_KEY`: Stock photos
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: OAuth
- `DATABASE_URL`: PostgreSQL connection
- `NEXTAUTH_SECRET`: NextAuth.js secret

### Local AI Model Support
Supports local models via:
- **Ollama**: Detected automatically if running
- **LM Studio**: Detected if server enabled with CORS

### Component Organization
```
src/components/presentation/
├── dashboard/        # Main dashboard UI (topic input, settings)
├── editor/          # Plate.js rich text editor
├── outline/         # Outline review/edit UI
├── presentation-page/ # Presentation viewer (supports both modes)
├── theme/           # Theme selector & custom theme creator
├── html-slides/     # HTML slide renderer for Reveal.js mode
└── utils/           # Shared utilities (parsers, converters)
```

### TypeScript Path Aliases
- `@/*` maps to `src/*` (configured in `tsconfig.json`)

### Styling
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Biome**: Linting & formatting (replaces ESLint + Prettier)
- **Custom animations**: `breathing`, `shake` (in `tailwind.config.ts`)

## Common Development Tasks

### Adding a New Theme
1. Create CSS file in `src/lib/presentation/html-themes/` (follow `mckinsey.css` structure)
2. Add theme definition in `src/lib/presentation/themes.ts`
3. Update theme selector in `src/components/presentation/theme/`

### Modifying AI Prompt
**Important**: Edit `src/lib/prompts/revealjs-content-generator.ts`
- Preserve content density rules (avoid overflow issues)
- Maintain component library consistency
- Test with various topics to ensure quality

### Adding New API Endpoint
1. Create route in `src/app/api/presentation/[name]/route.ts`
2. Use `NextRequest` and `NextResponse` (Next.js 15 App Router)
3. Authenticate with `auth()` from NextAuth.js if needed
4. Return JSON responses

### Debugging Generation Issues
1. Check AI response in browser DevTools Network tab
2. Look for console logs in `html-assembler-revealjs.ts` (slide splitting logic)
3. Verify outline structure in `presentation-state.ts`
4. Check if content exceeds recommended density (causes overflow)

### Database Changes
```bash
# After modifying prisma/schema.prisma
pnpm db:push

# Generate Prisma Client (auto-runs after install)
pnpm exec prisma generate
```

## Important Conventions

### Commit Messages
Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `chore:` Build/tooling changes

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns (see `src/components/presentation/`)
- Use Zustand for state management (not Context API)
- Prefer server components where possible (Next.js 15)
- Use `"use client"` directive only when necessary (client-side interactivity)

### Naming Conventions
- Components: PascalCase (e.g., `PresentationDashboard.tsx`)
- Utilities: camelCase (e.g., `html-assembler-revealjs.ts`)
- API routes: kebab-case (e.g., `generate-revealjs/route.ts`)
- CSS classes: kebab-case (e.g., `.data-card`, `.two-columns`)

## Key Documentation
For deeper technical details, refer to:
- `REVEALJS_INTEGRATION_GUIDE.md`: Complete Reveal.js architecture
- `REVEALJS_LAYOUT_OPTIMIZATION.md`: Content overflow solutions, density control
- `PROMPT_ENHANCEMENT_GUIDE.md`: AI prompt engineering best practices
- `MCKINSEY_STYLE_GUIDE.md`: Professional theme design guidelines
- `CUSTOM_THEMES_GUIDE.md`: How to create custom themes
- `CONTRIBUTING.md`: Contribution guidelines

## Known Issues & Considerations
- PowerPoint export (`.pptx`) is partially implemented
- Mobile responsiveness needs improvement (noted in roadmap)
- Content overflow can occur if AI generates too much text (managed via prompt engineering)
- Some Plate.js features may conflict with SSR (use dynamic imports if needed)
