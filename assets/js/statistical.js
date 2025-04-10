let schedules = JSON.parse(localStorage.getItem("schedules")) || [];
    let currentEditIndex = null;

    const displaySchedules = (data) => {
      const tableBody = document.querySelector('table tbody');
      tableBody.innerHTML = ""; // Xóa dữ liệu cũ

      data.forEach((s, i) => {
        tableBody.innerHTML += `
          <tr>
            <td>${s.classType}</td>
            <td>${s.date}</td>
            <td>${s.timeSlot}</td>
            <td>${s.userName}</td>
            <td>${s.userEmail}</td>
            <td>
              <button class="edit-btn" onclick="editSchedule(${i})">Sửa</button>
              <button class="delete-btn" onclick="deleteSchedule(${i})">Xóa</button>
            </td>
          </tr>`;
      });
    };

    const editSchedule = (index) => {
      currentEditIndex = index;
      const s = schedules[index];
      ['classType', 'date', 'timeSlot', 'userName', 'userEmail'].forEach(id => document.getElementById(id).value = s[id]);
      document.getElementById('editModal').style.display = 'block';
    };

    const closeModal = () => document.getElementById('editModal').style.display = 'none';

    const saveChanges = () => {
      if (currentEditIndex === null) return;
      const updated = {
        classType: classType.value,
        date: date.value,
        timeSlot: timeSlot.value,
        userName: userName.value,
        userEmail: userEmail.value,
      };
      if (Object.values(updated).some(v => !v)) {
        Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Vui lòng điền đủ thông tin!' });
        return;
      }
      schedules[currentEditIndex] = updated;
      localStorage.setItem('schedules', JSON.stringify(schedules));
      displaySchedules(schedules);
      closeModal();
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Lịch tập đã được cập nhật!' });
    };

    const deleteSchedule = (index) => {
      Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa!'
      }).then((result) => {
        if (result.isConfirmed) {
          schedules.splice(index, 1);
          localStorage.setItem('schedules', JSON.stringify(schedules));
          displaySchedules(schedules);
          Swal.fire('Xóa!', 'Lịch tập đã được xóa.', 'success');
        }
      });
    };

    let chartInstance;

function loadStatistics() {
  const schedules = JSON.parse(localStorage.getItem("schedules")) || [];

  const count = (type) => schedules.filter(s => s.classType === type).length;

  document.getElementById("gym-count").textContent = count("Gym");
  document.getElementById("yoga-count").textContent = count("Yoga");
  document.getElementById("zumba-count").textContent = count("Zumba");

  const chartElement = document.getElementById('classChart');
  if (chartElement) {
    if (chartInstance) {
      chartInstance.destroy(); 
    }

    chartInstance = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: ['Gym', 'Yoga', 'Zumba'],
        datasets: [{
          label: 'Số lượng lịch tập',
          data: [count("Gym"), count("Yoga"), count("Zumba")],
          backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
};

window.addEventListener('resize', loadStatistics); 

document.getElementById('filterButton').addEventListener('click', () => {
  const classFilter = document.getElementById("filterClass").value;
  const emailFilter = document.getElementById("filterEmail").value.trim().toLowerCase();
  const dateFilter = document.getElementById("filterDate").value;

  const filteredSchedules = schedules.filter(schedule => {
    const matchesClass = classFilter === "Tất cả" || schedule.classType === classFilter;
    const matchesEmail = !emailFilter || schedule.userEmail.toLowerCase().includes(emailFilter);
    const matchesDate = !dateFilter || schedule.date === dateFilter;

    return matchesClass && matchesEmail && matchesDate;
  });

  displaySchedules(filteredSchedules);
});

    window.onload = () => {
      loadStatistics();
      displaySchedules(schedules);
    };

    function filterSchedules() {
  const classFilter = document.getElementById("filterClass").value;
  const emailFilter = document.getElementById("filterEmail").value.trim().toLowerCase();
  const dateFilter = document.getElementById("filterDate").value;

  const filtered = schedules.filter(s =>
    (classFilter === "Tất cả" || s.classType === classFilter) &&
    (!emailFilter || s.userEmail.toLowerCase().includes(emailFilter)) &&
    (!dateFilter || s.date === dateFilter)
  );

  displaySchedules(filtered);
}