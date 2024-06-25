const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', (event) => {
      checkboxes.forEach((cb) => {
        if (cb !== event.target) {
          cb.checked = false;
        }
      });
    });
  });