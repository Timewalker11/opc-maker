import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

interface ProfileRow {
  company_name: string;
  business_type: string;
  referral_source: string;
  owner_name: string;
}

function toApiShape(row: ProfileRow) {
  return {
    companyName: row.company_name,
    businessType: row.business_type,
    referralSource: row.referral_source,
    ownerName: row.owner_name,
  };
}

router.get("/", (req, res) => {
  const row = db.prepare("SELECT * FROM business_profiles WHERE user_id = ?").get(req.userId!) as ProfileRow | undefined;
  res.json({ profile: row ? toApiShape(row) : null });
});

router.put("/", (req, res) => {
  const { companyName, businessType, referralSource, ownerName } = req.body ?? {};

  if (!companyName?.trim() || !businessType || !referralSource || !ownerName?.trim()) {
    return res.status(400).json({ error: "companyName, businessType, referralSource, and ownerName are all required." });
  }

  db.prepare(
    `INSERT INTO business_profiles (user_id, company_name, business_type, referral_source, owner_name, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT (user_id) DO UPDATE SET
       company_name = excluded.company_name,
       business_type = excluded.business_type,
       referral_source = excluded.referral_source,
       owner_name = excluded.owner_name,
       updated_at = datetime('now')`,
  ).run(req.userId!, companyName.trim(), businessType, referralSource, ownerName.trim());

  res.json({ profile: { companyName: companyName.trim(), businessType, referralSource, ownerName: ownerName.trim() } });
});

export default router;
