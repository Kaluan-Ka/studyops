import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { getProjectBySlug, getProjects } from "../src/lib/content";

const projectSlugs = [
  "mini-redis-aplicado-a-ia",
  "banco-de-dados-documental-minimo",
  "sistema-de-ingestao-de-documentos",
  "observabilidade-para-estudos",
  "github-repo-analyzer",
];

test("carrega os cinco projetos reais em ordem e com relacoes existentes", () => {
  const projects = getProjects();

  assert.deepEqual(projects.map((project) => project.id), [
    "PROJ-000001",
    "PROJ-000002",
    "PROJ-000003",
    "PROJ-000004",
    "PROJ-000005",
  ]);
  assert.deepEqual(projects.map((project) => project.slug), projectSlugs);

  for (const project of projects) {
    assert.ok(project.fundamentIds.length > 0, project.slug);
    assert.ok(project.taskIds.length > 0, project.slug);
  }
});

test("encontra projeto por slug", () => {
  assert.equal(getProjectBySlug("github-repo-analyzer")?.title, "GitHub Repo Analyzer");
  assert.equal(getProjectBySlug("projeto-ausente"), undefined);
});

test("content:validate rejeita relacoes de projeto orfas", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "studyops-projects-"));
  const sourceContent = path.join(process.cwd(), "content");
  const targetContent = path.join(tempDir, "content");

  fs.cpSync(sourceContent, targetContent, { recursive: true });
  const projectPath = path.join(targetContent, "projetos", "mini-redis-aplicado-a-ia.md");
  fs.writeFileSync(
    projectPath,
    fs.readFileSync(projectPath, "utf8").replace("FUN-000007", "FUN-999999"),
    "utf8",
  );

  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [
          "--import",
          path.join(process.cwd(), "node_modules", "tsx", "dist", "loader.mjs"),
          path.join(process.cwd(), "scripts", "content.ts"),
          "validate",
        ],
        { cwd: tempDir, encoding: "utf8", stdio: "pipe" },
      ),
    /fundamento_id orfao|fundament_ids.*orfao/i,
  );
});
