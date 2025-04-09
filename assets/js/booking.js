let isEditing = false;
let editingIndex = null;
let rowToDelete = null;

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    Swal.fire({
        title: 'Lỗi!',
        text: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục!',
        icon: 'error'
    });
    window.location.href = "../auth/login.html";
} else {
    const userName = currentUser.name;
    const userEmail = currentUser.email;

    function loadSchedules() {
        const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
        let table = document.getElementById("schedule-table");

        table.innerHTML = `
                    <tr>
                        <th>Lớp Học</th>
                        <th>Ngày Tập</th>
                        <th>Khung Giờ</th>
                        <th>Họ Tên</th>
                        <th>Email</th>
                        <th>Thao Tác</th>
                    </tr>
                `;

        schedules.forEach((schedule, index) => {
            let newRow = table.insertRow(-1);
            newRow.innerHTML = `
                        <td>${schedule.classType}</td>
                        <td>${schedule.date}</td>
                        <td>${schedule.timeSlot}</td>
                        <td>${schedule.userName}</td>
                        <td>${schedule.userEmail}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editSchedule(${index})">Sửa</button>
                            <button class="action-btn delete-btn" onclick="confirmDelete(${index})">Xóa</button>
                        </td>
                    `;
        });
    }

    window.onload = loadSchedules;

    document.getElementById("new-schedule-btn").addEventListener("click", () => {
        isEditing = false;
        editingIndex = null;
        clearForm();
        document.getElementById("modal-title").innerText = "Đặt lịch mới";
        document.getElementById("schedule-modal").style.display = "flex";
    });

    document.getElementById("cancel-btn").addEventListener("click", () => {
        document.getElementById("schedule-modal").style.display = "none";
        clearForm();
    });

    function clearForm() {
        document.getElementById("class-type").value = "Chọn lớp học";
        document.getElementById("date").value = "";
        document.getElementById("time-slot").value = "Chọn khung giờ";
        document.getElementById("user-name").value = "";
        document.getElementById("user-email").value = "";
    }

    document.getElementById("save-btn").addEventListener("click", () => {
        const classType = document.getElementById("class-type").value;
        const date = document.getElementById("date").value;
        const timeSlot = document.getElementById("time-slot").value;
        const name = document.getElementById("user-name").value.trim();
        const email = document.getElementById("user-email").value.trim();

        if (classType === "Chọn lớp học" || !date || timeSlot === "Chọn khung giờ" || !name || !email) {
            Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Vui lòng nhập đầy đủ thông tin!' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Email không hợp lệ!' });
            return;
        }




        const schedules = JSON.parse(localStorage.getItem("schedules")) || [];

        const duplicate = schedules.some((s, i) =>
            s.date === date &&
            s.timeSlot === timeSlot &&
            (!isEditing || i !== editingIndex)
        );

        if (duplicate) {
            Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Khung giờ này đã được đặt!' });
            return;
        }

        const scheduleData = { classType, date, timeSlot, userName: name, userEmail: email };

        if (isEditing) {
            schedules[editingIndex] = scheduleData;
        } else {
            schedules.push(scheduleData);
        }

        localStorage.setItem("schedules", JSON.stringify(schedules));
        document.getElementById("schedule-modal").style.display = "none";
        clearForm();
        loadSchedules();
    });

    window.editSchedule = function (index) {
        const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
        const s = schedules[index];
        isEditing = true;
        editingIndex = index;

        document.getElementById("modal-title").innerText = "Chỉnh sửa lịch";
        document.getElementById("class-type").value = s.classType;
        document.getElementById("date").value = s.date;
        document.getElementById("time-slot").value = s.timeSlot;
        document.getElementById("user-name").value = s.userName;
        document.getElementById("user-email").value = s.userEmail;
        document.getElementById("schedule-modal").style.display = "flex";
    };

    window.confirmDelete = function (index) {
        rowToDelete = index;
        document.getElementById("delete-confirm-modal").style.display = "flex";
    };

    document.getElementById("confirm-delete-btn").addEventListener("click", () => {
        const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
        if (rowToDelete !== null) {
            schedules.splice(rowToDelete, 1);
            localStorage.setItem("schedules", JSON.stringify(schedules));
            loadSchedules();
            rowToDelete = null;
        }
        document.getElementById("delete-confirm-modal").style.display = "none";
    });

    document.getElementById("cancel-delete-btn").addEventListener("click", () => {
        document.getElementById("delete-confirm-modal").style.display = "none";
        rowToDelete = null;
    });
}