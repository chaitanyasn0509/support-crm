// Ticket Detail Logic

// Utility to show toasts
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    toast.className = `toast-enter ${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[250px]`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Apply status styling
function styleStatusBadge(element, status) {
    element.textContent = status;
    element.className = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
    if (status === "Open") element.classList.add("bg-yellow-100", "text-yellow-800");
    else if (status === "In Progress") element.classList.add("bg-blue-100", "text-blue-800");
    else if (status === "Closed") element.classList.add("bg-green-100", "text-green-800");
    else element.classList.add("bg-gray-100", "text-gray-800");
}

// Load ticket data
async function loadTicket() {
    try {
        const res = await fetch(`/api/tickets/${CURRENT_TICKET_ID}`);
        
        if (!res.ok) {
            document.getElementById('loading').innerHTML = `
                <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500"></i>
                <p class="mt-2 text-red-500 font-medium">Ticket not found or error loading.</p>
                <button onclick="window.location.href='/'" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Back</button>
            `;
            return;
        }
        
        const ticket = await res.json();
        
        // Populate UI
        document.getElementById('ticketId').textContent = ticket.ticket_id;
        document.getElementById('ticketSubject').textContent = ticket.subject;
        document.getElementById('ticketDate').textContent = formatDate(ticket.created_at);
        document.getElementById('customerName').textContent = ticket.customer_name;
        document.getElementById('customerEmail').textContent = ticket.customer_email;
        document.getElementById('customerAvatar').textContent = ticket.customer_name.charAt(0).toUpperCase();
        document.getElementById('ticketDescription').textContent = ticket.description;
        
        styleStatusBadge(document.getElementById('ticketStatusBadge'), ticket.status);
        
        // Populate form
        document.getElementById('status').value = ticket.status;
        document.getElementById('notes').value = ticket.notes || "";
        
        // Show content, hide loader
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('ticketContent').classList.remove('hidden');
        
    } catch (error) {
        console.error("Error loading ticket:", error);
        showToast("Error loading ticket details.", "error");
    }
}

// Handle update form submission
async function handleUpdateTicket(e) {
    e.preventDefault();
    
    const btn = document.getElementById('updateBtn');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Saving...';
    btn.disabled = true;
    
    const data = {
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value
    };
    
    try {
        const res = await fetch(`/api/tickets/${CURRENT_TICKET_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            const updatedTicket = await res.json();
            showToast("Ticket updated successfully!");
            
            // Update badge in UI without reload
            styleStatusBadge(document.getElementById('ticketStatusBadge'), updatedTicket.status);
        } else {
            const err = await res.json();
            showToast(err.detail || "Failed to update ticket", "error");
        }
    } catch (error) {
        showToast("An error occurred", "error");
    } finally {
        btn.innerHTML = '<span>Save Updates</span>';
        btn.disabled = false;
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadTicket);
