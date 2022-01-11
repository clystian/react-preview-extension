import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";

import { Prop, PreviewConfig } from "./../types.d";

const gitIgnoreContent = "\n#React Component Preview\npreviewConfig.json";

export const addGitIgnore = async (workspacePath: string) => {
  const gitIgnoreFiles = await vscode.workspace.findFiles(".gitignore");
  const gitIgnorePath = gitIgnoreFiles[0]?.path;

  if (!gitIgnorePath) {
    await fs.writeFile(path.join(workspacePath, ".gitignore"), gitIgnoreContent);
    return;
  }

  const originalGitignoreContent = await fs.readFile(gitIgnorePath);

  if (!originalGitignoreContent.includes("previewConfig.json")) {
    fs.writeFile(gitIgnorePath, originalGitignoreContent + gitIgnoreContent);
  }
};

export const createAndShowPreviewConfig = async (workspacePath: string) => {
  const previewConfigFiles = await vscode.workspace.findFiles("previewConfig.json");
  const previewConfigPath = previewConfigFiles[0]?.path;

  if (!previewConfigPath) {
    await fs.writeFile(path.join(workspacePath, "previewConfig.json"), "");
    return;
  }

  const previewConfig = await fs.readFile(path.join(workspacePath, "previewConfig.json"));
  const previewConfigData = previewConfig.toString() && JSON.parse(previewConfig.toString());

  return previewConfigData;
};

export const addPropsInfo = async (
  workspacePath: string,
  componentName: string,
  propInfo: Prop,
) => {
  const previewConfigFiles = await vscode.workspace.findFiles("previewConfig.json");
  const previewConfigPath = previewConfigFiles[0]?.path;

  if (!previewConfigPath) {
    const newConfig: PreviewConfig = {};

    newConfig[componentName].push(propInfo);

    await fs.writeFile(path.join(workspacePath, "previewConfig.json"), JSON.stringify(newConfig));
    return;
  }

  const previewConfig = await fs.readFile(previewConfigPath);
  const originalPropsInfo = previewConfig.toString() ? JSON.parse(previewConfig.toString()) : {};

  if (!originalPropsInfo[componentName]) {
    originalPropsInfo[componentName] = [propInfo];
  } else {
    originalPropsInfo[componentName].push(propInfo);
  }

  await fs.writeFile(
    path.join(workspacePath, "previewConfig.json"),
    JSON.stringify(originalPropsInfo),
  );
};

export const deletePropsInfo = async (
  workspacePath: string,
  componentName: string,
  propName: string,
) => {
  const previewConfigFiles = await vscode.workspace.findFiles("previewConfig.json");
  const previewConfigPath = previewConfigFiles[0]?.path;

  if (!previewConfigPath) {
    return;
  }

  const previewConfig = await fs.readFile(previewConfigPath);

  if (!previewConfig.toString()) return;

  const originalPropsInfo = JSON.parse(previewConfig.toString());

  const newPropsList = originalPropsInfo[componentName].filter(
    (prop: Prop) => prop.propName !== propName,
  );

  originalPropsInfo[componentName] = newPropsList;

  await fs.writeFile(
    path.join(workspacePath, "previewConfig.json"),
    JSON.stringify(originalPropsInfo),
  );
};
