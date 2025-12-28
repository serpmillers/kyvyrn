use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, Window};
use tauri::webview::NewWindowResponse;
use crate::utils::url::normalize_url;

#[tauri::command]
pub fn open_app_window(
  window: Window,
  label: String,
  title: String,
  url: String
) -> Result<(), String> {

  let app_handle = window.app_handle();
  let final_url = normalize_url(url)?;

  WebviewWindowBuilder::new(
    app_handle,
    label,
    WebviewUrl::External(final_url.parse().map_err(|_| "Invalid URL")?)
  )
  .on_new_window(|_, _| NewWindowResponse::Allow)
  .title(&title)
  .inner_size(1200.0, 800.0)
  .resizable(true)
  .build()
  .map_err(|e| e.to_string())?;

  Ok(())
}
