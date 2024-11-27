const yeniKutu = document.querySelector(".add-box"),
acilirKutu = document.querySelector(".acilir-kutu"),
popupBaslik = acilirKutu.querySelector("header p"),
kapatIcon = acilirKutu.querySelector("header i"),
baslikTxt = acilirKutu.querySelector("input"),
aciklamaTxt = acilirKutu.querySelector("textarea"),
ekleBtn = acilirKutu.querySelector("button");

const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz","Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const notlar = JSON.parse(localStorage.getItem("notlar") || "[]");
let guncelmi = false, updateId;

yeniKutu.addEventListener("click", () => {
popupBaslik.innerText = "Yeni Not";
ekleBtn.innerText = "Not Ekle";
acilirKutu.classList.add("show");
document.querySelector("body").style.overflow = "hidden";
if(window.innerWidth > 660) baslikTxt.focus();
});

kapatIcon.addEventListener("click", () => {
guncelmi = false;
baslikTxt.value = aciklamaTxt.value = "";
acilirKutu.classList.remove("show");
document.querySelector("body").style.overflow = "auto";
});

function notGoster() {
if(!notlar) return;
document.querySelectorAll(".note").forEach(li => li.remove());
notlar.forEach((note, id) => {
let filterDesc = note.description.replaceAll("\n", '<br/>');
let liTag = `<li class="note">
            <div class="details">
                <p>${note.title}</p>
                <span>${filterDesc}</span>
            </div>
            <div class="bottom-content">
                <span>${note.date}</span>
                <div class="settings">
                    <i onclick="menuGoster(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="menu">
                        <li onclick="notGuncelle(${id}, '${note.title}', '${filterDesc}')"><i class="fa-solid fa-pen"></i>Düzenle</li>
                        <li onclick="notSil(${id})"><i class="fa-solid fa-trash-can"></i>Sil</li>
                    </ul>
                </div>
            </div>
        </li>`;
yeniKutu.insertAdjacentHTML("afterend", liTag);
});
}
notGoster();

function menuGoster(elem) {
elem.parentElement.classList.add("show");
document.addEventListener("click", e => {
if(e.target.tagName != "I" || e.target != elem) {
elem.parentElement.classList.remove("show");
}
});
}

function notSil(noteId) {
let confirmDel = confirm("Not Silinecek. Eminmisin?");
if(!confirmDel) return;
notlar.splice(noteId, 1);
localStorage.setItem("notlar", JSON.stringify(notlar));
notGoster();
}

function notGuncelle(noteId, title, filterDesc) {
let description = filterDesc.replaceAll('<br/>', '\r\n');
updateId = noteId;
guncelmi = true;
yeniKutu.click();
baslikTxt.value = title;
aciklamaTxt.value = description;
popupBaslik.innerText = "Notu Güncelle";
ekleBtn.innerText = "Notu Güncelle";
}

ekleBtn.addEventListener("click", e => {
e.preventDefault();
let title = baslikTxt.value.trim(),
description = aciklamaTxt.value.trim();

if(title || description) {
let currentDate = new Date(),
month = aylar[currentDate.getMonth()],
day = currentDate.getDate(),
year = currentDate.getFullYear();

let noteInfo = {title, description, date: `${day} ${month} ${year}`}
if(!guncelmi) {
notlar.push(noteInfo);
} else {
guncelmi = false;
notlar[updateId] = noteInfo;
}
localStorage.setItem("notlar", JSON.stringify(notlar));
notGoster();
kapatIcon.click();
}
});