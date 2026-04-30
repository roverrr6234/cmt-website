/**
 * 모든 스키마 타입 통합 export.
 *
 * sanity.config.ts 의 schema.types 배열로 그대로 전달된다.
 */

/* ── Document types ── */
import { service } from "./documents/service";
import { homePage } from "./documents/homePage";
import { companyInfo } from "./documents/companyInfo";
import { siteHeader } from "./documents/siteHeader";
import { siteFooter } from "./documents/siteFooter";
import { notice } from "./documents/notice";
import { contactPage } from "./documents/contactPage";
import { noticesPage } from "./documents/noticesPage";

/* ── Object types ── */
import { procedureStep } from "./objects/procedureStep";
import {
  sectionText,
  sectionAlert,
  sectionTable,
  sectionChecklist,
  sectionComparisonTable,
  sectionProcedureImage,
} from "./objects/sectionBlocks";
import { statItem } from "./objects/statItem";
import { whyItem } from "./objects/whyItem";
import { quickLink } from "./objects/quickLink";

export const allSchemaTypes = [
  /* Documents (Studio 좌측 메뉴에 노출되는 것들) */
  service,
  homePage,
  companyInfo,
  siteHeader,
  siteFooter,
  notice,
  contactPage,
  noticesPage,

  /* Reusable objects (필드 안에서 참조됨) */
  procedureStep,
  sectionText,
  sectionAlert,
  sectionTable,
  sectionChecklist,
  sectionComparisonTable,
  sectionProcedureImage,
  statItem,
  whyItem,
  quickLink,
];
