const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

let lastCallTime = 0;



const parseProblemData = (scrapedText) => {
    const lines = scrapedText.split("\n").map(line => line.trim()).filter(line => line !== "");

    let problemName = lines[0]; // First line is the problem name
    let timeLimit = lines[1].replace("time limit per test", "").trim();
    let memoryLimit = lines[2].replace("memory limit per test", "").trim();

    let problemDescription = [];
    let inputDescription = [];
    let outputDescription = [];
    let examples = [];
    let explanations = [];

    let section = "problem"; // Tracks which section we are parsing
    let currentExample = { input: null, output: null }; // Temporary object for examples
    let collectingExample = false; // Flag to track example collection

    for (let i = 3; i < lines.length; i++) {
        let line = lines[i];
        // console.log(line);
        if (line.toLowerCase() === "input") {
            section = "input";
            continue;
        } else if (line.toLowerCase() === "output") {
            section = "output";
            continue;
        } else if (line.toLowerCase() === "examples") {
            section = "example";
            collectingExample = true;
            continue;
        } else if (line.toLowerCase() === "note") {
            section = "explanation";
            collectingExample = false; // Stop collecting examples
            continue;
        }

        if (section === "problem") {
            problemDescription.push(line);
        }
        else if (section === "example" || collectingExample) {
            // Handle examples by pairing input-output
            if (line.toLowerCase() === "copy") continue; // Skip "Copy" text

            if (!currentExample.input) {
                currentExample.input = line;
            } else if (!currentExample.output) {
                currentExample.output = line;
                examples.push(currentExample);
                currentExample = {}; // Reset for next example
            }
        }
        else if (section === "input") {
            inputDescription.push(line);
        } else if (section === "output") {
            outputDescription.push(line);
        } else if (section === "explanation") {
            explanations.push(line);
        }
    }

    return {
        problem_name: problemName,
        time_limit: timeLimit,
        memory_limit: memoryLimit,
        problem_description: problemDescription.join(" "),
        input_description: inputDescription.join(" "),
        output_description: outputDescription.join(" "),
        examples: examples, // Array of input-output pairs
        explanations: explanations // Array of explanation paragraphs
    };
};

const FetchQuestion = async (constestId, index) => {
    const now = Date.now();

    if (now - lastCallTime < 3000) {
        console.log("Function call blocked: Please wait 3 seconds before calling again.");
        return;
    }

    lastCallTime = now; // Update the last call time

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Spoof User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

    // Visit the target website
    await page.goto(`https://codeforces.com/contest/${constestId}/problem/${index}`, { waitUntil: 'networkidle0' });

    // Scrape content
    const data = await page.evaluate(() => {
        const problemStatement = document.querySelector('.problem-statement');
        return problemStatement ? problemStatement.innerText : null;
    });

    // console.log("Scraped Data:", parseProblemData(data));

    await browser.close();
    return parseProblemData(data);
};


module.exports = { FetchQuestion };