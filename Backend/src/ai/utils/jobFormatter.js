const formatJobForAI = (opening) => ({
    companyName: opening.companyName || "",
    offerType: opening.offerType || "",
    internship: opening.internship || {},
    fullTime: opening.fullTime || {},
    location: opening.location || "",
    branchesAllowed: opening.branchesAllowed || [],
    batch: opening.batch || "",
    cgpaCriteria: opening.cgpaCriteria || [],
    additionalInfo: opening.additionalInfo || ""
});

module.exports = { formatJobForAI };
