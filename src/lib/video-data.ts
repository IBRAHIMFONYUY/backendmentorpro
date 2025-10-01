
export type Video = {
    id: string;
    title: string;
    description: string;
    channel: string;
    youtubeId: string;
    thumbnailUrl: string;
};

export const videos: Video[] = [
    {
        id: '1',
        title: 'Node.js and Express.js - Full Course',
        description: 'Learn to build modern backend applications with Node.js and the Express framework. This comprehensive course covers everything from the basics of Node to advanced topics like middleware, authentication, and database integration.',
        channel: 'freeCodeCamp.org',
        youtubeId: 'Oe421JkE9fk',
        thumbnailUrl: 'https://picsum.photos/seed/video1/480/270'
    },
    {
        id: '2',
        title: 'Microservices Tutorial for Beginners',
        description: 'An introduction to the microservices architecture. This video explains the core concepts, benefits, and challenges of microservices and shows how to build a simple system with Node.js.',
        channel: 'TechWorld with Nana',
        youtubeId: 'rv4MIE2B--0',
        thumbnailUrl: 'https://picsum.photos/seed/video2/480/270'
    },
    {
        id: '3',
        title: 'SQL Tutorial - Full Database Course for Beginners',
        description: 'Learn the fundamentals of SQL and database design. This course covers everything from basic queries like SELECT and WHERE to advanced topics like JOINs, GROUP BY, and transactions.',
        channel: 'freeCodeCamp.org',
        youtubeId: 'HXV3zeQKqGY',
        thumbnailUrl: 'https://picsum.photos/seed/video3/480/270'
    },
    {
        id: '4',
        title: 'Docker Tutorial for Beginners - A Full DevOps Course',
        description: 'A complete introduction to Docker. Learn how to containerize your applications, manage images and containers, use Docker Compose, and integrate Docker into your development workflow.',
        channel: 'TechWorld with Nana',
        youtubeId: '3c-iBn73dDE',
        thumbnailUrl: 'https://picsum.photos/seed/video4/480/270'
    },
    {
        id: '5',
        title: 'GraphQL Full Course - Novice to Expert',
        description: 'Learn how to build and consume GraphQL APIs. This course covers GraphQL fundamentals, schemas, queries, mutations, subscriptions, and how to set up a GraphQL server with Apollo.',
        channel: 'freeCodeCamp.org',
        youtubeId: 'ed8SzALpx1Q',
        thumbnailUrl: 'https://picsum.photos/seed/video5/480/270'
    },
    {
        id: '6',
        title: 'System Design Interview Question: DESIGN A PARKING LOT',
        description: 'A detailed walkthrough of a common system design interview question. Learn how to approach the problem, gather requirements, design the API, database schema, and scale the system.',
        channel: 'Gaurav Sen',
        youtubeId: 'U8-S6d_tcvg',
        thumbnailUrl: 'https://picsum.photos/seed/video6/480/270'
    },
    {
        id: '7',
        title: 'Authentication with JWT (Node.js)',
        description: 'A focused tutorial on implementing JSON Web Token (JWT) authentication in a Node.js and Express application. Covers token creation, validation, middleware, and storing tokens securely.',
        channel: 'Web Dev Simplified',
        youtubeId: 'mbsmsi7l3r4',
        thumbnailUrl: 'https://picsum.photos/seed/video7/480/270'
    },
    {
        id: '8',
        title: 'REST API vs GraphQL',
        description: 'A comparison between two popular API architectures: REST and GraphQL. Understand the pros and cons of each, and learn when to choose one over the other for your projects.',
        channel: 'Fireship',
        youtubeId: 'PeAOE721fF8',
        thumbnailUrl: 'https://picsum.photos/seed/video8/480/270'
    }
];
