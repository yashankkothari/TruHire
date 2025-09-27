import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AssistantView extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            display: flex;
            flex-direction: row;
            gap: 6px;
            min-width: 100%;
            width: 100%;
            overflow-x: auto;
        }

        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
        }

        .transcript-panel {
            width: var(--transcript-width, 280px);
            min-width: 220px;
            max-width: 25vw;
            background: var(--main-content-background);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            resize: horizontal;
            position: relative;
        }

        .main-panel {
            flex: 2;
            display: flex;
            flex-direction: column;
            min-width: 350px;
            background: var(--main-content-background);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            margin: 0 6px;
            overflow: hidden;
        }

        .analysis-panel {
            width: var(--analysis-width, 320px);
            min-width: 250px;
            max-width: 25vw;
            background: var(--main-content-background);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            resize: horizontal;
            position: relative;
        }

        .resume-highlights-panel {
            width: var(--resume-highlights-width, 280px);
            min-width: 220px;
            max-width: 22vw;
            background: var(--main-content-background);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            resize: horizontal;
            position: relative;
        }

        .interview-questions-panel {
            width: var(--interview-questions-width, 280px);
            min-width: 280px;
            max-width: 350px;
            background: var(--main-content-background);
            border-radius: 10px;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
        }

        .resize-handle {
            position: absolute;
            top: 0;
            right: -6px;
            width: 12px;
            height: 100%;
            cursor: col-resize;
            background: transparent;
            z-index: 10;
        }

        .resize-handle:hover {
            background: rgba(59, 130, 246, 0.2);
        }

        .resize-handle:active {
            background: rgba(59, 130, 246, 0.4);
        }

        .response-container {
            height: calc(100% - 60px);
            overflow-y: auto;
            border-radius: 10px;
            font-size: var(--response-font-size, 18px);
            line-height: 1.6;
            background: var(--main-content-background);
            padding: 16px;
            scroll-behavior: smooth;
            user-select: text;
            cursor: text;
        }

        /* Allow text selection for all content within the response container */
        .response-container * {
            user-select: text;
            cursor: text;
        }

        /* Restore default cursor for interactive elements */
        .response-container a {
            cursor: pointer;
        }

        /* Animated word-by-word reveal */
        .response-container [data-word] {
            opacity: 0;
            filter: blur(10px);
            display: inline-block;
            transition: opacity 0.5s, filter 0.5s;
        }
        .response-container [data-word].visible {
            opacity: 1;
            filter: blur(0px);
        }

        /* Markdown styling */
        .response-container h1,
        .response-container h2,
        .response-container h3,
        .response-container h4,
        .response-container h5,
        .response-container h6 {
            margin: 1.2em 0 0.6em 0;
            color: var(--text-color);
            font-weight: 600;
        }

        .response-container h1 {
            font-size: 1.8em;
        }
        .response-container h2 {
            font-size: 1.5em;
        }
        .response-container h3 {
            font-size: 1.3em;
        }
        .response-container h4 {
            font-size: 1.1em;
        }
        .response-container h5 {
            font-size: 1em;
        }
        .response-container h6 {
            font-size: 0.9em;
        }

        .response-container p {
            margin: 0.8em 0;
            color: var(--text-color);
        }

        .response-container ul,
        .response-container ol {
            margin: 0.8em 0;
            padding-left: 2em;
            color: var(--text-color);
        }

        .response-container li {
            margin: 0.4em 0;
        }

        .response-container blockquote {
            margin: 1em 0;
            padding: 0.5em 1em;
            border-left: 4px solid var(--focus-border-color);
            background: rgba(0, 122, 255, 0.1);
            font-style: italic;
        }

        .response-container code {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.85em;
        }

        .response-container pre {
            background: var(--input-background);
            border: 1px solid var(--button-border);
            border-radius: 6px;
            padding: 1em;
            overflow-x: auto;
            margin: 1em 0;
        }

        .response-container pre code {
            background: none;
            padding: 0;
            border-radius: 0;
        }

        .response-container a {
            color: var(--link-color);
            text-decoration: none;
        }

        .response-container a:hover {
            text-decoration: underline;
        }

        .response-container strong,
        .response-container b {
            font-weight: 600;
            color: var(--text-color);
        }

        .response-container em,
        .response-container i {
            font-style: italic;
        }

        .response-container hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 2em 0;
        }

        .response-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }

        .response-container th,
        .response-container td {
            border: 1px solid var(--border-color);
            padding: 0.5em;
            text-align: left;
        }

        .response-container th {
            background: var(--input-background);
            font-weight: 600;
        }

        /* Hide scrollbars for all scrollable containers */
        .response-container::-webkit-scrollbar,
        .analysis-content::-webkit-scrollbar,
        .transcript-content::-webkit-scrollbar,
        .highlights-content::-webkit-scrollbar,
        .questions-content::-webkit-scrollbar,
        .questions-list::-webkit-scrollbar {
            display: none;
        }

        /* For Firefox */
        .response-container,
        .analysis-content,
        .transcript-content,
        .highlights-content,
        .questions-content,
        .questions-list {
            scrollbar-width: none;
        }

        .text-input-container {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            align-items: center;
        }

        .text-input-container input {
            flex: 1;
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 14px;
        }

        .text-input-container input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 3px var(--focus-box-shadow);
            background: var(--input-focus-background);
        }

        .text-input-container input::placeholder {
            color: var(--placeholder-color);
        }

        .text-input-container button {
            background: transparent;
            color: var(--start-button-background);
            border: none;
            padding: 0;
            border-radius: 100px;
        }

        .text-input-container button:hover {
            background: var(--text-input-button-hover);
        }

        .nav-button {
            background: transparent;
            color: white;
            border: none;
            padding: 4px;
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            width: 36px;
            height: 36px;
            justify-content: center;
        }

        .nav-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .nav-button:disabled {
            opacity: 0.3;
        }

        .nav-button svg {
            stroke: white !important;
        }

        .response-counter {
            font-size: 12px;
            color: var(--description-color);
            white-space: nowrap;
            min-width: 60px;
            text-align: center;
        }

        .save-button {
            background: transparent;
            color: var(--start-button-background);
            border: none;
            padding: 4px;
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            width: 36px;
            height: 36px;
            justify-content: center;
            cursor: pointer;
        }

        .save-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .save-button.saved {
            color: #4caf50;
        }

        .save-button svg {
            stroke: currentColor !important;
        }

        /* Analysis Panel Styles */
        .analysis-header {
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
            background: var(--header-background);
        }

        .analysis-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .analysis-subtitle {
            font-size: 12px;
            color: var(--placeholder-color);
            margin: 4px 0 0 0;
        }

        .analysis-content {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }

        .analysis-section {
            border-bottom: 1px solid var(--border-color);
        }

        .section-header {
            padding: 12px 16px;
            background: var(--button-background);
            font-size: 14px;
            font-weight: 500;
            color: var(--text-color);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-content {
            padding: 12px 16px;
        }

        .candidate-info {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
        }

        .info-label {
            color: var(--placeholder-color);
        }

        .info-value {
            color: var(--text-color);
            font-weight: 500;
        }

        .credibility-score {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
        }

        .credibility-score-enhanced {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .credibility-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            font-weight: 600;
        }

        .credibility-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        }

        .credibility-fill {
            height: 100%;
            transition: width 0.3s ease;
            border-radius: 3px;
        }

        .credibility-fill.high {
            background: linear-gradient(90deg, #10b981, #34d399);
        }

        .credibility-fill.medium {
            background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .credibility-fill.low {
            background: linear-gradient(90deg, #ef4444, #f87171);
        }

        .credibility-trend {
            font-size: 11px;
            text-align: center;
        }

        .trend-improving {
            color: #10b981;
        }

        .trend-declining {
            color: #ef4444;
        }

        .trend-stable {
            color: #6b7280;
        }

        .trend-text {
            color: #6b7280;
            font-style: italic;
        }

        .score-value {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
        }

        .score-value.high {
            color: #10b981;
        }

        .score-value.medium {
            color: #f59e0b;
        }

        .score-value.low {
            color: #ef4444;
        }

        .end-interview-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #dc2626, #ef4444);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
        }

        .end-interview-button:hover {
            background: linear-gradient(135deg, #b91c1c, #dc2626);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
        }

        .end-interview-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
        }

        .insights-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .insight-item {
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            line-height: 1.4;
            border-left: 3px solid;
        }

        .insight-contradiction {
            background: rgba(239, 68, 68, 0.1);
            border-left-color: #ef4444;
            color: #fecaca;
        }

        .insight-warning {
            background: rgba(245, 158, 11, 0.1);
            border-left-color: #f59e0b;
            color: #fde68a;
        }

        .insight-positive {
            background: rgba(34, 197, 94, 0.1);
            border-left-color: #22c55e;
            color: #bbf7d0;
        }

        .insight-header {
            font-weight: 600;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .insight-time {
            color: var(--placeholder-color);
            font-size: 10px;
            font-weight: normal;
        }

        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4ade80;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .mic-settings {
            padding: 12px;
            border-top: 1px solid var(--border-color);
            background: var(--card-background);
        }

        .mic-settings h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-color);
        }

        .mic-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .mic-option {
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid var(--border-color);
            background: var(--background-color);
        }

        .mic-option:hover {
            background: var(--hover-background);
        }

        .mic-option.selected {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .mic-option span {
            font-size: 12px;
        }

        .mic-note {
            margin: 8px 0 0 0;
            font-size: 10px;
            color: var(--placeholder-color);
            font-style: italic;
        }

        .stereo-mix-info {
            margin-top: 12px;
            padding: 8px;
            background: var(--background-color);
            border-radius: 4px;
            border: 1px solid var(--border-color);
        }

        .stereo-mix-info h5 {
            margin: 0 0 6px 0;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-color);
        }

        .stereo-mix-info ul {
            margin: 0;
            padding-left: 16px;
            font-size: 10px;
            color: var(--placeholder-color);
        }

        .stereo-mix-info li {
            margin-bottom: 2px;
        }

        .no-data {
            text-align: center;
            color: var(--placeholder-color);
            font-size: 12px;
            padding: 20px;
        }

        /* Transcript Panel Styles */
        .transcript-header {
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
            background: var(--header-background);
        }

        .transcript-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .transcript-subtitle {
            font-size: 12px;
            color: var(--placeholder-color);
            margin: 4px 0 0 0;
        }

        .transcript-content {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .conversation-message {
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.4;
            max-width: 85%;
            word-wrap: break-word;
            position: relative;
        }

        .message-interviewer {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #dbeafe;
            align-self: flex-start;
            margin-left: 0;
        }

        .message-candidate {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #dcfce7;
            align-self: flex-end;
            margin-right: 0;
        }

        .message-system {
            background: rgba(156, 163, 175, 0.1);
            border: 1px solid rgba(156, 163, 175, 0.3);
            color: #f3f4f6;
            align-self: center;
            text-align: center;
            font-style: italic;
            font-size: 11px;
            max-width: 100%;
        }

        .message-header {
            font-weight: 600;
            font-size: 11px;
            margin-bottom: 2px;
            opacity: 0.8;
        }

        .message-time {
            font-size: 10px;
            opacity: 0.6;
            position: absolute;
            bottom: 2px;
            right: 6px;
        }

        .message-live {
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .transcript-controls {
            padding: 8px 12px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .control-button {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .control-button:hover {
            background: var(--hover-background);
        }

        .control-button.active {
            background: var(--focus-border-color);
            color: white;
        }

        .recording-indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ef4444;
            animation: pulse 1.5s infinite;
        }

        .recording-indicator.listening {
            background: #22c55e;
        }

        /* Resume Analysis Styles */
        .resume-subsection {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .resume-subsection:last-child {
            border-bottom: none;
        }

        .subsection-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 8px;
        }

        .skills-grid {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .skill-category {
            font-size: 11px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .skill-label {
            color: var(--placeholder-color);
            font-weight: 500;
        }

        .skill-items {
            color: var(--text-color);
            font-size: 10px;
        }

        .experience-item {
            margin-bottom: 8px;
            padding: 6px 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .experience-header {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .experience-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-color);
        }

        .experience-company {
            font-size: 10px;
            color: var(--placeholder-color);
        }

        .experience-duration {
            font-size: 9px;
            color: var(--placeholder-color);
            margin-top: 2px;
        }

        .education-item {
            margin-bottom: 6px;
            padding: 4px 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .education-degree {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-color);
        }

        .education-institution {
            font-size: 10px;
            color: var(--placeholder-color);
        }

        .education-year {
            font-size: 9px;
            color: var(--placeholder-color);
        }

        .project-item {
            margin-bottom: 6px;
            padding: 4px 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .project-name {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-color);
        }

        .project-description {
            font-size: 10px;
            color: var(--placeholder-color);
            margin-top: 2px;
            line-height: 1.3;
        }

        /* Resume Highlights Panel Styles */
        .highlights-header {
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
            background: var(--header-background);
        }

        .highlights-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .highlights-subtitle {
            font-size: 12px;
            color: var(--placeholder-color);
            margin: 4px 0 0 0;
        }

        .highlights-content {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }

        .highlight-section {
            border-bottom: 1px solid var(--border-color);
        }

        .highlight-section:last-child {
            border-bottom: none;
        }

        .highlight-header {
            padding: 12px 16px;
            background: var(--button-background);
            font-size: 14px;
            font-weight: 500;
            color: var(--text-color);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .highlight-content {
            padding: 12px 16px;
        }

        .highlight-item {
            margin-bottom: 12px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            border-left: 3px solid var(--primary-color);
        }

        .highlight-item:last-child {
            margin-bottom: 0;
        }

        .highlight-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 4px;
        }

        .highlight-subtitle {
            font-size: 11px;
            color: var(--placeholder-color);
            margin-bottom: 2px;
        }

        .highlight-description {
            font-size: 10px;
            color: var(--text-color);
            line-height: 1.4;
            opacity: 0.8;
        }

        .highlight-meta {
            font-size: 9px;
            color: var(--placeholder-color);
            margin-top: 4px;
            font-style: italic;
        }

        .skills-highlight {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 6px;
        }

        .skill-tag {
            background: var(--primary-color);
            color: white;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
        }

        .achievement-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            margin-top: 4px;
        }

        /* Interview Questions Panel Styles */
        .questions-list {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .question-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px;
            margin-bottom: 12px;
            background: var(--hover-background);
            border-radius: 8px;
            border: 1px solid var(--border-color);
            transition: all 0.2s ease;
        }

        .question-item:hover {
            background: var(--focus-box-shadow);
        }

        .question-item.completed {
            opacity: 0.6;
            background: var(--success-background, rgba(34, 197, 94, 0.1));
        }

        .question-checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid var(--border-color);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s ease;
        }

        .question-checkbox:hover {
            border-color: var(--focus-border-color);
        }

        .question-checkbox.checked {
            background: var(--focus-border-color);
            border-color: var(--focus-border-color);
        }

        .question-checkbox.checked::after {
            content: '✓';
            color: white;
            font-size: 12px;
            font-weight: bold;
        }

        .question-content {
            flex: 1;
        }

        .question-text {
            font-size: 14px;
            line-height: 1.4;
            color: var(--text-color);
            margin-bottom: 6px;
        }

        .question-meta {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .question-tag {
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 12px;
            background: var(--button-background);
            color: var(--placeholder-color);
            border: 1px solid var(--border-color);
        }

        .question-tag.technical {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border-color: rgba(59, 130, 246, 0.3);
        }

        .question-tag.behavioral {
            background: rgba(168, 85, 247, 0.1);
            color: #a78bfa;
            border-color: rgba(168, 85, 247, 0.3);
        }

        .question-tag.system-design {
            background: rgba(245, 158, 11, 0.1);
            color: #fbbf24;
            border-color: rgba(245, 158, 11, 0.3);
        }

        .question-tag.practical {
            background: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            border-color: rgba(34, 197, 94, 0.3);
        }

        .questions-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 12px;
            padding: 40px 20px;
            color: var(--placeholder-color);
        }

        .questions-error {
            padding: 20px;
            text-align: center;
            color: #f87171;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            margin: 16px;
        }

        .questions-empty {
            padding: 40px 20px;
            text-align: center;
            color: var(--placeholder-color);
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .regenerate-button {
            background: var(--button-background);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .regenerate-button:hover {
            background: var(--hover-background);
            border-color: var(--focus-border-color);
        }

        .panel-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            background: var(--panel-header-background);
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            flex-shrink: 0;
        }
    `;

    static properties = {
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedProfile: { type: String },
        onSendText: { type: Function },
        shouldAnimateResponse: { type: Boolean },
        savedResponses: { type: Array },
        candidateData: { type: Object },
        liveInsights: { type: Array },
        credibilityScore: { type: Number },
        inconsistenciesCount: { type: Number },
        transcriptMessages: { type: Array },
        isRecording: { type: Boolean },
        speakerDiarization: { type: Boolean },
        transcriptWidth: { type: Number },
        analysisWidth: { type: Number },
        showMicSettings: { type: Boolean },
        availableMicrophones: { type: Array },
        selectedMicrophoneId: { type: String },
        resumeHighlightsWidth: { type: Number },
        interviewQuestionsWidth: { type: Number },
        interviewQuestions: { type: Array },
        questionsLoading: { type: Boolean },
        questionsError: { type: String },
    };

    constructor() {
        super();
        this.responses = [];
        this.currentResponseIndex = -1;
        this.selectedProfile = 'interview';
        this.onSendText = () => {};
        this._lastAnimatedWordCount = 0;
        
        // Load saved responses from localStorage
        try {
            this.savedResponses = JSON.parse(localStorage.getItem('savedResponses') || '[]');
        } catch (e) {
            this.savedResponses = [];
        }
        
        // Initialize analysis data
        this.candidateData = null;
        this.liveInsights = [];
        this.credibilityScore = 75; // Start at 75 to allow for both improvement and decline
        this.inconsistenciesCount = 0;
        this.credibilityHistory = [];
        this.flaggedContradictions = new Set(); // Track already flagged contradictions
        
        // Initialize transcript data
        this.transcriptMessages = [];
        this.isRecording = false;
        this.speakerDiarization = true;
        
        // Initialize panel sizes
        this.transcriptWidth = 280;
        this.analysisWidth = 320;
        this.resumeHighlightsWidth = 280;
        this.interviewQuestionsWidth = 280;
        this.interviewQuestions = [];
        this.questionsLoading = false;
        this.questionsError = '';
        this.showMicSettings = false;
        this.availableMicrophones = [];
        this.selectedMicrophoneId = localStorage.getItem('selectedMicrophoneId') || 'default';
        
        // Load candidate data if available
        this.loadCandidateData();
        
        // Load existing interview questions
        this.loadInterviewQuestions();
        
        // Set up audio transcription listeners
        this.setupTranscriptionListeners();
        
        // Load available microphones
        this.loadAvailableMicrophones();
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            exam: 'Exam Assistant',
        };
    }

    getCurrentResponse() {
        const profileNames = this.getProfileNames();
        return this.responses.length > 0 && this.currentResponseIndex >= 0
            ? this.responses[this.currentResponseIndex]
            : `Hey, Im listening to your ${profileNames[this.selectedProfile] || 'session'}?`;
    }

    renderMarkdown(content) {
        // Check if marked is available
        if (typeof window !== 'undefined' && window.marked) {
            try {
                // Configure marked for better security and formatting
                window.marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false, // We trust the AI responses
                });
                let rendered = window.marked.parse(content);
                rendered = this.wrapWordsInSpans(rendered);
                return rendered;
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return content; // Fallback to plain text
            }
        }
        console.log('Marked not available, using plain text');
        return content; // Fallback if marked is not available
    }

    wrapWordsInSpans(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tagsToSkip = ['PRE'];

        function wrap(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !tagsToSkip.includes(node.parentNode.tagName)) {
                const words = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.setAttribute('data-word', '');
                        span.textContent = word;
                        frag.appendChild(span);
                    } else {
                        frag.appendChild(document.createTextNode(word));
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !tagsToSkip.includes(node.tagName)) {
                Array.from(node.childNodes).forEach(wrap);
            }
        }
        Array.from(doc.body.childNodes).forEach(wrap);
        return doc.body.innerHTML;
    }

    getResponseCounter() {
        return this.responses.length > 0 ? `${this.currentResponseIndex + 1}/${this.responses.length}` : '';
    }

    navigateToPreviousResponse() {
        if (this.currentResponseIndex > 0) {
            this.currentResponseIndex--;
            this.dispatchEvent(
                new CustomEvent('response-index-changed', {
                    detail: { index: this.currentResponseIndex },
                })
            );
            this.requestUpdate();
        }
    }

    navigateToNextResponse() {
        if (this.currentResponseIndex < this.responses.length - 1) {
            this.currentResponseIndex++;
            this.dispatchEvent(
                new CustomEvent('response-index-changed', {
                    detail: { index: this.currentResponseIndex },
                })
            );
            this.requestUpdate();
        }
    }

    scrollResponseUp() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3; // Scroll 30% of container height
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        }
    }

    scrollResponseDown() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3; // Scroll 30% of container height
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        }
    }

    loadFontSize() {
        const fontSize = localStorage.getItem('fontSize');
        if (fontSize !== null) {
            const fontSizeValue = parseInt(fontSize, 10) || 20;
            const root = document.documentElement;
            root.style.setProperty('--response-font-size', `${fontSizeValue}px`);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        // Load and apply font size
        this.loadFontSize();
        
        // Reset contradiction tracking for new interview
        this.flaggedContradictions = new Set();

        // Set up IPC listeners for keyboard shortcuts
        if (window.require) {
            const { ipcRenderer } = window.require('electron');

            this.handlePreviousResponse = () => {
                console.log('Received navigate-previous-response message');
                this.navigateToPreviousResponse();
            };

            this.handleNextResponse = () => {
                console.log('Received navigate-next-response message');
                this.navigateToNextResponse();
            };

            this.handleScrollUp = () => {
                console.log('Received scroll-response-up message');
                this.scrollResponseUp();
            };

            this.handleScrollDown = () => {
                console.log('Received scroll-response-down message');
                this.scrollResponseDown();
            };

            ipcRenderer.on('navigate-previous-response', this.handlePreviousResponse);
            ipcRenderer.on('navigate-next-response', this.handleNextResponse);
            ipcRenderer.on('scroll-response-up', this.handleScrollUp);
            ipcRenderer.on('scroll-response-down', this.handleScrollDown);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Clean up IPC listeners
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.handlePreviousResponse) {
                ipcRenderer.removeListener('navigate-previous-response', this.handlePreviousResponse);
            }
            if (this.handleNextResponse) {
                ipcRenderer.removeListener('navigate-next-response', this.handleNextResponse);
            }
            if (this.handleScrollUp) {
                ipcRenderer.removeListener('scroll-response-up', this.handleScrollUp);
            }
            if (this.handleScrollDown) {
                ipcRenderer.removeListener('scroll-response-down', this.handleScrollDown);
            }
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            textInput.value = ''; // Clear input
            await this.onSendText(message);
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.response-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    saveCurrentResponse() {
        const currentResponse = this.getCurrentResponse();
        if (currentResponse && !this.isResponseSaved()) {
            this.savedResponses = [
                ...this.savedResponses,
                {
                    response: currentResponse,
                    timestamp: new Date().toISOString(),
                    profile: this.selectedProfile,
                },
            ];
            // Save to localStorage for persistence
            localStorage.setItem('savedResponses', JSON.stringify(this.savedResponses));
            this.requestUpdate();
        }
    }

    isResponseSaved() {
        const currentResponse = this.getCurrentResponse();
        return this.savedResponses.some(saved => saved.response === currentResponse);
    }

    firstUpdated() {
        super.firstUpdated();
        this.updateResponseContent();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex')) {
            if (changedProperties.has('currentResponseIndex')) {
                this._lastAnimatedWordCount = 0;
            }
            this.updateResponseContent();
        }
    }

    updateResponseContent() {
        console.log('updateResponseContent called');
        const container = this.shadowRoot.querySelector('#responseContainer');
        if (container) {
            const currentResponse = this.getCurrentResponse();
            console.log('Current response:', currentResponse);
            const renderedResponse = this.renderMarkdown(currentResponse);
            console.log('Rendered response:', renderedResponse);
            container.innerHTML = renderedResponse;
            const words = container.querySelectorAll('[data-word]');
            if (this.shouldAnimateResponse) {
                for (let i = 0; i < this._lastAnimatedWordCount && i < words.length; i++) {
                    words[i].classList.add('visible');
                }
                for (let i = this._lastAnimatedWordCount; i < words.length; i++) {
                    words[i].classList.remove('visible');
                    setTimeout(() => {
                        words[i].classList.add('visible');
                        if (i === words.length - 1) {
                            this.dispatchEvent(new CustomEvent('response-animation-complete', { bubbles: true, composed: true }));
                        }
                    }, (i - this._lastAnimatedWordCount) * 100);
                }
                this._lastAnimatedWordCount = words.length;
            } else {
                words.forEach(word => word.classList.add('visible'));
                this._lastAnimatedWordCount = words.length;
            }
        } else {
            console.log('Response container not found');
        }
    }

    loadCandidateData() {
        try {
            const candidateAnalysis = JSON.parse(localStorage.getItem('candidateAnalysis') || '{}');
            const currentCandidate = JSON.parse(localStorage.getItem('currentCandidate') || '{}');
            
            if (candidateAnalysis.analysis || currentCandidate.candidateInfo) {
                this.candidateData = {
                    info: currentCandidate.candidateInfo || {},
                    analysis: candidateAnalysis.analysis || {},
                    resume: candidateAnalysis.analysis?.resume || null
                };
                
                // Debug logging for resume data
                console.log('AssistantView loaded candidate data:', {
                    hasAnalysis: !!candidateAnalysis.analysis,
                    hasResume: !!candidateAnalysis.analysis?.resume,
                    resumeParsedData: !!candidateAnalysis.analysis?.resume?.parsedData,
                    candidateData: this.candidateData
                });
                
                // Initialize with some baseline insights
                this.initializeBaselineInsights();
                
                // Generate questions if they don't exist
                if (this.interviewQuestions.length === 0 && !this.questionsLoading) {
                    setTimeout(() => this.generateInterviewQuestions(), 500);
                }
            }
        } catch (error) {
            console.error('Error loading candidate data:', error);
        }
    }

    initializeBaselineInsights() {
        const insights = [];
        
        // Add initial insights based on GitHub analysis
        if (this.candidateData?.analysis?.github) {
            const github = this.candidateData.analysis.github;
            
            if (github.activity.recentCommits === 0) {
                insights.push({
                    type: 'warning',
                    time: this.formatTime(new Date()),
                    header: 'LOW RECENT ACTIVITY',
                    content: `No commits in the past week. May indicate focus on private projects or current employment.`
                });
            }
            
            if (github.languageStats.length > 0) {
                const primaryLang = github.languageStats[0];
                insights.push({
                    type: 'positive',
                    time: this.formatTime(new Date()),
                    header: 'PRIMARY EXPERTISE',
                    content: `Strong ${primaryLang.language} background (${primaryLang.percentage.toFixed(1)}% of repositories).`
                });
            }
            
            if (github.activity.totalStars > 50) {
                insights.push({
                    type: 'positive',
                    time: this.formatTime(new Date()),
                    header: 'COMMUNITY RECOGNITION',
                    content: `Projects have received ${github.activity.totalStars} stars, indicating quality work.`
                });
            }
        }
        
        // Add initial insights based on resume analysis
        if (this.candidateData?.resume?.parsedData) {
            const resume = this.candidateData.resume.parsedData;
            
            // Experience level insight
            if (resume.summary?.estimatedExperienceLevel) {
                insights.push({
                    type: 'positive',
                    time: this.formatTime(new Date()),
                    header: 'EXPERIENCE LEVEL',
                    content: `Resume indicates ${resume.summary.estimatedExperienceLevel} level experience based on content analysis.`
                });
            }
            
            // Skills insight
            if (resume.skills?.all?.length > 0) {
                insights.push({
                    type: 'positive',
                    time: this.formatTime(new Date()),
                    header: 'TECHNICAL SKILLS',
                    content: `Resume lists ${resume.skills.all.length} technical skills including ${resume.skills.languages?.slice(0, 3).join(', ') || 'various technologies'}.`
                });
            }
            
            // Experience count insight
            if (resume.experience?.length > 0) {
                insights.push({
                    type: 'positive',
                    time: this.formatTime(new Date()),
                    header: 'WORK HISTORY',
                    content: `Resume shows ${resume.experience.length} work experience${resume.experience.length > 1 ? 's' : ''} with roles like ${resume.experience[0]?.title || 'various positions'}.`
                });
            }
            
            // Education insight
            if (resume.education?.length > 0) {
                insights.push({
                    type: 'positive',
                    time: this.formatTime(new Date()),
                    header: 'EDUCATION',
                    content: `Education includes ${resume.education[0]?.degree || 'degree'} from ${resume.education[0]?.institution || 'academic institution'}.`
                });
            }
        }
        
        this.liveInsights = insights;
    }

    analyzeResponse(response) {
        const lowerResponse = response.toLowerCase();
        
        // Comprehensive claim verification
        this.verifyAllClaims(response);
        
        // Check for contradictions with GitHub data
        if (this.candidateData?.analysis?.github) {
            this.checkForContradictions(lowerResponse, this.candidateData.analysis.github);
        }
        
        // Check for contradictions with resume data
        if (this.candidateData?.resume?.parsedData) {
            this.checkResumeContradictions(lowerResponse, this.candidateData.resume.parsedData);
        }
        
        // Update credibility score based on analysis
        this.updateCredibilityScore();
    }

    checkForContradictions(response, github) {
        
        // Check experience claims vs GitHub activity
        const lowerResponse = response.toLowerCase();
        const experienceClaims = ['senior', 'lead', 'architect', 'principal', 'staff', 'expert'];
        const hasExperienceClaim = experienceClaims.some(claim => lowerResponse.includes(claim));
        
        if (hasExperienceClaim) {
            const accountAge = Math.floor((Date.now() - new Date(github.userInfo.accountCreationDate).getTime()) / (1000 * 60 * 60 * 24 * 365));
            if (accountAge < 2) {
                this.addContradiction('experience-mismatch', 'high',
                    'EXPERIENCE MISMATCH',
                    `Claims senior role but GitHub account only ${accountAge} year(s) old.`);
            } else if (accountAge < 4 && github.activity.recentCommits < 5) {
                this.addContradiction('experience-mismatch', 'medium',
                    'LIMITED ACTIVITY',
                    `Claims experience but low recent activity (${github.activity.recentCommits} commits).`);
            }
        }
        
        // Check language expertise claims with more sophistication
        if (github.languageStats.length > 0) {
            const expertiseClaims = ['expert in', 'proficient in', 'specialized in', 'mastered', 'years of experience in'];
            
            github.languageStats.forEach(lang => {
                const langMention = lowerResponse.includes(lang.language.toLowerCase());
                const claimsExpertise = expertiseClaims.some(claim => 
                    lowerResponse.includes(claim + ' ' + lang.language.toLowerCase()) ||
                    lowerResponse.includes(lang.language.toLowerCase() + ' expert')
                );
                
                if (langMention && lang.percentage < 10) {
                    this.addContradiction('skill-contradiction', 'low',
                        'LIMITED EXPERIENCE',
                        `Mentions ${lang.language} but only ${lang.percentage.toFixed(1)}% of repositories use it.`);
                } else if (claimsExpertise && lang.percentage < 30) {
                    this.addContradiction('skill-contradiction', 'high',
                        'SKILL EXAGGERATION',
                        `Claims expertise in ${lang.language} but only ${lang.percentage.toFixed(1)}% usage.`);
                }
            });
        }
        
        // Check production system claims
        const productionClaims = ['production', 'scale', 'million users', 'enterprise', 'high traffic'];
        const hasProductionClaim = productionClaims.some(claim => lowerResponse.includes(claim));
        
        if (hasProductionClaim) {
            if (github.activity.totalStars < 10 && github.userInfo.publicRepos < 5) {
                this.addContradiction('false-claim', 'medium',
                    'SCALE CLAIM QUESTIONABLE',
                    'Claims production/scale experience but low community recognition and few repos.');
            }
        }
        
        // Check for technical inaccuracies
        const technicalErrors = this.detectTechnicalErrors(response);
        technicalErrors.forEach(error => {
            this.addContradiction('technical-error', 'medium',
                'TECHNICAL ERROR',
                error);
        });
        
        // Check for vague or evasive answers
        const vaguePatterns = [
            'i think', 'maybe', 'probably', 'not sure', 'i guess',
            'sort of', 'kind of', 'i believe', 'i suppose'
        ];
        const vagueCount = vaguePatterns.filter(pattern => lowerResponse.includes(pattern)).length;
        
        if (vagueCount > 2 && response.length < 100) {
            this.addContradiction('vague-answer', 'low',
                'VAGUE RESPONSE',
                'Response contains multiple uncertainty indicators and lacks detail.');
        }
        
        // Enhanced positive indicators
        this.detectPositiveIndicators(response, github);
    }

    checkResumeContradictions(response, resume) {
        
        // Check skills mentioned vs resume skills
        if (resume.skills?.all?.length > 0) {
            const resumeSkills = resume.skills.all.map(skill => skill.toLowerCase());
            
            // Check if candidate claims skills not in resume
            const commonSkills = ['react', 'angular', 'vue', 'node', 'python', 'java', 'javascript', 'typescript'];
            commonSkills.forEach(skill => {
                if (response.toLowerCase().includes(skill) && !resumeSkills.some(rSkill => rSkill.includes(skill))) {
                    this.addContradiction('resume-mismatch', 'medium',
                        'SKILL NOT IN RESUME',
                        `Mentions ${skill} experience but it's not listed in their resume skills.`);
                }
            });
        }
        
        // Check experience level claims vs resume
        if (resume.summary?.estimatedExperienceLevel) {
            const resumeLevel = resume.summary.estimatedExperienceLevel.toLowerCase();
            
            if ((response.includes('senior') || response.includes('lead')) && resumeLevel === 'junior') {
                this.addContradiction('resume-mismatch', 'high',
                    'EXPERIENCE LEVEL MISMATCH',
                    `Claims senior role but resume indicates ${resume.summary.estimatedExperienceLevel} level experience.`);
            }
        }
        
        // Check company names mentioned vs resume
        if (resume.experience?.length > 0) {
            const resumeCompanies = resume.experience
                .map(exp => exp.company?.toLowerCase())
                .filter(company => company && company.length > 2);
            
            // Look for company mentions that don't match resume
            const words = response.split(/\s+/);
            words.forEach(word => {
                if (word.length > 3 && word.match(/^[A-Z][a-z]+$/)) {
                    // Might be a company name
                    const lowerWord = word.toLowerCase();
                    if (!resumeCompanies.some(company => company.includes(lowerWord) || lowerWord.includes(company))) {
                        // This is too noisy, so we'll skip this check for now
                    }
                }
            });
        }
        
        // Check education claims vs resume
        if (resume.education?.length > 0) {
            const resumeEducation = resume.education.map(edu => edu.degree?.toLowerCase() || '');
            
            if ((response.includes('phd') || response.includes('doctorate')) && 
                !resumeEducation.some(edu => edu.includes('phd') || edu.includes('doctorate'))) {
                contradictions.push({
                    type: 'warning',
                    time: this.formatTime(new Date()),
                    header: 'EDUCATION MISMATCH',
                    content: `Mentions PhD/Doctorate but resume doesn't show advanced degree.`
                });
            }
        }
        
        // Add new contradictions to insights
        contradictions.forEach(contradiction => {
            this.liveInsights.unshift(contradiction);
        });
        
        // Keep only last 10 insights
        if (this.liveInsights.length > 10) {
            this.liveInsights = this.liveInsights.slice(0, 10);
        }
    }

    updateCredibilityScore(contradictionType = null, severity = 'medium') {
        // Initialize base score if not set
        if (this.credibilityScore === undefined) {
            this.credibilityScore = 75; // Start with 75 to allow for both improvement and decline
        }

        // Real-time credibility adjustments based on contradiction type
        if (contradictionType) {
            const adjustments = this.getCredibilityAdjustment(contradictionType, severity);
            this.credibilityScore = Math.max(0, Math.min(100, this.credibilityScore + adjustments));
            
            // Track credibility changes for insights
            this.trackCredibilityChange(contradictionType, severity, adjustments);
            return;
        }

        // Comprehensive credibility calculation
        let baseScore = 75;
        let adjustments = 0;
        
        // Major deductions for serious contradictions
        const contradictionPenalties = {
            'experience-mismatch': -20,
            'skill-contradiction': -15,
            'false-claim': -25,
            'technical-error': -10,
            'resume-mismatch': -18,
            'timeline-inconsistency': -12
        };

        // Count different types of contradictions
        const contradictionCounts = this.categorizeContradictions();
        
        Object.entries(contradictionCounts).forEach(([type, count]) => {
            const penalty = contradictionPenalties[type] || -10;
            adjustments += penalty * count;
        });

        // Progressive penalty system - more contradictions = exponentially worse
        const totalContradictions = Object.values(contradictionCounts).reduce((a, b) => a + b, 0);
        if (totalContradictions > 0) {
            const progressivePenalty = Math.pow(totalContradictions, 1.3) * -5;
            adjustments += progressivePenalty;
        }

        // Positive indicators (but capped to prevent inflation)
        let bonuses = 0;
        if (this.candidateData?.analysis?.github) {
            const github = this.candidateData.analysis.github;
            
            // Bonus for active contributor (max +15)
            if (github.activity.recentCommits > 10) bonuses += 15;
            else if (github.activity.recentCommits > 5) bonuses += 10;
            else if (github.activity.recentCommits > 0) bonuses += 5;
            
            // Bonus for community recognition (max +15)
            if (github.activity.totalStars > 100) bonuses += 15;
            else if (github.activity.totalStars > 50) bonuses += 10;
            else if (github.activity.totalStars > 20) bonuses += 5;
            
            // Bonus for diverse skills (max +10)
            if (github.languageStats.length > 5) bonuses += 10;
            else if (github.languageStats.length > 3) bonuses += 5;
            
            // Account age bonus (max +10)
            const accountAge = Math.floor((Date.now() - new Date(github.userInfo.accountCreationDate).getTime()) / (1000 * 60 * 60 * 24 * 365));
            if (accountAge > 5) bonuses += 10;
            else if (accountAge > 3) bonuses += 5;
            else if (accountAge > 1) bonuses += 2;
        }

        // Resume quality bonus
        if (this.candidateData?.resume?.parsedData) {
            const resume = this.candidateData.resume.parsedData;
            if (resume.skills?.all?.length > 15) bonuses += 5;
            if (resume.experience?.length > 3) bonuses += 5;
            if (resume.projects?.length > 2) bonuses += 5;
        }

        // Cap bonuses to prevent over-inflation
        bonuses = Math.min(bonuses, 30);

        // Calculate final score
        const finalScore = baseScore + adjustments + bonuses;
        this.credibilityScore = Math.max(0, Math.min(100, finalScore));

        // Update credibility trend
        this.updateCredibilityTrend();
    }

    getCredibilityAdjustment(contradictionType, severity) {
        const severityMultipliers = {
            'critical': 1.5,
            'high': 1.2,
            'medium': 1.0,
            'low': 0.7
        };

        const baseAdjustments = {
            'experience-mismatch': -8,
            'skill-contradiction': -6,
            'false-claim': -12,
            'technical-error': -4,
            'resume-mismatch': -7,
            'timeline-inconsistency': -5,
            'factual-error': -6,
            'exaggeration': -3,
            'vague-answer': -2,
            'defensive-behavior': -3,
            'sensitive-claim': -1,
            'achievement-inflation': -5,
            'location-mismatch': -3,
            'consistent-answer': +4,
            'detailed-explanation': +5,
            'admits-uncertainty': +2,
            'verifiable-claim': +3,
            'technical-accuracy': +6,
            'framework-knowledge': +5,
            'project-details': +4,
            'honest-limitation': +3,
            'specific-example': +4,
            'problem-solving': +5
        };

        const baseAdjustment = baseAdjustments[contradictionType] || -10;
        const multiplier = severityMultipliers[severity] || 1.0;
        
        return Math.round(baseAdjustment * multiplier);
    }

    categorizeContradictions() {
        const categories = {
            'experience-mismatch': 0,
            'skill-contradiction': 0,
            'false-claim': 0,
            'technical-error': 0,
            'resume-mismatch': 0,
            'timeline-inconsistency': 0
        };

        // Analyze live insights for contradiction types
        this.liveInsights.forEach(insight => {
            if (insight.type === 'contradiction') {
                if (insight.header.includes('EXPERIENCE')) {
                    categories['experience-mismatch']++;
                } else if (insight.header.includes('SKILL') || insight.header.includes('LIMITED')) {
                    categories['skill-contradiction']++;
                } else if (insight.header.includes('RESUME')) {
                    categories['resume-mismatch']++;
                } else if (insight.header.includes('TIMELINE')) {
                    categories['timeline-inconsistency']++;
                } else if (insight.header.includes('TECHNICAL')) {
                    categories['technical-error']++;
                } else {
                    categories['false-claim']++;
                }
            }
        });

        return categories;
    }

    trackCredibilityChange(contradictionType, severity, adjustment) {
        // Add credibility change to insights if significant
        if (Math.abs(adjustment) >= 10) {
            const changeType = adjustment > 0 ? 'positive' : 'negative';
            const changeInsight = {
                type: changeType === 'positive' ? 'success' : 'warning',
                time: this.formatTime(new Date()),
                header: changeType === 'positive' ? 'CREDIBILITY IMPROVED' : 'CREDIBILITY REDUCED',
                content: `${changeType === 'positive' ? '+' : ''}${adjustment} points (${contradictionType.replace('-', ' ').toUpperCase()})`
            };

            this.liveInsights.unshift(changeInsight);
            this.liveInsights = this.liveInsights.slice(0, 15); // Keep recent insights
        }
    }

    updateCredibilityTrend() {
        // Initialize credibility history if not exists
        if (!this.credibilityHistory) {
            this.credibilityHistory = [];
        }

        // Add current score to history
        this.credibilityHistory.push({
            score: this.credibilityScore,
            timestamp: Date.now()
        });

        // Keep only last 20 data points
        this.credibilityHistory = this.credibilityHistory.slice(-20);
    }

    detectTechnicalErrors(response) {
        const errors = [];
        const lowerResponse = response.toLowerCase();
        
        // Common technical misconceptions
        const technicalChecks = [
            {
                pattern: /javascript.*compiled/i,
                error: 'JavaScript is interpreted, not compiled (though JIT compilation exists)'
            },
            {
                pattern: /html.*programming language/i,
                error: 'HTML is a markup language, not a programming language'
            },
            {
                pattern: /css.*programming/i,
                error: 'CSS is a styling language, not a programming language'
            },
            {
                pattern: /react.*framework/i,
                error: 'React is a library, not a framework'
            },
            {
                pattern: /node.*js.*frontend/i,
                error: 'Node.js is primarily for backend/server-side development'
            },
            {
                pattern: /sql.*nosql.*same/i,
                error: 'SQL and NoSQL are fundamentally different database paradigms'
            },
            {
                pattern: /git.*github.*same/i,
                error: 'Git is the version control system, GitHub is a hosting platform'
            },
            {
                pattern: /java.*javascript.*similar/i,
                error: 'Java and JavaScript are completely different languages'
            }
        ];
        
        technicalChecks.forEach(check => {
            if (check.pattern.test(response)) {
                errors.push(check.error);
            }
        });
        
        // Check for impossible claims
        if (lowerResponse.includes('100% uptime') && !lowerResponse.includes('impossible')) {
            errors.push('100% uptime is mathematically impossible in real systems');
        }
        
        if (lowerResponse.includes('no bugs') && !lowerResponse.includes('impossible')) {
            errors.push('Claiming "no bugs" in software is unrealistic');
        }
        
        return errors;
    }

    verifyAllClaims(response) {
        const resume = this.candidateData?.resume?.parsedData;
        const github = this.candidateData?.analysis?.github;
        const lowerResponse = response.toLowerCase();
        
        // Experience years verification
        this.verifyExperienceYears(response, resume);
        
        // Company claims verification
        this.verifyCompanyClaims(response, resume);
        
        // Education claims verification
        this.verifyEducationClaims(response, resume);
        
        // Skill level claims verification
        this.verifySkillClaims(response, resume, github);
        
        // Project claims verification
        this.verifyProjectClaims(response, resume, github);
        
        // Role/title claims verification
        this.verifyRoleClaims(response, resume);
        
        // Salary/compensation claims verification
        this.verifySalaryClaims(response, resume);
        
        // Location claims verification
        this.verifyLocationClaims(response, resume);
        
        // Achievement claims verification
        this.verifyAchievementClaims(response, resume, github);
        
        // Generate verification summary
        this.generateVerificationSummary(response);
        
        // Detect positive indicators for credibility boost
        this.detectPositiveIndicators(response, resume, github);
    }

    verifyExperienceYears(response, resume) {
        // Extract years of experience claims
        const yearPatterns = [
            /(\d+)\s*years?\s*of\s*experience/gi,
            /(\d+)\s*years?\s*in\s*\w+/gi,
            /experience\s*of\s*(\d+)\s*years?/gi,
            /been\s*working\s*for\s*(\d+)\s*years?/gi
        ];

        yearPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedYears = parseInt(match[1]);
                
                if (resume?.experience?.length > 0) {
                    // Calculate actual experience from resume
                    const actualYears = this.calculateActualExperience(resume.experience);
                    
                    if (claimedYears > actualYears + 1) { // Allow 1 year buffer
                        this.addContradiction('experience-mismatch', 'high', 
                            'EXPERIENCE YEARS MISMATCH', 
                            `Claims ${claimedYears} years but resume shows ~${actualYears} years`);
                    }
                }
            }
        });
    }

    verifyCompanyClaims(response, resume) {
        if (!resume?.experience) return;
        
        const resumeCompanies = resume.experience.map(exp => exp.company?.toLowerCase()).filter(Boolean);
        
        // Common company claim patterns
        const companyPatterns = [
            /(?:work|working|worked|employed)\s*(?:at|for|with)\s*([A-Z][a-zA-Z\s&]+)/gi,
            /(?:i(?:'m|am)|currently)\s*(?:at|with)\s*([A-Z][a-zA-Z\s&]+)/gi,
            /my\s*(?:current|previous)\s*company\s*(?:is|was)\s*([A-Z][a-zA-Z\s&]+)/gi
        ];

        companyPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedCompany = match[1].trim().toLowerCase();
                
                // Skip common words that aren't company names
                const skipWords = ['the', 'a', 'an', 'my', 'our', 'this', 'that', 'good', 'great', 'big', 'small'];
                if (skipWords.includes(claimedCompany)) continue;
                
                const isInResume = resumeCompanies.some(company => 
                    company.includes(claimedCompany) || claimedCompany.includes(company)
                );
                
                if (!isInResume && claimedCompany.length > 3) {
                    this.addContradiction('false-claim', 'critical',
                        'COMPANY CLAIM UNVERIFIED',
                        `Claims working at "${match[1]}" but not found in resume employment history`);
                }
            }
        });
    }

    verifyEducationClaims(response, resume) {
        if (!resume?.education) return;
        
        const resumeInstitutions = resume.education.map(edu => edu.institution?.toLowerCase()).filter(Boolean);
        const resumeDegrees = resume.education.map(edu => edu.degree?.toLowerCase()).filter(Boolean);
        
        // University/college claims
        const eduPatterns = [
            /(?:graduated|studied|degree)\s*(?:from|at)\s*([A-Z][a-zA-Z\s&]+(?:University|College|Institute))/gi,
            /(?:my|i)\s*(?:went to|attended)\s*([A-Z][a-zA-Z\s&]+(?:University|College|Institute))/gi,
            /(?:bachelor|master|phd|doctorate)\s*(?:from|at)\s*([A-Z][a-zA-Z\s&]+)/gi
        ];

        eduPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedInstitution = match[1].trim().toLowerCase();
                
                const isInResume = resumeInstitutions.some(inst => 
                    inst.includes(claimedInstitution) || claimedInstitution.includes(inst)
                );
                
                if (!isInResume) {
                    this.addContradiction('resume-mismatch', 'high',
                        'EDUCATION CLAIM UNVERIFIED',
                        `Claims education from "${match[1]}" but not found in resume`);
                }
            }
        });

        // GPA/CGPA claims
        const gpaPatterns = [
            /(?:gpa|cgpa)\s*(?:of|is|was)?\s*(\d+\.?\d*)/gi,
            /(\d+\.?\d*)\s*(?:gpa|cgpa)/gi
        ];

        gpaPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedGPA = match[1];
                
                const hasGPAInResume = resume.education.some(edu => 
                    edu.cgpa || edu.gpa || (edu.field && edu.field.toLowerCase().includes('gpa'))
                );
                
                if (!hasGPAInResume) {
                    this.addContradiction('resume-mismatch', 'medium',
                        'GPA CLAIM UNVERIFIED',
                        `Claims GPA of ${claimedGPA} but not mentioned in resume`);
                }
            }
        });
    }

    verifySkillClaims(response, resume, github) {
        const skillPatterns = [
            /(?:expert|proficient|experienced|skilled)\s*(?:in|with|at)\s*([A-Za-z+#\.]+)/gi,
            /(\d+)\s*years?\s*(?:of|with)\s*([A-Za-z+#\.]+)/gi,
            /(?:i\s*know|i\s*use|i\s*work\s*with)\s*([A-Za-z+#\.]+)/gi
        ];

        skillPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedSkill = match[match.length - 1].trim().toLowerCase();
                
                // Skip common words
                if (claimedSkill.length < 3 || ['the', 'and', 'for', 'with'].includes(claimedSkill)) return;
                
                let foundInResume = false;
                let foundInGitHub = false;
                
                // Check resume skills
                if (resume?.skills?.all) {
                    foundInResume = resume.skills.all.some(skill => 
                        skill.toLowerCase().includes(claimedSkill) || claimedSkill.includes(skill.toLowerCase())
                    );
                }
                
                // Check GitHub languages
                if (github?.languageStats) {
                    foundInGitHub = github.languageStats.some(lang => 
                        lang.language.toLowerCase().includes(claimedSkill) || claimedSkill.includes(lang.language.toLowerCase())
                    );
                }
                
                if (!foundInResume && !foundInGitHub) {
                    this.addContradiction('skill-contradiction', 'medium',
                        'SKILL CLAIM UNVERIFIED',
                        `Claims expertise in "${claimedSkill}" but not found in resume or GitHub`);
                }
            }
        });
    }

    verifyProjectClaims(response, resume, github) {
        // Extract project mentions
        const projectPatterns = [
            /(?:built|created|developed|worked on)\s*(?:a|an)?\s*([A-Za-z\s]+)(?:project|application|system|platform)/gi,
            /my\s*([A-Za-z\s]+)(?:project|app|application)/gi
        ];

        projectPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedProject = match[1].trim();
                
                if (claimedProject.length < 3) return;
                
                let foundInResume = false;
                let foundInGitHub = false;
                
                // Check resume projects
                if (resume?.projects) {
                    foundInResume = resume.projects.some(project => 
                        project.name?.toLowerCase().includes(claimedProject.toLowerCase())
                    );
                }
                
                // Check GitHub repositories
                if (github?.repositories) {
                    foundInGitHub = github.repositories.some(repo => 
                        repo.name?.toLowerCase().includes(claimedProject.toLowerCase()) ||
                        repo.description?.toLowerCase().includes(claimedProject.toLowerCase())
                    );
                }
                
                if (!foundInResume && !foundInGitHub) {
                    this.addContradiction('false-claim', 'medium',
                        'PROJECT CLAIM UNVERIFIED',
                        `Mentions "${claimedProject}" project but not found in resume or GitHub`);
                }
            }
        });
    }

    verifyRoleClaims(response, resume) {
        if (!resume?.experience) return;
        
        const resumeRoles = resume.experience.map(exp => exp.title?.toLowerCase()).filter(Boolean);
        
        // Role claim patterns
        const rolePatterns = [
            /(?:i(?:'m|am)|currently)\s*(?:a|an)?\s*(senior|lead|principal|staff|junior|software engineer|developer|architect|manager|director)/gi,
            /my\s*(?:current|previous)\s*role\s*(?:is|was)\s*([\w\s]+)/gi,
            /(?:worked|working)\s*as\s*(?:a|an)?\s*([\w\s]+)/gi
        ];

        rolePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedRole = match[1].trim().toLowerCase();
                
                const isInResume = resumeRoles.some(role => 
                    role.includes(claimedRole) || claimedRole.includes(role)
                );
                
                if (!isInResume && claimedRole.length > 3) {
                    this.addContradiction('resume-mismatch', 'high',
                        'ROLE CLAIM MISMATCH',
                        `Claims role "${match[1]}" but not found in resume job titles`);
                }
            }
        });
    }

    calculateActualExperience(experiences) {
        if (!experiences || experiences.length === 0) return 0;
        
        let totalMonths = 0;
        const currentYear = new Date().getFullYear();
        
        experiences.forEach(exp => {
            if (exp.duration) {
                // Try to parse duration strings like "Jan 2020 - Present", "2020-2023", etc.
                const duration = exp.duration.toLowerCase();
                
                if (duration.includes('present') || duration.includes('current')) {
                    // Extract start year
                    const startMatch = duration.match(/(\d{4})/);
                    if (startMatch) {
                        const startYear = parseInt(startMatch[1]);
                        totalMonths += (currentYear - startYear) * 12;
                    }
                } else {
                    // Try to extract year range
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

    addContradiction(type, severity, header, content) {
        // Create a unique key for this contradiction to prevent duplicates
        const contradictionKey = `${type}-${header}-${content.substring(0, 50)}`;
        
        // Check if this contradiction has already been flagged
        if (this.flaggedContradictions.has(contradictionKey)) {
            console.log('Duplicate contradiction prevented:', header);
            return; // Don't add duplicate contradictions
        }
        
        // Mark this contradiction as flagged
        this.flaggedContradictions.add(contradictionKey);
        
        const contradiction = {
            type: 'contradiction',
            time: this.formatTime(new Date()),
            header: header,
            content: content
        };
        
        this.liveInsights.unshift(contradiction);
        this.inconsistenciesCount++;
        
        // Update credibility score immediately (only once per unique contradiction)
        this.updateCredibilityScore(type, severity);
        
        // Trigger UI update
        this.requestUpdate();
        
        // Keep insights manageable
        if (this.liveInsights.length > 20) {
            this.liveInsights = this.liveInsights.slice(0, 20);
        }
        
        console.log(`New contradiction flagged: ${header} (${type}, ${severity})`);
    }

    resetContradictionTracking() {
        // Reset contradiction tracking (useful for debugging or manual reset)
        this.flaggedContradictions = new Set();
        console.log('Contradiction tracking reset');
    }

    detectPositiveIndicators(response, resume = null, github = null) {
        const lowerResponse = response.toLowerCase();
        
        // Detailed explanations
        if (response.length > 150 && (lowerResponse.includes('specifically') || lowerResponse.includes('for example') || lowerResponse.includes('in particular'))) {
            this.addPositiveIndicator('detailed-explanation', 'medium', 'DETAILED EXPLANATION', 'Provided specific examples and details');
        }
        
        // Technical accuracy indicators
        this.detectTechnicalAccuracy(response);
        
        // Framework knowledge demonstration
        this.detectFrameworkKnowledge(response, resume, github);
        
        // Problem-solving indicators
        this.detectProblemSolving(response);
        
        // Honesty indicators
        this.detectHonesty(response);
        
        // Specific examples
        if (lowerResponse.includes('when i') || lowerResponse.includes('in my experience') || lowerResponse.includes('at my previous')) {
            this.addPositiveIndicator('specific-example', 'low', 'SPECIFIC EXAMPLE', 'Provided concrete examples from experience');
        }
        
        // Admits limitations honestly
        if (lowerResponse.includes("i don't know") || lowerResponse.includes("i'm not familiar") || lowerResponse.includes("i haven't worked with")) {
            this.addPositiveIndicator('honest-limitation', 'low', 'HONEST ABOUT LIMITATIONS', 'Admits knowledge gaps honestly');
        }
        
        // Verify claims that match resume/GitHub (positive reinforcement)
        this.detectVerifiableClaims(response, resume, github);
    }

    detectVerifiableClaims(response, resume, github) {
        const lowerResponse = response.toLowerCase();
        
        // Check if mentioned skills are actually in their resume
        if (resume?.skills?.all) {
            resume.skills.all.forEach(skill => {
                if (lowerResponse.includes(skill.toLowerCase()) && skill.length > 3) {
                    this.addPositiveIndicator('verifiable-claim', 'low', 
                        'SKILL CLAIM VERIFIED', 
                        `Mentioned "${skill}" which is confirmed in resume`);
                }
            });
        }
        
        // Check if mentioned companies are in their resume
        if (resume?.experience) {
            resume.experience.forEach(exp => {
                if (exp.company && lowerResponse.includes(exp.company.toLowerCase())) {
                    this.addPositiveIndicator('verifiable-claim', 'medium', 
                        'EMPLOYMENT VERIFIED', 
                        `Mentioned "${exp.company}" which matches resume employment history`);
                }
            });
        }
        
        // Check if mentioned projects are in GitHub
        if (github?.repositories) {
            github.repositories.forEach(repo => {
                if (repo.name && lowerResponse.includes(repo.name.toLowerCase())) {
                    this.addPositiveIndicator('project-details', 'medium', 
                        'PROJECT VERIFIED', 
                        `Discussed "${repo.name}" project which exists in their GitHub`);
                }
            });
        }
    }

    detectTechnicalAccuracy(response) {
        const lowerResponse = response.toLowerCase();
        
        // Correct technical statements
        const accurateStatements = [
            { pattern: /react.*library/i, reward: 'React correctly identified as library' },
            { pattern: /javascript.*interpreted/i, reward: 'Correctly understands JavaScript execution' },
            { pattern: /html.*markup/i, reward: 'Correctly identifies HTML as markup language' },
            { pattern: /css.*styling/i, reward: 'Correctly identifies CSS purpose' },
            { pattern: /node.*backend|node.*server/i, reward: 'Correctly identifies Node.js use case' },
            { pattern: /git.*version control/i, reward: 'Correctly understands Git purpose' },
            { pattern: /database.*relational.*sql/i, reward: 'Shows understanding of database types' },
            { pattern: /api.*rest.*http/i, reward: 'Demonstrates API knowledge' }
        ];

        accurateStatements.forEach(statement => {
            if (statement.pattern.test(response)) {
                this.addPositiveIndicator('technical-accuracy', 'medium', 'TECHNICAL ACCURACY', statement.reward);
            }
        });
    }

    detectFrameworkKnowledge(response, resume, github) {
        const lowerResponse = response.toLowerCase();
        
        // Check for demonstrated framework knowledge
        const frameworkKnowledge = [
            { 
                framework: 'react', 
                indicators: ['hooks', 'usestate', 'useeffect', 'jsx', 'components', 'props', 'state management'],
                description: 'React concepts'
            },
            { 
                framework: 'angular', 
                indicators: ['components', 'services', 'dependency injection', 'typescript', 'rxjs'],
                description: 'Angular concepts'
            },
            { 
                framework: 'vue', 
                indicators: ['components', 'directives', 'vuex', 'single file components'],
                description: 'Vue.js concepts'
            },
            { 
                framework: 'node', 
                indicators: ['express', 'middleware', 'async', 'callbacks', 'npm', 'modules'],
                description: 'Node.js concepts'
            }
        ];

        frameworkKnowledge.forEach(fw => {
            const mentionsFramework = lowerResponse.includes(fw.framework);
            const showsKnowledge = fw.indicators.some(indicator => lowerResponse.includes(indicator));
            
            if (mentionsFramework && showsKnowledge) {
                // Check if this framework is in their resume/GitHub
                let hasEvidence = false;
                
                if (resume?.skills?.frameworks) {
                    hasEvidence = resume.skills.frameworks.some(skill => skill.toLowerCase().includes(fw.framework));
                }
                
                if (!hasEvidence && github?.languageStats) {
                    hasEvidence = github.languageStats.some(lang => lang.language.toLowerCase().includes(fw.framework));
                }
                
                if (hasEvidence) {
                    this.addPositiveIndicator('framework-knowledge', 'medium', 
                        'FRAMEWORK EXPERTISE VERIFIED', 
                        `Demonstrates solid understanding of ${fw.description} with supporting evidence`);
                } else {
                    this.addPositiveIndicator('framework-knowledge', 'low', 
                        'FRAMEWORK KNOWLEDGE SHOWN', 
                        `Shows understanding of ${fw.description} (verify against experience)`);
                }
            }
        });
    }

    detectProblemSolving(response) {
        const lowerResponse = response.toLowerCase();
        
        const problemSolvingIndicators = [
            'approached the problem by',
            'solved this by',
            'my solution was',
            'i debugged by',
            'troubleshooting',
            'identified the issue',
            'root cause',
            'optimized by',
            'refactored to',
            'implemented a solution'
        ];

        const problemSolvingCount = problemSolvingIndicators.filter(indicator => 
            lowerResponse.includes(indicator)
        ).length;

        if (problemSolvingCount > 0) {
            this.addPositiveIndicator('problem-solving', 'medium', 
                'PROBLEM-SOLVING DEMONSTRATED', 
                `Shows analytical thinking and problem-solving approach`);
        }
    }

    detectHonesty(response) {
        const lowerResponse = response.toLowerCase();
        
        // Honest uncertainty (positive)
        const honestyIndicators = [
            "i'm not sure about",
            "i would need to research",
            "i haven't encountered that",
            "that's outside my experience",
            "i would ask for help",
            "i'm still learning"
        ];

        honestyIndicators.forEach(indicator => {
            if (lowerResponse.includes(indicator)) {
                this.addPositiveIndicator('honest-limitation', 'low', 
                    'HONEST ABOUT LIMITATIONS', 
                    'Shows intellectual honesty and self-awareness');
            }
        });
    }

    addPositiveIndicator(type, severity, header, content) {
        // Create unique key to prevent duplicate positive indicators too
        const indicatorKey = `positive-${type}-${header}-${content.substring(0, 30)}`;
        
        if (this.flaggedContradictions.has(indicatorKey)) {
            return; // Don't add duplicate positive indicators
        }
        
        this.flaggedContradictions.add(indicatorKey);
        
        const indicator = {
            type: 'success',
            time: this.formatTime(new Date()),
            header: header,
            content: content
        };
        
        this.liveInsights.unshift(indicator);
        
        // Update credibility score positively
        this.updateCredibilityScore(type, severity);
        
        // Trigger UI update
        this.requestUpdate();
        
        console.log(`Positive indicator added: ${header} (+${this.getCredibilityAdjustment(type, severity)} points)`);
    }

    verifySalaryClaims(response, resume) {
        // Check for salary/compensation claims
        const salaryPatterns = [
            /(\$?\d+k?)\s*(?:salary|compensation|package|ctc)/gi,
            /making\s*(\$?\d+k?)/gi,
            /earning\s*(\$?\d+k?)/gi
        ];

        salaryPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                // Flag salary discussions as potentially sensitive
                this.addContradiction('sensitive-claim', 'low',
                    'SALARY CLAIM NOTED',
                    `Candidate discussed compensation: "${match[1]}" - verify appropriateness`);
            }
        });
    }

    verifyLocationClaims(response, resume) {
        if (!resume?.personalInfo?.location) return;
        
        const resumeLocation = resume.personalInfo.location.toLowerCase();
        
        const locationPatterns = [
            /(?:i(?:'m|am)|currently)\s*(?:in|at|from)\s*([A-Za-z\s,]+)/gi,
            /(?:based|located)\s*(?:in|at)\s*([A-Za-z\s,]+)/gi,
            /(?:live|living)\s*(?:in|at)\s*([A-Za-z\s,]+)/gi
        ];

        locationPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const claimedLocation = match[1].trim().toLowerCase();
                
                if (claimedLocation.length > 3 && !resumeLocation.includes(claimedLocation) && !claimedLocation.includes(resumeLocation)) {
                    this.addContradiction('resume-mismatch', 'medium',
                        'LOCATION MISMATCH',
                        `Claims location "${match[1]}" but resume shows "${resume.personalInfo.location}"`);
                }
            }
        });
    }

    verifyAchievementClaims(response, resume, github) {
        const achievementPatterns = [
            /(?:led|managed|built)\s*(?:a\s*)?team\s*of\s*(\d+)/gi,
            /(?:increased|improved|optimized)\s*(?:performance|efficiency|sales)\s*by\s*(\d+%?)/gi,
            /(?:managed|handled)\s*(\$?\d+[kmb]?)\s*(?:budget|revenue|sales)/gi,
            /(?:scaled|grew)\s*(?:to|from)\s*(\d+[kmb]?)\s*(?:users|customers|requests)/gi
        ];

        achievementPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                // Check if achievements align with role level
                const claimedMetric = match[1];
                const isHighImpact = parseInt(claimedMetric.replace(/[^\d]/g, '')) > 100;
                
                if (isHighImpact) {
                    // Check if role level supports such claims
                    const hasManagerialRole = resume?.experience?.some(exp => 
                        exp.title?.toLowerCase().includes('manager') || 
                        exp.title?.toLowerCase().includes('lead') ||
                        exp.title?.toLowerCase().includes('director')
                    );
                    
                    if (!hasManagerialRole) {
                        this.addContradiction('exaggeration', 'medium',
                            'ACHIEVEMENT CLAIM QUESTIONABLE',
                            `Claims high-impact achievement (${claimedMetric}) but no managerial roles in resume`);
                    }
                }
            }
        });
    }

    generateVerificationSummary(response) {
        // Count claims made in this response
        const claimPatterns = [
            /\d+\s*years?\s*(?:of\s*)?experience/gi,
            /(?:work|worked|working)\s*(?:at|for)\s*[A-Z]/gi,
            /(?:expert|proficient)\s*(?:in|with)/gi,
            /(?:built|created|developed)\s*(?:a|an)?\s*\w+/gi
        ];

        let totalClaims = 0;
        claimPatterns.forEach(pattern => {
            const matches = response.match(pattern);
            if (matches) totalClaims += matches.length;
        });

        if (totalClaims > 2) {
            // Add verification summary to insights
            const summary = {
                type: 'info',
                time: this.formatTime(new Date()),
                header: 'VERIFICATION SCAN COMPLETE',
                content: `Analyzed ${totalClaims} claims in response. Check contradictions above for any flags.`
            };
            
            this.liveInsights.unshift(summary);
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    getCredibilityClass() {
        if (this.credibilityScore >= 80) return 'high';
        if (this.credibilityScore >= 60) return 'medium';
        return 'low';
    }

    getCredibilityRecommendation() {
        const score = this.credibilityScore;
        if (score >= 85) {
            return 'Excellent credibility - Candidate demonstrates strong knowledge and honesty.';
        } else if (score >= 70) {
            return 'Good credibility - Candidate appears reliable with minor inconsistencies.';
        } else if (score >= 55) {
            return 'Moderate credibility - Some concerns detected. Continue with caution.';
        } else if (score >= 40) {
            return 'Low credibility - Multiple issues found. Probe deeper into claims.';
        } else {
            return 'Very low credibility - Significant concerns. Consider ending interview.';
        }
    }

    renderCredibilityTrend() {
        if (!this.credibilityHistory || this.credibilityHistory.length < 2) {
            return html`<span class="trend-text">No trend data</span>`;
        }

        const recent = this.credibilityHistory.slice(-2);
        const change = recent[1].score - recent[0].score;
        
        if (Math.abs(change) < 2) {
            return html`<span class="trend-stable">→ Stable</span>`;
        } else if (change > 0) {
            return html`<span class="trend-improving">↗ Improving (+${Math.round(change)})</span>`;
        } else {
            return html`<span class="trend-declining">↘ Declining (${Math.round(change)})</span>`;
        }
    }

    async handleEndInterview() {
        try {
            // Confirm interview end
            const confirmEnd = confirm('Are you sure you want to end the interview? This will generate a report and close the session.');
            if (!confirmEnd) return;

            // Generate the interview report
            const report = this.generateInterviewReport();
            
            // Show save dialog
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                const result = await ipcRenderer.invoke('save-interview-report', report);
                
                if (result.success) {
                    // Show success message
                    this.showEndInterviewSuccess(result.filePath);
                    
                    // Wait a moment for user to see the success message
                    setTimeout(async () => {
                        // Stop capture and close session
                        if (window.cheddar) {
                            window.cheddar.stopCapture();
                        }
                        
                        // Close the session
                        await ipcRenderer.invoke('close-session');
                        
                        // Clear interview data
                        localStorage.removeItem('interviewStartTime');
                        
                        // Notify parent to return to main view
                        this.dispatchEvent(new CustomEvent('interview-ended', {
                            bubbles: true,
                            composed: true
                        }));
                    }, 2000);
                    
                } else if (result.error !== 'Save canceled by user') {
                    console.error('Failed to save report:', result.error);
                    alert('Failed to save interview report: ' + result.error);
                }
            }
        } catch (error) {
            console.error('Error ending interview:', error);
            alert('Error generating interview report: ' + error.message);
        }
    }

    toggleQuestionCompletion(questionId) {
        this.interviewQuestions = this.interviewQuestions.map(q => 
            q.id === questionId ? { ...q, completed: !q.completed } : q
        );
        this.requestUpdate();
        
        // Save questions state to localStorage
        localStorage.setItem('interviewQuestions', JSON.stringify(this.interviewQuestions));
    }

    async generateInterviewQuestions() {
        console.log('🔄 Starting interview questions generation...');
        if (this.questionsLoading) return;

        this.questionsLoading = true;
        this.questionsError = '';
        this.requestUpdate();

        try {
            // Simple approach - just generate 5 technical questions based on available data
            this.interviewQuestions = this.generateSimpleQuestions();
            
            // Save questions to localStorage
            localStorage.setItem('interviewQuestions', JSON.stringify(this.interviewQuestions));
            
            console.log('✅ Generated', this.interviewQuestions.length, 'questions');
        } catch (error) {
            console.error('Error generating interview questions:', error);
            this.questionsError = error.message;
            
            // Always provide fallback questions if generation fails
            console.log('🔄 Using fallback questions due to error');
            this.interviewQuestions = this.getFallbackQuestions();
            localStorage.setItem('interviewQuestions', JSON.stringify(this.interviewQuestions));
        } finally {
            this.questionsLoading = false;
            this.requestUpdate();
        }
    }

    generateSimpleQuestions() {
        const candidateAnalysis = JSON.parse(localStorage.getItem('candidateAnalysis') || '{}');
        const requirements = candidateAnalysis.candidateInfo?.interviewerRequirements || '';
        const resumeData = candidateAnalysis.analysis?.resume?.parsedData;
        
        // Extract tech stack for questions
        const techStack = [];
        if (resumeData?.skills && Array.isArray(resumeData.skills)) {
            techStack.push(...resumeData.skills.slice(0, 3));
        }
        if (candidateAnalysis.analysis?.github?.languages) {
            const languages = Object.keys(candidateAnalysis.analysis.github.languages).slice(0, 2);
            techStack.push(...languages);
        }
        
        // Get top technologies
        const topTech = techStack.length > 0 ? techStack[0] : 'programming';
        const secondTech = techStack.length > 1 ? techStack[1] : 'development';
        
        const questions = [
            {
                id: 1,
                question: `Tell me about your experience with ${topTech} and how you've used it in your projects.`,
                type: "technical",
                difficulty: "mid",
                focus: `Technical expertise in ${topTech}`,
                completed: false
            },
            {
                id: 2,
                question: "Walk me through a challenging technical problem you solved recently.",
                type: "technical",
                difficulty: "mid",
                focus: "Problem-solving and technical skills",
                completed: false
            },
            {
                id: 3,
                question: `How do you approach debugging issues in ${secondTech}?`,
                type: "technical",
                difficulty: "mid",
                focus: `Debugging skills in ${secondTech}`,
                completed: false
            },
            {
                id: 4,
                question: "Describe a project where you had to learn a new technology quickly.",
                type: "technical",
                difficulty: "junior",
                focus: "Learning ability and adaptability",
                completed: false
            },
            {
                id: 5,
                question: "How do you ensure code quality and best practices in your projects?",
                type: "technical",
                difficulty: "mid",
                focus: "Code quality and best practices",
                completed: false
            }
        ];

        // Add requirements-based question if specified
        if (requirements.trim()) {
            questions.push({
                id: 6,
                question: `Based on the role requirements, how would you approach the main technical challenges?`,
                type: "practical",
                difficulty: "mid",
                focus: "Requirements-specific technical assessment",
                completed: false
            });
        }

        return questions;
    }

    getFallbackQuestions() {
        // Simple fallback questions - just 5 basic technical questions
        return [
            {
                id: 1,
                question: "Tell me about your technical background and experience.",
                type: "technical",
                difficulty: "mid",
                focus: "Technical background assessment",
                completed: false
            },
            {
                id: 2,
                question: "Walk me through a challenging technical problem you solved recently.",
                type: "technical",
                difficulty: "mid",
                focus: "Problem-solving skills",
                completed: false
            },
            {
                id: 3,
                question: "How do you approach debugging and troubleshooting issues?",
                type: "technical",
                difficulty: "mid",
                focus: "Debugging methodology",
                completed: false
            },
            {
                id: 4,
                question: "Describe a project where you had to learn a new technology quickly.",
                type: "technical",
                difficulty: "junior",
                focus: "Learning ability",
                completed: false
            },
            {
                id: 5,
                question: "How do you ensure code quality and best practices in your projects?",
                type: "technical",
                difficulty: "mid",
                focus: "Code quality practices",
                completed: false
            }
        ];
    }

    loadInterviewQuestions() {
        console.log('📋 Loading interview questions...');
        try {
            const saved = localStorage.getItem('interviewQuestions');
            if (saved) {
                this.interviewQuestions = JSON.parse(saved);
                console.log('✅ Loaded', this.interviewQuestions.length, 'saved questions');
            } else {
                console.log('📝 No saved questions found');
                // Auto-generate questions if none exist and candidate data is available
                const candidateAnalysis = localStorage.getItem('candidateAnalysis');
                if (candidateAnalysis) {
                    console.log('🤖 Scheduling question generation...');
                    setTimeout(() => this.generateInterviewQuestions(), 1000);
                } else {
                    console.log('❌ No candidate analysis found');
                }
            }
        } catch (error) {
            console.error('Error loading interview questions:', error);
            this.interviewQuestions = [];
        }
    }

    generateInterviewReport() {
        const candidateInfo = this.candidateData?.info || {};
        const resume = this.candidateData?.resume?.parsedData;
        const github = this.candidateData?.analysis?.github;
        const now = new Date();
        
        let report = `# Interview Report\n\n`;
        report += `**Generated:** ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}\n\n`;
        
        // Candidate Information
        report += `## 👤 Candidate Information\n\n`;
        if (candidateInfo.name) report += `**Name:** ${candidateInfo.name}\n`;
        if (candidateInfo.role) report += `**Position:** ${candidateInfo.role}\n`;
        if (candidateInfo.email) report += `**Email:** ${candidateInfo.email}\n`;
        if (resume?.personalInfo?.phone) report += `**Phone:** ${resume.personalInfo.phone}\n`;
        if (resume?.personalInfo?.location) report += `**Location:** ${resume.personalInfo.location}\n`;
        if (github) report += `**GitHub:** ${github.userInfo.username}\n`;
        report += `\n`;

        // Overall Assessment
        report += `## 📊 Overall Assessment\n\n`;
        report += `**Final Credibility Score:** ${Math.round(this.credibilityScore)}/100\n`;
        report += `**Assessment:** ${this.getCredibilityRecommendation()}\n`;
        report += `**Inconsistencies Detected:** ${this.inconsistenciesCount}\n\n`;

        // Credibility Trend
        if (this.credibilityHistory && this.credibilityHistory.length > 1) {
            const startScore = this.credibilityHistory[0].score;
            const endScore = this.credibilityHistory[this.credibilityHistory.length - 1].score;
            const change = endScore - startScore;
            report += `**Credibility Trend:** ${change > 0 ? 'Improved' : change < 0 ? 'Declined' : 'Stable'} (${change > 0 ? '+' : ''}${Math.round(change)} points)\n\n`;
        }

        // Pros and Cons
        const analysis = this.analyzeInterviewPerformance();
        
        report += `## ✅ Strengths (Pros)\n\n`;
        analysis.pros.forEach(pro => {
            report += `- ${pro}\n`;
        });
        report += `\n`;

        report += `## ❌ Concerns (Cons)\n\n`;
        analysis.cons.forEach(con => {
            report += `- ${con}\n`;
        });
        report += `\n`;

        // Contradictions and Issues
        if (this.liveInsights.length > 0) {
            report += `## ⚠️ Contradictions & Issues Detected\n\n`;
            
            const contradictions = this.liveInsights.filter(insight => 
                insight.type === 'contradiction' || insight.type === 'warning'
            );
            
            if (contradictions.length > 0) {
                contradictions.forEach((contradiction, index) => {
                    report += `### ${index + 1}. ${contradiction.header}\n`;
                    report += `**Time:** ${contradiction.time}\n`;
                    report += `**Details:** ${contradiction.content}\n\n`;
                });
            } else {
                report += `No significant contradictions detected during the interview.\n\n`;
            }
        }

        // Technical Assessment
        if (resume?.skills || github?.languageStats) {
            report += `## 🔧 Technical Assessment\n\n`;
            
            if (resume?.skills?.all?.length > 0) {
                report += `**Resume Skills (${resume.skills.all.length} total):**\n`;
                const skillCategories = ['programming', 'frameworks', 'databases', 'cloud', 'tools'];
                skillCategories.forEach(category => {
                    if (resume.skills[category]?.length > 0) {
                        report += `- **${category.charAt(0).toUpperCase() + category.slice(1)}:** ${resume.skills[category].join(', ')}\n`;
                    }
                });
                report += `\n`;
            }
            
            if (github?.languageStats?.length > 0) {
                report += `**GitHub Language Distribution:**\n`;
                github.languageStats.slice(0, 5).forEach(lang => {
                    report += `- ${lang.language}: ${lang.percentage.toFixed(1)}%\n`;
                });
                report += `\n`;
            }
        }

        // Experience Analysis
        if (resume?.experience?.length > 0) {
            report += `## 💼 Experience Analysis\n\n`;
            resume.experience.slice(0, 3).forEach((exp, index) => {
                report += `### ${index + 1}. ${exp.title || 'Position'}\n`;
                report += `**Company:** ${exp.company || 'Unknown'}\n`;
                if (exp.duration) report += `**Duration:** ${exp.duration}\n`;
                if (exp.current) report += `**Status:** Current Role\n`;
                if (exp.description?.length > 0) {
                    report += `**Description:** ${exp.description[0]}\n`;
                }
                report += `\n`;
            });
        }

        // Recommendations
        report += `## 💡 Interviewer Recommendations\n\n`;
        const recommendations = this.generateInterviewRecommendations();
        recommendations.forEach(rec => {
            report += `- ${rec}\n`;
        });
        report += `\n`;

        // Key AI Responses
        if (this.responses.length > 0) {
            report += `## 🤖 Key AI Insights\n\n`;
            // Include first few responses as examples
            this.responses.slice(0, 3).forEach((response, index) => {
                report += `### Response ${index + 1}\n`;
                report += `${response.substring(0, 300)}${response.length > 300 ? '...' : ''}\n\n`;
            });
            
            if (this.responses.length > 3) {
                report += `*... and ${this.responses.length - 3} additional AI responses*\n\n`;
            }
        }

        // Interview Statistics
        report += `## 📈 Interview Statistics\n\n`;
        report += `**Interview Duration:** ${this.getInterviewDuration()}\n`;
        report += `**Total AI Responses:** ${this.responses.length}\n`;
        report += `**Live Insights Generated:** ${this.liveInsights.length}\n`;
        if (this.transcriptMessages.length > 0) {
            report += `**Transcript Messages:** ${this.transcriptMessages.length}\n`;
            const candidateMessages = this.transcriptMessages.filter(msg => msg.speaker === 'candidate').length;
            const interviewerMessages = this.transcriptMessages.filter(msg => msg.speaker === 'interviewer').length;
            report += `**Candidate Responses:** ${candidateMessages}\n`;
            report += `**Interviewer Questions:** ${interviewerMessages}\n`;
        }
        
        report += `\n---\n`;
        report += `*Report generated by TruHire AI Interview Assistant*\n`;
        report += `*Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}*\n`;

        return report;
    }

    analyzeInterviewPerformance() {
        const pros = [];
        const cons = [];
        
        // Analyze credibility score
        if (this.credibilityScore >= 80) {
            pros.push('High credibility score indicates trustworthy responses');
        } else if (this.credibilityScore < 60) {
            cons.push('Low credibility score indicates multiple inconsistencies');
        }

        // Analyze GitHub activity
        if (this.candidateData?.analysis?.github) {
            const github = this.candidateData.analysis.github;
            
            if (github.activity.recentCommits > 10) {
                pros.push('Active GitHub contributor with recent commits');
            } else if (github.activity.recentCommits === 0) {
                cons.push('No recent GitHub activity despite claiming development experience');
            }
            
            if (github.activity.totalStars > 50) {
                pros.push('Good community recognition with starred repositories');
            }
            
            if (github.languageStats.length > 4) {
                pros.push('Diverse programming language experience');
            }
        }

        // Analyze resume quality
        if (this.candidateData?.resume?.parsedData) {
            const resume = this.candidateData.resume.parsedData;
            
            if (resume.skills?.all?.length > 15) {
                pros.push('Comprehensive technical skill set');
            } else if (resume.skills?.all?.length < 5) {
                cons.push('Limited technical skills listed in resume');
            }
            
            if (resume.experience?.length > 3) {
                pros.push('Substantial work experience history');
            } else if (resume.experience?.length < 2) {
                cons.push('Limited professional experience');
            }
            
            if (resume.projects?.length > 2) {
                pros.push('Good project portfolio demonstrating practical experience');
            }
        }

        // Analyze contradictions
        const contradictionTypes = this.categorizeContradictions();
        const totalContradictions = Object.values(contradictionTypes).reduce((a, b) => a + b, 0);
        
        if (totalContradictions === 0) {
            pros.push('No contradictions detected - consistent responses throughout');
        } else if (totalContradictions > 3) {
            cons.push(`Multiple contradictions detected (${totalContradictions} total)`);
        }

        // Analyze response quality
        if (this.responses.length > 0) {
            const avgResponseLength = this.responses.reduce((sum, resp) => sum + resp.length, 0) / this.responses.length;
            
            if (avgResponseLength > 200) {
                pros.push('Detailed and comprehensive responses');
            } else if (avgResponseLength < 50) {
                cons.push('Responses tend to be very brief and lack detail');
            }
        }

        // Default items if no specific analysis available
        if (pros.length === 0) {
            pros.push('Interview completed successfully');
        }
        
        if (cons.length === 0) {
            cons.push('No major concerns identified');
        }

        return { pros, cons };
    }

    generateInterviewRecommendations() {
        const recommendations = [];
        
        if (this.credibilityScore < 60) {
            recommendations.push('Consider conducting a follow-up technical assessment');
            recommendations.push('Verify claimed experience with detailed technical questions');
        }
        
        if (this.inconsistenciesCount > 2) {
            recommendations.push('Probe deeper into areas where contradictions were detected');
        }
        
        if (this.candidateData?.analysis?.github?.activity.recentCommits === 0) {
            recommendations.push('Ask about recent projects not reflected in GitHub activity');
        }
        
        if (this.credibilityScore >= 80) {
            recommendations.push('Strong candidate - consider moving to next interview round');
        }
        
        // Technical recommendations
        if (this.candidateData?.resume?.parsedData?.skills?.all?.length > 0) {
            recommendations.push('Focus technical questions on their strongest skill areas');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Standard follow-up interview process recommended');
        }
        
        return recommendations;
    }

    getInterviewDuration() {
        try {
            const startTime = localStorage.getItem('interviewStartTime');
            if (!startTime) return 'Duration unknown';
            
            const start = parseInt(startTime);
            const now = Date.now();
            const durationMs = now - start;
            const durationMinutes = Math.floor(durationMs / (1000 * 60));
            const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);
            
            if (durationMinutes > 0) {
                return `${durationMinutes} minutes, ${durationSeconds} seconds`;
            } else {
                return `${durationSeconds} seconds`;
            }
        } catch (error) {
            console.error('Error calculating interview duration:', error);
            return 'Duration calculation error';
        }
    }

    showEndInterviewSuccess(filePath) {
        // Show a success message with the file path
        const successInsight = {
            type: 'success',
            time: this.formatTime(new Date()),
            header: 'INTERVIEW REPORT SAVED',
            content: `Report saved successfully to: ${filePath}`
        };
        
        this.liveInsights.unshift(successInsight);
        this.requestUpdate();
    }

    // Override the existing method to include response analysis
    updated(changedProperties) {
        super.updated(changedProperties);
        
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex')) {
            this.updateResponseContent();
            
            // Analyze the current response for contradictions
            const currentResponse = this.getCurrentResponse();
            if (currentResponse && currentResponse !== `Hey, Im listening to your ${this.getProfileNames()[this.selectedProfile] || 'session'}?`) {
                this.analyzeResponse(currentResponse);
                this.requestUpdate(); // Trigger re-render for analysis updates
            }
        }
    }

    setupTranscriptionListeners() {
        // Listen for audio transcription events from the main process
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            
            // Listen for transcribed audio
            ipcRenderer.on('audio-transcribed', (event, data) => {
                console.log('Received audio transcription:', data);
                this.handleTranscription(data);
            });
            
            // Listen for recording status changes
            ipcRenderer.on('recording-status', (event, status) => {
                this.isRecording = status.isRecording;
                this.requestUpdate();
            });
        }
        
        // Add initial system message only
        this.addSystemMessage('Interview session started');
    }

    handleTranscription(data) {
        const { text, speaker, confidence, timestamp } = data;
        
        if (!text || text.trim().length === 0) return;
        
        // Determine speaker type based on audio source
        let speakerType = 'interviewee'; // Default to interviewee
        
        if (speaker === 'interviewer') {
            speakerType = 'interviewer';
        } else if (speaker === 'interviewee' || speaker === 'candidate') {
            speakerType = 'interviewee';
        } else if (speaker === null || speaker === undefined || speaker === 'unknown') {
            // No speaker info - use heuristics
            if (this.isLikelyInterviewerSpeech(text)) {
                speakerType = 'interviewer';
            } else {
                // Alternate speakers if we have previous messages
                const lastMessage = this.transcriptMessages[this.transcriptMessages.length - 1];
                if (lastMessage && lastMessage.speaker !== 'system') {
                    speakerType = lastMessage.speaker === 'interviewer' ? 'interviewee' : 'interviewer';
                }
            }
        }
        
        this.addTranscriptMessage(speakerType, text, timestamp);
        
        // Analyze interviewee responses for contradictions
        if (speakerType === 'interviewee') {
            this.analyzeResponse(text);
        }
    }

    isLikelyInterviewerSpeech(text) {
        const lowerText = text.toLowerCase();
        const interviewerPhrases = [
            'tell me about', 'can you', 'how would you', 'what is your experience',
            'describe', 'explain', 'why did you', 'what would you do',
            'have you ever', 'how do you handle', 'what are your'
        ];
        
        return interviewerPhrases.some(phrase => lowerText.includes(phrase));
    }

    addTranscriptMessage(speaker, text, timestamp = null) {
        const message = {
            id: Date.now() + Math.random(),
            speaker,
            text: text.trim(),
            timestamp: timestamp || new Date(),
            confidence: 1.0
        };
        
        this.transcriptMessages.push(message);
        
        // Keep only last 50 messages to prevent memory issues
        if (this.transcriptMessages.length > 50) {
            this.transcriptMessages = this.transcriptMessages.slice(-50);
        }
        
        this.requestUpdate();
        
        // Auto-scroll to bottom after a short delay
        setTimeout(() => {
            this.scrollTranscriptToBottom();
        }, 100);
    }

    addSystemMessage(text) {
        this.addTranscriptMessage('system', text);
    }

    scrollTranscriptToBottom() {
        const transcriptContent = this.shadowRoot?.querySelector('.transcript-content');
        if (transcriptContent) {
            transcriptContent.scrollTop = transcriptContent.scrollHeight;
        }
    }

    clearTranscript() {
        this.transcriptMessages = [];
        this.requestUpdate();
    }

    toggleSpeakerDiarization() {
        this.speakerDiarization = !this.speakerDiarization;
        this.requestUpdate();
    }

    formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        });
    }

    getSpeakerDisplayName(speaker) {
        switch (speaker) {
            case 'interviewer': return 'Interviewer';
            case 'interviewee': return this.candidateData?.info?.name || 'Interviewee';
            case 'candidate': return this.candidateData?.info?.name || 'Interviewee'; // Legacy support
            case 'system': return 'System';
            default: return speaker;
        }
    }

    async loadAvailableMicrophones() {
        try {
            // Request microphone permission first
            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            if (window.cheddar && window.cheddar.getAudioInputDevices) {
                this.availableMicrophones = await window.cheddar.getAudioInputDevices();
            }
        } catch (error) {
            console.warn('Could not load microphone devices:', error);
            this.availableMicrophones = [];
        }
        this.requestUpdate();
    }

    toggleMicSettings() {
        this.showMicSettings = !this.showMicSettings;
        if (this.showMicSettings && this.availableMicrophones.length === 0) {
            this.loadAvailableMicrophones();
        }
    }

    selectMicrophone(deviceId) {
        this.selectedMicrophoneId = deviceId;
        localStorage.setItem('selectedMicrophoneId', deviceId);
        this.showMicSettings = false;
        
        // Show a message that the change will take effect on next session
        this.addSystemMessage('Microphone device updated. Changes will take effect when you restart the interview session.');
    }

    initializeResizing() {
        // Add resize observers for the panels
        if (window.ResizeObserver) {
            const transcriptPanel = this.shadowRoot?.querySelector('.transcript-panel');
            const analysisPanel = this.shadowRoot?.querySelector('.analysis-panel');
            const resumeHighlightsPanel = this.shadowRoot?.querySelector('.resume-highlights-panel');
            
            if (transcriptPanel) {
                const transcriptObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        this.transcriptWidth = entry.contentRect.width;
                        this.style.setProperty('--transcript-width', `${this.transcriptWidth}px`);
                    }
                });
                transcriptObserver.observe(transcriptPanel);
            }
            
            if (analysisPanel) {
                const analysisObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        this.analysisWidth = entry.contentRect.width;
                        this.style.setProperty('--analysis-width', `${this.analysisWidth}px`);
                    }
                });
                analysisObserver.observe(analysisPanel);
            }
            
            if (resumeHighlightsPanel) {
                const resumeHighlightsObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        this.resumeHighlightsWidth = entry.contentRect.width;
                        this.style.setProperty('--resume-highlights-width', `${this.resumeHighlightsWidth}px`);
                    }
                });
                resumeHighlightsObserver.observe(resumeHighlightsPanel);
            }
        }
    }

    firstUpdated() {
        super.firstUpdated();
        this.initializeResizing();
        
        // Set initial CSS custom properties
        this.style.setProperty('--transcript-width', `${this.transcriptWidth}px`);
        this.style.setProperty('--analysis-width', `${this.analysisWidth}px`);
        this.style.setProperty('--resume-highlights-width', `${this.resumeHighlightsWidth}px`);
    }


    renderTranscriptPanel() {
        return html`
            <div class="transcript-panel">
                <div class="transcript-header">
                    <div class="transcript-title">
                        <div class="recording-indicator ${this.isRecording ? 'listening' : ''}"></div>
                        Live Transcript
                    </div>
                    <div class="transcript-subtitle">
                        Real-time conversation detection
                    </div>
                </div>

                <div class="transcript-content">
                    ${this.transcriptMessages.length === 0 ? html`
                        <div class="no-data">
                            Transcript will appear here as the conversation progresses
                        </div>
                    ` : ''}
                    
                    ${this.transcriptMessages.map(message => html`
                        <div class="conversation-message message-${message.speaker} message-live">
                            ${message.speaker !== 'system' ? html`
                                <div class="message-header">
                                    ${this.getSpeakerDisplayName(message.speaker)}
                                </div>
                            ` : ''}
                            ${message.text}
                            <div class="message-time">
                                ${this.formatMessageTime(message.timestamp)}
                            </div>
                        </div>
                    `)}
                </div>

                <div class="transcript-controls">
                    <button 
                        class="control-button ${this.speakerDiarization ? 'active' : ''}"
                        @click=${this.toggleSpeakerDiarization}
                        title="Toggle speaker identification"
                    >
                        👥 Speakers
                    </button>
                    <button 
                        class="control-button"
                        @click=${this.clearTranscript}
                        title="Clear transcript"
                    >
                        🗑️ Clear
                    </button>
                    <button 
                        class="control-button ${this.showMicSettings ? 'active' : ''}"
                        @click=${this.toggleMicSettings}
                        title="Microphone settings"
                    >
                        🎤 Mic
                    </button>
                    <div style="flex: 1;"></div>
                    <span style="font-size: 10px; color: var(--placeholder-color);">
                        ${this.transcriptMessages.length} messages
                    </span>
                </div>
                
                ${this.showMicSettings ? html`
                    <div class="mic-settings">
                        <h4>Select Microphone Device</h4>
                        <div class="mic-list">
                            <div class="mic-option ${this.selectedMicrophoneId === 'default' ? 'selected' : ''}"
                                 @click="${() => this.selectMicrophone('default')}">
                                <span>Default Microphone</span>
                            </div>
                            ${this.availableMicrophones.map(mic => html`
                                <div class="mic-option ${this.selectedMicrophoneId === mic.deviceId ? 'selected' : ''}"
                                     @click="${() => this.selectMicrophone(mic.deviceId)}">
                                    <span>${mic.label}</span>
                                </div>
                            `)}
                        </div>
                        <p class="mic-note">Changes take effect when you restart the interview session.</p>
                        <div class="stereo-mix-info">
                            <h5>Audio Setup Guide:</h5>
                            <ul>
                                <li><strong>Stereo Mix:</strong> Captures interviewee audio from meeting apps</li>
                                <li><strong>Microphone:</strong> Captures your (interviewer) audio</li>
                                <li>Enable "Stereo Mix" in Windows Sound settings if not available</li>
                            </ul>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderAnalysisPanel() {
        if (!this.candidateData) {
            return html`
                <div class="analysis-panel">
                    <div class="analysis-header">
                        <div class="analysis-title">
                            <span class="status-indicator"></span>
                            Live Interview Analysis
                        </div>
                        <div class="analysis-subtitle">No candidate data available</div>
                    </div>
                    <div class="analysis-content">
                        <div class="no-data">
                            Start an interview with candidate setup to see analysis
                        </div>
                    </div>
                </div>
            `;
        }

        const { info, analysis } = this.candidateData;
        const github = analysis.github;

        return html`
            <div class="analysis-panel">
                <div class="analysis-header">
                    <div class="analysis-title">
                        <span class="status-indicator"></span>
                        Live Interview Analysis
                    </div>
                    <div class="analysis-subtitle">
                        ${this.liveInsights.length} exchanges | ${info.name || 'Candidate'}
                    </div>
                </div>

                <div class="analysis-content">
                    <!-- Conversation Summary -->
                    <div class="analysis-section">
                        <div class="section-header">
                            📊 Conversation Summary
                        </div>
                        <div class="section-content">
                            <div class="info-row">
                                <span class="info-label">Interview progressing.</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Inconsistencies detected:</span>
                                <span class="info-value">${this.inconsistenciesCount}</span>
                            </div>
                            <div class="credibility-score-enhanced">
                                <div class="credibility-header">
                                    <span>Credibility Score:</span>
                                    <span class="score-value ${this.getCredibilityClass()}">${Math.round(this.credibilityScore)}/100</span>
                                </div>
                                <div class="credibility-bar">
                                    <div class="credibility-fill ${this.getCredibilityClass()}" style="width: ${this.credibilityScore}%"></div>
                                </div>
                                <div class="credibility-trend">
                                    ${this.renderCredibilityTrend()}
                                </div>
                            </div>
                            <div class="info-row">
                                <span class="info-label">${this.getCredibilityRecommendation()}</span>
                            </div>
                        </div>
                    </div>



                    <!-- Live Insights -->
                    <div class="analysis-section">
                        <div class="section-header">
                            ⚡ Live Insights
                        </div>
                        <div class="section-content">
                            ${this.liveInsights.length > 0 ? html`
                                <div class="insights-list">
                                    ${this.liveInsights.map(insight => html`
                                        <div class="insight-item insight-${insight.type}">
                                            <div class="insight-header">
                                                ${insight.type === 'contradiction' ? '⚠️' : insight.type === 'warning' ? '⚠️' : '✅'} 
                                                ${insight.header}
                                                <span class="insight-time">${insight.time}</span>
                                            </div>
                                            ${insight.content}
                                        </div>
                                    `)}
                                </div>
                            ` : html`
                                <div class="no-data">
                                    Analysis will appear as the interview progresses
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderResumeHighlightsPanel() {
        if (!this.candidateData?.resume?.parsedData) {
            return html`
                <div class="resume-highlights-panel">
                    <div class="highlights-header">
                        <div class="highlights-title">
                            📋 Resume Highlights
                        </div>
                        <div class="highlights-subtitle">No resume data available</div>
                    </div>
                    <div class="highlights-content">
                        <div class="no-data">
                            Upload a resume to see key highlights
                        </div>
                    </div>
                </div>
            `;
        }

        const resume = this.candidateData.resume.parsedData;
        const personalInfo = resume.personalInfo || {};

        return html`
            <div class="resume-highlights-panel">
                <div class="highlights-header">
                    <div class="highlights-title">
                        📋 Resume Highlights
                    </div>
                    <div class="highlights-subtitle">
                        Key candidate information
                    </div>
                </div>

                <div class="highlights-content">
                    <!-- Personal Info Highlight -->
                    ${personalInfo.name || personalInfo.email ? html`
                        <div class="highlight-section">
                            <div class="highlight-header">
                                👤 Personal Info
                            </div>
                            <div class="highlight-content">
                                ${personalInfo.name ? html`
                                    <div class="highlight-item">
                                        <div class="highlight-title">${personalInfo.name}</div>
                                        ${personalInfo.email ? html`<div class="highlight-subtitle">${personalInfo.email}</div>` : ''}
                                        ${personalInfo.phone ? html`<div class="highlight-subtitle">${personalInfo.phone}</div>` : ''}
                                        ${personalInfo.location ? html`<div class="highlight-meta">📍 ${personalInfo.location}</div>` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Education Highlights -->
                    ${resume.education?.length > 0 ? html`
                        <div class="highlight-section">
                            <div class="highlight-header">
                                🎓 Educational Background
                            </div>
                            <div class="highlight-content">
                                ${resume.education.slice(0, 3).map(edu => html`
                                    <div class="education-item">
                                        <div class="education-degree">${edu.degree || 'Degree'}</div>
                                        <div class="education-institution">
                                            ${edu.institution ? html`<strong>${edu.institution}</strong>` : 'Institution'}
                                        </div>
                                        <div class="education-details">
                                            ${edu.year ? html`<span class="education-year">Class of ${edu.year}</span>` : ''}
                                            ${edu.cgpa ? html`<span class="education-cgpa">CGPA: ${edu.cgpa}</span>` : ''}
                                            ${edu.field ? html`<span class="education-field">${edu.field}</span>` : ''}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Experience Highlights -->
                    ${resume.experience?.length > 0 ? html`
                        <div class="highlight-section">
                            <div class="highlight-header">
                                💼 Professional Experience
                            </div>
                            <div class="highlight-content">
                                ${resume.experience.slice(0, 4).map((exp, index) => html`
                                    <div class="experience-item ${exp.current ? 'current-role' : 'previous-role'}">
                                        <div class="experience-header">
                                            <div class="experience-title">${exp.title || 'Position'}</div>
                                            ${exp.current ? html`<span class="current-badge">Current</span>` : ''}
                                        </div>
                                        <div class="experience-company">
                                            <strong>${exp.company || 'Company'}</strong>
                                        </div>
                                        <div class="experience-duration">
                                            ${exp.duration ? html`📅 ${exp.duration}` : ''}
                                        </div>
                                        ${exp.description?.length > 0 ? html`
                                            <div class="experience-description">
                                                ${exp.description[0].substring(0, 120)}${exp.description[0].length > 120 ? '...' : ''}
                                            </div>
                                        ` : ''}
                                        ${index === 0 && resume.experience.length > 1 ? html`
                                            <div class="experience-summary">
                                                + ${resume.experience.length - 1} previous role${resume.experience.length > 2 ? 's' : ''}
                                            </div>
                                        ` : ''}
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Skills Highlights -->
                    ${resume.skills?.all?.length > 0 ? html`
                        <div class="highlight-section">
                            <div class="highlight-header">
                                💻 Key Skills
                            </div>
                            <div class="highlight-content">
                                <div class="highlight-item">
                                    <div class="highlight-title">Technical Skills (${resume.skills.all.length})</div>
                                    <div class="skills-highlight">
                                        ${resume.skills.languages?.slice(0, 6).map(skill => html`
                                            <span class="skill-tag">${skill}</span>
                                        `)}
                                    </div>
                                    ${resume.skills.frameworks?.length > 0 ? html`
                                        <div class="highlight-meta">Frameworks: ${resume.skills.frameworks.slice(0, 4).join(', ')}</div>
                                    ` : ''}
                                    ${resume.skills.cloud?.length > 0 ? html`
                                        <div class="highlight-meta">Cloud: ${resume.skills.cloud.slice(0, 3).join(', ')}</div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Projects Highlights -->
                    ${resume.projects?.length > 0 ? html`
                        <div class="highlight-section">
                            <div class="highlight-header">
                                🚀 Key Projects
                            </div>
                            <div class="highlight-content">
                                ${resume.projects.slice(0, 3).map(project => html`
                                    <div class="highlight-item">
                                        <div class="highlight-title">${project.name}</div>
                                        ${project.description?.length > 0 ? html`
                                            <div class="highlight-description">${project.description[0].substring(0, 60)}${project.description[0].length > 60 ? '...' : ''}</div>
                                        ` : ''}
                                        ${project.technologies?.length > 0 ? html`
                                            <div class="highlight-meta">Tech: ${project.technologies.slice(0, 3).join(', ')}</div>
                                        ` : ''}
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Summary/Stats -->
                    ${resume.summary ? html`
                        <div class="highlight-section">
                            <div class="highlight-header">
                                📊 Summary
                            </div>
                            <div class="highlight-content">
                                <div class="highlight-item">
                                    ${resume.summary.estimatedExperienceLevel ? html`
                                        <div class="achievement-badge">
                                            🎯 ${resume.summary.estimatedExperienceLevel} Level
                                        </div>
                                    ` : ''}
                                    <div class="highlight-meta">Resume: ${resume.metadata?.pages || 1} page${(resume.metadata?.pages || 1) > 1 ? 's' : ''}, ${resume.metadata?.wordCount || 0} words</div>
                                    ${resume.summary.hasWorkExperience ? html`<div class="highlight-meta">✅ Work Experience</div>` : ''}
                                    ${resume.summary.hasEducation ? html`<div class="highlight-meta">✅ Education</div>` : ''}
                                    ${resume.summary.hasContactInfo ? html`<div class="highlight-meta">✅ Contact Info</div>` : ''}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderInterviewQuestionsPanel() {
        return html`
            <div class="interview-questions-panel">
                <div class="panel-header">
                    <span>📝 Interview Questions</span>
                    ${!this.questionsLoading && this.interviewQuestions.length === 0 ? html`
                        <button 
                            class="regenerate-button" 
                            @click=${this.generateInterviewQuestions}
                            title="Generate Questions">
                            🔄
                        </button>
                    ` : ''}
                </div>

                <div class="questions-list">
                    ${this.questionsLoading ? html`
                        <div class="questions-loading">
                            <div class="loading-spinner"></div>
                            <div>Generating interview questions...</div>
                        </div>
                    ` : this.questionsError ? html`
                        <div class="questions-error">
                            <div>❌ ${this.questionsError}</div>
                            <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
                                ${this.interviewQuestions.length > 0 ? 'Using fallback questions instead' : 'No questions available'}
                            </div>
                            <button @click=${this.generateInterviewQuestions} style="margin-top: 8px;">
                                Try Again
                            </button>
                        </div>
                    ` : this.interviewQuestions.length === 0 ? html`
                        <div class="questions-empty">
                            <div>📝 No questions generated yet</div>
                            <button @click=${this.generateInterviewQuestions} style="margin-top: 8px;">
                                Generate Questions
                            </button>
                        </div>
                    ` : html`
                        ${this.interviewQuestions.map(question => html`
                            <div class="question-item ${question.completed ? 'completed' : ''}">
                                <div 
                                    class="question-checkbox ${question.completed ? 'checked' : ''}"
                                    @click=${() => this.toggleQuestionCompletion(question.id)}
                                ></div>
                                <div class="question-content">
                                    <div class="question-text">${question.question}</div>
                                    <div class="question-meta">
                                        <span class="question-tag ${question.type}">${question.type}</span>
                                        <span class="question-tag">${question.difficulty}</span>
                                        ${question.focus ? html`
                                            <span class="question-tag" title="${question.focus}">
                                                ${question.focus.length > 20 ? question.focus.substring(0, 20) + '...' : question.focus}
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `)}
                        
                        <div style="margin-top: 16px; text-align: center;">
                            <button 
                                class="regenerate-button" 
                                @click=${this.generateInterviewQuestions}
                                title="Regenerate Questions"
                                style="padding: 8px 16px; font-size: 12px;">
                                🔄 Regenerate Questions
                            </button>
                        </div>
                    `}
                </div>

            </div>
        `;
    }

    render() {
        const currentResponse = this.getCurrentResponse();
        const responseCounter = this.getResponseCounter();
        const isSaved = this.isResponseSaved();

        return html`
            <!-- Live Transcript Panel -->
            ${this.renderTranscriptPanel()}

            <!-- Main Panel with AI Responses -->
            <div class="main-panel">
                <div class="response-container" id="responseContainer"></div>

                <div class="text-input-container">
                    <button class="nav-button" @click=${this.navigateToPreviousResponse} ?disabled=${this.currentResponseIndex <= 0}>
                        <?xml version="1.0" encoding="UTF-8"?><svg
                            width="24px"
                            height="24px"
                            stroke-width="1.7"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="#ffffff"
                        >
                            <path d="M15 6L9 12L15 18" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>

                    ${this.responses.length > 0 ? html` <span class="response-counter">${responseCounter}</span> ` : ''}

                    <button
                        class="save-button ${isSaved ? 'saved' : ''}"
                        @click=${this.saveCurrentResponse}
                        title="${isSaved ? 'Response saved' : 'Save this response'}"
                    >
                        <?xml version="1.0" encoding="UTF-8"?><svg
                            width="24px"
                            height="24px"
                            stroke-width="1.7"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 20V5C5 3.89543 5.89543 3 7 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L19.4142 5.41421C19.7893 5.78929 20 6.29799 20 6.82843V20C20 21.1046 19.1046 22 18 22H7C5.89543 22 5 21 5 20Z"
                                stroke="currentColor"
                                stroke-width="1.7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            <path d="M15 22V13H9V22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9 3V8H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>

                    <input type="text" id="textInput" placeholder="Type a message to the AI..." @keydown=${this.handleTextKeydown} />

                    <button class="end-interview-button" @click=${this.handleEndInterview} title="End Interview & Generate Report">
                        <?xml version="1.0" encoding="UTF-8"?><svg
                            width="20px"
                            height="20px"
                            stroke-width="1.7"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="#ffffff"
                        >
                            <path d="M9 12L11 14L15 10" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        End Interview
                    </button>

                    <button class="nav-button" @click=${this.navigateToNextResponse} ?disabled=${this.currentResponseIndex >= this.responses.length - 1}>
                        <?xml version="1.0" encoding="UTF-8"?><svg
                            width="24px"
                            height="24px"
                            stroke-width="1.7"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="#ffffff"
                        >
                            <path d="M9 6L15 12L9 18" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Analysis Panel -->
            ${this.renderAnalysisPanel()}

            <!-- Resume Highlights Panel -->
            ${this.renderResumeHighlightsPanel()}

            <!-- Interview Questions Panel -->
            ${this.renderInterviewQuestionsPanel()}
        `;
    }
}

customElements.define('assistant-view', AssistantView);
