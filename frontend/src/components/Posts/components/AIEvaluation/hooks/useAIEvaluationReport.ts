import { supabase } from "@/src/supabaseConfig";
import { useCallback, useEffect, useState } from "react";

export default function useAIEvaluationReport(
  postId: string,
  imageURL: string[],
  question: string | null
) {
  const [evaluationReport, setEvaluationReport] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<object | null>(null);
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

      if (evaluationError) {
        setError(evaluationError);
        setEvaluationReport(null);
        console.log("Error:", evaluationError);
        return;
      }

      if (data) {
        setEvaluationReport(data);
        console.log("Success:", data);
      }
    } catch (error) {
      setEvaluationReport(null);
      setError({ error: "Unknown error occurred in while generating Report" });
      console.log("Catch error:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, imageURL, question]);
  return { evaluationReport, loading, error, refetch: generateAIReport };
}
