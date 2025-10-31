export type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: { caseType: boolean | null };
  MainsScreen: {
    date?: string;
  };
  PractisedQuestions:
    | {
        data?: unknown[];
        questionType?: "pre" | "mains";
      }
    | undefined;
  PrelimsScreen: undefined;
  Overlay: undefined;
  MainsVerdictOverlay: {
    uid: string;
    uploadCopies: { id: number; uri: string }[];
    prelims_solved: boolean;
    mains_solved: boolean;
    data: { id: string } | null;
    date?: string;
  };
  FullScreenImageViewer: {
    imageUrl: string;
  };
  PrelimsArchived: {
    question: any;
  };
  OthersAnswersList: undefined;
  PostDetail: {
    postId: string;
  };
  CreatePostScreen: {
    images?: string[];
  };
  CreatePostOverlay: {
    images?: string[];
    question?: string;
    year?: string;
    paper?: string;
    questionId?: string;
  };
  CustomAnswerScreen: undefined;
  CustomVerdictOverlay: {
    uid: string;
    uploadCopies: { id: number; uri: string }[];
  };
  CustomPostOverlay: {
    images?: string[];
  };
};
