// Load and parse CSV file
async function loadStudents() {
    try {
        const response = await fetch('students.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                processStudents(results.data);
            },
            error: function(error) {
                showError();
                console.error('Parse error:', error);
            }
        });
    } catch (error) {
        showError();
        console.error('Load error:', error);
    }
}

// Process and sort students
function processStudents(data) {
    const students = data
        .filter(student => student && Object.keys(student).length > 0)
        .map(student => {
            const keys = Object.keys(student);
            return {
                name: student[keys[0]] || '',
                points: parseFloat(student[keys[1]]) || 0
            };
        })
        .filter(student => student.name && student.points >= 0)
        .sort((a, b) => b.points - a.points)
        .map((student, index) => ({
            ...student,
            rank: index + 1
        }));
    
    displayStudents(students);
}

// Display students on page
function displayStudents(students) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // Display top 3
    const top3Container = document.getElementById('top3');
    const top3Students = students.slice(0, 3);
    top3Students.forEach((student, index) => {
        const delay = index * 0.2;
        top3Container.innerHTML += createTop3Card(student, delay);
    });
    
    // Display ranks 4-10
    const ranks4to10 = students.slice(3, 10);
    if (ranks4to10.length > 0) {
        const ranksContainer = document.getElementById('ranks4-10');
        ranksContainer.innerHTML = '<h2>Top 10</h2>';
        ranks4to10.forEach((student, index) => {
            const delay = (index + 3) * 0.1;
            ranksContainer.innerHTML += createRankCard(student, delay);
        });
    }
    
    // Display rest
    const restStudents = students.slice(10);
    if (restStudents.length > 0) {
        const restContainer = document.getElementById('rest');
        restContainer.innerHTML = '<h2></h2>';
        restStudents.forEach((student, index) => {
            const delay = (index + 10) * 0.05;
            restContainer.innerHTML += createRestCard(student, delay);
        });
    }
}

// Create top 3 card HTML
function createTop3Card(student, delay) {
    const icons = {
        1: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>`,
        2: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                <path d="M11 12 5.12 2.2"></path>
                <path d="m13 12 5.88-9.8"></path>
                <path d="M8 7h8"></path>
                <circle cx="12" cy="17" r="5"></circle>
                <path d="M12 18v-2h-.5"></path>
            </svg>`,
        3: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                <circle cx="12" cy="8" r="6"></circle>
            </svg>`
    };
    
    return `
        <div class="top-card rank-${student.rank}" style="animation-delay: ${delay}s">
            <div class="rank-icon">
                ${icons[student.rank]}
            </div>
            <div class="rank-number">#${student.rank}</div>
            <h3 class="student-name">${student.name}</h3>
            <div class="points-box">
                <p class="points-value">${student.points.toLocaleString('ar-SA')}</p>
                <p class="points-label">نقطة</p>
            </div>
        </div>
    `;
}

// Create rank 4-10 card HTML
function createRankCard(student, delay) {
    const starIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>`;
    
    return `
        <div class="rank-card" style="animation-delay: ${delay}s">
            <div class="rank-left">
                <div class="rank-icon-small">
                    ${starIcon}
                </div>
                <h3 class="rank-name">${student.name}</h3>
            </div>
            <div class="rank-points">
                <p class="rank-points-value">${student.points.toLocaleString('ar-SA')}</p>
                <p class="rank-points-label">نقطة</p>
            </div>
        </div>
    `;
}

// Create rest card HTML
function createRestCard(student, delay) {
    return `
        <div class="rest-card" style="animation-delay: ${delay}s">
            <div class="rank-left">
                <div class="rest-rank-number">${student.rank}</div>
                <h3 class="rest-name">${student.name}</h3>
            </div>
            <div class="rest-points">
                <p class="rest-points-value">${student.points.toLocaleString('ar-SA')}</p>
            </div>
        </div>
    `;
}

// Show error message
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
}

// Load students when page loads
window.addEventListener('DOMContentLoaded', loadStudents);

