# Code Review Report

## DRY Violations

### Form Components
- `components/door-form.tsx`, `components/user-form.tsx`, `components/operator-form.tsx`: All form components have duplicated patterns for form state management, validation, and submission handling. Create a shared custom hook `useFormState` or higher-order component.
- `components/door-form.tsx:167-178`, `components/user-form.tsx:717-735`: Duplicate cancel/submit button patterns across all forms. Extract to shared `FormActions` component.
- `components/operator-form.tsx:208-289`: Duplicate selection/assignment logic for departments and monitoring points. Extract to reusable `DualListSelector` component.

### Table Components  
- `components/door-table.tsx`, `components/user-table.tsx`, `components/recent-activity-table.tsx`: Similar table structure and pagination logic. Create shared `DataTable` component with generic type support.

### Permission Matrix Pattern
- `components/operator-form.tsx:604-691`, `components/operator-form.tsx:708-742`, `components/operator-form.tsx:756-790`: Repeated permission matrix rendering logic (Read/Modify/All columns). Extract to `PermissionMatrix` component.

### Repeated Constants
- `components/operator-form.tsx:58-66`, `components/user-form.tsx:41-49`: Department data is duplicated. Move to shared constants file or fetch from API.
- `components/operator-form.tsx:87-112`: Permission field arrays should be in a configuration file.

## Security Issues

### Missing Input Validation
- `components/door-form.tsx:41`: Door name input has no validation - add required field validation and sanitization
- `components/door-form.tsx:61-65`: Door number input allows negative values - add min validation
- `components/user-form.tsx:126-128`: User ID generation on client side - should be server-generated for security
- `components/user-form.tsx:199-207`: PIN stored in plain text in state - consider encryption or secure handling
- `components/operator-form.tsx:417-422`: Password/PIN field with no strength requirements or validation

### No CSRF Protection
- All form submissions lack CSRF tokens - implement CSRF protection for state-changing operations

### Missing Authentication Checks
- Form components have no authentication/authorization checks - add role-based access control
- `components/user-form.tsx:725-730`, `components/door-form.tsx:171-175`: Direct console.log of sensitive data

### XSS Vulnerabilities
- No explicit input sanitization on text inputs throughout forms - implement input sanitization

## Architecture Issues

### Interface Definitions in Components
- `components/door-form.tsx:13-17`: `DoorFormProps` interface should be in shared-types/
- `components/user-form.tsx:14-18`: `UserFormProps` interface should be in shared-types/
- `components/operator-form.tsx:15-56`: Multiple core interfaces (`PermissionMatrix`, `MonitoringPoint`, `OperatorFormData`) defined in component - move to shared-types/

### Missing Core Type Definitions
- Door, Operator, Tenant, TimeZone entities lack proper type definitions in lib/types/index.ts
- Form data interfaces should extend from core entity types for consistency

### Component Prop Types
- Several components use `any` type: `components/door-form.tsx:15`, `components/user-form.tsx:38` - define proper types

## Strapi Issues

### Reserved Field Names
- `lib/types/index.ts:10`: Field name 'status' is reserved in Strapi - rename to 'userStatus'
- `lib/types/index.ts:26`: Field name 'status' is reserved in Strapi - rename to 'credentialStatus'
- `lib/types/index.ts:37`: Field name 'status' is reserved in Strapi - rename to 'doorStatus'
- `lib/types/index.ts:86`: Field name 'status' is reserved in Strapi - rename to 'incidentStatus'

### Identifier Issues
- `lib/types/index.ts:4`: Using 'id' field - should use 'documentId' for Strapi v5 compatibility
- `lib/types/index.ts:21`: Using 'id' field - should use 'documentId' for Strapi v5 compatibility
- `lib/types/index.ts:32`: Using 'id' field - should use 'documentId' for Strapi v5 compatibility
- All other interfaces in lib/types/index.ts use 'id' - systematically replace with 'documentId'

### Timestamp Handling
- `lib/types/index.ts:15-16`: Manual createdAt/updatedAt fields - remove as Strapi handles these automatically

## General Improvements

### Missing Documentation
- No JSDoc comments on any public functions or components
- Complex components like `operator-form.tsx` need inline documentation
- Missing README for component usage patterns

### No Unit Tests
- No test files found in entire codebase
- Critical security components (login, user management) need comprehensive test coverage
- Form validation logic needs unit tests

### Error Handling
- No error boundaries implemented
- Form submissions have no error handling or user feedback
- Network requests lack proper error states

### Performance Issues
- Large select lists (departments, doors) not virtualized - implement virtual scrolling for lists > 50 items
- No memoization of expensive computations in `operator-form.tsx:158-166`

### Accessibility
- Missing aria-labels on interactive elements
- Form validation errors not announced to screen readers
- No keyboard navigation testing evident

### Code Organization
- Components folder lacks clear structure - suggest organizing by feature (users/, doors/, access/)
- Mixing UI components with business logic - separate presentation and container components