import DOM from "../core/dom.js";

export function responsiveWebsite() {
  if (window.innerWidth < 768) {
    document.documentElement.classList.add("mobile");
    setSidebar(false);
  } else {
    document.documentElement.classList.remove("mobile");
    setSidebar(true);
  }
}

function setSidebar(open) {
    document.documentElement.classList.toggle("isSidebar", open);

    DOM.overlay.classList.toggle("show", open);
    DOM.overlay.onclick = open ? () => setSidebar(false) : null;
    DOM.mainContent.inert = open;

    DOM.closeSidebarBtn.style.display = open ? "flex" : "none";
    DOM.hamburgerBtn.style.display = open ? "none" : "flex";
}

DOM.hamburgerBtn.addEventListener("click", () => setSidebar(true));

DOM.closeSidebarBtn.addEventListener("click", () => setSidebar(false));

window.addEventListener("resize", responsiveWebsite);
responsiveWebsite();