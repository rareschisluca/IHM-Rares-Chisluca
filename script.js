/**
 * RARES CHISLUCA - PORTFOLIO & CV INTERAKTIVITET
 * Funktioner:
 * 1. Färgtema med LocalStorage (Mörkt / Ljust läge)
 * 2. Responsiv mobilmeny med hamburgarknapp
 * 3. Scrollspy för aktiv menyindikator (inkl. Min utbildning)
 * 4. Flytande Till-toppen knapp
 * 5. Snabbkopiering av e-postadress
 * 6. Formulärbekräftelse
 */

document.addEventListener("DOMContentLoaded", () => {
    /* ----------------------------------------------------
       1. Färgtema (Mörkt / Ljust läge med LocalStorage)
       ---------------------------------------------------- */
    const temaknapp = document.querySelector("#tema");
    const temaText = temaknapp ? temaknapp.querySelector(".tema-text") : null;
    const temaIkon = temaknapp ? temaknapp.querySelector(".tema-ikon") : null;

    function uppdateraTemaknapp(arMorkt) {
        if (!temaknapp) return;
        if (arMorkt) {
            if (temaText) temaText.textContent = "Ljust läge";
            if (temaIkon) temaIkon.textContent = "☀️";
            temaknapp.setAttribute("aria-label", "Växla till ljust läge");
        } else {
            if (temaText) temaText.textContent = "Mörkt läge";
            if (temaIkon) temaIkon.textContent = "🌓";
            temaknapp.setAttribute("aria-label", "Växla till mörkt läge");
        }
    }

    const sparatTema = localStorage.getItem("portfolio_tema");
    const foredrarMorkt = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (sparatTema === "morkt" || (!sparatTema && foredrarMorkt)) {
        document.body.classList.add("morkt");
        uppdateraTemaknapp(true);
    } else {
        document.body.classList.remove("morkt");
        uppdateraTemaknapp(false);
    }

    if (temaknapp) {
        temaknapp.addEventListener("click", () => {
            const blirMorkt = document.body.classList.toggle("morkt");
            localStorage.setItem("portfolio_tema", blirMorkt ? "morkt" : "ljust");
            uppdateraTemaknapp(blirMorkt);
        });
    }

    /* ----------------------------------------------------
       2. Mobilmeny: Hamburgarknapp & nedfällning
       ---------------------------------------------------- */
    const mobilknapp = document.querySelector("#mobilmeny-knapp");
    const huvudnav = document.querySelector("#huvudnav");
    const navLankar = document.querySelectorAll(".nav-lank, .knapp-huvudmeny");

    if (mobilknapp && huvudnav) {
        function toggleMeny(oppna) {
            const skaOppnas = typeof oppna === "boolean" ? oppna : !huvudnav.classList.contains("oppen");
            huvudnav.classList.toggle("oppen", skaOppnas);
            mobilknapp.setAttribute("aria-expanded", skaOppnas ? "true" : "false");
            mobilknapp.setAttribute("aria-label", skaOppnas ? "Stäng navigationsmeny" : "Öppna navigationsmeny");
        }

        mobilknapp.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMeny();
        });

        navLankar.forEach(lank => {
            lank.addEventListener("click", () => {
                if (huvudnav.classList.contains("oppen")) {
                    toggleMeny(false);
                }
            });
        });

        document.addEventListener("click", (e) => {
            if (huvudnav.classList.contains("oppen") && !huvudnav.contains(e.target) && !mobilknapp.contains(e.target)) {
                toggleMeny(false);
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && huvudnav.classList.contains("oppen")) {
                toggleMeny(false);
                mobilknapp.focus();
            }
        });
    }

    /* ----------------------------------------------------
       3. ScrollSpy: Markera aktuell sektion i menyn
       ---------------------------------------------------- */
    const sektioner = document.querySelectorAll("section[id]");
    const menyLankar = document.querySelectorAll(".nav-lista .nav-lank");

    function uppdateraAktivMeny() {
        const scrollPosition = window.scrollY + 120;

        sektioner.forEach(sektion => {
            const sektionTopp = sektion.offsetTop;
            const sektionHojd = sektion.offsetHeight;
            const sektionId = sektion.getAttribute("id");

            if (scrollPosition >= sektionTopp && scrollPosition < sektionTopp + sektionHojd) {
                menyLankar.forEach(lank => {
                    lank.classList.remove("aktiv");
                    if (lank.getAttribute("href") === `#${sektionId}`) {
                        lank.classList.add("aktiv");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", uppdateraAktivMeny, { passive: true });
    // Kör direkt vid sidladdning för att sätta rätt aktiv meny
    uppdateraAktivMeny();

    /* ----------------------------------------------------
       4. Flytande Till-toppen knapp
       ---------------------------------------------------- */
    const tillToppenKnapp = document.querySelector("#till-toppen-knapp");

    if (tillToppenKnapp) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
                tillToppenKnapp.classList.add("synlig");
            } else {
                tillToppenKnapp.classList.remove("synlig");
            }
        }, { passive: true });

        tillToppenKnapp.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ----------------------------------------------------
       6. Kopiera e-postadress med visuell bekräftelse
       ---------------------------------------------------- */
    const kopieraKnapp = document.querySelector("#kopiera-epost");
    const kopieraStatus = document.querySelector("#kopiera-status");
    const epostLank = document.querySelector("#epost-lank");

    if (kopieraKnapp && kopieraStatus && epostLank) {
        kopieraKnapp.addEventListener("click", async () => {
            const epost = epostLank.textContent.trim();
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(epost);
                } else {
                    const tempInput = document.createElement("input");
                    tempInput.value = epost;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);
                }

                kopieraStatus.textContent = "Kopierad!";
                kopieraKnapp.textContent = "✓ Klar";
                setTimeout(() => {
                    kopieraStatus.textContent = "";
                    kopieraKnapp.textContent = "Kopiera";
                }, 2500);
            } catch (err) {
                kopieraStatus.textContent = "Kunde inte kopiera";
                setTimeout(() => {
                    kopieraStatus.textContent = "";
                }, 2000);
            }
        });
    }

    /* ----------------------------------------------------
       7. Formulärhantering med snabb feedback
       ---------------------------------------------------- */
    const kontaktFormular = document.querySelector("#kontakt-formular");
    const formularStatus = document.querySelector("#formular-status");

    if (kontaktFormular && formularStatus) {
        kontaktFormular.addEventListener("submit", (e) => {
            // Låt formuläret skicka mailto men visa en trevlig bekräftelse på sidan
            formularStatus.textContent = "Öppnar ditt e-postprogram med förberett meddelande...";
            formularStatus.classList.add("lyckades");
            setTimeout(() => {
                formularStatus.textContent = "Tack! Om inte ditt e-postprogram öppnades, mejla direkt till rares0309@yahoo.com.";
            }, 3000);
        });
    }
});