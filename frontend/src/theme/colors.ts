const primaryAndSecondary = {
  primary: "#323EBE",
  secondary: "#4955CF",
};

export const colors = {
  dark: {
    ...primaryAndSecondary,
    background: {
      // default: "#000000",
      default: "#15202b",
      // paper: "#121212",
      paper: "#192734",
    },
    text: {
      // primary: "#FFFFFF", // Example primary text color for dark mode
      primary: "#fafafa", // Example primary text color for dark mode
      secondary: "#F6F6F6", // Example secondary text color for dark mode
    },
    // background: {
    //   default: "#15202b",
    //   paper: "#192734",
    // },
    // text: {
    //   primary: "#fafafa", // Example primary text color for dark mode
    //   secondary: "#F6F6F6", // Example secondary text color for dark mode
    // },
  },
  light: {
    ...primaryAndSecondary,
    background: {
      default: "#FFFFFF",
      paper: "#E2E2E2",
    },
    text: {
      primary: "#252939", // Example secondary text color for dark mode
      secondary: "#272b3c",
    },
  },
};
