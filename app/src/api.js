const API_BASE_URL = 'http://localhost:5000/api';

// ========== RESOLUTIONS ==========

export const getResolutions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/resolutions`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    return [];
  }
};

export const createResolution = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resolutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
    return await response.json();
  } catch (error) {
    console.error('Error creating resolution:', error);
    throw error;
  }
};

export const updateResolution = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resolutions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (error) {
    console.error('Error updating resolution:', error);
    throw error;
  }
};

export const deleteResolution = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resolutions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Error deleting resolution:', error);
    throw error;
  }
};

// ========== DAILY HABITS ==========

export const getDailyHabits = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-habits`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching daily habits:', error);
    return [];
  }
};

export const createDailyHabit = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
    return await response.json();
  } catch (error) {
    console.error('Error creating daily habit:', error);
    throw error;
  }
};

export const updateDailyHabit = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (error) {
    console.error('Error updating daily habit:', error);
    throw error;
  }
};

export const deleteDailyHabit = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-habits/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Error deleting daily habit:', error);
    throw error;
  }
};

export const resetDailyHabits = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-habits/reset`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to reset');
    return await response.json();
  } catch (error) {
    console.error('Error resetting daily habits:', error);
    throw error;
  }
};
