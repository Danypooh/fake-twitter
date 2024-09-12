function getProfileData(profile_id) {
  const url = `/profile/${profile_id}`;

  // fetch profile
  const allData = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return [];
    });

  return allData;
}

export { getProfileData };
