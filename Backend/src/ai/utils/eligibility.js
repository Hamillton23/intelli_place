const normalize = (value) => String(value || "").trim().toLowerCase();

const checkEligibility = (candidate, opening) => {
    const reasons = [];
    const branch = candidate.branch?.branchCode || candidate.branch || "";
    const batchAllowed = normalize(opening.batch) === normalize(candidate.batch);
    const branchAllowed = (opening.branchesAllowed || []).some(
        (allowedBranch) => normalize(allowedBranch) === normalize(branch)
    );

    if (!batchAllowed) {
        reasons.push("Batch does not match the opening requirement.");
    }

    if (!branchAllowed) {
        reasons.push("Branch is not allowed for this opening.");
    }

    let cgpaAllowed = true;
    const criteria = (opening.cgpaCriteria || []).find(
        (item) => normalize(item.branch) === normalize(branch)
    );

    if (criteria && Number.isFinite(Number(criteria.cgpa))) {
        cgpaAllowed = Number(candidate.cgpa || 0) >= Number(criteria.cgpa);
        if (!cgpaAllowed) {
            reasons.push(`CGPA ${candidate.cgpa || 0} is below the required ${criteria.cgpa}.`);
        }
    }

    return {
        eligible: batchAllowed && branchAllowed && cgpaAllowed,
        reasons,
        checks: {
            batch: batchAllowed,
            branch: branchAllowed,
            cgpa: cgpaAllowed
        }
    };
};

module.exports = { checkEligibility };
