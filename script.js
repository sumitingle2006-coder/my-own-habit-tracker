let chartInstance = null;

window.onload = () => {
    const savedUser = localStorage.getItem('activeUser');
    if (savedUser) showDashboard(savedUser);
};

function handleLogin() {
    const email = document.getElementById('user-email').value;
    const pass = document.getElementById('user-pass').value;
    if(email && pass.length > 3) {
        localStorage.setItem('activeUser', email);
        showDashboard(email);
    } else {
        alert("Please enter a valid email and password.");
    }
}

function showDashboard(email) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('welcome-text').innerText = `Hello, ${email.split('@')[0]}! 👋`;
    loadHabits();
}

function addNewHabit() {
    const name = document.getElementById('habit-name').value;
    if(!name) return;
    const habits = JSON.parse(localStorage.getItem('myHabits') || '[]');
    habits.push({ name: name, days: [false, false, false, false, false, false, false] });
    localStorage.setItem('myHabits', JSON.stringify(habits));
    document.getElementById('habit-name').value = '';
    loadHabits();
}

function loadHabits() {
    const container = document.getElementById('habit-list-container');
    const habits = JSON.parse(localStorage.getItem('myHabits') || '[]');
    container.innerHTML = '';
    habits.forEach((habit, hIdx) => {
        const div = document.createElement('div');
        div.className = 'habit-item';
        let checks = '';
        habit.days.forEach((done, dIdx) => {
            checks += `<input type="checkbox" ${done ? 'checked' : ''} onclick="toggleHabit(${hIdx}, ${dIdx})">`;
        });
        div.innerHTML = `<span>${habit.name}</span><div class="check-group">${checks}</div>`;
        container.appendChild(div);
    });
    updateChart();
}

function toggleHabit(hIdx, dIdx) {
    const habits = JSON.parse(localStorage.getItem('myHabits'));
    habits[hIdx].days[dIdx] = !habits[hIdx].days[dIdx];
    localStorage.setItem('myHabits', JSON.stringify(habits));
    updateChart();
}

function updateChart() {
    const habits = JSON.parse(localStorage.getItem('myHabits') || '[]');
    const dailyCompletion = [0, 0, 0, 0, 0, 0, 0];
    habits.forEach(h => {
        h.days.forEach((done, i) => { if(done) dailyCompletion[i]++; });
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    if(chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Habits Completed',
                data: dailyCompletion,
                borderColor: '#6366f1',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }]
        },
        options: { scales: { y: { beginAtZero: true, grid: { display: false } } } }
    });
}

function logout() {
    localStorage.removeItem('activeUser');
    location.reload();
}