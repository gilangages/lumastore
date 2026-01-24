export const getAllProducts = async () => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};

export const createProduct = async (token, formData) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};
