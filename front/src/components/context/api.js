// src/components/context/api.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
console.log("🔗 Backend URL:", BACKEND_URL);

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ USER API
export const addUser = async (data) => {
  try {
    console.log("📤 Sending user data to backend:", data);
    const res = await api.post('/api/add', data);
    console.log("✅ User added successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error while addUser API:", error.response?.data || error.message);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    console.log("📤 Fetching users...");
    const res = await api.get('/api/getUsers');
    console.log("✅ Users fetched:", res.data?.length || 0);
    return res.data;
  } catch (error) {
    console.error("❌ Error while getUsers API:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ CONVERSATION API
export const setConversation = async (data) => {
  try {
    console.log("📤 Setting conversation:", data);
    const res = await api.post('/api/conversation/add', data);
    console.log("✅ Conversation set:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error while setConversation API:", error.response?.data || error.message);
    throw error;
  }
};

export const getConversation = async (data) => {
  try {
    console.log("📤 Getting conversation:", data);
    const res = await api.post('/api/conversation/get', data);
    console.log("✅ Conversation fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error while getConversation API:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ MESSAGE API
export const newMessage = async (data) => {
  try {
    console.log("📤 Sending message:", data);
    const res = await api.post('/api/message/add', data);
    console.log("✅ Message sent:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error while adding Message API:", error.response?.data || error.message);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    if (!conversationId) {
      console.log("⚠️ No conversationId provided");
      return [];
    }
    console.log("📤 Getting messages for conversation:", conversationId);
    const res = await api.get(`/api/message/get/${conversationId}`);
    console.log("✅ Messages fetched:", res.data?.length || 0);
    return res.data;
  } catch (error) {
    console.error("❌ Error while getting Messages API:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ FILE UPLOAD API
export const UploadImage = async (data) => {
  try {
    const res = await api.post('/api/file/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("✅ Image uploaded:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error while uploading image:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ TEST API
export const testBackend = async () => {
  try {
    const res = await api.get('/api/health');
    console.log("✅ Backend health:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Backend not reachable:", error.message);
    throw error;
  }
};

export const getFileUrl = async (blobName) => {
  const res = await api.get(`/api/file/url/${encodeURIComponent(blobName)}`);
  return res.data.data.url;
};

export const getDownloadUrl = (blobName) => {
  return `${BACKEND_URL}/api/file/download/${encodeURIComponent(blobName)}`;
};

export default api;