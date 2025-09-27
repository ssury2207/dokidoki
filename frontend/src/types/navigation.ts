export type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: { caseType: string | null };
  MainsScreen: {
    date?: string;
  };
  PractisedQuestions: undefined;
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
  CreatePostScreen: {
    images?: string[];
  };
  CreatePostOverlay: {
    images?: string[];
    question?: string;
    year?: string;
    paper?: string;
  };
};
