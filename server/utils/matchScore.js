/**
 * Calculate match score between resume and job
 * @param {string} resumeText - parsed resume text
 * @param {object} job - job object from MongoDB
 * @returns {object} - { score, matchedSkills, missingSkills, totalSkills }
 */
const calculateMatchScore = (resumeText, job) => {
  // 1. Normalize resume text to lowercase
  const resume = (resumeText || '').toLowerCase()

  // 2. Build skills list from job
  // Combine required skills + extract from title/description
  const jobSkills = []

  // Add required skills from job_required_skills array
  if (job.job_required_skills && job.job_required_skills.length > 0) {
    job.job_required_skills.forEach(skill => {
      if (skill) jobSkills.push(skill.toLowerCase().trim())
    })
  }

  // Add common tech keywords from job title and description
  const techKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#',
    'react', 'angular', 'vue', 'node', 'express', 'django',
    'flask', 'spring', 'mongodb', 'postgresql', 'mysql', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
    'html', 'css', 'tailwind', 'bootstrap', 'sass',
    'rest', 'graphql', 'api', 'microservices',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'data analysis', 'excel', 'tableau', 'power bi', 'sql',
    'figma', 'photoshop', 'illustrator', 'ui', 'ux',
    'agile', 'scrum', 'jira', 'linux', 'bash',
    'next.js', 'nuxt', 'svelte', 'redux', 'graphql',
    'firebase', 'supabase', 'prisma', 'jest', 'cypress',
    'r', 'matlab', 'scala', 'kotlin', 'swift', 'flutter',
    'hadoop', 'spark', 'kafka', 'elasticsearch'
  ]

  const jobText = `
    ${job.job_title || ''} 
    ${job.job_description || ''}
  `.toLowerCase()

  techKeywords.forEach(keyword => {
    // Avoid false positives during keyword extraction by matching word boundaries for alphanumeric keywords
    const isAlphanumeric = /^[a-z0-9\s]+$/i.test(keyword);
    const regex = isAlphanumeric
      ? new RegExp(`\\b${keyword}\\b`, 'i')
      : new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');

    if (regex.test(jobText) && !jobSkills.includes(keyword)) {
      jobSkills.push(keyword)
    }
  })

  // Remove duplicates
  const uniqueJobSkills = [...new Set(jobSkills)]

  // 3. If no skills found for job, return neutral score
  if (uniqueJobSkills.length === 0) {
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: [],
      totalSkills: 0
    }
  }

  // 4. Check which skills are in resume
  const matchedSkills = []
  const missingSkills = []

  uniqueJobSkills.forEach(skill => {
    // Check if skill appears in resume text with word boundary matching for alphanumeric keywords
    const isAlphanumeric = /^[a-z0-9\s]+$/i.test(skill);
    const regex = isAlphanumeric
      ? new RegExp(`\\b${skill}\\b`, 'i')
      : new RegExp(skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');

    if (regex.test(resume)) {
      matchedSkills.push(skill)
    } else {
      missingSkills.push(skill)
    }
  })

  // 5. Calculate score as percentage
  const score = Math.round(
    (matchedSkills.length / uniqueJobSkills.length) * 100
  )

  return {
    score,
    matchedSkills,
    missingSkills,
    totalSkills: uniqueJobSkills.length
  }
}

module.exports = { calculateMatchScore }
