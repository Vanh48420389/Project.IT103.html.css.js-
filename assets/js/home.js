document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    if (currentUser) {
        authLink.textContent = 'Đăng xuất';
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            Swal.fire({
                title: 'Đã đăng xuất!',
                text: 'Bạn đã đăng xuất thành công.',
                icon: 'success'
            }).then(() => {
                window.location.href = './pages/auth/login.html';
            });
        });
    } else {
        authLink.textContent = 'Đăng nhập';
        authLink.href = './pages/auth/login.html';
    }
});