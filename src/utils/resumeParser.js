const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Resume Parser - Extracts structured information from PDF resumes
 */
class ResumeParser {
    constructor() {
        // Common patterns for resume sections
        this.sectionPatterns = {
            name: [
                /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/m,
                /^Name:\s*([^\n]+)/mi,
                /^([A-Z\s]{2,30})\s*\n/m
            ],
            email: [
                /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
            ],
            phone: [
                /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
                /(?:\+?91[-.\s]?)?[0-9]{10}/g
            ],
            linkedin: [
                /linkedin\.com\/in\/([a-zA-Z0-9-]+)/gi,
                /linkedin\.com\/pub\/([a-zA-Z0-9-]+)/gi
            ],
            github: [
                /github\.com\/([a-zA-Z0-9-]+)/gi
            ],
            location: [
                /(?:Location|Address):\s*([^\n]+)/mi,
                /([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)/g,
                /([A-Z][a-z]+,\s*[A-Z][a-z]+)/g
            ]
        };

        this.skillPatterns = [
            /(?:Skills?|Technologies?|Technical Skills?):\s*([^\n]+(?:\n(?!\s*[A-Z][a-z]+:)[^\n]+)*)/mi,
            /(?:Programming Languages?|Languages?):\s*([^\n]+)/mi,
            /(?:Frameworks?|Libraries?):\s*([^\n]+)/mi,
            /(?:Tools?|Software?):\s*([^\n]+)/mi
        ];

        this.experiencePatterns = [
            /(?:Experience|Work Experience|Professional Experience|Employment History):\s*([\s\S]*?)(?=\n\s*(?:Education|Skills|Projects|Certifications|$))/mi,
            /((?:[A-Z][a-zA-Z\s&]+)\s*[-–—]\s*(?:[A-Z][a-zA-Z\s,]+)\s*\(?\d{4}[^\n]*)/gm
        ];

        this.educationPatterns = [
            /(?:Education|Academic Background|Qualifications?):\s*([\s\S]*?)(?=\n\s*(?:Experience|Skills|Projects|Certifications|$))/mi,
            /((?:Bachelor|Master|PhD|B\.?[ASE]|M\.?[ASE]|Ph\.?D)[^\n]*\d{4}[^\n]*)/gmi
        ];

        this.projectPatterns = [
            /(?:Projects?|Personal Projects?|Notable Projects?):\s*([\s\S]*?)(?=\n\s*(?:Experience|Education|Skills|Certifications|$))/mi
        ];

        // Common skills and technologies for categorization
        this.skillCategories = {
            languages: ['javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'matlab'],
            frameworks: ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net'],
            databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'elasticsearch'],
            cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
            tools: ['git', 'jira', 'confluence', 'slack', 'figma', 'photoshop', 'illustrator']
        };
    }

    /**
     * Parse PDF resume and extract structured information
     * @param {string|Buffer} pdfPath - Path to PDF file or Buffer
     * @returns {Promise<Object>} Parsed resume data
     */
    async parseResume(pdfPath) {
        try {
            let pdfBuffer;
            
            if (Buffer.isBuffer(pdfPath)) {
                pdfBuffer = pdfPath;
            } else if (typeof pdfPath === 'string') {
                pdfBuffer = fs.readFileSync(pdfPath);
            } else {
                throw new Error('Invalid input: expected file path or Buffer');
            }

            const pdfData = await pdfParse(pdfBuffer);
            const text = pdfData.text;
            
            console.log('Extracted PDF text length:', text.length);
            console.log('First 500 characters:', text.substring(0, 500));

            const resumeData = {
                rawText: text,
                personalInfo: this.extractPersonalInfo(text),
                skills: this.extractSkills(text),
                experience: this.extractExperience(text),
                education: this.extractEducation(text),
                projects: this.extractProjects(text),
                summary: this.generateSummary(text),
                metadata: {
                    pages: pdfData.numpages,
                    parsedAt: new Date().toISOString(),
                    wordCount: text.split(/\s+/).length
                }
            };

            console.log('Parsed resume data:', JSON.stringify(resumeData, null, 2));
            return resumeData;

        } catch (error) {
            console.error('Error parsing resume:', error);
            throw new Error(`Failed to parse resume: ${error.message}`);
        }
    }

    /**
     * Extract personal information (name, email, phone, etc.)
     */
    extractPersonalInfo(text) {
        const info = {};

        // Extract name - look for the first line that looks like a name
        const lines = text.split('\n').filter(line => line.trim());
        for (const line of lines.slice(0, 5)) { // Check first 5 lines
            const trimmedLine = line.trim();
            // Look for a line that looks like a name (2-3 words, mostly letters)
            if (trimmedLine.match(/^[A-Z][a-zA-Z\s]{3,40}$/) && 
                trimmedLine.split(' ').length >= 2 && 
                trimmedLine.split(' ').length <= 4 &&
                !trimmedLine.toLowerCase().includes('resume') &&
                !trimmedLine.toLowerCase().includes('curriculum')) {
                info.name = trimmedLine;
                break;
            }
        }

        // Extract email
        const emailMatch = text.match(this.sectionPatterns.email[0]);
        if (emailMatch) {
            info.email = emailMatch[0];
        }

        // Extract phone - try multiple patterns
        for (const pattern of this.sectionPatterns.phone) {
            const phoneMatch = text.match(pattern);
            if (phoneMatch) {
                info.phone = phoneMatch[0];
                break;
            }
        }

        // Extract LinkedIn
        const linkedinMatch = text.match(this.sectionPatterns.linkedin[0]);
        if (linkedinMatch) {
            info.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
        }

        // Extract GitHub
        const githubMatch = text.match(this.sectionPatterns.github[0]);
        if (githubMatch) {
            info.github = `https://github.com/${githubMatch[1]}`;
        }

        // Extract location
        for (const pattern of this.sectionPatterns.location) {
            const match = text.match(pattern);
            if (match && match[1]) {
                info.location = match[1].trim();
                break;
            }
        }

        return info;
    }

    /**
     * Extract and categorize skills
     */
    extractSkills(text) {
        const skills = {
            all: [],
            languages: [],
            frameworks: [],
            databases: [],
            cloud: [],
            tools: [],
            other: []
        };

        // Extract skills from dedicated sections
        for (const pattern of this.skillPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const skillText = match[1];
                const extractedSkills = this.parseSkillText(skillText);
                skills.all.push(...extractedSkills);
            }
        }

        // Remove duplicates
        skills.all = [...new Set(skills.all.map(s => s.toLowerCase()))];

        // Categorize skills
        for (const skill of skills.all) {
            const lowerSkill = skill.toLowerCase();
            let categorized = false;

            for (const [category, categorySkills] of Object.entries(this.skillCategories)) {
                if (categorySkills.some(catSkill => lowerSkill.includes(catSkill) || catSkill.includes(lowerSkill))) {
                    skills[category].push(skill);
                    categorized = true;
                    break;
                }
            }

            if (!categorized) {
                skills.other.push(skill);
            }
        }

        return skills;
    }

    /**
     * Parse skill text into individual skills
     */
    parseSkillText(skillText) {
        return skillText
            .split(/[,;•\n\r]/)
            .map(skill => skill.trim())
            .filter(skill => skill.length > 1 && skill.length < 30)
            .filter(skill => !skill.match(/^[^a-zA-Z]*$/)); // Remove non-alphabetic entries
    }

    /**
     * Extract work experience
     */
    extractExperience(text) {
        const experiences = [];

        for (const pattern of this.experiencePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const expText = match[1];
                const parsedExperiences = this.parseExperienceText(expText);
                experiences.push(...parsedExperiences);
            }
        }

        return experiences.slice(0, 5); // Limit to 5 most recent experiences
    }

    /**
     * Parse experience text into structured format
     */
    parseExperienceText(expText) {
        const experiences = [];
        const lines = expText.split('\n').filter(line => line.trim());

        let currentExp = null;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Check if this looks like a job title/company line
            if (this.looksLikeJobTitle(trimmedLine)) {
                if (currentExp) {
                    experiences.push(currentExp);
                }
                
                currentExp = {
                    title: '',
                    company: '',
                    duration: '',
                    description: [],
                    raw: trimmedLine
                };

                // Parse job title and company
                const parsed = this.parseJobTitleCompany(trimmedLine);
                currentExp.title = parsed.title;
                currentExp.company = parsed.company;
                currentExp.duration = parsed.duration;
            } else if (currentExp && trimmedLine.length > 10) {
                // Add to description if it's substantial content
                currentExp.description.push(trimmedLine);
            }
        }

        if (currentExp) {
            experiences.push(currentExp);
        }

        // If no experiences found using structured approach, try simple pattern matching
        if (experiences.length === 0) {
            const text = expText;
            
            // Look for job title patterns in the text
            const jobPatterns = [
                /([A-Z][a-zA-Z\s]+(?:Intern|Engineer|Developer|Manager|Analyst|Designer|Lead|Head))[^\n]*([A-Z][a-zA-Z\s&]+)([^\n]*(?:20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[^\n]*)/gmi
            ];
            
            for (const pattern of jobPatterns) {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    experiences.push({
                        title: match[1].trim(),
                        company: match[2].trim(),
                        duration: match[3].trim(),
                        description: [],
                        raw: match[0]
                    });
                }
            }
        }

        return experiences;
    }

    /**
     * Check if a line looks like a job title
     */
    looksLikeJobTitle(line) {
        // Look for patterns like "Software Engineer - Google (2020-2023)"
        const patterns = [
            /[A-Z][a-zA-Z\s]+ - [A-Z][a-zA-Z\s&]+ \(/,
            /[A-Z][a-zA-Z\s]+ at [A-Z][a-zA-Z\s&]+/,
            /\d{4}.*\d{4}/,
            /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i
        ];

        return patterns.some(pattern => pattern.test(line));
    }

    /**
     * Parse job title and company from a line
     */
    parseJobTitleCompany(line) {
        const result = { title: '', company: '', duration: '' };

        // Pattern: "Software Engineer - Google (2020-2023)"
        let match = line.match(/^(.+?)\s*[-–—]\s*(.+?)\s*\((.+?)\)/);
        if (match) {
            result.title = match[1].trim();
            result.company = match[2].trim();
            result.duration = match[3].trim();
            return result;
        }

        // Pattern: "Software Engineer at Google"
        match = line.match(/^(.+?)\s+at\s+(.+?)(?:\s*\((.+?)\))?$/);
        if (match) {
            result.title = match[1].trim();
            result.company = match[2].trim();
            result.duration = match[3] ? match[3].trim() : '';
            return result;
        }

        // Fallback: assume the whole line is the title
        result.title = line;
        return result;
    }

    /**
     * Extract education information
     */
    extractEducation(text) {
        const education = [];

        for (const pattern of this.educationPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const eduText = match[1];
                const parsedEducation = this.parseEducationText(eduText);
                education.push(...parsedEducation);
            }
        }

        return education.slice(0, 3); // Limit to 3 entries
    }

    /**
     * Parse education text
     */
    parseEducationText(eduText) {
        const education = [];
        const lines = eduText.split('\n').filter(line => line.trim());

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.length > 10 && this.looksLikeEducation(trimmedLine)) {
                const parsed = this.parseEducationLine(trimmedLine);
                if (parsed.degree) {
                    education.push(parsed);
                }
            }
        }

        // If no education found, try pattern matching on the full text
        if (education.length === 0) {
            const eduPatterns = [
                /(Bachelor[^\n]*)/gmi,
                /(Master[^\n]*)/gmi,
                /(PhD[^\n]*)/gmi,
                /(B\.?[ASE][^\n]*)/gmi,
                /(M\.?[ASE][^\n]*)/gmi,
                /([A-Z][a-zA-Z\s]+(?:University|College|Institute)[^\n]*)/gmi
            ];
            
            for (const pattern of eduPatterns) {
                let match;
                while ((match = pattern.exec(eduText)) !== null) {
                    const parsed = this.parseEducationLine(match[1]);
                    if (parsed.degree || parsed.institution) {
                        education.push(parsed);
                    }
                }
            }
        }

        return education;
    }

    /**
     * Check if line looks like education entry
     */
    looksLikeEducation(line) {
        const eduKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'institute'];
        const lowerLine = line.toLowerCase();
        return eduKeywords.some(keyword => lowerLine.includes(keyword)) || /\d{4}/.test(line);
    }

    /**
     * Parse individual education line
     */
    parseEducationLine(line) {
        const result = { degree: '', institution: '', year: '', field: '' };

        // Extract year
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
            result.year = yearMatch[0];
        }

        // Extract degree type
        const degreeMatch = line.match(/(Bachelor|Master|PhD|B\.?[ASE]|M\.?[ASE]|Ph\.?D)[^\n]*/i);
        if (degreeMatch) {
            result.degree = degreeMatch[0];
        }

        // Try to extract institution (usually after "from" or before year)
        const institutionMatch = line.match(/(?:from|at)\s+([^,\n]+)/i) || 
                                line.match(/([A-Z][a-zA-Z\s]+(?:University|College|Institute))/);
        if (institutionMatch) {
            result.institution = institutionMatch[1].trim();
        }

        // If no specific parts found, use the whole line as degree
        if (!result.degree && !result.institution) {
            result.degree = line;
        }

        return result;
    }

    /**
     * Extract projects
     */
    extractProjects(text) {
        const projects = [];

        for (const pattern of this.projectPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const projectText = match[1];
                const parsedProjects = this.parseProjectText(projectText);
                projects.push(...parsedProjects);
            }
        }

        return projects.slice(0, 5); // Limit to 5 projects
    }

    /**
     * Parse project text
     */
    parseProjectText(projectText) {
        const projects = [];
        const lines = projectText.split('\n').filter(line => line.trim());

        let currentProject = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (this.looksLikeProjectTitle(trimmedLine)) {
                if (currentProject) {
                    projects.push(currentProject);
                }
                
                currentProject = {
                    name: trimmedLine,
                    description: [],
                    technologies: []
                };
            } else if (currentProject && trimmedLine.length > 5) {
                currentProject.description.push(trimmedLine);
            }
        }

        if (currentProject) {
            projects.push(currentProject);
        }

        return projects;
    }

    /**
     * Check if line looks like project title
     */
    looksLikeProjectTitle(line) {
        return line.length < 100 && 
               line.length > 5 && 
               !line.includes('•') && 
               !line.startsWith('-') &&
               line.split(' ').length < 8;
    }

    /**
     * Generate a summary of the resume
     */
    generateSummary(text) {
        const wordCount = text.split(/\s+/).length;
        const hasContact = /[@.]/.test(text);
        const hasExperience = /(?:experience|worked|developer|engineer)/i.test(text);
        const hasEducation = /(?:university|college|degree|bachelor|master)/i.test(text);
        
        return {
            wordCount,
            hasContactInfo: hasContact,
            hasWorkExperience: hasExperience,
            hasEducation: hasEducation,
            estimatedExperienceLevel: this.estimateExperienceLevel(text)
        };
    }

    /**
     * Estimate experience level based on resume content
     */
    estimateExperienceLevel(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('architect')) {
            return 'Senior';
        } else if (lowerText.includes('junior') || lowerText.includes('intern') || lowerText.includes('entry')) {
            return 'Junior';
        } else if (lowerText.includes('manager') || lowerText.includes('director')) {
            return 'Management';
        } else {
            return 'Mid-Level';
        }
    }
}

module.exports = ResumeParser;
