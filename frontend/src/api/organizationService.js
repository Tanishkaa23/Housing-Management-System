import axios from 'axios';

export const fetchOrganizations = async (type) => {
  // Expected backend endpoint: GET /api/organizations?type=school
  const response = await axios.get(`${process.env.VITE_API_URL}/api/organizations`, {
    params: { type },
  });
  return response.data;
};
