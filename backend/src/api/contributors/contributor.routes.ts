import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { ContributorSchema, GithubContributionsListSchema, IssueTypeSchema, PullRequestTypeSchema } from './contributor.model'
import { templateRegistry } from '../templates/template.routes'

export const contributorRegistry = new OpenAPIRegistry()

templateRegistry.register('IIssueType', IssueTypeSchema)
templateRegistry.register('IPullRequestType', PullRequestTypeSchema)
templateRegistry.register('IContributor', ContributorSchema)
templateRegistry.register('IGithubContributionsList', GithubContributionsListSchema)
