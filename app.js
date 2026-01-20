// قراءة ملف CSV وعرض لوحة المتصدرين
document.addEventListener('DOMContentLoaded', function() {
    // زر تبديل الوضع
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        toggle.classList.toggle('light');
        toggle.querySelector('.theme-icon').textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // قراءة CSV
    Papa.parse('students.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            displayLeaderboard(results.data);
        },
        error: function(error) {
            console.error('خطأ في قراءة الملف:', error);
        }
    });
});

function displayLeaderboard(students) {
    const cleanStudents = students
        .map(s => ({ name: s.name?.trim(), points: parseInt(s.points) }))
        .filter(s => s.name && !isNaN(s.points));

    // ترتيب النقاط
    cleanStudents.sort((a,b) => b.points - a.points);

    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';

    cleanStudents.forEach((student, index) => {
        const rank = index + 1;
        const card = createStudentCard(student, rank);
        leaderboard.appendChild(card);
    });
}

function createStudentCard(student, rank) {
    const card = document.createElement('div');
    card.className = 'student-card';
    if(rank <= 3) card.classList.add(`top-${rank}`);
    const rankIcon = getRankIcon(rank);

    card.innerHTML = `
        <div class="student-info">
            <div class="rank">${rank <=3 ? `<span class="rank-icon">${rankIcon}</span>` : rank}</div>
            <div class="student-name">${student.name}</div>
        </div>
        <div class="student-points">
            <div class="points-number">${student.points}</div>
            <div class="points-label">نقطة</div>
        </div>
    `;
    return card;
}

function getRankIcon(rank) {
    return {1:'🥇',2:'🥈',3:'🥉'}[rank] || '⭐';
}
