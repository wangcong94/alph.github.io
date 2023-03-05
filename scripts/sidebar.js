function toggleSidebar() {
  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("show");
    document.getElementById('overlay-sidebar').classList.remove('active');
    setTimeout(function () {
        document.getElementById("sidebar").classList.add("hidden");
    }, 100);
  }
  function openSidebar() {
    document.getElementById("sidebar").classList.remove("hidden");
    document.getElementById('overlay-sidebar').classList.add('active');
    document.getElementById("overlay-sidebar").addEventListener("click", closeSidebar);
  }
  if (document.getElementById("sidebar").classList.contains("hidden")) {
    openSidebar();
    setTimeout(function () {
        document.getElementById("sidebar").classList.add("show");
    }, 1);
  } else {
    closeSidebar();
  }
}

// ------------------------ Main Starts Here -----------------------------------------
document.getElementById('menuIcon').addEventListener('click', () => {
  toggleSidebar();
});
