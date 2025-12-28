use std::process::Command;
use std::path::PathBuf;
use crate::utils::url::normalize_url;
use crate::utils::browser::detect_chromium_browser;

#[tauri::command]
pub fn open_chromium_app_window(
    title: String,
    url: String,
    browser: Option<String>
) -> Result<(), String> {
    let final_url = normalize_url(url)?;
    let home = std::env::var("HOME").map_err(|_| "No HOME")?;

    let mut profile_dir = PathBuf::from(home);
    profile_dir.push(".local/share/kyvyrn/Apps");
    profile_dir.push(&title);

    std::fs::create_dir_all(&profile_dir).map_err(|e| e.to_string())?;

    let browser_cmd = browser.unwrap_or(detect_chromium_browser()?);

    Command::new(browser_cmd)
        .arg(format!("--app={}", final_url))
        .arg(format!("--user-data-dir={}", profile_dir.display()))
        .arg(format!("--class={}", title))
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}
