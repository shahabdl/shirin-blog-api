"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.Likes = exports.Authors = exports.MockData = void 0;
const MockData = [
    {
        id: '0',
        image: "item-1.jpg",
        title: "Doon Doon Mirza",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        cookTime: 95,
        difficulty: "Hard",
        author: '0'
    },
    {
        id: '1',
        image: "item-2.jpg",
        title: "Recipe 2",
        description: "Lorem ipsum",
        cookTime: 12,
        difficulty: "Hard",
        author: '0'
    },
    {
        id: '2',
        image: "item-3.jpg",
        title: "Recipe 3",
        description: "Lorem ipsum",
        cookTime: 55,
        difficulty: "Hard",
        author: '0'
    },
    {
        id: '3',
        image: "item-4.jpg",
        title: "Recipe 4",
        description: "Lorem ipsum",
        cookTime: 46,
        difficulty: "Hard",
        author: '0'
    },
    {
        id: '4',
        image: "item-5.jpg",
        title: "Recipe 5",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet molestias velit temporibus accusamus at quod magnam tempore aliquam quisquam doloribus perferendis eaque praesentium, quia modi, minima vitae dolores. Quos, facilis?",
        cookTime: 35,
        difficulty: "Hard",
        author: '0'
    },
    {
        id: '5',
        image: "item-6.jpg",
        title: "Recipe 6",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        cookTime: 58,
        difficulty: "Hard",
        author: "0"
    },
];
exports.MockData = MockData;
const Likes = [
    {
        itemId: "0",
        users: [
            "0",
            "1"
        ],
        count: 2
    },
    {
        itemId: "1",
        users: [
            "1"
        ],
        count: 1
    },
    {
        itemId: "2",
        users: [],
        count: 0
    },
    {
        itemId: "3",
        users: [
            "0",
        ],
        count: 1
    },
];
exports.Likes = Likes;
const Users = [
    {
        id: "0",
        name: 'user1',
        image: 'user1.jpg',
        createdDate: "5-6-2018",
        lastLogin: "5-6-2022",
        likes: [
            "0",
            "3"
        ]
    },
    {
        id: "1",
        name: 'user2',
        image: 'user2.jpg',
        createdDate: "5-6-2018",
        lastLogin: "5-6-2022",
        likes: [
            "1",
            "0"
        ]
    }
];
exports.Users = Users;
const Authors = [
    {
        id: "0",
        name: "shirin",
        image: "/authors/shirin-par.jpg",
    },
    {
        id: "1",
        name: "shahab",
        image: "/authors/shahab-o.jpg",
    },
];
exports.Authors = Authors;
