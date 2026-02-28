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

      // Case 1: Validation Error (check this FIRST)
      if (data && data.success === false && data.validation_failed === true) {
        setError({
          type: "validation",
          message: data.error || "Validation failed",
        });
        setEvaluationReport(null);
        return;
      }

      // Case 2: Success case
      if (data && data.success === true && data.data) {
        setEvaluationReport(data.data);
        return;
      }

      // Case 3: Technical Error (Edge Function Error)
      if (evaluationError) {
        setError({
          type: "technical",
          message: "Service unavailable. Please try again later.",
        });
        setEvaluationReport(null);
        return;
      }

      // Case 4: Invalid response structure
      setError({
        type: "technical",
        message: "Invalid response from server. Please try again.",
      });
      setEvaluationReport(null);
    } catch (error: any) {
      // Case 4: Catch Block Error
      setEvaluationReport(null);
      setError({
        type: "technical",
        message: error?.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [postId, imageURL, question]);

  return { evaluationReport, loading, error, refetch: generateAIReport };
}
