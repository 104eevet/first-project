const themeButton = document.querySelector(".header__btn");

themeButton.addEventListener("click", () => {
    document.body.dataset.theme =
        document.body.dataset.theme === "dark"
            ? "light"
            : "dark";
});