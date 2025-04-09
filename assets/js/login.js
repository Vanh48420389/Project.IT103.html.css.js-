const form = document.getElementById('loginForm');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('Email');
            const passwordInput = document.getElementById('password');

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            document.getElementById('emailError').textContent = '';
            document.getElementById('passwordError').textContent = '';

            [emailInput, passwordInput].forEach(input => input.classList.remove('error-border'));

            let isValid = true;



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
            }

            if (isValid) {
                if (email === 'admin@example.com' && password === 'admin123') {
                    const adminUser = {
                        name: 'Admin',
                        email: 'admin@example.com',
                        role: 'admin'
                    };

                    localStorage.setItem('currentUser', JSON.stringify(adminUser));

                    Swal.fire({
                        title: "Hello Boss!",
                        text: "You clicked the button!",
                        icon: "success"
                    }).then(() => {
                        window.location.href = '../admin/statistical.html';
                    });
                    return;
                }

                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(user => user.email === email && user.password === password);

                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    Swal.fire({
                        title: "Good job!",
                        text: "You clicked the button!",
                        icon: "success"
                    }).then(() => {
                        window.location.href = '../../home.html';
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                    passwordInput.classList.add('error-border');

                }
            }
        });