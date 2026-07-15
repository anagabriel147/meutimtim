/*
# TimTim Schema Addendum — missing tables and profile columns

Adds:
- city, bio, subscription_plan, subscription_expires_at to profiles
- messages table (chat)
- referrals table (advisor affiliate tracking)
- advisor_client_events table (advisor managing client events)
*/

-- Extend profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='city') THEN
    ALTER TABLE profiles ADD COLUMN city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='bio') THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_plan') THEN
    ALTER TABLE profiles ADD COLUMN subscription_plan text NOT NULL DEFAULT 'free'
      CHECK (subscription_plan IN ('free','supplier_pro','advisor_pro'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_expires_at') THEN
    ALTER TABLE profiles ADD COLUMN subscription_expires_at timestamptz;
  END IF;
END;
$$;

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  content text NOT NULL,
  read_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_recipient_id_idx ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_parties" ON messages;
CREATE POLICY "messages_select_parties" ON messages FOR SELECT
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "messages_insert_sender" ON messages;
CREATE POLICY "messages_insert_sender" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "messages_update_parties" ON messages;
CREATE POLICY "messages_update_parties" ON messages FOR UPDATE
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "messages_delete_sender" ON messages;
CREATE POLICY "messages_delete_sender" ON messages FOR DELETE
  TO authenticated USING (auth.uid() = sender_id);

-- referrals
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code text NOT NULL UNIQUE,
  referred_email text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','registered','converted','paid')),
  commission_amount numeric(12,2) NOT NULL DEFAULT 0,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS referrals_advisor_id_idx ON referrals(advisor_id);
CREATE INDEX IF NOT EXISTS referrals_code_idx ON referrals(referral_code);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals_select_own" ON referrals;
CREATE POLICY "referrals_select_own" ON referrals FOR SELECT
  TO authenticated USING (auth.uid() = advisor_id);

DROP POLICY IF EXISTS "referrals_insert_own" ON referrals;
CREATE POLICY "referrals_insert_own" ON referrals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = advisor_id);

DROP POLICY IF EXISTS "referrals_update_own" ON referrals;
CREATE POLICY "referrals_update_own" ON referrals FOR UPDATE
  TO authenticated USING (auth.uid() = advisor_id);

DROP POLICY IF EXISTS "referrals_delete_own" ON referrals;
CREATE POLICY "referrals_delete_own" ON referrals FOR DELETE
  TO authenticated USING (auth.uid() = advisor_id);

-- advisor_client_events
CREATE TABLE IF NOT EXISTS advisor_client_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  commission_rate numeric(5,2) NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(advisor_id, event_id)
);

CREATE INDEX IF NOT EXISTS ace_advisor_id_idx ON advisor_client_events(advisor_id);
CREATE INDEX IF NOT EXISTS ace_event_id_idx ON advisor_client_events(event_id);

ALTER TABLE advisor_client_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ace_select_parties" ON advisor_client_events;
CREATE POLICY "ace_select_parties" ON advisor_client_events FOR SELECT
  TO authenticated USING (auth.uid() = advisor_id OR auth.uid() = client_id);

DROP POLICY IF EXISTS "ace_insert_advisor" ON advisor_client_events;
CREATE POLICY "ace_insert_advisor" ON advisor_client_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = advisor_id);

DROP POLICY IF EXISTS "ace_update_advisor" ON advisor_client_events;
CREATE POLICY "ace_update_advisor" ON advisor_client_events FOR UPDATE
  TO authenticated USING (auth.uid() = advisor_id);

DROP POLICY IF EXISTS "ace_delete_advisor" ON advisor_client_events;
CREATE POLICY "ace_delete_advisor" ON advisor_client_events FOR DELETE
  TO authenticated USING (auth.uid() = advisor_id);
