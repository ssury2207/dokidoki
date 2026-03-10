import PrimaryButton from "@/src/components/atoms/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/types/navigation";

type Nav = StackNavigationProp<RootStackParamList>;

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
  const navigation = useNavigation<Nav>();

  const submitButtonHandler = () => {
    if (error) {
      onRefresh();
    } else if (hasEvaluation) {
      // Navigate to view existing evaluation
      navigation.navigate("AIEvaluationReport", { postId });
    } else {
      // Generate new evaluation
      onGenerate();
      navigation.navigate("AIEvaluationReport", { postId });
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
