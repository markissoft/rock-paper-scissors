export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let event;

    if (data?.event) {
      event = data.event;
    } else {
      event = data;
    }

    return { error: true, status: response.status, event };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let event = "An error occured...";

    if (data?.event) {
      event = data.event;
    }

    return { error: true, status: response.status, event };
  }

  return data;
};
