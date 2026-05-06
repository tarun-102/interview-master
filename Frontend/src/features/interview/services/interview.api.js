const api = async (url, option = {}) => {
   const res = await fetch(`https://interview-master-bwsh.onrender.com${url}`, {
    credentials: "include",
    ...option,
  });
  return res
};

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile)

   const res = await api("/api/interview",{
        method: "POST",
        body: formData,
   });
   return res.json();
};

export const getInterviewReportById = async (interviewId)=>{
    const res = await api(`/api/interview/report/${interviewId}`, {
        method: "GET",
    })

    return res.json();
}

export const getAllInterviewReports = async ()=>{
    const res = await api("/api/interview/", {
        method: "GET",
    })
    return res.json();
}

export const generateResumePdf = async (interviewReportId) => {
    const res = await api(`/api/interview/resume/pdf/${interviewReportId}`, {
        method: "POST",
        
    })
    const blob = await res.blob(); // ✅ MOST IMPORTANT

    return blob;
    
}