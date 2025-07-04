document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault();

      // Lấy giá trị username và password
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      // Tạo formData để gửi lên API
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      console.log(username,' ',password)
      // Gửi request đến Google Apps Script
      fetch('https://script.google.com/macros/s/AKfycbxNrDFElx_OY2ksDf-mzZlGVYiD9EDA57bKmyR2EQrtrlfG0oplI_6Kf96at03VYCU7/exec', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          alert("Login successful!");
          window.location.href = "home.html"; // Điều hướng đến trang dashboard sau khi đăng nhập thành công
        } else {
          alert("Invalid username or password.");
        }
      })
      .catch(error => console.error('Error:', error));
    });