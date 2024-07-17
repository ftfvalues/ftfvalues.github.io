const main = document.getElementById("main");
const edit = document.getElementById("edit");
const info = document.getElementById("info");
const raritycolors = {"Unique":"#ffffff","Common":"#00ff00","Rare":"#00ffff","Epic":"#ff00ff","Legendary":"#ffff00"}
const tagcolors = {"Anniversary":"#ff0000","Christmas":"#ffffff","Halloween":"#ffa900","St. Patrick's":"#0dc923","Valentine's":"#ff4c7e","VIP":"#ffd646"}
const statuscolors = {"EOF":"#ffffff","OF":"#8000ff","H":"#0000ff","G":"#00ff00","A":"#ffff00","L":"#ff8000","T":"#ff0000"}
const statusstrs = {"EOF":"Extremely overpaid for","OF":"Overpaid for","H":"High","G":"Good","A":"Average","L":"Low","T":"Trash"}
const editor = {
    container: document.getElementById("container"),
    title: document.getElementById("editor.title"),
    exit: document.getElementById("editor.exit"),
    value: document.getElementById("editor.value"),
    demand: document.getElementById("editor.demand"),
    status: document.getElementById("editor.status"),
    save: document.getElementById("editor.save"),
};
let items;
function getItemIndexById(id) {
    for (let i = 0; i < items.data.length; i++) {
        if (items.data[i].id == id) {
            return i;
        };
    };
    return null;
};
let itemIndex;
function editItem(id) {
    itemIndex = getItemIndexById(id);
    const item = items.data[itemIndex];
    if (items.data[itemIndex]) {
        document.body.style.overflow = "hidden";
        editor.title.innerHTML = "Editing " + item.name;
        editor.exit.href = "#" + item.id;
        editor.value.value = item.value;
        editor.demand.value = item.demand;
        editor.status.value = item.status;
        editor.container.style.display = "block";
    } else {
        alert("error: not found")
    };
};
function exitEditor() {
    editor.container.style.display = "none";
    document.body.style.overflow = "visible";
    editor.title.innerHTML = "Editing ";
    itemIndex = null;
    editor.value.value = "";
    editor.demand.value = "";
    editor.status.value = "";
};
editor.save.addEventListener("click", function () {
    const item = items.data[itemIndex];
    window.location.href = "#" + item.id;
    editor.container.style.display = "none";
    document.body.style.overflow = "visible";
    editor.title.innerHTML = "Editing ";
    item.value = editor.value.value;
    item.demand = editor.demand.value;
    item.status = editor.status.value;
    const rarityStyle = item.rarity ? ` style="color: ${raritycolors[item.rarity]};"` : ""
    const tagImg = item.tag ? `&nbsp;<img src="./images/tags/${item.tag}.png">` : ""
    const tagStyle = item.tag ? ` style="color: ${tagcolors[item.tag]};"` : ""
    const statusStyle = item.status ? ` style="color: ${statuscolors[item.status]};"` : ""
    document.getElementById(item.id).innerHTML = `<img src="${item.thumbnail}"><div class="text"><span${rarityStyle} class="iconText"><b style="color: rgb(217, 217, 218);">Name:&nbsp;</b>${item.name}${tagImg}</span><br><span${rarityStyle}><b style="color: rgb(217, 217, 218);">Rarity: </b>${item.rarity}</span><br><span${tagStyle} class="iconText"><b style="color: rgb(217, 217, 218);">Tag:&nbsp;</b>${item.tag ? item.tag : "Classic"}${tagImg}</span><br><span><b>Value: </b>${item.value}</span><br><span><b>Demand: </b>${item.demand}</span><br><span${statusStyle}><b style="color: rgb(217, 217, 218);">Status: </b>${statusstrs[item.status]}</span><br><a href="#" onclick="editItem('${item.id}')">EDIT</a></div>`;
    itemIndex = null;
    editor.value.value = "";
    editor.demand.value = "";
    editor.status.value = "";
})
function joinAllItems(data) {
    return new Promise(function(resolve) {
        items = {data:[]};
        for (rarity of Object.keys(data)) {
            for (item of data[rarity]) {
                items.data.push(item);
            };
        };
        resolve();
    });
};
edit.addEventListener("change", function() {
    if (!items) document.getElementById("delete").remove();
    items = null;
    main.innerHTML = "";
    info.innerHTML = "Loading, please wait...<br>"
    $.ajax({
        url: `./json/${edit.value}.json`,
        success: async function(data) {
            await joinAllItems(data);
            for (let i = 0; i < items.data.length; i++) {
                const item = items.data[i];
                const rarityStyle = item.rarity ? ` style="color: ${raritycolors[item.rarity]};"` : ""
                const tagImg = item.tag ? `&nbsp;<img src="./images/tags/${item.tag}.png">` : ""
                const tagStyle = item.tag ? ` style="color: ${tagcolors[item.tag]};"` : ""
                const statusStyle = item.status ? ` style="color: ${statuscolors[item.status]};"` : ""
                main.innerHTML += `<div class="item" id="${item.id}"><img src="${item.thumbnail}"><div class="text"><span${rarityStyle} class="iconText"><b style="color: rgb(217, 217, 218);">Name:&nbsp;</b>${item.name}${tagImg}</span><br><span${rarityStyle}><b style="color: rgb(217, 217, 218);">Rarity: </b>${item.rarity}</span><br><span${tagStyle} class="iconText"><b style="color: rgb(217, 217, 218);">Tag:&nbsp;</b>${item.tag ? item.tag : "Classic"}${tagImg}</span><br><span><b>Value: </b>${item.value}</span><br><span><b>Demand: </b>${item.demand}</span><br><span${statusStyle}><b style="color: rgb(217, 217, 218);">Status: </b>${statusstrs[item.status]}</span><br><a href="#" onclick="editItem('${item.id}')">EDIT</a></div></div>`
            };
            info.innerHTML = ""
        }
    });
});
function jsonify() {
    return new Promise(function(resolve) {
        let obj = {"Common":[],"Rare":[],"Epic":[],"Legendary":[]};
        for (let i = 0; i <= items.data.length; i++) {
            if (i == items.data.length) return resolve(JSON.stringify(obj));
            const item = items.data[i];
            obj[item.rarity].push(item);
        };
    });
};
document.getElementById("download").addEventListener("click", async function() {
    const oldInfo = info.innerHTML;
    if (items) {
        const jsonStr = await jsonify();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = edit.value + '.json';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        info.innerHTML = "Success!";
        setTimeout(function() { info.innerHTML = oldInfo; }, 1000);
    };
});