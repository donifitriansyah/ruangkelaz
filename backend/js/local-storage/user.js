document.addEventListener('DOMContentLoaded', countRegisteredUsers);

function countRegisteredUsers() {
    // Only count keys that start with 'user_' and ensure no other keys are included
    const users = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    document.getElementById('accountCount').textContent = users.length;
}

function registerUser() {
    const username = document.getElementById('username').value;
    const name = document.getElementById('name').value;
    const nip = document.getElementById('nip').value;
    const password = document.getElementById('password').value;

    if (localStorage.getItem(`user_${username}`)) {
        alert('Username sudah terdaftar!');
    } else {
        const user = { name: name, nip: nip, password: password };
        localStorage.setItem(`user_${username}`, JSON.stringify(user));
        alert('Registrasi berhasil! - Silakan login di sini...');
        window.location.href = 'login.html';
        countRegisteredUsers(); // Update jumlah akun setelah registrasi
    }
}

function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Username:', username); // Debug log
    console.log('Password:', password); // Debug log

    const storedUserJSON = localStorage.getItem(`user_${username}`);

    if (storedUserJSON) {
        const storedUser = JSON.parse(storedUserJSON);
        if (storedUser.password === password) {
            alert('Login berhasil!');
            localStorage.setItem('loggedInUser', username); // Simpan data sesi pengguna yang sedang login
            window.location.href = 'dashboard.html'; // Redirect ke halaman dashboard setelah login
        } else {
            alert('Username atau password salah!');
        }
    } else {
        alert('Username atau password salah!');
    }
}

function logoutUser() {
    localStorage.removeItem('loggedInUser'); // Hapus data sesi pengguna yang sedang login
    alert('Anda telah logout.');
    window.location.href = 'login.html'; // Redirect ke halaman login setelah logout
}

function displayGreeting() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const greetingElement = document.getElementById('greeting');
        greetingElement.textContent = `Selamat datang, ${loggedInUser}!`;
    } else {
        window.location.href = 'index.html'; // Redirect ke halaman login jika tidak ada pengguna yang login
    }
}

function displayRegisteredUsers() {
    const users = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    const userTableBody = document.querySelector('#dataTable tbody');

    userTableBody.innerHTML = '';

    users.forEach(function(username, index) {
        const userData = localStorage.getItem(username);
        let user;

        if (userData) {
            try {
                user = JSON.parse(userData);
            } catch (e) {
                console.error(`Error parsing user data for ${username}:`, e);
                return;
            }
        }

        if (user && user.name && user.nip && user.password) {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${username.substring(5)}</td> <!-- Remove 'user_' prefix for display -->
                <td>${user.name}</td>
                <td>${user.nip}</td>
                <td>
                    <a href="#" class="btn btn-success" onclick="openEditModal('${username}')">
                        <i class="fas fa-edit text-white"></i>
                    </a>
                    <a href="#" class="btn btn-danger" onclick="deleteUser('${username}')">
                        <i class="fas fa-trash text-white"></i>
                    </a>
                </td>
            `;
            userTableBody.appendChild(row);
        } else {
            console.warn(`Incomplete user data for ${username}:`, user);
        }
    });
}

function deleteUser(username) {
    if (confirm(`Apakah Anda yakin ingin menghapus user ${username.substring(5)}?`)) {
        localStorage.removeItem(username);
        displayRegisteredUsers(); // Refresh daftar user setelah penghapusan
        countRegisteredUsers(); // Update jumlah akun setelah penghapusan
    }
}

function clearAccountData() {
    if (confirm('Are you sure you want to clear all account data?')) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('user_')) {
                localStorage.removeItem(key);
            }
        });
        displayRegisteredUsers(); // Refresh the user list after clearing
        countRegisteredUsers(); // Update jumlah akun setelah localStorage dihapus
        alert('All account data has been cleared.');
    }
}

function openEditModal(username) {
    const user = JSON.parse(localStorage.getItem(username));

    if (user) {
        document.getElementById('edit-username').value = username.substring(5); // Remove 'user_' prefix for editing
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-nip').value = user.nip;
        document.getElementById('edit-password').value = user.password;

        $('#editModal').modal('show'); // Use jQuery to show the modal
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveEdit() {
    const username = `user_${document.getElementById('edit-username').value}`;
    const name = document.getElementById('edit-name').value;
    const nip = document.getElementById('edit-nip').value;
    const password = document.getElementById('edit-password').value;

    const user = { name: name, nip: nip, password: password };
    localStorage.setItem(username, JSON.stringify(user));
    closeEditModal();
    window.location.href = 'akun.html'; // Refresh the user list after editing
}
