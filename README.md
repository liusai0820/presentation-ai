# ALLWEONE® AI Presentation Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Plate JS](https://img.shields.io/badge/Plate.js-3B82F6?logoColor=white)](https://platejs.org)

> ⭐ **Help us reach more developers and grow the ALLWEONE community. Star this repo!**

An open-source, AI-powered presentation generator that creates beautiful, professional slides in minutes. Inspired by Gamma.app, this tool combines the power of AI with intuitive design to help you create stunning presentations effortlessly.

<https://github.com/user-attachments/assets/a21dbd49-75b8-4822-bcec-a75b581d9c60>

## 🔗 Quick Links

- 🌐 [Live Demo](http://presentation.allweone.com)
- 🎥 [Video Tutorial](https://www.youtube.com/watch?v=UUePLJeFqVQ)
- 💬 [Discord Community](https://discord.gg/fsMHMhAHRV)
- 📖 [Documentation](#-documentation)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

### 🎨 Presentation Generation
- **AI-Powered Content**: Generate complete presentations on any topic with AI
- **Two Generation Modes**:
  - **HTML Mode**: Fast, lightweight presentations with Reveal.js
  - **Rich Editor Mode**: Full-featured editor with drag-and-drop capabilities
- **Smart Outlines**: AI-generated outlines that you can review and edit before finalizing
- **Real-Time Generation**: Watch your presentation build live as content is created
- **Web Search Integration**: Optionally enhance content with real-time web search results

### 🎭 Professional Themes
- **McKinsey-Style Themes**: Professional consulting-grade designs
- **9+ Built-in Themes**: Carefully crafted for different use cases
- **Custom Theme Creator**: Build and save your own themes from scratch
- **Reveal.js Integration**: Modern, responsive HTML presentations

### ✏️ Rich Editing Experience
- **Plate Editor**: Powerful rich text editor with full formatting support
- **Drag & Drop**: Intuitive slide reordering and element manipulation
- **Image Generation**: AI-powered image creation with multiple models
- **Media Embedding**: Add images, videos, and other media easily
- **Auto-Save**: Everything saves automatically as you work

### 🎯 Presentation Tools
- **Presentation Mode**: Present directly from the application
- **Full-Screen Support**: Seamless full-screen presentation experience
- **Export Options**: Download as HTML or PowerPoint (PPTX)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

---

## 🧰 Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### AI & Content Generation
- **OpenAI API** - GPT models for content generation
- **OpenRouter** - Multi-model AI routing
- **Together AI** - Image generation
- **Tavily API** - Web search integration

### Presentation Engines
- **Reveal.js** - HTML presentation framework
- **Plate Editor** - Rich text editing
- **ECharts** - Data visualization and charts

### Database & Auth
- **PostgreSQL** - Primary database
- **Prisma ORM** - Type-safe database access
- **NextAuth.js** - Authentication solution

### UI & Components
- **Radix UI** - Accessible component primitives
- **DND Kit** - Drag and drop functionality
- **Lucide Icons** - Beautiful icon library

### File Management
- **UploadThing** - File upload service
- **Unsplash API** - Stock photo integration

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL** database
- Required API keys (see below)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:allweonedev/presentation-ai.git
   cd presentation-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```env
   # AI Providers
   OPENAI_API_KEY="your-openai-key"
   OPENROUTER_API_KEY="your-openrouter-key"
   TOGETHER_AI_API_KEY="your-together-ai-key"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Services
   UPLOADTHING_TOKEN="your-uploadthing-token"
   UNSPLASH_ACCESS_KEY="your-unsplash-key"
   TAVILY_API_KEY="your-tavily-key"
   
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/presentation_ai"
   ```

4. **Initialize the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Guide

1. **Login** to the website
2. **Enter your topic** on the dashboard
3. **Configure settings**:
   - Number of slides (5-10 recommended)
   - Language preference
   - Generation mode (HTML/Rich Editor)
   - Enable web search (optional)
4. **Generate outline** and review/edit
5. **Select theme** and image source
6. **Generate presentation** and watch it build in real-time
7. **Edit, present, or export** your final presentation

---

## 📚 Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| [REVEALJS_INTEGRATION_GUIDE.md](REVEALJS_INTEGRATION_GUIDE.md) | Complete guide to Reveal.js integration |
| [REVEALJS_LAYOUT_OPTIMIZATION.md](REVEALJS_LAYOUT_OPTIMIZATION.md) | Layout and styling optimization details |
| [PROMPT_ENHANCEMENT_GUIDE.md](PROMPT_ENHANCEMENT_GUIDE.md) | AI prompt engineering best practices |
| [MCKINSEY_STYLE_GUIDE.md](MCKINSEY_STYLE_GUIDE.md) | Professional theme design guidelines |

### Feature Guides

| Document | Description |
|----------|-------------|
| [CUSTOM_THEMES_GUIDE.md](CUSTOM_THEMES_GUIDE.md) | How to create custom themes |
| [HTML_GENERATION_GUIDE.md](HTML_GENERATION_GUIDE.md) | HTML presentation generation |
| [GENERATION_MODE_PROPOSAL.md](GENERATION_MODE_PROPOSAL.md) | Understanding generation modes |

### Development

| Document | Description |
|----------|-------------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to the project |
| [BUSINESS_SCENARIO.md](BUSINESS_SCENARIO.md) | Business use cases and scenarios |
| [REVEALJS_ENHANCEMENT_PLAN.md](REVEALJS_ENHANCEMENT_PLAN.md) | Future enhancement roadmap |

### Key Technical Details

#### Reveal.js Configuration
- **Aspect Ratio**: 16:9 (960x700px)
- **Margin**: 4% for safe display area
- **Themes**: McKinsey, BCG, Bain (professional consulting styles)
- **Features**: Full-screen support, responsive scaling, auto-layout

#### AI Content Generation
- **Content Density**: 200-300 words per slide
- **Information Blocks**: 3-5 per slide
- **Layout Variety**: Multiple column layouts, data cards, charts
- **Quality Control**: Built-in content density management

#### Theme System
- **Extreme Minimalism**: No gradients, clean lines, professional
- **Color Palette**: Primary blue (#0066CC), neutral grays
- **Typography**: Helvetica Neue, system fonts
- **Components**: Data cards, metric cards, timelines, charts

---

## 📁 Project Structure

```
presentation-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                     # API routes
│   │   │   └── presentation/        # Presentation generation APIs
│   │   ├── auth/                    # Authentication pages
│   │   ├── dashboard/               # Main dashboard
│   │   └── presentation/            # Presentation pages
│   │
│   ├── components/                   # React components
│   │   ├── auth/                    # Authentication UI
│   │   ├── presentation/            # Presentation components
│   │   │   ├── dashboard/          # Dashboard UI
│   │   │   ├── editor/             # Rich text editor
│   │   │   ├── outline/            # Outline editor
│   │   │   ├── presentation-page/  # Presentation viewer
│   │   │   └── theme/              # Theme selector
│   │   ├── plate/                   # Plate editor setup
│   │   └── ui/                      # Shared UI components
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── presentation/            # Presentation logic
│   │   │   ├── html-themes/        # Reveal.js themes
│   │   │   │   ├── mckinsey.css   # McKinsey theme
│   │   │   │   ├── bcg.css        # BCG theme
│   │   │   │   └── revealjs-adapter.ts
│   │   │   └── html-assembler-revealjs.ts
│   │   └── prompts/                 # AI prompts
│   │       └── revealjs-content-generator.ts
│   │
│   ├── states/                       # State management
│   │   └── presentation-state.ts    # Presentation state
│   │
│   ├── hooks/                        # Custom React hooks
│   ├── server/                       # Server-side code
│   └── styles/                       # Global styles
│
├── prisma/                           # Database
│   └── schema.prisma                # Database schema
│
├── public/                           # Static assets
│   └── themes/                      # Theme CSS files
│
├── docs/                             # Documentation (see above)
├── .env.example                      # Environment template
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind config
└── package.json                      # Dependencies
```

### Key Directories Explained

- **`src/app/api/presentation/`** - API endpoints for presentation generation
- **`src/lib/presentation/html-themes/`** - Reveal.js theme CSS files
- **`src/lib/prompts/`** - AI prompt templates for content generation
- **`src/components/presentation/`** - All presentation-related UI components
- **`public/themes/`** - Publicly accessible theme files

---

## 🗺️ Roadmap

### ✅ Completed
- [x] AI-powered content generation
- [x] Reveal.js HTML presentations
- [x] Rich text editor with Plate
- [x] Professional McKinsey-style themes
- [x] Custom theme creator
- [x] Web search integration
- [x] Image generation (AI & stock)
- [x] Full-screen presentation mode
- [x] Auto-save functionality
- [x] Layout optimization (Oct 2024)

### 🟡 In Progress
- [ ] Export to PowerPoint (.pptx) - Partially working
- [ ] Media embedding improvements
- [ ] Additional built-in themes (15+ planned)
- [ ] Mobile responsiveness enhancements
- [ ] Advanced chart generation

### 🔴 Planned
- [ ] Export to PDF
- [ ] Real-time collaboration
- [ ] Template library
- [ ] Animation and transitions
- [ ] Voice-over recording
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] Presentation analytics
- [ ] AI presenter notes
- [ ] Custom font uploads
- [ ] Plugin system
- [ ] Public API
- [ ] E2E testing suite

> 📝 **Want to contribute?** Check out our [Contributing Guidelines](CONTRIBUTING.md) and pick a feature to work on!

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- � Reeport bugs and issues
- � Suggecst new features
- 📝 Improve documentation
- 🎨 Design new themes
- 💻 Submit pull requests

### Contribution Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Write clear commit messages
   - Add tests if applicable
4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🧠 Local Models Support

Use local AI models with Ollama or LM Studio:

### Ollama Setup
```bash
# Install Ollama
# Download a model
ollama pull llama3.1

# Model will appear in the app's model selector
```

### LM Studio Setup
1. Install [LM Studio](https://lmstudio.ai)
2. Enable Server and CORS in settings
3. Download your preferred model
4. Model will appear in the app automatically

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

Special thanks to:
- [OpenAI](https://openai.com/) - AI generation capabilities
- [Reveal.js](https://revealjs.com/) - HTML presentation framework
- [Plate Editor](https://plate.udecode.io/) - Rich text editing
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Next.js](https://nextjs.org/) - React framework
- All our [contributors](https://github.com/allweonedev/presentation-ai/graphs/contributors)

---

## 💬 Support & Community

Need help or want to connect?

- 💬 [Discord Community](https://discord.gg/wSVNudUBdY) - Chat with the team and community
- 🐛 [Report a Bug](https://github.com/allweonedev/presentation-ai/issues) - Found an issue? Let us know
- 💡 [Request a Feature](https://github.com/allweonedev/presentation-ai/issues) - Have an idea? Share it
- 📧 [Email Support](mailto:support@allweone.com) - Direct support

---

<div align="center">

**Built with ❤️ by the ALLWEONE™ Team**

[⭐ Star us on GitHub](https://github.com/allweonedev/presentation-ai) • [🌐 Visit Website](http://presentation.allweone.com) • [💬 Join Discord](https://discord.gg/wSVNudUBdY)

</div>
