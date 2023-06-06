export const TEXTS = [
  "NOT_AUTHORIZED_MESSAGE",
  "SERVER_ERROR_500",
  "INGREDIENT_NOT_EXISTS_WITH_THIS_ID",
  "INGREDIENT_DONT_HAVE_DATA",
  "RECIPE_NOT_FOUND",
  "COMMENT_MUST_HAVE_PARENT",
  "ALREADY_LIKED_RECIPE",
  "SLIDER_NOT_FOUND",
] as const;
export const EN: Record<string, string> = {
  NOT_AUTHORIZED_MESSAGE: "You are not athorized to do this action!",
  SERVER_ERROR_500: "Somthing went wrong! pls try again later",
  INGREDIENT_NOT_EXISTS_WITH_THIS_ID:
    "ingredient with this ID does not exist, provide a name instead of id to create new one!",
  INGREDIENT_DONT_HAVE_DATA: "ingredient does not contain any name or id!",
  RECIPE_NOT_FOUND: "Cannot find Recipe with this ID!",
  COMMENT_MUST_HAVE_PARENT: "Comments Must have a comment or recipe parent!",
  ALREADY_LIKED_RECIPE: "User has already liked this recipe",
  SLIDER_NOT_FOUND: "slider for this page was not found!",
};
