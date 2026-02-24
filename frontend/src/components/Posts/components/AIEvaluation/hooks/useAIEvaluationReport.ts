import { supabase } from "@/src/supabaseConfig";
import { useCallback, useState } from "react";

interface AIEvaluationError {
  type: "validation" | "technical";
  message: string;
}

export default function useAIEvaluationReport(
  postId: string,
  imageURL: string[],
  question: string | null
) {
  const [evaluationReport, setEvaluationReport] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AIEvaluationError | null>(null);

  const generateAIReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: evaluationError } = await supabase.functions.invoke(
        "aievaluator",
        {
          body: {
            post_id: postId,
            image_urls: imageURL,
            question: question,
          },
        }
      );

      // Case 1: Validation Error
      if (data?.success === false || data?.data?.validation_passed === false) {
        setError({
          type: "validation",
          message: data?.error || data?.data?.error || "Validation failed",
        });
        setEvaluationReport(null);
        console.log("Validation Error:", data?.error);
        return;
      }

      // Case 2: Technical Error (Edge Function Error)
      if (evaluationError) {
        setError({
          type: "technical",
          message: "Service unavailable. Please try again later.",
        });
        setEvaluationReport(null);
        console.log("Technical Error:", evaluationError);
        return;
      }

      // Case 3: Check if we have valid data
      if (!data || !data.data) {
        setError({
          type: "technical",
          message: "Invalid response from server. Please try again.",
        });
        setEvaluationReport(null);
        console.log("Invalid response:", data);
        return;
      }

      // Success case
      setEvaluationReport(data.data);
      console.log("Success:", data.data);
    } catch (error: any) {
      // Case 4: Catch Block Error
      setEvaluationReport(null);
      setError({
        type: "technical",
        message: error?.message || "An error occurred. Please try again.",
      });
      console.log("Catch error:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, imageURL, question]);

  return { evaluationReport, loading, error, refetch: generateAIReport };
}
