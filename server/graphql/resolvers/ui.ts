import { GraphQLError } from "graphql";
import slider from "../../db/models/ui/slider";
import { GraphQlContext } from "../../utils/typedef";
import getText from "../../output_texts/get-output";
import gridView from "../../db/models/ui/grid-view";

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
interface CreateGridViewStructureArgs {
  page: string;
  structureLarge: [[string]];
  structureMedium: [[string]];
  structureSmall: [[string]];
  structureMobile: [[string]];
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

    getGridViewStructure: async (_: any, args: { page: string }) => {
      const requestedGrid = await gridView.findOne({ page: args.page });
      if(!requestedGrid){
        throw new GraphQLError(getText("GRID_VIEW_NOT_FOUND","EN"))
      }
      return requestedGrid.toJSON();
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
    createGridViewStructure: async (
      _:any,
      args: CreateGridViewStructureArgs,
      context: GraphQlContext
    )=>{
      const {userData} = context;
      if(!userData || !userData.userId || userData.role !== "Author"){
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE","EN"));
      }
      const newGridViewStructure = await gridView.create({
        page:args.page,
        structureLarge: args.structureLarge,
        structureMedium: args.structureMedium,
        structureSmall: args.structureSmall,
        structureMobile: args.structureMobile
      })
      newGridViewStructure.save();

      return newGridViewStructure;
    }
  },
};

export default UIResolver;
