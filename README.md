# TrueHire

**TrueHire** is an AI-powered candidate verification and analysis platform designed for recruiters. It leverages advanced AI (Google Gemini) to cross-verify candidate claims across resumes and GitHub profiles, detect red flags, and generate structured credibility scores. The goal is to streamline the hiring process by providing fast, reliable, and automated candidate authenticity checks.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technical Architecture](#technical-architecture)
- [Problem Statement](#problem-statement)
- [CodeSetu Philosophy](#codesetu-philosophy)
- [Getting Started](#getting-started)
- [Prompt Engineering & AI Integration](#prompt-engineering--ai-integration)
- [Improvement Recommendations](#improvement-recommendations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Recruiters face increasing challenges due to fraudulent resumes, inflated claims, and misrepresented timelines. Traditional background checks are slow and expensive. **TrueHire** provides a real-time, AI-driven solution to verify candidate integrity by analyzing multiple data sources and generating actionable credibility insights.

---

## Features

- **Multi-Source Input**: Accepts candidate LinkedIn resume, regular resume/CV, and GitHub username.
- **Cross-Verification**: Checks for consistency across resumes and GitHub activity.
- **AI-Powered Analysis**: Uses Google Gemini LLM for deep semantic analysis.
- **Red Flag Detection**: Identifies suspicious projects, fake claims, and timeline mismatches.
- **Credibility Scoring**: Summarizes findings into a structured credibility score with reasoning.
- **Real-Time Feedback**: Streams insights back to the recruiter UI in real-time.
- **Scalable & Fast**: Built for quick analysis of multiple candidates.
- **User-Friendly UI**: Electron + React-based desktop experience.

---

## How It Works

### 1. Recruiter Inputs

- **LinkedIn Resume**: PDF, DOC, DOCX, or TXT file.
- **Regular Resume/CV**: PDF, DOC, DOCX, or TXT file.
- **GitHub Username**: For fetching public contributions and repositories.

### 2. File Processing

- Files are read from disk and converted to a unified, base64-encoded format.
- All files are prepared for AI backend consumption.

### 3. AI Analysis Pipeline

- Backend sends the formatted files and prompts to Google Gemini for analysis.
- Gemini analyzes the data and returns:
  - **Authenticity Verification**: Are resume claims backed by GitHub activity?
  - **Red Flags**: Inconsistencies, suspicious projects, timeline gaps, etc.
  - **Credibility Score**: Quantitative and qualitative assessment.

### 4. Real-Time Results

- Responses are streamed to the React/Electron UI using Electron’s `ipcRenderer` and `ipcMain` channels.
- Recruiters receive live insights and can act immediately.

---

## Technical Architecture

```
[Recruiter UI (Electron + Lit(React))]
        ↕
[Electron ipcRenderer/ipcMain Channels]
        ↕
[Google Gemini LLM API]
```

- **Frontend**: Electron-based desktop UI with React for seamless file selection/upload and real-time messaging.
- **Backend**: Handles file reading, encoding, prompt engineering, and communicates with Gemini.
- **AI Layer**: Google Gemini processes prompts and returns structured analysis.
- **Streaming**: Results are streamed back in real time for interactive feedback.

---

## Problem Statement

Modern hiring is plagued by candidate fraud—fake resumes, embellished project claims, and misrepresented work histories. **TrueHire** addresses this by:

- Automating cross-verification between resumes and public GitHub activity.
- Generating instant credibility assessments and red flag alerts.
- Enabling recruiters to focus on authentic, high-potential candidates.

---

## CodeSetu Philosophy

**CodeSetu** is about building bridges—integrating multiple data sources, technologies, and AI models to solve complex real-world problems. This project exemplifies the CodeSetu approach by:

- Seamlessly connecting resume data, LinkedIn exports, and GitHub contributions.
- Engineering prompts that extract deep semantic meaning from diverse inputs.
- Creating a unified, interactive experience that makes AI insights actionable for recruiters.

---

## Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/yashankkothari/TruHire.git
    cd TruHire
    ```

2. **Install dependencies**

    ```bash
    # For backend and frontend
    npm install
    ```

3. **Start the application**

    ```bash
    # Start Electron + React app
    npm start
    ```

4. **Configuration**

    - Set up your Google Gemini API credentials in the backend config (see `backend/config.js` or `.env`).
    - Ensure Electron has access to the appropriate files and directories for reading resumes.

5. **Usage**

    - Launch the desktop app.
    - Upload the candidate’s LinkedIn resume, regular resume, and enter GitHub username.
    - View real-time analysis, credibility scores, and red flag alerts.

---

## Prompt Engineering & AI Integration

- **Multi-File, Multi-Source Analysis**: Prompts are designed to instruct Gemini to perform cross-source verification, not just text analysis.
- **Structured Output**: Prompts request structured responses (e.g., JSON with scores, timelines, anomalies).
- **Red Flag Detection**: Prompts specifically ask for subtle inconsistencies and timeline mismatches.
- **Optimization**: Prompts are iteratively refined for accuracy, speed, and actionable insights.

---

## Improvement Recommendations

### For Prompt Engineering & Analysis

- **Use Structured Prompts**: Always request Gemini to return JSON objects with fields such as `credibility_score`, `timeline_anomalies`, and `red_flags`.
- **Contextual Analysis**: Ask Gemini to compare project dates, roles, and skills across resumes and GitHub.
- **Subtle Inconsistency Detection**: Instruct Gemini to flag skills or projects with no supporting GitHub evidence.

### For Performance & Scalability

- **Batch Processing**: Process multiple candidates in parallel using queueing systems.
- **Incremental Streaming**: Use Gemini’s streaming API to display partial results as soon as they arrive.
- **File Pre-Processing**: Compress and clean files before sending to Gemini to reduce latency.

### For User Experience

- **Interactive Dashboards**: Visualize credibility scores, timeline charts, and red flags.
- **Real-Time Updates**: Show live status while Gemini is processing.
- **Explainability**: Provide clear explanations for each red flag or score deduction.
- **Bulk Analysis**: Allow recruiters to upload and analyze multiple candidates at once.

---

## Contributing

We welcome contributions! Please open issues or submit pull requests for new features, improvements, or bug fixes.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Contact

For questions or collaboration, please open an issue on GitHub.

---

**TrueHire** — Building trust in hiring with AI, the CodeSetu way.
