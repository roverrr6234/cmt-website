/**
 * Sanity service 도큐먼트 → ServiceData 변환 모듈.
 *
 * 디자인 불변 원칙: ServiceDetail.tsx 의 렌더 코드를 건드리지 않고,
 * Sanity 에서 받은 데이터를 ServiceData 인터페이스에 맞게 정확히 빚어준다.
 *
 * Sanity 가 빈 응답을 주면 호출 측에서 serviceData.ts fallback 으로 떨어진다.
 */
import {
  FileText,
  Search,
  Award,
  Shield,
  ClipboardCheck,
  Target,
  Users,
  Zap,
  MapPin,
} from "lucide-react";
import type { ServiceData, ServiceSection } from "./serviceData";
import { urlFor } from "./sanity";

/* ── 아이콘 이름 → Lucide 컴포넌트 ── */
const iconMap: Record<string, ServiceData["icon"]> = {
  FileText,
  Search,
  Award,
  Shield,
  ClipboardCheck,
  Target,
  Users,
  Zap,
  MapPin,
};

/* ── Portable Text → 평문 (formatting 일부 손실, 줄바꿈 보존) ── */
function flattenPortableText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return typeof blocks === "string" ? blocks : "";
  return blocks
    .filter((b: any) => b && b._type === "block")
    .map((b: any) => (b.children || []).map((c: any) => c?.text ?? "").join(""))
    .join("\n\n");
}

/* ── 한 섹션 블록 변환 ── */
function convertSection(block: any): ServiceSection | null {
  if (!block || !block._type) return null;
  const baseId = block._key || `section-${Math.random().toString(36).slice(2, 8)}`;

  switch (block._type) {
    case "sectionText":
      return {
        id: baseId,
        title: block.title || "",
        type: "text",
        content: flattenPortableText(block.content),
      };

    case "sectionAlert":
      return {
        id: baseId,
        title: block.title || block.alertTitle || "",
        type: "alert",
        alert: {
          type: (block.alertType as "warning" | "info" | "tip") || "info",
          title: block.alertTitle || "",
          content: block.alertContent || "",
        },
      };

    case "sectionTable":
      return {
        id: baseId,
        title: block.title || "",
        type: "table",
        table: {
          title: block.tableTitle || block.title || "",
          headers: Array.isArray(block.headers) ? block.headers : [],
          rows: Array.isArray(block.rows)
            ? block.rows.map((r: any) => (Array.isArray(r?.cells) ? r.cells : []))
            : [],
          footnote: block.footnote || undefined,
        },
      };

    case "sectionChecklist":
      return {
        id: baseId,
        title: block.title || "",
        type: "checklist",
        checklist: {
          title: block.listTitle || block.title || "",
          items: Array.isArray(block.items) ? block.items : [],
        },
      };

    case "sectionComparisonTable":
      return {
        id: baseId,
        title: block.title || "",
        type: "comparison-table",
        comparisonTable: {
          title: block.tableTitle || block.title || "",
          headers: Array.isArray(block.headers) ? block.headers : [],
          rows: Array.isArray(block.rows)
            ? block.rows.map((r: any) => ({
                label: r?.label || "",
                values: Array.isArray(r?.values) ? r.values : [],
              }))
            : [],
          footnote: block.footnote || undefined,
        },
      };

    case "sectionProcedureImage": {
      // 코드 다이어그램이 있는 경우 id 를 diagramId 로 맞춰서
      // ServiceDetail.tsx 의 diagramComponents[section.id] lookup 이 작동하도록.
      const id = block.diagramId || baseId;
      const imageRef = block.image?.asset?._ref || block.image?.asset?._id;
      const src = imageRef ? urlFor(block.image) : "";
      return {
        id,
        title: block.title || "",
        type: "procedure-image",
        image: src
          ? {
              src,
              alt: block.alt || block.title || "",
              caption: block.caption || "",
            }
          : undefined,
      };
    }

    default:
      return null;
  }
}

/* ── 메인 변환 ── */
export function convertSanityService(s: any): ServiceData | null {
  if (!s) return null;

  const slug =
    typeof s.slug === "string" ? s.slug : s.slug?.current || "";

  if (!slug || !s.title) return null;

  return {
    id: s._id || slug,
    slug,
    title: s.title,
    shortTitle: s.shortTitle || s.title,
    icon: iconMap[s.iconName as string] || FileText,
    law: s.law || "",
    lawArticle: s.lawArticle || "",
    description: s.description || "",
    overview: s.overview || "",
    penalty: s.penalty || "",
    tasks: Array.isArray(s.tasks) ? s.tasks : [],
    targets: Array.isArray(s.targets) ? s.targets : [],
    procedure: Array.isArray(s.procedure)
      ? s.procedure.map((p: any) => ({
          step: p?.step || "",
          detail: p?.detail || "",
        }))
      : [],
    documents: Array.isArray(s.documents) ? s.documents : [],
    additionalInfo: Array.isArray(s.additionalInfo) ? s.additionalInfo : undefined,
    sections: Array.isArray(s.sections)
      ? (s.sections.map(convertSection).filter(Boolean) as ServiceSection[])
      : [],
  };
}

/**
 * 모든 Sanity 서비스를 ServiceData[] 로 변환.
 */
export function convertSanityServiceList(items: any[] | null | undefined): ServiceData[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(convertSanityService)
    .filter((s): s is ServiceData => s !== null);
}
