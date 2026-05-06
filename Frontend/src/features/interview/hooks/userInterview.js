import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  generateResumePdf
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports
  } = context;

  const { interviewId } = useParams();

  const generateReport = async (jobDescription, selfDescription, resumeFile) => {
    setLoading(true);
    let response = null;

    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile
      });

      setReport(response.interviewReport);
      return response.interviewReport;

    } catch (err) {
      console.error(err);
      return null;

    } finally {
      setLoading(false);
    }
  };

  
  const getReportById = async (id) => {
    setLoading(true);
    let response = null;

    try {
      response = await getInterviewReportById(id);
      setReport(response.interviewReport);
      return response.interviewReport;

    } catch (err) {
      console.error(err);
      return null;

    } finally {
      setLoading(false);
    }
  };

  
  const getReports = async () => {
    setLoading(true);
    let response = null;

    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
      
    } catch (err) {
      console.error(err);
      return [];

    } finally {
      setLoading(false);
    }
  };


  const getResumePdf = async (interviewReportId) => {
  setLoading(true);

  try {
    const blob = await generateResumePdf(interviewReportId);

    console.log("PDF SIZE:", blob.size); // debug

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `resume_${interviewReportId}.pdf`;
    link.click();

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    report,
    reports,
    loading,
    generateReport,
    getReportById,
    getReports,
    getResumePdf
  };
};