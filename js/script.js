// ===================================
// LOGIN FUNCTION
// ===================================
document.addEventListener("DOMContentLoaded", function() {
  const emailInput = document.querySelector('input[type="text"]');
  const pwInput = document.querySelector(".password");
  const btnLogin = document.getElementById("myBtn");
  const modal = document.getElementById("myModal");
  const modalText = modal?.querySelector("p");
  const closeBtn = document.querySelector(".close");
  const togglePw = document.querySelector(".showHidePw");

  if (togglePw) {
    togglePw.addEventListener("click", () => {
      if (pwInput.type === "password") {
        pwInput.type = "text";
        togglePw.classList.replace("fa-eye-slash", "fa-eye");
      } else {
        pwInput.type = "password";
        togglePw.classList.replace("fa-eye", "fa-eye-slash");
      }
    });
  }

  function prosesLogin() {
    const email = emailInput?.value.trim();
    const pass = pwInput?.value.trim();
    const user = dataPengguna.find(u => u.email === email && u.password === pass);

    if (user) {
      localStorage.setItem("userSitta", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else if (modal) {
      modalText.textContent = "Email atau password salah!";
      modal.style.display = "block";
    }
  }

  btnLogin?.addEventListener("click", prosesLogin);
  [emailInput, pwInput].forEach(el => el?.addEventListener("keydown", e => {
    if (e.key === "Enter") prosesLogin();
  }));

  closeBtn?.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// ===================================
// GREETING DASHBOARD
// ===================================
function greeting() {
  const user = JSON.parse(localStorage.getItem("userSitta"));
  if (!user) return;

  const hour = new Date().getHours();
  let greet = "Selamat datang";
  if (hour < 12) greet = "Selamat pagi";
  else if (hour < 15) greet = "Selamat siang";
  else if (hour < 18) greet = "Selamat sore";
  else greet = "Selamat malam";

  const el = document.getElementById("greeting");
  if (el) el.textContent = `${greet}, ${user.nama}!`;
}
document.addEventListener("DOMContentLoaded", greeting);

// ===================================
// DROPDOWN MENU NAVBAR
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown-toggle");
  dropdowns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.parentElement.classList.toggle("open");
    });
  });
});

// ===================================
// AGAR NAVIGASI DROPDOWN MENUTUP OTOMATIS SAAT KLIK DI LUAR
// ===================================
document.addEventListener("click", (e) => {
  document.querySelectorAll(".dropdown.open").forEach(drop => {
    if (!drop.contains(e.target)) drop.classList.remove("open");
  });
});

// ===================================
// FITUR TRACKING PENGIRIMAN
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  const btnCari = document.getElementById("btnCariDO");
  const hasil = document.getElementById("hasilTracking");

  if (btnCari) {
    btnCari.addEventListener("click", cariTracking);
  }

  // Enter key support
  document.getElementById("searchDO")?.addEventListener("keydown", e => {
    if (e.key === "Enter") cariTracking();
  });

  function cariTracking() {
    const input = document.getElementById("searchDO").value.trim();
    hasil.innerHTML = "";

    if (!input) {
      hasil.innerHTML = `<p class="msg-error">⚠️ Masukkan nomor DO terlebih dahulu.</p>`;
      return;
    }

    const data = dataTracking[input];
    if (!data) {
      hasil.innerHTML = `<p class="msg-error">❌ Nomor DO tidak ditemukan.</p>`;
      return;
    }

    // Hitung progress berdasarkan status
    let progress = 0;
    if (data.status === "Dikirim") progress = 40;
    else if (data.status === "Dalam Perjalanan") progress = 70;
    else if (data.status === "Selesai Antar") progress = 100;

    // Bangun HTML hasil tracking
    let perjalananHTML = "";
    if (data.perjalanan && data.perjalanan.length > 0) {
      perjalananHTML = `
        <div class="perjalanan-list">
          <h4>Riwayat Perjalanan:</h4>
          ${data.perjalanan
            .map(
              (p) => `
              <div class="perjalanan-item">
                <strong>${p.waktu}</strong><br>
                <span>${p.keterangan}</span>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }

    hasil.innerHTML = `
      <div class="tracking-result">
        <h3>Hasil Pelacakan</h3>
        <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
        <p><strong>Nama Penerima:</strong> ${data.nama}</p>
        <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
        <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
        <p><strong>Paket:</strong> ${data.paket}</p>
        <p><strong>Total:</strong> ${data.total}</p>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress}%">${progress}%</div>
          </div>
          <p><strong>Status:</strong> ${data.status}</p>
        </div>

        ${perjalananHTML}
      </div>
    `;
  }
});


// ===================================
// STOK BAHAN AJAR
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("stokContainer");
  if (!container) return;

  const btnTambah = document.createElement("button");
  btnTambah.textContent = "Tambah Stok Baru";
  btnTambah.className = "btn-tambah";
  container.parentNode.insertBefore(btnTambah, container);

  const formPopup = document.createElement("div");
  formPopup.className = "popup-form";
  formPopup.innerHTML = `
    <div class="popup-content">
      <h3>Tambah Stok Baru</h3>
      <label>Nama Barang:</label>
      <input type="text" id="namaBarang">
      <label>Kode Barang:</label>
      <input type="text" id="kodeBarang">
      <label>Jenis Barang:</label>
      <input type="text" id="jenisBarang">
      <label>Edisi:</label>
      <input type="text" id="edisi">
      <label>Stok:</label>
      <input type="number" id="stok">
      <label>Kode Lokasi:</label>
      <input type="text" id="kodeLokasi">
      <label>URL Cover:</label>
      <input type="text" id="cover">
      <div class="popup-buttons">
        <button id="btnSimpan">Simpan</button>
        <button id="btnBatal">Batal</button>
      </div>
    </div>
  `;
  document.body.appendChild(formPopup);
  formPopup.style.display = "none";

  function renderCards() {
    container.innerHTML = "";
    if (!Array.isArray(dataBahanAjar) || dataBahanAjar.length === 0) {
      container.innerHTML = "<p>Data bahan ajar tidak ditemukan.</p>";
      return;
    }
  
    dataBahanAjar.forEach((bahan) => {
      const card = document.createElement("div");
      card.classList.add("stok-card", "clickable");
  
      card.innerHTML = `
        <img src="${bahan.cover}" alt="${bahan.namaBarang}">
        <div class="card-content">
          <h3>${bahan.namaBarang}</h3>
        </div>
      `;
  
      // Event klik -> tampilkan detail popup
      card.addEventListener("click", () => {
        showDetailPopup(bahan);
      });
  
      container.appendChild(card);
    });
  }

  function showDetailPopup(bahan) {
    // Hapus popup lama jika ada
    document.querySelectorAll(".detail-popup").forEach(p => p.remove());
  
    const popup = document.createElement("div");
    popup.className = "detail-popup";
    popup.innerHTML = `
      <div class="detail-content">
        <span class="close-detail">&times;</span>
        <img src="${bahan.cover}" alt="${bahan.namaBarang}">
        <h2>${bahan.namaBarang}</h2>
        <p><strong>Kode Barang:</strong> ${bahan.kodeBarang}</p>
        <p><strong>Edisi:</strong> ${bahan.edisi}</p>
        <p><strong>Kode Lokasi:</strong> ${bahan.kodeLokasi}</p>
        <p><strong>Stok:</strong> ${bahan.stok}</p>
      </div>
    `;
    document.body.appendChild(popup);
  
    // Tutup popup
    popup.querySelector(".close-detail").addEventListener("click", () => popup.remove());
    popup.addEventListener("click", e => {
      if (e.target === popup) popup.remove();
    });
  }
  

  btnTambah.addEventListener("click", () => formPopup.style.display = "flex");
  formPopup.querySelector("#btnBatal").addEventListener("click", () => formPopup.style.display = "none");
  formPopup.querySelector("#btnSimpan").addEventListener("click", () => {
    const namaBarang = document.getElementById("namaBarang").value;
    const kodeBarang = document.getElementById("kodeBarang").value;
    const jenisBarang = document.getElementById("jenisBarang").value;
    const edisi = document.getElementById("edisi").value;
    const stok = document.getElementById("stok").value;
    const kodeLokasi = document.getElementById("kodeLokasi").value;
    const cover = document.getElementById("cover").value || "img/default.jpg";

    if (!namaBarang || !kodeBarang) {
      alert("Nama dan kode barang wajib diisi!");
      return;
    }

    dataBahanAjar.push({
      kodeLokasi,
      kodeBarang,
      namaBarang,
      jenisBarang,
      edisi,
      stok,
      cover
    });

    formPopup.style.display = "none";
    renderCards();
  });

  renderCards();
});