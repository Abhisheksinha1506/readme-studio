import { FullTemplate, IFunction, Template } from '../../src/api/templates/template.model'

const templateHeadData: Template = {
    title: 'API / Library ReadME',
    description: 'A README focused on installing and using a published package or API client.',
    author: {
        name: 'Shaan Khan',
        url: {
            url: 'https://github.com/ShaanCoding',
            _type: 'Github',
        },
    },
    contributors: [],
    image: 'https://picsum.photos/seed/api-docs-readme/1280/650',
    dateCreated: new Date('2024-04-17T00:00:00.000Z'),
    lastUpdated: new Date('2024-04-17T00:00:00.000Z'),
    tags: [
        {
            name: 'Read Me',
            url: 'read-me',
        },
        {
            name: 'API Docs',
            url: 'api-docs',
        },
    ],
    featured: false,
    folder: 'api-documentation-readme',
    pageType: 'ReadME',
    startupBlocks: ['headerMacro', 'installationMacro', 'quickStartMacro', 'apiReferenceMacro', 'changelogMacro', 'licenseMacro'],
}

const functionsList: IFunction[] = [
    {
        name: 'Header',
        description: 'Package name, badges and a one-line pitch.',
        function: 'headerMacro',
        folder: 'api-documentation-readme',
        variables: [
            {
                label: 'Package Name',
                name: 'headerPackageName',
                defaultValue: 'your-package',
                _type: 'input',
            },
            {
                label: 'Badges',
                name: 'badgeList',
                defaultValue: [
                    { url: 'https://img.shields.io/npm/v/your-package', altTag: 'npm version' },
                    { url: 'https://img.shields.io/npm/l/your-package', altTag: 'license' },
                ],
                _type: 'list',
                listSchema: [
                    {
                        label: 'Badge URL',
                        name: 'url',
                        _type: 'input',
                    },
                    {
                        label: 'Badge Alt Text',
                        name: 'altTag',
                        _type: 'input',
                    },
                ],
            },
            {
                label: 'Pitch',
                name: 'headerPitch',
                defaultValue: 'A short, one-line description of what this package does.',
                _type: 'input',
            },
        ],
    },
    {
        name: 'Installation',
        description: 'Package manager install command.',
        function: 'installationMacro',
        folder: 'api-documentation-readme',
        variables: [
            {
                label: 'Install Command',
                name: 'installCommand',
                defaultValue: '```sh\nnpm install your-package\n```',
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'Quick Start',
        description: 'The smallest working example.',
        function: 'quickStartMacro',
        folder: 'api-documentation-readme',
        variables: [
            {
                label: 'Quick Start Example',
                name: 'quickStartExample',
                defaultValue: '```js\nimport { doTheThing } from "your-package"\n\ndoTheThing({ option: true })\n```',
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'API Reference',
        description: 'Public methods or endpoints.',
        function: 'apiReferenceMacro',
        folder: 'api-documentation-readme',
        variables: [
            {
                label: 'API Entries',
                name: 'apiEntryList',
                defaultValue: [
                    {
                        signature: 'doTheThing(options)',
                        description: 'Does the thing. `options.option` toggles the behavior.',
                    },
                ],
                _type: 'list',
                listSchema: [
                    {
                        label: 'Signature',
                        name: 'signature',
                        _type: 'input',
                    },
                    {
                        label: 'Description',
                        name: 'description',
                        _type: 'input',
                    },
                ],
            },
        ],
    },
    {
        name: 'Changelog',
        description: 'Where to find release notes.',
        function: 'changelogMacro',
        folder: 'api-documentation-readme',
        variables: [
            {
                label: 'Changelog Description',
                name: 'changelogDescription',
                defaultValue: 'See [CHANGELOG.md](./CHANGELOG.md) for release notes.',
                _type: 'textArea',
            },
        ],
    },
    {
        name: 'License',
        description: 'The package license.',
        function: 'licenseMacro',
        folder: 'api-documentation-readme',
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
