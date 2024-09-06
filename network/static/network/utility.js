function getFormObject(data) {
  // Create a special FormData object from the form
  const formData = new FormData(data);

  // Convert FormData to a regular object
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  // Remove csrfmiddlewaretoken from formObject
  delete formObject["csrfmiddlewaretoken"];

  return formObject;
}

// Function to get CSRF token from the cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export { getFormObject, getCookie };
