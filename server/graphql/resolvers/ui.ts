import { GraphQLError } from "graphql";
import slider from "../../db/models/slider";
import { GraphQlContext } from "../../utils/typedef";
import getText from "../../output_texts/get-output";

interface CreateSliderArgs {
  page: string;
  slides: [
    {
      title: string;
      description: string;
      image: string;
    }
  ];
}

const UIResolver = {
  Query: {
    getSlider: async (_: any, args: { page: string }) => {
      const requestedSlider = await slider.findOne({ page: args.page });
      if (!requestedSlider) {
        throw new GraphQLError(getText("SLIDER_NOT_FOUND", "EN"));
      }
      return requestedSlider;
    },
  },

  Mutation: {
    createSlider: async (
      _: any,
      args: CreateSliderArgs,
      context: GraphQlContext
    ) => {
      const { userData } = context;
      if (!userData || !userData.userId || userData.role !== "Author") {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const newSlider = await slider.create({
        page: args.page,
        slide: [...args.slides],
      });
      newSlider.save();

      return newSlider.toJSON();
    },
  },
};

export default UIResolver;
