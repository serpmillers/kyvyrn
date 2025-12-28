# Kyvyrn

Kyvyrn is a lightweight, Linux-first desktop app wrapper that turns web apps into clean, native-feeling applications — without Electron overhead.

Built with **React, TypeScript, Vite, and Tauri**, Kyvyrn focuses on performance, transparency, and sane defaults.

---

## Features

- **Web → Native Wrapping**: Convert any website into a native desktop app
- **App-Mode Launching**: No tabs, no address bar, no browser UI clutter
- **Smart Browser Detection**:
  - Brave → Chrome → Chromium → Vivaldi → Opera → Edge
- **Per-App Configuration**: Each wrapped app has its own isolated config
- **Global Defaults**: Theme mode, layout preferences, and UI defaults for new apps
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Lightweight by Design**: Uses system web engines via Tauri (no Electron)

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Desktop Backend**: Tauri (Rust)
- **Linting**: ESLint with TypeScript support

---

## Project Structure

```
kyvyrn/
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── postcss.config.cjs
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/                       # Static assets
├── src/
│   ├── App.tsx                   # App state & routing
│   ├── index.css                 # Global styles (Tailwind)
│   ├── main.tsx                  # React entry point
│   ├── assets/
│   ├── components/
│   │   └── UrlInput.tsx          # Reusable URL input component
│   ├── pages/
│   │   ├── Landing.tsx           # Welcome page for first-time users
│   │   └── Wrapper.tsx           # Main app interface
│   ├── types/
│   │   ├── engine.ts
│   │   └── globalConfig.ts
│   └── utils/
│       └── icon.tsx
└── src-tauri/                    # Tauri backend (Rust)
    ├── build.rs
    ├── Cargo.toml
    ├── tauri.conf.json
    ├── capabilities/
    │   └── default.json
    ├── gen/
    │   └── schemas/
    │       ├── acl-manifests.json
    │       ├── capabilities.json
    │       ├── desktop-schema.json
    │       └── linux-schema.json
    ├── icons/                    # Platform icons
    ├── src/
    │   ├── lib.rs
    │   ├── main.rs
    │   ├── commands/
    │   │   ├── chromium.rs
    │   │   ├── configs.rs
    │   │   ├── global_config.rs
    │   │   ├── icons.rs
    │   │   ├── mod.rs
    │   │   └── webview.rs
    │   ├── net/
    │   │   ├── http.rs
    │   │   └── mod.rs
    │   └── utils/
    │       ├── browser.rs
    │       ├── mod.rs
    │       ├── paths.rs
    │       └── url.rs
    └── target/                   # Build artifacts
```


---

## How Kyvyrn Works

1. Enter a website URL
2. Kyvyrn selects the best available browser engine
3. The site launches in **app mode**
4. App configuration is persisted locally

Each wrapped app is stored in:

```bash
~/.local/share/kyvyrn/<app-name>/
````

Global preferences are stored separately and only apply to **newly created apps**.

---

## Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **npm** or **yarn**
* **Rust** (latest stable)
* **Tauri CLI**

  ```bash
  cargo install tauri-cli
---

### System Dependencies

#### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf
```

#### macOS

```bash
xcode-select --install
brew install gtk+3 librsvg
```

#### Windows

* Install **Microsoft Visual Studio C++ Build Tools**
* Install **WebView2 Runtime** (usually preinstalled on Windows 10+)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd kyvyrn
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Verify Tauri setup:

   ```bash
   cargo tauri --version
   ```

---

## Development

### Frontend Only

```bash
npm run dev
```

Runs the app in the browser at `http://localhost:5173`

### Desktop App (Tauri)

```bash
cargo tauri dev
```

Launches the native desktop app with hot reload.

---

## Building for Production

### Web Build

```bash
npm run build
npm run preview
```

### Desktop Build

```bash
cargo tauri build
```

Distributable binaries are generated in:

```bash
src-tauri/target/release/bundle/
```

---

## Usage

### Desktop App

* Add new apps by entering a URL
* Manage all wrapped apps from the main interface
* Launch apps in native windows
* Persist per-app and global settings locally

### Configuration

* **Per-app configs** live inside the Kyvyrn data directory
* **Global defaults** affect only newly created apps
* No hidden state or opaque storage

---

## Tauri Backend

The Rust backend handles:

* Window creation and lifecycle
* App-mode launching
* File system persistence
* OS-level integration

Key files:

* `main.rs` — Tauri command definitions
* `tauri.conf.json` — App metadata and permissions
* `icons/` — Platform-specific icons

---

## Philosophy

Kyvyrn is built for people who want:

* Native performance
* Minimal overhead
* Predictable behavior
* Respect for the host OS

No background junk.
No bloated runtimes.
Just your app — running clean.

---

## Status

Kyvyrn is under active development.
Breaking changes may occur until the first stable release.
