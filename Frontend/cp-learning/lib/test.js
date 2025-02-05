const { isValidUser } = require("./codeforces.js");

const testrun=async()=>{
    const result = await isValidUser("shiv.22");
    console.log(result);
}
testrun();