/*
 * 11 Diagram Components replacing [변경1]~[변경11] images
 * Design: Deep Navy & White theme, CSS-based flowcharts and tables
 */
import { CheckCircle2, XCircle, ArrowDown, ArrowRight, Factory, Truck, Package, Warehouse, Recycle, FlaskConical } from "lucide-react";

/* ── Shared styles ── */
const navyBox = "bg-navy text-white rounded-sm px-4 py-3 text-center text-sm font-semibold";
const lightBox = "bg-white border-2 border-navy/20 rounded-sm px-4 py-3 text-center text-sm text-navy";
const goldBox = "bg-gold/10 border-2 border-gold/40 rounded-sm px-4 py-3 text-center text-sm text-navy font-semibold";
const arrowDown = "flex justify-center my-2";
const arrowRight = "flex items-center justify-center px-1";
const sectionTitle = "text-lg lg:text-xl font-bold text-navy font-serif mb-6 text-center";
const tableHeader = "bg-navy text-white text-sm font-semibold px-4 py-3 text-left";
const tableCell = "px-4 py-3 text-sm text-foreground/80 align-top border-t border-border";
const tableCellBold = "px-4 py-3 text-sm text-navy font-bold align-top border-t border-border";

/* ══════════════════════════════════════════════
 * [변경1] 제출수준 판정 절차 (3열 플로우차트)
 * ══════════════════════════════════════════════ */
export function Diagram1_JudgeFlow() {
  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>화학사고예방관리계획서 실무 제출수준 판정 절차</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: 1군 */}
        <div className="space-y-3">
          <div className="bg-navy/10 border border-navy/20 rounded-sm p-3 text-center">
            <p className="text-xs text-navy/60 font-semibold mb-1">Cond 1</p>
            <p className="text-sm text-navy font-medium">유해화학물질 1종 이상<br/>최대보유량 ≥ 상위규정수량</p>
          </div>
          <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>
          <div className={navyBox}>
            <p className="text-gold text-xs mb-1">Group 1</p>
            <p className="text-base font-bold">1군 사업장</p>
            <p className="text-white/60 text-xs mt-1">(집중 관리 대상)</p>
          </div>
          <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>
          <div className="bg-white border border-border rounded-sm p-4">
            <p className="text-navy font-bold text-sm mb-3">제출 서류 (Docs 1)</p>
            <ol className="space-y-1.5 text-xs text-foreground/70">
              <li className="flex items-start gap-2"><span className="text-gold font-bold">1.</span> 기본정보</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">2.</span> 시설정보</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">3.</span> 장외평가정보</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">4.</span> 사전관리방침</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">5.</span> 내부 비상대응계획</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">6.</span> 외부 비상대응계획</li>
            </ol>
          </div>
        </div>

        {/* Column 2: 2군 */}
        <div className="space-y-3">
          <div className="bg-navy/10 border border-navy/20 rounded-sm p-3 text-center">
            <p className="text-xs text-navy/60 font-semibold mb-1">Cond 2</p>
            <p className="text-sm text-navy font-medium">하위규정수량 ≤<br/>최대보유량 &lt; 상위규정수량</p>
          </div>
          <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>
          <div className={navyBox}>
            <p className="text-gold text-xs mb-1">Group 2</p>
            <p className="text-base font-bold">2군 사업장</p>
            <p className="text-white/60 text-xs mt-1">(일반 관리 대상)</p>
          </div>
          <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>
          <div className="bg-white border border-border rounded-sm p-4">
            <p className="text-navy font-bold text-sm mb-3">제출 서류 (Docs 2)</p>
            <ol className="space-y-1.5 text-xs text-foreground/70">
              <li className="flex items-start gap-2"><span className="text-gold font-bold">1.</span> 기본정보</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">2.</span> 시설정보</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">3.</span> 장외평가정보</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">4.</span> 사전관리방침</li>
              <li className="flex items-start gap-2"><span className="text-gold font-bold">5.</span> 내부 비상대응계획</li>
              <li className="flex items-start gap-2 text-foreground/40 line-through"><span className="text-foreground/30 font-bold">6.</span> 외부 대응계획 면제</li>
            </ol>
          </div>
        </div>

        {/* Column 3: 면제 */}
        <div className="space-y-3">
          <div className="bg-navy/10 border border-navy/20 rounded-sm p-3 text-center">
            <p className="text-xs text-navy/60 font-semibold mb-1">Cond 3</p>
            <p className="text-sm text-navy font-medium">모든 유해화학물질의<br/>최대보유량 &lt; 하위규정수량</p>
          </div>
          <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>
          <div className="bg-emerald-700 text-white rounded-sm px-4 py-3 text-center text-sm font-semibold">
            <p className="text-emerald-200 text-xs mb-1">Exempt</p>
            <p className="text-base font-bold">제출 면제</p>
            <p className="text-white/60 text-xs mt-1">(사내 근거 비치)</p>
          </div>
          <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>
          <div className="bg-white border border-border rounded-sm p-4">
            <p className="text-navy font-bold text-sm mb-3">제출 서류 (Docs 3)</p>
            <p className="text-xs text-foreground/60 leading-relaxed">
              제출 서류 없음<br/>
              <span className="text-amber-600 font-medium">단, 물질별 최대보유량 산정 내역 자체 보관 필수</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경2] 최대보유량 산정 프로세스 (테이블)
 * ══════════════════════════════════════════════ */
export function Diagram2_MaxCalc() {
  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>최대보유량 산정 및 이행 프로세스: 데이터 산정 단계</h4>
      {/* Flow icons */}
      <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
        <div className={navyBox + " min-w-[140px]"}>제조·사용시설<br/><span className="text-white/50 text-xs">(M&U Facilities)</span></div>
        <span className="text-navy text-xl">⇄</span>
        <div className={navyBox + " min-w-[140px]"}>저장·보관시설<br/><span className="text-white/50 text-xs">(S&K Facilities)</span></div>
      </div>
      <div className="flex justify-center mb-4">
        <div className={goldBox}>산정 공식 적용 (Formula Application)</div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={tableHeader} style={{width:"20%"}}>구분</th>
              <th className={tableHeader} style={{width:"45%"}}>주요사항</th>
              <th className={tableHeader} style={{width:"35%"}}>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className={tableCellBold}>
                공통<br/><span className="text-xs text-foreground/50 font-normal">(Common)</span>
              </td>
              <td className={tableCell}>
                <p className="mb-1"><strong>정의:</strong> 각 물질별 취급시설에서 최대 체류할 수 있는 양의 합</p>
                <p className="mb-1"><strong>방법:</strong> '설계용량', '비중' 고려</p>
                <p className="bg-navy/5 px-2 py-1 rounded text-xs font-mono">공식: 물질별 최대보유량(톤) = Σ(설계용량×비중)</p>
              </td>
              <td className={tableCell}>혼합형태 존재 시 혼합물 비중 고려가능<br/>(증빙 가능한 경우에 한함)</td>
            </tr>
            <tr className="bg-warm-gray">
              <td className={tableCellBold}>
                제조·사용시설<br/><span className="text-xs text-foreground/50 font-normal">(Manufacturing & Use)</span>
              </td>
              <td className={tableCell}>
                <ul className="space-y-1 list-disc list-inside">
                  <li>'설계용량', '비중' 고려</li>
                  <li>각각의 성상이 차지하는 '부피'로 산정 가능</li>
                  <li>운전조건(온도, 압력)을 고려 산정 가능</li>
                  <li>저장방식(압축 등) 및 성상 고려 산정 가능</li>
                </ul>
              </td>
              <td className={tableCell}>
                <ul className="space-y-1 list-disc list-inside">
                  <li>함량기준 이상 존재시</li>
                  <li>성상이 다를 시(증빙 가능한 경우에 한함)</li>
                  <li>가체물질의 경우</li>
                  <li>액화가스, 압축가스의 경우</li>
                </ul>
              </td>
            </tr>
            <tr className="bg-white">
              <td className={tableCellBold}>
                저장·보관시설<br/><span className="text-xs text-foreground/50 font-normal">(Storage & Keep)</span>
              </td>
              <td className={tableCell}>
                <ul className="space-y-1 list-disc list-inside">
                  <li>'설계용량', '비중' 고려</li>
                  <li>제출한 '보관 구획도' 기준으로 산정</li>
                </ul>
              </td>
              <td className={tableCell}>
                <ul className="space-y-1 list-disc list-inside">
                  <li>저장시설</li>
                  <li>보관시설</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경3] 구성요소 1군 vs 2군 비교 (체크 테이블)
 * ══════════════════════════════════════════════ */
export function Diagram3_Compare() {
  const data = [
    { category: "1. 기본정보", items: [
      { label: "가. 사업장 일반정보 및 취급시설 개요", c2: true, c1: true },
      { label: "나. 유해화학물질 목록 및 유해성 정보", c2: true, c1: true },
      { label: "다. 취급시설 입지정보", c2: true, c1: true },
    ]},
    { category: "2. 시설정보", items: [
      { label: "가. 공정정보", c2: true, c1: true },
      { label: "나. 안전장치 현황", c2: true, c1: true },
    ]},
    { category: "3. 장외평가정보", items: [
      { label: "가. 사고시나리오 선정", c2: true, c1: true },
      { label: "나. 사업장 주변지역 영향범위 평가", c2: true, c1: true },
      { label: "다. 위험도 분석", c2: true, c1: true },
    ]},
    { category: "4. 사전관리방침", items: [
      { label: "가. 안전관리계획", c2: true, c1: true },
      { label: "나. 비상대응체계", c2: true, c1: true },
    ]},
    { category: "5. 내부 비상대응계획", items: [
      { label: "가. 사고대응 및 응급조치계획", c2: true, c1: true },
      { label: "나. 화학사고 사후조치", c2: true, c1: true },
    ]},
    { category: "6. 외부 비상대응계획", items: [
      { label: "가. 지역사회와의 공조계획", c2: false, c1: true },
      { label: "나. 주민보호 및 대피계획", c2: false, c1: true },
      { label: "다. 지역사회 고지계획", c2: false, c1: true },
    ]},
  ];

  return (
    <div className="space-y-4">
      <h4 className={sectionTitle}>화학사고예방관리계획서 구성요소 (1군 vs 2군 비교)</h4>
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={tableHeader} style={{width:"60%"}}>화학사고예방관리계획서 구성요소</th>
              <th className={tableHeader + " text-center"} style={{width:"20%"}}>2군 (Class 2)</th>
              <th className={tableHeader + " text-center"} style={{width:"20%"}}>1군 (Class 1)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cat) => (
              <>
                <tr key={cat.category} className="bg-navy/5">
                  <td colSpan={3} className="px-4 py-3 text-navy font-bold text-sm border-t border-border">
                    {cat.category}
                  </td>
                </tr>
                {cat.items.map((item, j) => (
                  <tr key={`${cat.category}-${j}`} className={j % 2 === 0 ? "bg-white" : "bg-warm-gray"}>
                    <td className="px-4 py-2.5 pl-8 text-sm text-foreground/80 border-t border-border">{item.label}</td>
                    <td className="px-4 py-2.5 text-center border-t border-border">
                      {item.c2 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center border-t border-border">
                      {item.c1 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경4] 업무 처리절차 (복잡 플로우차트)
 * ══════════════════════════════════════════════ */
export function Diagram4_ProcessFlow() {
  const mainSteps = [
    { label: "유해화학물질 취급시설\n설치·운영하는 자", sub: "화학사고예방관리계획서 작성" },
    { label: "운영자 → 화학물질안전원", sub: "\"화학사고예방관리계획서 제출\"" },
    { label: "화학물질안전원", sub: "\"화학사고예방관리계획서 검토\"" },
  ];
  const reviewBranch = [
    "운영자 \"수정·보완\"",
    "화학물질안전원 → 운영자 \"수정·보완 요청(필요시)\"",
    "화학물질안전원 \"현장조사(필요시)\"",
    "화학물질안전원 → 기초 지자체 \"비상대응분야 정보 검토 요청\"",
  ];
  const afterReview = [
    { label: "화학물질안전원 → 운영자", sub: "\"검토결과 통보\"" },
    { label: "운영자 → 지역사회", sub: "\"화학사고예방관리계획서 지역사회 고지(연1회)\"" },
    { label: "운영자", sub: "\"자체 이행여부 점검(연1회)\"" },
    { label: "화학물질안전원 → 운영자", sub: "\"화학사고예방관리계획서 이행점검\"" },
  ];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>화학사고예방관리계획서 업무 처리절차</h4>
      
      {/* Main flow */}
      <div className="space-y-2">
        {mainSteps.map((step, i) => (
          <div key={i}>
            <div className={navyBox + " max-w-md mx-auto"}>
              <p className="whitespace-pre-line">{step.label}</p>
              <p className="text-white/60 text-xs mt-1">{step.sub}</p>
            </div>
            {i < mainSteps.length - 1 && <div className={arrowDown}><ArrowDown className="w-5 h-5 text-navy/40" /></div>}
          </div>
        ))}
      </div>

      {/* Review branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border-2 border-dashed border-amber-300 rounded-sm p-4 bg-amber-50/50">
          <p className="text-amber-700 font-bold text-xs mb-3 text-center">↻ 수정·보완 요청 (필요시)</p>
          <div className="space-y-2">
            {reviewBranch.map((item, i) => (
              <div key={i} className="bg-white border border-amber-200 rounded-sm px-3 py-2 text-xs text-foreground/70">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-navy font-bold text-xs mb-2 text-center">✓ 적합 판정 후</p>
          {afterReview.map((step, i) => (
            <div key={i}>
              <div className={lightBox + " text-xs"}>
                <p className="font-semibold text-navy">{step.label}</p>
                <p className="text-foreground/50 mt-0.5">{step.sub}</p>
              </div>
              {i < afterReview.length - 1 && <div className={arrowDown}><ArrowDown className="w-4 h-4 text-navy/30" /></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경5] 유해화학물질 취급시설의 종류 (카드 레이아웃)
 * ══════════════════════════════════════════════ */
export function Diagram5_FacilityTypes() {
  const facilities = [
    { name: "제조·사용·저장시설", icon: Factory, desc: "화학물질 제조, 사용, 저장" },
    { name: "보관시설", icon: Warehouse, desc: "화학물질 보관 관리" },
    { name: "사회배관시설", icon: Recycle, desc: "사업장 간 배관 연결" },
    { name: "운반시설", icon: Package, desc: "지게차 등의 도움" },
    { name: "운송시설", icon: Truck, desc: "화학물질 운송" },
  ];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>유해화학물질 취급시설의 종류</h4>
      <div className="flex flex-col items-center">
        {/* Center hub */}
        <div className="w-24 h-24 bg-white border-2 border-navy/20 rounded-lg flex items-center justify-center mb-6 shadow-sm">
          <Factory className="w-12 h-12 text-navy/60" />
        </div>
        {/* Satellite cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {facilities.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={navyBox + " flex flex-col items-center gap-2 py-5"}>
                <Icon className="w-7 h-7 text-gold" />
                <p className="font-bold text-sm">{f.name}</p>
                <p className="text-white/50 text-xs">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경6] 검사 및 안전진단 시기/주기 (테이블)
 * ══════════════════════════════════════════════ */
export function Diagram6_InspectionSchedule() {
  return (
    <div className="space-y-4">
      <h4 className={sectionTitle}>검사 및 안전진단 시기/주기</h4>
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={tableHeader} style={{width:"15%"}}></th>
              <th className={tableHeader} style={{width:"45%"}}>구분</th>
              <th className={tableHeader} style={{width:"40%"}}>시기 / 주기</th>
            </tr>
          </thead>
          <tbody>
            {/* 설치검사 */}
            <tr className="bg-white">
              <td className={tableCellBold} rowSpan={1}>설치검사</td>
              <td className={tableCell}>유해화학물질 취급시설</td>
              <td className={tableCell}>
                <ul className="list-disc list-inside space-y-1">
                  <li>유해화학물질 취급시설 설치 완료 후</li>
                  <li>해당시설 가동 전</li>
                </ul>
              </td>
            </tr>
            {/* 정기검사 */}
            <tr className="bg-navy/5">
              <td className={tableCellBold} rowSpan={5}>정기검사</td>
              <td className={tableCell}>1군 "가" 위험도 사업장</td>
              <td className={tableCell}>1년 마다 (최초 정기검사실 전후 30일 이내)</td>
            </tr>
            <tr className="bg-white">
              <td className={tableCell}>1군 "나", "다" 위험도 사업장</td>
              <td className={tableCell}>2년 마다 (최초 정기검사실 전후 30일 이내)</td>
            </tr>
            <tr className="bg-navy/5">
              <td className={tableCell}>2군 사업장</td>
              <td className={tableCell}>3년 마다 (최초 정기검사실 전후 30일 이내)</td>
            </tr>
            <tr className="bg-white">
              <td className={tableCell}>최하위 규정수량 이상 하위규정수량 미만의 사업장</td>
              <td className={tableCell}>4년 마다 (최초 정기검사실 전후 30일 이내)</td>
            </tr>
            <tr className="bg-navy/5">
              <td className={tableCell}>유해화학물질을 운반하는 사업장</td>
              <td className={tableCell}>3년 이내의 기간 (운반하는 유해화학물질 및 차량의 종류 등에 따라 차등 적용)</td>
            </tr>
            {/* 수시검사 */}
            <tr className="bg-white">
              <td className={tableCellBold} rowSpan={2}>수시검사</td>
              <td className={tableCell}>화학사고 발생</td>
              <td className={tableCell}>화학사고 발생 후 7일 이내</td>
            </tr>
            <tr className="bg-navy/5">
              <td className={tableCell}>화학사고 발생 우려</td>
              <td className={tableCell}>지방환경관서의 장이 통지 시</td>
            </tr>
            {/* 안전진단 */}
            <tr className="bg-white">
              <td className={tableCellBold} rowSpan={2}>안전진단</td>
              <td className={tableCell}>유해화학물질 취급시설의 설치를 마친 자,<br/>유해화학물질 취급시설을 설치·운영하는 자</td>
              <td className={tableCell}>설치, 정기, 수시검사 결과 유해화학물질 취급시설의 안전상 위해가 우려된다고 인정되는 경우 (20일 이내)</td>
            </tr>
            <tr className="bg-navy/5">
              <td className={tableCell}></td>
              <td className={tableCell}>네 번째 정기검사 기한이 도래하는 경우</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경7] 컨설팅 절차 (5단계 프로세스 바) - 설치검사/영업허가
 * ══════════════════════════════════════════════ */
export function Diagram7_ConsultingFlow() {
  const steps = [
    { step: "1", title: "계약완료", sub: "EHS 데이터 모집" },
    { step: "2", title: "현장진단 및\n진단보고서 제출", sub: "사이트 등록 / 산세 체크", branch: "현장 개선방안 제시" },
    { step: "3", title: "현장개선 및\n서면자료 작성", sub: "최종 수량 계산 목서" },
    { step: "4", title: "검사 수검", sub: "(검사 기관)" },
    { step: "5", title: "검사완료", sub: "(영업허가 진행)" },
  ];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>화학물질 시설 통합 관리 및 최대보유량 산정 컨설팅 절차</h4>
      <ProcessBar steps={steps} />
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경8] PSM 주요 구성 요소 (4 챕터)
 * ══════════════════════════════════════════════ */
export function Diagram8_PSMComponents() {
  const chapters = [
    { ch: "CHAPTER 1", title: "공정안전자료", sub: "공정 기술/설비 자료" },
    { ch: "CHAPTER 2", title: "공정위험성평가", sub: "위험성 평가 결과서" },
    { ch: "CHAPTER 3", title: "안전운전계획", sub: "안전 운전 절차서" },
    { ch: "CHAPTER 4", title: "비상조치계획", sub: "비상 대응 매뉴얼" },
  ];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>공정안전보고서(PSM) 주요 구성 요소 및 플로우</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {chapters.map((ch, i) => (
          <div key={i} className="relative">
            <div className="bg-white border-2 border-navy/20 rounded-sm p-4 text-center hover:border-gold/40 transition-colors h-full">
              <p className="text-[10px] text-navy/40 font-semibold mb-1">{ch.ch}</p>
              <p className="text-navy font-bold text-base mb-2">{ch.title}</p>
              <div className="border-t border-dashed border-navy/10 pt-2 mt-2">
                <p className="text-xs text-foreground/50">{ch.sub}</p>
              </div>
            </div>
            {i < chapters.length - 1 && (
              <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-5 h-5 text-navy/30" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className={goldBox + " min-w-[200px]"}>PSM 보고서 최종 완성</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경9] PSM 컨설팅 절차 (5단계)
 * ══════════════════════════════════════════════ */
export function Diagram9_PSMConsulting() {
  const steps = [
    { step: "1", title: "계약 완료", sub: "" },
    { step: "2", title: "현장 진단 및\n진단 보고서 제출", sub: "", branch: "현장 개선방안 제시" },
    { step: "3", title: "현장 개선 및\n서면자료 작성", sub: "" },
    { step: "4", title: "서류 제출 및\n심사 수검", sub: "(안전보건공단 KOSHA)" },
    { step: "5", title: "심사 결과 보고", sub: "(고용노동부 MOEL)" },
  ];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>공정안전보고서(PSM) 컨설팅 절차</h4>
      <ProcessBar steps={steps} />
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경10] 유해위험방지계획서 심사 및 확인절차
 * ══════════════════════════════════════════════ */
export function Diagram10_HazardReview() {
  const flowSteps = [
    { title: "사업주\n(제출)", sub: "" },
    { title: "안전보건공단", sub: "KOSHA" },
    { title: "안전보건공단\n심사", sub: "KOSHA" },
    { title: "지방노동관서\n(통보)", sub: "" },
    { title: "해당지자체\n(통보)", sub: "" },
  ];
  const arrows = ["계획서 제출 서류", "계획서 제출서류", "", "심사 결과서"];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>유해위험방지계획서 심사 및 확인절차</h4>
      {/* Info boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-navy/5 border border-navy/10 rounded-sm p-4">
          <p className="text-navy font-bold text-sm mb-1">■ 심사절차</p>
          <p className="text-sm text-foreground/70">접수일로부터 <strong className="text-navy">15일 이내</strong> 심사결과 교부</p>
        </div>
        <div className="bg-navy/5 border border-navy/10 rounded-sm p-4">
          <p className="text-navy font-bold text-sm mb-1">■ 확인일</p>
          <p className="text-sm text-foreground/70">시운전 기간 중 <strong className="text-navy">현장방문</strong> 후 결과 교부</p>
        </div>
      </div>
      {/* Flow */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {flowSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={navyBox + " min-w-[100px] sm:min-w-[120px]"}>
              <p className="whitespace-pre-line text-xs sm:text-sm">{step.title}</p>
              {step.sub && <p className="text-gold text-[10px] mt-1">{step.sub}</p>}
            </div>
            {i < flowSteps.length - 1 && (
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-navy/30" />
                {arrows[i] && <p className="text-[9px] text-foreground/40 max-w-[60px] text-center leading-tight">{arrows[i]}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * [변경11] 유해위험방지계획서 컨설팅 절차 (5단계)
 * ══════════════════════════════════════════════ */
export function Diagram11_HazardConsulting() {
  const steps = [
    { step: "1", title: "계약 완료", sub: "" },
    { step: "2", title: "현장 방문 및\n필요자료 요청", sub: "", branch: "현장 개선방안 제시" },
    { step: "3", title: "현장 개선 및\n서면 자료 작성", sub: "" },
    { step: "4", title: "서류 제출 및\n심사 수검", sub: "(안전보건공단 KOSHA)" },
    { step: "5", title: "심사 결과 교부", sub: "", after: "사업장" },
  ];

  return (
    <div className="space-y-6">
      <h4 className={sectionTitle}>유해위험방지계획서 컨설팅 절차</h4>
      <ProcessBar steps={steps} />
    </div>
  );
}

/* ══════════════════════════════════════════════
 * Shared: Process Bar (5-step horizontal flow)
 * ══════════════════════════════════════════════ */
function ProcessBar({ steps }: { steps: { step: string; title: string; sub: string; branch?: string; after?: string }[] }) {
  return (
    <div className="space-y-4">
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start justify-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start">
            <div className="flex flex-col items-center" style={{ minWidth: "130px" }}>
              <div className={navyBox + " w-full min-h-[80px] flex flex-col items-center justify-center"}>
                <p className="text-gold text-[10px] mb-0.5">{s.step}단계</p>
                <p className="whitespace-pre-line text-xs leading-snug">{s.title}</p>
                {s.sub && <p className="text-white/50 text-[10px] mt-1">{s.sub}</p>}
              </div>
              {s.branch && (
                <div className="mt-2 flex flex-col items-center">
                  <ArrowDown className="w-4 h-4 text-red-400" />
                  <div className="bg-red-50 border border-red-200 rounded-sm px-3 py-2 text-xs text-red-700 font-medium text-center mt-1">
                    {s.branch}
                  </div>
                </div>
              )}
              {s.after && (
                <div className="mt-2 flex flex-col items-center">
                  <ArrowDown className="w-4 h-4 text-navy/30" />
                  <div className={navyBox + " text-xs mt-1 px-3 py-2"}>
                    {s.after}
                  </div>
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center h-[80px]">
                <ArrowRight className="w-5 h-5 text-navy/30 mx-0.5" />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Mobile: vertical */}
      <div className="md:hidden space-y-2">
        {steps.map((s, i) => (
          <div key={i}>
            <div className={navyBox}>
              <p className="text-gold text-[10px] mb-0.5">{s.step}단계</p>
              <p className="whitespace-pre-line text-sm">{s.title}</p>
              {s.sub && <p className="text-white/50 text-xs mt-1">{s.sub}</p>}
            </div>
            {s.branch && (
              <div className="ml-8 mt-1 mb-1">
                <div className="bg-red-50 border border-red-200 rounded-sm px-3 py-2 text-xs text-red-700 font-medium">
                  ↳ {s.branch}
                </div>
              </div>
            )}
            {s.after && (
              <div className="ml-8 mt-1 mb-1">
                <div className={navyBox + " text-xs"}>↳ {s.after}</div>
              </div>
            )}
            {i < steps.length - 1 && <div className={arrowDown}><ArrowDown className="w-4 h-4 text-navy/30" /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
 * Diagram ID → Component mapping
 * ══════════════════════════════════════════════ */
export const diagramComponents: Record<string, React.FC> = {
  "judge-flow": Diagram1_JudgeFlow,
  "max-calc": Diagram2_MaxCalc,
  "compare-1-2": Diagram3_Compare,
  "process-flow": Diagram4_ProcessFlow,
  "facility-types": Diagram5_FacilityTypes,
  "inspection-schedule-img": Diagram6_InspectionSchedule,
  "consulting-flow-inspection": Diagram7_ConsultingFlow,
  "psm-components": Diagram8_PSMComponents,
  "psm-consulting": Diagram9_PSMConsulting,
  "review-process": Diagram10_HazardReview,
  "consulting-flow-hazard": Diagram11_HazardConsulting,
};
