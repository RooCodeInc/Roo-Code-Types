# Roo Code Types

TypeScript type definitions for Roo Code.

## Installation

```bash
npm install @roo-code/types
pnpm install @roo-code/types
yarn add @roo-code/types
```

## Usage

Import the types in your TypeScript files:

```typescript
import {
	RooCodeAPI,
	RooCodeSettings,
	GlobalSettings,
	ProviderSettings,
	ClineMessage,
	TokenUsage,
	RooCodeEventName,
	RooCodeEvents,
} from "@roo-code/types"

// Use the types in your code
const settings: RooCodeSettings = {
	// Your settings here
}

// Example: Type an event handler
function handleMessage(event: RooCodeEvents["message"][0]) {
	console.log(event.message.text)
}
```
