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

export const productDelete = async (token, id) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
