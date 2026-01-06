CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  tutor_id uuid,
  status text NOT NULL DEFAULT 'confirmed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  package text,
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text])),
  amount numeric,
  complete boolean DEFAULT false,
  preferred_time timestamp with time zone,
  reschedule_requested boolean DEFAULT false,
  rescheduled_time timestamp with time zone,
  feedback text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  email text,
  file_path text,
  notes text,
  universities text,
  field USER-DEFINED,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.users(id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  recipient_domain text,
  subject text NOT NULL,
  email_type text NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['sent'::text, 'failed'::text, 'pending'::text, 'bounced'::text])),
  message_id text,
  response text,
  error_message text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.follow_up_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  main_question_id uuid NOT NULL,
  follow_up_text text NOT NULL,
  CONSTRAINT follow_up_questions_pkey PRIMARY KEY (id),
  CONSTRAINT follow_up_questions_main_question_id_fkey FOREIGN KEY (main_question_id) REFERENCES prometheus.questions(id)
);
CREATE TABLE public.interviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid,
  tutor_id uuid,
  booking_id uuid,
  scheduled_at timestamp with time zone,
  completed boolean NOT NULL DEFAULT false,
  student_feedback text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  notes text,
  university USER-DEFINED,
  zoom_join_url text,
  zoom_host_email text,
  zoom_meeting_id text,
  Type text,
  CONSTRAINT interviews_pkey PRIMARY KEY (id),
  CONSTRAINT interviews_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT interviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT interviews_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.tutors(id)
);
CREATE TABLE public.new_joiners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number text,
  alevel_subjects_grades text NOT NULL,
  university_year text NOT NULL,
  med_dent_grades jsonb NOT NULL,
  ucat jsonb NOT NULL,
  bmat jsonb,
  med_school_offers text NOT NULL,
  subjects_can_tutor ARRAY NOT NULL,
  exam_boards text,
  tutoring_experience text NOT NULL,
  why_tutor text NOT NULL,
  availability ARRAY NOT NULL,
  cv_url text,
  CONSTRAINT new_joiners_pkey PRIMARY KEY (id)
);
CREATE TABLE public.personal_statements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  personal_statement_file_path text NOT NULL,
  notes text,
  reviewed boolean DEFAULT false,
  reviewed_at timestamp with time zone,
  reviewer_email text,
  version integer DEFAULT 1,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'in_review'::text, 'complete'::text])),
  feedback_url text,
  feedback_file_path text,
  CONSTRAINT personal_statements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.resources (
  id text NOT NULL,
  name text NOT NULL,
  description text,
  file_path text NOT NULL,
  allowed_tiers ARRAY NOT NULL DEFAULT ARRAY['free'::text],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT resources_pkey PRIMARY KEY (id)
);
CREATE TABLE public.student_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid,
  date date NOT NULL,
  day_of_week integer DEFAULT EXTRACT(dow FROM date),
  hour_start integer CHECK (hour_start >= 0 AND hour_start <= 23),
  hour_end integer,
  created_at timestamp with time zone DEFAULT now(),
  type USER-DEFINED,
  CONSTRAINT student_availability_pkey PRIMARY KEY (id),
  CONSTRAINT student_availability_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);
CREATE TABLE public.subscriptions (
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
  user_id uuid,
  subscription_tier text NOT NULL DEFAULT 'free'::text,
  opt_in_newsletter boolean NOT NULL DEFAULT true,
  stripe_subscription_id text UNIQUE,
  stripe_subscription_status text,
  current_period_starts_at timestamp with time zone,
  current_period_ends_at timestamp with time zone,
  canceled_at timestamp with time zone,
  subscribed_at timestamp with time zone NOT NULL DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (email),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.tutor_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tutor_id uuid,
  date date NOT NULL,
  day_of_week integer DEFAULT EXTRACT(dow FROM date),
  hour_start integer CHECK (hour_start >= 0 AND hour_start <= 23),
  hour_end integer,
  created_at timestamp with time zone DEFAULT now(),
  type USER-DEFINED,
  interview_id uuid,
  CONSTRAINT tutor_availability_pkey PRIMARY KEY (id),
  CONSTRAINT tutor_availability_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.tutors(id),
  CONSTRAINT tutor_availability_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id)
);
CREATE TABLE public.tutors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  subjects ARRAY NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  role text,
  CONSTRAINT tutors_pkey PRIMARY KEY (id)
);
CREATE TABLE public.universities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  CONSTRAINT universities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
  full_name text,
  role text NOT NULL DEFAULT 'student'::text,
  email_verified_at timestamp with time zone,
  stripe_customer_id text UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  phone_number text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE prometheus.interview_question_skill_marks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  interview_question_id uuid NOT NULL,
  criterion_id uuid NOT NULL,
  marks_awarded integer NOT NULL CHECK (marks_awarded >= 0),
  examiner_comment text,
  CONSTRAINT interview_question_skill_marks_pkey PRIMARY KEY (id),
  CONSTRAINT interview_question_skill_marks_interview_question_id_fkey FOREIGN KEY (interview_question_id) REFERENCES prometheus.interview_questions(id),
  CONSTRAINT interview_question_skill_marks_criterion_id_fkey FOREIGN KEY (criterion_id) REFERENCES prometheus.question_skill_criteria(id)
);
CREATE TABLE prometheus.interview_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL,
  question_id uuid,
  general_feedback text,
  student_response text,
  score integer CHECK (score >= 0 AND score <= 10),
  created_at timestamp with time zone DEFAULT now(),
  notes text,
  CONSTRAINT interview_questions_pkey PRIMARY KEY (id),
  CONSTRAINT interview_questions_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id),
  CONSTRAINT interview_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES prometheus.questions(id)
);
CREATE TABLE prometheus.question_skill_criteria (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL,
  skill_group text NOT NULL CHECK (skill_group = ANY (ARRAY['core'::text, 'extra'::text])),
  max_marks integer NOT NULL DEFAULT 2 CHECK (max_marks >= 0 AND max_marks <= 10),
  guidance text,
  display_order integer NOT NULL DEFAULT 0,
  skill_code text NOT NULL,
  CONSTRAINT question_skill_criteria_pkey PRIMARY KEY (id),
  CONSTRAINT question_skill_criteria_question_id_fkey FOREIGN KEY (question_id) REFERENCES prometheus.questions(id),
  CONSTRAINT question_skill_criteria_skill_code_fkey FOREIGN KEY (skill_code) REFERENCES prometheus.skill_definitions(skill_code)
);
CREATE TABLE prometheus.question_tags (
  question_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT question_tags_pkey PRIMARY KEY (question_id, tag_id),
  CONSTRAINT question_tags_question_id_fkey FOREIGN KEY (question_id) REFERENCES prometheus.questions(id),
  CONSTRAINT question_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES prometheus.tags(id)
);
CREATE TABLE prometheus.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  interview_type text,
  title text,
  category text,
  difficulty text,
  is_active boolean NOT NULL DEFAULT true,
  follow_up_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  oxbridge boolean,
  resources jsonb,
  CONSTRAINT questions_pkey PRIMARY KEY (id)
);
CREATE TABLE prometheus.skill_definitions (
  skill_code text NOT NULL,
  display_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT skill_definitions_pkey PRIMARY KEY (skill_code)
);
CREATE TABLE prometheus.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tag_name text NOT NULL UNIQUE,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);
CREATE TABLE prometheus.university_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  total_questions integer NOT NULL DEFAULT 0,
  custom_configs text,
  university USER-DEFINED,
  CONSTRAINT university_configurations_pkey PRIMARY KEY (id)
);
CREATE TABLE prometheus.university_tag_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  university_config_id uuid NOT NULL,
  tag_id uuid,
  num_questions integer NOT NULL DEFAULT 0,
  CONSTRAINT university_tag_configs_pkey PRIMARY KEY (id),
  CONSTRAINT university_tag_configs_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES prometheus.tags(id),
  CONSTRAINT university_tag_configs_university_config_id_fkey FOREIGN KEY (university_config_id) REFERENCES prometheus.university_configurations(id)
);