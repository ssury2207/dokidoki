import { supabase } from "@/src/supabaseConfig";
import { useCallback, useEffect, useState } from "react";

export default function useAIEvaluationCheck(postId: string) {
  const [hasAIEvaluation, setHasEvaluation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const checkEvaluation = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from("ai_evaluations")
        .select("id")
        .eq("post_id", postId)
        .maybeSingle();
      if (dbError) {
        setError(dbError.message);
        setHasEvaluation(false);
        return;
      }
      if (data) {
        setHasEvaluation(true);
      } else setHasEvaluation(false);
    } catch (error) {
      setHasEvaluation(false);
      setError("Unknown error occurred in catch block");
    } finally {
      setLoading(false);
    }
  }, [postId]);
  useEffect(() => {
    if (postId) checkEvaluation();
  }, [postId, checkEvaluation]);

  return { hasAIEvaluation, loading, error, refetch: checkEvaluation };
}
