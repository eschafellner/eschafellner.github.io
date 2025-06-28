// What are you looking for? :-)

const correctHash = "fc3c6c7f48c7522f3beea806fd3f6de0b54e80e1882f2a0012ff39dbb20b8c6d"; // SHA-256 von "2005"
const encodedEmail = "c2FsemFtdEBoYWFnLW5ldHdvcnguYXQ="; // Base64 von salzamt@haag-networx.at
const inputIds = ["digit1", "digit2", "digit3", "digit4"];

document.addEventListener("DOMContentLoaded", () => {
  // Fokus-Wechsel einrichten
  inputIds.forEach((id, index) => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      if (el.value.length === 1 && index < inputIds.length - 1) {
        document.getElementById(inputIds[index + 1]).focus();
      }
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && el.value.length === 0 && index > 0) {
        document.getElementById(inputIds[index - 1]).focus();
      }
    });
  });

  // Prüfen-Button aktivieren
  document.querySelector("button").addEventListener("click", checkCode);
});

async function checkCode() {
  const values = inputIds.map(id => document.getElementById(id).value.trim());

  if (values.some(v => v === "")) {
    document.getElementById("result").textContent = "Bitte vier Ziffern eingeben.";
    return;
  }

  const code = values.join("");
  const hash = await sha256(code);

  if (hash === correctHash) {
    const email = decodeEmail(encodedEmail);
    document.getElementById("result").textContent = email;
  } else {
    document.getElementById("result").textContent = "Falscher Code.";
  }
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function decodeEmail(encoded) {
  return atob(encoded);
}
