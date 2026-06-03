document.getElementById('weatherIcon').addEventListener('click', function() {
    var modal = document.getElementById('weatherModal');
    var overlay = document.getElementById('modalOverlay');
    modal.style.display = 'block';
    overlay.style.display = 'block';
});

document.getElementById('modalOverlay').addEventListener('click', function() {
    var modal = document.getElementById('weatherModal');
    var overlay = document.getElementById('modalOverlay');
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

document.getElementById('closeModal').addEventListener('click', function() {
    var modal = document.getElementById('weatherModal');
    var overlay = document.getElementById('modalOverlay');
    modal.style.display = 'none';
    overlay.style.display = 'none';
});
