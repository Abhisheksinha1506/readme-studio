import { FullTemplate, IFunction, Template } from '../../src/api/templates/template.model'

const templateHeadData: Template = {
    title: 'Minimal ReadME',
    description: 'A small, no-frills README for projects that don\'t need the full checklist.',
    author: {
        name: 'Shaan Khan',
        url: {
            url: 'https://github.com/ShaanCoding',
            _type: 'Github',
        },
    },
    contributors: [],
    image: 'https://picsum.photos/seed/minimal-readme/1280/650',
    dateCreated: new Date('2024-04-17T00:00:00.000Z'),
    lastUpdated: new Date('2024-04-17T00:00:00.000Z'),
    tags: [
        {
            name: 'Read Me',
            url: 'read-me',
        },
        {
            name: 'Minimal',
            url: 'minimal',
        },
    ],
    featured: false,
    folder: 'minimal-readme',
    pageType: 'ReadME',
    startupBlocks: ['headerMacro', 'aboutMacro', 'installationMacro', 'usageMacro', 'licenseMacro'],
}

const functionsList: IFunction[] = [
    {
        name: 'Header',
        description: 'Project title and one-line tagline.',
        function: 'headerMacro',
        folder: 'minimal-readme',
        variables: [
            {
                label: 'Title',
                name: 'headerTitle',
                defaultValue: 'Project Name',
                _type: 'input',
            },
            {
                label: 'Tagline',
                name: 'headerTagline',
                defaultValue: 'One line describing what this does and who it is for.',
                _type: 'input',
            },
        ],
    },
    {
        name: 'About',
        description: 'A short paragraph about the project.',
        function: 'aboutMacro',
        folder: 'minimal-readme',
        variables: [
            {
                label: 'About Description',
                name: 'aboutDescription',
                defaultValue: 'What this project does, in two or three sentences. Save the detail for the code and the docs.',
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'Installation',
        description: 'How to install the project.',
        function: 'installationMacro',
        folder: 'minimal-readme',
        variables: [
            {
                label: 'Installation Steps',
                name: 'installationSteps',
                defaultValue: '```sh\nnpm install your-package\n```',
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'Usage',
        description: 'A minimal usage example.',
        function: 'usageMacro',
        folder: 'minimal-readme',
        variables: [
            {
                label: 'Usage Example',
                name: 'usageExample',
                defaultValue: '```js\nconst thing = require("your-package")\nthing.doTheThing()\n```',
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'License',
        description: 'The project license.',
        function: 'licenseMacro',
        folder: 'minimal-readme',
        variables: [
            {
                label: 'License Name',
                name: 'licenseName',
                defaultValue: 'MIT',
                _type: 'input',
            },
            {
                label: 'License URL',
                name: 'licenseUrl',
                defaultValue: 'https://opensource.org/licenses/MIT',
                _type: 'input',
            },
        ],
    },
]

const templateData: FullTemplate = {
    ...templateHeadData,
    functions: functionsList,
}

export default templateData
