export const formatBoardType = (boardType: string) => {
  switch (boardType) {
    case "ISSUE":
      return "Issue";
    case "FEATURE_REQUEST":
      return "Feature Request";
    case "CHANGELOG":
      return "Changelog";
    default:
      return boardType;
  }
};
