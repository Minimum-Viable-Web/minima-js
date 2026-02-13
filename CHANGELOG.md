# Changelog

Human-readable summary of notable changes in each release. For the full version history see the [repository](https://github.com/Minimum-Viable-Web/minima-js).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.7] - 2025-02-13

### Added

- **MITM protection**: `loadTemplate(url)` and `preloadComponent(componentPath)` now accept only HTTPS URLs or same-origin relative paths; plain `http://` URLs are rejected to reduce man-in-the-middle risk on fetched templates and components.
- **Release pipeline**: Publish workflow runs the test suite and bundle size check before publishing; releases are only published when tests pass.
- **Test policy**: CONTRIBUTING.md documents the requirement to add automated tests for new functionality and includes evidence of coverage for Core, Template, Security, SSR, and Components.

### Changed

- Security documentation (docs/security.md) expanded with MITM protection and release-distribution notes.

### Security / Vulnerabilities

No publicly known run-time vulnerabilities with a CVE (or similar) assignment were fixed in this release.

---

## Previous versions

For changes in 1.0.0–1.0.6, see the [GitHub Releases](https://github.com/Minimum-Viable-Web/minima-js/releases) or repository history.

[Unreleased]: https://github.com/Minimum-Viable-Web/minima-js/compare/v1.0.7...HEAD
[1.0.7]: https://github.com/Minimum-Viable-Web/minima-js/compare/v1.0.6...v1.0.7
