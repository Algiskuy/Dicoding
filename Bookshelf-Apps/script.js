document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("root");
  const navbar = document.createElement("header");
  const textShare = document.createElement("p");
  const share = document.createElement("input");
  const buttonShare = document.createElement("button");
  const formShare = document.createElement("form");
  const divShare = document.createElement("div");
  navbar.setAttribute("id", "nav");
  navbar.append("Bookshelf Apps");
  textShare.classList.add("cariBuku");
  textShare.innerText = "Cari Buku (Opsional)";
  share.setAttribute("id", "share");
  share.setAttribute("placeholder", "Judul Buku");
  formShare.classList.add("formShare");
  divShare.classList.add("BoxShare");
  buttonShare.innerText = "Cari";
  buttonShare.classList.add("buttonCari");
  formShare.append(share, buttonShare);
  divShare.append(textShare, formShare);
  const form = document.createElement("form");
  const inputJudul = document.createElement("input");
  const inputPenulis = document.createElement("input");
  const inputTahun = document.createElement("input");
  const labelCheckbox = document.createElement("label");
  const inputCheckbok = document.createElement("input");
  const divCheckbox = document.createElement("div");
  const button = document.createElement("button");
  const masukan = document.createElement("p");
  masukan.setAttribute("id", "masukan");
  masukan.innerText = "Masukan Buku";
  form.setAttribute("id", "form");
  form.append(masukan);
  inputJudul.setAttribute("id", "judul");
  inputJudul.setAttribute("required", true);
  inputJudul.setAttribute("minlength", "3");
  inputJudul.setAttribute("maxlength", "30");
  inputJudul.setAttribute("placeholder", "Masukan judul buku");
  inputPenulis.setAttribute("id", "penulis");
  inputPenulis.setAttribute("required", true);
  inputPenulis.setAttribute("minlength", "3");
  inputPenulis.setAttribute("maxlength", "30");
  inputPenulis.setAttribute("placeholder", "Masukan nama penulis");
  inputTahun.setAttribute("id", "tahun");
  inputTahun.setAttribute("type", "number");
  inputTahun.setAttribute("min", "1945");
  inputTahun.setAttribute("max", "2076");
  inputTahun.setAttribute("required", true);
  inputTahun.setAttribute("placeholder", "Tahun rilis");
  labelCheckbox.setAttribute("for", "checkbox");
  labelCheckbox.classList.add("label-checkbox");
  labelCheckbox.innerText = "Selesai dibaca";
  inputCheckbok.setAttribute("type", "checkbox");
  inputCheckbok.setAttribute("id", "checkbox");
  divCheckbox.setAttribute("id", "divCheckbox");
  divCheckbox.append(labelCheckbox, inputCheckbok);
  button.setAttribute("id", "kirim");
  button.innerText = "Kirimkan";
  form.append(inputJudul, inputPenulis, inputTahun, divCheckbox, button);
  const divBelumSelesai = document.createElement("div");
  const textBelumSelesai = document.createElement("p");
  const dataBelumSelesai = document.createElement("div");
  textBelumSelesai.innerText = "Belum Selesai Dibaca";
  divBelumSelesai.classList.add("divBelumSelesai");
  dataBelumSelesai.setAttribute("id", "dataBelumSelesai");
  divBelumSelesai.append(textBelumSelesai, dataBelumSelesai);
  const divSelesai = document.createElement("div");
  const textSelesai = document.createElement("p");
  const dataSelesai = document.createElement("div");
  textSelesai.innerText = " Selesai Dibaca";
  divSelesai.setAttribute("id", "selesaiDibaca");
  dataSelesai.setAttribute("id", "dataSelesaiDibaca");
  divSelesai.append(textSelesai, dataSelesai);
  const clock = document.createElement("div");
  clock.setAttribute("id", "clock");
  root.append(navbar, divShare, clock, form, divBelumSelesai, divSelesai);
  setInterval(() => {
    let date = new Date();
    let clock = document.getElementById("clock");
    clock.innerHTML =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }, 1000);
  formShare.addEventListener("input", function (e) {
    e.preventDefault();
    const keyword = share.value.toLowerCase();

    const filteredData = datas.filter((data) => {
      return data.title.toLowerCase().includes(keyword);
    });

    renderFilteredData(filteredData);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    add();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function scrollToNav() {
  const header = document.getElementById("root");
  header.scrollIntoView({ behavior: "smooth" });
}

function renderFilteredData(filteredData) {
  const dataBelumSelesai = document.getElementById("dataBelumSelesai");
  const dataSelesai = document.getElementById("dataSelesaiDibaca");
  dataBelumSelesai.innerHTML = "";
  dataSelesai.innerHTML = "";

  for (const dataItem of filteredData) {
    const dataElement = makeData(dataItem);

    if (!dataItem.isCompleted) {
      dataBelumSelesai.appendChild(dataElement);
    } else {
      dataSelesai.appendChild(dataElement);
    }
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const saveData = localStorage.getItem(STORAGE_KEY);
  let setData = JSON.parse(saveData);
  if (setData !== null) {
    for (const set of setData) {
      datas.push(set);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
let merge;
function add() {
  const inputJudul = document.getElementById("judul").value;
  const inputPenulis = document.getElementById("penulis").value;
  const inputTahun = document.getElementById("tahun").value;
  const toJ = capitalizeFirstLetter(inputJudul);
  const toP = capitalizeFirstLetter(inputPenulis);
  const unikId = generalId();
  const checkbox = document.getElementById("checkbox");
  let newBook = combine(unikId, toJ, toP, inputTahun, false);

  if (checkbox.checked) {
    newBook.isCompleted = true;
  }

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      merge.isCompleted = true;
    } else {
      merge.isCompleted = false;
    }
  });
  merge = combine(unikId, toJ, toP, inputTahun, false);

  if (checkbox.checked) {
    merge.isCompleted = true;
  }

  datas.push(newBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  document.getElementById("judul").value = "";
  document.getElementById("penulis").value = "";
  document.getElementById("tahun").value = "";
  checkbox.checked = false;
}

function generalId() {
  const id = +new Date();
  return id;
}
function combine(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
const datas = [];
const RENDER_EVENT = "render-datas";
const SAVED_EVENT = "saved-datas";
const STORAGE_KEY = "DATA_APPS";

document.addEventListener(RENDER_EVENT, function () {
  const dataBelumSelesai = document.getElementById("dataBelumSelesai");
  const dataSelesai = document.getElementById("dataSelesaiDibaca");
  dataBelumSelesai.innerHTML = "";
  dataSelesai.innerHTML = "";
  for (const dataItem of datas) {
    const dataElement = makeData(dataItem);
    if (!dataItem.isCompleted) {
      dataBelumSelesai.append(dataElement);
    } else {
      dataSelesai.append(dataElement);
    }
  }
});

function makeData(dataItem) {
  const { id, title, author, year, isCompleted } = dataItem;
  const textTitle = document.createElement("h2");
  const textAuthor = document.createElement("p");
  const textYear = document.createElement("p");
  const buttonSelesai = document.createElement("button");
  const combineText = document.createElement("div");
  textTitle.innerText = title;
  textAuthor.innerText = `penulis: ${author}`;
  textYear.innerText = `Tahun: ${year}`;
  buttonSelesai.classList.add("buttonSelesai");
  buttonSelesai.innerText = "Selesai baca";
  combineText.classList.add("combineText");
  combineText.setAttribute("id", `${id}`);
  combineText.append(textTitle, textAuthor, textYear);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum selesai";
    undoButton.classList.add("belum-dibaca");

    undoButton.addEventListener("click", function () {
      undoData(id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit buku";
    editButton.classList.add("edit-buku");

    editButton.addEventListener("click", function () {
      editData(dataItem);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus";
    trashButton.classList.add("hapus-buku");

    trashButton.addEventListener("click", function () {
      removeData(id);
    });

    combineText.append(undoButton, editButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Sudah dibaca";
    checkButton.classList.add("sudah-dibaca");

    checkButton.addEventListener("click", function () {
      addData(id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit buku";
    editButton.classList.add("edit-buku");

    editButton.addEventListener("click", function () {
      editData(dataItem);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus";
    trashButton.classList.add("hapus-buku");

    trashButton.addEventListener("click", function () {
      removeData(id);
    });

    combineText.append(checkButton, editButton, trashButton);
  }
  return combineText;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(datas);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
document.addEventListener(SAVED_EVENT, () => {});

function addData(dataId) {
  const dataTarget = findTodo(dataId);

  if (dataTarget == null) return;

  dataTarget.isCompleted = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findTodo(dataId) {
  for (const dataItem of datas) {
    if (dataItem.id === dataId) {
      return dataItem;
    }
  }
  return null;
}
let mode = false;

function removeData(dataId) {
  const dataTarget = findDataIndex(dataId);

  if (dataTarget === -1) return;

  if (mode) {
    if (
      confirm("Anda sedang dalam mode edit, apakah anda ingin menghapus data?")
    ) {
      datas.splice(dataTarget, 1);
      cancelEdit();
      document.getElementById("judul").value = "";
      document.getElementById("penulis").value = "";
      document.getElementById("tahun").value = "";
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  } else {
    datas.splice(dataTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function findDataIndex(dataId) {
  for (const index in datas) {
    if (datas[index].id === dataId) {
      return index;
    }
  }

  return -1;
}

function undoData(dataId) {
  const dataTarget = findTodo(dataId);

  if (dataTarget == null) return;

  dataTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
let saveEditHandler;

function editData(dataItem) {
  if (datas && dataItem) {
    mode = true;
    document.getElementById("judul").value = dataItem.title;
    document.getElementById("penulis").value = dataItem.author;
    document.getElementById("tahun").value = dataItem.year;
    const masukan = document.getElementById("masukan");
    const kirim = document.getElementById("kirim");
    masukan.innerText = "Edit Data";
    kirim.innerText = "Simpan perubahan";

    if (saveEditHandler) {
      kirim.removeEventListener("click", saveEditHandler);
    }
    const checkbox = document.getElementById("checkbox");
    checkbox.checked = dataItem.isCompleted;

    if (checkbox.checked) {
      dataItem.isCompleted = true;
    }

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        merge.isCompleted = true;
      } else {
        merge.isCompleted = false;
      }
    });
    merge = dataItem;

    if (checkbox.checked) {
      merge.isCompleted = true;
    }

    saveEditHandler = function () {
      if (
        !document.getElementById("judul").value ||
        !document.getElementById("penulis").value ||
        !document.getElementById("tahun").value
      ) {
        alert("Semua kolom harus di isi");
        return;
      }
      saveEdit(dataItem);
      masukan.innerText = "Masukan Buku";
      kirim.innerText = "Kirimkan";
      kirim.removeEventListener("click", saveEditHandler);
      checkbox.checked = false;
      const batal = document.getElementById("batal");
      if (batal) {
        batal.remove();
      }
    };
    kirim.addEventListener("click", saveEditHandler);
    const batal = document.createElement("button");
    batal.setAttribute("id", "batal");
    batal.innerText = "Batal";
    batal.addEventListener("click", function () {
      cancelEdit();
    });

    if (!document.getElementById("batal")) {
      kirim.insertAdjacentElement("afterend", batal);
    }
    scrollToNav();
  } else {
    alert("Maaf data tidak dapat di edit");
  }
}

function saveEdit(dataSaveEdit) {
  const dataTarget = findTodo(dataSaveEdit.id);

  if (dataTarget == null) return;

  const inputJudul = document.getElementById("judul").value;
  const inputPenulis = document.getElementById("penulis").value;
  const inputTahun = document.getElementById("tahun").value;
  if (!inputJudul || !inputPenulis || !inputTahun) {
    alert("Semua kolom harus di isi");
    return;
  }
  dataTarget.title = inputJudul;
  dataTarget.author = inputPenulis;
  dataTarget.year = inputTahun;
  document.getElementById("judul").value = "";
  document.getElementById("penulis").value = "";
  document.getElementById("tahun").value = "";

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function cancelEdit() {
  mode = false;
  document.getElementById("judul").value = "";
  document.getElementById("penulis").value = "";
  document.getElementById("tahun").value = "";
  const masukan = document.getElementById("masukan");
  const kirim = document.getElementById("kirim");
  masukan.innerText = "Masukan Buku";
  kirim.innerText = "Kirimkan";
  kirim.removeEventListener("click", saveEditHandler);
  const batal = document.getElementById("batal");
  if (batal) {
    batal.remove();
  }
  const checkbox = document.getElementById("checkbox");
  checkbox.checked = false;
}
