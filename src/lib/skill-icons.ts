import { createElement, type ReactElement } from "react";
import type { IconBaseProps, IconType } from "react-icons";
import {
  SiClaudecode,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiGit,
  SiHuggingface,
  SiLangchain,
  SiLanggraph,
  SiLinux,
  SiNginx,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiQdrant,
  SiRedis,
  SiScikitlearn,
  SiTensorflow,
} from "react-icons/si";

/*
 * The ONE place that turns a skill's `icon` key (content.ts) into a logo (DESIGN.md §6).
 * All icons come from react-icons' Simple Icons set. Only the icons listed here are imported,
 * so the bundle stays small. To give a skill a logo: import it here, add a key, set `icon` in content.ts.
 * Icons render monochrome (currentColor), so they follow the text tokens, never brand colors.
 */
const SKILL_ICONS: Record<string, IconType> = {
  python: SiPython,
  cplusplus: SiCplusplus,
  pytorch: SiPytorch,
  tensorflow: SiTensorflow,
  scikitlearn: SiScikitlearn,
  pandas: SiPandas,
  numpy: SiNumpy,
  langchain: SiLangchain,
  langgraph: SiLanggraph,
  huggingface: SiHuggingface,
  qdrant: SiQdrant,
  fastapi: SiFastapi,
  postgresql: SiPostgresql,
  redis: SiRedis,
  docker: SiDocker,
  nginx: SiNginx,
  git: SiGit,
  linux: SiLinux,
  claudecode: SiClaudecode,
};

/**
 * The logo for an icon key, rendered with `props`, or null when there is no key or it isn't mapped
 * (→ the caller renders a text pill). Returns an element, not a component, so callers never create
 * components during render.
 */
export function renderSkillIcon(key: string | undefined, props: IconBaseProps = {}): ReactElement | null {
  if (!key || !Object.hasOwn(SKILL_ICONS, key)) return null;
  return createElement(SKILL_ICONS[key], props);
}
