import { EN, TEXTS } from "./errors";

const getText = (textName: typeof TEXTS[number], language: "EN" | "FA") => {
  switch (language.toUpperCase()) {
    case "EN":
      return EN[textName];

    default:
      return EN[textName];
  }
};

export default getText;
