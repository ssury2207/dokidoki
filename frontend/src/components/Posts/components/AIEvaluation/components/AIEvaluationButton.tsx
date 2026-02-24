import PrimaryButton from "@/src/components/atoms/PrimaryButton";

interface AIEvaluationProps {
  hasEvaluation: boolean;
  error: string | null;
  loading: boolean;
  postId: string;
  onRefresh: () => void;
  onGenerate: () => void;
}
export default function AIEvaluationButton({
  hasEvaluation,
  error,
  postId,
  loading,
  onRefresh,
  onGenerate,
}: AIEvaluationProps) {
  const submitButtonHandler = () => {
    if (error) {
      onRefresh();
    } else if (hasEvaluation) {
      console.log("navigation on this one ");
      onGenerate();
    } else {
      onGenerate();
    }
  };
  return (
    <PrimaryButton
      title={
        loading
          ? "loading...."
          : error
          ? "Retry AI based Review...."
          : hasEvaluation
          ? "View AI Evaluation"
          : "Get AI Evaluation"
      }
      submitHandler={submitButtonHandler}
      isActive={!loading}
    />
  );
}
