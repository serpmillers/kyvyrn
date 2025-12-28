use commands::configs::AppRegistry;
use std::collections::HashMap;
use std::sync::Mutex;

mod commands;
mod utils;
mod net;

fn main() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(
            tauri::generate_handler![
                commands::webview::open_app_window,
                commands::chromium::open_chromium_app_window,
                commands::icons::fetch_site_icon,
                commands::icons::save_app_icon,
                commands::icons::get_app_icon_path,
                commands::icons::get_icon_bytes,
                commands::icons::refresh_site_icon,
                utils::browser::detect_chromium_browsers,
                commands::configs::load_apps,
                commands::configs::save_app,
                commands::configs::update_app,
                commands::configs::update_app_config,
                commands::configs::delete_app,
                commands::global_config::load_global_config,
                commands::global_config::save_global_config
            ]
        )
        .manage(AppRegistry {
            apps: Mutex::new(HashMap::new()),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
