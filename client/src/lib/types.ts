import type { LucideIcon } from "lucide-react";

/**
 * 서비스 도큐먼트 / Sanity 변환 결과의 공용 타입.
 *
 * 출처: 원래 client/src/lib/serviceData.ts 에 있던 type 정의를 동일하게 옮긴 것.
 * 의도: serviceData.ts 가 곧 삭제될 예정이므로 type 의존을 별도 파일에 모아둔다.
 */

export interface TableBlock {
  title?: string;
  headers: string[];
  rows: string[][];
  footnote?: string;
}

export interface ImageBlock {
  src: string;
  alt: string;
  caption?: string;
}

export interface AlertBlock {
  type: "warning" | "info" | "tip";
  title: string;
  content: string;
}

export interface ChecklistBlock {
  title: string;
  items: string[];
}

export interface ServiceSection {
  id: string;
  title: string;
  type:
    | "text"
    | "table"
    | "image"
    | "alert"
    | "checklist"
    | "procedure-image"
    | "comparison-table"
    | "raw-svg";
  content?: string;
  table?: TableBlock;
  image?: ImageBlock;
  alert?: AlertBlock;
  checklist?: ChecklistBlock;
  comparisonTable?: {
    title: string;
    headers: string[];
    rows: { label: string; values: string[] }[];
    footnote?: string;
  };
  rawSvg?: {
    svg: string;
    caption?: string;
  };
}

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  law: string;
  lawArticle: string;
  description: string;
  overview: string;
  penalty: string;
  tasks: string[];
  targets: string[];
  procedure: { step: string; detail: string }[];
  documents: string[];
  additionalInfo?: string[];
  tableData?: TableBlock;
  sections: ServiceSection[];
}
