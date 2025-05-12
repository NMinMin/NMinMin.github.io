// document.addEventListener('DOMContentLoaded', function () {
//   // Khai báo và khởi tạo cart ngay từ đầu
//   let cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const cartItemsContainer = document.getElementById('cart-items');
//   const totalElement = document.getElementById('total');
//   let totalPrice = 0;

//   if (cart.length === 0) {
//     cartItemsContainer.innerHTML = '<p>Giỏ hàng trống.</p>';
//   } else {
//     cart.forEach(item => {
//       const itemDiv = document.createElement('div');
//       itemDiv.className = 'cart-item';
//       itemDiv.innerHTML = `
//         <img src="${item.image}" alt="${item.name}" width="80">
//         <strong>${item.name}</strong>
//         <p>${item.price.toLocaleString()} VND</p>
//         <p>Số lượng: ${item.quantity}</p>
//         <button class="delete-btn" data-id="${item.id}">Xóa</button>
//         <hr/>
//       `;
//       totalPrice += item.price * item.quantity;
//       cartItemsContainer.appendChild(itemDiv);
//     });
//     totalElement.innerText = `Tổng tiền: ${totalPrice.toLocaleString()} VND`;
//   }

//   // Xử lý nút Xóa
//   document.querySelectorAll('.delete-btn').forEach(button => {
//     button.addEventListener('click', function () {
//       const id = this.getAttribute('data-id');
//       cart = cart.filter(i => i.id !== id);
//       localStorage.setItem('cart', JSON.stringify(cart));
//       location.reload();
//     });
//   });

//   // Khởi tạo EmailJS
//   emailjs.init("E8gbkv5o0LLKhagKs");

//   document.getElementById('checkout-form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     const fullName = document.getElementById('full-name').value;
//     const address = document.getElementById('address').value;
//     const phone = document.getElementById('phone').value;
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//     if (!currentUser) {
//       alert('Bạn phải đăng nhập trước.');
//       return;
//     }

//     const orders = cart.map(item => ({
//       name: item.name,
//       quantity: item.quantity,
//       price: item.price.toLocaleString() + ' VND'
//     }));

//     const params = {
//       email: currentUser.email,
//       full_name: fullName,
//       address: address,
//       phone: phone,
//       orders: JSON.stringify(orders, null, 2),
//       total_price: totalPrice.toLocaleString() + ' VND'
//     };

//     console.log("📧 Sending email with params: ", params);

//     emailjs.send("service_nzpo11o", "template_09w8vhh", params)
//       .then(res => {
//         console.log("✅ Email sent", res.status, res.text);
//         alert("Đã gửi email xác nhận đơn hàng.");
//         localStorage.removeItem('cart');
//         location.reload();
//       })
//       .catch(err => {
//         console.error("❌ Error sending email", err);
//         alert("Lỗi khi gửi email: " + err.text);
//       });
//   });
// });

// Hàm format giá tiền

function formatCurrency(amount) {

  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

}



//Remove-Cart-Item

function removeFromCart(productId) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];



  // Lọc ra các sản phẩm không có ID trùng với productId

  cart = cart.filter(item => item.id !== productId);



  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart(); // Cập nhật lại giao diện giỏ hàng

}



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



    // Tính tổng tiền

    totalPrice += item.price * item.quantity;

  });



  // Hiển thị tổng tiền

  const totalElement = document.getElementById('total');

  totalElement.innerText = `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} VND`;

});


