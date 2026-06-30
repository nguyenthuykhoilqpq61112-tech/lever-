#!/usr/bin/env python3
"""Validate the lightweight WeChat mini-program shell.

This is a repository-local smoke test. It does not replace WeChat DevTools,
but it catches common mistakes before maintainers import or upload the project.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MINIPROGRAM = ROOT / "miniprogram"


def load_json(path: Path) -> dict:
    try:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as exc:
        raise AssertionError(f"Invalid JSON in {path.relative_to(ROOT)}: {exc}") from exc


def require_file(path: Path) -> None:
    assert path.is_file(), f"Missing file: {path.relative_to(ROOT)}"


def require_text(path: Path, expected: str) -> None:
    require_file(path)
    text = path.read_text(encoding="utf-8")
    assert expected in text, f"Expected {expected!r} in {path.relative_to(ROOT)}"


def validate_core_files() -> None:
    for relative_path in [
        "app.js",
        "app.json",
        "app.wxss",
        "project.config.json",
        "sitemap.json",
        "README.md",
    ]:
        require_file(MINIPROGRAM / relative_path)


def validate_app_pages() -> None:
    app_config = load_json(MINIPROGRAM / "app.json")
    pages = app_config.get("pages")
    assert pages == [
        "pages/index/index",
        "pages/intake/intake",
        "pages/disclaimer/disclaimer",
        "pages/ai/ai",
    ], "app.json pages must keep the expected home/intake/disclaimer/ai order"

    tab_items = app_config.get("tabBar", {}).get("list", [])
    tab_paths = [item.get("pagePath") for item in tab_items]
    assert tab_paths == pages, "tabBar paths must match app.json pages"

    for page in pages:
        page_base = MINIPROGRAM / page
        for suffix in [".wxml", ".js", ".wxss", ".json"]:
            require_file(page_base.with_suffix(suffix))
            if suffix == ".json":
                load_json(page_base.with_suffix(suffix))


def validate_project_config() -> None:
    project_config = load_json(MINIPROGRAM / "project.config.json")
    assert project_config.get("miniprogramRoot") == "./", "miniprogramRoot should point at miniprogram/"
    assert project_config.get("compileType") == "miniprogram", "compileType should be miniprogram"
    assert project_config.get("cloudfunctionRoot") == "../cloudfunctions/", "cloudfunctionRoot should point at cloudfunctions/"

    sitemap = load_json(MINIPROGRAM / "sitemap.json")
    assert sitemap.get("rules"), "sitemap.json should contain rules"


def validate_privacy_and_handoff_copy() -> None:
    require_text(MINIPROGRAM / "app.js", "intakeStorageKey")
    require_text(MINIPROGRAM / "pages/intake/intake.js", "wx.setStorageSync")
    require_text(MINIPROGRAM / "pages/intake/intake.js", "wx.setClipboardData")
    require_text(MINIPROGRAM / "pages/disclaimer/disclaimer.wxml", "不替代官方系统")
    require_text(MINIPROGRAM / "pages/disclaimer/disclaimer.wxml", "敏感信息")
    require_text(MINIPROGRAM / "data/leverGaokaoSkill.js", "buildSkillPrompt")
    require_text(MINIPROGRAM / "pages/ai/ai.js", "wx.cloud.callFunction")


def validate_docs() -> None:
    require_text(ROOT / "README.md", "docs/miniprogram-deployment.md")
    require_text(MINIPROGRAM / "README.md", "../docs/miniprogram-deployment.md")
    require_text(ROOT / "docs/miniprogram-deployment.md", "下一步执行清单")
    require_text(ROOT / "docs/miniprogram-deployment.md", "不要在前端小程序内暴露任何模型 API Key")
    require_text(ROOT / "docs/skill-ai-integration.md", "微信小程序 AI 接入文档")
    require_text(ROOT / "cloudfunctions/gaokaoSkill/index.js", "OPENAI_API_KEY")


def main() -> None:
    validate_core_files()
    validate_app_pages()
    validate_project_config()
    validate_privacy_and_handoff_copy()
    validate_docs()
    print("miniprogram validation ok")


if __name__ == "__main__":
    main()
