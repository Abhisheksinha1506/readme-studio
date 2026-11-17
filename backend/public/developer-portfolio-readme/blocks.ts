import { FullTemplate, IFunction, Template } from '../../src/api/templates/template.model'

const templateHeadData: Template = {
    title: 'Developer Portfolio ReadME',
    description: 'A profile-style README for a personal GitHub profile or portfolio repo.',
    author: {
        name: 'Shaan Khan',
        url: {
            url: 'https://github.com/ShaanCoding',
            _type: 'Github',
        },
    },
    contributors: [],
    image: 'https://picsum.photos/seed/dev-portfolio-readme/1280/650',
    dateCreated: new Date('2024-04-17T00:00:00.000Z'),
    lastUpdated: new Date('2024-04-17T00:00:00.000Z'),
    tags: [
        {
            name: 'Read Me',
            url: 'read-me',
        },
        {
            name: 'Portfolio',
            url: 'portfolio',
        },
    ],
    featured: false,
    folder: 'developer-portfolio-readme',
    pageType: 'ReadME',
    startupBlocks: ['headerMacro', 'aboutMeMacro', 'skillsMacro', 'projectsMacro', 'contactMacro'],
}

const functionsList: IFunction[] = [
    {
        name: 'Header',
        description: 'Your name, title and social links.',
        function: 'headerMacro',
        folder: 'developer-portfolio-readme',
        variables: [
            {
                label: 'Avatar',
                name: 'headerAvatar',
                defaultValue: {
                    url: 'https://avatars.githubusercontent.com/u/0',
                    altTag: 'Profile picture',
                },
                _type: 'object',
                objectSchema: [
                    {
                        label: 'Avatar URL',
                        name: 'url',
                        _type: 'input',
                    },
                    {
                        label: 'Avatar Alt Text',
                        name: 'altTag',
                        _type: 'input',
                    },
                ],
            },
            {
                label: 'Name',
                name: 'headerName',
                defaultValue: 'Your Name',
                _type: 'input',
            },
            {
                label: 'Title',
                name: 'headerTitle',
                defaultValue: 'Full-Stack Developer',
                _type: 'input',
            },
            {
                label: 'Social Links',
                name: 'socialLinkList',
                defaultValue: [
                    { name: 'GitHub', url: 'https://github.com/your_username' },
                    { name: 'LinkedIn', url: 'https://linkedin.com/in/your_username' },
                ],
                _type: 'list',
                listSchema: [
                    {
                        label: 'Platform Name',
                        name: 'name',
                        _type: 'input',
                    },
                    {
                        label: 'Profile URL',
                        name: 'url',
                        _type: 'input',
                    },
                ],
            },
        ],
    },
    {
        name: 'About Me',
        description: 'A short bio.',
        function: 'aboutMeMacro',
        folder: 'developer-portfolio-readme',
        variables: [
            {
                label: 'About Me Description',
                name: 'aboutMeDescription',
                defaultValue:
                    "I'm a developer who enjoys building things for the web. Currently learning new tools and contributing to open source when I can.",
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'Skills',
        description: 'Languages, frameworks and tools.',
        function: 'skillsMacro',
        folder: 'developer-portfolio-readme',
        variables: [
            {
                label: 'Skills List',
                name: 'skillsList',
                defaultValue: [{ name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'React' }, { name: 'Node.js' }],
                _type: 'list',
                listSchema: [
                    {
                        label: 'Skill Name',
                        name: 'name',
                        _type: 'input',
                    },
                ],
            },
        ],
    },
    {
        name: 'Projects',
        description: 'A few projects worth showing off.',
        function: 'projectsMacro',
        folder: 'developer-portfolio-readme',
        variables: [
            {
                label: 'Projects List',
                name: 'projectsList',
                defaultValue: [
                    {
                        name: 'Project One',
                        description: 'A short description of what this project does.',
                        url: 'https://github.com/your_username/project-one',
                    },
                ],
                _type: 'list',
                listSchema: [
                    {
                        label: 'Project Name',
                        name: 'name',
                        _type: 'input',
                    },
                    {
                        label: 'Project Description',
                        name: 'description',
                        _type: 'input',
                    },
                    {
                        label: 'Project URL',
                        name: 'url',
                        _type: 'input',
                    },
                ],
            },
        ],
    },
    {
        name: 'Contact',
        description: 'How people can reach you.',
        function: 'contactMacro',
        folder: 'developer-portfolio-readme',
        variables: [
            {
                label: 'Contact Description',
                name: 'contactDescription',
                defaultValue: 'Feel free to reach out at your.email@example.com',
                _type: 'textArea',
            },
        ],
    },
]

const templateData: FullTemplate = {
    ...templateHeadData,
    functions: functionsList,
}

export default templateData
