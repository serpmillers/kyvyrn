use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, Window};

// handles URLs with no https
fn normalize_url(input: String) -> Result<String, String> {
  let trimmed = input.trim();

  if trimmed.starts_with("http://") || trimmed.starts_with("https://") {
    Ok(trimmed.to_string())
  } else {
    Ok(format!("https://{}", trimmed))
  }
}

fn open_app_window(window: Window, label: String, url: String) -> Result<(), String> {
  let app_handle = window.app_handle();
  let final_url = normalize_url(url)?;

  WebviewWindowBuilder::new(
    app_handle,
    label,
    WebviewUrl::External(
      final_url.parse().map_err(|_| "Invalid URL")?
    ),
  )
  .title("Wrapped App")
  .inner_size(1200.0, 800.0)
  .resizable(true)
  .build()
  .map_err(|e| e.to_string())?;

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_app_window])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
