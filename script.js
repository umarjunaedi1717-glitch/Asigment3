const productName = document.getElementById("productName");
const stockStatus = document.getElementById("stockStatus");
const price = document.getElementById("price");
const description = document.getElementById("description");
const quantity = document.getElementById("quantity");
const color = document.getElementById("color");
const material = document.getElementById("material");
const brand = document.getElementById("brand");

const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");

const fetchButton = document.getElementById("fetchButton");
const apiData = document.getElementById("apiData");

// ===================================
// 1. MENGAMBIL DATA DARI LOCAL STORAGE
// ===================================

let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

// ===================================
// 2. MENYIMPAN DATA KE LOCAL STORAGE
// ===================================

function saveToLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

// ===================================
// 3. VALIDASI INPUT
// ===================================

function validateInput(input) {
  const error = document.getElementById(input.id + "Error");

  if (input.value.trim() === "") {
    error.textContent = input.id + " wajib diisi";
    error.style.color = "red";

    return false;
  } else {
    error.textContent = "";

    return true;
  }
}

function validateForm() {
  const inputs = [
    productName,
    stockStatus,
    price,
    description,
    quantity,
    color,
    material,
    brand,
  ];

  let isValid = true;

  inputs.forEach(function (input) {
    if (!validateInput(input)) {
      isValid = false;
    }
  });

  return isValid;
}

// ===================================
// 4. VALIDASI SAAT INPUT DIKETIK
// ===================================

const inputs = [
  productName,
  stockStatus,
  price,
  description,
  quantity,
  color,
  material,
  brand,
];

inputs.forEach(function (input) {
  input.addEventListener("input", function () {
    validateInput(input);
  });
});

// ===================================
// 5. MENGATUR STATUS STOK
// ===================================

stockStatus.addEventListener("change", function () {
  if (stockStatus.value === "Out of Stock") {
    quantity.disabled = true;
    quantity.value = "";
  } else {
    quantity.disabled = false;
  }
});

// ===================================
// 6. MENYIMPAN PRODUK
// ===================================

productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const product = {
    name: productName.value,
    stock: stockStatus.value,
    price: Number(price.value),
    description: description.value,
    quantity: Number(quantity.value),
    color: color.value,
    material: material.value,
    brand: brand.value,
  };

  if (editIndex === null) {
    products.push(product);
  } else {
    products[editIndex] = product;
    editIndex = null;
  }

  saveToLocalStorage();

  displayProducts();

  productForm.reset();

  quantity.disabled = false;
});

// ===================================
// 7. MENAMPILKAN PRODUK
// ===================================

function displayProducts() {
  productList.innerHTML = "";

  products.forEach(function (product, index) {
    const card = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = product.name;

    const stock = document.createElement("p");
    stock.textContent = "Stock: " + product.stock;

    if (product.stock === "In Stock") {
      stock.style.color = "green";
    } else {
      stock.style.color = "red";
    }

    const details = document.createElement("p");

    details.textContent =
      "Price: " +
      product.price +
      " | Quantity: " +
      product.quantity +
      " | Color: " +
      product.color +
      " | Material: " +
      product.material +
      " | Brand: " +
      product.brand;

    const descriptionText = document.createElement("p");
    descriptionText.textContent = product.description;

    // Membuat tombol Delete
    // EDIT BUTTON
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
      productName.value = product.name;
      stockStatus.value = product.stock;
      price.value = product.price;
      description.value = product.description;
      quantity.value = product.quantity;
      color.value = product.color;
      material.value = product.material;
      brand.value = product.brand;

      editIndex = index;

      quantity.disabled = product.stock === "Out of Stock";
    });
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      products.splice(index, 1);

      saveToLocalStorage();

      displayProducts();
    });

    card.appendChild(name);
    card.appendChild(stock);
    card.appendChild(details);
    card.appendChild(descriptionText);
    card.appendChild(editButton);
    card.appendChild(deleteButton);

    productList.appendChild(card);
  });
}

// ===================================
// 8. MENAMPILKAN DATA SAAT HALAMAN DIBUKA
// ===================================

displayProducts();

// ===================================
// 9. FETCH API
// ===================================

fetchButton.addEventListener("click", async function () {
  try {
    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }

    const data = await response.json();

    localStorage.setItem("apiProducts", JSON.stringify(data));

    apiData.innerHTML = "";

    data.slice(0, 5).forEach(function (post) {
      const card = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = post.title;

      const body = document.createElement("p");
      body.textContent = post.description;

      card.appendChild(title);
      card.appendChild(body);

      apiData.appendChild(card);
    });
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
    apiData.textContent = "Gagal mengambil data API.";
  }
});

function displayApiProducts() {
  const savedApiProducts = JSON.parse(localStorage.getItem("apiProducts"));

  if (!savedApiProducts) {
    return;
  }

  apiData.innerHTML = "";

  savedApiProducts.slice(0, 5).forEach(function (post) {
    const card = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");

    body.textContent = post.description;

    card.appendChild(title);
    card.appendChild(body);

    apiData.appendChild(card);
  });
}

displayApiProducts();
