# 📐 Code Documentation Standards (JSDoc & TSDoc)

This document establishes the official code documentation standards for **Portfolio Rebalancer**. Maintaining structured inline documentation improves developer onboarding, IDE autocomplete (IntelliSense), and refactoring reliability.

---

## 📌 Code Comment Rules

1.  **Block Format**: Always use standard JSDoc/TSDoc block notation `/** ... */` for code elements. Do not use double slashes `//` for documenting API interfaces, modules, types, or methods.
2.  **When to Document**:
    *   **All Exported Utilities / Helpers**: Any general helper function (e.g., in `utils/`).
    *   **Custom React Hooks**: Explaining their stateful inputs, outputs, and side effects.
    *   **API Service Callers**: Client methods triggering backend HTTP calls.
    *   **Backend Services & Controllers**: Express controllers, middleware, and query models.
    *   **Complex Types & Interfaces**: Detailed model objects or request payloads.

---

## 🏷️ Standard JSDoc / TSDoc Tags

| Tag | Usage | Example |
| :--- | :--- | :--- |
| `@param` | Describes a function argument. Include name, type (optional in TS), and purpose. | `@param amount - The rebalancing contribution amount` |
| `@returns` | Describes the return value. | `@returns {Promise<Asset[]>} The user assets` |
| `@throws` | Explains conditions where the code throws an exception. | `@throws {ValidationError} If input percentage exceeds 100` |
| `@template` | Documents generic type parameters in TypeScript. | `@template T - The element type of the array` |
| `@deprecated` | Warns developers that a function/method is obsolete and should not be used. | `@deprecated Use assetService.updateAsset instead` |

---

## 📝 Code Examples

### 1. Utility Function
```typescript
/**
 * Formats a numeric value into a localized currency string.
 *
 * @param value - The numerical monetary value.
 * @param currency - The ISO currency code ('USD' or 'BRL').
 * @returns The formatted string representation (e.g., "$1,250.00" or "R$ 1.250,00").
 */
export function formatCurrency(value: number, currency: 'USD' | 'BRL'): string {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(value);
}
```

### 2. Custom React Hook
```typescript
/**
 * Hook to retrieve and subscribe to active USD/BRL currency exchange rates.
 * Polls the backend exchange service periodically.
 *
 * @param intervalMs - Polling rate frequency in milliseconds. Defaults to 60000 (1 min).
 * @returns An object containing the current rate, loading state, and error message.
 */
export function useExchangeRate(intervalMs = 60000) {
  const [rate, setRate] = useState<number | null>(null);
  // ...
  return { rate, loading, error };
}
```

### 3. Backend Express Controller / Service
```typescript
/**
 * Express Controller responsible for handling user authentication requests.
 */
export class AuthController {
  /**
   * Authenticates user credentials and returns a JWT token.
   *
   * @param req - Express request object containing login credentials.
   * @param res - Express response object.
   * @returns Resolves with the JWT token and user info payload.
   */
  async login(req: Request, res: Response): Promise<Response> {
    // ...
  }
}
```

---

## 🛠️ ESLint JSDoc Integration (Optional Advisory)

For strict enforcement, we recommend adding `eslint-plugin-jsdoc` to check documentation rules dynamically. 

To configure locally:
1.  Install the plugin: `npm i -D eslint-plugin-jsdoc`
2.  Enable in your `eslint.config.js` / `eslint.config.mjs`:
    ```javascript
    import jsdoc from 'eslint-plugin-jsdoc';

    export default [
      // other configs...
      jsdoc.configs['flat/recommended-typescript'],
      {
        rules: {
          'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],
        }
      }
    ];
    ```
