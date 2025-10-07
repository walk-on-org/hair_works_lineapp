export interface ApplicantMessageResponse {
  status: number;
  data: {
    applicants: Applicant[];
    unread_count_total: number;
  };
}

export interface Applicant {
  id: number;
  corporation_id: number;
  corporation_name: string;
  office_id: number;
  office_name: string;
  job_id: number;
  job_name: string;
  job_category_name: string;
  position_name: string;
  position_sub_category_name: string;
  employment_name: string;
  image: {
    url: string;
  };
  created_at: Date;
  last_activity: Date;
  unread_count: number;
  messages: Message[];
}

export interface Message {
  id: number;
  applicant_id: number;
  sender_type: number;
  content_type: string;
  message: string;
  attachment: string;
  already_read: number;
  created_at: Date;
  deleted_at?: Date | null;
}
