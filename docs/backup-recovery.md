# Backup and Recovery Procedures

## 1. Automated Backups (Convex)

Convex provides built-in backup and point-in-time recovery (PITR) for paid plans.

- **Frequency**: Continuous.
- **Retention**: Depends on plan (typically 7-30 days).
- **Restoration**: Via Convex Dashboard -> Settings -> Backups.

## 2. Manual Data Export (Off-site Backup)

For compliance and redundancy, we perform periodic JSON exports.

### Export Script

Run the following command to export all tables to JSONL files:

```bash
mkdir -p backups/$(date +%Y-%m-%d)
npx convex export --dir backups/$(date +%Y-%m-%d)
```

### Restoration from Export

To restore data from a local backup:

```bash
npx convex import --replace backups/2025-11-30
```

_Warning: `--replace` will overwrite existing data._

## 3. Disaster Recovery Plan

In case of catastrophic failure (e.g., accidental deletion of prod environment):

1. **Assess**: Determine scope of data loss.
2. **Restore**: Use Convex Dashboard to restore to the latest healthy point-in-time.
3. **Verify**: Check critical paths (Login, Content Access).
4. **Notify**: Inform users via email/status page if downtime exceeded SLA.
