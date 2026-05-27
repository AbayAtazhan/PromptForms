# PromptForms

Turn complex system prompts with dynamic variables (like `{{topic}}`) into clean, parameter-driven form interfaces. Let your team run instructions securely via Gemini 2.5 Flash without exposing underlying engineering.

## Key Features

- **Prompt-to-UI Compilation**: As you draft instructions, variables in double curly-braces (e.g. `{{name}}`) are extracted automatically to render custom input forms.
- **Client-Side Execution**: Connects directly to Google Gemini 2.5 Flash inside the browser using your own API Key. No server proxies, no middleman tracking, complete privacy.
- **Zero-Dependency Markdown Renderer**: A lightweight React-based markdown parser written from scratch to render headers, bold text, lists, and copyable terminal blocks mid-stream.
- **B2B Waitlist Funnel**: Integrated Web3Forms register card with async spinner states and queue position metrics for enterprise upgrades.
- **Local First**: Templates and settings are stored entirely in client-side LocalStorage.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (using the new native `@theme` directives)
- Lucide React
- `@google/generative-ai`

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/promptforms.git
cd promptforms
npm install
```

### 2. Configure Environment variables
Create a `.env.local` file in the root folder and add your Web3Forms access token:
```env
VITE_WEB3FORMS_KEY=7adbcd28-27af-4b2a-a744-757b941a1f7d
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. API Key setup
Open the app in your browser, click **Configure Gemini Key** in the header, and paste your Gemini API Key. You can get a free, fast-tier API Key directly from [Google AI Studio](https://aistudio.google.com/).

## B2B Roadmap & Commercial Strategy
For agencies and operations teams looking for control:
- **Secure IP Injection**: System instructions are injected server-side so employees fill out forms without ever seeing corporate system prompt engineering details.
- **Centralized Quotas**: Pool master enterprise API keys and allocate user tokens or monthly budgets.
- **Workspace Catalogs**: Share folders and coordinate access control across departments.

## License

MIT License. Open source and free to contribute.
