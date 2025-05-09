const Link_Backend = 'http://localhost:3000';
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logoutBtn');

const kTra_email = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${Link_Backend}/currentUser`);
        const currentUser = await response.json();

        if (currentUser.email) {
            console.log(`đang đăng nhập: ${currentUser.name || currentUser.email} (${currentUser.role || 'user'})`);
            logoutBtn.style.display = 'block';
        } else {
            console.log('chưa đăng nhập');
            logoutBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        console.log('chưa đăng nhập');
        logoutBtn.style.display = 'none';
    }
});

//đăng ký
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (!kTra_email(email)) {
        alert('Email không hợp lệ!');
        return;
    }
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    try {
        const userResponse = await fetch(`${Link_Backend}/users?username=${username}`);
        const emailResponse = await fetch(`${Link_Backend}/users?email=${email}`);
        const users = await userResponse.json();
        const emails = await emailResponse.json();

        if (users.length > 0) {
            alert('Tên người dùng đã tồn tại!');
            return;
        }
        if (emails.length > 0) {
            alert('Email đã được sử dụng!');
            return;
        }

        await fetch(`${Link_Backend}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email,
                password,
                cart: [],
                role: 'user'
            }),
        });

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        registerForm.reset();
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
});

// Xử lý đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('email-login');
    const passwordInput = document.getElementById('password-login');
    const email = emailInput.value;
    const password = passwordInput.value;

    // Xóa class red-outline nếu có
    emailInput.classList.remove('red-outline');
    passwordInput.classList.remove('red-outline');

    if (!kTra_email(email)) {
        alert('Email không hợp lệ!');
        emailInput.classList.add('red-outline');
        return;
    }

    try {
        const response = await fetch(`${Link_Backend}/users?email=${email}&password=${password}`);
        const users = await response.json();

        if (users.length === 0) {
            alert('Email hoặc mật khẩu không đúng!');
            emailInput.classList.add('red-outline');
            passwordInput.classList.add('red-outline');
            return;
        }

        const user = users[0];
        await fetch(`${Link_Backend}/currentUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 1,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }),
        });

        console.log(`đang đăng nhập: ${user.name || user.email} (${user.role || 'user'})`);
        logoutBtn.style.display = 'block';
        alert('Đăng nhập thành công!');
        loginForm.reset();
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await fetch(`${Link_Backend}/currentUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1 })
        });

        console.log('chưa đăng nhập');
        logoutBtn.style.display = 'none';
        alert('Đã đăng xuất!');
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
});