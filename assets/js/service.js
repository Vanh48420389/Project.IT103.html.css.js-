const addBtn = document.querySelector('.btn-add');
const modal = document.getElementById('add-service-modal');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');

const serviceNameInput = document.getElementById('service-name');
const serviceDescInput = document.getElementById('service-description');
const serviceImageInput = document.getElementById('service-image');

const tableBody = document.querySelector('.service-table tbody');

let editRow = null;
let editIndex = -1;



addBtn.addEventListener('click', () => {
    modal.classList.add('show');
    clearForm();
    editRow = null;
    editIndex = -1;
});

cancelBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    clearForm();
});

function clearForm() {
    serviceNameInput.value = '';
    serviceDescInput.value = '';
    serviceImageInput.value = '';
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('services')) || defaultServices;
    tableBody.innerHTML = '';

    services.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td><img src="${service.image}" alt="${service.name}" style="width: 100px; height: auto;"></td>
                <td>
                    <button class="btn-edit">Sửa</button>
                    <button class="btn-delete">Xóa</button>
                </td>
            `;
        tableBody.appendChild(row);
        attachEventHandlers(row, index);
    });
}

function saveServices() {
    const rows = tableBody.querySelectorAll('tr');
    const services = Array.from(rows).map(row => ({
        name: row.querySelector('td:nth-child(1)').textContent,
        description: row.querySelector('td:nth-child(2)').textContent,
        image: row.querySelector('img').src
    }));
    localStorage.setItem('services', JSON.stringify(services));
}

saveBtn.addEventListener('click', () => {
    const name = serviceNameInput.value.trim();
    const desc = serviceDescInput.value.trim();
    const img = serviceImageInput.value.trim();

    if (!name || !desc || !img) {
        Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin!', 'warning');
        return;
    }

    if (editRow && editIndex >= 0) {
        editRow.querySelector('td:nth-child(1)').textContent = name;
        editRow.querySelector('td:nth-child(2)').textContent = desc;
        editRow.querySelector('img').src = img;
        Swal.fire('Thành công', 'Cập nhật dịch vụ thành công!', 'success');
    } else {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
                <td>${name}</td>
                <td>${desc}</td>
                <td><img src="${img}" alt="${name}" style="width: 100px; height: auto;"></td>
                <td>
                    <button class="btn-edit">Sửa</button>
                    <button class="btn-delete">Xóa</button>
                </td>
            `;
        tableBody.appendChild(newRow);
        attachEventHandlers(newRow, tableBody.children.length - 1);
        Swal.fire('Thành công', 'Thêm dịch vụ mới!', 'success');
    }

    saveServices();
    modal.classList.remove('show');
    clearForm();
});

function attachEventHandlers(row, index) {
    const editBtn = row.querySelector('.btn-edit');
    const deleteBtn = row.querySelector('.btn-delete');

    editBtn.addEventListener('click', () => {
        const name = row.querySelector('td:nth-child(1)').textContent;
        const desc = row.querySelector('td:nth-child(2)').textContent;
        const img = row.querySelector('img').src;

        serviceNameInput.value = name;
        serviceDescInput.value = desc;
        serviceImageInput.value = img;

        modal.classList.add('show');
        editRow = row;
        editIndex = index;
    });

    deleteBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Bạn chắc chắn muốn xóa?',
            text: "Dịch vụ này sẽ bị xóa khỏi danh sách!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                row.remove();
                saveServices();
                Swal.fire('Đã xóa!', 'Dịch vụ đã bị xóa.', 'success');
            }
        });
    });
}

loadServices();