// dashboard.js - Vintage Village Dashboard JavaScript

// ============================================
// 1. INITIALIZATION
// ============================================

let charts = {};
let dashboardData = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    updateDateTime();
    trackVisit();
    loadDashboardData();
    setupEventListeners();
}

// ============================================
// 2. DATA LOADING FUNCTIONS
// ============================================

function loadDashboardData() {
    // Load all data
    dashboardData = {
        products: getAllProducts(),
        comments: getAllComments(),
        cart: getCartData(),
        visits: getVisitsData(),
        sales: generateSalesData()
    };
    
    updateSummaryCards();
    updateQuickStats();
    createCharts();
    loadDataTables();
    updateSystemInfo();
}

// Get products from localStorage
function getAllProducts() {
    try {
        return JSON.parse(localStorage.getItem('vintageVillageProducts') || '[]');
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Get comments from localStorage
function getAllComments() {
    try {
        return JSON.parse(localStorage.getItem('product_comments') || '[]');
    } catch (error) {
        console.error('Error loading comments:', error);
        return [];
    }
}

// Get cart data
function getCartData() {
    try {
        return JSON.parse(localStorage.getItem('vintageVillageCart') || '[]');
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

// Get visits data
function getVisitsData() {
    try {
        return JSON.parse(localStorage.getItem('vintageVillageVisits') || '{}');
    } catch (error) {
        console.error('Error loading visits:', error);
        return {};
    }
}

// Generate sales data (mock for demo)
function generateSalesData() {
    const products = getAllProducts();
    const categories = ['men', 'women', 'kids', 'accessories'];
    
    // Generate 30 days of sales data
    const sales = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        categories.forEach(category => {
            const count = Math.floor(Math.random() * 10);
            const revenue = count * (Math.floor(Math.random() * 100) + 20);
            
            if (count > 0) {
                sales.push({
                    date: dateStr,
                    category: category,
                    count: count,
                    revenue: revenue
                });
            }
        });
    }
    
    return sales;
}

// Track a visit
function trackVisit() {
    const today = new Date().toISOString().split('T')[0];
    const visits = getVisitsData();
    
    if (!visits[today]) {
        visits[today] = 0;
    }
    visits[today]++;
    
    try {
        localStorage.setItem('vintageVillageVisits', JSON.stringify(visits));
    } catch (error) {
        console.error('Error saving visit:', error);
    }
}

// ============================================
// 3. STATISTICS CALCULATION
// ============================================

function calculateProductStats() {
    const products = dashboardData.products;
    
    const stats = {
        total: products.length,
        categories: {},
        totalValue: 0,
        totalStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0
    };
    
    products.forEach(product => {
        // Category count
        stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
        
        // Total value
        stats.totalValue += product.price * (product.quantity || 1);
        
        // Stock levels
        stats.totalStock += product.quantity || 0;
        
        if (product.quantity === 0) {
            stats.outOfStockCount++;
        } else if (product.quantity < 10) {
            stats.lowStockCount++;
        }
    });
    
    stats.averagePrice = stats.total > 0 ? stats.totalValue / stats.total : 0;
    
    return stats;
}

function calculateCommentStats() {
    const comments = dashboardData.comments;
    
    return {
        total: comments.length,
        recent: comments.slice(-10).reverse()
    };
}

function calculateSalesStats() {
    const sales = dashboardData.sales;
    const stats = {
        totalRevenue: 0,
        totalItems: 0,
        revenueByCategory: {},
        itemsByCategory: {},
        dailyRevenue: {}
    };
    
    sales.forEach(sale => {
        stats.totalRevenue += sale.revenue;
        stats.totalItems += sale.count;
        
        // By category
        stats.revenueByCategory[sale.category] = (stats.revenueByCategory[sale.category] || 0) + sale.revenue;
        stats.itemsByCategory[sale.category] = (stats.itemsByCategory[sale.category] || 0) + sale.count;
        
        // Daily
        stats.dailyRevenue[sale.date] = (stats.dailyRevenue[sale.date] || 0) + sale.revenue;
    });
    
    stats.averageOrderValue = stats.totalItems > 0 ? stats.totalRevenue / stats.totalItems : 0;
    
    return stats;
}

function calculateTrafficStats() {
    const visits = dashboardData.visits;
    const dates = Object.keys(visits).sort();
    const last7Days = dates.slice(-7);
    
    const stats = {
        totalVisits: 0,
        visitsLast7Days: 0,
        dailyVisits: [],
        todayVisits: 0
    };
    
    dates.forEach(date => {
        stats.totalVisits += visits[date];
        if (last7Days.includes(date)) {
            stats.visitsLast7Days += visits[date];
            stats.dailyVisits.push({ date: date, visits: visits[date] });
        }
    });
    
    const today = new Date().toISOString().split('T')[0];
    stats.todayVisits = visits[today] || 0;
    
    return stats;
}

// ============================================
// 4. UI UPDATE FUNCTIONS
// ============================================

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    document.getElementById('currentDateTime').textContent = 
        now.toLocaleDateString('en-US', options);
    
    // Update every second
    setTimeout(updateDateTime, 1000);
}

function updateSummaryCards() {
    const productStats = calculateProductStats();
    const commentStats = calculateCommentStats();
    const salesStats = calculateSalesStats();
    const trafficStats = calculateTrafficStats();
    
    // Total Products
    document.getElementById('cardTotalProducts').textContent = productStats.total;
    document.getElementById('productTrend').innerHTML = 
        `<i class="fas fa-arrow-up"></i> +${Math.floor(Math.random() * 5)}% from last month`;
    
    // Total Sales
    document.getElementById('totalSales').textContent = 
        `$${salesStats.totalRevenue.toLocaleString()}`;
    document.getElementById('salesTrend').innerHTML = 
        `<i class="fas fa-arrow-up"></i> +${Math.floor(Math.random() * 15)}% from last month`;
    
    // Total Comments
    document.getElementById('cardTotalComments').textContent = commentStats.total;
    document.getElementById('commentsTrend').innerHTML = 
        `<i class="fas fa-arrow-up"></i> +${Math.floor(commentStats.total / 10)} this week`;
    
    // Total Views
    document.getElementById('totalViews').textContent = 
        trafficStats.totalVisits.toLocaleString();
    document.getElementById('viewsTrend').innerHTML = 
        `<i class="fas fa-arrow-up"></i> +${Math.floor(trafficStats.visitsLast7Days / 7)} avg/day`;
}

function updateQuickStats() {
    const productStats = calculateProductStats();
    const commentStats = calculateCommentStats();
    const trafficStats = calculateTrafficStats();
    const salesStats = calculateSalesStats();
    
    document.getElementById('totalProducts').textContent = productStats.total;
    document.getElementById('totalComments').textContent = commentStats.total;
    document.getElementById('visitsToday').textContent = trafficStats.todayVisits;
    document.getElementById('salesToday').textContent = 
        `$${Math.floor(salesStats.totalRevenue / 30).toLocaleString()}`;
}

function loadDataTables() {
    loadProductsTable();
    loadCommentsTable();
}

function loadProductsTable() {
    const products = dashboardData.products.slice(-5).reverse();
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        
        // Determine stock status
        let statusClass = 'in-stock';
        let statusText = 'In Stock';
        
        if (product.quantity === 0) {
            statusClass = 'out-of-stock';
            statusText = 'Out of Stock';
        } else if (product.quantity < 10) {
            statusClass = 'low-stock';
            statusText = 'Low Stock';
        }
        
        tr.innerHTML = `
            <td>#VV${product.id.toString().padStart(4, '0')}</td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity || 0}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}

function loadCommentsTable() {
    const comments = dashboardData.comments.slice(-5).reverse();
    const tbody = document.getElementById('commentsTableBody');
    tbody.innerHTML = '';
    
    comments.forEach(comment => {
        const tr = document.createElement('tr');
        
        // Format date
        const date = new Date();
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        tr.innerHTML = `
            <td>${comment.name || 'Anonymous'}</td>
            <td class="comment-preview">${comment.text.substring(0, 50)}${comment.text.length > 50 ? '...' : ''}</td>
            <td>${dateStr}</td>
            <td>${getRandomProduct()}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

function updateSystemInfo() {
    // Calculate storage usage
    let totalBytes = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalBytes += localStorage[key].length * 2; // Approximate byte count
        }
    }
    
    const storageMB = (totalBytes / (1024 * 1024)).toFixed(2);
    document.getElementById('storageUsage').textContent = `${storageMB} MB`;
    
    // Update last backup
    const lastBackup = localStorage.getItem('dashboard_lastBackup');
    if (lastBackup) {
        document.getElementById('lastBackup').textContent = 
            new Date(lastBackup).toLocaleDateString();
    }
    
    // Update data updated time
    document.getElementById('dataUpdated').textContent = 'Just now';
}

// ============================================
// 5. CHART CREATION FUNCTIONS
// ============================================

function createCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    charts = {
        categoryChart: createCategoryChart(),
        trafficChart: createTrafficChart(),
        commentsChart: createCommentsChart(),
        priceChart: createPriceChart(),
        inventoryChart: createInventoryChart(),
        salesChart: createSalesChart()
    };
}

function createCategoryChart() {
    const productStats = calculateProductStats();
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const categoryNames = {
        'men': "Men's",
        'women': "Women's",
        'kids': "Kids'",
        'accessories': "Accessories"
    };
    
    const labels = Object.keys(productStats.categories).map(key => categoryNames[key]);
    const data = Object.values(productStats.categories);
    const colors = ['#e67e22', '#3498db', '#9b59b6', '#2ecc71'];
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function createTrafficChart() {
    const trafficStats = calculateTrafficStats();
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    const labels = trafficStats.dailyVisits.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();
    
    const data = trafficStats.dailyVisits.map(day => day.visits).reverse();
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Visits',
                data: data,
                borderColor: '#e67e22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createCommentsChart() {
    const comments = dashboardData.comments;
    const ctx = document.getElementById('commentsChart').getContext('2d');
    
    // Group by day (last 7 days)
    const days = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        // Count comments for this day
        const dayComments = comments.filter(comment => {
            // Since we don't have real dates, simulate distribution
            return Math.random() > 0.7;
        });
        
        data.push(dayComments.length);
    }
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Comments',
                data: data,
                backgroundColor: 'rgba(155, 89, 182, 0.8)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createPriceChart() {
    const products = dashboardData.products;
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Price ranges
    const ranges = [
        { label: '$0-50', min: 0, max: 50, count: 0 },
        { label: '$51-100', min: 51, max: 100, count: 0 },
        { label: '$101-200', min: 101, max: 200, count: 0 },
        { label: '$201-500', min: 201, max: 500, count: 0 },
        { label: '$500+', min: 501, max: Infinity, count: 0 }
    ];
    
    products.forEach(product => {
        const price = product.price;
        const range = ranges.find(r => price >= r.min && price <= r.max);
        if (range) range.count++;
    });
    
    const labels = ranges.map(r => r.label);
    const data = ranges.map(r => r.count);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Products',
                data: data,
                backgroundColor: 'rgba(46, 204, 113, 0.8)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createInventoryChart() {
    const productStats = calculateProductStats();
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
    const data = [
        productStats.total - productStats.lowStockCount - productStats.outOfStockCount,
        productStats.lowStockCount,
        productStats.outOfStockCount
    ];
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statuses,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(244, 67, 54, 0.8)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function createSalesChart() {
    const salesStats = calculateSalesStats();
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    const categoryNames = {
        'men': "Men's",
        'women': "Women's",
        'kids': "Kids'",
        'accessories': "Accessories"
    };
    
    const labels = Object.keys(salesStats.revenueByCategory).map(key => categoryNames[key]);
    const data = Object.values(salesStats.revenueByCategory);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue ($)',
                data: data,
                backgroundColor: 'rgba(230, 126, 34, 0.8)',
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// ============================================
// 6. HELPER FUNCTIONS
// ============================================

function getCategoryName(categoryCode) {
    const categories = {
        'men': "Men's Clothing",
        'women': "Women's Clothing",
        'kids': "Kids' Clothing",
        'accessories': "Accessories"
    };
    
    return categories[categoryCode] || 'Uncategorized';
}

function getRandomProduct() {
    const products = dashboardData.products;
    if (products.length === 0) return 'N/A';
    
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex].name.substring(0, 20) + '...';
}

// ============================================
// 7. EVENT HANDLERS
// ============================================

function setupEventListeners() {
    // Time range selector
    document.getElementById('timeRange').addEventListener('change', function() {
        refreshDashboard();
    });
}

function refreshDashboard() {
    loadDashboardData();
    showNotification('Dashboard refreshed successfully!', 'success');
}

function exportDashboardData() {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vintage-village-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Save backup timestamp
    localStorage.setItem('dashboard_lastBackup', new Date().toISOString());
    updateSystemInfo();
    
    showNotification('Data exported successfully!', 'success');
}

function viewAllProducts() {
    alert('In a full implementation, this would show all products in a separate view.');
    // window.location.href = '../productmanager/all-products.html';
}

function viewAllComments() {
    alert('In a full implementation, this would show all comments in a separate view.');
    // window.location.href = '../productmanager/all-comments.html';
}

function viewAnalytics() {
    alert('Detailed analytics view would open here.');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add CSS for slideIn animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ============================================
// 8. DATA MANAGEMENT
// ============================================

// Clean up old data (optional)
function cleanupOldData() {
    const visits = getVisitsData();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(visits).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
            delete visits[date];
        }
    });
    
    localStorage.setItem('vintageVillageVisits', JSON.stringify(visits));
}

// Initialize cleanup on first load of the day
const lastCleanup = localStorage.getItem('dashboard_lastCleanup');
const today = new Date().toISOString().split('T')[0];

if (lastCleanup !== today) {
    cleanupOldData();
    localStorage.setItem('dashboard_lastCleanup', today);
}