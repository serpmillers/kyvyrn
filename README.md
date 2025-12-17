# Native App Maker

A web application that converts any website into a native desktop app by generating AppImage files. Built with React, TypeScript, Vite, and Tauri.

## Features

- **First-Time User Experience**: Welcoming landing page for new visitors
- **URL Input Interface**: Simple form to enter website URLs
- **AppImage Generation**: Converts websites into downloadable AppImage files
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Cross-Platform**: Frontend ready for desktop deployment via Tauri

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Desktop App**: Tauri (Rust backend)
- **Linting**: ESLint with TypeScript support

## Project Structure

```
native-app-maker/
├── src/
│   ├── components/
│   │   └── UrlInput.tsx          # Reusable URL input component
│   ├── pages/
│   │   ├── Landing.tsx           # Welcome page for first-time users
│   │   └── Wrapper.tsx           # Main app interface with URL input and download
│   ├── App.tsx                   # Main app component with routing logic
│   ├── main.tsx                  # React app entry point
│   └── index.css                 # Global styles with Tailwind imports
├── src-tauri/                    # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs
│   ├── tauri.conf.json
│   └── icons/
├── public/                       # Static assets
├── package.json                  # Node.js dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.cjs            # PostCSS configuration for Tailwind
├── tsconfig.json                 # TypeScript configuration
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Rust** (latest stable version) - [Install Rust](https://rustup.rs/)
- **Tauri CLI** (install globally):
  ```bash
  cargo install tauri-cli
  ```
  Or use your system package manager if available.

### System Dependencies

**For Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

**For macOS:**
```bash
# Install Xcode command line tools
xcode-select --install

# Install Homebrew dependencies
brew install gtk+3 librsvg
```

**For Windows:**
- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 10+)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd native-app-maker
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Verify Tauri setup:**
   ```bash
   cargo tauri --version
   ```

### Development

#### Web Development (Frontend Only)
```bash
npm run dev
```
Opens the app in your browser at [http://localhost:5173](http://localhost:5173)

#### Desktop App Development (Full Tauri App)
```bash
cargo tauri dev
```
Launches the native desktop application with hot-reloading for both frontend and backend changes.

### Building for Production

#### Web Build
```bash
npm run build
npm run preview
```

#### Desktop App Build
```bash
cargo tauri build
```
Creates distributable binaries in `src-tauri/target/release/bundle/`

## Usage

### Web Version
1. **First Visit**: Users see a welcoming landing page with app features
2. **Get Started**: Click the button to access the main interface
3. **Enter URL**: Input the website URL you want to convert
4. **Generate App**: Click "Generate App" to create the AppImage
5. **Download**: Download the generated AppImage file

### Desktop App Features
- **App Creation**: Enter website URLs and create native app configurations
- **App Management**: View and manage all created apps in the sidebar
- **Live Launch**: Click "Launch App" to open websites in native windows
- **AppImage Export**: Download AppImage files for distribution
- **Responsive UI**: Adapts to different screen sizes automatically

### Tauri Commands
The desktop app includes Rust backend commands for:
- Opening new application windows
- Managing app configurations
- Handling system integrations

## Development

### Available Scripts

- `npm run dev` - Start Vite development server (frontend only)
- `npm run build` - Build for production (frontend only)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `cargo tauri dev` - Run Tauri development app (full desktop app)
- `cargo tauri build` - Build Tauri app for distribution

### Key Components

- **App.tsx**: Manages app state and conditional rendering
- **Landing.tsx**: First-time user welcome page
- **Wrapper.tsx**: Main functionality with URL input and file generation
- **UrlInput.tsx**: Controlled input component for URLs

### Tauri Backend

The `src-tauri/` directory contains the Rust backend:

- **main.rs**: Entry point with Tauri commands
- **tauri.conf.json**: App configuration (name, version, permissions)
- **icons/**: Application icons for different platforms

**Available Tauri Commands:**
- `open_app_window`: Opens a website in a new native window

## Architecture

This is a hybrid application with:

1. **Frontend**: React/TypeScript web app built with Vite
2. **Backend**: Rust application using Tauri's webview framework
3. **Communication**: Frontend calls backend commands via Tauri's JavaScript API
4. **Distribution**: Can be built as web app or native desktop application

## Troubleshooting

### Common Tauri Issues

**"Command 'cargo' not found"**
- Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Restart your terminal or run `source ~/.cargo/env`

**"WebView2 not found" (Windows)**
- Download and install [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)

**Permission errors on macOS**
- Allow app permissions in System Preferences > Security & Privacy

**Build fails on Linux**
- Install system dependencies: `sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`

**Hot reload not working**
- Ensure both `npm run dev` and `npm run tauri dev` are running
- Check that ports 5173 (Vite) and Tauri dev port are available

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
