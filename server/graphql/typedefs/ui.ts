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
    type Query {
        getSlider(page: String): Slider
    }

    type Mutation {
        createSlider(page: String, slides: [SlideArgumens]): Slider
    }
`;
export default UITypeDefs;
