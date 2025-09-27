import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class CandidateSetupView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            height: 100%;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .title {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-color);
            text-align: center;
        }

        .subtitle {
            font-size: 16px;
            color: var(--placeholder-color);
            text-align: center;
            margin-bottom: 40px;
            line-height: 1.5;
        }

        .form-section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-color);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-icon {
            width: 20px;
            height: 20px;
            opacity: 0.7;
        }

        .input-group {
            margin-bottom: 16px;
        }

        .input-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
            color: var(--text-color);
        }

        input, textarea {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 12px 16px;
            width: 100%;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
            font-family: inherit;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 3px var(--focus-box-shadow);
            background: var(--input-focus-background);
        }

        input::placeholder, textarea::placeholder {
            color: var(--placeholder-color);
        }

        textarea {
            resize: vertical;
            min-height: 80px;
            max-height: 200px;
        }

        .file-upload {
            border: 2px dashed var(--button-border);
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            transition: border-color 0.2s ease, background-color 0.2s ease;
            cursor: pointer;
            position: relative;
        }

        .file-upload:hover {
            border-color: var(--focus-border-color);
            background: var(--hover-background);
        }

        .file-upload.dragover {
            border-color: var(--focus-border-color);
            background: var(--focus-box-shadow);
        }

        .file-upload input[type="file"] {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            border: none;
            padding: 0;
        }

        .upload-icon {
            width: 32px;
            height: 32px;
            margin: 0 auto 12px;
            opacity: 0.6;
        }

        .upload-text {
            font-size: 14px;
            color: var(--text-color);
            margin-bottom: 4px;
        }

        .upload-hint {
            font-size: 12px;
            color: var(--placeholder-color);
        }

        .file-info {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--hover-background);
            border-radius: 6px;
            margin-top: 8px;
        }

        .file-name {
            flex: 1;
            font-size: 14px;
            color: var(--text-color);
        }

        .remove-file {
            background: none;
            border: none;
            color: var(--placeholder-color);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }

        .remove-file:hover {
            background: var(--button-background);
            color: var(--text-color);
        }

        .analysis-status {
            margin-top: 16px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            display: none;
        }

        .analysis-status.analyzing {
            display: block;
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #60a5fa;
        }

        .analysis-status.success {
            display: block;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #4ade80;
        }

        .analysis-status.error {
            display: block;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
        }

        .buttons {
            display: flex;
            gap: 12px;
            margin-top: auto;
            padding-top: 20px;
        }

        .button {
            flex: 1;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid var(--button-border);
            background: var(--button-background);
            color: var(--text-color);
        }

        .button:hover {
            background: var(--hover-background);
        }

        .button.primary {
            background: var(--focus-border-color);
            color: white;
            border-color: var(--focus-border-color);
        }

        .button.primary:hover {
            opacity: 0.9;
        }

        .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .required {
            color: #f87171;
        }

        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    static properties = {
        candidateName: { type: String },
        candidateEmail: { type: String },
        candidateRole: { type: String },
        interviewerRequirements: { type: String },
        githubUrl: { type: String },
        resumeFile: { type: Object },
        isAnalyzing: { type: Boolean },
        analysisStatus: { type: String },
        analysisMessage: { type: String },
        onBack: { type: Function },
        onStartInterview: { type: Function },
    };

    constructor() {
        super();
        this.candidateName = '';
        this.candidateEmail = '';
        this.candidateRole = '';
        this.interviewerRequirements = '';
        this.githubUrl = '';
        this.resumeFile = null;
        this.isAnalyzing = false;
        this.analysisStatus = '';
        this.analysisMessage = '';
        this.onBack = () => {};
        this.onStartInterview = () => {};
    }

    handleInputChange(property, event) {
        this[property] = event.target.value;
        this.requestUpdate();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                this.showAnalysisStatus('error', 'Please upload a PDF or Word document');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                this.showAnalysisStatus('error', 'File size must be less than 5MB');
                return;
            }

            this.resumeFile = file;
            this.requestUpdate();
        }
    }

    handleFileDrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            // Create a fake event to reuse the upload logic
            const fakeEvent = { target: { files: [file] } };
            this.handleFileUpload(fakeEvent);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
    }

    removeFile() {
        this.resumeFile = null;
        this.requestUpdate();
    }

    showAnalysisStatus(status, message) {
        this.analysisStatus = status;
        this.analysisMessage = message;
        this.requestUpdate();

        if (status !== 'analyzing') {
            setTimeout(() => {
                this.analysisStatus = '';
                this.analysisMessage = '';
                this.requestUpdate();
            }, 3000);
        }
    }

    async analyzeCandidate() {
        if (!this.githubUrl.trim() && !this.resumeFile) {
            this.showAnalysisStatus('error', 'Please provide either a GitHub URL or resume');
            return;
        }

        this.isAnalyzing = true;
        this.showAnalysisStatus('analyzing', 'Analyzing candidate profile...');

        try {
            const analysisData = {};

            // Analyze GitHub profile if provided
            if (this.githubUrl.trim()) {
                console.log('Analyzing GitHub profile:', this.githubUrl);
                
                // Use the GitHub analyzer
                if (window.GitHubAnalyzer) {
                    analysisData.github = await window.GitHubAnalyzer.analyzeGitHubProfile(this.githubUrl);
                } else {
                    throw new Error('GitHub analyzer not loaded');
                }
            }

            // Analyze resume if provided
            if (this.resumeFile) {
                console.log('Analyzing resume:', this.resumeFile.name);
                this.showAnalysisStatus('analyzing', 'Parsing resume content...');
                
                try {
                    // Convert file to ArrayBuffer for parsing
                    const arrayBuffer = await this.resumeFile.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    
                    // Send to main process for parsing with API key for AI enhancement
                    const { ipcRenderer } = window.require('electron');
                    const apiKey = localStorage.getItem('apiKey');
                    const parseResult = await ipcRenderer.invoke('parse-resume', uint8Array, apiKey);
                    
                    if (parseResult.success) {
                        console.log('Resume parsed successfully:', parseResult.data);
                        analysisData.resume = {
                            fileName: this.resumeFile.name,
                            fileSize: this.resumeFile.size,
                            fileType: this.resumeFile.type,
                            parsedData: parseResult.data
                        };
                        this.showAnalysisStatus('success', 'Resume parsed successfully!');
                    } else {
                        console.error('Resume parsing failed:', parseResult.error);
                        analysisData.resume = {
                            fileName: this.resumeFile.name,
                            fileSize: this.resumeFile.size,
                            fileType: this.resumeFile.type,
                            error: parseResult.error
                        };
                        this.showAnalysisStatus('warning', 'Resume uploaded but parsing failed');
                    }
                } catch (error) {
                    console.error('Error processing resume:', error);
                    analysisData.resume = {
                        fileName: this.resumeFile.name,
                        fileSize: this.resumeFile.size,
                        fileType: this.resumeFile.type,
                        error: error.message
                    };
                    this.showAnalysisStatus('warning', 'Resume uploaded but processing failed');
                }
            }

            // Store analysis data for the interview session
            localStorage.setItem('candidateAnalysis', JSON.stringify({
                candidateInfo: {
                    name: this.candidateName,
                    email: this.candidateEmail,
                    role: this.candidateRole,
                    interviewerRequirements: this.interviewerRequirements,
                },
                analysis: analysisData,
                analyzedAt: new Date().toISOString(),
            }));

            this.showAnalysisStatus('success', 'Analysis complete! Ready to start interview.');
            
            // Auto-start interview after a short delay
            setTimeout(() => {
                this.startInterview();
            }, 1500);

        } catch (error) {
            console.error('Error analyzing candidate:', error);
            this.showAnalysisStatus('error', `Analysis failed: ${error.message}`);
        } finally {
            this.isAnalyzing = false;
        }
    }

    startInterview() {
        this.onStartInterview({
            candidateInfo: {
                name: this.candidateName,
                email: this.candidateEmail,
                role: this.candidateRole,
                interviewerRequirements: this.interviewerRequirements,
            },
            githubUrl: this.githubUrl,
            resumeFile: this.resumeFile,
        });
    }

    isFormValid() {
        return this.candidateName.trim() && 
               (this.githubUrl.trim() || this.resumeFile);
    }

    render() {
        return html`
            <div class="container">
                <div class="title">Candidate Setup</div>
                <div class="subtitle">
                    Provide candidate information and GitHub profile or resume for AI-powered interview assistance.
                </div>

                <div class="form-section">
                    <div class="section-title">
                        <span>👤</span>
                        Candidate Information
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">
                            Full Name <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter candidate's full name"
                            .value=${this.candidateName}
                            @input=${(e) => this.handleInputChange('candidateName', e)}
                        />
                    </div>

                    <div class="input-group">
                        <label class="input-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="candidate@example.com"
                            .value=${this.candidateEmail}
                            @input=${(e) => this.handleInputChange('candidateEmail', e)}
                        />
                    </div>

                    <div class="input-group">
                        <label class="input-label">Role/Position</label>
                        <input
                            type="text"
                            placeholder="e.g., Senior Frontend Developer"
                            .value=${this.candidateRole}
                            @input=${(e) => this.handleInputChange('candidateRole', e)}
                        />
                    </div>

                    <div class="input-group">
                        <label class="input-label">Interviewer Requirements</label>
                        <textarea
                            placeholder="Specify your requirements for this interview (e.g., focus on React, system design, problem-solving skills, leadership experience, etc.)"
                            .value=${this.interviewerRequirements}
                            @input=${(e) => this.handleInputChange('interviewerRequirements', e)}
                        ></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <div class="section-title">
                        <span>🔗</span>
                        GitHub Profile
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">GitHub URL or Username</label>
                        <input
                            type="text"
                            placeholder="https://github.com/username or just username"
                            .value=${this.githubUrl}
                            @input=${(e) => this.handleInputChange('githubUrl', e)}
                        />
                    </div>
                </div>

                <div class="form-section">
                    <div class="section-title">
                        <span>📄</span>
                        Resume Upload
                    </div>
                    
                    ${this.resumeFile ? html`
                        <div class="file-info">
                            <span class="file-name">${this.resumeFile.name}</span>
                            <button class="remove-file" @click=${this.removeFile}>✕</button>
                        </div>
                    ` : html`
                        <div class="file-upload"
                             @dragover=${this.handleDragOver}
                             @dragleave=${this.handleDragLeave}
                             @drop=${this.handleFileDrop}>
                            <input type="file" 
                                   accept=".pdf,.doc,.docx" 
                                   @change=${this.handleFileUpload} />
                            <div class="upload-icon">📄</div>
                            <div class="upload-text">Drop resume here or click to browse</div>
                            <div class="upload-hint">PDF, DOC, or DOCX files up to 5MB</div>
                        </div>
                    `}
                </div>

                <div class="analysis-status ${this.analysisStatus}">
                    ${this.analysisStatus === 'analyzing' ? html`
                        <span class="loading-spinner"></span>
                    ` : ''}
                    ${this.analysisMessage}
                </div>

                <div class="buttons">
                    <button class="button" @click=${this.onBack} ?disabled=${this.isAnalyzing}>
                        Back
                    </button>
                    <button class="button primary" 
                            @click=${this.analyzeCandidate} 
                            ?disabled=${!this.isFormValid() || this.isAnalyzing}>
                        ${this.isAnalyzing ? html`
                            <span class="loading-spinner"></span>
                            Analyzing...
                        ` : 'Analyze & Start Interview'}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('candidate-setup-view', CandidateSetupView);
