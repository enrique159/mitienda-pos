# Agent Entry Point

This repository has specific instructions for agents and LLMs.

## Architecture References

Before generating, modifying or reviewing code, identify if the change affects `packages/`, `src/` or both, and read the corresponding references:

- Packages: `.github/references/packages.md`
- Src: `.github/references/src.md`

## Reading Priority

1. This file: `AGENTS.md`
2. `.github/codex-instructions.md`
3. The architecture references by layer that apply

## Operative rules

- Do not assume default conventions of Electron or Vue if they contradict the project's references.
- Use the references as the source of architectural truth.
- If the change touches backend (packages) and frontend (src), read both references before acting.
- If a general instruction conflicts with a layer reference, send the layer reference for that directory.

## References

- `.github/codex-instructions.md`
- `.github/references/packages.md`
- `.github/references/src.md`
