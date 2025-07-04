window.addEventListener("DOMContentLoaded", () => {
  const apiID = "1agdJDtRKsAEDunMK8TD3E6hBpV87FV-I-0wQrqj2Ln8";
  const apiURL = `https://opensheet.elk.sh/${apiID}/Trang%20tính1`;

  const charts = {};
  const label_dienap = "Điện áp (V)";
  const label_dongdien = "Dòng điện (A)";
  const label_congsuat = "Công suất tiêu thụ (W)";

  const arrowDown = `<svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#FFFFFF"><path d="M480-360 280-560h400L480-360Z"/></svg>`;
  const arrowUp = `<svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#FFFFFF"><path d="m280-400 200-201 200 201H280Z"/></svg>`;
  const noChange = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M130-450q-20.83 0-35.42-14.62Q80-479.24 80-500.12 80-521 94.58-535.5 109.17-550 130-550h260q20.83 0 35.42 14.62Q440-520.76 440-499.88q0 20.88-14.58 35.38Q410.83-450 390-450H130Zm440 0q-20.83 0-35.42-14.62Q520-479.24 520-500.12q0-20.88 14.58-35.38Q549.17-550 570-550h260q20.83 0 35.42 14.62Q880-520.76 880-499.88q0 20.88-14.58 35.38Q850.83-450 830-450H570Z"/></svg>`;

  const startDateInput = flatpickr("#start-date", { dateFormat: "m/d/Y" });
  const endDateInput = flatpickr("#end-date", { dateFormat: "m/d/Y" });

  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 6);
  startDateInput.setDate(past);
  endDateInput.setDate(now);
  document.getElementById("start-date").value = flatpickr.formatDate(past, "m/d/Y");
  document.getElementById("end-date").value = flatpickr.formatDate(now, "m/d/Y");
  document.getElementById("preset").value = "last7";

  document.getElementById("preset").addEventListener("change", function () {
  const now = new Date();
  let start, end;

  if (this.value === "today") {
    start = end = now;
  } else if (this.value === "last7") {
    end = now;
    start = new Date();
    start.setDate(end.getDate() - 6);
  }

  startDateInput.setDate(start);
  endDateInput.setDate(end);
  document.getElementById("start-date").value = flatpickr.formatDate(start, "m/d/Y");
  document.getElementById("end-date").value = flatpickr.formatDate(end, "m/d/Y");

  // 👉 Đặt lại giờ mặc định khi chọn lại ngày
  document.getElementById("start-time").value = "00:00";
  document.getElementById("end-time").value = "23:59";

  toggleTimeInputs();
});


  document.getElementById("apply-btn").addEventListener("click", () => {
    startAutoUpdate();
  });

  let autoUpdateInterval = null;
  function startAutoUpdate() {
    if (autoUpdateInterval) clearInterval(autoUpdateInterval);
    fetchAndRender();
    autoUpdateInterval = setInterval(fetchAndRender, 2000);
  }

  function toggleTimeInputs() {
    const startDateStr = document.getElementById("start-date").value;
    const endDateStr = document.getElementById("end-date").value;

    const [m1, d1, y1] = startDateStr.split("/").map(Number);
    const [m2, d2, y2] = endDateStr.split("/").map(Number);

    const sameDay = new Date(y1, m1 - 1, d1).getTime() === new Date(y2, m2 - 1, d2).getTime();

    document.querySelectorAll(".time-picker").forEach(el => {
      el.disabled = !sameDay;
      el.style.opacity = sameDay ? "1" : "0.5";
    });

    return sameDay;
  }

  function parseDateTime(dateStr, timeStr) {
    const [m, d, y] = dateStr.split("/").map(Number);
    let [hh, mm, ss] = timeStr.split(":").map(Number);

    // Nếu không có giây thì gán = 0
    if (ss === undefined) ss = 0;

    return new Date(y, m - 1, d, hh, mm, ss);
  }


  function parseVietnameseTime12h(timeStr) {
    let [time, suffix] = timeStr.trim().split(" ");
    let [hh, mm, ss = "00"] = time.split(":").map(Number);

    // Nếu không có CH/SA thì giả định đã là 24h
    if (!suffix) return [hh, mm, ss];

    suffix = suffix.toUpperCase();

    if (["CH", "PM"].includes(suffix) && hh < 12) hh += 12;
    if (["SA", "AM"].includes(suffix) && hh === 12) hh = 0;

    return [hh, mm, parseInt(ss)];
  }


  function fetchAndRender() {
  const startDateStr = document.getElementById("start-date").value;
  const endDateStr = document.getElementById("end-date").value;
  const startTimeStr = document.getElementById("start-time").value;
  const endTimeStr = document.getElementById("end-time").value;

  const isSameDay = toggleTimeInputs();

  // Nếu là cùng 1 ngày và có chọn giờ => lọc theo giờ
  const hasStartTime = startTimeStr && startTimeStr.trim() !== "";
  const hasEndTime = endTimeStr && endTimeStr.trim() !== "";

  const start = isSameDay && hasStartTime
    ? parseDateTime(startDateStr, startTimeStr)
    : parseDateTime(startDateStr, "00:00:00");

  const end = isSameDay && hasEndTime
    ? parseDateTime(endDateStr, endTimeStr)
    : parseDateTime(endDateStr, "23:59:59");

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(row => {
        const rawTime = row["Thời gian"];
        if (!rawTime || !rawTime.includes(" ")) return false;

        const [datePart, timePart] = rawTime.split(" ");
        const [d, m, y] = datePart.split("/").map(Number);
        const [hh, mm, ss] = timePart.split(":").map(Number);

        const time = new Date(y, m - 1, d, hh, mm, ss);

        return time >= start && time <= end;
      });
      const times = filtered.map((r) => {
        const [datePart, timePart] = r["Thời gian"].split(" ");
        return isSameDay ? timePart : r["Thời gian"];
      });

      const dienap = filtered.map((r) => parseFloat((r[label_dienap] || "0").replace(",", ".")));
      const dongdien = filtered.map((r) => parseFloat((r[label_dongdien] || "0").replace(",", ".")));
      const congsuat = filtered.map((r) => parseFloat((r[label_congsuat] || "0").replace(",", ".")));

      updateChart("#chart1", "#info1", label_dienap, dienap, times, "V", null, isSameDay);
      updateChart("#chart2", "#info2", label_dongdien, dongdien, times, "A", null, isSameDay);
      updateChart("#chart3", "#info4", label_congsuat, congsuat, times, "W", updateTotal, isSameDay);
    })
    .catch((err) => console.error("Lỗi khi fetch dữ liệu:", err));
}

document.getElementById("download-excel-btn").addEventListener("click", function () {
  const startDateStr = document.getElementById("start-date").value;
  const endDateStr = document.getElementById("end-date").value;
  const startTimeStr = document.getElementById("start-time").value;
  const endTimeStr = document.getElementById("end-time").value;

  const isSameDay = toggleTimeInputs();

  const start = isSameDay && startTimeStr ? parseDateTime(startDateStr, startTimeStr) : parseDateTime(startDateStr, "00:00:00");
  const end = isSameDay && endTimeStr ? parseDateTime(endDateStr, endTimeStr) : parseDateTime(endDateStr, "23:59:59");

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(row => {
        const rawTime = row["Thời gian"];
        if (!rawTime || !rawTime.includes(" ")) return false;
        const [datePart, timePart] = rawTime.split(" ");
        const [d, m, y] = datePart.split("/").map(Number);
        const [hh, mm, ss] = timePart.split(":").map(Number);
        const time = new Date(y, m - 1, d, hh, mm, ss);
        return time >= start && time <= end;
      });

      // ✅ Tạo Excel từ dữ liệu đã lọc
      const ws = XLSX.utils.json_to_sheet(filtered);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");

      XLSX.writeFile(wb, "Data_Project.xlsx");
      alert("✅ Đã tải file Excel!");
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải dữ liệu:", err);
      alert("❌ Lỗi khi tải file Excel!");
    });
});




  function updateChart(chartID, infoID, label, values, categories, unit, callback, isSameDay) {
    if (!values.length) {
      console.warn(`Không có dữ liệu cho biểu đồ: ${label}`);
      return;
    }

    const last = values[values.length - 1];
    const prev = values[values.length - 2] ?? last;
    const icon = last > prev ? arrowUp : last < prev ? arrowDown : noChange;

    document.querySelector(infoID).innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        ${icon}
        <h3 style="margin:0;">${last.toFixed(2)} ${unit}</h3>
      </div>
    `;

    if (!charts[chartID]) {
      const options = getChartOptions(label, values, categories, isSameDay);
      charts[chartID] = new ApexCharts(document.querySelector(chartID), options);
      charts[chartID].render();
    } else {
      charts[chartID].updateSeries([{ name: label, data: values }], true);
      charts[chartID].updateOptions({
        xaxis: {
          categories,
          labels: {
            formatter: (val) => {
              if (!val) return "";
              return isSameDay ? val : val.split(" ")[0];
            },
          },
        }
      }, true);
    }

    if (typeof callback === "function") {
      callback(values);
    }
  }

  function getChartOptions(label, values, times, isSameDay) {
    let color = "#F3C623"; 
    let height = 300
    const maxWidth = window.innerWidth;
    if (label.includes("áp")) color = "#007BFF";
    else if (label.includes("suất")) color = "#537D5D";
    if(maxWidth<=600&&label.includes("suất")) height = "48%";
    else if(maxWidth<=600) height = "72%";
    return {
      chart: {
        type: "line",
        height: [height], 
        width: "100%", 
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: { speed: 300 },
        },
      },
      series: [{ name: label, data: values }],
      xaxis: {
        categories: times,
        labels: {
          rotate: -45,
          style: { fontSize: "10px" },
          formatter: (val) => {
            if (!val) return "";
            return isSameDay ? val : val.split(" ")[0];
          },
        },
      },
      stroke: { curve: "smooth", width: 4, colors: [color] },
      fill: { type: "solid", opacity: 0.2, color },
      colors: [color],
      tooltip: {
        x: { format: isSameDay ? "HH:mm:ss" : "dd/MM/yyyy" }
      },
      yaxis: {
      labels: {
        formatter: (val) => val.toFixed(2), // 👈 Hiển thị số thập phân
        style: { fontSize: "10px" },
      },
    },
    stroke: { curve: "smooth", width: 4, colors: [color] },
    fill: { type: "solid", opacity: 0.4, color },
    colors: [color],
    tooltip: {
      x: { format: isSameDay ? "HH:mm:ss" : "dd/MM/yyyy" },
      y: {
        formatter: (val) => `${val.toFixed(2)} ${label.includes("áp") ? "V" : label.includes("suất") ? "W" : "A"}`
      }
    },
    };
  }

  function updateTotal(values) {
    const total = values.reduce((a, b) => a + b, 0);
    document.getElementById("info3").innerHTML = `
      <h3 style="font-size:14px;color:#fff;">Tổng công suất tiêu thụ</h3>
      <h3 style="color:#fff;">${total.toFixed(2)} W</h3>
    `;
  }
  
  toggleTimeInputs();
  startAutoUpdate();document.querySelectorAll(".chart").forEach(chartEl => {
  chartEl.addEventListener("mouseenter", () => {
    if (autoUpdateInterval) {
      clearInterval(autoUpdateInterval);
      autoUpdateInterval = null;
      console.log("⏸️ Auto update paused due to hover");
    }
  });

  chartEl.addEventListener("mouseleave", () => {
    if (!autoUpdateInterval) {
      autoUpdateInterval = setInterval(fetchAndRender, 2000);
      console.log("▶️ Auto update resumed after hover");
    }
  });
});

});


// Lấy các phần tử
const toggleBtn = document.getElementById("toggle-btn");
const dateRangeContent = document.getElementById("date-range-container");

// Thêm sự kiện khi bấm nút "Chọn Ngày"
/*toggleBtn.addEventListener("click", function() {
  // Kiểm tra xem nội dung đã hiển thị hay chưa
  if (dateRangeContent.style.maxHeight === "0px" || dateRangeContent.style.maxHeight === "") {
    dateRangeContent.style.maxHeight = dateRangeContent.scrollHeight + "px"; // Kéo dài chiều cao đến chiều cao thực tế của nội dung
    dateRangeContent.style.padding = "20px";
    dateRangeContent.style.border ="1px solid #DDDDDD";
  } else {
    dateRangeContent.style.maxHeight = "0px"; // 
    // Ẩn lại bằng cách đặt max-height = 0
    
    dateRangeContent.style.border ="0px solid #DDDDDD";
    dateRangeContent.style.padding = "0";
  }
});*/
toggleBtn.addEventListener("click", function () {
  const container = document.getElementById("date-range-container");
  container.classList.toggle("show");
});


