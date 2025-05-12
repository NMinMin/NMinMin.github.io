window.addEventListener('DOMContentLoaded', () => {
  const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Thay bằng URL thật

  fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('users', JSON.stringify(data));
      console.log('Đã lấy danh sách tài khoản từ Google Sheets.');
    })
    .catch(error => {
      console.error('Lỗi khi lấy dữ liệu từ Google Sheets:', error);
    });
});

const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check nếu username đã tồn tại
  if (users.find(u => u.username === username)) {
    alert('Tài khoản đã tồn tại!');
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Đăng ký thành công!');
  document.getElementById('registerForm').reset();

  // Trượt về login
container.classList.remove("right-panel-active");
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    alert(`Xin chào ${user.username}!`);
    const currentUser = {email: user.email, name: user.username}
      localStorage.setItem('currentUser', JSON.stringify(currentUser)); // lưu username
    window.location.href = 'loadingpage.html'; // chuyển sang trang chủ
  } else {
    alert('Username hoặc mật khẩu sai.');
  }

  document.getElementById('loginForm').reset();
  
});
