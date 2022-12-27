const colorPickerBtn = document.querySelector("#color-picker");
const colorList = document.querySelector(".all-colors");
const clearAllBtn = document.querySelector(".clear-all");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");
const copyColor = elem => {
    navigator.clipboard.writeText(elem.dataset.color);
    elem.innerText = "Copied!";
    setTimeout(() => elem.innerText = elem.dataset.color, 1000);
};
const showColors = () => {
    if (!pickedColors.length) return;
    colorList.innerHTML = pickedColors.map(color => `
    <li class="color">
        <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
        <span class="value" data-color="${color}">${color}</span>
    </li>
    `).join("");
    document.querySelector(".picked-colors").classList.remove("hide");
    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild));
    });
};
showColors();
const activateEyeDropper = async () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            if (!pickedColors.includes(sRGBHex)) {
                navigator.clipboard.writeText(sRGBHex);
                pickedColors.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                showColors();
            }
        } catch (error) {
            console.error(error);
        }
    }, 10);
    document.body.style.display = "block";
};
const deleteAllPickedColors = () => {
    pickedColors.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");
};
clearAllBtn.addEventListener("click", deleteAllPickedColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);