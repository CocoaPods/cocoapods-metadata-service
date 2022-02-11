const {trunk, setup} = require('../dist/trunk/db.js');

const go = async () => {
    await setup()
    const limit = 10000
    const query = `SELECT "id", "pod_id", "install_size", "total_files", "total_comments", "total_lines_of_code", "doc_percent", "readme_complexity", "initial_commit_date", "rendered_readme_url", "created_at", "updated_at", "license_short_name", "license_canonical_url", "total_test_expectations", "dominant_language", "quality_estimate", "builds_independently", "is_vendored_framework", "rendered_changelog_url", "rendered_summary", "spm_support" FROM "public"."cocoadocs_pod_metrics"  WHERE ("rendered_readme_url" NOT ILIKE '%s3.amazonaws%' OR "rendered_readme_url" IS NULL) ORDER BY "updated_at" DESC, "id" DESC  LIMIT ${limit}`
    const rows = await trunk.query(query)

    for (const row of rows.rows) {
        // http://cocoadocs.org/docsets/GDP/1.0.0/README.html ->
        // http://cocoadocs.org.s3.amazonaws.com/docsets/EQWorksSimpleApi/0.1.0/README.html
        const newREADME = row.rendered_readme_url.replace('http://cocoadocs.org/', 'http://cocoadocs.org.s3.amazonaws.com/')
        const updateQuery = `UPDATE "public"."cocoadocs_pod_metrics" SET "rendered_readme_url" = '${newREADME}' WHERE "id" = ${row.id}`
        const res = await trunk.query(updateQuery)
        const podname = row.rendered_readme_url.split("docsets/")[1].split("/")[0]
        console.log(`https://cocoapods.org/pods/${podname}`)
    }

    await trunk.end()
}


go()