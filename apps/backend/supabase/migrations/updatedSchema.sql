
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
  CONSTRAINT follow_up_questions_main_question_id_fkey FOREIGN KEY (main_question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.interview_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL,
  question_id uuid,
  tutor_feedback text,
  student_response text,
  score integer CHECK (score >= 0 AND score <= 10),
  created_at timestamp with time zone DEFAULT now(),
  notes text,
  CONSTRAINT interview_questions_pkey PRIMARY KEY (id),
  CONSTRAINT interview_questions_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id),
  CONSTRAINT interview_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
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
  CONSTRAINT interviews_pkey PRIMARY KEY (id),
  CONSTRAINT interviews_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT interviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT interviews_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.tutors(id)
);
CREATE TABLE public.mark_schemes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  main_question_id uuid NOT NULL,
  mark_scheme_text text NOT NULL,
  CONSTRAINT mark_schemes_pkey PRIMARY KEY (id),
  CONSTRAINT mark_schemes_main_question_id_fkey FOREIGN KEY (main_question_id) REFERENCES public.questions(id)
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
CREATE TABLE public.question_tags (
  question_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT question_tags_pkey PRIMARY KEY (question_id, tag_id),
  CONSTRAINT question_tags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT question_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  interview_type text,
  CONSTRAINT questions_pkey PRIMARY KEY (id)
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
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tag_name text NOT NULL UNIQUE,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
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
CREATE TABLE public.university_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  total_questions integer NOT NULL DEFAULT 0,
  custom_configs text,
  university USER-DEFINED,
  CONSTRAINT university_configurations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.university_tag_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  university_config_id uuid NOT NULL,
  tag_id uuid,
  num_questions integer NOT NULL DEFAULT 0,
  CONSTRAINT university_tag_configs_pkey PRIMARY KEY (id),
  CONSTRAINT university_tag_configs_university_config_id_fkey FOREIGN KEY (university_config_id) REFERENCES public.university_configurations(id),
  CONSTRAINT university_tag_configs_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
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