export const legalDocsMigration = `
CREATE TABLE IF NOT EXISTS legal_docs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Insert default privacy policy
INSERT OR IGNORE INTO legal_docs (id, type, content)
VALUES (
  'privacy_policy',
  'privacy_policy',
  'Your default privacy policy content goes here.'
);

-- Insert default terms of service
INSERT OR IGNORE INTO legal_docs (id, type, content)
VALUES (
  'terms_of_service',
  'terms_of_service',
  'Your default terms of service content goes here.'
);
`;