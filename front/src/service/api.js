import axios from "axios";

const url = 'http://localhost:3001';

// export const getImage = async (picture) => {
//     const response = await fetch(picture);
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = new Uint8Array(arrayBuffer);
//     const contentType = response.headers.get("content-type");
//     return { buffer, contentType };

// }

export const addUser = async (data) => {
    try {

        const res = await axios.post(`${url}/api/add`, data);

        


    } catch (error) {
        console.log("Error while addUser API", error);
    }
}

export const getUsers = async () => {
    try {
        const res = await axios.get(`${url}/api/getUsers`);
        return res;
    } catch (error) {
        console.log("Error while getUsers API", error);
    }
}

export const setConversation = async (data) => {
     try{
        await axios.post(`${url}/api/conversation/add`, data);
     } catch(error){
        console.log("Error while setConversation API", error);
     }
}

export const getConversation = async (data) => {
    try{
        const d = await axios.post(`${url}/api/conversation/get`, data);
        
        return d.data;
     } catch(error){
        console.log("Error while setConversation API", error);
     }
}

export const newMessage = async (data) => {
    try{
        await axios.post(`${url}/api/message/add`, data);
        
        
     } catch(error){
        console.log("Error while adding Message API", error);
     }
}

export const getMessages = async (conversationId) => {  
    try{
        const res = await axios.get(`${url}/api/message/get/${conversationId}`);
        return res.data;
    } catch(error){
        console.log("Error while getting Messages API", error);
    }
}

export const UploadImage = async (data) => {
    try {
        return await axios.post(`${url}/api/file/upload`, data);
    } catch(err){
        console.log('Error while uploading image', err);
    }
}