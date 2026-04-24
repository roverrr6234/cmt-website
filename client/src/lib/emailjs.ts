import emailjs from '@emailjs/browser';

// EmailJS 초기화 - 환경변수에서만 로드 (하드코딩 금지)
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface ContactFormData {
  name: string;
  from_company: string;
  from_phone: string;
  from_email?: string;
  service_type: string;
  message: string;
}

export interface SendResult {
  success: boolean;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<SendResult> {
  // 환경변수 검증
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn('EmailJS configuration incomplete');
    return {
      success: false,
      message: '이메일 서비스가 현재 이용 불가능합니다. 전화로 문의해 주세요.',
    };
  }

  try {
    const templateParams = {
      to_email: import.meta.env.VITE_EMAILJS_RECIPIENT_EMAIL || 'support@example.com',
      name: data.name,
      from_company: data.from_company || '미입력',
      from_phone: data.from_phone,
      from_email: data.from_email || '미입력',
      service_type: data.service_type || '일반문의',
      message: data.message,
    };

    // 프로덕션 환경에서는 로깅 미수행
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[DEV] Sending email...');
    }

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (result.status === 200) {
      return {
        success: true,
        message: '상담 신청이 완료되었습니다. 빠르게 연락드리겠습니다!',
      };
    } else {
      return {
        success: false,
        message: '이메일 발송 중 오류가 발생했습니다. 다시 시도해 주세요.',
      };
    }
  } catch (error) {
    // 프로덕션 환경에서는 상세 에러 로깅 금지
    if (process.env.NODE_ENV !== 'production') {
      console.error('[DEV] Email error:', error);
    }

    // 사용자에게는 범용 메시지만 반환
    return {
      success: false,
      message: '이메일 발송에 실패했습니다. 전화로 문의해 주세요.',
    };
  }
}
