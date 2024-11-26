const productList = document.getElementById("product-list")
const cartList = document.getElementById("cart-list")
const totalCart = document.querySelector(".total-cart")
const listItem = document.querySelector(".list-item")
const cartTotal = document.querySelector(".cart-total")
// Get modal, open button, close button, and backdrop
const modal = document.getElementById("modal")
// const openModalBtn = document.getElementById("openModalBtn")
const closeModalBtn = document.getElementById("closeModalBtn")
const backdrop = document.getElementById("backdrop")
// modal.style.display = "flex" // Show the modal
// backdrop.style.display = "block" // Show the backdrop
// Open the modal when the button is clicked
// openModalBtn.addEventListener("click", () => {
//   modal.style.display = "flex" // Show the modal
//   backdrop.style.display = "block" // Show the backdrop
// })

// Close the modal when the close button or backdrop is clicked
closeModalBtn.addEventListener("click", closeModal)
backdrop.addEventListener("click", closeModal)

function closeModal() {
  document.body.classList.remove("body-no-scroll")
  modal.style.display = "none" // Hide the modal
  backdrop.style.display = "none" // Hide the backdrop
}
// const groupQuantity
var products = []
var carts = JSON.parse(localStorage.getItem("carts")) || []
async function checkData() {
  if (localStorage.getItem("products"))
    products = JSON.parse(localStorage.getItem("products"))
  try {
    const res = await fetch("./data.json")
    const data = await res.json()
    const dataStr = JSON.stringify(data)
    localStorage.setItem("products", dataStr)
    products = data
  } catch (error) {
    console.log(error)
  }
}
function unSelectProduct(name) {
  const productEle = Array.from(document.querySelectorAll(".product-name"))
    .find((v) => v.textContent.trim() === name)
    .closest(".product")
  productEle.classList.remove("selected")
}
function updateQuantity(name, quantity) {
  const productEle = Array.from(document.querySelectorAll(".product-name"))
    .find((v) => v.textContent.trim() === name)
    .closest(".product")
    .querySelector("span")
  productEle.innerText = quantity
}
function checkExistsProductInCart(name) {
  const productInCart = carts.find((v) => v.name === name)
  if (productInCart) {
    productInCart.quantity += 1
  }
  saveCarts({
    ...productInCart,
  })
}
checkData()

function saveProducts(data) {
  products = data
  localStorage.setItem("products", JSON.stringify(data))
}
function saveCarts(data) {
  carts = data
  localStorage.setItem("carts", JSON.stringify(data))
}
function addProductToCart(name, quantity = 1) {
  const selectedProduct = products.filter((product) => product.name === name)
  selectedProduct[0].quantity = 1
  carts.push(...selectedProduct)
  saveCarts(carts)
  LoadCart()
}
function decreaseProduct(name) {
  const selectedProduct = carts.find((v) => v.name === name)
  if (selectedProduct.quantity === 1) {
    removeProductFromCart(name)
    return
  }
  if (selectedProduct) {
    selectedProduct.quantity -= 1
  }
  updateQuantity(name, selectedProduct.quantity)
  saveCarts(carts)
  LoadCart()
}
function increaseProduct(name) {
  const selectedProduct = carts.find((v) => v.name === name)
  if (selectedProduct) {
    selectedProduct.quantity += 1
  }
  updateQuantity(name, selectedProduct.quantity)
  saveCarts(carts)
  LoadCart()
}
async function LoadProduct(device = "mobile") {
  let renderHtml = ""
  if (products.length === 0) {
    renderHtml = `<h1>Không có sản phẩm<h1>`
    productList.innerHTML = renderHtml
    return
  }
  products.forEach((item) => {
    let isInCart = carts.find((v) => v.name == item.name)
    renderHtml += `
      <div class="product ${isInCart ? "selected" : ""}">
        <div class="image">
          <img src="${item.image[device]}" alt="" />
          <button class="btn-add">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              fill="none"
              viewBox="0 0 21 20"
            >
              <g fill="#C73B0F" clip-path="url(#a)">
                <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z" />
                <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M.333 0h20v20h-20z" />
                </clipPath>
              </defs>
            </svg>
            Add to Cart
          </button>
          <div class="group-quantity">
            <button onclick="decreaseProduct('${item.name}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 2"
              >
                <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
              </svg>
            </button>
            <span>${
              isInCart?.quantity === undefined ? 1 : isInCart.quantity
            }</span>
            <button onClick="increaseProduct('${item.name}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 10"
              >
                <path
                  fill="#fff"
                  d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="description">
          <small>${item.category}</small>
          <h3 class="product-name">${item.name}</h3>
          <p>$${item.price}</p>
        </div>
      </div>`
  })
  productList.innerHTML = renderHtml
}
function resetOrder() {
  carts = []
  saveCarts([])
  LoadProduct()
  LoadCart()
  closeModal()
}
function LoadCart() {
  let htmlRender = ""
  totalCart.innerHTML = carts.length

  if (carts.length === 0) {
    htmlRender = `<div class="empty">
    <img src="./assets/images/illustration-empty-cart.svg" alt="" />
    <p>Your added items will appear here</p>
  </div>`
    cartList.innerHTML = htmlRender
    return
  }
  let total = 0
  carts.forEach((product) => {
    total += product.quantity * product.price
    htmlRender += `
        <div class="cart-item">
            <div>
            <h4 class="cart-name">${product.name}</h4>
            <div class="cart-detail"><span>${
              product.quantity
            }x</span> <span>@ $${product.price}</span> <span>$${
      product.quantity * product.price
    }</span></div>
            </div>
            <button class="btn-remove">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 10"
            >
                <path
                fill="currentColor"
                d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
                />
            </svg>
            </b>
        </div>
    `
  })
  htmlRender += `<div class="cart-total">
    <p>Order Total</p>
    <p>$${total}</p>
  </div>
  <div class="environment
  ">
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/><path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/></svg>
    <p>This is a carbon neutral delivery</p>
  </div><button onclick="openModal()" class="btn-order">Confirm Order</button>`
  cartList.innerHTML = htmlRender
}
function openModal() {
  document.body.classList.add("body-no-scroll")
  let total = 0
  let htmlRender = ""
  carts.forEach((item) => {
    total += item.quantity * item.price
    htmlRender += `
      <div class="item">
        <div>
          <img
            src="${item.image.thumbnail}"
            alt=""
          />
        </div>
        <div>
          <h3>${item.name}</h3>
          <div>
            <span>${item.quantity}x</span>
            <span>@ $${item.price}</span>
          </div>
        </div>
        <span>$${item.quantity * item.price}</span>
      </div>
    `
  })

  listItem.innerHTML = htmlRender
  cartTotal.innerHTML = `<p>Order Total</p><p>$${total}</p>`
  modal.style.display = "flex" // Show the modal
  backdrop.style.display = "block" // Show the backdrop
}
function removeProductFromCart(name) {
  const executedCart = carts.filter((item) => item.name !== name)
  saveCarts(executedCart)
  // LoadProduct()
  unSelectProduct(name)
  LoadCart()
}
let resizeTimer
function updateProductImage() {
  clearTimeout(resizeTimer)
  const screenWidth = window.innerWidth
  resizeTimer = setTimeout(() => {
    if (screenWidth <= 768) {
      LoadProduct("mobile")
      return
    }
    if (screenWidth <= 1024) {
      LoadProduct("tablet")
      return
    }
    LoadProduct("desktop")
  }, 200)
}
window.addEventListener("resize", updateProductImage)

cartList.addEventListener("click", (event) => {
  // Check if the target is a button or an SVG inside a button
  const button = event.target.closest(".btn-remove") // Find closest .btn-remove element

  if (button) {
    // Check if the button contains an SVG and proceed if the button is clicked (not just SVG)
    const name = button.parentNode.querySelector("h3").textContent
    button.closest(".cart-item").remove()
    removeProductFromCart(name)
  }
})
productList.addEventListener("click", (event) => {
  // Find the closest .btn-add (whether it's the button or the SVG inside it)
  const button = event.target.closest(".btn-add")

  if (button) {
    // Get the product name from the parent element
    const productName =
      button.parentNode.parentNode.querySelector(".product-name").textContent
    // Add the product to the cart
    addProductToCart(productName)
    // Add a class to the parent to highlight the selected product
    button.parentNode.parentNode.classList.add("selected")
  }
})

updateProductImage()
LoadCart()
