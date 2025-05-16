"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/exports/interface.ts
var interface_exports = {};
__export(interface_exports, {
  IpcMessageType: () => IpcMessageType,
  IpcOrigin: () => IpcOrigin,
  RooCodeEventName: () => RooCodeEventName,
  TelemetryEventName: () => TelemetryEventName,
  providerNames: () => providerNames,
  rooCodeTelemetryEventSchema: () => rooCodeTelemetryEventSchema
});
module.exports = __toCommonJS(interface_exports);

// src/schemas/index.ts
var import_zod = require("zod");
var providerNames = [
  "anthropic",
  "glama",
  "openrouter",
  "bedrock",
  "vertex",
  "openai",
  "ollama",
  "vscode-lm",
  "lmstudio",
  "gemini",
  "openai-native",
  "mistral",
  "deepseek",
  "unbound",
  "requesty",
  "human-relay",
  "fake-ai",
  "xai",
  "groq",
  "chutes",
  "litellm"
];
var providerNamesSchema = import_zod.z.enum(providerNames);
var toolGroups = ["read", "edit", "browser", "command", "mcp", "modes"];
var toolGroupsSchema = import_zod.z.enum(toolGroups);
var languages = [
  "ca",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt-BR",
  "ru",
  "tr",
  "vi",
  "zh-CN",
  "zh-TW"
];
var languagesSchema = import_zod.z.enum(languages);
var telemetrySettings = ["unset", "enabled", "disabled"];
var telemetrySettingsSchema = import_zod.z.enum(telemetrySettings);
var reasoningEfforts = ["low", "medium", "high"];
var reasoningEffortsSchema = import_zod.z.enum(reasoningEfforts);
var modelInfoSchema = import_zod.z.object({
  maxTokens: import_zod.z.number().nullish(),
  maxThinkingTokens: import_zod.z.number().nullish(),
  contextWindow: import_zod.z.number(),
  supportsImages: import_zod.z.boolean().optional(),
  supportsComputerUse: import_zod.z.boolean().optional(),
  supportsPromptCache: import_zod.z.boolean(),
  inputPrice: import_zod.z.number().optional(),
  outputPrice: import_zod.z.number().optional(),
  cacheWritesPrice: import_zod.z.number().optional(),
  cacheReadsPrice: import_zod.z.number().optional(),
  description: import_zod.z.string().optional(),
  reasoningEffort: reasoningEffortsSchema.optional(),
  thinking: import_zod.z.boolean().optional(),
  minTokensPerCachePoint: import_zod.z.number().optional(),
  maxCachePoints: import_zod.z.number().optional(),
  cachableFields: import_zod.z.array(import_zod.z.string()).optional(),
  tiers: import_zod.z.array(
    import_zod.z.object({
      contextWindow: import_zod.z.number(),
      inputPrice: import_zod.z.number().optional(),
      outputPrice: import_zod.z.number().optional(),
      cacheWritesPrice: import_zod.z.number().optional(),
      cacheReadsPrice: import_zod.z.number().optional()
    })
  ).optional()
});
var historyItemSchema = import_zod.z.object({
  id: import_zod.z.string(),
  number: import_zod.z.number(),
  ts: import_zod.z.number(),
  task: import_zod.z.string(),
  tokensIn: import_zod.z.number(),
  tokensOut: import_zod.z.number(),
  cacheWrites: import_zod.z.number().optional(),
  cacheReads: import_zod.z.number().optional(),
  totalCost: import_zod.z.number(),
  size: import_zod.z.number().optional(),
  workspace: import_zod.z.string().optional()
});
var groupOptionsSchema = import_zod.z.object({
  fileRegex: import_zod.z.string().optional().refine(
    (pattern) => {
      if (!pattern) {
        return true;
      }
      try {
        new RegExp(pattern);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid regular expression pattern" }
  ),
  description: import_zod.z.string().optional()
});
var groupEntrySchema = import_zod.z.union([toolGroupsSchema, import_zod.z.tuple([toolGroupsSchema, groupOptionsSchema])]);
var groupEntryArraySchema = import_zod.z.array(groupEntrySchema).refine(
  (groups) => {
    const seen = /* @__PURE__ */ new Set();
    return groups.every((group) => {
      const groupName = Array.isArray(group) ? group[0] : group;
      if (seen.has(groupName)) {
        return false;
      }
      seen.add(groupName);
      return true;
    });
  },
  { message: "Duplicate groups are not allowed" }
);
var modeConfigSchema = import_zod.z.object({
  slug: import_zod.z.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must contain only letters numbers and dashes"),
  name: import_zod.z.string().min(1, "Name is required"),
  roleDefinition: import_zod.z.string().min(1, "Role definition is required"),
  whenToUse: import_zod.z.string().optional(),
  customInstructions: import_zod.z.string().optional(),
  groups: groupEntryArraySchema,
  source: import_zod.z.enum(["global", "project"]).optional()
});
var customModesSettingsSchema = import_zod.z.object({
  customModes: import_zod.z.array(modeConfigSchema).refine(
    (modes) => {
      const slugs = /* @__PURE__ */ new Set();
      return modes.every((mode) => {
        if (slugs.has(mode.slug)) {
          return false;
        }
        slugs.add(mode.slug);
        return true;
      });
    },
    {
      message: "Duplicate mode slugs are not allowed"
    }
  )
});
var promptComponentSchema = import_zod.z.object({
  roleDefinition: import_zod.z.string().optional(),
  whenToUse: import_zod.z.string().optional(),
  customInstructions: import_zod.z.string().optional()
});
var customModePromptsSchema = import_zod.z.record(import_zod.z.string(), promptComponentSchema.optional());
var customSupportPromptsSchema = import_zod.z.record(import_zod.z.string(), import_zod.z.string().optional());
var commandExecutionStatusSchema = import_zod.z.discriminatedUnion("status", [
  import_zod.z.object({
    executionId: import_zod.z.string(),
    status: import_zod.z.literal("started"),
    pid: import_zod.z.number().optional(),
    command: import_zod.z.string()
  }),
  import_zod.z.object({
    executionId: import_zod.z.string(),
    status: import_zod.z.literal("output"),
    output: import_zod.z.string()
  }),
  import_zod.z.object({
    executionId: import_zod.z.string(),
    status: import_zod.z.literal("exited"),
    exitCode: import_zod.z.number().optional()
  }),
  import_zod.z.object({
    executionId: import_zod.z.string(),
    status: import_zod.z.literal("fallback")
  })
]);
var experimentIds = ["autoCondenseContext", "powerSteering"];
var experimentIdsSchema = import_zod.z.enum(experimentIds);
var experimentsSchema = import_zod.z.object({
  autoCondenseContext: import_zod.z.boolean(),
  powerSteering: import_zod.z.boolean()
});
var providerSettingsEntrySchema = import_zod.z.object({
  id: import_zod.z.string(),
  name: import_zod.z.string(),
  apiProvider: providerNamesSchema.optional()
});
var baseProviderSettingsSchema = import_zod.z.object({
  includeMaxTokens: import_zod.z.boolean().optional(),
  reasoningEffort: reasoningEffortsSchema.optional(),
  diffEnabled: import_zod.z.boolean().optional(),
  fuzzyMatchThreshold: import_zod.z.number().optional(),
  modelTemperature: import_zod.z.number().nullish(),
  rateLimitSeconds: import_zod.z.number().optional(),
  // Claude 3.7 Sonnet Thinking
  modelMaxTokens: import_zod.z.number().optional(),
  modelMaxThinkingTokens: import_zod.z.number().optional()
});
var apiModelIdProviderModelSchema = baseProviderSettingsSchema.extend({
  apiModelId: import_zod.z.string().optional()
});
var anthropicSchema = apiModelIdProviderModelSchema.extend({
  apiKey: import_zod.z.string().optional(),
  anthropicBaseUrl: import_zod.z.string().optional(),
  anthropicUseAuthToken: import_zod.z.boolean().optional()
});
var glamaSchema = baseProviderSettingsSchema.extend({
  glamaModelId: import_zod.z.string().optional(),
  glamaApiKey: import_zod.z.string().optional()
});
var openRouterSchema = baseProviderSettingsSchema.extend({
  openRouterApiKey: import_zod.z.string().optional(),
  openRouterModelId: import_zod.z.string().optional(),
  openRouterBaseUrl: import_zod.z.string().optional(),
  openRouterSpecificProvider: import_zod.z.string().optional(),
  openRouterUseMiddleOutTransform: import_zod.z.boolean().optional()
});
var bedrockSchema = apiModelIdProviderModelSchema.extend({
  awsAccessKey: import_zod.z.string().optional(),
  awsSecretKey: import_zod.z.string().optional(),
  awsSessionToken: import_zod.z.string().optional(),
  awsRegion: import_zod.z.string().optional(),
  awsUseCrossRegionInference: import_zod.z.boolean().optional(),
  awsUsePromptCache: import_zod.z.boolean().optional(),
  awsProfile: import_zod.z.string().optional(),
  awsUseProfile: import_zod.z.boolean().optional(),
  awsCustomArn: import_zod.z.string().optional()
});
var vertexSchema = apiModelIdProviderModelSchema.extend({
  vertexKeyFile: import_zod.z.string().optional(),
  vertexJsonCredentials: import_zod.z.string().optional(),
  vertexProjectId: import_zod.z.string().optional(),
  vertexRegion: import_zod.z.string().optional()
});
var openAiSchema = baseProviderSettingsSchema.extend({
  openAiBaseUrl: import_zod.z.string().optional(),
  openAiApiKey: import_zod.z.string().optional(),
  openAiLegacyFormat: import_zod.z.boolean().optional(),
  openAiR1FormatEnabled: import_zod.z.boolean().optional(),
  openAiModelId: import_zod.z.string().optional(),
  openAiCustomModelInfo: modelInfoSchema.nullish(),
  openAiUseAzure: import_zod.z.boolean().optional(),
  azureApiVersion: import_zod.z.string().optional(),
  openAiStreamingEnabled: import_zod.z.boolean().optional(),
  enableReasoningEffort: import_zod.z.boolean().optional(),
  openAiHostHeader: import_zod.z.string().optional(),
  // Keep temporarily for backward compatibility during migration.
  openAiHeaders: import_zod.z.record(import_zod.z.string(), import_zod.z.string()).optional()
});
var ollamaSchema = baseProviderSettingsSchema.extend({
  ollamaModelId: import_zod.z.string().optional(),
  ollamaBaseUrl: import_zod.z.string().optional()
});
var vsCodeLmSchema = baseProviderSettingsSchema.extend({
  vsCodeLmModelSelector: import_zod.z.object({
    vendor: import_zod.z.string().optional(),
    family: import_zod.z.string().optional(),
    version: import_zod.z.string().optional(),
    id: import_zod.z.string().optional()
  }).optional()
});
var lmStudioSchema = baseProviderSettingsSchema.extend({
  lmStudioModelId: import_zod.z.string().optional(),
  lmStudioBaseUrl: import_zod.z.string().optional(),
  lmStudioDraftModelId: import_zod.z.string().optional(),
  lmStudioSpeculativeDecodingEnabled: import_zod.z.boolean().optional()
});
var geminiSchema = apiModelIdProviderModelSchema.extend({
  geminiApiKey: import_zod.z.string().optional(),
  googleGeminiBaseUrl: import_zod.z.string().optional()
});
var openAiNativeSchema = apiModelIdProviderModelSchema.extend({
  openAiNativeApiKey: import_zod.z.string().optional(),
  openAiNativeBaseUrl: import_zod.z.string().optional()
});
var mistralSchema = apiModelIdProviderModelSchema.extend({
  mistralApiKey: import_zod.z.string().optional(),
  mistralCodestralUrl: import_zod.z.string().optional()
});
var deepSeekSchema = apiModelIdProviderModelSchema.extend({
  deepSeekBaseUrl: import_zod.z.string().optional(),
  deepSeekApiKey: import_zod.z.string().optional()
});
var unboundSchema = baseProviderSettingsSchema.extend({
  unboundApiKey: import_zod.z.string().optional(),
  unboundModelId: import_zod.z.string().optional()
});
var requestySchema = baseProviderSettingsSchema.extend({
  requestyApiKey: import_zod.z.string().optional(),
  requestyModelId: import_zod.z.string().optional()
});
var humanRelaySchema = baseProviderSettingsSchema;
var fakeAiSchema = baseProviderSettingsSchema.extend({
  fakeAi: import_zod.z.unknown().optional()
});
var xaiSchema = apiModelIdProviderModelSchema.extend({
  xaiApiKey: import_zod.z.string().optional()
});
var groqSchema = apiModelIdProviderModelSchema.extend({
  groqApiKey: import_zod.z.string().optional()
});
var chutesSchema = apiModelIdProviderModelSchema.extend({
  chutesApiKey: import_zod.z.string().optional()
});
var litellmSchema = baseProviderSettingsSchema.extend({
  litellmBaseUrl: import_zod.z.string().optional(),
  litellmApiKey: import_zod.z.string().optional(),
  litellmModelId: import_zod.z.string().optional()
});
var defaultSchema = import_zod.z.object({
  apiProvider: import_zod.z.undefined()
});
var providerSettingsSchemaDiscriminated = import_zod.z.discriminatedUnion("apiProvider", [
  anthropicSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("anthropic") })),
  glamaSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("glama") })),
  openRouterSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("openrouter") })),
  bedrockSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("bedrock") })),
  vertexSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("vertex") })),
  openAiSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("openai") })),
  ollamaSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("ollama") })),
  vsCodeLmSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("vscode-lm") })),
  lmStudioSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("lmstudio") })),
  geminiSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("gemini") })),
  openAiNativeSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("openai-native") })),
  mistralSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("mistral") })),
  deepSeekSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("deepseek") })),
  unboundSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("unbound") })),
  requestySchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("requesty") })),
  humanRelaySchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("human-relay") })),
  fakeAiSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("fake-ai") })),
  xaiSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("xai") })),
  groqSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("groq") })),
  chutesSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("chutes") })),
  litellmSchema.merge(import_zod.z.object({ apiProvider: import_zod.z.literal("litellm") })),
  defaultSchema
]);
var providerSettingsSchema = import_zod.z.object({
  apiProvider: providerNamesSchema.optional()
}).merge(anthropicSchema).merge(glamaSchema).merge(openRouterSchema).merge(bedrockSchema).merge(vertexSchema).merge(openAiSchema).merge(ollamaSchema).merge(vsCodeLmSchema).merge(lmStudioSchema).merge(geminiSchema).merge(openAiNativeSchema).merge(mistralSchema).merge(deepSeekSchema).merge(unboundSchema).merge(requestySchema).merge(humanRelaySchema).merge(fakeAiSchema).merge(xaiSchema).merge(groqSchema).merge(chutesSchema).merge(litellmSchema);
var providerSettingsRecord = {
  apiProvider: void 0,
  // Anthropic
  apiModelId: void 0,
  apiKey: void 0,
  anthropicBaseUrl: void 0,
  anthropicUseAuthToken: void 0,
  // Glama
  glamaModelId: void 0,
  glamaApiKey: void 0,
  // OpenRouter
  openRouterApiKey: void 0,
  openRouterModelId: void 0,
  openRouterBaseUrl: void 0,
  openRouterSpecificProvider: void 0,
  openRouterUseMiddleOutTransform: void 0,
  // Amazon Bedrock
  awsAccessKey: void 0,
  awsSecretKey: void 0,
  awsSessionToken: void 0,
  awsRegion: void 0,
  awsUseCrossRegionInference: void 0,
  awsUsePromptCache: void 0,
  awsProfile: void 0,
  awsUseProfile: void 0,
  awsCustomArn: void 0,
  // Google Vertex
  vertexKeyFile: void 0,
  vertexJsonCredentials: void 0,
  vertexProjectId: void 0,
  vertexRegion: void 0,
  // OpenAI
  openAiBaseUrl: void 0,
  openAiApiKey: void 0,
  openAiLegacyFormat: void 0,
  openAiR1FormatEnabled: void 0,
  openAiModelId: void 0,
  openAiCustomModelInfo: void 0,
  openAiUseAzure: void 0,
  azureApiVersion: void 0,
  openAiStreamingEnabled: void 0,
  enableReasoningEffort: void 0,
  openAiHostHeader: void 0,
  // Keep temporarily for backward compatibility during migration
  openAiHeaders: void 0,
  // Ollama
  ollamaModelId: void 0,
  ollamaBaseUrl: void 0,
  // VS Code LM
  vsCodeLmModelSelector: void 0,
  lmStudioModelId: void 0,
  lmStudioBaseUrl: void 0,
  lmStudioDraftModelId: void 0,
  lmStudioSpeculativeDecodingEnabled: void 0,
  // Gemini
  geminiApiKey: void 0,
  googleGeminiBaseUrl: void 0,
  // OpenAI Native
  openAiNativeApiKey: void 0,
  openAiNativeBaseUrl: void 0,
  // Mistral
  mistralApiKey: void 0,
  mistralCodestralUrl: void 0,
  // DeepSeek
  deepSeekBaseUrl: void 0,
  deepSeekApiKey: void 0,
  // Unbound
  unboundApiKey: void 0,
  unboundModelId: void 0,
  // Requesty
  requestyApiKey: void 0,
  requestyModelId: void 0,
  // Claude 3.7 Sonnet Thinking
  modelMaxTokens: void 0,
  modelMaxThinkingTokens: void 0,
  // Generic
  includeMaxTokens: void 0,
  reasoningEffort: void 0,
  diffEnabled: void 0,
  fuzzyMatchThreshold: void 0,
  modelTemperature: void 0,
  rateLimitSeconds: void 0,
  // Fake AI
  fakeAi: void 0,
  // X.AI (Grok)
  xaiApiKey: void 0,
  // Groq
  groqApiKey: void 0,
  // Chutes AI
  chutesApiKey: void 0,
  // LiteLLM
  litellmBaseUrl: void 0,
  litellmApiKey: void 0,
  litellmModelId: void 0
};
var PROVIDER_SETTINGS_KEYS = Object.keys(providerSettingsRecord);
var globalSettingsSchema = import_zod.z.object({
  currentApiConfigName: import_zod.z.string().optional(),
  listApiConfigMeta: import_zod.z.array(providerSettingsEntrySchema).optional(),
  pinnedApiConfigs: import_zod.z.record(import_zod.z.string(), import_zod.z.boolean()).optional(),
  lastShownAnnouncementId: import_zod.z.string().optional(),
  customInstructions: import_zod.z.string().optional(),
  taskHistory: import_zod.z.array(historyItemSchema).optional(),
  autoApprovalEnabled: import_zod.z.boolean().optional(),
  alwaysAllowReadOnly: import_zod.z.boolean().optional(),
  alwaysAllowReadOnlyOutsideWorkspace: import_zod.z.boolean().optional(),
  alwaysAllowWrite: import_zod.z.boolean().optional(),
  alwaysAllowWriteOutsideWorkspace: import_zod.z.boolean().optional(),
  writeDelayMs: import_zod.z.number().optional(),
  alwaysAllowBrowser: import_zod.z.boolean().optional(),
  alwaysApproveResubmit: import_zod.z.boolean().optional(),
  requestDelaySeconds: import_zod.z.number().optional(),
  alwaysAllowMcp: import_zod.z.boolean().optional(),
  alwaysAllowModeSwitch: import_zod.z.boolean().optional(),
  alwaysAllowSubtasks: import_zod.z.boolean().optional(),
  alwaysAllowExecute: import_zod.z.boolean().optional(),
  allowedCommands: import_zod.z.array(import_zod.z.string()).optional(),
  browserToolEnabled: import_zod.z.boolean().optional(),
  browserViewportSize: import_zod.z.string().optional(),
  screenshotQuality: import_zod.z.number().optional(),
  remoteBrowserEnabled: import_zod.z.boolean().optional(),
  remoteBrowserHost: import_zod.z.string().optional(),
  cachedChromeHostUrl: import_zod.z.string().optional(),
  enableCheckpoints: import_zod.z.boolean().optional(),
  ttsEnabled: import_zod.z.boolean().optional(),
  ttsSpeed: import_zod.z.number().optional(),
  soundEnabled: import_zod.z.boolean().optional(),
  soundVolume: import_zod.z.number().optional(),
  maxOpenTabsContext: import_zod.z.number().optional(),
  maxWorkspaceFiles: import_zod.z.number().optional(),
  showRooIgnoredFiles: import_zod.z.boolean().optional(),
  maxReadFileLine: import_zod.z.number().optional(),
  terminalOutputLineLimit: import_zod.z.number().optional(),
  terminalShellIntegrationTimeout: import_zod.z.number().optional(),
  terminalShellIntegrationDisabled: import_zod.z.boolean().optional(),
  terminalCommandDelay: import_zod.z.number().optional(),
  terminalPowershellCounter: import_zod.z.boolean().optional(),
  terminalZshClearEolMark: import_zod.z.boolean().optional(),
  terminalZshOhMy: import_zod.z.boolean().optional(),
  terminalZshP10k: import_zod.z.boolean().optional(),
  terminalZdotdir: import_zod.z.boolean().optional(),
  terminalCompressProgressBar: import_zod.z.boolean().optional(),
  rateLimitSeconds: import_zod.z.number().optional(),
  diffEnabled: import_zod.z.boolean().optional(),
  fuzzyMatchThreshold: import_zod.z.number().optional(),
  experiments: experimentsSchema.optional(),
  language: languagesSchema.optional(),
  telemetrySetting: telemetrySettingsSchema.optional(),
  mcpEnabled: import_zod.z.boolean().optional(),
  enableMcpServerCreation: import_zod.z.boolean().optional(),
  mode: import_zod.z.string().optional(),
  modeApiConfigs: import_zod.z.record(import_zod.z.string(), import_zod.z.string()).optional(),
  customModes: import_zod.z.array(modeConfigSchema).optional(),
  customModePrompts: customModePromptsSchema.optional(),
  customSupportPrompts: customSupportPromptsSchema.optional(),
  enhancementApiConfigId: import_zod.z.string().optional(),
  historyPreviewCollapsed: import_zod.z.boolean().optional()
});
var globalSettingsRecord = {
  currentApiConfigName: void 0,
  listApiConfigMeta: void 0,
  pinnedApiConfigs: void 0,
  lastShownAnnouncementId: void 0,
  customInstructions: void 0,
  taskHistory: void 0,
  autoApprovalEnabled: void 0,
  alwaysAllowReadOnly: void 0,
  alwaysAllowReadOnlyOutsideWorkspace: void 0,
  alwaysAllowWrite: void 0,
  alwaysAllowWriteOutsideWorkspace: void 0,
  writeDelayMs: void 0,
  alwaysAllowBrowser: void 0,
  alwaysApproveResubmit: void 0,
  requestDelaySeconds: void 0,
  alwaysAllowMcp: void 0,
  alwaysAllowModeSwitch: void 0,
  alwaysAllowSubtasks: void 0,
  alwaysAllowExecute: void 0,
  allowedCommands: void 0,
  browserToolEnabled: void 0,
  browserViewportSize: void 0,
  screenshotQuality: void 0,
  remoteBrowserEnabled: void 0,
  remoteBrowserHost: void 0,
  enableCheckpoints: void 0,
  ttsEnabled: void 0,
  ttsSpeed: void 0,
  soundEnabled: void 0,
  soundVolume: void 0,
  maxOpenTabsContext: void 0,
  maxWorkspaceFiles: void 0,
  showRooIgnoredFiles: void 0,
  maxReadFileLine: void 0,
  terminalOutputLineLimit: void 0,
  terminalShellIntegrationTimeout: void 0,
  terminalShellIntegrationDisabled: void 0,
  terminalCommandDelay: void 0,
  terminalPowershellCounter: void 0,
  terminalZshClearEolMark: void 0,
  terminalZshOhMy: void 0,
  terminalZshP10k: void 0,
  terminalZdotdir: void 0,
  terminalCompressProgressBar: void 0,
  rateLimitSeconds: void 0,
  diffEnabled: void 0,
  fuzzyMatchThreshold: void 0,
  experiments: void 0,
  language: void 0,
  telemetrySetting: void 0,
  mcpEnabled: void 0,
  enableMcpServerCreation: void 0,
  mode: void 0,
  modeApiConfigs: void 0,
  customModes: void 0,
  customModePrompts: void 0,
  customSupportPrompts: void 0,
  enhancementApiConfigId: void 0,
  cachedChromeHostUrl: void 0,
  historyPreviewCollapsed: void 0
};
var GLOBAL_SETTINGS_KEYS = Object.keys(globalSettingsRecord);
var rooCodeSettingsSchema = providerSettingsSchema.merge(globalSettingsSchema);
var secretStateRecord = {
  apiKey: void 0,
  glamaApiKey: void 0,
  openRouterApiKey: void 0,
  awsAccessKey: void 0,
  awsSecretKey: void 0,
  awsSessionToken: void 0,
  openAiApiKey: void 0,
  geminiApiKey: void 0,
  openAiNativeApiKey: void 0,
  deepSeekApiKey: void 0,
  mistralApiKey: void 0,
  unboundApiKey: void 0,
  requestyApiKey: void 0,
  xaiApiKey: void 0,
  groqApiKey: void 0,
  chutesApiKey: void 0,
  litellmApiKey: void 0
};
var SECRET_STATE_KEYS = Object.keys(secretStateRecord);
var GLOBAL_STATE_KEYS = [...GLOBAL_SETTINGS_KEYS, ...PROVIDER_SETTINGS_KEYS].filter(
  (key) => !SECRET_STATE_KEYS.includes(key)
);
var clineAsks = [
  "followup",
  "command",
  "command_output",
  "completion_result",
  "tool",
  "api_req_failed",
  "resume_task",
  "resume_completed_task",
  "mistake_limit_reached",
  "browser_action_launch",
  "use_mcp_server"
];
var clineAskSchema = import_zod.z.enum(clineAsks);
var clineSays = [
  "error",
  "api_req_started",
  "api_req_finished",
  "api_req_retried",
  "api_req_retry_delayed",
  "api_req_deleted",
  "text",
  "reasoning",
  "completion_result",
  "user_feedback",
  "user_feedback_diff",
  "command_output",
  "shell_integration_warning",
  "browser_action",
  "browser_action_result",
  "mcp_server_request_started",
  "mcp_server_response",
  "subtask_result",
  "checkpoint_saved",
  "rooignore_error",
  "diff_error"
];
var clineSaySchema = import_zod.z.enum(clineSays);
var toolProgressStatusSchema = import_zod.z.object({
  icon: import_zod.z.string().optional(),
  text: import_zod.z.string().optional()
});
var clineMessageSchema = import_zod.z.object({
  ts: import_zod.z.number(),
  type: import_zod.z.union([import_zod.z.literal("ask"), import_zod.z.literal("say")]),
  ask: clineAskSchema.optional(),
  say: clineSaySchema.optional(),
  text: import_zod.z.string().optional(),
  images: import_zod.z.array(import_zod.z.string()).optional(),
  partial: import_zod.z.boolean().optional(),
  reasoning: import_zod.z.string().optional(),
  conversationHistoryIndex: import_zod.z.number().optional(),
  checkpoint: import_zod.z.record(import_zod.z.string(), import_zod.z.unknown()).optional(),
  progressStatus: toolProgressStatusSchema.optional()
});
var tokenUsageSchema = import_zod.z.object({
  totalTokensIn: import_zod.z.number(),
  totalTokensOut: import_zod.z.number(),
  totalCacheWrites: import_zod.z.number().optional(),
  totalCacheReads: import_zod.z.number().optional(),
  totalCost: import_zod.z.number(),
  contextTokens: import_zod.z.number()
});
var toolNames = [
  "execute_command",
  "read_file",
  "write_to_file",
  "apply_diff",
  "insert_content",
  "search_and_replace",
  "search_files",
  "list_files",
  "list_code_definition_names",
  "browser_action",
  "use_mcp_tool",
  "access_mcp_resource",
  "ask_followup_question",
  "attempt_completion",
  "switch_mode",
  "new_task",
  "fetch_instructions"
];
var toolNamesSchema = import_zod.z.enum(toolNames);
var toolUsageSchema = import_zod.z.record(
  toolNamesSchema,
  import_zod.z.object({
    attempts: import_zod.z.number(),
    failures: import_zod.z.number()
  })
);
var RooCodeEventName = /* @__PURE__ */ ((RooCodeEventName2) => {
  RooCodeEventName2["Message"] = "message";
  RooCodeEventName2["TaskCreated"] = "taskCreated";
  RooCodeEventName2["TaskStarted"] = "taskStarted";
  RooCodeEventName2["TaskModeSwitched"] = "taskModeSwitched";
  RooCodeEventName2["TaskPaused"] = "taskPaused";
  RooCodeEventName2["TaskUnpaused"] = "taskUnpaused";
  RooCodeEventName2["TaskAskResponded"] = "taskAskResponded";
  RooCodeEventName2["TaskAborted"] = "taskAborted";
  RooCodeEventName2["TaskSpawned"] = "taskSpawned";
  RooCodeEventName2["TaskCompleted"] = "taskCompleted";
  RooCodeEventName2["TaskTokenUsageUpdated"] = "taskTokenUsageUpdated";
  RooCodeEventName2["TaskToolFailed"] = "taskToolFailed";
  return RooCodeEventName2;
})(RooCodeEventName || {});
var rooCodeEventsSchema = import_zod.z.object({
  ["message" /* Message */]: import_zod.z.tuple([
    import_zod.z.object({
      taskId: import_zod.z.string(),
      action: import_zod.z.union([import_zod.z.literal("created"), import_zod.z.literal("updated")]),
      message: clineMessageSchema
    })
  ]),
  ["taskCreated" /* TaskCreated */]: import_zod.z.tuple([import_zod.z.string()]),
  ["taskStarted" /* TaskStarted */]: import_zod.z.tuple([import_zod.z.string()]),
  ["taskModeSwitched" /* TaskModeSwitched */]: import_zod.z.tuple([import_zod.z.string(), import_zod.z.string()]),
  ["taskPaused" /* TaskPaused */]: import_zod.z.tuple([import_zod.z.string()]),
  ["taskUnpaused" /* TaskUnpaused */]: import_zod.z.tuple([import_zod.z.string()]),
  ["taskAskResponded" /* TaskAskResponded */]: import_zod.z.tuple([import_zod.z.string()]),
  ["taskAborted" /* TaskAborted */]: import_zod.z.tuple([import_zod.z.string()]),
  ["taskSpawned" /* TaskSpawned */]: import_zod.z.tuple([import_zod.z.string(), import_zod.z.string()]),
  ["taskCompleted" /* TaskCompleted */]: import_zod.z.tuple([import_zod.z.string(), tokenUsageSchema, toolUsageSchema]),
  ["taskTokenUsageUpdated" /* TaskTokenUsageUpdated */]: import_zod.z.tuple([import_zod.z.string(), tokenUsageSchema]),
  ["taskToolFailed" /* TaskToolFailed */]: import_zod.z.tuple([import_zod.z.string(), toolNamesSchema, import_zod.z.string()])
});
var ackSchema = import_zod.z.object({
  clientId: import_zod.z.string(),
  pid: import_zod.z.number(),
  ppid: import_zod.z.number()
});
var taskCommandSchema = import_zod.z.discriminatedUnion("commandName", [
  import_zod.z.object({
    commandName: import_zod.z.literal("StartNewTask" /* StartNewTask */),
    data: import_zod.z.object({
      configuration: rooCodeSettingsSchema,
      text: import_zod.z.string(),
      images: import_zod.z.array(import_zod.z.string()).optional(),
      newTab: import_zod.z.boolean().optional()
    })
  }),
  import_zod.z.object({
    commandName: import_zod.z.literal("CancelTask" /* CancelTask */),
    data: import_zod.z.string()
  }),
  import_zod.z.object({
    commandName: import_zod.z.literal("CloseTask" /* CloseTask */),
    data: import_zod.z.string()
  })
]);
var taskEventSchema = import_zod.z.discriminatedUnion("eventName", [
  import_zod.z.object({
    eventName: import_zod.z.literal("message" /* Message */),
    payload: rooCodeEventsSchema.shape["message" /* Message */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskCreated" /* TaskCreated */),
    payload: rooCodeEventsSchema.shape["taskCreated" /* TaskCreated */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskStarted" /* TaskStarted */),
    payload: rooCodeEventsSchema.shape["taskStarted" /* TaskStarted */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskModeSwitched" /* TaskModeSwitched */),
    payload: rooCodeEventsSchema.shape["taskModeSwitched" /* TaskModeSwitched */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskPaused" /* TaskPaused */),
    payload: rooCodeEventsSchema.shape["taskPaused" /* TaskPaused */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskUnpaused" /* TaskUnpaused */),
    payload: rooCodeEventsSchema.shape["taskUnpaused" /* TaskUnpaused */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskAskResponded" /* TaskAskResponded */),
    payload: rooCodeEventsSchema.shape["taskAskResponded" /* TaskAskResponded */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskAborted" /* TaskAborted */),
    payload: rooCodeEventsSchema.shape["taskAborted" /* TaskAborted */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskSpawned" /* TaskSpawned */),
    payload: rooCodeEventsSchema.shape["taskSpawned" /* TaskSpawned */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskCompleted" /* TaskCompleted */),
    payload: rooCodeEventsSchema.shape["taskCompleted" /* TaskCompleted */]
  }),
  import_zod.z.object({
    eventName: import_zod.z.literal("taskTokenUsageUpdated" /* TaskTokenUsageUpdated */),
    payload: rooCodeEventsSchema.shape["taskTokenUsageUpdated" /* TaskTokenUsageUpdated */]
  })
]);
var IpcMessageType = /* @__PURE__ */ ((IpcMessageType2) => {
  IpcMessageType2["Connect"] = "Connect";
  IpcMessageType2["Disconnect"] = "Disconnect";
  IpcMessageType2["Ack"] = "Ack";
  IpcMessageType2["TaskCommand"] = "TaskCommand";
  IpcMessageType2["TaskEvent"] = "TaskEvent";
  return IpcMessageType2;
})(IpcMessageType || {});
var IpcOrigin = /* @__PURE__ */ ((IpcOrigin2) => {
  IpcOrigin2["Client"] = "client";
  IpcOrigin2["Server"] = "server";
  return IpcOrigin2;
})(IpcOrigin || {});
var ipcMessageSchema = import_zod.z.discriminatedUnion("type", [
  import_zod.z.object({
    type: import_zod.z.literal("Ack" /* Ack */),
    origin: import_zod.z.literal("server" /* Server */),
    data: ackSchema
  }),
  import_zod.z.object({
    type: import_zod.z.literal("TaskCommand" /* TaskCommand */),
    origin: import_zod.z.literal("client" /* Client */),
    clientId: import_zod.z.string(),
    data: taskCommandSchema
  }),
  import_zod.z.object({
    type: import_zod.z.literal("TaskEvent" /* TaskEvent */),
    origin: import_zod.z.literal("server" /* Server */),
    relayClientId: import_zod.z.string().optional(),
    data: taskEventSchema
  })
]);
var TelemetryEventName = /* @__PURE__ */ ((TelemetryEventName2) => {
  TelemetryEventName2["TASK_CREATED"] = "Task Created";
  TelemetryEventName2["TASK_RESTARTED"] = "Task Reopened";
  TelemetryEventName2["TASK_COMPLETED"] = "Task Completed";
  TelemetryEventName2["TASK_CONVERSATION_MESSAGE"] = "Conversation Message";
  TelemetryEventName2["LLM_COMPLETION"] = "LLM Completion";
  TelemetryEventName2["MODE_SWITCH"] = "Mode Switched";
  TelemetryEventName2["TOOL_USED"] = "Tool Used";
  TelemetryEventName2["CHECKPOINT_CREATED"] = "Checkpoint Created";
  TelemetryEventName2["CHECKPOINT_RESTORED"] = "Checkpoint Restored";
  TelemetryEventName2["CHECKPOINT_DIFFED"] = "Checkpoint Diffed";
  TelemetryEventName2["CODE_ACTION_USED"] = "Code Action Used";
  TelemetryEventName2["PROMPT_ENHANCED"] = "Prompt Enhanced";
  TelemetryEventName2["TITLE_BUTTON_CLICKED"] = "Title Button Clicked";
  TelemetryEventName2["AUTHENTICATION_INITIATED"] = "Authentication Initiated";
  TelemetryEventName2["SCHEMA_VALIDATION_ERROR"] = "Schema Validation Error";
  TelemetryEventName2["DIFF_APPLICATION_ERROR"] = "Diff Application Error";
  TelemetryEventName2["SHELL_INTEGRATION_ERROR"] = "Shell Integration Error";
  TelemetryEventName2["CONSECUTIVE_MISTAKE_ERROR"] = "Consecutive Mistake Error";
  return TelemetryEventName2;
})(TelemetryEventName || {});
var appPropertiesSchema = import_zod.z.object({
  appVersion: import_zod.z.string(),
  vscodeVersion: import_zod.z.string(),
  platform: import_zod.z.string(),
  editorName: import_zod.z.string(),
  language: import_zod.z.string(),
  mode: import_zod.z.string()
});
var taskPropertiesSchema = import_zod.z.object({
  taskId: import_zod.z.string().optional(),
  apiProvider: import_zod.z.enum(providerNames).optional(),
  modelId: import_zod.z.string().optional(),
  diffStrategy: import_zod.z.string().optional(),
  isSubtask: import_zod.z.boolean().optional()
});
var telemetryPropertiesSchema = import_zod.z.object({
  ...appPropertiesSchema.shape,
  ...taskPropertiesSchema.shape
});
var completionPropertiesSchema = import_zod.z.object({
  inputTokens: import_zod.z.number(),
  outputTokens: import_zod.z.number(),
  cacheReadTokens: import_zod.z.number().optional(),
  cacheWriteTokens: import_zod.z.number().optional(),
  cost: import_zod.z.number().optional()
});
var rooCodeTelemetryEventSchema = import_zod.z.discriminatedUnion("type", [
  import_zod.z.object({
    type: import_zod.z.enum([
      "Task Created" /* TASK_CREATED */,
      "Task Reopened" /* TASK_RESTARTED */,
      "Task Completed" /* TASK_COMPLETED */,
      "Conversation Message" /* TASK_CONVERSATION_MESSAGE */,
      "Mode Switched" /* MODE_SWITCH */,
      "Tool Used" /* TOOL_USED */,
      "Checkpoint Created" /* CHECKPOINT_CREATED */,
      "Checkpoint Restored" /* CHECKPOINT_RESTORED */,
      "Checkpoint Diffed" /* CHECKPOINT_DIFFED */,
      "Code Action Used" /* CODE_ACTION_USED */,
      "Prompt Enhanced" /* PROMPT_ENHANCED */,
      "Title Button Clicked" /* TITLE_BUTTON_CLICKED */,
      "Authentication Initiated" /* AUTHENTICATION_INITIATED */,
      "Schema Validation Error" /* SCHEMA_VALIDATION_ERROR */,
      "Diff Application Error" /* DIFF_APPLICATION_ERROR */,
      "Shell Integration Error" /* SHELL_INTEGRATION_ERROR */,
      "Consecutive Mistake Error" /* CONSECUTIVE_MISTAKE_ERROR */
    ]),
    properties: import_zod.z.object({
      ...appPropertiesSchema.shape,
      ...taskPropertiesSchema.shape
    })
  }),
  import_zod.z.object({
    type: import_zod.z.literal("LLM Completion" /* LLM_COMPLETION */),
    properties: import_zod.z.object({
      ...appPropertiesSchema.shape,
      ...taskPropertiesSchema.shape,
      ...completionPropertiesSchema.shape
    })
  })
]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IpcMessageType,
  IpcOrigin,
  RooCodeEventName,
  TelemetryEventName,
  providerNames,
  rooCodeTelemetryEventSchema
});
