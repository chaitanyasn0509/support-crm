// Dashboard Logic

// Utility to show toasts
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Set colors based on type
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    toast.className = `toast-enter ${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[250px]`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300); // Wait for animation to finish
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Get status badge HTML
function getStatusBadge(status) {
    let classes = "";
    if (status === "Open") classes = "bg-yellow-100 text-yellow-800";
    else if (status === "In Progress") classes = "bg-blue-100 text-blue-800";
    else if (status === "Closed") classes = "bg-green-100 text-green-800";
    else classes = "bg-gray-100 text-gray-800";

    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}">${status}</span>`;
}

// Toggle Modal
function toggleModal(modalID) {
    const modal = document.getElementById(modalID);
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Prevent background scrolling
    } else {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

// Fetch stats and update cards
async function loadStats() {
    try {
        const res = await fetch('/api/tickets/stats');
        const stats = await res.json();
        
        const container = document.getElementById('stats-container');
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                        <i class="fa-solid fa-ticket text-xl"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Total Tickets</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.total}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                        <i class="fa-solid fa-folder-open text-xl"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Open</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.open}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
                        <i class="fa-solid fa-spinner text-xl"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">In Progress</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.in_progress}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                        <i class="fa-solid fa-check-circle text-xl"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Closed</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.closed}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// Fetch tickets and update table
async function loadTickets() {
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;
    
    let url = '/api/tickets?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (status) url += `status=${encodeURIComponent(status)}&`;
    
    try {
        const res = await fetch(url);
        const tickets = await res.json();
        
        const tbody = document.getElementById('ticketsList');
        
        if (tickets.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">No tickets found.</td></tr>`;
            return;
        }
        
        tbody.innerHTML = tickets.map(ticket => `
            <tr class="hover:bg-gray-50 cursor-pointer" onclick="window.location.href='/ticket/${ticket.ticket_id}'">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-blue-600">${ticket.ticket_id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                            ${ticket.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">${ticket.customer_name}</div>
                            <div class="text-sm text-gray-500">${ticket.customer_email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 truncate max-w-xs">${ticket.subject}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${getStatusBadge(ticket.status)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(ticket.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="/ticket/${ticket.ticket_id}" class="text-blue-600 hover:text-blue-900"><i class="fa-solid fa-chevron-right"></i></a>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Error loading tickets:", error);
        document.getElementById('ticketsList').innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Error loading tickets.</td></tr>`;
    }
}

// Handle form submission for new ticket
async function handleCreateTicket(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Creating...';
    btn.disabled = true;
    
    const data = {
        customer_name: document.getElementById('customer_name').value,
        customer_email: document.getElementById('customer_email').value,
        subject: document.getElementById('subject').value,
        description: document.getElementById('description').value,
    };
    
    try {
        const res = await fetch('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showToast("Ticket created successfully!");
            document.getElementById('createTicketForm').reset();
            toggleModal('createTicketModal');
            loadStats();
            loadTickets();
        } else {
            const err = await res.json();
            showToast(err.detail || "Failed to create ticket", "error");
        }
    } catch (error) {
        showToast("An error occurred", "error");
    } finally {
        btn.innerHTML = '<span>Create Ticket</span>';
        btn.disabled = false;
    }
}

// Event Listeners for search and filter
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadTickets(), 500); // debounce search
});

document.getElementById('statusFilter').addEventListener('change', () => {
    loadTickets();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadTickets();
});
