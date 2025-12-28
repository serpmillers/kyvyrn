import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Engine } from "../types/engine";
import type { GlobalConfig } from "../types/globalConfig";

const THEME = {
  dark: {
    root: "bg-gray-950",
    panel:
      "bg-gray-900/60 border-gray-800/60 border backdrop-blur-xl border-rounded-2xl",
    panelAlt: "bg-gray-800/40 border-gray-700/50 border-rounded-2xl",
    text: "text-gray-100",
    subText: "text-gray-400",
    subSubText: "text-gray-500",
    input:
      "w-full px-4 py-3 rounded-xl bg-gray-900 text-gray-100 border border-gray-700/60 backdrop-blur-md shadow-inner shadow-black/20 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all appearance-none placeholder:text-gray-600",
    inputChoose:
      "w-full px-4 py-1.75 rounded-xl bg-gray-900 text-gray-100 border border-gray-700/60 backdrop-blur-md shadow-inner shadow-black/20 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all appearance-none",
    buttonPrimary: "bg-gray-100 hover:bg-white text-gray-950",
    buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-gray-100",
    toggle: "bg-gray-800/60 border border-gray-700/60",
    toggleButtonSelected: "bg-gray-100 text-gray-950",
    toggleButtonUnselected: "text-gray-500 hover:bg-gray-700/50",
    toggleButton:
      "p-2 rounded-lg border border-gray-700/60 hover:bg-gray-800/60 text-gray-400 transition-colors",
    appCard: "bg-gray-800/40 border border-gray-700/60 hover:bg-gray-700/50",
    configButton: "bg-gray-800/90 hover:bg-gray-700/90",
    configButtonText: "text-gray-300",
    listConfigButton: "hover:bg-gray-800/50",
    listConfigButtonText: "text-gray-500",
    selectArrow: "text-gray-500",
    iconBg: "bg-gradient-to-br from-gray-700 to-gray-800",
    deleteButton: "bg-gray-700/90 hover:bg-gray-600",
  },
  light: {
    root: "bg-gray-50",
    panel:
      "bg-white/80 border-gray-800/60 border backdrop-blur-xl border-rounded-2xl",
    panelAlt: "bg-gray-100/60 border-gray-300/40 border-rounded-2xl",
    text: "text-gray-950",
    subText: "text-gray-600",
    subSubText: "text-gray-500",
    input:
      "w-full px-4 py-3 rounded-xl bg-white text-gray-950 border border-gray-300/80 backdrop-blur-md shadow-inner shadow-gray-200/50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all appearance-none placeholder:text-gray-400",
    inputChoose:
      "w-full px-4 py-1.75 rounded-xl bg-white text-gray-950 border border-gray-300/80 backdrop-blur-md shadow-inner shadow-gray-200/50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all appearance-none",
    buttonPrimary: "bg-gray-950 hover:bg-gray-800 text-white",
    buttonSecondary: "bg-gray-400 hover:bg-gray-500 text-white",
    toggle: "bg-gray-200/60 border border-gray-300/60",
    toggleButtonSelected: "bg-gray-950 text-white",
    toggleButtonUnselected: "text-gray-500 hover:bg-gray-300/50",
    toggleButton:
      "p-2 rounded-lg border border-gray-300/60 hover:bg-gray-200/60 transition-colors text-gray-600",
    appCard: "bg-gray-100/60 border border-gray-300/60 hover:bg-gray-200/60",
    configButton: "bg-gray-200/90 hover:bg-gray-300/90",
    configButtonText: "text-gray-700",
    listConfigButton: "hover:bg-gray-200/50",
    listConfigButtonText: "text-gray-600",
    selectArrow: "text-gray-600",
    iconBg: "bg-gradient-to-br from-gray-300 to-gray-400",
    deleteButton: "bg-gray-300/90 hover:bg-gray-400",
  },
} as const;

interface AppDetails {
  id: string;
  url: string;
  name: string;
  description: string;
  created_at: number;
  engine?: Engine;
  iconUrl?: string;
}

export const prettyBrowserName = (cmd: string) => {
  const map: Record<string, string> = {
    "brave-browser": "Brave",
    "brave-browser-stable": "Brave (Stable)",
    "brave-browser-nightly": "Brave (Nightly)",

    "google-chrome": "Google Chrome",
    "google-chrome-stable": "Google Chrome (Stable)",

    chromium: "Chromium",
    "chromium-browser": "Chromium",

    vivaldi: "Vivaldi",
    opera: "Opera",
    "microsoft-edge": "Microsoft Edge",
  };

  return map[cmd] ?? cmd;
};

function Wrapper() {
  const [viewMode, setViewMode] = useState<GlobalConfig["viewMode"]>("grid");

  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);
  const theme = THEME[globalConfig?.theme ?? "dark"];

  const [url, setUrl] = useState("");
  const [apps, setApps] = useState<AppDetails[]>([]);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");

  // Config panel state
  const [showConfig, setShowConfig] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppDetails | null>(null);
  const [configEngine, setConfigEngine] = useState<Engine>({ kind: "webkit" });

  const [availableBrowsers, setAvailableBrowsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [configName, setConfigName] = useState("");
  const [configUrl, setConfigUrl] = useState("");

  const [refreshingIcon, setRefreshingIcon] = useState(false);

  useEffect(() => {
    invoke<GlobalConfig>("load_global_config").then((cfg) => {
      setGlobalConfig(cfg);
      setViewMode(cfg.viewMode);
    });
  }, []);

  useEffect(() => {
    return () => {
      apps.forEach((app) => {
        if (app.iconUrl) {
          URL.revokeObjectURL(app.iconUrl);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (selectedApp) {
      setConfigName(selectedApp.name);
      setConfigUrl(selectedApp.url);
      setConfigEngine(selectedApp.engine ?? { kind: "webkit" });
    }
  }, [selectedApp]);

  useEffect(() => {
    invoke<AppDetails[]>("load_apps").then(setApps);
  }, []);

  // Load available browsers on mount
  useEffect(() => {
    loadAvailableBrowsers();
  }, []);

  useEffect(() => {
    invoke<string[]>("detect_chromium_browsers")
      .then(setAvailableBrowsers)
      .catch(() => setAvailableBrowsers([]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const updates = await Promise.all(
        apps.map(async (app) => {
          if (app.iconUrl) return app;

          try {
            const bytes = await invoke<number[]>("get_icon_bytes", {
              appId: app.id,
            });

            const blob = new Blob([new Uint8Array(bytes)], {
              type: "image/png",
            });
            const url = URL.createObjectURL(blob);

            return { ...app, iconUrl: url };
          } catch {
            return app;
          }
        })
      );

      if (!cancelled) {
        setApps((prev) =>
          prev.map((app, i) => (app.iconUrl ? app : updates[i]))
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apps.length]);

  const updateGlobalConfig = (patch: Partial<GlobalConfig>) => {
    if (!globalConfig) return;

    const updated = { ...globalConfig, ...patch };
    setGlobalConfig(updated);
    invoke("save_global_config", { config: updated });
  };

  const prettyEngineName = (engine?: Engine) => {
    if (!engine) return "WebKit";

    if (engine.kind === "webkit") {
      return "WebKit";
    }

    if (engine.kind === "chromium") {
      return `Chromium • ${prettyBrowserName(engine.browser)}`;
    }

    return "Unknown";
  };

  const loadAvailableBrowsers = async () => {
    try {
      const browsers = await invoke<string[]>("detect_chromium_browsers");
      setAvailableBrowsers(browsers);
    } catch (err) {
      console.error("Failed to load browsers:", err);
      setAvailableBrowsers([]);
    }
  };

  const handleGenerate = () => {
    if (!url) return;
    setShowDetailsForm(true);
  };

  const handleSaveApp = async () => {
    if (!appName.trim()) return;
    setLoading(true);
    const id = Date.now().toString();

    const app = {
      id,
      name: appName.trim(),
      url,
      description: appDescription.trim(),
      created_at: Date.now(),
      engine: globalConfig?.defaultEngine ?? { kind: "webkit" },
    };

    try {
      await invoke("fetch_site_icon", {
        appId: app.id,
        url: app.url,
      });

      await invoke("save_app", {
        app: {
          ...app,
          folder: "",
        },
      });

      const updatedApps = await invoke<AppDetails[]>("load_apps");
      setApps(updatedApps);

      setUrl("");
      setAppName("");
      setAppDescription("");
      setShowDetailsForm(false);
    } catch (error) {
      console.error("Failed to save app:", error);
      alert("Failed to save app.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDetailsForm(false);
    setAppName("");
    setAppDescription("");
  };

  const handleLaunchApp = async (app: AppDetails) => {
    try {
      if (app.engine?.kind === "chromium") {
        await invoke("open_chromium_app_window", {
          title: app.name,
          url: app.url,
          browser: app.engine.browser,
        });
      } else {
        await invoke("open_app_window", {
          label: `app-${Date.now()}`,
          title: app.name,
          url: app.url,
        });
      }
    } catch (error) {
      console.error("Failed to launch app:", error);
      alert(`Failed to launch ${app.name}`);
    }
  };

  const openAppConfig = (app: AppDetails) => {
    if (selectedApp?.id === app.id && showConfig) {
      closeConfig();
    } else {
      setSelectedApp(app);
      setConfigEngine(app.engine ?? { kind: "webkit" });
      setShowConfig(true);
    }
  };

  const closeConfig = () => {
    setShowConfig(false);
    setSelectedApp(null);
  };

  useEffect(() => {
    if (selectedApp) {
      setConfigName(selectedApp.name);
      setConfigUrl(selectedApp.url);
    }
  }, [selectedApp]);

  useEffect(() => {
    invoke<GlobalConfig>("load_global_config").then((cfg) => {
      console.log("Loaded global config:", cfg);
      setGlobalConfig(cfg);
      setViewMode(cfg.viewMode);
    });
  }, []);

  const saveAppConfig = async () => {
    if (!selectedApp) return;

    await invoke("update_app_config", {
      id: selectedApp.id,
      name: configName,
      url: configUrl,
      engine: configEngine,
    });

    const updated = await invoke<AppDetails[]>("load_apps");
    setApps(updated);

    closeConfig();
  };

  return (
    <>
      <div
        className={`select-none cursor-default [&_button]:cursor-pointer h-screen ${theme.root} flex overflow-hidden p-4 gap-2 relative`}
      >
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
        </div>
        {/* Left Panel - Create New App */}
        <div className="w-full lg:w-1/2 overflow-hidden rounded-xl relative">
          <div
            className={`h-full p-6 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col ${theme.panel}`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>
              Create New App
            </h2>

            {!showDetailsForm ? (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <label
                    htmlFor="url"
                    className={`block text-sm font-medium mb-2 ${theme.subText}`}
                  >
                    Enter Website URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="example.com or https://example.com"
                    className={theme.input}
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${theme.buttonPrimary}`}
                >
                  Generate App
                </button>

                <div
                  className={`mt-8 p-4 rounded-lg text-sm ${theme.panelAlt} ${theme.subText}`}
                >
                  <p className="mb-2">
                    <strong>How it works:</strong>
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Enter any website URL</li>
                    <li>Add app name and description</li>
                    <li>Choose default browser engine</li>
                    <li>Launch as native app</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                <div>
                  <label
                    htmlFor="appName"
                    className={`block text-sm font-medium ${theme.text} mb-2`}
                  >
                    App Name
                  </label>
                  <input
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="App Name"
                    className={theme.input}
                  />
                </div>
                <div>
                  <label
                    htmlFor="appName"
                    className={`block text-sm font-medium ${theme.text} mb-2`}
                  >
                    Description (optional)
                  </label>
                  <textarea
                    id="appDescription"
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    placeholder="Give it a description..."
                    rows={3}
                    className={theme.input}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveApp}
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${theme.buttonPrimary}`}
                  >
                    {loading ? "Saving..." : "Save App"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 ${theme.buttonSecondary}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Config Panel */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-full p-6 ${
              theme.panel
            } backdrop-blur-xl rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ${
              showConfig ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {showConfig && selectedApp && (
              <>
                <div className="flex justify-between items-start mb-6 mt-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>
                      App Configuration
                    </h2>
                    <p className={`text-sm ${theme.subText} mt-1`}>
                      {selectedApp.name}
                    </p>
                  </div>
                  <button
                    onClick={closeConfig}
                    className={`p-2 rounded-lg transition-colors ${theme.listConfigButton}`}
                  >
                    <svg
                      className={`w-5 h-5 ${theme.listConfigButtonText}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6 flex-1 my-3 overflow-y-auto">
                  <div className="space-y-4">
                    {/* App Name */}
                    <div>
                      <label
                        className={`block text-sm font-medium ${theme.subText} mb-2`}
                      >
                        App Name
                      </label>
                      <input
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        className={`${theme.input}`}
                        placeholder="My Cool App"
                      />
                    </div>

                    {/* App URL */}
                    <div>
                      <label
                        className={`block text-sm font-medium ${theme.subText} mb-2`}
                      >
                        App URL
                      </label>
                      <input
                        value={configUrl}
                        onChange={(e) => setConfigUrl(e.target.value)}
                        className={`${theme.input}`}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${theme.subText} mb-2`}
                    >
                      Browser Engine
                    </label>

                    <div className="relative">
                      <select
                        value={
                          configEngine.kind === "webkit"
                            ? "webkit"
                            : `chromium:${configEngine.browser}`
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "webkit") {
                            setConfigEngine({ kind: "webkit" });
                          } else {
                            const [, browser] = value.split(":");
                            setConfigEngine({
                              kind: "chromium",
                              browser,
                            });
                          }
                        }}
                        className={`${theme.input}`}
                      >
                        {/* WebView */}
                        <option value="webkit">WebView (Default)</option>

                        {/* Chromium browsers */}
                        {availableBrowsers.length > 0 && (
                          <optgroup label="Chromium browsers">
                            {availableBrowsers.map((b) => (
                              <option key={b} value={`chromium:${b}`}>
                                {prettyBrowserName(b)}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>

                      <svg
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.selectArrow} pointer-events-none`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={saveAppConfig}
                      className={`w-full py-2 px-4 rounded-lg transition-colors font-medium ${theme.buttonPrimary}`}
                    >
                      Save Configuration
                    </button>
                  </div>

                  <div className="pt-2">
                    <div className="flex gap-2">
                      <button
                        disabled={refreshingIcon}
                        onClick={async () => {
                          if (!selectedApp || refreshingIcon) return;

                          setRefreshingIcon(true);

                          try {
                            await invoke("refresh_site_icon", {
                              appId: selectedApp.id,
                              url: selectedApp.url,
                            });

                            const bytes = await invoke<number[]>(
                              "get_icon_bytes",
                              {
                                appId: selectedApp.id,
                              }
                            );

                            const blob = new Blob([new Uint8Array(bytes)], {
                              type: "image/png",
                            });
                            const newUrl = URL.createObjectURL(blob);

                            setApps((prev) =>
                              prev.map((app) => {
                                if (app.id !== selectedApp.id) return app;

                                if (app.iconUrl) {
                                  URL.revokeObjectURL(app.iconUrl);
                                }

                                return { ...app, iconUrl: newUrl };
                              })
                            );
                          } catch (err) {
                            console.error("Icon refresh failed:", err);
                            alert("Failed to refresh icon");
                          } finally {
                            setRefreshingIcon(false);
                          }
                        }}
                        className={`flex-1 py-2 rounded-lg disabled:opacity-50 transition-colors font-medium ${theme.buttonSecondary}`}
                      >
                        {refreshingIcon ? "Refreshing..." : "Refresh Icon"}
                      </button>

                      <label className="flex-1 block">
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const bytes = new Uint8Array(
                              await file.arrayBuffer()
                            );

                            await invoke("save_app_icon", {
                              appId: selectedApp.id,
                              iconBytes: Array.from(bytes),
                            });

                            const blob = new Blob([bytes], {
                              type: "image/png",
                            });
                            const url = URL.createObjectURL(blob);

                            setApps((prev) =>
                              prev.map((app) => {
                                if (app.id !== selectedApp.id) return app;

                                if (app.iconUrl) {
                                  URL.revokeObjectURL(app.iconUrl);
                                }

                                return { ...app, iconUrl: url };
                              })
                            );
                          }}
                        />
                        <span
                          className={`w-full block text-center py-2 rounded-lg transition-colors font-medium ${theme.buttonSecondary}`}
                        >
                          Upload Icon
                        </span>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`pt-4 border-t ${
                      globalConfig?.theme === "dark"
                        ? "border-gray-700/50"
                        : "border-gray-300/50"
                    }`}
                  >
                    <button
                      onClick={async () => {
                        if (
                          !confirm(
                            `Delete ${selectedApp.name}? This cannot be undone.`
                          )
                        )
                          return;

                        await invoke("delete_app", { id: selectedApp.id });
                        const updated = await invoke<AppDetails[]>("load_apps");
                        setApps(updated);
                        closeConfig();
                      }}
                      className="w-full bg-red-600/90 hover:bg-red-700 text-white py-2 rounded-lg transition-colors font-medium"
                    >
                      Remove App
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`flex-1 pt-4 p-6 backdrop-blur-xl rounded-xl shadow-2xl ml-1.5 ${theme.panel}`}
        >
          <div className="mb-6 flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${theme.text}`}>
              Your Apps ({apps.length})
            </h1>

            <div className="flex items-center gap-4">
              {/* Default Engine Selector */}
              <div className="relative">
                <select
                  value={
                    globalConfig?.defaultEngine.kind === "webkit"
                      ? "webkit"
                      : `chromium:${globalConfig?.defaultEngine.browser}`
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    let engine: Engine;
                    if (value === "webkit") {
                      engine = { kind: "webkit" };
                    } else {
                      const [, browser] = value.split(":");
                      engine = { kind: "chromium", browser };
                    }

                    const updated = { ...globalConfig!, defaultEngine: engine };
                    setGlobalConfig(updated);
                    invoke("save_global_config", { config: updated });
                  }}
                  className={theme.inputChoose}
                >
                  {/* WebView option */}
                  <option value="webkit">WebView</option>

                  {/* Chromium browsers */}
                  {availableBrowsers.length > 0 && (
                    <optgroup label="Chromium browsers">
                      {availableBrowsers.map((b) => (
                        <option key={b} value={`chromium:${b}`}>
                          {prettyBrowserName(b)}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.selectArrow} pointer-events-none`}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* View Mode Toggle */}
              <div className={`flex ${theme.toggle} rounded-lg p-1`}>
                <button
                  onClick={() => {
                    setViewMode("grid");
                    updateGlobalConfig({ viewMode: "grid" });
                  }}
                  className={`p-1 rounded transition-colors ${
                    viewMode === "grid"
                      ? theme.toggleButtonSelected
                      : theme.toggleButtonUnselected
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setViewMode("list");
                    updateGlobalConfig({ viewMode: "list" });
                  }}
                  className={`p-1 rounded transition-colors ${
                    viewMode === "list"
                      ? theme.toggleButtonSelected
                      : theme.toggleButtonUnselected
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h18v-2H3v2zm0 5h18v-2H3v2zM3 6v2h18V6H3z" />
                  </svg>
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  if (!globalConfig) return;

                  const updated = {
                    ...globalConfig,
                    theme: globalConfig.theme === "dark" ? "light" : "dark",
                  } as GlobalConfig;

                  setGlobalConfig(updated);
                  invoke("save_global_config", { config: updated });
                }}
                className={theme.toggleButton}
                title="Toggle theme"
              >
                {globalConfig?.theme === "dark" ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {apps.length === 0 ? (
            <div
              className={`flex items-center justify-center h-96 rounded-lg border-2 border-dashed ${theme.panelAlt} ${theme.subText}`}
            >
              <p className="text-center">
                No apps created yet.
                <br />
                Generate your first app to get started!
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className={`group p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer relative ${theme.appCard}`}
                >
                  <div onClick={() => handleLaunchApp(app)}>
                    <div className="aspect-square rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {app.iconUrl ? (
                        <img
                          src={app.iconUrl}
                          alt={app.name}
                          className="w-18 h-18 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">${app.name[0].toUpperCase()}</div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                          {app.name[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3
                      className={`font-semibold ${theme.text} text-center truncate`}
                    >
                      {app.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => openAppConfig(app)}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${theme.configButton}`}
                  >
                    <svg
                      className={`w-4 h-4 ${theme.configButtonText}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className={`p-4 rounded-lg hover:shadow-md transition-all flex items-center gap-4 group ${theme.appCard}`}
                >
                  <div
                    onClick={() => handleLaunchApp(app)}
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {app.iconUrl ? (
                        <img
                          src={app.iconUrl}
                          alt={app.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">${app.name[0].toUpperCase()}</div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                          {app.name[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${theme.text} truncate`}>
                        {app.name}
                      </h3>
                      <p className={`text-sm ${theme.subText} truncate`}>
                        {app.description || app.url}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {prettyEngineName(app.engine)} • Created{" "}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openAppConfig(app)}
                    className={`p-2 rounded-lg transition-colors ${theme.listConfigButton}`}
                  >
                    <svg
                      className={`w-5 h-5 ${theme.listConfigButtonText}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Wrapper;
