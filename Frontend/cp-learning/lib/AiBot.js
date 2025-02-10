const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBZGFSq3s5A_jr0ERP7vy89qhdw2bhwRuc");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



export const Jarvis=async(prompt)=>{
    const result = await model.generateContent(prompt);
    return result.response.text();
}

