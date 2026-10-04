const formatCandidateForAI = (user) => ({
    name: user.name || "",
    branch: user.branch || "",
    batch: user.batch || "",
    cgpa: user.cgpa || 0,
    academicDetails: {
        tenth: user.academicDetails?.tenth || {},
        twelfth: user.academicDetails?.twelfth || {},
        ug: user.academicDetails?.ug || {}
    },
    skills: user.skills || [],
    projects: (user.projects || []).map(({ title, description }) => ({
        title: title || "",
        description: description || ""
    })),
    internships: (user.internships || []).map(({ company, role, duration, description }) => ({
        company: company || "",
        role: role || "",
        duration: duration || "",
        description: description || ""
    })),
    achievements: user.achievements || [],
    careerObjective: user.careerObjective || "",
    linkedIn: user.linkedIn || "",
    github: user.github || ""
});

module.exports = { formatCandidateForAI };
