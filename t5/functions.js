const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occurred`);
  }
  const json = await response.json(); // await here to ensure JSON parsing is complete
  return json;
};

export {fetchData};
