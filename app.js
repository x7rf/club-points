document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (!file) {
        return;
    }
    
    // عرض اسم الملف
    document.getElementById('fileName').textContent = `تم اختيار: ${file.name}`;
    
    // قراءة الملف
    Papa.parse(file, {
        complete: function(results) {
            displayLeaderboard(results.data);
        },
        error: function(error) {
            showError('حدث خطأ في قراءة الملف: ' + error.message);
        },
        skipEmptyLines: true,
        encoding: 'UTF-8'
    });
});

function displayLeaderboard(data) {
    const leaderboard = document.getElementById('leaderboard');
    
    // التحقق من وجود بيانات
    if (!data || data.length === 0) {
        showError('الملف فارغ أو لا يحتوي على بيانات');
        return;
    }
    
    // تحويل البيانات وتنظيفها
    const students = [];
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        // تخطي الصفوف الفارغة
        if (!row || row.length < 2) {
            continue;
        }
        
        const name = row[0]?.trim();
        const points = parseFloat(row[1]);
        
        // التحقق من صحة البيانات
        if (name && !isNaN(points)) {
            students.push({
                name: name,
                points: points
            });
        }
    }
    
    if (students.length === 0) {
        showError('لم يتم العثور على بيانات صحيحة في الملف');
        return;
    }
    
    // ترتيب الطلاب حسب النقاط (من الأعلى للأقل)
    students.sort((a, b) => b.points - a.points);
    
    // مسح المحتوى السابق
    leaderboard.innerHTML = '';
    
    // عرض الطلاب
    students.forEach((student, index) => {
        const rank = index + 1;
        const row = createStudentRow(student, rank);
        leaderboard.appendChild(row);
    });
}

function createStudentRow(student, rank) {
    const row = document.createElement('div');
    row.className = 'student-row';
    
    // تحديد نوع المرتبة
    if (rank === 1) {
        row.classList.add('rank-1');
    } else if (rank === 2) {
        row.classList.add('rank-2');
    } else if (rank === 3) {
        row.classList.add('rank-3');
    } else if (rank <= 10) {
        row.classList.add('rank-top10');
    } else {
        row.classList.add('rank-others');
    }
    
    // رقم المرتبة
    const rankDiv = document.createElement('div');
    rankDiv.className = 'rank-number';
    
    // إضافة ميداليات للمراكز الثلاثة الأولى
    if (rank === 1) {
        rankDiv.innerHTML = '<span class="medal">🥇</span>' + rank;
    } else if (rank === 2) {
        rankDiv.innerHTML = '<span class="medal">🥈</span>' + rank;
    } else if (rank === 3) {
        rankDiv.innerHTML = '<span class="medal">🥉</span>' + rank;
    } else {
        rankDiv.textContent = rank;
    }
    
    // اسم الطالب
    const nameDiv = document.createElement('div');
    nameDiv.className = 'student-name';
    nameDiv.textContent = student.name;
    
    // النقاط
    const pointsDiv = document.createElement('div');
    pointsDiv.className = 'student-points';
    pointsDiv.textContent = student.points + ' نقطة';
    
    row.appendChild(rankDiv);
    row.appendChild(nameDiv);
    row.appendChild(pointsDiv);
    
    return row;
}

function showError(message) {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = `<div class="error-message">${message}</div>`;
}
