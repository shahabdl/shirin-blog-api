const UITypeDefs = `#graphql
    input SlideArgumens {
        title: String
        description: String
        image: String
    }
    type Slide {
        title: String
        description: String
        image: String
    }
    type Slider {
        id: ID
        page: String
        slide: [Slide]
    }
    type GridViewStructure {
        id: ID
        page: String
        structureLarge: [[String]]
        structureMedium: [[String]]
        structureSmall: [[String]]
        structureMobile: [[String]]

    }
    type Query {
        getSlider(page: String): Slider
        getGridViewStructure(page: String): GridViewStructure
    }

    type Mutation {
        createSlider(page: String, slides: [SlideArgumens]): Slider
        createGridViewStructure(page: String, structureLarge:[[String]], structureMedium:[[String]],structureSmall:[[String]], structureMobile:[[String]]): GridViewStructure
    }
`;
export default UITypeDefs;
