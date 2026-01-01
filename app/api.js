const API_BASE_URL = 'http://localhost:5000/api';

// ========== RESOLUTIONS ==========

export const getResolutions = async () => {
  const response = await fetch(`${API_BASE_URL}/resolutions`);
  return response.json();
};

export const createResolution = async (data) => {
  const response = await fetch(`${API_BASE_URL}/resolutions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateResolution = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/resolutions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteResolution = async (id) => {
  const response = await fetch(`${API_BASE_URL}/resolutions/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// ========== DAILY HABITS ==========

export const getDailyHabits = async () => {
  const response = await fetch(`${API_BASE_URL}/daily-habits`);
  return response.json();
};

export const createDailyHabit = async (data) => {
  const response = await fetch(`${API_BASE_URL}/daily-habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateDailyHabit = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/daily-habits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteDailyHabit = async (id) => {
  const response = await fetch(`${API_BASE_URL}/daily-habits/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const resetDailyHabits = async () => {
  const response = await fetch(`${API_BASE_URL}/daily-habits/reset`, {
    method: 'POST'
  });
  return response.json();
};
