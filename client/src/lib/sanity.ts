import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = '7l80ou25'
const dataset = 'production'
const apiVersion = '2024-04-24'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)

export function sanityImageUrl(source: string, width?: number): string {
  if (!source) return ''
  try {
    let url = builder.image(source).url()
    if (width) url += `?w=${width}&fit=max&auto=format`
    return url
  } catch {
    return ''
  }
}

// ── Queries ──

export const COMPANY_INFO_QUERY = `*[_type == "companyInfo"][0] {
  _id,
  companyName,
  ceoName,
  businessNumber,
  address,
  phone,
  email,
}`

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  _id,
  heroTitle,
  heroSubtitle,
  heroImage,
  aboutTitle,
  aboutContent,
  servicesTitle,
  servicesDescription,
  ctaTitle,
  ctaDescription,
}`

export const SERVICES_QUERY = `*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  shortTitle,
  slug,
  description,
  overview,
  law,
  lawArticle,
  penalty,
  tasks,
  documents,
  procedure,
  cardImage,
}`

export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0] {
  _id,
  title,
  shortTitle,
  slug,
  description,
  overview,
  law,
  lawArticle,
  penalty,
  tasks,
  documents,
  procedure,
  cardImage,
}`

export const NOTICES_QUERY = `*[_type == "notice"] | order(publishedAt desc, isPinned desc) {
  _id,
  title,
  category,
  excerpt,
  content,
  publishedAt,
  isPinned,
}`

export const HEADER_QUERY = `*[_type == "siteHeader"][0] {
  _id,
  logoTextEng,
}`

export const FOOTER_QUERY = `*[_type == "siteFooter"][0] {
  _id,
  businessInfoTitle,
  companyNameFooter,
  ceoNameFooter,
  businessNumberFooter,
  addressFooter,
  servicesTitle,
  quickLinksTitle,
  quickLinks,
  contactTitle,
  phoneFooter,
  emailFooter,
  copyrightText,
}`

// ── Types ──

export interface SanityCompanyInfo {
  _id: string
  companyName: string
  ceoName: string
  businessNumber: string
  address: string
  phone: string
  email: string
}

export interface SanityService {
  _id: string
  title: string
  shortTitle: string
  slug: {current: string}
  description: string
  overview: string
  law: string
  lawArticle: string
  penalty: string
  tasks: string[]
  documents: string[]
  procedure: Array<{step: string; detail: string}>
  cardImage?: {asset: {_ref: string}}
}

export interface SanityHomePage {
  _id: string
  heroTitle: string
  heroSubtitle: string
  heroImage?: {asset: {_ref: string}}
  aboutTitle: string
  aboutContent: string
  servicesTitle: string
  servicesDescription: string
  ctaTitle: string
  ctaDescription: string
}

export interface SanityNotice {
  _id: string
  title: string
  category: string
  excerpt: string
  content: string
  publishedAt: string
  isPinned: boolean
}

export interface SanityHeader {
  _id: string
  logoTextEng: string
}

export interface SanityFooter {
  _id: string
  businessInfoTitle: string
  companyNameFooter: string
  ceoNameFooter: string
  businessNumberFooter: string
  addressFooter: string
  servicesTitle: string
  quickLinksTitle: string
  quickLinks: Array<{label: string; link: string; isExternal: boolean; _key: string}>
  contactTitle: string
  phoneFooter: string
  emailFooter: string
  copyrightText: string
}
