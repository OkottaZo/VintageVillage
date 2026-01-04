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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VV Admin | Full Control Hub</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-gold: #d4af37;
            --dark-bg: #2c3e50;
            --light-bg: #f4f7f6;
            --sidebar-width: 260px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { background: var(--light-bg); display: flex; min-height: 100vh; color: #333; }

        /* Sidebar */
        .sidebar { width: var(--sidebar-width); background: var(--dark-bg); color: white; position: fixed; height: 100vh; transition: 0.3s; z-index: 1000; }
        .sidebar-header { padding: 30px 20px; text-align: center; border-bottom: 1px solid #34495e; }
        .sidebar-header h2 { color: var(--primary-gold); letter-spacing: 2px; }
        .sidebar-menu { list-style: none; padding: 20px 0; }
        .sidebar-menu li { padding: 15px 25px; cursor: pointer; border-left: 4px solid transparent; transition: 0.3s; }
        .sidebar-menu li:hover, .sidebar-menu li.active { background: #34495e; border-left-color: var(--primary-gold); }
        .sidebar-menu a { color: white; text-decoration: none; display: flex; align-items: center; gap: 15px; }

        /* Main Content */
        .main-wrapper { flex: 1; margin-left: var(--sidebar-width); padding: 30px; transition: 0.3s; width: 100%; }

        /* Top Bar */
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; background: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .top-bar h1 { font-size: 22px; color: var(--dark-bg); }

        /* Sales Dashboard Section */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 20px; }
        .stat-icon { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .blue { background: #e3f2fd; color: #1976d2; }
        .gold { background: #fffde7; color: #fbc02d; }
        .green { background: #e8f5e9; color: #2e7d32; }

        /* Monthly Sales Chart (CSS) */
        .chart-section { background: white; padding: 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .bar-container { display: flex; align-items: flex-end; justify-content: space-between; height: 180px; margin-top: 20px; padding: 0 10px; border-bottom: 2px solid #eee; }
        .bar-group { display: flex; flex-direction: column; align-items: center; width: 12%; }
        .bar { width: 100%; background: var(--primary-gold); border-radius: 6px 6px 0 0; transition: 0.5s; }
        .bar:hover { background: var(--dark-bg); }
        .bar-label { font-size: 11px; font-weight: bold; color: #888; margin-top: 8px; }

        /* User Table Section */
        .table-section { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn-add { background: var(--primary-gold); color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 15px; background: #f9fafb; color: #666; font-size: 14px; }
        td { padding: 15px; border-top: 1px solid #eee; font-size: 14px; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .user { background: #e8f5e9; color: #2e7d32; }
        .admin { background: #fff3e0; color: #ef6c00; }

        /* Modal */
        .modal { display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); }
        .modal-content { background: white; margin: 8% auto; padding: 30px; width: 90%; max-width: 400px; border-radius: 15px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }

        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); }
            .main-wrapper { margin-left: 0; padding: 15px; }
            .sidebar.active { transform: translateX(0); }
        }
    </style>
</head>
<body>

    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header"><h2>VV ADMIN</h2></div>
        <ul class="sidebar-menu">
            <li class="active"><a href="#"><i class="fas fa-desktop"></i> Dashboard Hub</a></li>
            <li><a href="../main/main.php"><i class="fas fa-shopping-bag"></i> View Site</a></li>
            <li><a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    </aside>

    <div class="main-wrapper">
        <div class="top-bar">
            <h1>Control Panel Overview</h1>
            <div id="date-display"><strong>Jan 2026</strong></div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                <div><h3 id="stat-total-users">0</h3><p>Total Villagers</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-dollar-sign"></i></div>
                <div><h3 id="stat-revenue">$1,250</h3><p>Monthly Revenue</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon gold"><i class="fas fa-shopping-cart"></i></div>
                <div><h3>48</h3><p>Total Orders</p></div>
            </div>
        </div>

        <div class="chart-section">
            <h2 style="font-size: 18px;">Monthly Performance (Sales Growth)</h2>
            <div class="bar-container">
                <div class="bar-group"><div class="bar" style="height: 45%;"></div><span class="bar-label">AUG</span></div>
                <div class="bar-group"><div class="bar" style="height: 65%;"></div><span class="bar-label">SEP</span></div>
                <div class="bar-group"><div class="bar" style="height: 30%;"></div><span class="bar-label">OCT</span></div>
                <div class="bar-group"><div class="bar" style="height: 90%;"></div><span class="bar-label">NOV</span></div>
                <div class="bar-group"><div class="bar" style="height: 75%;"></div><span class="bar-label">DEC</span></div>
                <div class="bar-group"><div class="bar" style="height: 95%;"></div><span class="bar-label">JAN</span></div>
            </div>
        </div>

        <div class="table-section">
            <div class="table-header">
                <h2>Manage Registered Users</h2>
                <button class="btn-add" onclick="openModal()"><i class="fas fa-user-plus"></i> Add New User</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="user-rows">
                    </tbody>
            </table>
        </div>
    </div>

    <div id="userModal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle" style="margin-bottom: 20px;">User Form</h2>
            <input type="hidden" id="edit-index">
            <div class="form-group"><label>Full Name</label><input type="text" id="user-name"></div>
            <div class="form-group"><label>Email</label><input type="email" id="user-email"></div>
            <div class="form-group">
                <label>Role</label>
                <select id="user-role"><option value="user">User</option><option value="admin">Admin</option></select>
            </div>
            <button class="btn-add" style="width: 100%;" onclick="saveUser()">Save Villager</button>
            <button onclick="closeModal()" style="width:100%; background:none; color:red; border:none; margin-top:10px; cursor:pointer;">Cancel</button>
        </div>
    </div>

    <script>
        // Data Handling
        let users = JSON.parse(localStorage.getItem('villageUsers')) || [];

        function displayData() {
            const tableBody = document.getElementById('user-rows');
            const userStat = document.getElementById('stat-total-users');
            tableBody.innerHTML = "";

            users.forEach((u, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${u.name}</strong></td>
                        <td>${u.email}</td>
                        <td><span class="badge ${u.role}">${u.role}</span></td>
                        <td>
                            <button onclick="openModal(${index})" style="color:blue; border:none; background:none; cursor:pointer; margin-right:10px;"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteUser(${index})" style="color:red; border:none; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
            userStat.innerText = users.length;
            localStorage.setItem('villageUsers', JSON.stringify(users));
        }

        // CRUD Functions
        function openModal(index = null) {
            const modal = document.getElementById('userModal');
            document.getElementById('edit-index').value = index !== null ? index : "";
            if (index !== null) {
                document.getElementById('user-name').value = users[index].name;
                document.getElementById('user-email').value = users[index].email;
                document.getElementById('user-role').value = users[index].role;
            } else {
                document.getElementById('user-name').value = "";
                document.getElementById('user-email').value = "";
                document.getElementById('user-role').value = "user";
            }
            modal.style.display = 'block';
        }

        function closeModal() { document.getElementById('userModal').style.display = 'none'; }

        function saveUser() {
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('user-role').value;
            const idx = document.getElementById('edit-index').value;

            if (idx === "") users.push({name, email, role});
            else users[idx] = {name, email, role};

            displayData();
            closeModal();
        }

        function deleteUser(index) {
            if(confirm("Permanently delete this user?")) {
                users.splice(index, 1);
                displayData();
            }
        }

        function logout() {
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            window.location.href = '../logout/logout.php';
        }

        // Initial Load
        displayData();
    </script>
</body>
</html>