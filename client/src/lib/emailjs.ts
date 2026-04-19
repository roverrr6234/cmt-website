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

export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'ckt9054@naver.com',
        from_name: data.from_name,
        from_company: data.from_company || '미입력',
        from_phone: data.from_phone,
        from_email: data.from_email || '미입력',
        service: data.service || '일반문의',
        subject: data.subject,
        message: data.message,
      },
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', result.status);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
