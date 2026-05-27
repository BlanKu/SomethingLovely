const PIN = "2905";

let mood = "";
let food = "";
let drink = "";

const inputs = document.querySelectorAll(".pin-digit");
const error = document.getElementById("pin-error");

inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");

        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }

        checkPin();
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

function checkPin() {
    const value = Array.from(inputs).map(i => i.value).join("");

    if (value.length === 4) {
        if (value === PIN) {
            unlock();
        } else {
            error.innerText = "Ups! Coś chyba jest nie tak";

            setTimeout(() => {
                inputs.forEach(i => i.value = "");
                inputs[0].focus();
                error.innerText = "";
            }, 900);
        }
    }
}

// Funkcja unlock obsługująca dwuetapowe intro (każdy krok po 5 sekund)
function unlock() {
    showScreen("intro"); 
    
    // Po 5 sekundach następuje płynna zmiana pierwszego tekstu na drugi
    setTimeout(() => {
        const text1 = document.getElementById("intro-text-1");
        const text2 = document.getElementById("intro-text-2");
        
        if(text1 && text2) {
            text1.classList.remove("active");
            
            setTimeout(() => {
                text2.classList.add("active");
            }, 400);
        }
    }, 5000);

    // Po kolejnych 5 sekundach (łącznie 10s od wpisania PINu) aplikacja przechodzi do pytań
    setTimeout(() => {
        showScreen(1);
    }, 10000); 
}

/* 🔥 SYSTEM PŁYNNEGO PRZEJŚCIA */
function showScreen(n) {
    const current = document.querySelector(".screen.active");
    const next = document.getElementById(`screen-${n}`) || document.getElementById(`${n}-screen`);

    if (current === next) return;

    if (current) {
        current.style.opacity = "0";
        current.style.transform = "translateY(-20px)";

        setTimeout(() => {
            current.classList.remove("active");
            current.style.transform = ""; 

            next.classList.add("active");

            requestAnimationFrame(() => {
                next.style.opacity = "1";
            });

        }, 400); 
    } else {
        next.classList.add("active");
    }
}

function nextMood(val) {
    mood = val;
    showScreen(2);
}

function nextFood(val) {
    food = val;
    showScreen(3);
}

function nextDrink(val) {
    drink = val;
    showScreen("final");
    sendWebhook();
}

function sendWebhook() {
    // 🔥 Wklejony prawidłowy adres URL webhooka Discorda
    const webhookURL = "https://discord.com/api/webhooks/1509201731077148752/dmTyNY8g0aJS38sCkqLq9k2kivCmtgHlob39xLzDdyc2QV7vedjrHc-9GGkrJT49ZOHu";

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `🚨 ALERT RANDKOWY 🚨

😎 Humor: ${mood}
🍽️ Kuchnia: ${food}
☕ Napój: ${drink}

🕒 ${new Date().toLocaleTimeString()}

Powodzenia 🫡`
        })
    }).catch(() => {});
}