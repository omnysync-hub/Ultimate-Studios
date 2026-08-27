const preloader = document.getElementById("preloader");
const heroPage = document.querySelector(".hero-page");

const PRELOADER_MS = 2400;

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("preloader-hide");
    heroPage.classList.add("revealed");
    document.body.style.overflow = "auto";

    setTimeout(() => {
      preloader.remove();
    }, 850);
  }, PRELOADER_MS);
});
