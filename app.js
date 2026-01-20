fetch('students.csv')
  .then(res => res.text())
  .then(data => {
    const rows = data.split('\n').slice(1); // تجاهل الصف الأول
    const tbody = document.querySelector('#students-table tbody');

    rows.forEach(row => {
      const [name, points] = row.split(','); // تأكد من استخدام comma
      if(name && points){
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${name.trim()}</td><td>${points.trim()}</td>`;
        tbody.appendChild(tr);
      }
    });
  })
  .catch(err => console.error('Error loading CSV:', err));