import emailjs from '@emailjs/browser';

// EmailJS 초기화
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ox8tYFKMvwjCP8PSo';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ckt_contact';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ckt_contact';

emailjs.init(EMAILJS_PUBLIC_KEY);

export interface ContactFormData {
  from_name: string;
  from_company: string;
  from_phone: string;
  from_email: string;
  service: string;
  subject: string;
  message: string;
}

export interface SendResult {
  success: boolean;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<SendResult> {
  try {
    const templateParams = {
      to_email: 'ckt9054@naver.com',
      from_name: data.from_name,
      from_company: data.from_company || '미입력',
      from_phone: data.from_phone,
      from_email: data.from_email || '미입력',
      service: data.service || '일반문의',
      subject: data.subject,
      message: data.message,
    };

    console.log('Sending email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    
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
    console.error('Failed to send email:', error);
    
    let errorMessage = '이메일 발송에 실패했습니다.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // EmailJS 특정 에러 처리
      if (error.message.includes('Invalid Service ID')) {
        errorMessage = '이메일 서비스 설정 오류입니다. 관리자에게 문의해 주세요.';
      } else if (error.message.includes('Invalid Template ID')) {
        errorMessage = '이메일 템플릿 설정 오류입니다. 관리자에게 문의해 주세요.';
      } else if (error.message.includes('Invalid Public Key')) {
        errorMessage = '이메일 인증 오류입니다. 관리자에게 문의해 주세요.';
      } else if (error.message.includes('Network')) {
        errorMessage = '네트워크 연결을 확인해 주세요.';
      }
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}
