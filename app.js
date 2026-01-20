fetch('students.csv')
  .then(res => res.text())
  .then(data => {
    const rows = data.split('\n').slice(1); // تجاهل العنوان
    const tbody = document.querySelector('#students-table tbody');

    rows.forEach((row, index) => {
      const [name, points] = row.split(',');
      if(name && points){
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${name.trim()}</td><td>${points.trim()}</td>`;
        tr.classList.add('fade-in');
        tbody.appendChild(tr);
        tr.style.animationDelay = `${index * 0.1}s`; // كل صف يظهر بتأخير بسيط
      }
    });
  })
  .catch(err => console.error('Error loading CSV:', err));
