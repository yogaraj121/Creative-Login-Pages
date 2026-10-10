// Sample Turf Data
const turfs = [
    {
        id: 1,
        name: 'Premier Sports Arena',
        location: 'Downtown, City Center',
        rating: 4.8,
        reviews: 120,
        price: 500,
        sports: 'Cricket, Football',
        capacity: '50-100 players',
        image: '⚽'
    },
    {
        id: 2,
        name: 'Elite Turf Complex',
        location: 'Tech Park, Business District',
        rating: 4.9,
        reviews: 180,
        price: 600,
        sports: 'Football, Badminton',
        capacity: '40-80 players',
        image: '🏟️'
    },
    {
        id: 3,
        name: 'Victory Ground',
        location: 'North Avenue, Suburbs',
        rating: 4.7,
        reviews: 95,
        price: 450,
        sports: 'Cricket, Tennis',
        capacity: '60-120 players',
        image: '🎾'
    },
    {
        id: 4,
        name: 'Champions Stadium',
        location: 'West Side, Sports Hub',
        rating: 4.9,
        reviews: 210,
        price: 700,
        sports: 'All Sports',
        capacity: '100-200 players',
        image: '🏆'
    },
    {
        id: 5,
        name: 'Green Valley Sports',
        location: 'East End, Residential',
        rating: 4.6,
        reviews: 78,
        price: 400,
        sports: 'Football, Badminton',
        capacity: '30-60 players',
        image: '🌿'
    },
    {
        id: 6,
        name: 'Professional Turf Hub',
        location: 'Central Plaza, Downtown',
        rating: 4.8,
        reviews: 160,
        price: 550,
        sports: 'All Sports',
        capacity: '50-100 players',
        image: '💪'
    }
];

// Time slots
const timeSlots = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
];

let selectedTurf = null;
let selectedSlot = null;
let currentBookingData = {};

// DOM Elements
const turfGrid = document.getElementById('turfGrid');
const bookingModal = document.getElementById('bookingModal');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeModal = document.getElementById('closeModal');
const closeLogin = document.getElementById('closeLogin');
const successToast = document.getElementById('successToast');
const searchBtn = document.getElementById('searchBtn');
const exploreBtn = document.getElementById('exploreBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTurfs(turfs);
    setupEventListeners();
});

function setupEventListeners() {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    closeModal.addEventListener('click', () => {
        bookingModal.classList.remove('active');
    });

    document.getElementById('cancelBooking').addEventListener('click', () => {
        bookingModal.classList.remove('active');
    });

    document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
    document.getElementById('duration').addEventListener('change', updatePrice);
    document.getElementById('bookingDate').addEventListener('change', generateTimeSlots);
    searchBtn.addEventListener('click', handleSearch);
    exploreBtn.addEventListener('click', () => {
        document.getElementById('turfs').scrollIntoView({ behavior: 'smooth' });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) bookingModal.classList.remove('active');
        if (e.target === loginModal) loginModal.classList.remove('active');
    });
}

function renderTurfs(data) {
    turfGrid.innerHTML = data.map(turf => `
        <div class="turf-card">
            <div class="turf-image">${turf.image}</div>
            <div class="turf-info">
                <div class="turf-name">${turf.name}</div>
                <div class="turf-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${turf.location}
                </div>
                <div class="turf-rating">
                    <i class="fas fa-star"></i>
                    ${turf.rating} (${turf.reviews} reviews)
                </div>
                <div class="turf-price">₹${turf.price}/hour</div>
                <button class="turf-button" onclick="openBooking(${turf.id})">
                    <i class="fas fa-calendar-check"></i> Book Now
                </button>
            </div>
        </div>
    `).join('');
}

function openBooking(turfId) {
    selectedTurf = turfs.find(t => t.id === turfId);
    if (!selectedTurf) return;

    // Update modal header
    document.getElementById('modalTurfName').textContent = selectedTurf.name;
    document.getElementById('modalLocation').textContent = selectedTurf.location;
    document.getElementById('modalSports').textContent = selectedTurf.sports;
    document.getElementById('modalCapacity').textContent = selectedTurf.capacity;
    document.getElementById('modalRating').innerHTML = `
        <i class="fas fa-star"></i> ${selectedTurf.rating} (${selectedTurf.reviews} reviews)
    `;

    // Set today's date as minimum
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    document.getElementById('bookingDate').value = today;

    // Generate time slots
    generateTimeSlots();

    // Set initial price
    document.getElementById('slotPrice').textContent = `₹${selectedTurf.price}`;
    document.getElementById('totalPrice').textContent = `₹${selectedTurf.price + 50}`;

    // Open modal
    bookingModal.classList.add('active');
}

function generateTimeSlots() {
    const slotsGrid = document.getElementById('slotsGrid');
    slotsGrid.innerHTML = timeSlots.map((slot, index) => `
        <div class="time-slot" onclick="selectSlot(this, '${slot}')">
            ${slot}
        </div>
    `).join('');
}

function selectSlot(element, slot) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    
    // Add selection to clicked slot
    element.classList.add('selected');
    selectedSlot = slot;
}

function updatePrice() {
    if (!selectedTurf) return;
    
    const duration = parseInt(document.getElementById('duration').value);
    const basePrice = selectedTurf.price * duration;
    const tax = Math.round(basePrice * 0.1);
    const total = basePrice + tax;
    
    document.getElementById('slotPrice').textContent = `₹${basePrice}`;
    document.getElementById('totalPrice').textContent = `₹${total}`;
}

function confirmBooking() {
    if (!selectedSlot) {
        alert('Please select a time slot');
        return;
    }

    const date = document.getElementById('bookingDate').value;
    const duration = document.getElementById('duration').value;

    // Show success toast
    successToast.classList.add('show');
    document.getElementById('toastMessage').textContent = `Booking confirmed for ${selectedTurf.name} on ${date} at ${selectedSlot}!`;

    // Hide toast after 3 seconds
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 3000);

    // Close modal
    bookingModal.classList.remove('active');
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filterSelect = document.getElementById('filterSelect').value;

    const filtered = turfs.filter(turf => {
        const matchSearch = turf.name.toLowerCase().includes(searchInput) || 
                          turf.location.toLowerCase().includes(searchInput);
        const matchFilter = !filterSelect || turf.sports.toLowerCase().includes(filterSelect);
        return matchSearch && matchFilter;
    });

    renderTurfs(filtered.length > 0 ? filtered : turfs);
}

// Smooth scroll navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLinks[index]) navLinks[index].classList.add('active');
        }
    });
});
