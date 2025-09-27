import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { AppHeader } from './AppHeader.js';
import { MainView } from '../views/MainView.js';
import { CustomizeView } from '../views/CustomizeView.js';
import { HelpView } from '../views/HelpView.js';
import { HistoryView } from '../views/HistoryView.js';
import { AssistantView } from '../views/AssistantView.js';
import { OnboardingView } from '../views/OnboardingView.js';
import { AdvancedView } from '../views/AdvancedView.js';
import { CandidateSetupView } from '../views/CandidateSetupView.js';

export class TruHireApp extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0px;
            padding: 0px;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            width: 100%;
            height: 100vh;
            background-color: var(--background-transparent);
            color: var(--text-color);
        }

        .window-container {
            height: 100vh;
            border-radius: 7px;
            overflow: hidden;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .main-content {
            flex: 1;
            padding: var(--main-content-padding);
            overflow-y: auto;
            margin-top: var(--main-content-margin-top);
            border-radius: var(--content-border-radius);
            transition: all 0.15s ease-out;
            background: var(--main-content-background);
        }

        .main-content.with-border {
            border: 1px solid var(--border-color);
        }

        .main-content.assistant-view {
            padding: 10px;
            border: none;
        }

        .main-content.onboarding-view {
            padding: 0;
            border: none;
            background: transparent;
        }

        .view-container {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.15s ease-out, transform 0.15s ease-out;
            height: 100%;
        }

        .view-container.entering {
            opacity: 0;
            transform: translateY(10px);
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-background);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }
    `;

    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        startTime: { type: Number },
        isRecording: { type: Boolean },
        sessionActive: { type: Boolean },
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedScreenshotInterval: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        advancedMode: { type: Boolean },
        _viewInstances: { type: Object, state: true },
        _isClickThrough: { state: true },
        _awaitingNewResponse: { state: true },
        shouldAnimateResponse: { type: Boolean },
    };

    constructor() {
        super();
        this.currentView = localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding';
        this.statusText = '';
        this.startTime = null;
        this.isRecording = false;
        this.sessionActive = false;
        this.selectedProfile = localStorage.getItem('selectedProfile') || 'interview';
        this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en-US';
        this.selectedScreenshotInterval = localStorage.getItem('selectedScreenshotInterval') || '5';
        this.selectedImageQuality = localStorage.getItem('selectedImageQuality') || 'medium';
        this.layoutMode = localStorage.getItem('layoutMode') || 'normal';
        this.advancedMode = localStorage.getItem('advancedMode') === 'true';
        this.responses = [];
        this.currentResponseIndex = -1;
        this._viewInstances = new Map();
        this._isClickThrough = false;
        this._awaitingNewResponse = false;
        this._currentResponseIsComplete = true;
        this.shouldAnimateResponse = false;

        // Apply layout mode to document root
        this.updateLayoutMode();
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up IPC listeners if needed
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('update-response', (_, response) => {
                this.setResponse(response);
            });
            ipcRenderer.on('update-status', (_, status) => {
                this.setStatus(status);
            });
            ipcRenderer.on('click-through-toggled', (_, isEnabled) => {
                this._isClickThrough = isEnabled;
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeAllListeners('update-response');
            ipcRenderer.removeAllListeners('update-status');
            ipcRenderer.removeAllListeners('click-through-toggled');
        }
    }

    setStatus(text) {
        this.statusText = text;
        
        // Mark response as complete when we get certain status messages
        if (text.includes('Ready') || text.includes('Listening') || text.includes('Error')) {
            this._currentResponseIsComplete = true;
            console.log('[setStatus] Marked current response as complete');
        }
    }

    setResponse(response) {
        // Check if this looks like a filler response (very short responses to hmm, ok, etc)
        const isFillerResponse =
            response.length < 30 &&
            (response.toLowerCase().includes('hmm') ||
                response.toLowerCase().includes('okay') ||
                response.toLowerCase().includes('next') ||
                response.toLowerCase().includes('go on') ||
                response.toLowerCase().includes('continue'));

        if (this._awaitingNewResponse || this.responses.length === 0) {
            // Always add as new response when explicitly waiting for one
            this.responses = [...this.responses, response];
            this.currentResponseIndex = this.responses.length - 1;
            this._awaitingNewResponse = false;
            this._currentResponseIsComplete = false;
            console.log('[setResponse] Pushed new response:', response);
        } else if (!this._currentResponseIsComplete && !isFillerResponse && this.responses.length > 0) {
            // For substantial responses, update the last one (streaming behavior)
            // Only update if the current response is not marked as complete
            this.responses = [...this.responses.slice(0, this.responses.length - 1), response];
            console.log('[setResponse] Updated last response:', response);
        } else {
            // For filler responses or when current response is complete, add as new
            this.responses = [...this.responses, response];
            this.currentResponseIndex = this.responses.length - 1;
            this._currentResponseIsComplete = false;
            console.log('[setResponse] Added response as new:', response);
        }
        this.shouldAnimateResponse = true;
        this.requestUpdate();
    }

    // Header event handlers
    handleCustomizeClick() {
        this.currentView = 'customize';
        this.requestUpdate();
    }

    handleHelpClick() {
        this.currentView = 'help';
        this.requestUpdate();
    }

    handleHistoryClick() {
        this.currentView = 'history';
        this.requestUpdate();
    }

    handleAdvancedClick() {
        this.currentView = 'advanced';
        this.requestUpdate();
    }

    async handleClose() {
        if (this.currentView === 'customize' || this.currentView === 'help' || this.currentView === 'history') {
            this.currentView = 'main';
        } else if (this.currentView === 'assistant') {
            cheddar.stopCapture();

            // Close the session
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('close-session');
            }
            this.sessionActive = false;
            this.currentView = 'main';
            console.log('Session closed');
        } else {
            // Quit the entire application
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('quit-application');
            }
        }
    }

    async handleHideToggle() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('toggle-window-visibility');
        }
    }

    // Main view event handlers
    async handleStart() {
        // check if api key is empty do nothing
        const apiKey = localStorage.getItem('apiKey')?.trim();
        if (!apiKey || apiKey === '') {
            // Trigger the red blink animation on the API key input
            const mainView = this.shadowRoot.querySelector('main-view');
            if (mainView && mainView.triggerApiKeyError) {
                mainView.triggerApiKeyError();
            }
            return;
        }

        // Go to candidate setup first
        this.currentView = 'candidateSetup';
    }

    // Candidate setup event handlers
    handleCandidateSetupBack() {
        this.currentView = 'main';
    }

    async handleStartInterview(candidateData) {
        try {
            // Store candidate data for the session
            localStorage.setItem('currentCandidate', JSON.stringify(candidateData));
            
            // Generate candidate context for the AI
            const candidateContext = this.generateCandidateContext(candidateData);
            
            // Initialize Gemini with candidate context
            await cheddar.initializeGeminiWithContext(this.selectedProfile, this.selectedLanguage, candidateContext);
            
            // Start capture
            cheddar.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
            
            // Reset session data
            this.responses = [];
            this.currentResponseIndex = -1;
            this.startTime = Date.now();
            
            // Store interview start time for duration tracking
            localStorage.setItem('interviewStartTime', this.startTime.toString());
            
            // Go to assistant view
            this.currentView = 'assistant';
            
        } catch (error) {
            console.error('Error starting interview:', error);
            // Could show error message to user
        }
    }

    generateCandidateContext(candidateData) {
        let context = `CANDIDATE INTERVIEW CONTEXT\n${'='.repeat(50)}\n\n`;
        
        // Basic candidate info
        if (candidateData.candidateInfo) {
            const info = candidateData.candidateInfo;
            context += `CANDIDATE INFORMATION:\n`;
            if (info.name) context += `- Name: ${info.name}\n`;
            if (info.role) context += `- Applying for: ${info.role}\n`;
            if (info.email) context += `- Email: ${info.email}\n`;
            context += `\n`;
        }
        
        // GitHub analysis
        const analysisData = JSON.parse(localStorage.getItem('candidateAnalysis') || '{}');
        if (analysisData.analysis?.github) {
            const github = analysisData.analysis.github;
            
            context += `GITHUB PROFILE ANALYSIS:\n`;
            context += `- Username: ${github.userInfo.username}\n`;
            context += `- Account Age: ${Math.floor((Date.now() - new Date(github.userInfo.accountCreationDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years\n`;
            context += `- Public Repositories: ${github.userInfo.publicRepos}\n`;
            context += `- Total Stars: ${github.activity.totalStars}\n`;
            context += `- Recent Activity: ${github.activity.recentCommits} commits this week\n`;
            
            if (github.languageStats.length > 0) {
                context += `- Primary Languages: ${github.languageStats.slice(0, 3).map(l => `${l.language} (${l.percentage.toFixed(1)}%)`).join(', ')}\n`;
            }
            
            if (github.repositories.length > 0) {
                context += `\nNOTABLE REPOSITORIES:\n`;
                github.repositories.slice(0, 5).forEach(repo => {
                    context += `- ${repo.name}: ${repo.description || 'No description'} (${repo.language || 'Unknown'}, ${repo.stars} stars)\n`;
                });
            }
            
            if (github.insights.length > 0) {
                context += `\nKEY INSIGHTS:\n`;
                github.insights.forEach(insight => {
                    context += `- ${insight}\n`;
                });
            }
            
            if (github.questions.length > 0) {
                context += `\nSUGGESTED TECHNICAL QUESTIONS:\n`;
                github.questions.forEach(question => {
                    context += `- ${question}\n`;
                });
            }
            
            context += `\n`;
        }
        
        // Resume info (if available)
        if (analysisData.analysis?.resume) {
            const resume = analysisData.analysis.resume;
            context += `RESUME INFORMATION:\n`;
            context += `- File: ${resume.fileName}\n`;
            context += `- Size: ${(resume.fileSize / 1024).toFixed(1)} KB\n`;
            
            // Add parsed resume content if available
            if (resume.parsedData) {
                const parsed = resume.parsedData;
                
                // Personal information
                if (parsed.personalInfo) {
                    context += `\nPERSONAL INFORMATION:\n`;
                    if (parsed.personalInfo.name) context += `- Name: ${parsed.personalInfo.name}\n`;
                    if (parsed.personalInfo.email) context += `- Email: ${parsed.personalInfo.email}\n`;
                    if (parsed.personalInfo.phone) context += `- Phone: ${parsed.personalInfo.phone}\n`;
                    if (parsed.personalInfo.location) context += `- Location: ${parsed.personalInfo.location}\n`;
                    if (parsed.personalInfo.linkedin) context += `- LinkedIn: ${parsed.personalInfo.linkedin}\n`;
                    if (parsed.personalInfo.github) context += `- GitHub: ${parsed.personalInfo.github}\n`;
                }
                
                // Skills
                if (parsed.skills?.all?.length > 0) {
                    context += `\nTECHNICAL SKILLS:\n`;
                    const skillCategories = ['programming', 'frameworks', 'databases', 'cloud', 'tools'];
                    skillCategories.forEach(category => {
                        if (parsed.skills[category]?.length > 0) {
                            context += `- ${category.charAt(0).toUpperCase() + category.slice(1)}: ${parsed.skills[category].join(', ')}\n`;
                        }
                    });
                    if (parsed.skills.other?.length > 0) {
                        context += `- Other: ${parsed.skills.other.join(', ')}\n`;
                    }
                }
                
                // Work experience
                if (parsed.experience?.length > 0) {
                    context += `\nWORK EXPERIENCE:\n`;
                    parsed.experience.slice(0, 3).forEach((job, index) => {
                        context += `${index + 1}. ${job.title || 'Unknown Title'} at ${job.company || 'Unknown Company'}\n`;
                        if (job.duration) context += `   Duration: ${job.duration}\n`;
                        if (job.description) {
                            const shortDesc = job.description.length > 100 
                                ? job.description.substring(0, 100) + '...'
                                : job.description;
                            context += `   Description: ${shortDesc}\n`;
                        }
                    });
                }
                
                // Education
                if (parsed.education?.length > 0) {
                    context += `\nEDUCATION:\n`;
                    parsed.education.forEach((edu, index) => {
                        context += `${index + 1}. ${edu.degree || 'Unknown Degree'} from ${edu.institution || 'Unknown Institution'}\n`;
                        if (edu.year) context += `   Year: ${edu.year}\n`;
                    });
                }
                
                // Projects
                if (parsed.projects?.length > 0) {
                    context += `\nPROJECTS:\n`;
                    parsed.projects.slice(0, 3).forEach((project, index) => {
                        context += `${index + 1}. ${project.name || 'Unnamed Project'}\n`;
                        if (project.description) {
                            const shortDesc = project.description.length > 100 
                                ? project.description.substring(0, 100) + '...'
                                : project.description;
                            context += `   Description: ${shortDesc}\n`;
                        }
                        if (project.technologies?.length > 0) {
                            context += `   Technologies: ${project.technologies.join(', ')}\n`;
                        }
                    });
                }
                
                // Summary
                if (parsed.summary) {
                    context += `\nRESUME SUMMARY:\n`;
                    if (parsed.summary.estimatedExperienceLevel) {
                        context += `- Experience Level: ${parsed.summary.estimatedExperienceLevel}\n`;
                    }
                    if (parsed.summary.keyStrengths?.length > 0) {
                        context += `- Key Strengths: ${parsed.summary.keyStrengths.join(', ')}\n`;
                    }
                    if (parsed.summary.primaryDomains?.length > 0) {
                        context += `- Primary Domains: ${parsed.summary.primaryDomains.join(', ')}\n`;
                    }
                }
            }
            
            context += `\n`;
        }
        
        context += `VERIFICATION DATABASE FOR CREDIBILITY CHECKING:\n`;
        context += `Use this data to VERIFY every claim the candidate makes during the interview.\n\n`;
        
        // Add verification checklist
        if (analysisData.analysis?.resume) {
            const resume = analysisData.analysis.resume;
            context += `RESUME VERIFICATION CHECKLIST:\n`;
            
            if (resume.parsedData?.experience) {
                context += `- EMPLOYMENT HISTORY: `;
                resume.parsedData.experience.forEach(exp => {
                    context += `"${exp.company}" (${exp.title}, ${exp.duration}), `;
                });
                context += `\n`;
            }
            
            if (resume.parsedData?.education) {
                context += `- EDUCATION HISTORY: `;
                resume.parsedData.education.forEach(edu => {
                    context += `"${edu.institution}" (${edu.degree}, ${edu.year}), `;
                });
                context += `\n`;
            }
            
            if (resume.parsedData?.skills?.all) {
                context += `- VERIFIED SKILLS: ${resume.parsedData.skills.all.join(', ')}\n`;
            }
            
            const totalExperience = this.calculateResumeExperience(resume.parsedData?.experience || []);
            context += `- CALCULATED TOTAL EXPERIENCE: ${totalExperience} years\n`;
        }
        
        if (analysisData.analysis?.github) {
            const github = analysisData.analysis.github;
            context += `\nGITHUB VERIFICATION DATA:\n`;
            context += `- ACCOUNT AGE: ${Math.floor((Date.now() - new Date(github.userInfo.accountCreationDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years\n`;
            context += `- VERIFIED LANGUAGES: ${github.languageStats.map(l => `${l.language} (${l.percentage.toFixed(1)}%)`).join(', ')}\n`;
            context += `- REPOSITORY COUNT: ${github.userInfo.publicRepos}\n`;
            context += `- RECENT ACTIVITY: ${github.activity.recentCommits} commits this week\n`;
        }
        
        context += `\nINTERVIEWER ASSISTANCE INSTRUCTIONS:\n`;
        context += `- VERIFY every claim against the above data\n`;
        context += `- FLAG any discrepancies immediately\n`;
        context += `- Suggest probing questions when claims seem inflated\n`;
        context += `- Help the interviewer assess credibility in real-time\n`;
        context += `- Reference specific projects, technologies, and achievements when appropriate\n`;
        context += `- Provide context-aware suggestions for technical discussions\n`;
        
        return context;
    }

    calculateResumeExperience(experiences) {
        if (!experiences || experiences.length === 0) return 0;
        
        let totalMonths = 0;
        const currentYear = new Date().getFullYear();
        
        experiences.forEach(exp => {
            if (exp.duration) {
                const duration = exp.duration.toLowerCase();
                
                if (duration.includes('present') || duration.includes('current')) {
                    const startMatch = duration.match(/(\d{4})/);
                    if (startMatch) {
                        const startYear = parseInt(startMatch[1]);
                        totalMonths += (currentYear - startYear) * 12;
                    }
                } else {
                    const yearMatches = duration.match(/(\d{4})/g);
                    if (yearMatches && yearMatches.length >= 2) {
                        const startYear = parseInt(yearMatches[0]);
                        const endYear = parseInt(yearMatches[yearMatches.length - 1]);
                        totalMonths += (endYear - startYear) * 12;
                    }
                }
            }
        });
        
        return Math.round(totalMonths / 12);
    }

    async handleAPIKeyHelp() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', 'https://truhire.com/help/api-key');
        }
    }

    // Customize view event handlers
    handleProfileChange(profile) {
        this.selectedProfile = profile;
    }

    handleLanguageChange(language) {
        this.selectedLanguage = language;
    }

    handleScreenshotIntervalChange(interval) {
        this.selectedScreenshotInterval = interval;
    }

    handleImageQualityChange(quality) {
        this.selectedImageQuality = quality;
        localStorage.setItem('selectedImageQuality', quality);
    }

    handleAdvancedModeChange(advancedMode) {
        this.advancedMode = advancedMode;
        localStorage.setItem('advancedMode', advancedMode.toString());
    }

    handleBackClick() {
        this.currentView = 'main';
        this.requestUpdate();
    }

    // Help view event handlers
    async handleExternalLinkClick(url) {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', url);
        }
    }

    // Assistant view event handlers
    async handleSendText(message) {
        const result = await window.cheddar.sendTextMessage(message);

        if (!result.success) {
            console.error('Failed to send message:', result.error);
            this.setStatus('Error sending message: ' + result.error);
        } else {
            this.setStatus('Message sent...');
            this._awaitingNewResponse = true;
        }
    }

    handleResponseIndexChanged(e) {
        this.currentResponseIndex = e.detail.index;
        this.shouldAnimateResponse = false;
        this.requestUpdate();
    }

    handleInterviewEnded() {
        // Interview has been ended from AssistantView
        this.sessionActive = false;
        
        // Clear previous interview data for fresh start
        localStorage.removeItem('currentCandidate');
        localStorage.removeItem('candidateAnalysis');
        
        // Return to candidate setup for next interview
        this.currentView = 'candidateSetup';
        console.log('Interview ended by user, returning to candidate setup for next interview');
    }

    // Onboarding event handlers
    handleOnboardingComplete() {
        this.currentView = 'main';
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Only notify main process of view change if the view actually changed
        if (changedProperties.has('currentView') && window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('view-changed', this.currentView);

            // Add a small delay to smooth out the transition
            const viewContainer = this.shadowRoot?.querySelector('.view-container');
            if (viewContainer) {
                viewContainer.classList.add('entering');
                requestAnimationFrame(() => {
                    viewContainer.classList.remove('entering');
                });
            }
        }

        // Only update localStorage when these specific properties change
        if (changedProperties.has('selectedProfile')) {
            localStorage.setItem('selectedProfile', this.selectedProfile);
        }
        if (changedProperties.has('selectedLanguage')) {
            localStorage.setItem('selectedLanguage', this.selectedLanguage);
        }
        if (changedProperties.has('selectedScreenshotInterval')) {
            localStorage.setItem('selectedScreenshotInterval', this.selectedScreenshotInterval);
        }
        if (changedProperties.has('selectedImageQuality')) {
            localStorage.setItem('selectedImageQuality', this.selectedImageQuality);
        }
        if (changedProperties.has('layoutMode')) {
            this.updateLayoutMode();
        }
        if (changedProperties.has('advancedMode')) {
            localStorage.setItem('advancedMode', this.advancedMode.toString());
        }
    }

    renderCurrentView() {
        // Only re-render the view if it hasn't been cached or if critical properties changed
        const viewKey = `${this.currentView}-${this.selectedProfile}-${this.selectedLanguage}`;

        switch (this.currentView) {
            case 'onboarding':
                return html`
                    <onboarding-view .onComplete=${() => this.handleOnboardingComplete()} .onClose=${() => this.handleClose()}></onboarding-view>
                `;

            case 'main':
                return html`
                    <main-view
                        .onStart=${() => this.handleStart()}
                        .onAPIKeyHelp=${() => this.handleAPIKeyHelp()}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                    ></main-view>
                `;

            case 'candidateSetup':
                return html`
                    <candidate-setup-view
                        .onBack=${() => this.handleCandidateSetupBack()}
                        .onStartInterview=${(data) => this.handleStartInterview(data)}
                    ></candidate-setup-view>
                `;

            case 'customize':
                return html`
                    <customize-view
                        .selectedProfile=${this.selectedProfile}
                        .selectedLanguage=${this.selectedLanguage}
                        .selectedScreenshotInterval=${this.selectedScreenshotInterval}
                        .selectedImageQuality=${this.selectedImageQuality}
                        .layoutMode=${this.layoutMode}
                        .advancedMode=${this.advancedMode}
                        .onProfileChange=${profile => this.handleProfileChange(profile)}
                        .onLanguageChange=${language => this.handleLanguageChange(language)}
                        .onScreenshotIntervalChange=${interval => this.handleScreenshotIntervalChange(interval)}
                        .onImageQualityChange=${quality => this.handleImageQualityChange(quality)}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                        .onAdvancedModeChange=${advancedMode => this.handleAdvancedModeChange(advancedMode)}
                    ></customize-view>
                `;

            case 'help':
                return html` <help-view .onExternalLinkClick=${url => this.handleExternalLinkClick(url)}></help-view> `;

            case 'history':
                return html` <history-view></history-view> `;

            case 'advanced':
                return html` <advanced-view></advanced-view> `;

            case 'assistant':
                return html`
                    <assistant-view
                        .responses=${this.responses}
                        .currentResponseIndex=${this.currentResponseIndex}
                        .selectedProfile=${this.selectedProfile}
                        .onSendText=${message => this.handleSendText(message)}
                        .shouldAnimateResponse=${this.shouldAnimateResponse}
                        @response-index-changed=${this.handleResponseIndexChanged}
                        @response-animation-complete=${() => {
                            this.shouldAnimateResponse = false;
                            this._currentResponseIsComplete = true;
                            console.log('[response-animation-complete] Marked current response as complete');
                            this.requestUpdate();
                        }}
                        @interview-ended=${this.handleInterviewEnded}
                    ></assistant-view>
                `;

            default:
                return html`<div>Unknown view: ${this.currentView}</div>`;
        }
    }

    render() {
        const mainContentClass = `main-content ${
            this.currentView === 'assistant' ? 'assistant-view' : this.currentView === 'onboarding' ? 'onboarding-view' : 'with-border'
        }`;

        return html`
            <div class="window-container">
                <div class="container">
                    <app-header
                        .currentView=${this.currentView}
                        .statusText=${this.statusText}
                        .startTime=${this.startTime}
                        .advancedMode=${this.advancedMode}
                        .onCustomizeClick=${() => this.handleCustomizeClick()}
                        .onHelpClick=${() => this.handleHelpClick()}
                        .onHistoryClick=${() => this.handleHistoryClick()}
                        .onAdvancedClick=${() => this.handleAdvancedClick()}
                        .onCloseClick=${() => this.handleClose()}
                        .onBackClick=${() => this.handleBackClick()}
                        .onHideToggleClick=${() => this.handleHideToggle()}
                        ?isClickThrough=${this._isClickThrough}
                    ></app-header>
                    <div class="${mainContentClass}">
                        <div class="view-container">${this.renderCurrentView()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLayoutMode() {
        // Apply or remove compact layout class to document root
        if (this.layoutMode === 'compact') {
            document.documentElement.classList.add('compact-layout');
        } else {
            document.documentElement.classList.remove('compact-layout');
        }
    }

    async handleLayoutModeChange(layoutMode) {
        this.layoutMode = layoutMode;
        localStorage.setItem('layoutMode', layoutMode);
        this.updateLayoutMode();

        // Notify main process about layout change for window resizing
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('update-sizes');
            } catch (error) {
                console.error('Failed to update sizes in main process:', error);
            }
        }

        this.requestUpdate();
    }
}

customElements.define('truhire-app', TruHireApp);
