const form = document.getElementById('registerForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.classList.remove('error-border');
    });

    let isValid = true;

    if (name === '') {
        document.getElementById('nameError').textContent = 'Họ và tên không được để trống.';
        nameInput.classList.add('error-border');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email không được để trống.';
        emailInput.classList.add('error-border');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Email không đúng định dạng.';
        emailInput.classList.add('error-border');
        isValid = false;
    }

    if (password === '') {
        document.getElementById('passwordError').textContent = 'Mật khẩu không được để trống.';
        passwordInput.classList.add('error-border');
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Mật khẩu phải có ít nhất 8 ký tự.';
        passwordInput.classList.add('error-border');
        isValid = false;
    }

    if (confirmPassword === '') {
        document.getElementById('confirmPasswordError').textContent = 'Xác nhận mật khẩu không được để trống.';
        confirmPasswordInput.classList.add('error-border');
        isValid = false;
    } else if (confirmPassword !== password) {
        document.getElementById('confirmPasswordError').textContent = 'Mật khẩu không trùng khớp.';
        confirmPasswordInput.classList.add('error-border');
        isValid = false;
    }

    if (isValid) {
        const user = {
            name: name,
            email: email,
            password: password
        };

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const isEmailExist = users.some(user => user.email === email);
        if (isEmailExist) {
            Swal.fire({
                title: 'Email đã tồn tại!',
                text: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
                icon: 'error'
            });
            emailInput.classList.add('error-border');
            return;
        }

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            title: 'Đăng Kí Thành Công!',
            text: 'Bạn đã đăng kí tài khoản thành công.',
            icon: 'success'
        }).then(() => {
            window.location.href = './login.html';
        });
    }
});
