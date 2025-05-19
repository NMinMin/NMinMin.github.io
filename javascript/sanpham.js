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


const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let cart = JSON.parse(localStorage.getItem(currentUser ? `cart_${currentUser.email}` : 'cart')) || [];

fetch('https://opensheet.elk.sh/1nV1tWbJoCXbWgICD0tuF8psj0uOHvNQPw1nSvXG_igQ/Trang%20t%C3%ADnh1')
  .then(res => res.json())
  .then(products => {
    const drinksContainer = document.getElementById('do-uong');
    const foodsContainer = document.getElementById('do-an');

    function formatCurrency(amount) {
      const number = parseFloat(amount);
      if (isNaN(number)) return amount;
      return number.toLocaleString('vi-VN');
    }

    const filteredProducts = products.filter(p => p.phanloai === "Đồ uống" || p.phanloai === "Đồ ăn");

    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
productCard.classList.add('product-card');
setTimeout(() => productCard.classList.add('show'), 100);


      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="rating" data-rating="${product.rating}"></div>
          <p class="price"><strong>Giá:</strong> ${formatCurrency(product.price)} VND</p>
          <p><strong>Đã bán:</strong> ${product.sales}</p>
          <button class="add-to-cart-btn buy-button" data-id="${product.id}">🛒 Mua ngay</button>
        </div>
      `;

      if (product.phanloai === "Đồ uống") {
        drinksContainer.appendChild(productCard);
      } else if (product.phanloai === "Đồ ăn") {
        foodsContainer.appendChild(productCard);
      }

      renderRating(productCard.querySelector(".rating"), parseFloat(product.rating));
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        if (!currentUser) {
          alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
          return;
        }
        addToCart(productId);
      });
    });

    updateCartCount();
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
// ---- RENDER RATING
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

// ---- ADD TO CART
function addToCart(productId) {
  fetch('https://opensheet.elk.sh/1nV1tWbJoCXbWgICD0tuF8psj0uOHvNQPw1nSvXG_igQ/Trang%20t%C3%ADnh1')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const cartKey = `cart_${currentUser.email}`;
      let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

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

      localStorage.setItem(cartKey, JSON.stringify(cart));
      updateCartCount();
      alert('🛒 Sản phẩm đã được thêm vào giỏ hàng!');
    });
}

// ---- UPDATE CART COUNT
function updateCartCount() {
  if (!currentUser) return;
  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    cartCountElem.textContent = cartCount;
  }
}

// ---- SVG SAO
const fullStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBC02D"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Z"/></svg>`;
const halfStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBC02D"><path d="m606-286-33-144 111-96-146-13-58-136v312l126 77Z"/></svg>`;
const emptyStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#E0E0E0"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Z"/></svg>`;

// ---- HIỂN THỊ TÊN USER & LOGOUT
document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'dangnhap_dangky.html') {
        link.textContent = `Xin chào, ${currentUser.name}`;
      }
    });

    const savedCart = localStorage.getItem(`cart_${currentUser.email}`);
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartCount();
  }

  // ✅ GẮN SỰ KIỆN CHO NÚT "Đăng xuất" (đã có sẵn trong HTML)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      alert('Đã đăng xuất.');
      window.location.href = 'dangnhap_dangky.html';
    });
  }
});
