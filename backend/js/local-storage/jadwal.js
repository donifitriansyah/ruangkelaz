document.addEventListener('DOMContentLoaded', function () {
    const table = $('#dataTable').DataTable({
        "rowCallback": function(row, data, index) {
            $('td:eq(0)', row).html(index + 1);
        }
    });
    loadData();

});

document.addEventListener('DOMContentLoaded', countJadwal);

function countJadwal() {
    const jadwals = Object.keys(localStorage).filter(key => key.startsWith('jadwal_'));
    document.getElementById('jadwalCount').textContent = jadwals.length;
}

function isTimeOverlap(existingData, newData) {
    const { waktu_mulai: mulai1, waktu_akhir: akhir1 } = existingData;
    const { waktu_mulai: mulai2, waktu_akhir: akhir2 } = newData;

    // Konversi waktu ke menit
    const convertToMinutes = (waktu) => {
        const [jam, menit] = waktu.split(':').map(Number);
        return jam * 60 + menit;
    };

    const mulai1M = convertToMinutes(mulai1);
    const akhir1M = convertToMinutes(akhir1);
    const mulai2M = convertToMinutes(mulai2);
    const akhir2M = convertToMinutes(akhir2);

    // Cek tumpang tindih waktu
    return (mulai1M < akhir2M && mulai2M < akhir1M);
}

function tambahData() {
    const hari = document.getElementById("hari").value.trim();
    const waktu_mulai = document.getElementById("waktu-mulai").value.trim();
    const waktu_akhir = document.getElementById("waktu-akhir").value.trim();
    const mata_kuliah = document.getElementById("mata-kuliah").value.trim();
    const dosen = document.getElementById("dosen").value.trim();
    const ruang = document.getElementById("ruang").value.trim();
    const semester = document.getElementById("semester").value.trim();
    const kelas = document.getElementById("kelas").value.trim();

    if (
        hari === "" ||
        waktu_mulai === "" ||
        waktu_akhir === "" ||
        mata_kuliah === "" ||
        dosen === "" ||
        ruang === "" ||
        semester === "" ||
        kelas === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    const jadwalBaru = {
        hari,
        waktu_mulai,
        waktu_akhir,
        mata_kuliah,
        dosen,
        ruang,
        semester,
        kelas,
    };

    // Ambil semua jadwal dari localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("jadwal_")) {
            const existingJadwal = JSON.parse(localStorage.getItem(key));
            if (existingJadwal.hari === hari && existingJadwal.ruang === ruang) {
                if (isTimeOverlap(existingJadwal, jadwalBaru)) {
                    alert("Data conflicts with an existing schedule.");
                    return;
                }
            }
        }
    }

    const key =
        "jadwal_" +
        hari +
        waktu_mulai +
        waktu_akhir +
        ruang +
        semester +
        kelas;
    if (localStorage.getItem(key)) {
        alert("Data already exists for the given schedule.");
        return;
    }

    localStorage.setItem(key, JSON.stringify(jadwalBaru));
    $("#tambahModal").modal("hide"); // Hide the modal

    // Refresh the data table
    loadData();
}


function deleteData(key) {
    if (confirm("Are you sure you want to delete this schedule?")) {
        localStorage.removeItem(key);
        loadData();
        // Refresh the data table
    }
}

function populateEditModal(key) {
    const jadwal = JSON.parse(localStorage.getItem(key));

    if (jadwal) {
        currentEditKey = key; // Save the key of the current edit
        document.getElementById("edit-hari").value = jadwal.hari;
        document.getElementById("edit-waktu-mulai").value =
            jadwal.waktu_mulai;
        document.getElementById("edit-waktu-akhir").value =
            jadwal.waktu_akhir;
        document.getElementById("edit-mata-kuliah").value =
            jadwal.mata_kuliah;
        document.getElementById("edit-dosen").value = jadwal.dosen;
        document.getElementById("edit-ruang").value = jadwal.ruang;
        document.getElementById("edit-semester").value = jadwal.semester;
        document.getElementById("edit-kelas").value = jadwal.kelas;

        $("#editModal").modal("show");
    } else {
        alert("Data tidak ditemukan");
    }
}

function saveEdit() {
    const hari = document.getElementById("edit-hari").value.trim();
    const waktu_mulai = document.getElementById("edit-waktu-mulai").value.trim();
    const waktu_akhir = document.getElementById("edit-waktu-akhir").value.trim();
    const mata_kuliah = document.getElementById("edit-mata-kuliah").value.trim();
    const dosen = document.getElementById("edit-dosen").value.trim();
    const ruang = document.getElementById("edit-ruang").value.trim();
    const semester = document.getElementById("edit-semester").value.trim();
    const kelas = document.getElementById("edit-kelas").value.trim();

    if (
        hari === "" ||
        waktu_mulai === "" ||
        waktu_akhir === "" ||
        mata_kuliah === "" ||
        dosen === "" ||
        ruang === "" ||
        semester === "" ||
        kelas === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    const newKey =
        "jadwal_" +
        hari +
        waktu_mulai +
        waktu_akhir +
        ruang +
        semester +
        kelas;

    const jadwalBaru = {
        hari,
        waktu_mulai,
        waktu_akhir,
        mata_kuliah,
        dosen,
        ruang,
        semester,
        kelas,
    };

    // Cek konflik dengan data lain
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("jadwal_") && key !== currentEditKey) {
            const existingJadwal = JSON.parse(localStorage.getItem(key));
            if (existingJadwal.hari === hari && existingJadwal.ruang === ruang) {
                if (isTimeOverlap(existingJadwal, jadwalBaru)) {
                    alert("Data conflicts with an existing schedule.");
                    return;
                }
            }
        }
    }

    // Hapus data lama
    localStorage.removeItem(currentEditKey);

    // Simpan data baru
    localStorage.setItem(newKey, JSON.stringify(jadwalBaru));

    // Cek apakah modal dapat ditutup
    $("#editModal").modal("hide");

    // Refresh data
    loadData();
    console.log("Data saved and modal should be closed now.");
}



function clearAllData() {
    if (confirm("Anda yakin ingin menghapus semua data?")) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key.startsWith("jadwal_")) {
                // Only clear relevant keys
                localStorage.removeItem(key);
            }
        }
        loadData();
        window.location.reload // Refresh the data table after clearing
    }
}



