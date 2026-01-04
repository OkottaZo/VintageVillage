<?php
session_start();
// Security Check: Only the admin can stay here
if (!isset($_SESSION['email']) || $_SESSION['email'] !== "admin@website.com") {
    header("Location: ../main/main.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VV Admin | Full CRUD Dashboard</title>
    <link rel="stylesheet" href="admin-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* MODAL STYLES (The popup form) */
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); }
        .modal-content { background: white; margin: 10% auto; padding: 25px; width: 400px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .modal-header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .btn-save { background: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; font-size: 16px; }
        .btn-add { background: #d4af37; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        
        table { width: 100%; border-collapse: collapse; background: white; margin-top: 10px; }
        th, td { padding: 12px; border: 1px solid #eee; text-align: left; }
        th { background: #f8f9fa; }
        .actions button { background: none; border: none; cursor: pointer; margin-right: 10px; font-size: 16px; }
    </style>
</head>
<body>

<div class="admin-container" style="display: flex; min-height: 100vh;">
    <aside class="sidebar" style="width: 250px; background: #2c3e50; color: white; padding: 20px;">
        <h2 style="color: #d4af37; text-align: center;">VV Admin</h2>
        <ul style="list-style: none; padding: 0; margin-top: 30px;">
            <li style="padding: 15px; background: #34495e; border-radius: 5px;"><a href="#" style="color: white; text-decoration: none;"><i class="fas fa-users"></i> Users Management</a></li>
            <li style="padding: 15px;"><a href="../main/main.php" style="color: white; text-decoration: none;"><i class="fas fa-eye"></i> View Site</a></li>
            <li style="padding: 15px;"><a href="#" onclick="logout()" style="color: white; text-decoration: none;"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    </aside>

    <main style="flex: 1; padding: 40px; background: #f4f7f6;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h1>Villager Database</h1>
            <div class="stats">Total Users: <span id="user-count" style="font-weight: bold; color: #d4af37;">0</span></div>
        </header>

        <button class="btn-add" onclick="openModal()"><i class="fas fa-user-plus"></i> Add New User</button>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="user-rows">
                </tbody>
        </table>
    </main>
</div>

<div id="userModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Add New User</h2>
            <span onclick="closeModal()" style="cursor:pointer; font-size: 24px;">&times;</span>
        </div>
        
        <input type="hidden" id="edit-index">

        <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="user-name" placeholder="Enter name">
        </div>
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="user-email" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label>Role</label>
            <select id="user-role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
        </div>
        <button class="btn-save" onclick="saveUser()">Save Villager</button>
    </div>
</div>

[Image of a CRUD operations diagram showing Create, Read, Update, and Delete actions on a database]

<script>
    // 1. Get existing data from LocalStorage
    let users = JSON.parse(localStorage.getItem('villageUsers')) || [];

    // 2. READ: Display users in table
    function displayUsers() {
        const tableBody = document.getElementById('user-rows');
        const countDisplay = document.getElementById('user-count');
        tableBody.innerHTML = "";

        users.forEach((u, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td style="text-transform: capitalize;">${u.role}</td>
                    <td class="actions">
                        <button onclick="openModal(${index})" style="color: #3498db;"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteUser(${index})" style="color: #e74c3c;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        countDisplay.innerText = users.length;
        // Keep storage in sync
        localStorage.setItem('villageUsers', JSON.stringify(users));
    }

    // 3. OPEN MODAL (For both Add and Edit)
    function openModal(index = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('modalTitle');
        const editIdx = document.getElementById('edit-index');
        
        modal.style.display = 'block';

        if (index !== null) {
            // Edit Mode
            title.innerText = "Edit Villager";
            editIdx.value = index;
            document.getElementById('user-name').value = users[index].name;
            document.getElementById('user-email').value = users[index].email;
            document.getElementById('user-role').value = users[index].role;
        } else {
            // Add Mode
            title.innerText = "Add New Villager";
            editIdx.value = "";
            document.getElementById('user-name').value = "";
            document.getElementById('user-email').value = "";
            document.getElementById('user-role').value = "user";
        }
    }

    function closeModal() {
        document.getElementById('userModal').style.display = 'none';
    }

    // 4. CREATE & UPDATE: Save logic
    function saveUser() {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const role = document.getElementById('user-role').value;
        const editIdx = document.getElementById('edit-index').value;

        if (!name || !email) {
            alert("Please fill in all fields");
            return;
        }

        const userData = { name, email, role };

        if (editIdx === "") {
            // CREATE: Add to list
            users.push(userData);
        } else {
            // UPDATE: Modify existing index
            users[editIdx] = userData;
        }

        displayUsers();
        closeModal();
    }

    // 5. DELETE
    function deleteUser(index) {
        if (confirm("Delete this villager forever?")) {
            users.splice(index, 1);
            displayUsers();
        }
    }

    function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        window.location.href = '../logout/logout.php';
    }

    // Initial Load
    displayUsers();
</script>

</body>
</html>