/** Runs before paint to avoid theme flash. Default: dark (studio brand). */
export function ThemeScript() {
  const code = `
(function () {
  try {
    var stored = localStorage.getItem("uc-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`.trim();

  return <script id="uc-theme-init" dangerouslySetInnerHTML={{ __html: code }} />;
}
