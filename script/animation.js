document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("a");
  
    links.forEach(link => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
  
        const href = this.getAttribute("href");
        document.body.classList.add("hide"); // Start transition
  
        setTimeout(() => {
          window.location.href = href; // Change page after animation
        }, 500); // Match CSS duration
      });
    });
  
    // Ensure page starts with animation effect
    document.body.classList.remove("hide");
  });