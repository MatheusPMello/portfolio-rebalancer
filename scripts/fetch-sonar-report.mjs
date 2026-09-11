#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Parses sonar-project.properties from the repository root
 */
function readSonarProperties() {
  const propsPath = path.join(rootDir, 'sonar-project.properties');
  const props = {};
  if (fs.existsSync(propsPath)) {
    const lines = fs.readFileSync(propsPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
          props[key.trim()] = values.join('=').trim();
        }
      }
    }
  }
  return props;
}

const sonarProps = readSonarProperties();
const projectKey = process.env.SONAR_PROJECT_KEY || sonarProps['sonar.projectKey'] || 'MatheusPMello_portfolio-rebalancer';
const organization = process.env.SONAR_ORGANIZATION || sonarProps['sonar.organization'] || 'matheuspmello';
const sonarToken = process.env.SONAR_TOKEN || '';

const SONAR_BASE_URL = 'https://sonarcloud.io/api';

/**
 * Fetch helper with SonarCloud basic authentication
 */
async function sonarFetch(endpoint) {
  const headers = {
    Accept: 'application/json',
  };
  if (sonarToken) {
    // SonarCloud uses Basic Auth where the token is the username and password is empty
    const authString = Buffer.from(`${sonarToken}:`).toString('base64');
    headers['Authorization'] = `Basic ${authString}`;
  }

  const url = `${SONAR_BASE_URL}${endpoint}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status} from SonarCloud API (${url}): ${errorText}`);
  }

  return response.json();
}

/**
 * Fetches all open issues for the project (handles pagination up to 500 issues)
 */
async function fetchAllIssues() {
  const issues = [];
  let page = 1;
  const pageSize = 100;
  const maxPages = 5;

  while (page <= maxPages) {
    const data = await sonarFetch(
      `/issues/search?componentKeys=${encodeURIComponent(projectKey)}&resolved=false&p=${page}&ps=${pageSize}`
    );
    if (data.issues && data.issues.length > 0) {
      issues.push(...data.issues);
    }
    if (!data.paging || page * pageSize >= data.paging.total) {
      break;
    }
    page++;
  }

  return issues;
}

/**
 * Fetches Quality Gate project status
 */
async function fetchQualityGate() {
  try {
    const data = await sonarFetch(
      `/qualitygates/project_status?projectKey=${encodeURIComponent(projectKey)}`
    );
    return data.projectStatus;
  } catch {
    console.warn('[WARN] Could not fetch Quality Gate status');
    return null;
  }
}

/**
 * Fetches key project metrics
 */
async function fetchMeasures() {
  try {
    const metricKeys = [
      'bugs',
      'vulnerabilities',
      'code_smells',
      'coverage',
      'security_rating',
      'reliability_rating',
      'sqale_rating',
      'duplicated_lines_density',
    ].join(',');

    const data = await sonarFetch(
      `/measures/component?component=${encodeURIComponent(projectKey)}&metricKeys=${metricKeys}`
    );

    const measures = {};
    if (data.component?.measures) {
      for (const m of data.component.measures) {
        measures[m.metric] = m.value;
      }
    }
    return measures;
  } catch {
    console.warn('[WARN] Could not fetch project measures');
    return {};
  }
}

function ratingToLetter(val) {
  const map = { '1.0': 'A', '2.0': 'B', '3.0': 'C', '4.0': 'D', '5.0': 'E' };
  return map[val] || val || 'N/A';
}

function getQualityGateBadge(qualityGate) {
  const qgStatus = qualityGate?.status || 'UNKNOWN';
  if (qgStatus === 'OK') {
    return 'PASSED (OK)';
  }
  if (qgStatus === 'ERROR') {
    return 'FAILED';
  }
  return qgStatus;
}

function buildOverviewSection({ qualityGate, measures, generatedAt }) {
  const qgBadge = getQualityGateBadge(qualityGate);
  const bugs = measures.bugs ?? '0';
  const vulnerabilities = measures.vulnerabilities ?? '0';
  const codeSmells = measures.code_smells ?? '0';
  const coverage = measures.coverage ? `${measures.coverage}%` : 'N/A';
  const duplicated = measures.duplicated_lines_density ? `${measures.duplicated_lines_density}%` : 'N/A';
  const reliability = ratingToLetter(measures.reliability_rating);
  const security = ratingToLetter(measures.security_rating);
  const maintainability = ratingToLetter(measures.sqale_rating);

  let md = `# SonarCloud Analysis Report\n\n`;
  md += `> **Generated At**: ${generatedAt}  \n`;
  md += `> **Project Key**: \`${projectKey}\` | **Organization**: \`${organization}\`  \n`;
  md += `> **Quality Gate**: **${qgBadge}**\n\n`;

  md += `## Overview Metrics\n\n`;
  md += `| Metric | Value | Rating |\n`;
  md += `| :--- | :--- | :--- |\n`;
  md += `| **Bugs** | ${bugs} | ${reliability} |\n`;
  md += `| **Vulnerabilities** | ${vulnerabilities} | ${security} |\n`;
  md += `| **Code Smells** | ${codeSmells} | ${maintainability} |\n`;
  md += `| **Test Coverage** | ${coverage} | - |\n`;
  md += `| **Duplicated Lines** | ${duplicated} | - |\n\n`;

  return md;
}

function groupIssuesBySeverity(issues) {
  const severityOrder = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'];
  const grouped = new Map(severityOrder.map((sev) => [sev, []]));
  for (const issue of issues) {
    const sev = issue.severity || 'INFO';
    const list = grouped.get(sev);
    if (list) {
      list.push(issue);
    }
  }
  return grouped;
}

function renderSeveritySection(sev, list) {
  let md = `### ${sev} (${list.length})\n\n`;
  md += `| Type | Component / File | Line | Message | Rule | Effort |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (const item of list) {
    const componentPath = item.component ? item.component.replace(/^[^:]+:/, '') : 'N/A';
    const line = item.line || (item.textRange ? item.textRange.startLine : '-');
    const message = (item.message || '').replaceAll('|', String.raw`\|`);
    const rule = item.rule || 'N/A';
    const effort = item.effort || '-';
    const type = item.type || 'CODE_SMELL';

    md += `| \`${type}\` | \`${componentPath}\` | ${line} | ${message} | \`${rule}\` | ${effort} |\n`;
  }
  md += `\n`;
  return md;
}

function renderIssuesSection(issues) {
  if (issues.length === 0) {
    return `## Open Issues\n\n🎉 **No open issues found in SonarCloud!** Your project is clean.\n`;
  }

  const grouped = groupIssuesBySeverity(issues);
  let md = `## Open Issues (${issues.length} total)\n\n`;

  for (const [sev, list] of grouped) {
    if (list.length > 0) {
      md += renderSeveritySection(sev, list);
    }
  }

  md += `## Remediation Instructions for Antigravity\n\n`;
  md += `To fix the issues listed above, you can prompt Antigravity:\n`;
  md += `> *"Antigravity, please read reports/sonar-report.md and fix all BLOCKER and CRITICAL issues."*\n`;

  return md;
}

/**
 * Generates Markdown report
 */
function generateMarkdownReport({ qualityGate, measures, issues, generatedAt }) {
  return buildOverviewSection({ qualityGate, measures, generatedAt }) + renderIssuesSection(issues);
}

console.log(`=============================================`);
console.log(`Fetching SonarCloud Report`);
console.log(`Project Key  : ${projectKey}`);
console.log(`Organization : ${organization}`);
console.log(`Token set?   : ${sonarToken ? 'Yes' : 'No (fetching public data)'}`);
console.log(`=============================================`);

const reportsDir = path.join(rootDir, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

try {
  const [qualityGate, measures, issues] = await Promise.all([
    fetchQualityGate(),
    fetchMeasures(),
    fetchAllIssues(),
  ]);

  const generatedAt = new Date().toISOString();

  // 1. Write JSON report
  const jsonOutput = {
    projectKey,
    organization,
    generatedAt,
    qualityGate,
    measures,
    issueCount: issues.length,
    issues,
  };
  const jsonPath = path.join(reportsDir, 'sonar-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
  console.log(`[OK] JSON report saved to: ${jsonPath}`);

  // 2. Write Markdown report
  const mdContent = generateMarkdownReport({ qualityGate, measures, issues, generatedAt });
  const mdPath = path.join(reportsDir, 'sonar-report.md');
  fs.writeFileSync(mdPath, mdContent, 'utf-8');
  console.log(`[OK] Markdown report saved to: ${mdPath}`);

  console.log(`\nSonarCloud fetch completed successfully.`);
  console.log(`Total open issues found: ${issues.length}`);
} catch {
  console.error('\n[ERROR] Failed to fetch SonarCloud report');
  console.error(`\nTips:`);
  console.error(`1. Check that the projectKey ('${projectKey}') matches your SonarCloud project key.`);
  console.error(`2. Ensure SONAR_TOKEN environment variable is set if the project is private.`);
  console.error(`3. Ensure that at least one scan has run on SonarCloud for this project.`);
  process.exitCode = 1;
}
