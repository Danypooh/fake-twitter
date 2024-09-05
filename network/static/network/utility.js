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

export { getFormObject };
