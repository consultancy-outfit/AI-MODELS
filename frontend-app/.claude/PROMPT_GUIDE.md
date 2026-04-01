# Prompt Guide: Efficient Token Usage

This guide shows how to work efficiently with your COSMONYX-BE-001 project using specialized agents and skills, minimizing token consumption.

## Domain-Specific Tasks

### Accounts Domain

**Good:**
```
Use the accounts agent to add a new endpoint for beneficiary management
```

**Bad:**
```
Add a new endpoint for beneficiary management
```

**Why:** The accounts agent will only read `apps/accounts/` and relevant shared files, not the entire project.

### Transactions Domain

**Good:**
```
Use the transactions agent to update the state machine for new status
```

**Bad:**
```
Update the transaction state machine to add a new status
```

**Why:** The transactions agent focuses on transaction logic, state machines, and ledger operations.

### User Account Domain

**Good:**
```
Use the user-account agent to fix the JWT token validation issue
```

**Bad:**
```
Fix the JWT token validation issue
```

**Why:** The user-account agent handles authentication, company management, and KYC logic.

### Database Changes

**Good:**
```
Use the database agent to add a new table for audit logs
```

**Bad:**
```
Create a new database table for audit logs
```

**Why:** The database agent understands Drizzle ORM patterns and migration workflows.

## Cross-Service Changes

### Adding New Features

**Good:**
```
Use the add-microservice skill to create a new service called 'payments'
```

**Bad:**
```
Create a new microservice called payments following the project structure
```

**Why:** The add-microservice skill scaffolds the entire microservice following project patterns.

### Adding Controllers

**Good:**
```
Use the add-nestjs-controller skill to add a ReportsController with getReports endpoint
```

**Bad:**
```
Add a ReportsController with a getReports endpoint
```

**Why:** The skill creates controller, DTOs, and service methods following project conventions.

## API Development

**Good:**
```
Use the add-api-endpoint skill to add a GET_ACCOUNTS_BY_STATUS endpoint in the accounts service
```

**Bad:**
```
Add a GET_ACCOUNTS_BY_STATUS endpoint to the accounts service
```

**Why:** The skill handles message patterns, gateway routing, and proper DTOs.

## Database Schema Changes

**Good:**
```
Use the add-database-schema skill to add a new TransactionAudit schema
```

**Bad:**
```
Add a new TransactionAudit table to the database
```

**Why:** The skill creates proper Drizzle schema with base fields and TypeScript types.

## Testing

**Writing Tests**

**Good:**
```
Use the testing agent to write tests for the AccountsService.getAccounts method
```

**Bad:**
```
Write tests for the getAccounts method in AccountsService
```

**Why:** The testing agent knows the project's test patterns and conventions.

**Running Tests**

**Good:**
```
Use the run-tests skill to execute tests for AccountsController
```

**Bad:**
```
Run the tests for AccountsController
```

**Why:** The skill runs only the relevant test file, not the entire suite.

## Debugging

**Good:**
```
Use the debug-service skill to investigate the TransactionService issue
```

**Bad:**
```
Debug the TransactionService problem
```

**Why:** The debug-service skill reads only the service and related files, not the entire project.

## Deployment

**Good:**
```
Use the deploy-service skill to deploy the transactions microservice
```

**Bad:**
```
Deploy the transactions microservice
```

**Why:** The skill handles GitHub Actions workflow and proper deployment steps.

## Combined Workflows

### Adding a New Feature End-to-End

```
Use the database agent to add a new PaymentMethod table
Use the add-nestjs-controller skill to add PaymentMethodsController
Use the add-api-endpoint skill to add GET_PAYMENT_METHODS endpoint
Use the testing agent to write tests for the new endpoints
```

### Fixing a Bug

```
Use the transactions agent to investigate the transaction status issue
Use the debug-service skill to debug the TransactionStateMachineHelper
```

### Database Migration

```
Use the database agent to add a new schema for UserPreferences
Use the migration agent to generate and apply the migration
```

## General Best Practices

1. **Always specify the agent/skill**: "Use the [agent/skill] to [task]"
2. **Be specific about the domain**: Mention the relevant microservice or module
3. **Use path references**: Reference specific files when possible
4. **Avoid generic prompts**: They will read the entire project and waste tokens
5. **Chain tasks appropriately**: Use multiple agents/skills for complex workflows

## Example Scenarios

### Scenario 1: Adding a New Feature

**Inefficient (reads entire project):**
```
Add support for recurring payments to the system
```

**Efficient (token-optimized):**
```
Use the database agent to add RecurringPayment schema
Use the add-nestjs-controller skill to add RecurringPaymentsController to transactions app
Use the add-api-endpoint skill to add message pattern GET_RECURRING_PAYMENTS
Use the testing agent to write tests for the new endpoints
```

### Scenario 2: Debugging an Issue

**Inefficient (reads entire project):**
```
The transaction is getting stuck in KYT_PENDING status
```

**Efficient (token-optimized):**
```
Use the transactions agent to investigate why transactions are stuck in KYT_PENDING status
Use the debug-service skill to debug the TransactionStateMachineHelper.handleSideEffects method
```

### Scenario 3: Running Tests

**Inefficient (runs full suite):**
```
Run the tests
```

**Efficient (token-optimized):**
```
Use the run-tests skill to execute tests for AccountsController
```

## Remember

- **Agents** are for domain-specific work (read only relevant files)
- **Skills** are for common tasks (create new features, debug, deploy)
- **Rules** load automatically when matching files are opened
- **.ignored** excludes large folders from indexing

By following these patterns, you can work efficiently while minimizing token consumption.
