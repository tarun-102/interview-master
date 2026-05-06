const { GoogleGenAI } = require("@google/genai");

const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

function fixArrayToObjects(arr, keys) {
  const result = [];
  let obj = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];

    if (keys.includes(key)) {
      obj[key] = value;
    }

    if (Object.keys(obj).length === keys.length) {
      result.push(obj);
      obj = {};
    }
  }

  return result;
}

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate a detailed interview report in JSON format.

Return ONLY valid JSON.

Use this exact structure:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "Real technical interview question",
      "intention": "Why interviewer asks this",
      "answer": "How the candidate should answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Real behavioral question",
      "intention": "What it evaluates",
      "answer": "How to answer it"
    }
  ],
  "skillGaps": [
    {
      "skill": "Missing skill",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Topic name",
      "tasks": ["Task 1", "Task 2"]
    }
  ],
  "title": "Job title"
}

CRITICAL RULES:
- You MUST generate at least 3 items for each array:
  - technicalQuestions (min 3)
  - behavioralQuestions (min 3)
  - skillGaps (min 3)
  - preparationPlan (min 3 days)
- NEVER return empty arrays
- If information is missing, create realistic assumptions
- Each object must be complete with all fields

IMPORTANT INSTRUCTIONS:
- Generate real and meaningful content (not placeholders like "question")
- Each item inside arrays must be a complete object
- Combine question, intention, and answer into ONE object
- Do NOT separate them into multiple array values
- Do NOT leave arrays empty
- Follow proper JSON format

Now generate based on:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
      // responseJsonSchema: zodToJsonSchema(interviewReportSchema)
    },
  });

  const raw = JSON.parse(response.text);

  // FIX technicalQuestions
  if (
    Array.isArray(raw.technicalQuestions) &&
    typeof raw.technicalQuestions[0] === "string"
  ) {
    raw.technicalQuestions = fixArrayToObjects(raw.technicalQuestions, [
      "question",
      "intention",
      "answer",
    ]);
  }

  // FIX behavioralQuestions
  if (
    Array.isArray(raw.behavioralQuestions) &&
    typeof raw.behavioralQuestions[0] === "string"
  ) {
    raw.behavioralQuestions = fixArrayToObjects(raw.behavioralQuestions, [
      "question",
      "intention",
      "answer",
    ]);
  }

  // FIX skillGaps
  if (Array.isArray(raw.skillGaps) && typeof raw.skillGaps[0] === "string") {
    raw.skillGaps = fixArrayToObjects(raw.skillGaps, ["skill", "severity"]);
  }

  // FIX preparationPlan
  if (Array.isArray(raw.preparationPlan)) {
    // Case 1: flat array (AI bug)
    if (typeof raw.preparationPlan[0] === "string") {
      raw.preparationPlan = fixArrayToObjects(raw.preparationPlan, [
        "day",
        "focus",
        "tasks",
      ]);
    }

    // Case 2: ensure tasks is array
    raw.preparationPlan = raw.preparationPlan.map((item) => ({
      ...item,
      tasks: Array.isArray(item.tasks) ? item.tasks : [item.tasks],
    }));
  }

  return raw;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent,{waitUntil: "networkidle0"})
  const pdfBuffer = await page.pdf({format: "A4",
    margin:{
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm"
    }
  })

  await browser.close()
  return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
   const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The html content of the resume which can be conveted to pdf using an library puppeteer",
      ),
  });

  const prompt = `generate a resume for a candidate with the following detail
    resume: ${resume}
    selfdescription: ${selfDescription}
    jobdescription: ${jobDescription}

    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                          The content of resume should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.


                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.

                  
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent =  JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

  return pdfBuffer;

}

module.exports = {generateInterviewReport, generateResumePdf};
