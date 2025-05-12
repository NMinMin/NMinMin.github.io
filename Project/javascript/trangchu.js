// ------------------ 1. TẠO SLIDER SẢN PHẨM MỚI ------------------
fetch('https://opensheet.elk.sh/15HwqsZC133Iiop7kwd-8R8pbdUewvLKjbJHJSnUUfzg/Trang%20t%C3%ADnh1')
  .then(res => res.json())
  .then(data => {
    const sliderContainer = document.getElementById('hero-slider-container');
    data.forEach(item => {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      sliderContainer.appendChild(img);
    });

    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % data.length;
      sliderContainer.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }, 3000);
  });

//Add items to cart
function addToCart(productId) {
  fetch('https://opensheet.elk.sh/1nV1tWbJoCXbWgICD0tuF8psj0uOHvNQPw1nSvXG_igQ/Trang%20t%C3%ADnh1')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const existing = cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: parseFloat(product.price),
          image: product.image,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('🛒 Sản phẩm đã được thêm vào giỏ hàng!');
    });
}


// ------------------ 2. HIỂN THỊ SẢN PHẨM NỔI BẬT + RATING ------------------
fetch('https://opensheet.elk.sh/1nV1tWbJoCXbWgICD0tuF8psj0uOHvNQPw1nSvXG_igQ/Trang%20t%C3%ADnh1')
  .then(res => res.json())
  .then(products => {
    const productsContainer = document.getElementById('products-container');

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card', 'fade-in');
      // Hàm định dạng giá
      function formatCurrency(amount) {
        // Chuyển đổi giá trị thành số (nếu chưa phải là số)
        const number = parseFloat(amount);

        // Kiểm tra xem giá trị có hợp lệ không
        if (isNaN(number)) return amount;

        return number.toLocaleString('vi-VN');  // Định dạng theo kiểu Việt Nam (1,000,000)
      }
      if (product.op == "nổi bật") {
        // Sửa lại phần HTML của sản phẩm
        productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="rating" data-rating="${product.rating}"></div>
        <p class="price"><strong>Giá:</strong> ${formatCurrency(product.price)} VND</p>  <!-- Hiển thị giá định dạng -->
        
        <p><strong>Đã bán:</strong> ${product.sales}</p>
        <button class="add-to-cart-btn" data-id="${product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed">
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
          </svg>Mua ngay
        </button>
      </div>
    `;


        productsContainer.appendChild(productCard);

        renderRating(productCard.querySelector(".rating"), parseFloat(product.rating));
      }
    });
    // Gắn sự kiện Thêm vào giỏ hàng
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        addToCart(productId);

      });
    });

    checkFadeIn(); // Check hiệu ứng khi render xong sản phẩm
  });
// ------------------ 3. HIỆU ỨNG CUỘN ------------------
function isInView(element) {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

function checkFadeIn() {
  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach(element => {
    if (isInView(element)) {
      element.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkFadeIn);

// ------------------ 4. RENDER RATING ------------------
function renderRating(element, rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const totalStars = 5;

  let starsHTML = '';
  for (let i = 0; i < full; i++) starsHTML += fullStarSVG;
  if (half) starsHTML += halfStarSVG;
  for (let i = 0; i < totalStars - full - (half ? 1 : 0); i++) starsHTML += emptyStarSVG;

  element.innerHTML = starsHTML;
}

// ------------------ 5. GIỎ HÀNG LOCALSTORAGE + ĐẾM ------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
  fetch('https://opensheet.elk.sh/1nV1tWbJoCXbWgICD0tuF8psj0uOHvNQPw1nSvXG_igQ/Trang%20t%C3%ADnh1')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existing = cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: parseFloat(product.price),
          image: product.image,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('🛒 Sản phẩm đã được thêm vào giỏ hàng!');
    });
}


function updateCartCount() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    cartCountElem.textContent = cartCount;
  }
}

updateCartCount(); // Khi vừa load trang

// ------------------ 6. SVG SAO ------------------
const fullStarSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBC02D">
  <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Z"/>
</svg>`;

const halfStarSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBC02D">
  <path d="m606-286-33-144 111-96-146-13-58-136v312l126 77Z"/>
</svg>`;

const emptyStarSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#E0E0E0">
  <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Z"/>
</svg>`;

// ------------------ 7. XỬ LÝ TÀI KHOẢN ĐĂNG NHẬP ------------------
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navLinks = document.querySelectorAll('header nav ul li a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === '#account') {
      link.textContent = currentUser ? `Xin chào, ${currentUser.name}` : 'Tài Khoản';
    }
  });
});

// Tu dong cap nhat gio hang

// 1. Hàm lấy giỏ hàng từ localStorage

function getCart() {

  return JSON.parse(localStorage.getItem('cart')) || [];

}



// 2. Hàm lưu giỏ hàng vào localStorage

function saveCart(cart) {

  localStorage.setItem('cart', JSON.stringify(cart));

}



// 3. Hàm cập nhật số lượng trong thẻ <span id="cart-count">

function updateCartCount() {

  const cart = JSON.parse(localStorage.getItem('cart')) || [];



  const cartCount = cart.reduce((sum, item) => {

    const quantity = parseInt(item.quantity, 10);

    return sum + (isNaN(quantity) ? 0 : quantity);

  }, 0);



  const cartCountElem = document.getElementById('cart-count');

  if (cartCountElem) {

    cartCountElem.textContent = cartCount;

  }

}





// 4. Hàm thêm sản phẩm vào giỏ hàng

function addToCart(productId) {

  fetch('https://opensheet.elk.sh/1nV1tWbJoCXbWgICD0tuF8psj0uOHvNQPw1nSvXG_igQ/Trang%20t%C3%ADnh1')

    .then(res => res.json())

    .then(products => {

      const product = products.find(p => p.id === productId);

      if (!product) return;



      let cart = JSON.parse(localStorage.getItem('cart')) || [];



      const existing = cart.find(item => item.id === productId);

      if (existing) {

        existing.quantity += 1;

      } else {

        cart.push({

          id: productId,

          name: product.name,

          price: parseFloat(product.price),

          image: product.image,

          quantity: 1

        });

      }



      localStorage.setItem('cart', JSON.stringify(cart)); // ✅ Lưu giỏ hàng

      console.log(JSON.parse(localStorage.getItem('cart'))); // ✅ In giỏ hàng ra console



      updateCartCount();

      alert('🛒 Sản phẩm đã được thêm vào giỏ hàng!');

    });

}









// 5. Gọi khi DOM đã sẵn sàng

document.addEventListener('DOMContentLoaded', () => {

  const cartContainer = document.getElementById('cart-items-container');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];



  if (cart.length === 0) {

    cartContainer.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';

    return;

  }



  let totalPrice = 0;



  cart.forEach(item => {

    const productElem = document.createElement('div');

    productElem.classList.add('cart-item');



    productElem.innerHTML = `

      <img src="${item.image}" alt="${item.name}" width="100">

      <h3>${item.name}</h3>

      <p>Giá: ${item.price.toLocaleString('vi-VN')} VND</p>

      <p>Số lượng: ${item.quantity}</p>

    `;



    cartContainer.appendChild(productElem);



    totalPrice += item.price * item.quantity; // Tính tổng tiền

  });



  const totalElement = document.getElementById('total');

  totalElement.innerText = `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} VND`;

});
