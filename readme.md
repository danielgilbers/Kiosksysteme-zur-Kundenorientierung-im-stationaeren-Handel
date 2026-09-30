# Kiosksysteme zur Kundenorientierung im stationären Handel

[Demo](https://danielgilbers.github.io/Kiosksysteme-zur-Kundenorientierung-im-stationaeren-Handel/)

**Paper:**

[German Version](2024-11-27%20Gilbers_Daniel_Bachelorarbeit_WI_22W.pdf)

## Dependency security

Use Node.js 24 LTS for development and CI:

```sh
npm ci --ignore-scripts
npm run audit
npm test -- --runInBand
```

The workflow audits all dependencies, including development dependencies, and runs the tests on pushes to `main`, pull requests, a daily schedule, and manual runs. Pages deployment requires the audit and tests to pass. Dependency install scripts are disabled, and GitHub Actions are pinned to immutable commits.

Dependabot checks npm packages and GitHub Actions weekly. Update pull requests must be reviewed and tested; they are not automatically merged.

Enable Dependabot alerts and Dependabot security updates in the repository settings. Require the `Dependency audit and tests` status check in the `main` branch protection or ruleset to prevent merging failed checks.

Audits detect known vulnerabilities, not undisclosed ones. Review security alerts and merge verified updates promptly.
